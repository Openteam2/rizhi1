import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
  randomUUID,
} from "node:crypto";
import { createReadStream } from "node:fs";
import { mkdir, readFile, stat, unlink, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { fileURLToPath } from "node:url";

const ROOT = path.dirname(fileURLToPath(import.meta.url));
try {
  process.loadEnvFile?.(path.join(ROOT, ".env"));
} catch (caught) {
  if (caught?.code !== "ENOENT") {
    console.warn(`无法读取 .env：${caught.message}`);
  }
}
const packageInfo = JSON.parse(
  await readFile(path.join(ROOT, "package.json"), "utf8"),
);
const APP_VERSION = String(packageInfo.version || "0.0.0");
const APP_STARTED_AT = new Date().toISOString();
const PUBLIC_DIR = path.join(ROOT, "public");
const DATA_DIR = process.env.STUDY_DATA_DIR || path.join(ROOT, "data");
const ASSET_DIR = path.join(DATA_DIR, "assets");
const DB_PATH = process.env.STUDY_DB_PATH || path.join(DATA_DIR, "study.db");
const SECRET_KEY_PATH =
  process.env.STUDY_SECRET_KEY_PATH || path.join(DATA_DIR, "ai-secret.key");
const PORT = Number(process.env.PORT || 4173);
const HOST = process.env.HOST || "127.0.0.1";
const APP_AUTHOR = "椿与岸";
const APP_EMAIL = "L671456971@gmail.com";
const GITHUB_REPOSITORY =
  process.env.GITHUB_REPOSITORY || "Openteam2/rizhi1";
const GITHUB_DEFAULT_BRANCH =
  process.env.GITHUB_DEFAULT_BRANCH || "main";
const GITHUB_API_BASE =
  process.env.GITHUB_API_BASE || "https://api.github.com";
const GITHUB_TOKEN = String(process.env.GITHUB_TOKEN || "").trim();
const APP_COMMIT_SHA = String(process.env.APP_COMMIT_SHA || "").trim();
const UPDATE_CACHE_TTL_MS = 10 * 60 * 1000;

await mkdir(DATA_DIR, { recursive: true });
await mkdir(ASSET_DIR, { recursive: true });
await mkdir(path.dirname(SECRET_KEY_PATH), { recursive: true });
const secretKey = await loadSecretKey();

const db = new DatabaseSync(DB_PATH);
db.exec(`
  PRAGMA journal_mode = WAL;
  PRAGMA busy_timeout = 5000;

  CREATE TABLE IF NOT EXISTS daily_notes (
    id TEXT PRIMARY KEY,
    note_date TEXT NOT NULL UNIQUE,
    body TEXT NOT NULL,
    tags_json TEXT NOT NULL DEFAULT '[]',
    ai_digest_json TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_daily_notes_date ON daily_notes(note_date);

  CREATE TABLE IF NOT EXISTS app_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS stored_assets (
    id TEXT PRIMARY KEY,
    note_date TEXT,
    kind TEXT NOT NULL,
    original_name TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    stored_name TEXT NOT NULL,
    size INTEGER NOT NULL,
    created_at TEXT NOT NULL,
    title TEXT NOT NULL DEFAULT '',
    summary TEXT NOT NULL DEFAULT '',
    key_info TEXT NOT NULL DEFAULT '',
    source TEXT NOT NULL DEFAULT '',
    alt_text TEXT NOT NULL DEFAULT ''
  );

  CREATE INDEX IF NOT EXISTS idx_stored_assets_note
    ON stored_assets(note_date, created_at);
`);

const assetColumnNames = new Set(
  db.prepare("PRAGMA table_info(stored_assets)").all().map((row) => row.name),
);
for (const [column, definition] of [
  ["title", "TEXT NOT NULL DEFAULT ''"],
  ["summary", "TEXT NOT NULL DEFAULT ''"],
  ["key_info", "TEXT NOT NULL DEFAULT ''"],
  ["source", "TEXT NOT NULL DEFAULT ''"],
  ["alt_text", "TEXT NOT NULL DEFAULT ''"],
]) {
  if (!assetColumnNames.has(column)) {
    db.exec(`ALTER TABLE stored_assets ADD COLUMN ${column} ${definition}`);
  }
}

const selectAllNotes = db.prepare(
  "SELECT * FROM daily_notes ORDER BY note_date ASC",
);
const selectNote = db.prepare("SELECT * FROM daily_notes WHERE note_date = ?");
const getSetting = db.prepare("SELECT value FROM app_settings WHERE key = ?");
const setSetting = db.prepare(`
  INSERT INTO app_settings (key, value) VALUES (?, ?)
  ON CONFLICT(key) DO UPDATE SET value = excluded.value
`);
const deleteSetting = db.prepare("DELETE FROM app_settings WHERE key = ?");
const upsertNote = db.prepare(`
  INSERT INTO daily_notes (
    id, note_date, body, tags_json, ai_digest_json, created_at, updated_at
  ) VALUES (?, ?, ?, ?, NULL, ?, ?)
  ON CONFLICT(note_date) DO UPDATE SET
    body = excluded.body,
    tags_json = excluded.tags_json,
    updated_at = excluded.updated_at
`);
const updateDigest = db.prepare(`
  UPDATE daily_notes
  SET ai_digest_json = ?, updated_at = ?
  WHERE note_date = ?
`);
const selectAssetsForNote = db.prepare(`
  SELECT * FROM stored_assets
  WHERE note_date = ? AND kind != 'hero'
  ORDER BY created_at ASC
`);
const selectAsset = db.prepare("SELECT * FROM stored_assets WHERE id = ?");
const insertAsset = db.prepare(`
  INSERT INTO stored_assets (
    id, note_date, kind, original_name, mime_type, stored_name, size, created_at,
    title, summary, key_info, source, alt_text
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);
const updateAssetMetadata = db.prepare(`
  UPDATE stored_assets
  SET title = ?, summary = ?, key_info = ?, source = ?, alt_text = ?
  WHERE id = ?
`);
const deleteAssetRow = db.prepare("DELETE FROM stored_assets WHERE id = ?");
const deleteAllNoteAssets = db.prepare(
  "DELETE FROM stored_assets WHERE note_date = ?",
);
const deleteNoteRow = db.prepare("DELETE FROM daily_notes WHERE note_date = ?");

const environmentApiKey =
  process.env.AI_API_KEY ||
  process.env.OPENAI_API_KEY ||
  process.env.DEEPSEEK_API_KEY ||
  "";
const environmentUsesDeepSeek = Boolean(
  process.env.DEEPSEEK_API_KEY &&
    !process.env.AI_API_KEY &&
    !process.env.OPENAI_API_KEY,
);
const defaultBaseUrl =
  process.env.AI_BASE_URL ||
  process.env.OPENAI_BASE_URL ||
  process.env.DEEPSEEK_BASE_URL ||
  (environmentUsesDeepSeek
    ? "https://api.deepseek.com"
    : "https://api.openai.com/v1");
const defaultModel =
  process.env.AI_MODEL ||
  process.env.OPENAI_MODEL ||
  process.env.DEEPSEEK_MODEL ||
  (environmentUsesDeepSeek ? "deepseek-chat" : "gpt-4.1-mini");
const persistedApiKey = decryptSecret(
  readSetting("ai_api_key_encrypted") || "",
);
const storedBaseUrl = normalizeBaseUrl(
  readSetting("ai_base_url") || defaultBaseUrl,
);
const storedModel = readSetting("ai_model") || defaultModel;
const initialProvider =
  normalizeProvider(readSetting("ai_provider")) ||
  inferProvider(storedBaseUrl, storedModel);
const providerDefaults = getProviderDefaults(initialProvider);
const initialBaseUrl = providerDefaults
  ? providerDefaults.baseUrl
  : storedBaseUrl;
const initialModel = normalizeModel(storedModel, initialProvider);

const aiConfig = {
  provider: initialProvider,
  baseUrl: initialBaseUrl,
  model: initialModel,
  apiKey: environmentApiKey || persistedApiKey || "",
  keySource:
    environmentApiKey
      ? "environment"
      : persistedApiKey
        ? "saved"
        : "session",
};

setSetting.run("ai_provider", aiConfig.provider);
setSetting.run("ai_base_url", aiConfig.baseUrl);
setSetting.run("ai_model", aiConfig.model);

function readSetting(key) {
  return getSetting.get(key)?.value ?? null;
}

function normalizeProvider(value) {
  return ["openai", "deepseek", "custom"].includes(value) ? value : null;
}

function getProviderDefaults(provider) {
  if (provider === "deepseek") {
    return {
      baseUrl: "https://api.deepseek.com",
      model: "deepseek-chat",
    };
  }
  if (provider === "openai") {
    return {
      baseUrl: "https://api.openai.com/v1",
      model: "gpt-4.1-mini",
    };
  }
  return null;
}

function inferProvider(baseUrl, model) {
  const host = safeHostname(baseUrl);
  if (
    host === "api.deepseek.com" ||
    host.endsWith(".deepseek.com") ||
    /^deepseek-/i.test(model)
  ) {
    return "deepseek";
  }
  if (host === "api.openai.com" || /^gpt-/i.test(model)) return "openai";
  return "custom";
}

function safeHostname(value) {
  try {
    return new URL(value).hostname.toLowerCase();
  } catch {
    return "";
  }
}

function normalizeBaseUrl(value) {
  let normalized = String(value || "").trim().replace(/\/+$/, "");
  normalized = normalized.replace(/\/chat\/completions$/i, "");

  const host = safeHostname(normalized);
  if (host === "api.deepseek.com") {
    const pathName = new URL(normalized).pathname.replace(/\/+$/, "");
    if (!pathName) return "https://api.deepseek.com";
  }
  if (host === "api.openai.com") {
    const pathName = new URL(normalized).pathname.replace(/\/+$/, "");
    if (!pathName) return "https://api.openai.com/v1";
  }
  return normalized;
}

function normalizeModel(model, provider) {
  const value = String(model || "").trim();
  if (
    provider === "deepseek" &&
    !/^deepseek-(chat|reasoner)$/i.test(value)
  ) {
    return "deepseek-chat";
  }
  if (provider === "openai" && /^deepseek-/i.test(value)) {
    return "gpt-4.1-mini";
  }
  return value || getProviderDefaults(provider)?.model || "gpt-4.1-mini";
}

async function loadSecretKey() {
  try {
    const encoded = (await readFile(SECRET_KEY_PATH, "utf8")).trim();
    const key = Buffer.from(encoded, "base64");
    if (key.length === 32) return key;
  } catch {
    // The key file is created on first run.
  }

  const key = randomBytes(32);
  try {
    await writeFile(SECRET_KEY_PATH, key.toString("base64"), {
      encoding: "utf8",
      flag: "wx",
      mode: 0o600,
    });
    return key;
  } catch {
    const encoded = (await readFile(SECRET_KEY_PATH, "utf8")).trim();
    return Buffer.from(encoded, "base64");
  }
}

function encryptSecret(value) {
  if (!value) return "";
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", secretKey, iv);
  const encrypted = Buffer.concat([
    cipher.update(value, "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();
  return [
    "v1",
    iv.toString("base64"),
    tag.toString("base64"),
    encrypted.toString("base64"),
  ].join(":");
}

function decryptSecret(value) {
  if (!value?.startsWith("v1:")) return "";
  try {
    const [, ivValue, tagValue, encryptedValue] = value.split(":");
    const decipher = createDecipheriv(
      "aes-256-gcm",
      secretKey,
      Buffer.from(ivValue, "base64"),
    );
    decipher.setAuthTag(Buffer.from(tagValue, "base64"));
    return Buffer.concat([
      decipher.update(Buffer.from(encryptedValue, "base64")),
      decipher.final(),
    ]).toString("utf8");
  } catch {
    return "";
  }
}

function rowToNote(row) {
  if (!row) return null;
  const allAssets = selectAssetsForNote
    .all(row.note_date)
    .filter((asset) => asset.kind !== "wallpaper");
  const wallpaperId = readSetting(`note_wallpaper:${row.note_date}`);
  const wallpaperRow = wallpaperId ? selectAsset.get(wallpaperId) : null;
  const storedWallpaperPosition = safeJson(
    readSetting(`note_wallpaper_position:${row.note_date}`),
    {},
  );
  const storedWallpaperStyle = safeJson(
    readSetting(`note_wallpaper_style:${row.note_date}`),
    {},
  );
  const note = {
    id: row.id,
    date: row.note_date,
    body: row.body,
    tags: safeJson(row.tags_json, []),
    aiDigest: safeJson(row.ai_digest_json, null),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    attachments: allAssets.map(assetToPublic),
    wallpaper: wallpaperRow ? assetToPublic(wallpaperRow) : null,
    wallpaperPosition: {
      x: clampNumber(storedWallpaperPosition.x, 0, 100, 50),
      y: clampNumber(storedWallpaperPosition.y, 0, 100, 50),
    },
    wallpaperStyle: {
      overlay: clampNumber(storedWallpaperStyle.overlay, 0, 90, 78),
      blur: clampNumber(storedWallpaperStyle.blur, 0, 14, 5),
      tone: ["none", "mono", "cool", "warm"].includes(
        storedWallpaperStyle.tone,
      )
        ? storedWallpaperStyle.tone
        : "none",
    },
  };
  note.digestStale = Boolean(
    note.aiDigest && note.aiDigest.sourceHash !== hashSource(note),
  );
  return note;
}

function assetToPublic(row) {
  return {
    id: row.id,
    name: row.original_name,
    mimeType: row.mime_type,
    size: row.size,
    kind: row.kind,
    createdAt: row.created_at,
    url: `/api/assets/${row.id}`,
    title: row.title || "",
    summary: row.summary || "",
    keyInfo: row.key_info || "",
    source: row.source || "",
    altText: row.alt_text || "",
  };
}

function safeJson(value, fallback) {
  if (!value) return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

const preferenceDefaults = {
  hero: {
    style: "glass",
    height: "standard",
    overlay: 24,
    positionX: 50,
    positionY: 50,
    tone: "none",
  },
  transitions: true,
  stylePreset: "standard",
  editorSplitRatio: 48,
  editor: {
    fontFamily: "serif",
    fontSize: 16,
    lineHeight: 2,
  },
  customTags: [],
};

function readPreferences() {
  const stored = safeJson(readSetting("preferences_json"), {});
  const hero = {
    ...preferenceDefaults.hero,
    ...(stored.hero || {}),
  };
  const editor = {
    ...preferenceDefaults.editor,
    ...(stored.editor || {}),
  };
  const heroAssetId = readSetting("hero_asset_id") || null;
  const heroAsset = heroAssetId ? selectAsset.get(heroAssetId) : null;
  return {
    hero: {
      ...hero,
      style: ["glass", "paper", "dark"].includes(hero.style)
        ? hero.style
        : "glass",
      height: ["compact", "standard", "tall"].includes(hero.height)
        ? hero.height
        : "standard",
      overlay: clampNumber(hero.overlay, 0, 85, 24),
      positionX: clampNumber(hero.positionX, 0, 100, 50),
      positionY: clampNumber(hero.positionY, 0, 100, 50),
      tone: ["none", "mono", "cool", "warm"].includes(hero.tone)
        ? hero.tone
        : "none",
    },
    transitions: stored.transitions !== false,
    editorSplitRatio: clampNumber(
      stored.editorSplitRatio,
      32,
      68,
      48,
    ),
    stylePreset: ["standard", "brand", "data", "review"].includes(
      stored.stylePreset,
    )
      ? stored.stylePreset
      : "standard",
    editor: {
      fontFamily: ["serif", "sans", "mono"].includes(editor.fontFamily)
        ? editor.fontFamily
        : "serif",
      fontSize: clampNumber(editor.fontSize, 13, 24, 16),
      lineHeight: clampNumber(editor.lineHeight, 1.5, 2.4, 2),
    },
    customTags: normalizeCustomTags(stored.customTags || []),
    heroImageUrl: heroAsset
      ? `/api/hero-image?v=${encodeURIComponent(heroAsset.created_at)}`
      : null,
    hasHeroImage: Boolean(heroAsset),
  };
}

function normalizeCustomTags(tags) {
  if (!Array.isArray(tags)) return [];
  return [
    ...new Set(
      tags
        .filter((tag) => typeof tag === "string")
        .map((tag) => tag.trim().replace(/^#/, ""))
        .filter(Boolean)
        .map((tag) => tag.slice(0, 20)),
    ),
  ].slice(0, 30);
}

function savePreferences(payload) {
  const current = readPreferences();
  const next = {
    hero: {
      style:
        payload?.hero?.style !== undefined
          ? payload.hero.style
          : current.hero.style,
      height:
        payload?.hero?.height !== undefined
          ? payload.hero.height
          : current.hero.height,
      overlay: clampNumber(
        payload?.hero?.overlay,
        0,
        85,
        current.hero.overlay,
      ),
      positionX: clampNumber(
        payload?.hero?.positionX,
        0,
        100,
        current.hero.positionX,
      ),
      positionY: clampNumber(
        payload?.hero?.positionY,
        0,
        100,
        current.hero.positionY,
      ),
      tone:
        ["none", "mono", "cool", "warm"].includes(payload?.hero?.tone)
          ? payload.hero.tone
          : current.hero.tone,
    },
    transitions:
      typeof payload?.transitions === "boolean"
        ? payload.transitions
        : current.transitions,
    editorSplitRatio: clampNumber(
      payload?.editorSplitRatio,
      32,
      68,
      current.editorSplitRatio,
    ),
    stylePreset:
      payload?.stylePreset !== undefined &&
      ["standard", "brand", "data", "review"].includes(payload.stylePreset)
        ? payload.stylePreset
        : current.stylePreset,
    editor: {
      fontFamily:
        payload?.editor?.fontFamily !== undefined
          ? payload.editor.fontFamily
          : current.editor.fontFamily,
      fontSize: clampNumber(
        payload?.editor?.fontSize,
        13,
        24,
        current.editor.fontSize,
      ),
      lineHeight: clampNumber(
        payload?.editor?.lineHeight,
        1.5,
        2.4,
        current.editor.lineHeight,
      ),
    },
    customTags:
      payload?.customTags !== undefined
        ? normalizeCustomTags(payload.customTags)
        : current.customTags,
  };

  setSetting.run("preferences_json", JSON.stringify(next));
  return readPreferences();
}

function clampNumber(value, min, max, fallback) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.min(max, Math.max(min, number));
}

async function storeAsset({
  noteDate = null,
  kind,
  name,
  mimeType,
  dataBase64,
  maxBytes,
  metadata = {},
}) {
  const normalizedMime = String(mimeType || "application/octet-stream")
    .split(";")[0]
    .trim()
    .slice(0, 120);
  const encoded = String(dataBase64 || "").replace(
    /^data:[^;]+;base64,/i,
    "",
  );
  const buffer = Buffer.from(encoded, "base64");
  if (!buffer.length) throw new Error("文件内容为空");
  if (buffer.length > maxBytes) {
    throw new Error(`文件不能超过 ${Math.round(maxBytes / 1024 / 1024)} MB`);
  }

  const id = randomUUID();
  const cleanName =
    path
      .basename(String(name || "未命名文件"))
      .replace(/[\u0000-\u001f<>:"/\\|?*]/g, "_")
      .slice(0, 180) || "未命名文件";
  const title =
    String(metadata.title || path.parse(cleanName).name || "图片")
      .trim()
      .slice(0, 120) || "图片";
  const summary = String(metadata.summary || "").trim().slice(0, 600);
  const keyInfo = String(metadata.keyInfo || "").trim().slice(0, 1200);
  const source = String(metadata.source || "").trim().slice(0, 200);
  const altText =
    String(metadata.altText || summary || title).trim().slice(0, 500);
  if (
    kind === "attachment" &&
    /^image\/(jpeg|png|webp|gif)$/i.test(normalizedMime) &&
    !summary
  ) {
    throw new Error("图片必须填写内容摘要");
  }
  const extension =
    path.extname(cleanName).slice(0, 16) ||
    extensionForMime(normalizedMime);
  const storedName = `${id}${extension}`;
  const filePath = path.join(ASSET_DIR, storedName);
  await writeFile(filePath, buffer, { mode: 0o600 });

  const createdAt = new Date().toISOString();
  insertAsset.run(
    id,
    noteDate,
    kind,
    cleanName,
    normalizedMime,
    storedName,
    buffer.length,
    createdAt,
    title,
    summary,
    keyInfo,
    source,
    altText,
  );
  return selectAsset.get(id);
}

function extensionForMime(mimeType) {
  const extensions = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/gif": ".gif",
    "audio/webm": ".webm",
    "audio/ogg": ".ogg",
    "audio/mp4": ".m4a",
    "audio/mpeg": ".mp3",
    "text/plain": ".txt",
    "application/pdf": ".pdf",
  };
  return extensions[mimeType] || "";
}

async function deleteAssetFile(row) {
  if (!row?.stored_name) return;
  try {
    await unlink(path.join(ASSET_DIR, path.basename(row.stored_name)));
  } catch {
    // Missing files should not block metadata deletion.
  }
}

function hashSource(note) {
  const source = JSON.stringify({
    date: note.date,
    tags: [...note.tags].sort(),
    body: note.body,
  });
  return createHash("sha256").update(source).digest("hex");
}

function isValidDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

function normalizeTags(tags) {
  if (!Array.isArray(tags)) return [];
  return [
    ...new Set(
      tags
        .filter((tag) => typeof tag === "string")
        .map((tag) => tag.trim())
        .filter(Boolean)
        .map((tag) => tag.slice(0, 20)),
    ),
  ].slice(0, 10);
}

function json(res, statusCode, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(body),
    "Cache-Control": "no-store",
  });
  res.end(body);
}

function error(res, statusCode, message, code = "REQUEST_ERROR") {
  json(res, statusCode, { error: { code, message } });
}

async function readJson(req, maxBytes = 2 * 1024 * 1024) {
  const chunks = [];
  let size = 0;

  for await (const chunk of req) {
    size += chunk.length;
    if (size > maxBytes) {
      const err = new Error("请求内容过大");
      err.statusCode = 413;
      throw err;
    }
    chunks.push(chunk);
  }

  if (chunks.length === 0) return {};
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    const err = new Error("请求 JSON 格式无效");
    err.statusCode = 400;
    throw err;
  }
}

async function serveStoredAsset(req, res, id) {
  const row = selectAsset.get(id);
  if (!row) return error(res, 404, "文件不存在", "ASSET_NOT_FOUND");

  const filePath = path.join(ASSET_DIR, path.basename(row.stored_name));
  try {
    const info = await stat(filePath);
    const safeInline =
      /^image\/(jpeg|png|webp|gif)$|^audio\/|^video\/|^application\/pdf$/i.test(
        row.mime_type,
      );
    res.writeHead(200, {
      "Content-Type": safeInline
        ? row.mime_type
        : "application/octet-stream",
      "Content-Length": info.size,
      "Content-Disposition": `${safeInline ? "inline" : "attachment"}; filename*=UTF-8''${encodeURIComponent(row.original_name)}`,
      "Cache-Control": row.kind === "hero" ? "private, max-age=3600" : "private, no-cache",
      "X-Content-Type-Options": "nosniff",
    });
    if (req.method === "HEAD") return res.end();
    createReadStream(filePath).pipe(res);
  } catch {
    return error(res, 404, "文件内容不存在", "ASSET_FILE_MISSING");
  }
}

function saveNote(date, body, tags) {
  const now = new Date().toISOString();
  const existing = rowToNote(selectNote.get(date));
  const normalizedTags = normalizeTags(tags);

  upsertNote.run(
    existing?.id || randomUUID(),
    date,
    body,
    JSON.stringify(normalizedTags),
    existing?.createdAt || now,
    now,
  );

  return rowToNote(selectNote.get(date));
}

function extractAssistantText(payload) {
  const content = payload?.choices?.[0]?.message?.content;
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content
      .map((part) => (typeof part === "string" ? part : part?.text || ""))
      .join("");
  }
  if (typeof payload?.output_text === "string") return payload.output_text;
  return "";
}

function parseDigest(content) {
  const cleaned = content
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "");
  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");
  const candidate =
    firstBrace >= 0 && lastBrace > firstBrace
      ? cleaned.slice(firstBrace, lastBrace + 1)
      : cleaned;

  let parsed;
  try {
    parsed = JSON.parse(candidate);
  } catch {
    throw new Error("模型没有返回可解析的 JSON");
  }

  if (!Array.isArray(parsed.points)) {
    throw new Error("模型返回结果缺少 points 列表");
  }

  const points = [
    ...new Set(
      parsed.points
        .filter((point) => typeof point === "string")
        .map((point) => point.trim().replace(/^[-*•]\s*/, ""))
        .filter(Boolean)
        .map((point) => point.slice(0, 160)),
    ),
  ].slice(0, 8);

  if (points.length === 0) {
    throw new Error("模型没有产出有效要点");
  }

  return points;
}

function providerLabel(config = aiConfig) {
  if (config.provider === "deepseek") return "DeepSeek";
  if (config.provider === "openai") return "OpenAI";
  return "AI 服务";
}

function sleep(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function callChatCompletion(messages, options = {}) {
  const config = options.config || aiConfig;
  if (!config.apiKey) {
    const err = new Error("请先在设置中配置 API Key");
    err.statusCode = 401;
    err.code = "AI_KEY_MISSING";
    throw err;
  }

  const baseUrl = normalizeBaseUrl(config.baseUrl);
  const endpoint = `${baseUrl}/chat/completions`;
  const requestBody = {
    model: config.model,
    messages,
    stream: false,
  };

  // DeepSeek reasoner does not accept sampling parameters in every API version.
  if (!/^deepseek-reasoner/i.test(config.model)) {
    requestBody.temperature = 0.2;
  }

  const maxRetries = options.retries ?? 2;
  const label = providerLabel(config);

  for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
    let response;
    try {
      response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.apiKey}`,
        },
        body: JSON.stringify(requestBody),
        signal: AbortSignal.timeout(options.timeout || 120_000),
      });
    } catch (fetchError) {
      if (attempt < maxRetries) {
        await sleep(500 * 2 ** attempt);
        continue;
      }

      const causeCode =
        fetchError?.cause?.code || fetchError?.code || fetchError?.name || "";
      const detail =
        causeCode === "ENOTFOUND"
          ? "域名解析失败"
          : causeCode === "ETIMEDOUT" || fetchError?.name === "TimeoutError"
            ? "连接超时"
            : causeCode === "ECONNRESET"
              ? "连接被重置"
              : causeCode
                ? `网络错误 ${causeCode}`
                : "网络不可用";
      const err = new Error(
        `无法连接 ${label}：${detail}。请检查网络、代理或接口地址（已自动重试 ${maxRetries} 次）`,
      );
      err.statusCode = 502;
      err.code = "AI_NETWORK_ERROR";
      throw err;
    }

    if (!response.ok) {
      const raw = await response.text();
      let payload = null;
      try {
        payload = JSON.parse(raw);
      } catch {
        payload = null;
      }
      const details =
        payload?.error?.message || payload?.message || raw.slice(0, 260) || "";
      const lowerDetails = String(details).toLowerCase();
      const retryableStatus = [408, 429, 500, 502, 503, 504].includes(
        response.status,
      );
      if (retryableStatus && attempt < maxRetries) {
        const retryAfter = Number(response.headers.get("retry-after"));
        const delay = Number.isFinite(retryAfter) && retryAfter > 0
          ? Math.min(retryAfter * 1000, 8000)
          : 500 * 2 ** attempt;
        await sleep(delay);
        continue;
      }

      let message;
      if (response.status === 401) {
        message = `${label} 认证失败，请检查 API Key`;
      } else if (response.status === 402) {
        message = `${label} 账户余额不足，请先在服务商控制台充值`;
      } else if (
        lowerDetails.includes("model not exist") ||
        lowerDetails.includes("model_not_found") ||
        lowerDetails.includes("unknown model")
      ) {
        message = `${label} 模型“${config.model}”不可用，请使用 deepseek-chat 或 deepseek-reasoner`;
      } else if (response.status === 404) {
        message = `${label} 接口地址或模型不存在（404）${details ? `：${details.slice(0, 180)}` : ""}`;
      } else if (response.status === 429) {
        message = `${label} 请求过于频繁或额度不足，请稍后重试`;
      } else {
        message = `${label} 返回错误（${response.status}）${details ? `：${details.slice(0, 180)}` : ""}`;
      }

      const err = new Error(message);
      err.statusCode = response.status >= 400 ? response.status : 502;
      err.code = "AI_PROVIDER_ERROR";
      throw err;
    }

    let payload;
    try {
      payload = await response.json();
    } catch {
      if (attempt < maxRetries) {
        await sleep(500 * 2 ** attempt);
        continue;
      }
      const err = new Error(`${label} 返回了无法解析的响应`);
      err.statusCode = 502;
      err.code = "AI_BAD_RESPONSE";
      throw err;
    }

    const content = extractAssistantText(payload);
    if (!content) {
      const err = new Error(`${label} 返回了空内容`);
      err.statusCode = 502;
      err.code = "AI_EMPTY_RESPONSE";
      throw err;
    }

    return { content, payload };
  }

  const err = new Error(`${label} 请求失败`);
  err.statusCode = 502;
  err.code = "AI_NETWORK_ERROR";
  throw err;
}

async function requestDigest(note, correction = null) {
  const systemPrompt = `你是学习笔记提炼器。只能依据用户提供的当日学习记录生成要点，不得补充事实或提出无关建议。

要求：
1. 输出 1～8 条中文要点；
2. 每条只表达一个知识点，保留术语、数字和结论；
3. 删除重复、空泛描述和过程性闲聊；
4. 不改变原文含义；
5. 只输出 JSON，不要 Markdown 代码块或额外解释。

输出格式：
{"date":"YYYY-MM-DD","points":["要点1","要点2"]}`;

  const messages = [
    { role: "system", content: systemPrompt },
    {
      role: "user",
      content: JSON.stringify({
        date: note.date,
        tags: note.tags,
        body: note.body,
      }),
    },
  ];

  if (correction) {
    messages.push({
      role: "user",
      content: `上次输出无效：${correction}。请重新输出严格符合约定的 JSON。`,
    });
  }

  const { content } = await callChatCompletion(messages);
  return parseDigest(content);
}

async function handleAiDigest(res, date) {
  const note = rowToNote(selectNote.get(date));
  if (!note) {
    return error(res, 404, "该日期还没有可提炼的记录", "NOTE_NOT_FOUND");
  }

  let points;
  try {
    points = await requestDigest(note);
  } catch (firstError) {
    if (
      firstError.code === "AI_KEY_MISSING" ||
      firstError.code === "AI_NETWORK_ERROR" ||
      firstError.code === "AI_PROVIDER_ERROR" ||
      firstError.statusCode === 401
    ) {
      throw firstError;
    }
    try {
      points = await requestDigest(note, firstError.message);
    } catch (secondError) {
      secondError.statusCode = secondError.statusCode || 502;
      secondError.code = secondError.code || "AI_BAD_RESPONSE";
      throw secondError;
    }
  }

  return json(res, 200, {
    digest: {
      points,
      generatedAt: new Date().toISOString(),
      sourceHash: hashSource(note),
      model: aiConfig.model,
    },
  });
}

function resolveAiSettings(payload, current) {
  const requestedProvider = normalizeProvider(payload.provider);
  const submittedBaseUrl =
    typeof payload.baseUrl === "string" ? payload.baseUrl.trim() : "";
  const submittedModel =
    typeof payload.model === "string" ? payload.model.trim() : "";
  const provider =
    requestedProvider ||
    inferProvider(
      normalizeBaseUrl(submittedBaseUrl || current.baseUrl),
      submittedModel || current.model,
    );
  const preset = getProviderDefaults(provider);
  const baseUrl = normalizeBaseUrl(
    preset?.baseUrl || submittedBaseUrl || current.baseUrl,
  );
  const model = normalizeModel(
    submittedModel || preset?.model || current.model,
    provider,
  );

  if (!/^https?:\/\//i.test(baseUrl)) {
    throw new Error("API 地址必须以 http:// 或 https:// 开头");
  }
  if (!model) throw new Error("模型名称不能为空");

  const submittedKey =
    typeof payload.apiKey === "string" ? payload.apiKey.trim() : "";
  const sameProvider = provider === current.provider;
  const sameEndpoint = baseUrl === normalizeBaseUrl(current.baseUrl);

  return {
    provider,
    baseUrl: baseUrl.slice(0, 500),
    model: model.slice(0, 100),
    apiKey:
      submittedKey || (sameProvider && sameEndpoint ? current.apiKey : "") || "",
  };
}

function publicAiSettings() {
  return {
    provider: aiConfig.provider,
    baseUrl: aiConfig.baseUrl,
    model: aiConfig.model,
    hasKey: Boolean(aiConfig.apiKey),
    keySource: aiConfig.apiKey ? aiConfig.keySource : null,
  };
}

function normalizeVersion(value) {
  return String(value || "")
    .trim()
    .replace(/^v/i, "")
    .split(/[.+-]/)
    .slice(0, 3)
    .map((part) => Number.parseInt(part, 10) || 0);
}

function compareVersions(left, right) {
  const a = normalizeVersion(left);
  const b = normalizeVersion(right);
  for (let index = 0; index < 3; index += 1) {
    const delta = (a[index] || 0) - (b[index] || 0);
    if (delta !== 0) return delta > 0 ? 1 : -1;
  }
  return 0;
}

async function githubRequest(pathname, { allow404 = false } = {}) {
  const headers = {
    Accept: "application/vnd.github+json",
    "User-Agent": "rizhi-local-update-checker",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  // Tokens come only from the local environment and are never returned by APIs.
  if (GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${GITHUB_TOKEN}`;
  }

  let response;
  try {
    response = await fetch(
      `${GITHUB_API_BASE.replace(/\/+$/, "")}${pathname}`,
      {
        headers,
        signal: AbortSignal.timeout(15_000),
      },
    );
  } catch (caught) {
    const err = new Error(`无法连接 GitHub：${caught.message}`);
    err.statusCode = 503;
    err.code = "UPDATE_CHECK_UNAVAILABLE";
    throw err;
  }

  if (allow404 && response.status === 404) return null;
  if (!response.ok) {
    let details = "";
    try {
      const payload = await response.json();
      details = payload?.message || "";
    } catch {
      details = "";
    }
    const err = new Error(
      response.status === 403 || response.status === 429
        ? `GitHub API 访问受限${GITHUB_TOKEN ? "" : "，请配置 GITHUB_TOKEN"}`
        : `GitHub API 请求失败（${response.status}）${details ? `：${details}` : ""}`,
    );
    err.statusCode = 503;
    err.code = "UPDATE_CHECK_UNAVAILABLE";
    err.rateLimitRemaining = response.headers.get("x-ratelimit-remaining");
    err.rateLimitReset = response.headers.get("x-ratelimit-reset");
    throw err;
  }
  return response.json();
}

function githubRepoPath() {
  const [owner, repository] = GITHUB_REPOSITORY.split("/");
  if (!owner || !repository) {
    const err = new Error("GITHUB_REPOSITORY 必须是 owner/repository 格式");
    err.statusCode = 500;
    err.code = "INVALID_GITHUB_CONFIG";
    throw err;
  }
  return `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repository)}`;
}

let updateCache = null;

async function handleUpdateCheck(res, forceRefresh = false) {
  if (
    !forceRefresh &&
    updateCache &&
    Date.now() - updateCache.checkedAtMs < UPDATE_CACHE_TTL_MS
  ) {
    return json(res, 200, { ...updateCache.payload, cached: true });
  }

  const repoPath = githubRepoPath();
  const repositoryUrl = `https://github.com/${GITHUB_REPOSITORY}`;
  // Prefer release tags, then the remote package version, then the latest commit.
  const release = await githubRequest(`${repoPath}/releases/latest`, {
    allow404: true,
  });
  const latestCommit = await githubRequest(
    `${repoPath}/commits?per_page=1`,
  )
    .then((items) => items?.[0] || null)
    .catch(() => null);

  let latestVersion = "";
  let source = "commit";
  let releaseUrl = repositoryUrl;
  if (release) {
    latestVersion = release.tag_name || release.name || "";
    source = "release";
    releaseUrl = release.html_url || repositoryUrl;
  } else {
    const packagePayload = await githubRequest(
      `${repoPath}/contents/package.json?ref=${encodeURIComponent(GITHUB_DEFAULT_BRANCH)}`,
      { allow404: true },
    );
    if (packagePayload?.content) {
      try {
        const content = Buffer.from(
          String(packagePayload.content).replace(/\s+/g, ""),
          "base64",
        ).toString("utf8");
        const remotePackage = JSON.parse(content);
        latestVersion = remotePackage.version || "";
        source = "package";
      } catch {
        latestVersion = "";
      }
    }
  }

  let hasUpdate = null;
  if (latestVersion) {
    hasUpdate = compareVersions(latestVersion, APP_VERSION) > 0;
  }
  if (
    hasUpdate === false &&
    APP_COMMIT_SHA &&
    latestCommit?.sha &&
    latestCommit.sha !== APP_COMMIT_SHA
  ) {
    hasUpdate = true;
    source = "commit";
  }

  const payload = {
    ok: true,
    status:
      hasUpdate === true
        ? "available"
        : hasUpdate === false
          ? "current"
          : "unknown",
    currentVersion: APP_VERSION,
    latestVersion: latestVersion || null,
    hasUpdate,
    source,
    repository: repositoryUrl,
    repositoryUrl,
    releaseUrl,
    tokenConfigured: Boolean(GITHUB_TOKEN),
    authMode: GITHUB_TOKEN ? "token" : "anonymous",
    notice: GITHUB_TOKEN
      ? ""
      : "未配置 GITHUB_TOKEN，正在使用 GitHub 匿名公共接口；触发频率限制后请配置令牌。",
    latestCommit: latestCommit
      ? {
          sha: latestCommit.sha,
          message: latestCommit.commit?.message || "",
          publishedAt: latestCommit.commit?.committer?.date || "",
          url: latestCommit.html_url || "",
        }
      : null,
    checkedAt: new Date().toISOString(),
  };
  updateCache = { checkedAtMs: Date.now(), payload };
  return json(res, 200, { ...payload, cached: false });
}

function handleSearchApi(res, url) {
  const query = String(url.searchParams.get("q") || "").trim();
  const tag = String(url.searchParams.get("tag") || "").trim();
  const start = String(url.searchParams.get("start") || "");
  const end = String(url.searchParams.get("end") || "");
  const limit = Number(url.searchParams.get("limit") || 20);
  const offset = Number(url.searchParams.get("offset") || 0);

  if (query.length > 100) {
    return error(res, 400, "q 最多 100 个字符", "INVALID_QUERY");
  }
  if (tag.length > 20) {
    return error(res, 400, "tag 最多 20 个字符", "INVALID_TAG");
  }
  if (start && !isValidDate(start)) {
    return error(res, 400, "start 必须是 YYYY-MM-DD", "INVALID_DATE");
  }
  if (end && !isValidDate(end)) {
    return error(res, 400, "end 必须是 YYYY-MM-DD", "INVALID_DATE");
  }
  if (start && end && start > end) {
    return error(res, 400, "start 不能晚于 end", "INVALID_DATE_RANGE");
  }
  if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
    return error(res, 400, "limit 必须是 1 到 100", "INVALID_LIMIT");
  }
  if (!Number.isInteger(offset) || offset < 0 || offset > 10_000) {
    return error(res, 400, "offset 必须是 0 到 10000", "INVALID_OFFSET");
  }

  // Keep filtering server-side so future clients share the same validation rules.
  const needle = query.toLocaleLowerCase("zh-CN");
  const filtered = selectAllNotes
    .all()
    .map(rowToNote)
    .filter((note) => {
      if (start && note.date < start) return false;
      if (end && note.date > end) return false;
      if (tag && !note.tags.includes(tag)) return false;
      if (!needle) return true;
      return [
        note.body,
        ...note.tags,
        ...(note.aiDigest?.points || []),
      ]
        .join("\n")
        .toLocaleLowerCase("zh-CN")
        .includes(needle);
    });

  return json(res, 200, {
    items: filtered.slice(offset, offset + limit),
    total: filtered.length,
    limit,
    offset,
  });
}

function handleStatsApi(res, url) {
  const month = String(url.searchParams.get("month") || "");
  if (month) {
    const match = month.match(/^(\d{4})-(\d{2})$/);
    const monthNumber = match ? Number(match[2]) : 0;
    if (!match || monthNumber < 1 || monthNumber > 12) {
      return error(res, 400, "month 必须是有效的 YYYY-MM", "INVALID_MONTH");
    }
  }
  const notes = selectAllNotes.all().map(rowToNote);
  const scoped = month
    ? notes.filter((note) => note.date.startsWith(`${month}-`))
    : notes;
  const tags = new Map();
  for (const note of scoped) {
    for (const tag of note.tags) {
      tags.set(tag, (tags.get(tag) || 0) + 1);
    }
  }

  return json(res, 200, {
    scope: month || "all",
    totals: {
      records: scoped.length,
      characters: scoped.reduce((sum, note) => sum + note.body.length, 0),
      digestedRecords: scoped.filter((note) => note.aiDigest?.points?.length)
        .length,
      attachments: scoped.reduce(
        (sum, note) => sum + note.attachments.length,
        0,
      ),
    },
    tags: [...tags.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "zh-CN"))
      .slice(0, 20)
      .map(([name, count]) => ({ name, count })),
    days: scoped.map((note) => ({
      date: note.date,
      characters: note.body.length,
      hasDigest: Boolean(note.aiDigest?.points?.length),
    })),
  });
}

function handleMetaApi(res) {
  return json(res, 200, {
    name: "日知",
    version: APP_VERSION,
    author: APP_AUTHOR,
    email: APP_EMAIL,
    repository: `https://github.com/${GITHUB_REPOSITORY}`,
    nodeVersion: process.version,
    startedAt: APP_STARTED_AT,
    uptimeSeconds: Math.floor(process.uptime()),
    updateCheck: {
      tokenConfigured: Boolean(GITHUB_TOKEN),
      authMode: GITHUB_TOKEN ? "token" : "anonymous",
    },
  });
}

async function handleApi(req, res, url) {
  const { pathname } = url;

  if (req.method === "GET" && pathname === "/api/health") {
    return json(res, 200, {
      ok: true,
      storage: "sqlite",
      local: true,
      version: APP_VERSION,
      uptimeSeconds: Math.floor(process.uptime()),
    });
  }

  if (req.method === "GET" && pathname === "/api/meta") {
    return handleMetaApi(res);
  }

  if (req.method === "GET" && pathname === "/api/search") {
    return handleSearchApi(res, url);
  }

  if (req.method === "GET" && pathname === "/api/stats") {
    return handleStatsApi(res, url);
  }

  if (req.method === "POST" && pathname === "/api/update/check") {
    return handleUpdateCheck(
      res,
      url.searchParams.get("refresh") === "1",
    );
  }

  const assetMatch = pathname.match(
    /^\/api\/assets\/([0-9a-f-]{36})$/i,
  );
  if (assetMatch && (req.method === "GET" || req.method === "HEAD")) {
    return serveStoredAsset(req, res, assetMatch[1]);
  }
  if (assetMatch && req.method === "PATCH") {
    const row = selectAsset.get(assetMatch[1]);
    if (!row) return error(res, 404, "文件不存在", "ASSET_NOT_FOUND");
    const payload = await readJson(req);
    const summary =
      payload.summary !== undefined
        ? String(payload.summary || "").trim().slice(0, 600)
        : row.summary;
    if (/^image\/(jpeg|png|webp|gif)$/i.test(row.mime_type) && !summary) {
      return error(res, 400, "图片必须填写内容摘要", "IMAGE_SUMMARY_REQUIRED");
    }
    const title =
      String(payload.title ?? row.title ?? row.original_name)
        .trim()
        .slice(0, 120) || "图片";
    const keyInfo =
      String(payload.keyInfo ?? row.key_info ?? "").trim().slice(0, 1200);
    const source =
      String(payload.source ?? row.source ?? "").trim().slice(0, 200);
    const altText =
      String(payload.altText ?? row.alt_text ?? (summary || title))
        .trim()
        .slice(0, 500);
    updateAssetMetadata.run(
      title,
      summary,
      keyInfo,
      source,
      altText,
      row.id,
    );
    return json(res, 200, assetToPublic(selectAsset.get(row.id)));
  }
  if (assetMatch && req.method === "DELETE") {
    const row = selectAsset.get(assetMatch[1]);
    if (!row) return error(res, 404, "文件不存在", "ASSET_NOT_FOUND");
    if (row.kind === "hero") {
      setSetting.run("hero_asset_id", "");
    }
    deleteAssetRow.run(row.id);
    await deleteAssetFile(row);
    return json(res, 200, { ok: true });
  }

  if (req.method === "GET" && pathname === "/api/hero-image") {
    const heroId = readSetting("hero_asset_id");
    if (!heroId) return error(res, 404, "尚未设置背景图片", "HERO_NOT_SET");
    return serveStoredAsset(req, res, heroId);
  }

  if (req.method === "GET" && pathname === "/api/preferences") {
    return json(res, 200, readPreferences());
  }

  if (req.method === "PUT" && pathname === "/api/preferences") {
    const payload = await readJson(req);
    return json(res, 200, savePreferences(payload));
  }

  if (req.method === "POST" && pathname === "/api/hero-image") {
    const payload = await readJson(req, 12 * 1024 * 1024);
    if (!/^image\/(jpeg|png|webp|gif)$/i.test(String(payload.mimeType || ""))) {
      return error(res, 400, "请选择 JPG、PNG、WebP 或 GIF 图片", "INVALID_IMAGE");
    }
    const oldId = readSetting("hero_asset_id");
    const oldAsset = oldId ? selectAsset.get(oldId) : null;
    const row = await storeAsset({
      kind: "hero",
      name: payload.name || "calendar-background",
      mimeType: payload.mimeType,
      dataBase64: payload.data,
      maxBytes: 8 * 1024 * 1024,
    });
    setSetting.run("hero_asset_id", row.id);
    if (oldAsset && oldAsset.id !== row.id) {
      deleteAssetRow.run(oldAsset.id);
      await deleteAssetFile(oldAsset);
    }
    return json(res, 200, readPreferences());
  }

  if (req.method === "DELETE" && pathname === "/api/hero-image") {
    const oldId = readSetting("hero_asset_id");
    const oldAsset = oldId ? selectAsset.get(oldId) : null;
    setSetting.run("hero_asset_id", "");
    if (oldAsset) {
      deleteAssetRow.run(oldAsset.id);
      await deleteAssetFile(oldAsset);
    }
    return json(res, 200, readPreferences());
  }

  if (req.method === "GET" && pathname === "/api/notes") {
    const notes = selectAllNotes.all().map(rowToNote);
    const start = url.searchParams.get("start");
    const end = url.searchParams.get("end");
    return json(
      res,
      200,
      notes.filter(
        (note) => (!start || note.date >= start) && (!end || note.date <= end),
      ),
    );
  }

  const wallpaperMatch = pathname.match(
    /^\/api\/notes\/(\d{4}-\d{2}-\d{2})\/wallpaper$/,
  );
  // Wallpaper is mapped separately so a note's inline image can be reused as
  // its background without duplicating the file or changing attachment data.
  if (wallpaperMatch && (req.method === "POST" || req.method === "PUT")) {
    const date = wallpaperMatch[1];
    if (!selectNote.get(date)) {
      return error(res, 404, "请先创建当天记录", "NOTE_NOT_FOUND");
    }
    const payload = await readJson(req, 16 * 1024 * 1024);
    const previousId = readSetting(`note_wallpaper:${date}`);
    const previous = previousId ? selectAsset.get(previousId) : null;
    const previousStyle = safeJson(
      readSetting(`note_wallpaper_style:${date}`),
      {},
    );
    let wallpaperRow = null;

    if (payload.assetId) {
      wallpaperRow = selectAsset.get(String(payload.assetId));
      if (
        !wallpaperRow ||
        wallpaperRow.note_date !== date ||
        !/^image\/(jpeg|png|webp|gif)$/i.test(wallpaperRow.mime_type)
      ) {
        return error(
          res,
          400,
          "只能选择当天记录中的 JPG、PNG、WebP 或 GIF 图片",
          "INVALID_WALLPAPER",
        );
      }
    } else {
      if (
        !/^image\/(jpeg|png|webp|gif)$/i.test(
          String(payload.mimeType || ""),
        )
      ) {
        return error(
          res,
          400,
          "壁纸必须是 JPG、PNG、WebP 或 GIF 图片",
          "INVALID_WALLPAPER",
        );
      }
      wallpaperRow = await storeAsset({
        noteDate: date,
        kind: "wallpaper",
        name: payload.name || "daily-wallpaper",
        mimeType: payload.mimeType,
        dataBase64: payload.data,
        maxBytes: 8 * 1024 * 1024,
      });
    }

    setSetting.run(`note_wallpaper:${date}`, wallpaperRow.id);
    setSetting.run(
      `note_wallpaper_position:${date}`,
      JSON.stringify({
        x: clampNumber(payload.positionX, 0, 100, 50),
        y: clampNumber(payload.positionY, 0, 100, 50),
      }),
    );
    setSetting.run(
      `note_wallpaper_style:${date}`,
      JSON.stringify({
        overlay: clampNumber(
          payload.overlay,
          0,
          90,
          clampNumber(previousStyle.overlay, 0, 90, 78),
        ),
        blur: clampNumber(
          payload.blur,
          0,
          14,
          clampNumber(previousStyle.blur, 0, 14, 5),
        ),
        tone: ["none", "mono", "cool", "warm"].includes(payload.tone)
          ? payload.tone
          : ["none", "mono", "cool", "warm"].includes(previousStyle.tone)
            ? previousStyle.tone
            : "none",
      }),
    );
    if (
      previous &&
      previous.id !== wallpaperRow.id &&
      previous.kind === "wallpaper"
    ) {
      deleteAssetRow.run(previous.id);
      await deleteAssetFile(previous);
    }
    return json(res, 200, rowToNote(selectNote.get(date)));
  }

  if (wallpaperMatch && req.method === "DELETE") {
    const date = wallpaperMatch[1];
    const note = rowToNote(selectNote.get(date));
    if (!note) return error(res, 404, "记录不存在", "NOTE_NOT_FOUND");
    const previousId = readSetting(`note_wallpaper:${date}`);
    const previous = previousId ? selectAsset.get(previousId) : null;
    deleteSetting.run(`note_wallpaper:${date}`);
    deleteSetting.run(`note_wallpaper_position:${date}`);
    deleteSetting.run(`note_wallpaper_style:${date}`);
    if (previous?.kind === "wallpaper") {
      deleteAssetRow.run(previous.id);
      await deleteAssetFile(previous);
    }
    return json(res, 200, rowToNote(selectNote.get(date)));
  }

  const noteMatch = pathname.match(/^\/api\/notes\/(\d{4}-\d{2}-\d{2})$/);
  if (noteMatch && req.method === "DELETE") {
    const date = noteMatch[1];
    const note = rowToNote(selectNote.get(date));
    if (!note) return error(res, 404, "记录不存在", "NOTE_NOT_FOUND");
    const assets = selectAssetsForNote.all(date);
    deleteAllNoteAssets.run(date);
    deleteSetting.run(`note_wallpaper:${date}`);
    deleteSetting.run(`note_wallpaper_position:${date}`);
    deleteSetting.run(`note_wallpaper_style:${date}`);
    deleteNoteRow.run(date);
    await Promise.all(assets.map(deleteAssetFile));
    return json(res, 200, { ok: true, date });
  }
  if (noteMatch && req.method === "GET") {
    const note = rowToNote(selectNote.get(noteMatch[1]));
    return note
      ? json(res, 200, note)
      : error(res, 404, "记录不存在", "NOTE_NOT_FOUND");
  }

  if (noteMatch && req.method === "PUT") {
    const date = noteMatch[1];
    if (!isValidDate(date)) {
      return error(res, 400, "日期格式无效", "INVALID_DATE");
    }

    const payload = await readJson(req);
    const body = typeof payload.body === "string" ? payload.body.trimEnd() : "";
    if (!body.trim()) {
      return error(res, 400, "正文不能为空", "EMPTY_BODY");
    }
    if (body.length > 200_000) {
      return error(res, 400, "正文过长", "BODY_TOO_LONG");
    }

    const note = saveNote(date, body, normalizeTags(payload.tags));
    return json(res, 200, note);
  }

  const noteAssetMatch = pathname.match(
    /^\/api\/notes\/(\d{4}-\d{2}-\d{2})\/assets$/,
  );
  if (noteAssetMatch && req.method === "POST") {
    const date = noteAssetMatch[1];
    if (!selectNote.get(date)) {
      return error(res, 404, "请先保存记录，再添加文件", "NOTE_NOT_FOUND");
    }
    const payload = await readJson(req, 16 * 1024 * 1024);
    try {
      const row = await storeAsset({
        noteDate: date,
        kind: payload.kind === "audio" ? "audio" : "attachment",
        name: payload.name,
        mimeType: payload.mimeType,
        dataBase64: payload.data,
        maxBytes: 10 * 1024 * 1024,
        metadata: payload.metadata || {},
      });
      return json(res, 201, assetToPublic(row));
    } catch (caught) {
      return error(res, 400, caught.message, "INVALID_ASSET");
    }
  }

  const digestAstMatch = pathname.match(
    /^\/api\/notes\/(\d{4}-\d{2}-\d{2})\/digest$/,
  );
  if (digestAstMatch && req.method === "PUT") {
    const date = digestAstMatch[1];
    const note = rowToNote(selectNote.get(date));
    if (!note) {
      return error(res, 404, "记录不存在", "NOTE_NOT_FOUND");
    }

    const payload = await readJson(req);
    const digest = payload.digest;
    if (!digest || !Array.isArray(digest.points)) {
      return error(res, 400, "提炼结果格式无效", "INVALID_DIGEST");
    }

    const points = [
      ...new Set(
        digest.points
          .filter((point) => typeof point === "string")
          .map((point) => point.trim())
          .filter(Boolean)
          .map((point) => point.slice(0, 160)),
      ),
    ].slice(0, 8);

    if (!points.length) {
      return error(res, 400, "提炼结果不能为空", "EMPTY_DIGEST");
    }
    if (digest.sourceHash !== hashSource(note)) {
      return error(
        res,
        409,
        "记录在提炼后发生了变化，请重新提炼",
        "SOURCE_CHANGED",
      );
    }

    const now = new Date().toISOString();
    const storedDigest = {
      points,
      generatedAt: digest.generatedAt || now,
      sourceHash: digest.sourceHash,
      model: String(digest.model || aiConfig.model).slice(0, 100),
    };
    updateDigest.run(JSON.stringify(storedDigest), now, date);

    return json(res, 200, rowToNote(selectNote.get(date)));
  }

  const aiMatch = pathname.match(
    /^\/api\/ai\/digest\/(\d{4}-\d{2}-\d{2})$/,
  );
  if (aiMatch && req.method === "POST") {
    return handleAiDigest(res, aiMatch[1]);
  }

  if (req.method === "POST" && pathname === "/api/ai/polish") {
    const payload = await readJson(req);
    const text = typeof payload.text === "string" ? payload.text.trim() : "";
    if (!text) {
      return error(res, 400, "请先选择要润色的文本", "EMPTY_TEXT");
    }
    if (text.length > 20_000) {
      return error(res, 400, "单次润色最多 20000 个字符", "TEXT_TOO_LONG");
    }

    const styleLabels = {
      concise: "更简洁，删除重复和空话",
      clear: "表达更清楚，理顺句子结构",
      professional: "更专业，保持自然、不夸张",
      academic: "更学术，术语准确，论证克制",
    };
    const style = Object.hasOwn(styleLabels, payload.style)
      ? payload.style
      : "clear";
    const { content } = await callChatCompletion([
      {
        role: "system",
        content: `你是中文学习笔记编辑。请只输出改写后的正文，不要解释，不要添加 Markdown 代码块。要求：${styleLabels[style]}；保持原意、事实和术语不丢失。`,
      },
      { role: "user", content: text },
    ]);
    return json(res, 200, {
      text: content.trim(),
      style,
      generatedAt: new Date().toISOString(),
      model: aiConfig.model,
    });
  }

  if (req.method === "GET" && pathname === "/api/settings") {
    return json(res, 200, publicAiSettings());
  }

  if (req.method === "POST" && pathname === "/api/settings/test") {
    const payload = await readJson(req);
    let candidate;
    try {
      candidate = resolveAiSettings(payload, aiConfig);
    } catch (caught) {
      return error(res, 400, caught.message, "INVALID_AI_SETTINGS");
    }
    if (!candidate.apiKey) {
      return error(res, 400, "请先填写 API Key", "AI_KEY_MISSING");
    }

    const startedAt = Date.now();
    const { content } = await callChatCompletion(
      [
        {
          role: "system",
          content:
            "你是 API 连通性测试助手。只输出一行合法 JSON，不要使用 Markdown。",
        },
        {
          role: "user",
          content: '请只输出 {"ok":true}',
        },
      ],
      { config: candidate, timeout: 60_000 },
    );

    return json(res, 200, {
      ok: true,
      provider: candidate.provider,
      model: candidate.model,
      latencyMs: Date.now() - startedAt,
      preview: content.trim().slice(0, 160),
    });
  }

  if (req.method === "PUT" && pathname === "/api/settings") {
    const payload = await readJson(req);
    let candidate;
    try {
      candidate = resolveAiSettings(payload, aiConfig);
    } catch (caught) {
      return error(res, 400, caught.message, "INVALID_AI_SETTINGS");
    }

    aiConfig.provider = candidate.provider;
    aiConfig.baseUrl = candidate.baseUrl;
    aiConfig.model = candidate.model;
    aiConfig.apiKey = candidate.apiKey;
    setSetting.run("ai_provider", aiConfig.provider);
    setSetting.run("ai_base_url", aiConfig.baseUrl);
    setSetting.run("ai_model", aiConfig.model);

    if (typeof payload.apiKey === "string" && payload.apiKey.trim()) {
      aiConfig.apiKey = payload.apiKey.trim();
      aiConfig.keySource = "saved";
      setSetting.run(
        "ai_api_key_encrypted",
        encryptSecret(aiConfig.apiKey),
      );
    } else if (!aiConfig.apiKey || payload.clearKey === true) {
      aiConfig.apiKey = "";
      aiConfig.keySource = "session";
      setSetting.run("ai_api_key_encrypted", "");
    }

    return json(res, 200, publicAiSettings());
  }

  return error(res, 404, "接口不存在", "NOT_FOUND");
}

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
};

async function serveStatic(req, res, pathname) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    return error(res, 405, "仅支持 GET", "METHOD_NOT_ALLOWED");
  }

  const requested = pathname === "/" ? "/index.html" : pathname;
  const resolved = path.resolve(PUBLIC_DIR, `.${decodeURIComponent(requested)}`);
  if (!resolved.startsWith(`${PUBLIC_DIR}${path.sep}`)) {
    return error(res, 403, "禁止访问", "FORBIDDEN");
  }

  try {
    const info = await stat(resolved);
    if (!info.isFile()) throw new Error("not a file");
    const ext = path.extname(resolved).toLowerCase();
    res.writeHead(200, {
      "Content-Type": mimeTypes[ext] || "application/octet-stream",
      "Content-Length": info.size,
      "Cache-Control": "no-cache",
    });
    if (req.method === "HEAD") return res.end();
    createReadStream(resolved).pipe(res);
  } catch {
    error(res, 404, "页面不存在", "NOT_FOUND");
  }
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
  try {
    if (url.pathname.startsWith("/api/")) {
      await handleApi(req, res, url);
    } else {
      await serveStatic(req, res, url.pathname);
    }
  } catch (caught) {
    const status = Number(caught?.statusCode) || 500;
    const message =
      status === 500 ? "服务器处理请求时发生错误" : caught?.message;
    if (status === 500) console.error(caught);
    error(res, status, message || "服务器错误", caught?.code || "SERVER_ERROR");
  }
});

server.listen(PORT, HOST, () => {
  console.log(`日知已启动：http://${HOST}:${PORT}`);
  console.log(`本地数据库：${DB_PATH}`);
  console.log(
    aiConfig.apiKey
      ? `AI：${aiConfig.model}（${
          aiConfig.keySource === "environment"
            ? "环境变量密钥"
            : aiConfig.keySource === "saved"
              ? "本机加密密钥"
              : "会话密钥"
        }）`
      : "AI：尚未配置 API Key，可在应用右上角设置",
  );
});

function shutdown() {
  server.close(() => {
    db.close();
    process.exit(0);
  });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
