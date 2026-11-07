const dom = {
  monthLabel: document.querySelector("#monthLabel"),
  monthPicker: document.querySelector("#monthPicker"),
  prevMonth: document.querySelector("#prevMonth"),
  nextMonth: document.querySelector("#nextMonth"),
  todayButton: document.querySelector("#todayButton"),
  searchInput: document.querySelector("#searchInput"),
  tagFilterButton: document.querySelector("#tagFilterButton"),
  tagFilterLabel: document.querySelector("#tagFilterLabel"),
  tagMenu: document.querySelector("#tagMenu"),
  tagMenuList: document.querySelector("#tagMenuList"),
  clearTagFilter: document.querySelector("#clearTagFilter"),
  exportButton: document.querySelector("#exportButton"),
  settingsButton: document.querySelector("#settingsButton"),
  newNoteButton: document.querySelector("#newNoteButton"),
  monthEyebrow: document.querySelector("#monthEyebrow"),
  monthHeadline: document.querySelector("#monthHeadline"),
  monthStats: document.querySelector("#monthStats"),
  calendarHero: document.querySelector("#calendarHero"),
  heroImage: document.querySelector("#heroImage"),
  heroBackgroundButton: document.querySelector("#heroBackgroundButton"),
  heroMonthLabel: document.querySelector("#heroMonthLabel"),
  heroDayNumber: document.querySelector("#heroDayNumber"),
  heroWeekday: document.querySelector("#heroWeekday"),
  heroLunarDate: document.querySelector("#heroLunarDate"),
  heroSolarTerm: document.querySelector("#heroSolarTerm"),
  heroYearName: document.querySelector("#heroYearName"),
  heroTodayLabel: document.querySelector("#heroTodayLabel"),
  heroRecordSummary: document.querySelector("#heroRecordSummary"),
  puzzleGrid: document.querySelector("#puzzleGrid"),
  weekdayRow: document.querySelector("#weekdayRow"),
  emptyMonth: document.querySelector("#emptyMonth"),
  emptyCreateButton: document.querySelector("#emptyCreateButton"),
  hoverPreview: document.querySelector("#hoverPreview"),
  drawerBackdrop: document.querySelector("#drawerBackdrop"),
  detailDrawer: document.querySelector("#detailDrawer"),
  closeDrawer: document.querySelector("#closeDrawer"),
  drawerDate: document.querySelector("#drawerDate"),
  drawerTags: document.querySelector("#drawerTags"),
  drawerBody: document.querySelector("#drawerBody"),
  drawerAiStatus: document.querySelector("#drawerAiStatus"),
  drawerDigest: document.querySelector("#drawerDigest"),
  drawerEditButton: document.querySelector("#drawerEditButton"),
  drawerAiButton: document.querySelector("#drawerAiButton"),
  drawerExportButton: document.querySelector("#drawerExportButton"),
  drawerCopyButton: document.querySelector("#drawerCopyButton"),
  drawerWallpaperButton: document.querySelector("#drawerWallpaperButton"),
  drawerDeleteButton: document.querySelector("#drawerDeleteButton"),
  drawerAttachmentsSection: document.querySelector(
    "#drawerAttachmentsSection",
  ),
  drawerAttachments: document.querySelector("#drawerAttachments"),
  editorScreen: document.querySelector("#editorScreen"),
  editorClose: document.querySelector("#editorClose"),
  editorDateLabel: document.querySelector("#editorDateLabel"),
  editorDirtyLabel: document.querySelector("#editorDirtyLabel"),
  editorTags: document.querySelector("#editorTags"),
  tagInput: document.querySelector("#tagInput"),
  saveButton: document.querySelector("#saveButton"),
  editorAiButton: document.querySelector("#editorAiButton"),
  editorBody: document.querySelector("#editorBody"),
  editorCharCount: document.querySelector("#editorCharCount"),
  editorCopyButton: document.querySelector("#editorCopyButton"),
  editorFindButton: document.querySelector("#editorFindButton"),
  editorPolishButton: document.querySelector("#editorPolishButton"),
  editorAttachmentButton: document.querySelector("#editorAttachmentButton"),
  editorRecordButton: document.querySelector("#editorRecordButton"),
  editorStyleButton: document.querySelector("#editorStyleButton"),
  editorWallpaperButton: document.querySelector("#editorWallpaperButton"),
  editorPreviewToggleButton: document.querySelector(
    "#editorPreviewToggleButton",
  ),
  editorDocumentLayout: document.querySelector("#editorDocumentLayout"),
  editorSplitter: document.querySelector("#editorSplitter"),
  attachmentInput: document.querySelector("#attachmentInput"),
  replacePanel: document.querySelector("#replacePanel"),
  replaceFindInput: document.querySelector("#replaceFindInput"),
  replaceWithInput: document.querySelector("#replaceWithInput"),
  replaceOneButton: document.querySelector("#replaceOneButton"),
  replaceAllButton: document.querySelector("#replaceAllButton"),
  replaceCloseButton: document.querySelector("#replaceCloseButton"),
  editorStylePanel: document.querySelector("#editorStylePanel"),
  quickFontFamily: document.querySelector("#quickFontFamily"),
  quickTextStyle: document.querySelector("#quickTextStyle"),
  styleSelectionHint: document.querySelector("#styleSelectionHint"),
  quickStylePreset: document.querySelector("#quickStylePreset"),
  quickFontSize: document.querySelector("#quickFontSize"),
  quickFontSizeLabel: document.querySelector("#quickFontSizeLabel"),
  quickLineHeight: document.querySelector("#quickLineHeight"),
  quickLineHeightLabel: document.querySelector("#quickLineHeightLabel"),
  editorAttachments: document.querySelector("#editorAttachments"),
  editorPreviewWrap: document.querySelector("#editorPreviewWrap"),
  editorPreview: document.querySelector("#editorPreview"),
  customTagSuggestions: document.querySelector("#customTagSuggestions"),
  modalLayer: document.querySelector("#modalLayer"),
  modal: document.querySelector("#modal"),
  toastRegion: document.querySelector("#toastRegion"),
};

const state = {
  notes: [],
  settings: null,
  preferences: null,
  meta: null,
  view: monthFromDate(new Date()),
  selectedDate: null,
  activeTag: null,
  query: "",
  editor: {
    open: false,
    date: null,
    body: "",
    tags: [],
    savedBody: "",
    savedTags: [],
    attachments: [],
    wallpaper: null,
    wallpaperPosition: { x: 50, y: 50 },
    wallpaperStyle: { overlay: 78, blur: 5, tone: "none" },
    saving: false,
  },
  modalDismissible: true,
  recording: null,
  editorPreviewCollapsed: false,
};

const weekdayNames = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
const weekdayShort = ["一", "二", "三", "四", "五", "六", "日"];
const monthNames = [
  "JANUARY",
  "FEBRUARY",
  "MARCH",
  "APRIL",
  "MAY",
  "JUNE",
  "JULY",
  "AUGUST",
  "SEPTEMBER",
  "OCTOBER",
  "NOVEMBER",
  "DECEMBER",
];
const tilePalettes = [
  { background: "#e7f0eb", accent: "#4b7b67" },
  { background: "#f3eadc", accent: "#a5763f" },
  { background: "#e9edf3", accent: "#60758f" },
  { background: "#f2e9e5", accent: "#9b6b5e" },
  { background: "#edf0e4", accent: "#78804c" },
  { background: "#e5eeec", accent: "#4d7b76" },
];
const documentStylePresets = {
  standard: {
    main: "#1f2328",
    secondary: "#6b7280",
    accent: "#1f6f8b",
    accentSoft: "#e7f1f4",
  },
  brand: {
    main: "#1f2328",
    secondary: "#70655c",
    accent: "#9a4e24",
    accentSoft: "#f5e9e1",
  },
  data: {
    main: "#1f2328",
    secondary: "#5f6b73",
    accent: "#0b6c7d",
    accentSoft: "#e2f0f2",
  },
  review: {
    main: "#1f2328",
    secondary: "#777777",
    accent: "#4b5563",
    accentSoft: "#eceeef",
  },
};

init();

async function init() {
  bindEvents();
  try {
    const [notes, settings, preferences, meta] = await Promise.all([
      api("/api/notes"),
      api("/api/settings"),
      api("/api/preferences"),
      api("/api/meta"),
    ]);
    state.notes = notes;
    state.settings = settings;
    state.preferences = preferences;
    state.meta = meta;
    applyPreferences();
    renderHero();
    renderMonth();
  } catch (caught) {
    toast(caught.message || "无法连接本地数据服务", "error");
    renderMonth();
  }
}

function bindEvents() {
  dom.prevMonth.addEventListener("click", () => shiftMonth(-1));
  dom.nextMonth.addEventListener("click", () => shiftMonth(1));
  dom.monthPicker.addEventListener("change", () => {
    if (!dom.monthPicker.value) return;
    const [year, month] = dom.monthPicker.value.split("-").map(Number);
    state.view = { year, month: month - 1 };
    renderMonth();
  });
  dom.todayButton.addEventListener("click", () => {
    state.view = monthFromDate(new Date());
    renderMonth();
    const todayNote = dom.puzzleGrid.querySelector(
      `[data-date="${todayISO()}"]`,
    );
    if (todayNote) {
      todayNote.scrollIntoView({ block: "center", behavior: "smooth" });
      todayNote.focus({ preventScroll: true });
    }
  });

  dom.searchInput.addEventListener("input", () => {
    state.query = dom.searchInput.value.trim().toLowerCase();
    renderMonth();
  });
  dom.tagFilterButton.addEventListener("click", toggleTagMenu);
  dom.clearTagFilter.addEventListener("click", () => {
    state.activeTag = null;
    closeTagMenu();
    updateFilterLabel();
    renderMonth();
  });
  document.addEventListener("click", (event) => {
    if (
      !dom.tagMenu.hidden &&
      !dom.tagMenu.contains(event.target) &&
      !dom.tagFilterButton.contains(event.target)
    ) {
      closeTagMenu();
    }
  });

  dom.newNoteButton.addEventListener("click", () => openEditor(todayISO()));
  dom.heroBackgroundButton.addEventListener("click", () =>
    openSettings({ tab: "appearance" }),
  );
  dom.emptyCreateButton.addEventListener("click", () => {
    const today = new Date();
    const todayMonth = monthFromDate(today);
    const targetDate =
      todayMonth.year === state.view.year &&
      todayMonth.month === state.view.month
        ? todayISO()
        : firstDayOfMonth(state.view.year, state.view.month);
    openEditor(targetDate);
  });

  dom.puzzleGrid.addEventListener("click", handleGridClick);
  dom.puzzleGrid.addEventListener("dblclick", handleGridDoubleClick);
  dom.puzzleGrid.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      if (event.target.closest("[data-wallpaper-date]")) return;
      event.preventDefault();
      const tile = event.target.closest(".day-tile[data-date]");
      if (!tile) return;
      if (tile.classList.contains("has-note")) openDrawer(tile.dataset.date);
      else openEditor(tile.dataset.date);
    }
  });
  dom.puzzleGrid.addEventListener("mouseover", handleTileMouseOver);
  dom.puzzleGrid.addEventListener("mouseout", handleTileMouseOut);
  dom.puzzleGrid.addEventListener("scroll", hideHoverPreview);
  window.addEventListener("scroll", hideHoverPreview, true);
  window.addEventListener("resize", hideHoverPreview);

  dom.closeDrawer.addEventListener("click", closeDrawer);
  dom.drawerBackdrop.addEventListener("click", closeDrawer);
  dom.drawerEditButton.addEventListener("click", () => {
    if (state.selectedDate) openEditor(state.selectedDate);
  });
  dom.drawerAiButton.addEventListener("click", () => {
    if (state.selectedDate) runDigest(state.selectedDate);
  });
  dom.drawerExportButton.addEventListener("click", () => {
    if (state.selectedDate) openExportDialog(state.selectedDate);
  });
  dom.drawerCopyButton.addEventListener("click", () => {
    const note = noteForDate(state.selectedDate);
    if (!note) return;
    copyText(note.body, "正文已复制");
  });
  dom.drawerDeleteButton.addEventListener("click", () => {
    if (state.selectedDate) deleteNote(state.selectedDate);
  });
  dom.drawerWallpaperButton.addEventListener("click", () => {
    if (state.selectedDate) openWallpaperDialog(state.selectedDate);
  });

  dom.editorClose.addEventListener("click", closeEditor);
  dom.saveButton.addEventListener("click", () => saveEditor());
  dom.editorAiButton.addEventListener("click", () => {
    if (state.editor.date) runDigest(state.editor.date);
  });
  dom.editorBody.addEventListener("input", () => {
    state.editor.body = dom.editorBody.value;
    updateEditorMeta();
    updateTextStyleAvailability();
    scheduleEditorPreview();
  });
  dom.editorBody.addEventListener("click", updateTextStyleAvailability);
  dom.editorBody.addEventListener("keyup", updateTextStyleAvailability);
  dom.editorBody.addEventListener("mouseup", updateTextStyleAvailability);
  dom.editorBody.addEventListener("select", updateTextStyleAvailability);
  dom.tagInput.addEventListener("keydown", handleTagInput);
  dom.editorCopyButton.addEventListener("click", copyEditorSelection);
  dom.editorFindButton.addEventListener("click", toggleReplacePanel);
  dom.editorPolishButton.addEventListener("click", polishEditorText);
  dom.editorAttachmentButton.addEventListener("click", () =>
    dom.attachmentInput.click(),
  );
  dom.attachmentInput.addEventListener("change", uploadSelectedFiles);
  dom.editorRecordButton.addEventListener("click", openRecordingDialog);
  dom.editorStyleButton.addEventListener("click", toggleEditorStylePanel);
  dom.editorWallpaperButton.addEventListener("click", () => {
    if (state.editor.date) openWallpaperDialog(state.editor.date);
  });
  dom.editorPreviewToggleButton.addEventListener(
    "click",
    toggleEditorPreviewPane,
  );
  dom.editorSplitter.addEventListener("pointerdown", startEditorSplitDrag);
  dom.editorSplitter.addEventListener("keydown", handleSplitterKeydown);
  dom.replaceCloseButton.addEventListener("click", closeReplacePanel);
  dom.replaceOneButton.addEventListener("click", () => replaceText(false));
  dom.replaceAllButton.addEventListener("click", () => replaceText(true));
  dom.quickFontFamily.addEventListener("change", saveQuickEditorStyle);
  dom.quickTextStyle.addEventListener("change", () =>
    applyEditorTextStyle(dom.quickTextStyle.value),
  );
  dom.quickStylePreset.addEventListener("change", saveQuickStylePreset);
  dom.quickFontSize.addEventListener("input", saveQuickEditorStyle);
  dom.quickLineHeight.addEventListener("input", saveQuickEditorStyle);

  dom.exportButton.addEventListener("click", () => openExportDialog());
  dom.settingsButton.addEventListener("click", openSettings);

  dom.modalLayer.addEventListener("click", (event) => {
    if (event.target === dom.modalLayer && state.modalDismissible) {
      closeModal();
    }
  });

  document.addEventListener("keydown", handleGlobalKeys);
}

function handleGlobalKeys(event) {
  const modifier = event.ctrlKey || event.metaKey;
  if (modifier && event.key.toLowerCase() === "k") {
    event.preventDefault();
    if (!dom.editorScreen.classList.contains("is-open")) {
      dom.searchInput.focus();
      dom.searchInput.select();
    }
    return;
  }

  if (dom.editorScreen.classList.contains("is-open")) {
    if (modifier && event.key.toLowerCase() === "s") {
      event.preventDefault();
      saveEditor();
      return;
    }
    if (modifier && event.key === "Enter") {
      event.preventDefault();
      runDigest(state.editor.date);
      return;
    }
  }

  if (event.key === "Escape") {
    if (!dom.modalLayer.hidden) {
      if (state.modalDismissible) closeModal();
      return;
    }
    if (!dom.tagMenu.hidden) {
      closeTagMenu();
      return;
    }
    if (!dom.replacePanel.hidden) {
      closeReplacePanel();
      return;
    }
    if (!dom.editorStylePanel.hidden) {
      dom.editorStylePanel.hidden = true;
      dom.editorStyleButton.classList.remove("is-active");
      return;
    }
    if (dom.detailDrawer.classList.contains("is-open")) {
      closeDrawer();
      return;
    }
    if (dom.editorScreen.classList.contains("is-open")) closeEditor();
  }
}

async function api(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    const caught = new Error(
      payload?.error?.message || `请求失败（${response.status}）`,
    );
    caught.status = response.status;
    caught.code = payload?.error?.code;
    throw caught;
  }

  return payload;
}

function renderMonth() {
  const { year, month } = state.view;
  const monthNotes = notesForMonth(year, month);
  const filtered = monthNotes.filter(noteMatchesFilter);
  const stats = getMonthStats(monthNotes);
  const monthIndex = String(month + 1).padStart(2, "0");

  dom.monthLabel.textContent = `${year}年${month + 1}月`;
  dom.monthPicker.value = `${year}-${monthIndex}`;
  dom.monthEyebrow.textContent = `${year} · ${monthNames[month]}`;
  dom.monthHeadline.textContent =
    state.query || state.activeTag ? "筛选结果" : "本月学习拼图";
  dom.monthStats.innerHTML = `
    <span><strong>${filtered.length}</strong> 天记录</span>
    <span class="stats-divider"></span>
    <span><strong>${stats.points}</strong> 个知识点</span>
    <span class="stats-divider"></span>
    <span><strong>${stats.digests}</strong> 条 AI 提炼</span>
  `;

  const firstWeekday = mondayIndex(new Date(year, month, 1));
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const previousMonthDays = new Date(year, month, 0).getDate();
  const totalGridCells = Math.ceil((firstWeekday + daysInMonth) / 7) * 7;
  const fragments = [];

  for (let index = 0; index < firstWeekday; index += 1) {
    const day = previousMonthDays - firstWeekday + index + 1;
    const cellDate = new Date(year, month - 1, day);
    const lunar = getLunarInfo(cellDate);
    const solarTerm = getSolarTerm(cellDate);
    fragments.push(`
      <div class="day-tile blank is-outside-month" aria-hidden="true">
        <div class="tile-head">
          <span class="day-number">${String(day).padStart(2, "0")}</span>
        </div>
        <span class="tile-lunar">${escapeHTML(solarTerm || `${lunar.monthName}${lunar.dayName}`)}</span>
      </div>
    `);
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const iso = toISODate(year, month, day);
    const note = noteForDate(iso);
    const today = iso === todayISO();
    const cellDate = new Date(year, month, day);
    const lunar = getLunarInfo(cellDate);
    const solarTerm = getSolarTerm(cellDate);
    const lunarLabel =
      solarTerm || `${lunar.monthName}${lunar.dayName}`;
    if (!note) {
      fragments.push(`
        <button
          class="day-tile blank ${today ? "is-today" : ""}"
          data-date="${iso}"
          aria-label="${formatFullDate(iso)}，尚无记录，创建记录"
          type="button"
        >
          <div class="tile-head">
            <span class="day-number">${String(day).padStart(2, "0")}</span>
            ${today ? '<span class="today-label">今天</span>' : ""}
          </div>
          <span class="tile-lunar">${escapeHTML(lunarLabel)}</span>
          <span class="empty-day-add" aria-hidden="true">+</span>
        </button>
      `);
      continue;
    }

    const matches = noteMatchesFilter(note);
    const palette =
      tilePalettes[Math.abs(simpleHash(note.date)) % tilePalettes.length];
    const visibleTags = note.tags.slice(0, 2);
    const extraTags = Math.max(0, note.tags.length - visibleTags.length);
    const digestClass = digestStatus(note);
    const noteTitle = extractNoteTitle(note.body);
    const noteSummary = extractNoteSummary(note.body, 32);
    const wallpaperStyleValue = note.wallpaperStyle || {
      overlay: 78,
      blur: 5,
      tone: "none",
    };
    const wallpaperStyle = note.wallpaper
      ? `;--tile-wallpaper:url(&quot;${escapeAttribute(note.wallpaper.url)}&quot;);--tile-wallpaper-position:${note.wallpaperPosition?.x ?? 50}% ${note.wallpaperPosition?.y ?? 50}%;--tile-wallpaper-overlay:${wallpaperStyleValue.overlay / 100};--tile-wallpaper-blur:${wallpaperStyleValue.blur}px;--tile-wallpaper-filter:${wallpaperToneFilter(wallpaperStyleValue.tone)}`
      : "";
    fragments.push(`
      <article
        class="day-tile has-note ${note.wallpaper ? "has-wallpaper" : ""} ${today ? "is-today" : ""} ${matches ? "" : "is-muted"}"
        data-date="${note.date}"
        tabindex="0"
        role="button"
        aria-label="${formatFullDate(note.date)}，查看学习详情"
        style="--tile-color:${palette.background};--tile-accent:${palette.accent}${wallpaperStyle}"
      >
        ${note.wallpaper ? '<span class="tile-wallpaper-layer" aria-hidden="true"></span>' : ""}
        <div class="tile-head">
          <span class="day-number">${String(day).padStart(2, "0")}</span>
          <span class="tile-head-actions">
            <span class="digest-dot ${digestClass}" title="${digestStatusLabel(note)}"></span>
            <button class="tile-wallpaper-trigger" type="button" data-wallpaper-date="${note.date}" title="设置当天壁纸" aria-label="设置${formatFullDate(note.date)}的壁纸">
              <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="m21 15-5-5L5 20"/></svg>
            </button>
          </span>
        </div>
        <span class="tile-lunar">${escapeHTML(lunarLabel)}</span>
        <div class="tile-copy">
          <strong class="tile-note-title">${escapeHTML(noteTitle)}</strong>
          <span class="tile-note-summary">${escapeHTML(noteSummary)}</span>
        </div>
        <div class="tile-tags">
          ${visibleTags
            .map((tag) => `<span class="tile-tag">${escapeHTML(tag)}</span>`)
            .join("")}
          ${extraTags ? `<span class="tile-tag more">+${extraTags}</span>` : ""}
        </div>
      </article>
    `);
  }

  const usedCells = firstWeekday + daysInMonth;
  const trailingDays = totalGridCells - usedCells;
  for (let day = 1; day <= trailingDays; day += 1) {
    const cellDate = new Date(year, month + 1, day);
    const lunar = getLunarInfo(cellDate);
    const solarTerm = getSolarTerm(cellDate);
    fragments.push(`
      <div class="day-tile blank is-outside-month" aria-hidden="true">
        <div class="tile-head">
          <span class="day-number">${String(day).padStart(2, "0")}</span>
        </div>
        <span class="tile-lunar">${escapeHTML(solarTerm || `${lunar.monthName}${lunar.dayName}`)}</span>
      </div>
    `);
  }

  dom.puzzleGrid.innerHTML = fragments.join("");
  const hasAnyNotes = monthNotes.length > 0;
  dom.emptyMonth.hidden = hasAnyNotes;
  dom.puzzleGrid.hidden = !hasAnyNotes;
  dom.weekdayRow.hidden = !hasAnyNotes;
  updateFilterLabel();
  renderHero();
}

function renderHero() {
  const date = new Date();
  const iso = todayISO();
  const lunar = getLunarInfo(date);
  const solarTerm = getSolarTerm(date);
  const note = noteForDate(iso);
  const preferences = state.preferences || {
    hero: {
      style: "glass",
      height: "standard",
      overlay: 38,
      positionX: 50,
      positionY: 50,
      tone: "none",
    },
  };

  dom.heroMonthLabel.textContent = `${date.getFullYear()} / ${String(date.getMonth() + 1).padStart(2, "0")}`;
  dom.heroDayNumber.textContent = String(date.getDate());
  dom.heroWeekday.textContent = weekdayNames[date.getDay()];
  dom.heroLunarDate.textContent = `农历${lunar.monthName}${lunar.dayName}`;
  dom.heroYearName.textContent = `${lunar.yearName}年`;
  dom.heroSolarTerm.textContent = solarTerm || "日常记录";
  dom.heroTodayLabel.textContent = `今天 · ${formatFullDate(iso).replace(" ", " · ")}`;
  dom.heroRecordSummary.textContent = note
    ? `${extractNoteTitle(note.body)} · ${extractNoteSummary(note.body, 42)}`
    : "把一天里的所得留在这里";
  dom.calendarHero.dataset.style = preferences.hero.style;
  dom.calendarHero.dataset.height = preferences.hero.height;
  dom.calendarHero.dataset.tone = preferences.hero.tone || "none";
  dom.calendarHero.style.setProperty(
    "--hero-overlay",
    String(preferences.hero.overlay / 100),
  );
  dom.calendarHero.style.setProperty(
    "--hero-position",
    `${preferences.hero.positionX}% ${preferences.hero.positionY}%`,
  );
  dom.heroImage.style.backgroundImage = preferences.heroImageUrl
    ? `linear-gradient(rgba(0,0,0,.06), rgba(0,0,0,.06)), url("${preferences.heroImageUrl}")`
    : "";
}

function applyPreferences() {
  if (!state.preferences) return;
  const {
    hero,
    editor,
    transitions,
    customTags,
    stylePreset = "standard",
    editorSplitRatio = 48,
  } = state.preferences;
  const colors =
    documentStylePresets[stylePreset] || documentStylePresets.standard;
  document.documentElement.classList.toggle("no-motion", !transitions);
  document.documentElement.style.setProperty("--doc-main", colors.main);
  document.documentElement.style.setProperty(
    "--doc-secondary",
    colors.secondary,
  );
  document.documentElement.style.setProperty("--doc-accent", colors.accent);
  document.documentElement.style.setProperty(
    "--doc-accent-soft",
    colors.accentSoft,
  );
  document.documentElement.style.setProperty(
    "--note-font-size",
    `${editor.fontSize}px`,
  );
  document.documentElement.style.setProperty(
    "--note-line-height",
    String(editor.lineHeight),
  );
  document.documentElement.style.setProperty(
    "--note-font-family",
    editor.fontFamily === "sans"
      ? "var(--sans)"
      : editor.fontFamily === "mono"
        ? "var(--mono)"
        : "var(--serif)",
  );
  dom.editorBody.dataset.font = editor.fontFamily;
  dom.quickFontFamily.value = editor.fontFamily;
  dom.quickStylePreset.value = stylePreset;
  dom.quickFontSize.value = editor.fontSize;
  dom.quickFontSizeLabel.textContent = `${editor.fontSize}px`;
  dom.quickLineHeight.value = editor.lineHeight;
  dom.quickLineHeightLabel.textContent = Number(editor.lineHeight).toFixed(1);
  dom.customTagSuggestions.innerHTML = (customTags || [])
    .map((tag) => `<option value="${escapeAttribute(tag)}"></option>`)
    .join("");
  dom.calendarHero.dataset.style = hero.style;
  dom.calendarHero.dataset.height = hero.height;
  dom.editorDocumentLayout.style.setProperty(
    "--source-pane-width",
    `${editorSplitRatio}%`,
  );
  dom.editorSplitter.setAttribute(
    "aria-valuenow",
    String(Math.round(editorSplitRatio)),
  );
  renderHero();
}

function handleGridClick(event) {
  // Wallpaper controls live inside a clickable date tile; stop the event here
  // so opening the picker never also opens the note drawer.
  const wallpaperButton = event.target.closest("[data-wallpaper-date]");
  if (wallpaperButton) {
    event.preventDefault();
    event.stopPropagation();
    openWallpaperDialog(wallpaperButton.dataset.wallpaperDate);
    return;
  }
  const tile = event.target.closest(".day-tile[data-date]");
  if (!tile) return;
  hideHoverPreview();
  if (tile.classList.contains("has-note")) openDrawer(tile.dataset.date);
  else openEditor(tile.dataset.date);
}

function handleGridDoubleClick(event) {
  if (event.target.closest("[data-wallpaper-date]")) return;
  const tile = event.target.closest(".day-tile.has-note");
  if (!tile) return;
  event.preventDefault();
  openEditor(tile.dataset.date);
}

let hoverTimer = null;
let hoveredTile = null;

function handleTileMouseOver(event) {
  const tile = event.target.closest(".day-tile.has-note");
  if (!tile || tile === hoveredTile) return;
  if (tile.contains(event.relatedTarget)) return;
  hoveredTile = tile;
  clearTimeout(hoverTimer);
  hoverTimer = setTimeout(() => showHoverPreview(tile), 260);
}

function handleTileMouseOut(event) {
  const tile = event.target.closest(".day-tile.has-note");
  if (!tile || tile.contains(event.relatedTarget)) return;
  if (hoveredTile === tile) {
    hoveredTile = null;
    clearTimeout(hoverTimer);
    hideHoverPreview();
  }
}

function showHoverPreview(tile) {
  const note = noteForDate(tile.dataset.date);
  if (!note || dom.editorScreen.classList.contains("is-open")) return;
  const actionSummary = extractNoteActionSummary(note.body);
  const digestItems = actionSummary
    ? []
    : (note.aiDigest?.points || [])
        .filter(
          (point) =>
            point !== extractNoteSummary(note.body, 96) &&
            !point.includes("风格圣经第一版"),
        )
        .slice(0, 2);
  dom.hoverPreview.innerHTML = `
    <div class="preview-head">
      <strong>${escapeHTML(formatFullDate(note.date))}</strong>
      <span class="digest-dot ${digestStatus(note)}"></span>
    </div>
    <div class="preview-body">${escapeHTML(extractNoteSummary(note.body, 260))}</div>
    ${
      actionSummary
        ? `<div class="preview-action"><span>本轮目标</span><p>${escapeHTML(actionSummary)}</p></div>`
        : ""
    }
    ${
      digestItems.length
        ? `
      <div class="preview-ai">
        <span class="preview-ai-label">AI DIGEST</span>
        ${digestItems.map((point) => `<span class="preview-ai-item">· ${escapeHTML(point)}</span>`).join("")}
      </div>`
        : ""
    }
    ${
      note.tags.length
        ? `<div class="preview-tags">${note.tags
            .slice(0, 4)
            .map((tag) => `<span>${escapeHTML(tag)}</span>`)
            .join("")}</div>`
        : ""
    }
  `;
  dom.hoverPreview.hidden = false;

  const rect = tile.getBoundingClientRect();
  const previewRect = dom.hoverPreview.getBoundingClientRect();
  let left = rect.right + 12;
  if (left + previewRect.width > window.innerWidth - 16) {
    left = rect.left - previewRect.width - 12;
  }
  left = Math.max(12, left);
  const top = Math.min(
    Math.max(12, rect.top - 20),
    window.innerHeight - previewRect.height - 12,
  );
  dom.hoverPreview.style.left = `${left}px`;
  dom.hoverPreview.style.top = `${top}px`;
}

function hideHoverPreview() {
  dom.hoverPreview.hidden = true;
  hoveredTile = null;
}

function openDrawer(date) {
  const note = noteForDate(date);
  if (!note) return;
  state.selectedDate = date;
  hideHoverPreview();

  dom.drawerDate.textContent = formatFullDate(note.date);
  dom.drawerTags.innerHTML = note.tags.length
    ? note.tags
        .map((tag) => `<span class="drawer-tag">${escapeHTML(tag)}</span>`)
        .join("")
    : '<span class="drawer-tag">无标签</span>';
  dom.drawerBody.innerHTML = renderFormattedNoteBody(note);
  renderDrawerAttachments(note);

  const status = digestStatus(note);
  dom.drawerAiStatus.className = `ai-status-pill ${status}`;
  dom.drawerAiStatus.textContent = digestStatusLabel(note);
  dom.drawerAiStatus.hidden = false;

  if (!note.aiDigest) {
    dom.drawerDigest.innerHTML = `
      <div class="digest-empty">
        还没有 AI 提炼。点击上方“提炼”，预览确认后结果会保存在这一天。
      </div>
    `;
  } else {
    dom.drawerDigest.innerHTML = `
      <ul class="digest-list">
        ${note.aiDigest.points
          .map((point) => `<li>${escapeHTML(point)}</li>`)
          .join("")}
      </ul>
      ${
        note.digestStale
          ? '<div class="digest-stale-note">正文或标签已更新，当前结果可能不再完整。建议重新提炼。</div>'
          : ""
      }
      <div class="digest-meta">
        <span>${escapeHTML(note.aiDigest.model || "AI")}</span>
        <span>${formatDateTime(note.aiDigest.generatedAt)}</span>
      </div>
    `;
  }

  dom.drawerBackdrop.hidden = false;
  dom.detailDrawer.setAttribute("aria-hidden", "false");
  requestAnimationFrame(() => dom.detailDrawer.classList.add("is-open"));
}

function renderDrawerAttachments(note) {
  const referencedImageIds = new Set(
    [
      ...note.body.matchAll(
        /\[\[asset:([0-9a-f-]{36})\]\]|!\s*\[[^\]]*\]\((?:#asset:|\/api\/assets\/)([0-9a-f-]{36})\)/gi,
      ),
    ].map((match) => match[1] || match[2]),
  );
  const attachments = (note.attachments || []).filter(
    (asset) =>
      !(isDisplayImageMime(asset.mimeType) && referencedImageIds.has(asset.id)),
  );
  dom.drawerAttachmentsSection.hidden = attachments.length === 0;
  dom.drawerAttachments.innerHTML = attachments.length
    ? `
      <div class="drawer-attachments-list">
        ${attachments
          .map(
            (asset) =>
              isDisplayImageMime(asset.mimeType)
                ? renderImageAttachmentBlock(asset)
                : `
                  <a class="drawer-attachment" href="${asset.url}" download="${escapeAttribute(asset.name)}">
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/></svg>
                    ${escapeHTML(asset.name)}
                  </a>
                `,
          )
          .join("")}
      </div>
      ${attachments
        .filter((asset) => asset.mimeType.startsWith("audio/"))
        .map(
          (asset) =>
            `<audio class="drawer-audio" controls preload="metadata" src="${asset.url}"></audio>`,
        )
        .join("")}
    `
    : "";
}

function renderFormattedNoteBody(note, { interactive = false } = {}) {
  // Render the Markdown-like body into a safe text flow. Image references are
  // replaced with inline figures, so media no longer appears as a floating card.
  const assetMap = new Map(
    (note.attachments || []).map((asset) => [asset.id, asset]),
  );
  const lines = String(note.body || "").split(/\r?\n/);
  const html = [];
  let paragraph = [];
  let list = [];
  let figureNumber = 0;

  const flushParagraph = () => {
    if (!paragraph.length) return;
    html.push(
      `<p>${paragraph.map((line) => renderInlineMarkdown(line)).join("<br>")}</p>`,
    );
    paragraph = [];
  };
  const flushList = () => {
    if (!list.length) return;
    html.push(
      `<ul>${list
        .map((item) => `<li>${renderInlineMarkdown(item)}</li>`)
        .join("")}</ul>`,
    );
    list = [];
  };
  const flushAll = () => {
    flushParagraph();
    flushList();
  };

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();
    const trimmed = line.trim();
    if (!trimmed) {
      flushAll();
      continue;
    }
    const assetMatches = [
      ...trimmed.matchAll(
        /\[\[asset:([0-9a-f-]{36})\]\]|!\s*\[[^\]]*\]\((?:#asset:|\/api\/assets\/)([0-9a-f-]{36})\)/gi,
      ),
    ];
    if (assetMatches.length) {
      flushAll();
      let cursor = 0;
      for (const match of assetMatches) {
        const before = trimmed.slice(cursor, match.index).trim();
        if (before) {
          html.push(`<p>${renderInlineMarkdown(before)}</p>`);
        }
        const asset = assetMap.get(match[1] || match[2]);
        if (asset) {
          figureNumber += 1;
          html.push(renderAssetFigure(asset, figureNumber, interactive));
        }
        cursor = match.index + match[0].length;
      }
      const after = trimmed.slice(cursor).trim();
      if (after) html.push(`<p>${renderInlineMarkdown(after)}</p>`);
      continue;
    }
    if (trimmed.startsWith("# ")) {
      flushAll();
      html.push(
        `<h1 class="doc-style-title">${renderInlineMarkdown(trimmed.slice(2))}</h1>`,
      );
      continue;
    }
    if (trimmed.startsWith("## ")) {
      flushAll();
      html.push(
        `<h2 class="doc-style-section">${renderInlineMarkdown(trimmed.slice(3))}</h2>`,
      );
      continue;
    }
    if (trimmed.startsWith("### ")) {
      flushAll();
      html.push(
        `<h3 class="doc-style-subtitle">${renderInlineMarkdown(trimmed.slice(4))}</h3>`,
      );
      continue;
    }
    if (trimmed.startsWith("-# ")) {
      flushAll();
      html.push(
        `<p class="doc-style-small">${renderInlineMarkdown(trimmed.slice(3))}</p>`,
      );
      continue;
    }
    if (/^[-*]\s+/.test(trimmed)) {
      flushParagraph();
      list.push(trimmed.replace(/^[-*]\s+/, ""));
      continue;
    }
    flushList();
    paragraph.push(line);
  }
  flushAll();
  return html.join("") || '<p class="doc-style-small">暂无正文</p>';
}

function renderInlineMarkdown(value) {
  const stylePattern =
    /\[\[style:(title|section|subtitle|small)\]\]([\s\S]*?)\[\[\/style\]\]/g;
  let output = "";
  let cursor = 0;
  for (const match of value.matchAll(stylePattern)) {
    output += renderInlinePlain(value.slice(cursor, match.index));
    output += `<span class="doc-inline-${match[1]}">${renderInlinePlain(match[2])}</span>`;
    cursor = match.index + match[0].length;
  }
  output += renderInlinePlain(value.slice(cursor));
  return output;
}

function renderInlinePlain(value) {
  if (!value) return "";
  let safe = escapeHTML(value);
  safe = safe.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    (match, label, href) => {
      const decodedHref = href.replaceAll("&amp;", "&");
      if (!/^(https?:\/\/|\/api\/assets\/)/i.test(decodedHref)) return label;
      return `<a href="${escapeAttribute(decodedHref)}" target="_blank" rel="noreferrer">${label}</a>`;
    },
  );
  safe = safe.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  return safe;
}

function renderAssetFigure(asset, number, interactive = false) {
  const title = asset.title || asset.summary || "图片";
  const keyItems = String(asset.keyInfo || "")
    .split(/\n|[；;]/)
    .map((item) => item.trim().replace(/^[-•]\s*/, ""))
    .filter(Boolean)
    .slice(0, 3);
  return `
    <figure class="note-figure">
      <img src="${asset.url}" alt="${escapeAttribute(asset.altText || asset.summary || title)}" loading="lazy" />
      <figcaption>
        <span class="note-figure-number">图 ${number}</span>
        <strong>${escapeHTML(title)}</strong>
        <p class="note-figure-summary"><span>图意摘要</span>${escapeHTML(asset.summary || "图片摘要待补充。")}</p>
        ${
          keyItems.length
            ? `<ul class="note-figure-keyinfo">${keyItems
                .map((item) => `<li>${escapeHTML(item)}</li>`)
                .join("")}</ul>`
            : ""
        }
        ${
          asset.source
            ? `<small class="note-figure-source">来源：${escapeHTML(asset.source)}</small>`
            : ""
        }
        ${
          interactive
            ? `<div class="note-figure-actions">
                <button type="button" data-preview-edit-image="${asset.id}">修改图注</button>
                <button type="button" data-preview-remove-image="${asset.id}">移除图片</button>
              </div>`
            : ""
        }
      </figcaption>
    </figure>
  `;
}

function renderImageAttachmentBlock(asset) {
  return `
    <figure class="drawer-image-figure">
      <img src="${asset.url}" alt="${escapeAttribute(asset.altText || asset.summary || asset.title || "图片")}" loading="lazy" />
      <figcaption>
        <strong>${escapeHTML(asset.title || "图片")}</strong>
        <p>${escapeHTML(asset.summary || "图片摘要待补充。")}</p>
        <a href="${asset.url}" target="_blank" rel="noreferrer">查看原图</a>
      </figcaption>
    </figure>
  `;
}

function closeDrawer() {
  if (!dom.detailDrawer.classList.contains("is-open")) return;
  dom.detailDrawer.classList.remove("is-open");
  dom.detailDrawer.setAttribute("aria-hidden", "true");
  dom.drawerBackdrop.hidden = true;
  state.selectedDate = null;
}

async function deleteNote(date) {
  const note = noteForDate(date);
  if (!note) return;
  const confirmed = await confirmDialog(
    "删除这一天的学习记录？",
    `${formatFullDate(date)} 的正文、标签、附件和 AI 提炼结果都会被永久删除。此操作无法撤销。`,
    "确认删除",
  );
  if (!confirmed) return;
  try {
    await api(`/api/notes/${date}`, { method: "DELETE" });
    state.notes = state.notes.filter((item) => item.date !== date);
    closeDrawer();
    renderMonth();
    if (state.editor.open && state.editor.date === date) {
      state.editor.open = false;
      dom.editorScreen.classList.remove("is-open");
      document.body.style.overflow = "";
    }
    toast("记录已删除");
  } catch (caught) {
    toast(caught.message || "删除失败", "error");
  }
}

async function copyText(text, successMessage = "已复制") {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const helper = document.createElement("textarea");
    helper.value = text;
    helper.style.position = "fixed";
    helper.style.opacity = "0";
    document.body.appendChild(helper);
    helper.select();
    document.execCommand("copy");
    helper.remove();
  }
  toast(successMessage);
}

function toggleTagMenu() {
  if (!dom.tagMenu.hidden) {
    closeTagMenu();
    return;
  }
  renderTagMenu();
  const rect = dom.tagFilterButton.getBoundingClientRect();
  dom.tagMenu.hidden = false;
  const menuRect = dom.tagMenu.getBoundingClientRect();
  dom.tagMenu.style.top = `${rect.bottom + 7}px`;
  dom.tagMenu.style.left = `${Math.min(rect.left, window.innerWidth - menuRect.width - 14)}px`;
  dom.tagFilterButton.setAttribute("aria-expanded", "true");
}

function renderTagMenu() {
  const counts = new Map();
  for (const note of state.notes) {
    for (const tag of note.tags) counts.set(tag, (counts.get(tag) || 0) + 1);
  }
  const tags = [...counts.entries()].sort(
    (a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "zh-CN"),
  );
  dom.tagMenuList.innerHTML = tags.length
    ? tags
        .map(
          ([tag, count]) => `
          <button
            class="tag-menu-item ${state.activeTag === tag ? "active" : ""}"
            data-tag="${escapeAttribute(tag)}"
            type="button"
          >${escapeHTML(tag)} · ${count}</button>
        `,
        )
        .join("")
    : '<span class="tag-menu-empty">添加记录标签后，可在这里筛选。</span>';

  dom.tagMenuList
    .querySelectorAll("[data-tag]")
    .forEach((button) => {
      button.addEventListener("click", () => {
        state.activeTag =
          state.activeTag === button.dataset.tag ? null : button.dataset.tag;
        closeTagMenu();
        updateFilterLabel();
        renderMonth();
      });
    });
}

function closeTagMenu() {
  dom.tagMenu.hidden = true;
  dom.tagFilterButton.setAttribute("aria-expanded", "false");
}

function updateFilterLabel() {
  dom.tagFilterButton.classList.toggle("is-active", Boolean(state.activeTag));
  dom.tagFilterLabel.textContent = state.activeTag || "标签";
  dom.tagFilterButton.title = state.activeTag
    ? `当前按“${state.activeTag}”筛选`
    : "按标签筛选";
}

function openEditor(date) {
  const note = noteForDate(date);
  closeDrawer();
  hideHoverPreview();
  state.editor = {
    open: true,
    date,
    body: note?.body || "",
    tags: [...(note?.tags || [])],
    savedBody: note?.body || "",
    savedTags: [...(note?.tags || [])],
    attachments: [...(note?.attachments || [])],
    wallpaper: note?.wallpaper || null,
    wallpaperPosition: note?.wallpaperPosition || { x: 50, y: 50 },
    wallpaperStyle: note?.wallpaperStyle || {
      overlay: 78,
      blur: 5,
      tone: "none",
    },
    saving: false,
  };
  dom.editorBody.value = state.editor.body;
  dom.editorBody.setSelectionRange(0, 0);
  dom.editorBody.scrollTop = 0;
  dom.editorPreview.scrollTop = 0;
  dom.editorDateLabel.textContent = formatFullDate(date);
  renderEditorTags();
  renderEditorAttachments();
  renderEditorPreview();
  updateTextStyleAvailability();
  closeReplacePanel();
  dom.editorStylePanel.hidden = true;
  updateEditorMeta();
  applyEditorWallpaper();
  state.editorPreviewCollapsed = false;
  updateEditorPreviewVisibility();
  dom.editorScreen.classList.add("is-open");
  dom.editorScreen.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  requestAnimationFrame(() => dom.editorBody.focus());
}

async function closeEditor() {
  if (isEditorDirty()) {
    const confirmed = await confirmDialog(
      "放弃未保存的修改？",
      "当前正文或标签还有修改没有保存。关闭后，这些修改无法恢复。",
      "放弃修改",
    );
    if (!confirmed) return;
  }
  dom.editorScreen.classList.remove("is-open");
  dom.editorScreen.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  state.editor.open = false;
  hideHoverPreview();
}

function handleTagInput(event) {
  if (event.key === "Enter" || event.key === "," || event.key === "，") {
    event.preventDefault();
    addTag(dom.tagInput.value);
    dom.tagInput.value = "";
    return;
  }
  if (event.key === "Backspace" && !dom.tagInput.value && state.editor.tags.length) {
    state.editor.tags.pop();
    renderEditorTags();
    updateEditorMeta();
  }
}

function addTag(rawTag) {
  const tag = rawTag.trim().replace(/^#/, "").slice(0, 20);
  if (!tag) return;
  if (state.editor.tags.includes(tag)) {
    toast("这个标签已经添加过了");
    return;
  }
  if (state.editor.tags.length >= 10) {
    toast("每天最多添加 10 个标签", "error");
    return;
  }
  state.editor.tags.push(tag);
  renderEditorTags();
  updateEditorMeta();
}

function renderEditorTags() {
  dom.editorTags.querySelectorAll(".editor-tag").forEach((tag) => tag.remove());
  const input = dom.tagInput;
  for (const tag of state.editor.tags) {
    const element = document.createElement("span");
    element.className = "editor-tag";
    element.innerHTML = `${escapeHTML(tag)}<button type="button" aria-label="移除标签 ${escapeAttribute(tag)}">×</button>`;
    element.querySelector("button").addEventListener("click", () => {
      state.editor.tags = state.editor.tags.filter((item) => item !== tag);
      renderEditorTags();
      updateEditorMeta();
    });
    dom.editorTags.insertBefore(element, input);
  }
}

function updateEditorMeta() {
  dom.editorCharCount.textContent = `${[...state.editor.body].length} 字`;
  const dirty = isEditorDirty();
  dom.editorDirtyLabel.textContent = state.editor.saving
    ? "正在保存…"
    : dirty
      ? "有未保存修改"
      : "已保存";
  dom.editorDirtyLabel.classList.toggle("dirty", dirty);
  dom.saveButton.disabled = state.editor.saving;
  dom.editorAiButton.disabled =
    state.editor.saving || !state.editor.body.trim();
}

function isEditorDirty() {
  return (
    state.editor.body !== state.editor.savedBody ||
    JSON.stringify(state.editor.tags) !== JSON.stringify(state.editor.savedTags)
  );
}

async function saveEditor({ quiet = false } = {}) {
  if (state.editor.saving) return null;
  if (!state.editor.date) return null;
  if (!state.editor.body.trim()) {
    if (!quiet) toast("正文不能为空", "error");
    dom.editorBody.focus();
    return null;
  }

  state.editor.saving = true;
  dom.saveButton.querySelector(".button-label").textContent = "保存中";
  updateEditorMeta();

  try {
    const note = await api(`/api/notes/${state.editor.date}`, {
      method: "PUT",
      body: JSON.stringify({
        body: state.editor.body,
        tags: state.editor.tags,
      }),
    });
    upsertLocalNote(note);
    state.editor.body = note.body;
    state.editor.tags = [...note.tags];
    state.editor.savedBody = note.body;
    state.editor.savedTags = [...note.tags];
    state.editor.attachments = [...(note.attachments || [])];
    state.editor.wallpaper = note.wallpaper || null;
    state.editor.wallpaperPosition = note.wallpaperPosition || {
      x: 50,
      y: 50,
    };
    state.editor.wallpaperStyle = note.wallpaperStyle || {
      overlay: 78,
      blur: 5,
      tone: "none",
    };
    renderEditorAttachments();
    renderEditorPreview();
    applyEditorWallpaper();
    renderMonth();
    if (!quiet) toast("记录已保存");
    return note;
  } catch (caught) {
    toast(caught.message || "保存失败", "error");
    return null;
  } finally {
    state.editor.saving = false;
    dom.saveButton.querySelector(".button-label").textContent = "保存";
    updateEditorMeta();
  }
}

function getEditorSelection() {
  const start = dom.editorBody.selectionStart;
  const end = dom.editorBody.selectionEnd;
  return {
    start,
    end,
    text: state.editor.body.slice(start, end),
  };
}

function replaceEditorRange(start, end, replacement, nextSelection) {
  const value =
    state.editor.body.slice(0, start) +
    replacement +
    state.editor.body.slice(end);
  state.editor.body = value;
  dom.editorBody.value = value;
  const cursor = nextSelection ?? start + replacement.length;
  dom.editorBody.setSelectionRange(cursor, cursor);
  updateEditorMeta();
}

function copyEditorSelection() {
  const selection = getEditorSelection();
  copyText(selection.text || state.editor.body, selection.text ? "选中文本已复制" : "正文已复制");
}

function toggleReplacePanel() {
  const willOpen = dom.replacePanel.hidden;
  dom.editorStylePanel.hidden = true;
  dom.replacePanel.hidden = !willOpen;
  dom.editorFindButton.classList.toggle("is-active", willOpen);
  if (willOpen) {
    const selection = getEditorSelection();
    dom.replaceFindInput.value = selection.text || "";
    dom.replaceWithInput.value = "";
    (selection.text ? dom.replaceWithInput : dom.replaceFindInput).focus();
  }
}

function closeReplacePanel() {
  dom.replacePanel.hidden = true;
  dom.editorFindButton.classList.remove("is-active");
}

function replaceText(replaceAll) {
  const find = dom.replaceFindInput.value;
  const replacement = dom.replaceWithInput.value;
  if (!find) {
    toast("请输入要查找的文本", "error");
    dom.replaceFindInput.focus();
    return;
  }

  if (replaceAll) {
    const count = state.editor.body.split(find).length - 1;
    if (!count) {
      toast("没有找到匹配文本", "error");
      return;
    }
    replaceEditorRange(0, state.editor.body.length, state.editor.body.split(find).join(replacement));
    toast(`已替换 ${count} 处`);
    return;
  }

  const selection = getEditorSelection();
  let index = state.editor.body.indexOf(find, selection.start);
  if (index < 0) index = state.editor.body.indexOf(find);
  if (index < 0) {
    toast("没有找到匹配文本", "error");
    return;
  }
  replaceEditorRange(index, index + find.length, replacement);
  toast("已替换 1 处");
}

function toggleEditorStylePanel() {
  const willOpen = dom.editorStylePanel.hidden;
  closeReplacePanel();
  dom.editorStylePanel.hidden = !willOpen;
  dom.editorStyleButton.classList.toggle("is-active", willOpen);
}

let quickStyleTimer = null;

function saveQuickEditorStyle() {
  if (!state.preferences) return;
  const editor = {
    ...state.preferences.editor,
    fontFamily: dom.quickFontFamily.value,
    fontSize: Number(dom.quickFontSize.value),
    lineHeight: Number(dom.quickLineHeight.value),
  };
  state.preferences = { ...state.preferences, editor };
  dom.quickFontSizeLabel.textContent = `${editor.fontSize}px`;
  dom.quickLineHeightLabel.textContent = editor.lineHeight.toFixed(1);
  applyPreferences();
  clearTimeout(quickStyleTimer);
  quickStyleTimer = setTimeout(async () => {
    try {
      state.preferences = await api("/api/preferences", {
        method: "PUT",
        body: JSON.stringify({ editor }),
      });
      applyPreferences();
    } catch (caught) {
      toast(caught.message || "文字样式保存失败", "error");
    }
  }, 350);
}

function saveQuickStylePreset() {
  if (!state.preferences) return;
  const stylePreset = dom.quickStylePreset.value;
  state.preferences = { ...state.preferences, stylePreset };
  applyPreferences();
  api("/api/preferences", {
    method: "PUT",
    body: JSON.stringify({ stylePreset }),
  })
    .then((preferences) => {
      state.preferences = preferences;
      applyPreferences();
    })
    .catch((caught) => toast(caught.message || "样式组保存失败", "error"));
}

function applyEditorTextStyle(style) {
  const selection = getEditorSelection();
  if (selection.start === selection.end || !selection.text.trim()) {
    toast("请先用鼠标选中要修改样式的文字", "error");
    updateTextStyleAvailability();
    return;
  }

  let start = selection.start;
  let end = selection.end;
  const before = state.editor.body.slice(0, start);
  const after = state.editor.body.slice(end);
  const openingMatch = before.match(
    /\[\[style:(?:title|section|subtitle|small)\]\]$/,
  );
  const closingMatch = after.match(/^\[\[\/style\]\]/);
  if (openingMatch && closingMatch) {
    start -= openingMatch[0].length;
    end += closingMatch[0].length;
  }

  let content = state.editor.body.slice(start, end);
  content = content
    .replace(/\[\[style:(?:title|section|subtitle|small)\]\]/g, "")
    .replace(/\[\[\/style\]\]/g, "");
  const nextText =
    style === "body"
      ? content
      : `[[style:${style}]]${content}[[/style]]`;
  // Style markers wrap the selected text only; the rest of the paragraph keeps
  // its original markup and selection state.
  replaceEditorRange(start, end, nextText, start + nextText.length);
  dom.editorBody.setSelectionRange(start, start + nextText.length);
  dom.editorBody.focus();
  const labels = {
    title: "标题",
    section: "小标题",
    subtitle: "副标题",
    small: "小字",
    body: "正文",
  };
  toast(`已设为${labels[style] || "正文"}样式`);
  updateTextStyleAvailability();
  renderEditorPreview();
}

function updateTextStyleAvailability() {
  const hasSelection =
    dom.editorBody.selectionStart !== dom.editorBody.selectionEnd;
  dom.quickTextStyle.disabled = !hasSelection;
  dom.styleSelectionHint.textContent = hasSelection
    ? "仅作用于当前选区"
    : "先选中文字";
  dom.styleSelectionHint.classList.toggle("is-ready", hasSelection);
}

function renderEditorAttachments() {
  const attachments = (state.editor.attachments || []).filter(
    (asset) => !isDisplayImageMime(asset.mimeType),
  );
  dom.editorAttachments.hidden = attachments.length === 0;
  dom.editorAttachments.innerHTML = attachments
    .map(
      (asset) => `
        <span class="editor-attachment">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/></svg>
          <a href="${asset.url}" download="${escapeAttribute(asset.name)}">${escapeHTML(asset.name)}</a>
          <button type="button" data-remove-asset="${asset.id}" aria-label="移除附件 ${escapeAttribute(asset.name)}">×</button>
        </span>
      `,
    )
    .join("");
  dom.editorAttachments
    .querySelectorAll("[data-remove-asset]")
    .forEach((button) =>
      button.addEventListener("click", () =>
        removeEditorAttachment(button.dataset.removeAsset),
      ),
    );
}

let editorPreviewTimer = null;

function scheduleEditorPreview() {
  clearTimeout(editorPreviewTimer);
  editorPreviewTimer = setTimeout(renderEditorPreview, 120);
}

function renderEditorPreview() {
  // The editor preview uses the same renderer as the detail drawer, keeping the
  // inline image order and text styles identical while the user is editing.
  const hasBody = Boolean(state.editor.body.trim());
  if (!hasBody) {
    dom.editorPreview.innerHTML =
      '<p class="doc-style-small">开始输入正文后，这里会显示最终排版效果。</p>';
    return;
  }
  dom.editorPreview.innerHTML = renderFormattedNoteBody(
    {
      body: state.editor.body,
      attachments: state.editor.attachments || [],
    },
    { interactive: true },
  );
  dom.editorPreview
    .querySelectorAll("[data-preview-edit-image]")
    .forEach((button) =>
      button.addEventListener("click", () =>
        editImageMetadata(button.dataset.previewEditImage),
      ),
    );
  dom.editorPreview
    .querySelectorAll("[data-preview-remove-image]")
    .forEach((button) =>
      button.addEventListener("click", () =>
        removeEditorAttachment(button.dataset.previewRemoveImage),
      ),
    );
}

function applyEditorWallpaper() {
  const wallpaperUrl = state.editor.wallpaper?.url;
  const position = state.editor.wallpaperPosition || {
    x: 50,
    y: 50,
  };
  const wallpaperStyle = state.editor.wallpaperStyle || {
    overlay: 78,
    blur: 5,
    tone: "none",
  };
  dom.editorScreen.classList.toggle("has-wallpaper", Boolean(wallpaperUrl));
  dom.editorScreen.style.setProperty(
    "--editor-wallpaper",
    wallpaperUrl ? `url("${wallpaperUrl}")` : "none",
  );
  dom.editorScreen.style.setProperty(
    "--editor-wallpaper-position",
    `${position.x}% ${position.y}%`,
  );
  dom.editorScreen.style.setProperty(
    "--editor-wallpaper-opacity",
    String(
      Math.max(0.04, ((100 - wallpaperStyle.overlay) / 100) * 0.72),
    ),
  );
  dom.editorScreen.style.setProperty(
    "--editor-wallpaper-blur",
    `${wallpaperStyle.blur}px`,
  );
  dom.editorScreen.style.setProperty(
    "--editor-wallpaper-tone-filter",
    wallpaperToneFilter(wallpaperStyle.tone),
  );
}

function updateEditorPreviewVisibility() {
  dom.editorDocumentLayout.classList.toggle(
    "preview-collapsed",
    state.editorPreviewCollapsed,
  );
  dom.editorPreviewToggleButton.setAttribute(
    "aria-pressed",
    String(!state.editorPreviewCollapsed),
  );
  const label = dom.editorPreviewToggleButton.querySelector("span");
  if (label) {
    label.textContent = state.editorPreviewCollapsed
      ? "显示预览"
      : "隐藏预览";
  }
}

function toggleEditorPreviewPane() {
  state.editorPreviewCollapsed = !state.editorPreviewCollapsed;
  updateEditorPreviewVisibility();
  if (!state.editorPreviewCollapsed) {
    renderEditorPreview();
  }
}

function setEditorSplitPosition(percent) {
  const ratio = Math.min(68, Math.max(32, percent));
  dom.editorDocumentLayout.style.setProperty(
    "--source-pane-width",
    `${ratio}%`,
  );
  dom.editorSplitter.setAttribute(
    "aria-valuenow",
    String(Math.round(ratio)),
  );
  return ratio;
}

function startEditorSplitDrag(event) {
  if (state.editorPreviewCollapsed) return;
  event.preventDefault();
  dom.editorSplitter.setPointerCapture?.(event.pointerId);
  dom.editorSplitter.classList.add("is-dragging");
  document.body.style.userSelect = "none";

  const onMove = (moveEvent) => {
    const rect = dom.editorDocumentLayout.getBoundingClientRect();
    const percent = ((moveEvent.clientX - rect.left) / rect.width) * 100;
    setEditorSplitPosition(percent);
  };
  const onUp = () => {
    dom.editorSplitter.classList.remove("is-dragging");
    document.body.style.userSelect = "";
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("pointerup", onUp);
    const current = Number(
      dom.editorSplitter.getAttribute("aria-valuenow") || 48,
    );
    persistEditorSplitRatio(current);
  };
  window.addEventListener("pointermove", onMove);
  window.addEventListener("pointerup", onUp, { once: true });
}

function handleSplitterKeydown(event) {
  if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
  event.preventDefault();
  const current = Number(
    dom.editorSplitter.getAttribute("aria-valuenow") || 48,
  );
  const next = setEditorSplitPosition(
    current + (event.key === "ArrowRight" ? 2 : -2),
  );
  persistEditorSplitRatio(next);
}

function persistEditorSplitRatio(editorSplitRatio) {
  if (!state.preferences) return;
  state.preferences = { ...state.preferences, editorSplitRatio };
  api("/api/preferences", {
    method: "PUT",
    body: JSON.stringify({ editorSplitRatio }),
  })
    .then((preferences) => {
      state.preferences = preferences;
      applyPreferences();
    })
    .catch((caught) => toast(caught.message || "分栏宽度保存失败", "error"));
}

async function uploadSelectedFiles() {
  const files = [...(dom.attachmentInput.files || [])];
  dom.attachmentInput.value = "";
  if (!files.length) return;
  const saved = await ensureEditorNoteSaved();
  if (!saved) return;

  dom.editorAttachmentButton.disabled = true;
  const originalLabel = dom.editorAttachmentButton.lastChild.textContent;
  dom.editorAttachmentButton.lastChild.textContent = "上传中";
  try {
    for (const file of files) {
      if (file.size > 10 * 1024 * 1024) {
        toast(`${file.name} 超过 10MB，已跳过`, "error");
        continue;
      }
      const isImage = isDisplayImageMime(file.type);
      const metadata = isImage
        ? await collectImageMetadata(file)
        : null;
      if (isImage && !metadata) continue;
      const data = await fileToBase64(file);
      const asset = await api(`/api/notes/${state.editor.date}/assets`, {
        method: "POST",
        body: JSON.stringify({
          name: file.name,
          mimeType: file.type || "application/octet-stream",
          kind: "attachment",
          data,
          metadata,
        }),
      });
      state.editor.attachments.push(asset);
      insertEditorText(
        isImage
          ? `\n![${String(asset.title || "图片").replace(/[\[\]]/g, "")}](/api/assets/${asset.id})\n`
          : `\n[附件：${file.name}](${asset.url})\n`,
      );
      renderEditorAttachments();
      renderEditorPreview();
    }
    await saveEditor({ quiet: true });
    const refreshed = await api(`/api/notes/${state.editor.date}`);
    upsertLocalNote(refreshed);
    state.editor.attachments = [...(refreshed.attachments || [])];
    renderEditorAttachments();
    renderEditorPreview();
    renderMonth();
    toast("文件已插入并保存到本地");
  } catch (caught) {
    toast(caught.message || "文件上传失败", "error");
  } finally {
    dom.editorAttachmentButton.disabled = false;
    dom.editorAttachmentButton.lastChild.textContent = originalLabel;
  }
}

function collectImageMetadata(file = null, existingAsset = null) {
  const previewUrl = existingAsset?.url || URL.createObjectURL(file);
  const defaultTitle =
    existingAsset?.title ||
    (file?.name ? file.name.replace(/\.[^.]+$/, "") : "图片");
  return new Promise((resolve) => {
    let settled = false;
    const finish = (value) => {
      if (settled) return;
      settled = true;
      if (file) URL.revokeObjectURL(previewUrl);
      resolve(value);
    };
    showModal(
      `
        <div class="modal-head">
          <div>
            <p class="eyebrow">IMAGE INFORMATION</p>
            <h2>${existingAsset ? "修改图片说明" : "插入图片"}</h2>
            <p>读者需要直接看到图意，不只看到文件名。</p>
          </div>
          <button class="icon-button" type="button" id="imageMetaClose" aria-label="关闭">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>
          </button>
        </div>
        <form id="imageMetaForm">
          <div class="modal-body">
            <div class="image-meta-preview">
              <img src="${previewUrl}" alt="待插入图片预览" />
            </div>
            <div class="form-field">
              <label for="imageTitleInput">图片标题</label>
              <input id="imageTitleInput" name="title" type="text" maxlength="120" required value="${escapeAttribute(defaultTitle)}" />
            </div>
            <div class="form-field">
              <label for="imageSummaryInput">图意摘要</label>
              <textarea id="imageSummaryInput" name="summary" rows="3" maxlength="600" required placeholder="说明图片展示了什么、发生了什么变化">${escapeHTML(existingAsset?.summary || "")}</textarea>
              <span class="field-hint">用 1～2 句话概括图意，读者无需打开原图即可理解。</span>
            </div>
            <div class="form-field">
              <label for="imageKeyInfoInput">关键信息</label>
              <textarea id="imageKeyInfoInput" name="keyInfo" rows="3" maxlength="1200" placeholder="每行一条，或使用分号分隔，最多保留 3 条">${escapeHTML(existingAsset?.keyInfo || "")}</textarea>
            </div>
            <div class="appearance-grid">
              <div class="form-field">
                <label for="imageSourceInput">来源</label>
                <input id="imageSourceInput" name="source" type="text" maxlength="200" value="${escapeAttribute(existingAsset?.source || "")}" placeholder="例如：内容运营周报" />
              </div>
              <div class="form-field">
                <label for="imageAltInput">替代文本</label>
                <input id="imageAltInput" name="altText" type="text" maxlength="500" value="${escapeAttribute(existingAsset?.altText || "")}" placeholder="供无障碍阅读使用" />
              </div>
            </div>
          </div>
          <div class="modal-actions">
            <button class="text-button" type="button" id="imageMetaCancel">取消</button>
            <button class="primary-button" type="submit">${existingAsset ? "保存图片说明" : "上传并插入"}</button>
          </div>
        </form>
      `,
      { dismissible: false },
    );

    const cancel = () => {
      closeModal();
      finish(null);
    };
    document.querySelector("#imageMetaClose").addEventListener("click", cancel);
    document.querySelector("#imageMetaCancel").addEventListener("click", cancel);
    document.querySelector("#imageMetaForm").addEventListener("submit", (event) => {
      event.preventDefault();
      const form = new FormData(event.currentTarget);
      const summary = String(form.get("summary") || "").trim();
      if (!summary) {
        toast("请填写图意摘要", "error");
        return;
      }
      const metadata = {
        title: String(form.get("title") || "").trim(),
        summary,
        keyInfo: String(form.get("keyInfo") || "").trim(),
        source: String(form.get("source") || "").trim(),
        altText: String(form.get("altText") || "").trim() || summary,
      };
      closeModal();
      finish(metadata);
    });
  });
}

async function editImageMetadata(assetId) {
  const asset = state.editor.attachments.find((item) => item.id === assetId);
  if (!asset) return;
  const metadata = await collectImageMetadata(null, asset);
  if (!metadata) return;
  try {
    const updated = await api(`/api/assets/${assetId}`, {
      method: "PATCH",
      body: JSON.stringify(metadata),
    });
    state.editor.attachments = state.editor.attachments.map((item) =>
      item.id === assetId ? updated : item,
    );
    renderEditorAttachments();
    renderEditorPreview();
    const refreshed = await api(`/api/notes/${state.editor.date}`);
    upsertLocalNote(refreshed);
    renderMonth();
    toast("图片说明已更新");
  } catch (caught) {
    toast(caught.message || "图片说明保存失败", "error");
  }
}

function openWallpaperDialog(date) {
  const note = noteForDate(date);
  if (!note) {
    openEditor(date);
    toast("请先保存当天记录，再设置壁纸");
    return;
  }
  const images = [
    ...(note.wallpaper ? [note.wallpaper] : []),
    ...(note.attachments || []).filter(
      (asset) =>
        isDisplayImageMime(asset.mimeType) &&
        asset.id !== note.wallpaper?.id,
    ),
  ];
  let selectedAssetId = note.wallpaper?.id || null;
  let selectedFile = null;
  let previewUrl = note.wallpaper?.url || "";
  let draftPosition = {
    x: note.wallpaperPosition?.x ?? 50,
    y: note.wallpaperPosition?.y ?? 50,
  };
  let draftStyle = {
    overlay: note.wallpaperStyle?.overlay ?? 78,
    blur: note.wallpaperStyle?.blur ?? 5,
    tone: note.wallpaperStyle?.tone || "none",
  };
  const previewStyle = (url, position = draftPosition) =>
    url
      ? `background-image:linear-gradient(rgba(24,43,36,.22),rgba(24,43,36,.22)),url("${url}");background-position:${position.x}% ${position.y}%`
      : "";

  showModal(
    `
      <div class="modal-head">
        <div>
          <p class="eyebrow">DAILY WALLPAPER</p>
          <h2>${formatFullDate(date)}的壁纸</h2>
          <p>壁纸会同时应用到日历格子和编辑页面。</p>
        </div>
        <button class="icon-button" data-modal-close aria-label="关闭">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>
        </button>
      </div>
      <div class="modal-body">
        <div class="wallpaper-preview" id="wallpaperPreview" role="application" aria-label="拖动图片选择壁纸位置" tabindex="0" style="${previewStyle(previewUrl)}">
          <div class="wallpaper-preview-image" id="wallpaperPreviewImage"></div>
          <div class="wallpaper-preview-shade" id="wallpaperPreviewShade"></div>
          <span>${previewUrl ? "当前预览" : "尚未设置壁纸"}</span>
          <small class="wallpaper-focus-hint" id="wallpaperFocusHint">拖动画面选择保留区域 · ${Math.round(draftPosition.x)}% / ${Math.round(draftPosition.y)}%</small>
        </div>
        <div class="appearance-grid wallpaper-style-grid">
          <div class="form-field">
            <label for="wallpaperOverlayInput">格子遮罩</label>
            <div class="range-field">
              <input id="wallpaperOverlayInput" type="range" min="0" max="90" value="${draftStyle.overlay}" />
              <output id="wallpaperOverlayOutput">${draftStyle.overlay}%</output>
            </div>
          </div>
          <div class="form-field">
            <label for="wallpaperBlurInput">背景模糊</label>
            <div class="range-field">
              <input id="wallpaperBlurInput" type="range" min="0" max="14" value="${draftStyle.blur}" />
              <output id="wallpaperBlurOutput">${draftStyle.blur}px</output>
            </div>
          </div>
          <div class="form-field">
            <label for="wallpaperToneSelect">图片调性</label>
            <select id="wallpaperToneSelect">
              <option value="none" ${draftStyle.tone === "none" ? "selected" : ""}>保持原色</option>
              <option value="mono" ${draftStyle.tone === "mono" ? "selected" : ""}>黑白高反差</option>
              <option value="cool" ${draftStyle.tone === "cool" ? "selected" : ""}>冷色电影</option>
              <option value="warm" ${draftStyle.tone === "warm" ? "selected" : ""}>暖色胶片</option>
            </select>
          </div>
        </div>
        <div class="appearance-actions">
          <button class="secondary-button" type="button" id="wallpaperUploadButton">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 16V4"/><path d="m7 9 5-5 5 5"/><path d="M5 20h14"/></svg>
            上传图片
          </button>
          <button class="text-button" type="button" id="wallpaperRemoveButton" ${note.wallpaper ? "" : "disabled"}>移除壁纸</button>
          <input id="wallpaperFileInput" type="file" accept="image/jpeg,image/png,image/webp,image/gif" hidden />
        </div>
        <div class="form-field">
          <label>使用当天已插入的图片</label>
          ${
            images.length
              ? `<div class="wallpaper-picker">
                  ${images
                    .map(
                      (asset) => `
                        <button
                          class="wallpaper-option ${asset.id === selectedAssetId ? "is-selected" : ""}"
                          type="button"
                          data-wallpaper-asset="${asset.id}"
                          title="${escapeAttribute(asset.title || asset.summary || "图片")}"
                        >
                          <img src="${asset.url}" alt="${escapeAttribute(asset.altText || asset.summary || asset.title || "图片")}" />
                        </button>
                      `,
                    )
                    .join("")}
                </div>`
              : '<span class="field-hint">当天还没有可选择的图片，可先上传一张。</span>'
          }
        </div>
      </div>
      <div class="modal-actions">
        <button class="text-button" type="button" data-modal-close>取消</button>
        <button class="primary-button" type="button" id="applyWallpaperButton">应用壁纸</button>
      </div>
    `,
    { dismissible: true },
  );

  const preview = document.querySelector("#wallpaperPreview");
  const previewImage = document.querySelector("#wallpaperPreviewImage");
  const previewShade = document.querySelector("#wallpaperPreviewShade");
  const focusHint = document.querySelector("#wallpaperFocusHint");
  const overlayInput = document.querySelector("#wallpaperOverlayInput");
  const overlayOutput = document.querySelector("#wallpaperOverlayOutput");
  const blurInput = document.querySelector("#wallpaperBlurInput");
  const blurOutput = document.querySelector("#wallpaperBlurOutput");
  const toneSelect = document.querySelector("#wallpaperToneSelect");
  const fileInput = document.querySelector("#wallpaperFileInput");
  const updateWallpaperPreview = () => {
    preview.style.cssText = "";
    previewImage.style.backgroundImage = previewUrl
      ? `url("${previewUrl}")`
      : "";
    previewImage.style.backgroundPosition =
      `${draftPosition.x}% ${draftPosition.y}%`;
    previewImage.style.filter =
      `blur(${draftStyle.blur}px) ${wallpaperToneFilter(draftStyle.tone)}`;
    previewShade.style.background =
      `rgba(255, 255, 255, ${draftStyle.overlay / 100})`;
    overlayOutput.textContent = `${draftStyle.overlay}%`;
    blurOutput.textContent = `${draftStyle.blur}px`;
    focusHint.textContent =
      `拖动画面选择保留区域 · ${Math.round(draftPosition.x)}% / ${Math.round(draftPosition.y)}%`;
  };
  const syncDraftStyle = () => {
    draftStyle = {
      overlay: Number(overlayInput.value),
      blur: Number(blurInput.value),
      tone: toneSelect.value,
    };
    updateWallpaperPreview();
  };
  overlayInput.addEventListener("input", syncDraftStyle);
  blurInput.addEventListener("input", syncDraftStyle);
  toneSelect.addEventListener("change", syncDraftStyle);
  updateWallpaperPreview();
  preview.addEventListener("pointerdown", (event) => {
    if (!previewUrl) return;
    event.preventDefault();
    preview.setPointerCapture?.(event.pointerId);
    preview.classList.add("is-dragging");
    const update = (moveEvent) => {
      const rect = preview.getBoundingClientRect();
      draftPosition = {
        x: clampPercent(((moveEvent.clientX - rect.left) / rect.width) * 100),
        y: clampPercent(((moveEvent.clientY - rect.top) / rect.height) * 100),
      };
      updateWallpaperPreview();
    };
    const finish = () => {
      preview.classList.remove("is-dragging");
      window.removeEventListener("pointermove", update);
      window.removeEventListener("pointerup", finish);
    };
    update(event);
    window.addEventListener("pointermove", update);
    window.addEventListener("pointerup", finish, { once: true });
  });
  document.querySelector("#wallpaperUploadButton").addEventListener("click", () => {
    fileInput.click();
  });
  fileInput.addEventListener("change", () => {
    const file = fileInput.files?.[0];
    if (!file) return;
    if (!isDisplayImageMime(file.type) || file.size > 8 * 1024 * 1024) {
      toast("请选择 8MB 以内的 JPG、PNG、WebP 或 GIF 图片", "error");
      return;
    }
    if (previewUrl.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    selectedFile = file;
    selectedAssetId = null;
    previewUrl = URL.createObjectURL(file);
    updateWallpaperPreview();
    preview.querySelector("span").textContent = "待应用的新图片";
    document
      .querySelectorAll(".wallpaper-option")
      .forEach((button) => button.classList.remove("is-selected"));
  });
  document.querySelectorAll("[data-wallpaper-asset]").forEach((button) => {
    button.addEventListener("click", () => {
      const asset = images.find(
        (item) => item.id === button.dataset.wallpaperAsset,
      );
      if (!asset) return;
      if (previewUrl.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
      selectedFile = null;
      selectedAssetId = asset.id;
      previewUrl = asset.url;
      updateWallpaperPreview();
      preview.querySelector("span").textContent = "当前选择";
      document
        .querySelectorAll(".wallpaper-option")
        .forEach((item) => item.classList.toggle("is-selected", item === button));
    });
  });

  document
    .querySelector("#wallpaperRemoveButton")
    .addEventListener("click", async () => {
      try {
        const updatedNote = await api(`/api/notes/${date}/wallpaper`, {
          method: "DELETE",
        });
        upsertLocalNote(updatedNote);
        if (state.editor.open && state.editor.date === date) {
          state.editor.wallpaper = null;
          state.editor.wallpaperPosition = { x: 50, y: 50 };
          state.editor.wallpaperStyle = {
            overlay: 78,
            blur: 5,
            tone: "none",
          };
          applyEditorWallpaper();
        }
        if (state.selectedDate === date) openDrawer(date);
        renderMonth();
        closeModal();
        toast("当天壁纸已移除");
      } catch (caught) {
        toast(caught.message || "移除壁纸失败", "error");
      }
    });

  document
    .querySelector("#applyWallpaperButton")
    .addEventListener("click", async (event) => {
      const button = event.currentTarget;
      if (!selectedFile && !selectedAssetId) {
        toast("请先选择一张图片", "error");
        return;
      }
      button.disabled = true;
      button.textContent = "正在应用…";
      try {
        let payload;
        if (selectedFile) {
          payload = {
            name: selectedFile.name,
            mimeType: selectedFile.type,
            data: await fileToBase64(selectedFile),
            positionX: draftPosition.x,
            positionY: draftPosition.y,
            overlay: draftStyle.overlay,
            blur: draftStyle.blur,
            tone: draftStyle.tone,
          };
        } else {
          payload = {
            assetId: selectedAssetId,
            positionX: draftPosition.x,
            positionY: draftPosition.y,
            overlay: draftStyle.overlay,
            blur: draftStyle.blur,
            tone: draftStyle.tone,
          };
        }
        const updatedNote = await api(`/api/notes/${date}/wallpaper`, {
          method: selectedFile ? "POST" : "PUT",
          body: JSON.stringify(payload),
        });
        upsertLocalNote(updatedNote);
        if (state.editor.open && state.editor.date === date) {
          state.editor.wallpaper = updatedNote.wallpaper;
          state.editor.wallpaperPosition =
            updatedNote.wallpaperPosition || { x: 50, y: 50 };
          state.editor.wallpaperStyle = updatedNote.wallpaperStyle || {
            overlay: 78,
            blur: 5,
            tone: "none",
          };
          applyEditorWallpaper();
        }
        if (state.selectedDate === date) openDrawer(date);
        renderMonth();
        closeModal();
        toast("当天壁纸已应用");
      } catch (caught) {
        button.disabled = false;
        button.textContent = "应用壁纸";
        toast(caught.message || "壁纸应用失败", "error");
      }
    });
}

async function removeEditorAttachment(assetId) {
  const targetAsset = state.editor.attachments.find(
    (asset) => asset.id === assetId,
  );
  const confirmed = await confirmDialog(
    "移除这个附件？",
    "文件会从本地存储中删除，正文中对应的图片块或链接也会一并移除。",
    "移除附件",
  );
  if (!confirmed) return;
  try {
    await api(`/api/assets/${assetId}`, { method: "DELETE" });
    state.editor.attachments = state.editor.attachments.filter(
      (asset) => asset.id !== assetId,
    );
    if (targetAsset) {
      const nextBody = state.editor.body
        .split("\n")
        .filter((line) => !line.includes(targetAsset.url))
        .join("\n")
        .replaceAll(`[[asset:${assetId}]]`, "")
        .replace(
          new RegExp(
            `!\\s*\\[[^\\]]*\\]\\((?:#asset:|/api/assets/)${assetId}\\)`,
            "gi",
          ),
          "",
        );
      if (nextBody !== state.editor.body) {
        replaceEditorRange(0, state.editor.body.length, nextBody);
        await saveEditor({ quiet: true });
      }
    }
    renderEditorAttachments();
    renderEditorPreview();
    const note = noteForDate(state.editor.date);
    if (note) {
      const refreshed = await api(`/api/notes/${state.editor.date}`);
      upsertLocalNote(refreshed);
    }
    toast("附件已移除");
  } catch (caught) {
    toast(caught.message || "附件移除失败", "error");
  }
}

async function ensureEditorNoteSaved() {
  if (noteForDate(state.editor.date) && !isEditorDirty()) {
    return noteForDate(state.editor.date);
  }
  return saveEditor({ quiet: true });
}

function insertEditorText(text) {
  const selection = getEditorSelection();
  replaceEditorRange(
    selection.start,
    selection.end,
    text,
    selection.start + text.length,
  );
  dom.editorBody.focus();
}

async function ensureDigestSource(date) {
  if (
    state.editor.open &&
    state.editor.date === date &&
    isEditorDirty()
  ) {
    return saveEditor({ quiet: true });
  }
  return noteForDate(date);
}

async function polishEditorText() {
  const selection = getEditorSelection();
  const source = selection.text || state.editor.body;
  if (!source.trim()) {
    toast("请先输入或选择要润色的文本", "error");
    dom.editorBody.focus();
    return;
  }
  if (source.length > 20_000) {
    toast("单次润色最多 20000 个字符", "error");
    return;
  }
  state.settings = state.settings || (await api("/api/settings"));
  if (!state.settings.hasKey) {
    toast("请先配置 AI 接口");
    openSettings({ reason: "digest" });
    return;
  }

  const target = selection.text
    ? { start: selection.start, end: selection.end, text: selection.text }
    : { start: 0, end: state.editor.body.length, text: state.editor.body };
  showModal(
    `
      <div class="modal-head">
        <div>
          <p class="eyebrow">AI POLISH</p>
          <h2>重新润色文本</h2>
          <p>${selection.text ? "将对选中的文字进行改写。" : "将对整篇正文进行改写。"}原文只会在你确认后替换。</p>
        </div>
        <button class="icon-button" data-modal-close aria-label="关闭">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>
        </button>
      </div>
      <div class="modal-body">
        <div class="export-options">
          ${polishStyleButton("clear", "表达清楚", "理顺句子结构，适合日常学习记录")}
          ${polishStyleButton("concise", "更加简洁", "删除重复和空话，保留关键信息")}
          ${polishStyleButton("professional", "更专业", "语气自然克制，适合工作笔记")}
          ${polishStyleButton("academic", "更学术", "术语准确，论证更严谨")}
        </div>
      </div>
      <div class="modal-actions">
        <button class="text-button" data-modal-close>取消</button>
      </div>
    `,
    { dismissible: true },
  );
  dom.modal.querySelectorAll("[data-polish-style]").forEach((button) => {
    button.addEventListener("click", () =>
      requestPolish(source, button.dataset.polishStyle, target),
    );
  });
}

function polishStyleButton(style, title, description) {
  return `
    <button class="export-option" data-polish-style="${style}" type="button">
      <span>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l1.4 4.2L18 9l-4.6 1.8L12 15l-1.4-4.2L6 9l4.6-1.8L12 3Z"/></svg>
      </span>
      <span><strong>${title}</strong><small>${description}</small></span>
    </button>
  `;
}

async function requestPolish(source, style, target) {
  showModal(
    `
      <div class="modal-body">
        <div class="digest-loading">
          <div>
            <div class="spinner"></div>
            <strong>正在重新组织文字</strong>
            <p>保持事实和术语不变，只调整表达方式。</p>
          </div>
        </div>
      </div>
    `,
    { dismissible: false },
  );
  try {
    const result = await api("/api/ai/polish", {
      method: "POST",
      body: JSON.stringify({ text: source, style }),
    });
    showPolishPreview(source, result.text, target);
  } catch (caught) {
    showModal(
      `
        <div class="modal-head">
          <div><p class="eyebrow">AI POLISH ERROR</p><h2>润色没有完成</h2><p>正文没有发生变化。</p></div>
        </div>
        <div class="modal-body"><div class="error-box">${escapeHTML(caught.message || "请求失败")}</div></div>
        <div class="modal-actions">
          <button class="text-button" data-modal-close>关闭</button>
          <button class="primary-button" id="retryPolishButton">重试</button>
        </div>
      `,
      { dismissible: true },
    );
    document
      .querySelector("#retryPolishButton")
      .addEventListener("click", () => requestPolish(source, style, target));
  }
}

function showPolishPreview(source, polished, target) {
  const isSelection = target.end - target.start < state.editor.body.length;
  showModal(
    `
      <div class="modal-head">
        <div>
          <p class="eyebrow">POLISH PREVIEW</p>
          <h2>${isSelection ? "选区润色结果" : "全文润色结果"}</h2>
          <p>确认后才会替换编辑器中的文字。</p>
        </div>
        <button class="icon-button" data-modal-close aria-label="关闭">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>
        </button>
      </div>
      <div class="modal-body">
        <div class="preview-note" style="max-height:180px;overflow:auto;white-space:pre-wrap">${escapeHTML(polished)}</div>
      </div>
      <div class="modal-actions">
        <button class="text-button" data-modal-close>取消</button>
        <button class="primary-button" id="applyPolishButton">${isSelection ? "替换选中文本" : "替换全文"}</button>
      </div>
    `,
    { dismissible: true },
  );
  document.querySelector("#applyPolishButton").addEventListener("click", () => {
    const start = state.editor.body.slice(target.start, target.end) === source
      ? target.start
      : state.editor.body.indexOf(source);
    if (start < 0) {
      toast("正文在当前操作期间发生变化，请重新选择", "error");
      closeModal();
      return;
    }
    const end = start + source.length;
    replaceEditorRange(start, end, polished, start + polished.length);
    closeModal();
    dom.editorBody.focus();
    toast("润色结果已应用到正文");
  });
}

function openRecordingDialog() {
  if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
    toast("当前浏览器不支持录音，请使用新版 Chrome 或 Edge", "error");
    return;
  }
  showModal(
    `
      <div class="modal-head">
        <div>
          <p class="eyebrow">VOICE NOTE</p>
          <h2>录音转文字</h2>
          <p>录音保存在本地；浏览器支持实时转写时，文字会同步插入正文。</p>
        </div>
        <button class="icon-button" data-modal-close aria-label="关闭" id="recordingCloseButton">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>
        </button>
      </div>
      <div class="modal-body">
        <div class="recording-panel">
          <div class="recording-orb" id="recordingOrb">
            <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3M8 21h8"/></svg>
          </div>
          <strong id="recordingStatus">准备好后开始录音</strong>
          <div class="recording-time" id="recordingTime">00:00</div>
          <div class="recording-transcript" id="recordingTranscript">实时转写内容会显示在这里。若浏览器不支持转写，仍会保存录音附件。</div>
        </div>
      </div>
      <div class="modal-actions">
        <button class="text-button" data-modal-close id="recordingCancelButton">取消</button>
        <button class="primary-button" id="recordingStartButton">开始录音</button>
        <button class="primary-button" id="recordingStopButton" hidden>停止并插入</button>
      </div>
    `,
    { dismissible: true },
  );
  document
    .querySelector("#recordingStartButton")
    .addEventListener("click", startRecordingSession);
  document
    .querySelector("#recordingStopButton")
    .addEventListener("click", () => stopRecordingSession(false));
}

async function startRecordingSession() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const chunks = [];
    const preferredType = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4"].find(
      (type) => MediaRecorder.isTypeSupported(type),
    );
    const recorder = preferredType
      ? new MediaRecorder(stream, { mimeType: preferredType })
      : new MediaRecorder(stream);
    const session = {
      stream,
      recorder,
      chunks,
      recognition: null,
      finalTranscript: "",
      interimTranscript: "",
      startedAt: Date.now(),
      timer: null,
      speechError: "",
      stopping: false,
    };
    state.recording = session;

    recorder.addEventListener("dataavailable", (event) => {
      if (event.data.size) chunks.push(event.data);
    });
    recorder.start(500);
    setupSpeechRecognition(session);
    session.timer = setInterval(updateRecordingClock, 250);

    state.modalDismissible = false;
    document.querySelector("#recordingStartButton").hidden = true;
    document.querySelector("#recordingStopButton").hidden = false;
    document.querySelector("#recordingCancelButton").hidden = true;
    document.querySelector("#recordingCloseButton").hidden = true;
    document.querySelector("#recordingOrb").classList.add("is-recording");
    document.querySelector("#recordingStatus").textContent = "正在录音";
    updateRecordingTranscript();
  } catch (caught) {
    if (state.recording?.stream) {
      state.recording.stream.getTracks().forEach((track) => track.stop());
    }
    clearInterval(state.recording?.timer);
    state.recording = null;
    toast(
      caught?.name === "NotAllowedError"
        ? "麦克风权限被拒绝，请在浏览器设置中允许访问"
        : "无法开始录音",
      "error",
    );
  }
}

function setupSpeechRecognition(session) {
  const Recognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!Recognition) {
    session.speechError = "当前浏览器不支持实时转写，将只保存录音附件。";
    return;
  }
  try {
    const recognition = new Recognition();
    recognition.lang = "zh-CN";
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.onresult = (event) => {
      let interim = "";
      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const result = event.results[index];
        if (result.isFinal) {
          session.finalTranscript += result[0].transcript;
        } else {
          interim += result[0].transcript;
        }
      }
      session.interimTranscript = interim;
      updateRecordingTranscript();
    };
    recognition.onerror = (event) => {
      session.speechError =
        event.error === "not-allowed"
          ? "实时转写权限不可用，录音仍会保存。"
          : `实时转写暂不可用：${event.error}`;
      updateRecordingTranscript();
    };
    recognition.onend = () => {
      if (
        state.recording &&
        !state.recording.stopping &&
        state.recording.recorder.state !== "inactive"
      ) {
        try {
          recognition.start();
        } catch {
          // The recording can continue without live transcription.
        }
      }
    };
    recognition.start();
    session.recognition = recognition;
  } catch {
    session.speechError = "实时转写启动失败，将只保存录音附件。";
  }
}

function updateRecordingClock() {
  if (!state.recording) return;
  const seconds = Math.floor((Date.now() - state.recording.startedAt) / 1000);
  const minutesText = String(Math.floor(seconds / 60)).padStart(2, "0");
  const secondsText = String(seconds % 60).padStart(2, "0");
  const clock = document.querySelector("#recordingTime");
  if (clock) clock.textContent = `${minutesText}:${secondsText}`;
}

function updateRecordingTranscript() {
  const element = document.querySelector("#recordingTranscript");
  if (!element || !state.recording) return;
  const transcript =
    state.recording.finalTranscript + state.recording.interimTranscript;
  element.textContent =
    transcript ||
    state.recording.speechError ||
    "正在等待语音内容…";
}

async function stopRecordingSession(discard) {
  const session = state.recording;
  if (!session) return;
  session.stopping = true;
  const stopButton = document.querySelector("#recordingStopButton");
  if (stopButton) {
    stopButton.disabled = true;
    stopButton.textContent = "正在保存…";
  }
  document.querySelector("#recordingStatus").textContent = discard
    ? "正在取消…"
    : "正在保存录音与文字";
  document.querySelector("#recordingOrb").classList.remove("is-recording");
  clearInterval(session.timer);
  try {
    session.recognition?.stop();
  } catch {
    // Recognition may already be stopped.
  }

  const stopped = new Promise((resolve) => {
    session.recorder.addEventListener("stop", resolve, { once: true });
  });
  if (session.recorder.state !== "inactive") session.recorder.stop();
  await stopped;
  session.stream.getTracks().forEach((track) => track.stop());
  await new Promise((resolve) => setTimeout(resolve, 300));

  if (discard) {
    state.recording = null;
    closeModal();
    return;
  }

  try {
    const note = await ensureEditorNoteSaved();
    if (!note) throw new Error("正文保存失败，录音尚未插入");
    const mimeType = session.recorder.mimeType || "audio/webm";
    const blob = new Blob(session.chunks, { type: mimeType });
    if (!blob.size) throw new Error("没有获取到录音数据");
    const data = await blobToBase64(blob);
    const extension = mimeType.includes("mp4") ? "m4a" : "webm";
    const now = new Date();
    const asset = await api(`/api/notes/${state.editor.date}/assets`, {
      method: "POST",
      body: JSON.stringify({
        name: `录音-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}-${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}.${extension}`,
        mimeType,
        kind: "audio",
        data,
      }),
    });
    state.editor.attachments.push(asset);
    const transcript = session.finalTranscript.trim();
    if (transcript) insertEditorText(`\n${transcript}\n`);
    insertEditorText(`\n[录音：${asset.name}](${asset.url})\n`);
    await saveEditor({ quiet: true });
    const refreshed = await api(`/api/notes/${state.editor.date}`);
    upsertLocalNote(refreshed);
    state.editor.attachments = [...(refreshed.attachments || [])];
    renderEditorAttachments();
    renderMonth();
    state.recording = null;
    closeModal();
    toast(transcript ? "录音和转写已插入正文" : "录音附件已插入正文");
  } catch (caught) {
    state.recording = null;
    state.modalDismissible = true;
    toast(caught.message || "录音保存失败", "error");
    closeModal();
  }
}

async function runDigest(date) {
  if (!date) return;
  const note = await ensureDigestSource(date);
  if (!note || !note.body.trim()) {
    toast("请先写一些内容，再进行提炼", "error");
    return;
  }

  state.settings = state.settings || (await api("/api/settings"));
  if (!state.settings.hasKey) {
    toast("先配置 AI 服务，再开始提炼");
    openSettings({ reason: "digest" });
    return;
  }

  showModal(
    `
      <div class="modal-body">
        <div class="digest-loading">
          <div>
            <div class="spinner"></div>
            <strong>正在整理今天的学习内容</strong>
            <p>正文将发送给 ${escapeHTML(state.settings.model)}。只有你主动点击提炼时才会发起请求。</p>
          </div>
        </div>
      </div>
    `,
    { dismissible: false, className: "digest-modal" },
  );

  try {
    const result = await api(`/api/ai/digest/${date}`, {
      method: "POST",
      body: "{}",
    });
    showDigestPreview(date, result.digest, note.aiDigest);
  } catch (caught) {
    showDigestError(date, caught);
  }
}

function showDigestPreview(date, digest, previousDigest) {
  const hasPrevious = Boolean(previousDigest?.points?.length);
  showModal(
    `
      <div class="modal-head">
        <div>
          <p class="eyebrow">AI DIGEST PREVIEW</p>
          <h2>提炼结果</h2>
          <p>${formatFullDate(date)} · 共 ${digest.points.length} 条要点</p>
        </div>
        <button class="icon-button" data-modal-close aria-label="关闭">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>
        </button>
      </div>
      <div class="modal-body">
        <div class="preview-card">
          <ul class="digest-list">
            ${digest.points.map((point) => `<li>${escapeHTML(point)}</li>`).join("")}
          </ul>
        </div>
        <div class="preview-note">
          原始正文不会被修改。${hasPrevious ? "确认后将使用新结果替换这一天已有的提炼。" : "确认后，结果会回填到这一天。"}
        </div>
      </div>
      <div class="modal-actions">
        <button class="text-button" data-modal-close>取消</button>
        <button class="primary-button" id="confirmDigestButton">
          ${hasPrevious ? "替换旧提炼" : "确认回填"}
        </button>
      </div>
    `,
    { dismissible: true },
  );

  document.querySelector("#confirmDigestButton").addEventListener(
    "click",
    async (event) => {
      const button = event.currentTarget;
      button.disabled = true;
      button.textContent = "正在回填…";
      try {
        const updatedNote = await api(`/api/notes/${date}/digest`, {
          method: "PUT",
          body: JSON.stringify({ digest }),
        });
        upsertLocalNote(updatedNote);
        renderMonth();
        if (state.selectedDate === date) openDrawer(date);
        closeModal();
        toast("AI 要点已回填到这一天");
      } catch (caught) {
        button.disabled = false;
        button.textContent = hasPrevious ? "替换旧提炼" : "确认回填";
        toast(caught.message || "回填失败", "error");
      }
    },
  );
}

function showDigestError(date, caught) {
  showModal(
    `
      <div class="modal-head">
        <div>
          <p class="eyebrow">AI DIGEST ERROR</p>
          <h2>这次提炼没有完成</h2>
          <p>${formatFullDate(date)} · 原始记录和已有提炼结果都没有变化</p>
        </div>
      </div>
      <div class="modal-body">
        <div class="error-box">${escapeHTML(caught.message || "AI 请求失败")}</div>
      </div>
      <div class="modal-actions">
        <button class="text-button" data-modal-close>关闭</button>
        <button class="primary-button" id="retryDigestButton">重试</button>
      </div>
    `,
    { dismissible: true },
  );
  document
    .querySelector("#retryDigestButton")
    .addEventListener("click", () => runDigest(date));
}

async function openSettings({ reason, tab = "ai" } = {}) {
  if (tab === "appearance") {
    return openAppearanceSettings();
  }
  if (tab === "about") {
    return openAboutSettings();
  }
  try {
    state.settings = await api("/api/settings");
  } catch (caught) {
    toast(caught.message || "读取设置失败", "error");
    return;
  }

  const settings = state.settings;
  const provider =
    settings.provider || inferClientProvider(settings.baseUrl, settings.model);
  const preset = clientProviderPreset(provider);
  const baseUrl = preset?.baseUrl || settings.baseUrl;
  const model =
    provider === "deepseek" && !/^deepseek-/i.test(settings.model)
      ? "deepseek-chat"
      : settings.model;
  const modelOptions =
    provider === "deepseek"
      ? ["deepseek-chat", "deepseek-reasoner"]
      : provider === "openai"
        ? ["gpt-4.1-mini", "gpt-4.1", "gpt-4o-mini"]
        : [];
  const providerDescription =
    provider === "deepseek"
      ? "使用官方 DeepSeek API，默认模型 deepseek-chat。"
      : provider === "openai"
        ? "使用 OpenAI 官方 API。"
        : "适用于其他 OpenAI 兼容服务或代理地址。";

  showModal(
    `
      <div class="modal-head">
        <div>
          <p class="eyebrow">AI CONNECTION</p>
          <h2>AI 提炼设置</h2>
          <p>${reason === "digest" ? "配置完成后再次点击“提炼”即可。" : "选择服务商并测试连接，配置会保存在本机。"}</p>
        </div>
        <button class="icon-button" data-modal-close aria-label="关闭">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>
        </button>
      </div>
      <div class="settings-tabs" aria-label="设置分类">
        <button class="settings-tab is-active" type="button" data-settings-tab="ai">AI 接口</button>
        <button class="settings-tab" type="button" data-settings-tab="appearance">外观与标签</button>
        <button class="settings-tab" type="button" data-settings-tab="about">关于</button>
      </div>
      <form id="settingsForm">
        <div class="modal-body">
          <div class="setting-status ${settings.hasKey ? "" : "missing"}" id="keyStatus">
            <i></i>
            ${settings.hasKey
              ? `API Key 已配置${settings.keySource === "environment" ? "（来自环境变量）" : settings.keySource === "saved" ? "（已加密保存在本机）" : "（仅本次运行有效）"}`
              : "尚未配置 API Key"}
          </div>
          <div class="form-field">
            <label for="providerSelect">服务商</label>
            <select id="providerSelect" name="provider">
              <option value="deepseek" ${provider === "deepseek" ? "selected" : ""}>DeepSeek</option>
              <option value="openai" ${provider === "openai" ? "selected" : ""}>OpenAI</option>
              <option value="custom" ${provider === "custom" ? "selected" : ""}>自定义 / 代理</option>
            </select>
            <span class="field-hint" id="providerDescription">${providerDescription}</span>
          </div>
          <div class="form-field">
            <label for="baseUrlInput">接口地址</label>
            <input id="baseUrlInput" name="baseUrl" type="url" required value="${escapeAttribute(baseUrl)}" />
            <span class="field-hint" id="endpointHint">实际请求地址为“接口地址 /chat/completions”。也可以直接粘贴完整接口地址。</span>
          </div>
          <div class="form-field">
            <label for="modelInput">模型名称</label>
            <input id="modelInput" name="model" type="text" required value="${escapeAttribute(model)}" list="modelOptions" />
            <datalist id="modelOptions">
              ${modelOptions.map((item) => `<option value="${escapeAttribute(item)}"></option>`).join("")}
            </datalist>
            <span class="field-hint">DeepSeek 常用模型：deepseek-chat、deepseek-reasoner。</span>
          </div>
          <div class="form-field">
            <label for="apiKeyInput">API Key</label>
            <input
              id="apiKeyInput"
              name="apiKey"
              type="password"
              autocomplete="off"
              placeholder="${settings.hasKey ? "已配置；留空则保持不变" : "输入你的 API Key"}"
            />
            <span class="field-hint">保存后会使用本机密钥加密后写入本地数据库，不进入浏览器存储或导出文件。</span>
          </div>
          <div class="connection-result" id="connectionResult" hidden></div>
        </div>
        <div class="modal-actions settings-actions">
          <button class="text-button" type="button" data-modal-close>取消</button>
          <button class="secondary-button" id="testConnectionButton" type="button">
            <span class="button-label">测试连接</span>
          </button>
          <button class="primary-button" type="submit">保存设置</button>
        </div>
      </form>
    `,
    { dismissible: true },
  );

  const formElement = document.querySelector("#settingsForm");
  document
    .querySelectorAll("[data-settings-tab]")
    .forEach((button) =>
      button.addEventListener("click", () => {
        if (button.dataset.settingsTab === "appearance") {
          openAppearanceSettings();
        } else if (button.dataset.settingsTab === "about") {
          openAboutSettings();
        }
      }),
    );
  const providerSelect = document.querySelector("#providerSelect");
  const baseUrlInput = document.querySelector("#baseUrlInput");
  const modelInput = document.querySelector("#modelInput");
  const apiKeyInput = document.querySelector("#apiKeyInput");
  const providerDescriptionElement = document.querySelector(
    "#providerDescription",
  );
  const modelOptionsElement = document.querySelector("#modelOptions");
  const connectionResult = document.querySelector("#connectionResult");
  const keyStatus = document.querySelector("#keyStatus");
  let originalProvider = provider;

  providerSelect.addEventListener("change", () => {
    const nextProvider = providerSelect.value;
    const nextPreset = clientProviderPreset(nextProvider);
    if (nextPreset) {
      baseUrlInput.value = nextPreset.baseUrl;
      modelInput.value = nextPreset.model;
    }
    providerDescriptionElement.textContent =
      nextProvider === "deepseek"
        ? "使用官方 DeepSeek API，默认模型 deepseek-chat。"
        : nextProvider === "openai"
          ? "使用 OpenAI 官方 API。"
          : "适用于其他 OpenAI 兼容服务或代理地址。";
    const options =
      nextProvider === "deepseek"
        ? ["deepseek-chat", "deepseek-reasoner"]
        : nextProvider === "openai"
          ? ["gpt-4.1-mini", "gpt-4.1", "gpt-4o-mini"]
          : [];
    modelOptionsElement.innerHTML = options
      .map((item) => `<option value="${escapeAttribute(item)}"></option>`)
      .join("");
    if (nextProvider !== originalProvider) {
      apiKeyInput.placeholder = "切换服务商后，请输入对应的 API Key";
      keyStatus.classList.add("missing");
      keyStatus.innerHTML =
        "<i></i>已切换服务商，请重新填写对应的 API Key";
    } else {
      keyStatus.classList.toggle("missing", !settings.hasKey);
      keyStatus.innerHTML = settings.hasKey
        ? `<i></i>API Key 已配置${settings.keySource === "environment" ? "（来自环境变量）" : settings.keySource === "saved" ? "（已加密保存在本机）" : "（仅本次运行有效）"}`
        : "<i></i>尚未配置 API Key";
    }
    connectionResult.hidden = true;
  });

  apiKeyInput.addEventListener("input", () => {
    if (!apiKeyInput.value.trim()) return;
    keyStatus.classList.remove("missing");
    keyStatus.innerHTML = "<i></i>将使用新填写的 API Key";
  });

  document
    .querySelector("#testConnectionButton")
    .addEventListener("click", async (event) => {
      const button = event.currentTarget;
      const label = button.querySelector(".button-label");
      connectionResult.hidden = false;
      connectionResult.className = "connection-result is-loading";
      connectionResult.textContent = "正在连接服务商…";
      button.disabled = true;
      label.textContent = "测试中";
      try {
        const result = await api("/api/settings/test", {
          method: "POST",
          body: JSON.stringify(readAiSettingsForm(formElement)),
        });
        connectionResult.className = "connection-result is-success";
        connectionResult.textContent = `连接成功 · ${result.model} · ${result.latencyMs}ms`;
      } catch (caught) {
        connectionResult.className = "connection-result is-error";
        connectionResult.textContent = caught.message || "连接测试失败";
      } finally {
        button.disabled = false;
        label.textContent = "测试连接";
      }
    });

  formElement.addEventListener("submit", async (event) => {
    event.preventDefault();
    const values = readAiSettingsForm(formElement);
    if (
      values.provider !== originalProvider &&
      !values.apiKey
    ) {
      toast("切换服务商后，请重新填写对应的 API Key", "error");
      apiKeyInput.focus();
      return;
    }
    const submitButton = formElement.querySelector('[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = "保存中…";
    try {
      state.settings = await api("/api/settings", {
        method: "PUT",
        body: JSON.stringify(values),
      });
      closeModal();
      toast(
        state.settings.hasKey
          ? "AI 设置已保存，现在可以开始提炼"
          : "地址与模型已保存，还需要配置 API Key",
      );
    } catch (caught) {
      submitButton.disabled = false;
      submitButton.textContent = "保存设置";
      toast(caught.message || "设置保存失败", "error");
    }
  });
}

function readAiSettingsForm(form) {
  const data = new FormData(form);
  return {
    provider: data.get("provider"),
    baseUrl: data.get("baseUrl"),
    model: data.get("model"),
    apiKey: data.get("apiKey"),
  };
}

function clientProviderPreset(provider) {
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

function inferClientProvider(baseUrl, model) {
  try {
    const hostname = new URL(baseUrl).hostname.toLowerCase();
    if (hostname.endsWith("deepseek.com") || /^deepseek-/i.test(model)) {
      return "deepseek";
    }
    if (hostname === "api.openai.com" || /^gpt-/i.test(model)) {
      return "openai";
    }
  } catch {
    // Keep the custom provider for an incomplete URL.
  }
  return "custom";
}

async function openAppearanceSettings() {
  try {
    state.preferences = await api("/api/preferences");
  } catch (caught) {
    toast(caught.message || "读取外观设置失败", "error");
    return;
  }

  const preferences = state.preferences;
  let draftTags = [...(preferences.customTags || [])];
  let heroImageUrl = preferences.heroImageUrl || "";
  let draftPosition = {
    x: Number(preferences.hero.positionX) || 50,
    y: Number(preferences.hero.positionY) || 50,
  };
  const positionValue = nearestHeroPosition(
    preferences.hero.positionX,
    preferences.hero.positionY,
  );

  showModal(
    `
      <div class="modal-head">
        <div>
          <p class="eyebrow">APPEARANCE & TAGS</p>
          <h2>外观与标签</h2>
          <p>调整日历图片区、页面动效和正文样式。</p>
        </div>
        <button class="icon-button" data-modal-close aria-label="关闭">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>
        </button>
      </div>
      <div class="settings-tabs" aria-label="设置分类">
        <button class="settings-tab" type="button" data-settings-tab="ai">AI 接口</button>
        <button class="settings-tab is-active" type="button" data-settings-tab="appearance">外观与标签</button>
        <button class="settings-tab" type="button" data-settings-tab="about">关于</button>
      </div>
      <form id="appearanceForm">
        <div class="modal-body">
          <div class="appearance-preview" id="appearancePreview" role="application" aria-label="拖动图片选择显示区域" tabindex="0">
            <div class="appearance-preview-image" id="appearancePreviewImage"></div>
            <div class="appearance-preview-overlay" id="appearancePreviewOverlay"></div>
            <div class="appearance-preview-copy">
              <small>CALENDAR IMAGE</small>
              <strong id="appearancePreviewDay">${new Date().getDate()}</strong>
              <small>拖动画面可选择要保留的位置</small>
            </div>
            <span class="appearance-drag-hint" id="heroFocusOutput">焦点 50% / 50%</span>
          </div>
          <div class="appearance-actions">
            <button class="secondary-button" id="uploadHeroButton" type="button">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 16V4"/><path d="m7 9 5-5 5 5"/><path d="M5 20h14"/></svg>
              ${heroImageUrl ? "更换图片" : "上传图片"}
            </button>
            <button class="text-button" id="removeHeroButton" type="button" ${heroImageUrl ? "" : "disabled"}>移除图片</button>
            <input id="heroImageInput" type="file" accept="image/jpeg,image/png,image/webp,image/gif" hidden />
          </div>
          <div class="appearance-grid">
            <div class="form-field">
              <label for="heroStyleSelect">图片区风格</label>
              <select id="heroStyleSelect">
                <option value="glass" ${preferences.hero.style === "glass" ? "selected" : ""}>晨雾玻璃</option>
                <option value="paper" ${preferences.hero.style === "paper" ? "selected" : ""}>浅色纸张</option>
                <option value="dark" ${preferences.hero.style === "dark" ? "selected" : ""}>深色电影</option>
              </select>
            </div>
            <div class="form-field">
              <label for="heroHeightSelect">图片区高度</label>
              <select id="heroHeightSelect">
                <option value="compact" ${preferences.hero.height === "compact" ? "selected" : ""}>紧凑</option>
                <option value="standard" ${preferences.hero.height === "standard" ? "selected" : ""}>标准</option>
                <option value="tall" ${preferences.hero.height === "tall" ? "selected" : ""}>舒展</option>
              </select>
            </div>
            <div class="form-field">
              <label for="heroToneSelect">图片调性</label>
              <select id="heroToneSelect">
                <option value="none" ${(preferences.hero.tone || "none") === "none" ? "selected" : ""}>保持原色</option>
                <option value="mono" ${preferences.hero.tone === "mono" ? "selected" : ""}>黑白高反差</option>
                <option value="cool" ${preferences.hero.tone === "cool" ? "selected" : ""}>冷色电影</option>
                <option value="warm" ${preferences.hero.tone === "warm" ? "selected" : ""}>暖色胶片</option>
              </select>
            </div>
            <div class="form-field">
              <label for="heroPositionSelect">快速定位</label>
              <select id="heroPositionSelect">
                <option value="center" ${positionValue === "center" ? "selected" : ""}>居中</option>
                <option value="top" ${positionValue === "top" ? "selected" : ""}>偏上</option>
                <option value="bottom" ${positionValue === "bottom" ? "selected" : ""}>偏下</option>
                <option value="left" ${positionValue === "left" ? "selected" : ""}>偏左</option>
                <option value="right" ${positionValue === "right" ? "selected" : ""}>偏右</option>
                <option value="upper-right" ${positionValue === "upper-right" ? "selected" : ""}>右上人物</option>
              </select>
            </div>
            <div class="form-field">
              <label for="heroOverlayInput">遮罩强度</label>
              <div class="range-field">
                <input id="heroOverlayInput" type="range" min="0" max="85" value="${preferences.hero.overlay}" />
                <output id="heroOverlayOutput">${preferences.hero.overlay}%</output>
              </div>
            </div>
            <div class="form-field">
              <label for="editorFontSelect">正文字体</label>
              <select id="editorFontSelect">
                <option value="serif" ${preferences.editor.fontFamily === "serif" ? "selected" : ""}>宋体 / 衬线</option>
                <option value="sans" ${preferences.editor.fontFamily === "sans" ? "selected" : ""}>微软雅黑 / 无衬线</option>
                <option value="mono" ${preferences.editor.fontFamily === "mono" ? "selected" : ""}>等宽字体</option>
              </select>
            </div>
            <div class="form-field">
              <label for="editorFontSizeInput">字号</label>
              <div class="range-field">
                <input id="editorFontSizeInput" type="range" min="13" max="24" value="${preferences.editor.fontSize}" />
                <output id="editorFontSizeOutput">${preferences.editor.fontSize}px</output>
              </div>
            </div>
            <div class="form-field">
              <label for="editorLineHeightInput">行距</label>
              <div class="range-field">
                <input id="editorLineHeightInput" type="range" min="1.5" max="2.4" step="0.1" value="${preferences.editor.lineHeight}" />
                <output id="editorLineHeightOutput">${Number(preferences.editor.lineHeight).toFixed(1)}</output>
              </div>
            </div>
            <div class="form-field">
              <label for="documentStylePresetSelect">统一样式组</label>
              <select id="documentStylePresetSelect">
                <option value="standard" ${preferences.stylePreset === "standard" ? "selected" : ""}>统一排版｜标准运营</option>
                <option value="brand" ${preferences.stylePreset === "brand" ? "selected" : ""}>统一排版｜品牌专题</option>
                <option value="data" ${preferences.stylePreset === "data" ? "selected" : ""}>统一排版｜数据简报</option>
                <option value="review" ${preferences.stylePreset === "review" ? "selected" : ""}>统一排版｜审阅精简</option>
              </select>
            </div>
            <label class="toggle-field">
              <span>页面点击与切换平滑过渡</span>
              <input id="transitionsToggle" type="checkbox" ${preferences.transitions ? "checked" : ""} />
            </label>
          </div>
          <div class="form-field">
            <label>系统自定义标签</label>
            <div class="custom-tag-editor">
              <input id="customTagInput" type="text" maxlength="20" placeholder="例如：算法、读书、待复习" />
              <button class="secondary-button" id="addCustomTagButton" type="button">添加</button>
            </div>
            <div class="custom-tag-list" id="customTagList"></div>
            <span class="field-hint">编辑记录时输入标签会自动提示这些名称。</span>
          </div>
        </div>
        <div class="modal-actions">
          <button class="text-button" type="button" data-modal-close>取消</button>
          <button class="primary-button" type="submit">保存外观设置</button>
        </div>
      </form>
    `,
    { dismissible: true },
  );

  const form = document.querySelector("#appearanceForm");
  const previewImage = document.querySelector("#appearancePreviewImage");
  const previewCanvas = document.querySelector("#appearancePreview");
  const previewOverlay = document.querySelector("#appearancePreviewOverlay");
  const overlay = document.querySelector("#heroOverlayInput");
  const overlayOutput = document.querySelector("#heroOverlayOutput");
  const fontSize = document.querySelector("#editorFontSizeInput");
  const fontSizeOutput = document.querySelector("#editorFontSizeOutput");
  const lineHeight = document.querySelector("#editorLineHeightInput");
  const lineHeightOutput = document.querySelector("#editorLineHeightOutput");
  const heroInput = document.querySelector("#heroImageInput");
  const customTagList = document.querySelector("#customTagList");
  const heroFocusOutput = document.querySelector("#heroFocusOutput");
  const heroToneSelect = document.querySelector("#heroToneSelect");

  function updatePreview() {
    previewImage.style.backgroundImage = heroImageUrl
      ? `url("${heroImageUrl}")`
      : "";
    previewImage.style.backgroundPosition =
      `${draftPosition.x}% ${draftPosition.y}%`;
    previewOverlay.style.background = `rgba(23, 42, 35, ${Number(overlay.value) / 100 + 0.08})`;
    previewImage.style.filter =
      heroToneSelect.value === "mono"
        ? "grayscale(1) contrast(1.08)"
        : heroToneSelect.value === "cool"
          ? "saturate(.72) hue-rotate(8deg)"
          : heroToneSelect.value === "warm"
            ? "saturate(1.08) sepia(.14)"
            : "none";
    heroFocusOutput.textContent =
      `焦点 ${Math.round(draftPosition.x)}% / ${Math.round(draftPosition.y)}%`;
    overlayOutput.textContent = `${overlay.value}%`;
    fontSizeOutput.textContent = `${fontSize.value}px`;
    lineHeightOutput.textContent = Number(lineHeight.value).toFixed(1);
  }

  function renderDraftTags() {
    customTagList.innerHTML = draftTags
      .map(
        (tag) => `
          <span class="custom-tag-chip">
            ${escapeHTML(tag)}
            <button type="button" data-remove-custom-tag="${escapeAttribute(tag)}" aria-label="删除标签 ${escapeAttribute(tag)}">×</button>
          </span>
        `,
      )
      .join("");
    customTagList
      .querySelectorAll("[data-remove-custom-tag]")
      .forEach((button) =>
        button.addEventListener("click", () => {
          draftTags = draftTags.filter(
            (tag) => tag !== button.dataset.removeCustomTag,
          );
          renderDraftTags();
        }),
      );
  }

  function addDraftTag() {
    const input = document.querySelector("#customTagInput");
    const tag = input.value.trim().replace(/^#/, "").slice(0, 20);
    if (!tag) return;
    if (draftTags.includes(tag)) {
      toast("这个标签已经在标签库中");
      return;
    }
    if (draftTags.length >= 30) {
      toast("自定义标签最多 30 个", "error");
      return;
    }
    draftTags.push(tag);
    input.value = "";
    renderDraftTags();
  }

  renderDraftTags();
  updatePreview();
  overlay.addEventListener("input", updatePreview);
  fontSize.addEventListener("input", updatePreview);
  lineHeight.addEventListener("input", updatePreview);
  heroToneSelect.addEventListener("change", updatePreview);
  document
    .querySelector("#heroPositionSelect")
    .addEventListener("change", (event) => {
      const position = heroPositionValue(event.currentTarget.value);
      draftPosition = { x: position.x, y: position.y };
      updatePreview();
    });
  previewCanvas.addEventListener("pointerdown", (event) => {
    if (!heroImageUrl) {
      toast("请先上传图片，再选择显示区域");
      return;
    }
    event.preventDefault();
    previewCanvas.classList.add("is-dragging");
    previewCanvas.setPointerCapture?.(event.pointerId);

    const updateFocus = (moveEvent) => {
      const rect = previewCanvas.getBoundingClientRect();
      draftPosition = {
        x: clampPercent(((moveEvent.clientX - rect.left) / rect.width) * 100),
        y: clampPercent(((moveEvent.clientY - rect.top) / rect.height) * 100),
      };
      updatePreview();
    };
    const finish = () => {
      previewCanvas.classList.remove("is-dragging");
      window.removeEventListener("pointermove", updateFocus);
      window.removeEventListener("pointerup", finish);
      document.querySelector("#heroPositionSelect").value =
        nearestHeroPosition(draftPosition.x, draftPosition.y);
    };
    updateFocus(event);
    window.addEventListener("pointermove", updateFocus);
    window.addEventListener("pointerup", finish, { once: true });
  });
  document
    .querySelector("#addCustomTagButton")
    .addEventListener("click", addDraftTag);
  document.querySelector("#customTagInput").addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addDraftTag();
    }
  });
  document.querySelectorAll("[data-settings-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.settingsTab === "ai") openSettings();
      if (button.dataset.settingsTab === "about") openAboutSettings();
    });
  });

  document.querySelector("#uploadHeroButton").addEventListener("click", () => {
    heroInput.click();
  });
  heroInput.addEventListener("change", async () => {
    const file = heroInput.files?.[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      toast("背景图片不能超过 8MB", "error");
      return;
    }
    try {
      const data = await fileToBase64(file);
      state.preferences = await api("/api/hero-image", {
        method: "POST",
        body: JSON.stringify({
          name: file.name,
          mimeType: file.type,
          data,
        }),
      });
      heroImageUrl = state.preferences.heroImageUrl;
      applyPreferences();
      updatePreview();
      document.querySelector("#removeHeroButton").disabled = false;
      toast("日历图片已更新");
    } catch (caught) {
      toast(caught.message || "图片上传失败", "error");
    }
  });
  document.querySelector("#removeHeroButton").addEventListener("click", async () => {
    try {
      state.preferences = await api("/api/hero-image", { method: "DELETE" });
      heroImageUrl = "";
      applyPreferences();
      updatePreview();
      document.querySelector("#removeHeroButton").disabled = true;
      toast("日历图片已移除");
    } catch (caught) {
      toast(caught.message || "移除图片失败", "error");
    }
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const button = form.querySelector('[type="submit"]');
    button.disabled = true;
    button.textContent = "保存中…";
    try {
      state.preferences = await api("/api/preferences", {
        method: "PUT",
        body: JSON.stringify({
          hero: {
            style: document.querySelector("#heroStyleSelect").value,
            height: document.querySelector("#heroHeightSelect").value,
            overlay: Number(overlay.value),
            positionX: draftPosition.x,
            positionY: draftPosition.y,
            tone: heroToneSelect.value,
          },
          transitions: document.querySelector("#transitionsToggle").checked,
          stylePreset: document.querySelector("#documentStylePresetSelect").value,
          editor: {
            fontFamily: document.querySelector("#editorFontSelect").value,
            fontSize: Number(fontSize.value),
            lineHeight: Number(lineHeight.value),
          },
          customTags: draftTags,
        }),
      });
      applyPreferences();
      closeModal();
      toast("外观与标签设置已保存");
    } catch (caught) {
      button.disabled = false;
      button.textContent = "保存外观设置";
      toast(caught.message || "设置保存失败", "error");
    }
  });
}

async function openAboutSettings() {
  try {
    state.meta = state.meta || (await api("/api/meta"));
  } catch (caught) {
    toast(caught.message || "读取应用信息失败", "error");
    return;
  }
  const meta = state.meta;
  showModal(
    `
      <div class="modal-head">
        <div>
          <p class="eyebrow">ABOUT</p>
          <h2>关于日知</h2>
          <p>本地优先的个人学习记录与图文排版工具。</p>
        </div>
        <button class="icon-button" data-modal-close aria-label="关闭">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>
        </button>
      </div>
      <div class="settings-tabs" aria-label="设置分类">
        <button class="settings-tab" type="button" data-settings-tab="ai">AI 接口</button>
        <button class="settings-tab" type="button" data-settings-tab="appearance">外观与标签</button>
        <button class="settings-tab is-active" type="button" data-settings-tab="about">关于</button>
      </div>
      <div class="modal-body">
        <div class="about-app">
          <img src="/icons/icon-192.png" alt="日知应用图标" />
          <div>
            <span class="about-version">V${escapeHTML(meta.version)}</span>
            <h3>日知</h3>
            <p>每天留下可回看、可检索、可再次使用的一条学习记录。</p>
          </div>
        </div>
        <dl class="about-meta-grid">
          <div><dt>原作者</dt><dd>椿与岸</dd></div>
          <div><dt>版本</dt><dd>V${escapeHTML(meta.version)}</dd></div>
          <div><dt>投稿邮箱</dt><dd><a href="mailto:${escapeAttribute(meta.email)}">${escapeHTML(meta.email)}</a></dd></div>
          <div><dt>运行环境</dt><dd>Node ${escapeHTML(meta.nodeVersion)} · 本地 SQLite</dd></div>
        </dl>
        <div class="about-update">
          <div class="about-update-head">
            <div>
              <strong>检查更新</strong>
              <p>通过 GitHub Release 或仓库版本文件比较当前 V${escapeHTML(meta.version)}。</p>
            </div>
            <button class="secondary-button" type="button" id="checkUpdateButton">检查更新</button>
          </div>
          <div class="update-status" id="updateStatus">
            <span>仓库</span>
            <a href="${escapeAttribute(meta.repository)}" target="_blank" rel="noreferrer">${escapeHTML(meta.repository.replace("https://github.com/", ""))}</a>
          </div>
          <div class="field-hint">
            ${meta.updateCheck?.tokenConfigured
              ? "当前使用环境变量中的 GitHub Token。"
              : "未配置 GITHUB_TOKEN，将使用匿名公共接口；触发频率限制时检查会降级并提示手动访问仓库。"}
          </div>
        </div>
      </div>
      <div class="modal-actions">
        <button class="text-button" data-modal-close>关闭</button>
      </div>
    `,
    { dismissible: true },
  );

  document.querySelectorAll("[data-settings-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.settingsTab === "ai") openSettings();
      if (button.dataset.settingsTab === "appearance") openAppearanceSettings();
    });
  });
  document.querySelector("#checkUpdateButton").addEventListener("click", async (event) => {
    const button = event.currentTarget;
    const status = document.querySelector("#updateStatus");
    button.disabled = true;
    button.textContent = "检查中…";
    status.className = "update-status is-loading";
    status.innerHTML = "<span>状态</span><strong>正在连接 GitHub</strong>";
    try {
      const result = await api("/api/update/check?refresh=1", {
        method: "POST",
        body: "{}",
      });
      if (result.hasUpdate === true) {
        status.className = "update-status is-available";
        status.innerHTML = `
          <span>发现新版本</span>
          <strong>${escapeHTML(result.latestVersion || "仓库有新提交")}</strong>
          <a href="${escapeAttribute(result.releaseUrl || result.repositoryUrl)}" target="_blank" rel="noreferrer">查看更新</a>
        `;
      } else if (result.hasUpdate === false) {
        status.className = "update-status is-current";
        status.innerHTML = `
          <span>当前状态</span>
          <strong>已是最新版本 V${escapeHTML(result.currentVersion)}</strong>
          ${result.latestCommit ? `<small>最新提交：${escapeHTML(result.latestCommit.message.split("\n")[0])}</small>` : ""}
        `;
      } else {
        status.className = "update-status is-unknown";
        status.innerHTML = `
          <span>版本状态</span>
          <strong>暂无法自动判断</strong>
          <small>仓库未提供可比较的版本标签，请前往 GitHub 查看提交。</small>
          ${result.latestCommit ? `<small>最新提交：${escapeHTML(result.latestCommit.sha.slice(0, 8))} · ${escapeHTML(result.latestCommit.message.split("\n")[0])}</small>` : ""}
        `;
      }
      if (!result.tokenConfigured) {
        const hint = document.createElement("small");
        hint.textContent = result.notice;
        status.appendChild(hint);
      }
    } catch (caught) {
      status.className = "update-status is-error";
      status.innerHTML = `<span>检查失败</span><strong>${escapeHTML(caught.message || "无法连接 GitHub")}</strong><a href="${escapeAttribute(meta.repository)}" target="_blank" rel="noreferrer">手动查看仓库</a>`;
    } finally {
      button.disabled = false;
      button.textContent = "重新检查";
    }
  });
}

function nearestHeroPosition(x, y) {
  const positions = {
    center: { x: 50, y: 50 },
    top: { x: 50, y: 28 },
    bottom: { x: 50, y: 74 },
    left: { x: 28, y: 50 },
    right: { x: 74, y: 50 },
    "upper-right": { x: 68, y: 30 },
  };
  return Object.entries(positions)
    .map(([key, position]) => ({
      key,
      distance: Math.hypot(position.x - x, position.y - y),
    }))
    .sort((a, b) => a.distance - b.distance)[0].key;
}

function clampPercent(value) {
  return Math.min(100, Math.max(0, Number(value) || 0));
}

function heroPositionValue(value) {
  const positions = {
    center: { x: 50, y: 50 },
    top: { x: 50, y: 28 },
    bottom: { x: 50, y: 74 },
    left: { x: 28, y: 50 },
    right: { x: 74, y: 50 },
    "upper-right": { x: 68, y: 30 },
  };
  return positions[value] || positions.center;
}

function openExportDialog(preferredDate = null) {
  const selectedMonthNotes = notesForMonth(state.view.year, state.view.month);
  const preferredNote = preferredDate ? noteForDate(preferredDate) : null;
  showModal(
    `
      <div class="modal-head">
        <div>
          <p class="eyebrow">EXPORT NOTES</p>
          <h2>导出学习记录</h2>
          <p>Markdown 适合交给 AI 总结；JSON 用于完整备份。</p>
        </div>
        <button class="icon-button" data-modal-close aria-label="关闭">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>
        </button>
      </div>
      <div class="modal-body">
        <div class="export-options">
          ${
            preferredNote
              ? exportOptionTemplate(
                  "day",
                  "此日记录",
                  `${formatFullDate(preferredNote.date)} · 正文、标签与现有 AI 要点`,
                )
              : ""
          }
          ${exportOptionTemplate(
            "month",
            `${state.view.year}年${state.view.month + 1}月`,
            `${selectedMonthNotes.length} 天记录 · Markdown，仅含日期、标签和原始正文`,
          )}
          ${exportOptionTemplate(
            "all",
            "全部学习记录",
            `${state.notes.length} 天记录 · Markdown，可直接交给 AI 做长期总结`,
          )}
          ${exportOptionTemplate(
            "backup",
            "完整 JSON 备份",
            "包含正文、标签、AI 提炼结果与记录时间",
          )}
        </div>
      </div>
      <div class="modal-actions">
        <button class="text-button" data-modal-close>取消</button>
      </div>
    `,
    { dismissible: true },
  );

  dom.modal.querySelectorAll("[data-export]").forEach((button) => {
    button.addEventListener("click", () => exportData(button.dataset.export, preferredDate));
  });
}

function exportOptionTemplate(type, title, description) {
  return `
    <button class="export-option" data-export="${type}" type="button">
      <span>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/></svg>
      </span>
      <span>
        <strong>${title}</strong>
        <small>${description}</small>
      </span>
    </button>
  `;
}

function exportData(type, preferredDate) {
  const createdAt = new Date().toISOString();
  if (type === "backup") {
    const payload = {
      format: "daily-learning-backup",
      version: 1,
      exportedAt: createdAt,
      notes: state.notes.map(({ digestStale, ...note }) => note),
    };
    downloadFile(
      `日知-完整备份-${todayISO()}.json`,
      JSON.stringify(payload, null, 2),
      "application/json",
    );
    closeModal();
    toast("完整备份已导出");
    return;
  }

  let notes;
  let filename;
  if (type === "day" && preferredDate) {
    notes = [noteForDate(preferredDate)].filter(Boolean);
    filename = `日知-${preferredDate}.md`;
  } else if (type === "month") {
    notes = notesForMonth(state.view.year, state.view.month);
    filename = `日知-${state.view.year}-${String(state.view.month + 1).padStart(2, "0")}.md`;
  } else {
    notes = state.notes;
    filename = `日知-全部记录-${todayISO()}.md`;
  }

  if (!notes.length) {
    toast("所选范围内还没有记录", "error");
    return;
  }

  const label =
    type === "day" && preferredDate
      ? formatFullDate(preferredDate)
      : type === "month"
        ? `${state.view.year}年${state.view.month + 1}月`
        : "全部记录";
  const markdown = buildMarkdown(notes, label);
  downloadFile(filename, `\ufeff${markdown}`, "text/markdown");
  closeModal();
  toast(type === "day" ? "此日记录已导出" : "Markdown 已导出");
}

function buildMarkdown(notes, label) {
  const lines = [
    "# 学习记录",
    "",
    `范围：${label}`,
    `导出时间：${formatDateTime(new Date().toISOString())}`,
    "",
  ];
  for (const note of notes) {
    lines.push(`## ${formatFullDate(note.date)}`);
    if (note.tags.length) lines.push("", `标签：${note.tags.join("、")}`);
    lines.push("", formatBodyForExport(note).trim(), "");
  }
  return lines.join("\n");
}

function formatBodyForExport(note) {
  const assetMap = new Map(
    (note.attachments || []).map((asset) => [asset.id, asset]),
  );
  return String(note.body || "").replace(
    /\[\[asset:([0-9a-f-]{36})\]\]|!\s*\[[^\]]*\]\((?:#asset:|\/api\/assets\/)([0-9a-f-]{36})\)/gi,
    (match, legacyAssetId, markdownAssetId) => {
      const assetId = legacyAssetId || markdownAssetId;
      const asset = assetMap.get(assetId);
      if (!asset) return "";
      const keyItems = String(asset.keyInfo || "")
        .split(/\n|[；;]/)
        .map((item) => item.trim().replace(/^[-•]\s*/, ""))
        .filter(Boolean)
        .slice(0, 3);
      return [
        `![${asset.title || asset.summary || "图片"}](${asset.url})`,
        "",
        `图意摘要：${asset.summary || "图片摘要待补充。"}`,
        ...(keyItems.length
          ? ["关键信息：", ...keyItems.map((item) => `- ${item}`)]
          : []),
        ...(asset.source ? [`来源：${asset.source}`] : []),
      ].join("\n");
    },
  );
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("读取文件失败"));
    reader.readAsDataURL(file);
  });
}

function blobToBase64(blob) {
  return fileToBase64(blob);
}

function downloadFile(filename, content, mime) {
  const blob = new Blob([content], { type: `${mime};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function showModal(html, { dismissible = true, className = "" } = {}) {
  state.modalDismissible = dismissible;
  dom.modal.className = `modal ${className}`.trim();
  dom.modal.innerHTML = html;
  dom.modalLayer.hidden = false;
  document.body.style.overflow = "hidden";

  dom.modal.querySelectorAll("[data-modal-close]").forEach((button) => {
    button.addEventListener("click", closeModal);
  });
}

function closeModal() {
  dom.modalLayer.hidden = true;
  dom.modal.innerHTML = "";
  state.modalDismissible = true;
  if (!dom.editorScreen.classList.contains("is-open")) {
    document.body.style.overflow = "";
  }
}

function confirmDialog(title, message, confirmLabel) {
  return new Promise((resolve) => {
    showModal(
      `
        <div class="modal-head">
          <div>
            <p class="eyebrow">CONFIRM</p>
            <h2>${escapeHTML(title)}</h2>
            <p>${escapeHTML(message)}</p>
          </div>
        </div>
        <div class="modal-actions">
          <button class="text-button" data-confirm="false">继续编辑</button>
          <button class="primary-button" data-confirm="true">${escapeHTML(confirmLabel)}</button>
        </div>
      `,
      { dismissible: false },
    );

    dom.modal.querySelectorAll("[data-confirm]").forEach((button) => {
      button.addEventListener("click", () => {
        const result = button.dataset.confirm === "true";
        closeModal();
        resolve(result);
      });
    });
  });
}

function toast(message, type = "success") {
  const element = document.createElement("div");
  element.className = `toast ${type}`;
  element.textContent = message;
  dom.toastRegion.appendChild(element);
  setTimeout(() => {
    element.style.opacity = "0";
    element.style.transform = "translateY(4px)";
    setTimeout(() => element.remove(), 180);
  }, 2600);
}

function upsertLocalNote(note) {
  const index = state.notes.findIndex((item) => item.date === note.date);
  if (index >= 0) state.notes[index] = note;
  else state.notes.push(note);
  state.notes.sort((a, b) => a.date.localeCompare(b.date));
}

function noteForDate(date) {
  return state.notes.find((note) => note.date === date) || null;
}

function notesForMonth(year, month) {
  const prefix = `${year}-${String(month + 1).padStart(2, "0")}-`;
  return state.notes.filter((note) => note.date.startsWith(prefix));
}

function noteMatchesFilter(note) {
  if (state.activeTag && !note.tags.includes(state.activeTag)) return false;
  if (!state.query) return true;
  const haystack = [
    note.body,
    ...note.tags,
    ...(note.aiDigest?.points || []),
  ]
    .join("\n")
    .toLowerCase();
  return haystack.includes(state.query);
}

function getMonthStats(notes) {
  return {
    points: notes.reduce((sum, note) => sum + estimatePointCount(note.body), 0),
    digests: notes.filter((note) => note.aiDigest?.points?.length).length,
  };
}

function estimatePointCount(body) {
  const lines = body
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const bullets = lines.filter((line) => /^([-*+]|\d+[.)])\s+/.test(line)).length;
  const prose = lines.filter(
    (line) => !/^([-*+]|\d+[.)])\s+/.test(line) && !/^#{1,6}\s+/.test(line),
  ).length;
  return Math.max(1, bullets + Math.ceil(prose / 2));
}

function digestStatus(note) {
  if (!note.aiDigest) return "none";
  return note.digestStale ? "stale" : "fresh";
}

function isDisplayImageMime(mimeType) {
  return /^image\/(jpeg|png|webp|gif)$/i.test(String(mimeType || ""));
}

function wallpaperToneFilter(tone) {
  if (tone === "mono") return "grayscale(1) contrast(1.08)";
  if (tone === "cool") return "saturate(0.72) hue-rotate(8deg)";
  if (tone === "warm") return "saturate(1.08) sepia(0.14)";
  return "none";
}

function digestStatusLabel(note) {
  const status = digestStatus(note);
  if (status === "fresh") return "提炼有效";
  if (status === "stale") return "提炼已过期";
  return "尚未提炼";
}

function stripNoteMarkup(value) {
  return String(value || "")
    .replace(
      /\[\[style:(?:title|section|subtitle|small)\]\]([\s\S]*?)\[\[\/style\]\]/g,
      "$1",
    )
    .replace(/!\[[^\]]*\]\((?:#asset:|\/api\/assets\/)[^)]+\)/gi, " ")
    .replace(/\[\[asset:[0-9a-f-]{36}\]\]/gi, " ")
    .replace(/\[附件：[^\]]+\]\([^)]+\)/g, " ")
    .replace(/\[录音：[^\]]+\]\([^)]+\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1");
}

function extractNoteTitle(body) {
  const heading = String(body || "").match(/^\s*#\s+(.+)$/m);
  if (heading) {
    return cleanPreview(stripNoteMarkup(heading[1]), 36);
  }
  return extractNoteSummary(body, 30) || "学习记录";
}

function extractNoteSummary(body, maxLength = 96) {
  const text = String(body || "")
    .split(/\r?\n/)
    .map((line) => {
      const trimmed = stripNoteMarkup(line)
        .replace(/^#{1,3}\s+/, "")
        .replace(/^-#\s+/, "")
        .replace(/^[-*+]\s+/, "")
        .replace(/\s+/g, " ")
        .trim();
      return trimmed;
    })
    .filter(Boolean);

  const title = String(body || "").match(/^\s*#\s+(.+)$/m)?.[1];
  const cleanedTitle = title ? stripNoteMarkup(title).trim() : "";
  const candidate =
    text.find(
      (line) =>
        !/^(参考|日期[：:]|模型|提示词版本|种子|失败类型|触发条件|修复动作|是否复现)/.test(
          line,
        ) &&
        line !== cleanedTitle &&
        !line.startsWith("CALENDAR IMAGE") &&
        line.length >= 8,
    ) ||
    text.find((line) => line !== cleanedTitle) ||
    cleanedTitle ||
    "暂无摘要";
  return cleanPreview(candidate, maxLength);
}

function extractNoteActionSummary(body) {
  const lines = String(body || "")
    .split(/\r?\n/)
    .map((line) => stripNoteMarkup(line).replace(/^[-*+]\s+/, "").trim())
    .filter(Boolean);
  const actionLine =
    lines.find((line) => /^行动摘要[：:]/.test(line)) ||
    lines.find((line) => /^本轮目标/.test(line));
  if (!actionLine) return "";
  const content = actionLine
    .replace(/^行动摘要[：:]\s*/, "")
    .replace(/^本轮目标(?:是)?[：:]?\s*/, "")
    .replace(/\*\*/g, "");
  const firstSentence = content.split(/[。；]/)[0]?.trim() || content;
  return cleanPreview(firstSentence, 58);
}

function getLunarInfo(date) {
  try {
    const parts = new Intl.DateTimeFormat("zh-CN-u-ca-chinese", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).formatToParts(date);
    const values = Object.fromEntries(
      parts.filter((part) => part.type !== "literal").map((part) => [
        part.type,
        part.value,
      ]),
    );
    return {
      yearName: values.yearName || "",
      monthName: values.month || "",
      dayName: lunarDayName(Number(values.day)),
    };
  } catch {
    return { yearName: "", monthName: "九月", dayName: "初一" };
  }
}

function lunarDayName(day) {
  const numbers = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];
  if (!Number.isFinite(day) || day < 1 || day > 30) return "";
  if (day === 10) return "初十";
  if (day === 20) return "二十";
  if (day === 30) return "三十";
  if (day < 10) return `初${numbers[day - 1]}`;
  if (day < 20) return `十${numbers[day - 11]}`;
  return `廿${numbers[day - 21]}`;
}

function getSolarTerm(date) {
  const terms = [
    "小寒",
    "大寒",
    "立春",
    "雨水",
    "惊蛰",
    "春分",
    "清明",
    "谷雨",
    "立夏",
    "小满",
    "芒种",
    "夏至",
    "小暑",
    "大暑",
    "立秋",
    "处暑",
    "白露",
    "秋分",
    "寒露",
    "霜降",
    "立冬",
    "小雪",
    "大雪",
    "冬至",
  ];
  const minuteOffsets = [
    0, 21208, 42467, 63836, 85337, 107014, 128867, 150921, 173149, 195551,
    218072, 240693, 263343, 285989, 308563, 331033, 353350, 375494, 397447,
    419210, 440795, 462224, 483532, 504758,
  ];
  const year = date.getFullYear();
  for (let index = 0; index < minuteOffsets.length; index += 1) {
    const termDate = new Date(
      31_556_925_974.7 * (year - 1900) +
        minuteOffsets[index] * 60_000 +
        Date.UTC(1900, 0, 6, 2, 5),
    );
    if (
      termDate.getUTCMonth() === date.getMonth() &&
      termDate.getUTCDate() === date.getDate()
    ) {
      return terms[index];
    }
  }
  return "";
}

function cleanPreview(text, maxLength) {
  const normalized = text.replace(/\s+/g, " ").trim();
  return normalized.length > maxLength
    ? `${normalized.slice(0, maxLength)}…`
    : normalized;
}

function shiftMonth(delta) {
  const date = new Date(state.view.year, state.view.month + delta, 1);
  state.view = monthFromDate(date);
  renderMonth();
}

function monthFromDate(date) {
  return { year: date.getFullYear(), month: date.getMonth() };
}

function mondayIndex(date) {
  return (date.getDay() + 6) % 7;
}

function toISODate(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function firstDayOfMonth(year, month) {
  return toISODate(year, month, 1);
}

function todayISO() {
  const now = new Date();
  return toISODate(now.getFullYear(), now.getMonth(), now.getDate());
}

function parseISODate(iso) {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function formatFullDate(iso) {
  const date = parseISODate(iso);
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 ${weekdayNames[date.getDay()]}`;
}

function formatDateTime(iso) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

function simpleHash(text) {
  let hash = 0;
  for (let index = 0; index < text.length; index += 1) {
    hash = (hash << 5) - hash + text.charCodeAt(index);
    hash |= 0;
  }
  return hash;
}

function escapeHTML(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttribute(value) {
  return escapeHTML(value).replaceAll("`", "&#096;");
}
