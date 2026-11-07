# 日知 · 本地学习清单

一个本地优先的每日学习记录工具。每天只有一条记录，以月度拼图回看历史；正文、标签和 AI 提炼结果保存到本机 SQLite，可按日、按月或全部导出。

当前版本：V1.0.0  
原作者：椿与岸  
投稿邮箱：L671456971@gmail.com

## 启动

需要 Node.js 24 或更高版本。

```powershell
npm start
```

然后打开 <http://127.0.0.1:4173>。Windows 也可以双击 `start.cmd` 启动。

如需带应用图标的桌面快捷方式，在 PowerShell 中运行：

```powershell
powershell -ExecutionPolicy Bypass -File .\create-shortcut.ps1
```

网站同时提供 favicon、Apple Touch Icon 和 PWA Manifest；通过 Chrome/Edge 的“安装应用”入口可将日知安装为独立窗口。

项目没有 npm 依赖，不需要 `npm install`。首次运行时会自动创建 `data/study.db`。

开发模式：

```powershell
npm run dev
```

语法检查：

```powershell
npm run check
```

## AI 配置

点击右上角齿轮，填写：

- 服务商：`DeepSeek`、`OpenAI` 或 `自定义 / 代理`
- 接口地址：选择前两项时会自动填写
- 模型名称：选择前两项时会自动匹配默认模型
- API Key

DeepSeek 预设为：

```text
接口地址：https://api.deepseek.com
默认模型：deepseek-chat
可选模型：deepseek-reasoner
```

保存前可以点击“测试连接”。应用也支持直接粘贴完整接口地址（包括 `/chat/completions`），保存时会自动规范化，避免路径重复。

DeepSeek 官方对话 API 的模型名必须是 `deepseek-chat` 或 `deepseek-reasoner`。`deepseek-flash` 等名称不是该接口的可用模型，应用会自动纠正为 `deepseek-chat`。

应用使用 OpenAI 兼容的 `POST /chat/completions` 接口。API Key 会经过本地 AES-256-GCM 加密后写入数据库，不进入浏览器存储或导出文件。加密主密钥保存在 `data/ai-secret.key`，因此备份 API Key 时请将数据库与密钥文件一起保管；只分享导出文件不会泄露 API Key。

也可以使用环境变量，环境变量中的 Key 优先于界面中保存的 Key。

```powershell
$env:AI_API_KEY="your-key"
$env:AI_BASE_URL="https://api.openai.com/v1"
$env:AI_MODEL="gpt-4.1-mini"
npm start
```

DeepSeek 专用环境变量：

```powershell
$env:DEEPSEEK_API_KEY="your-key"
$env:DEEPSEEK_MODEL="deepseek-chat"
npm start
```

## GitHub 更新检查

复制 `.env.example` 为 `.env`，需要提高 GitHub API 限额时填写本地 Token：

```powershell
Copy-Item .env.example .env
```

```text
GITHUB_TOKEN=your_token_here
GITHUB_REPOSITORY=Openteam2/rizhi1
GITHUB_DEFAULT_BRANCH=main
```

`.env` 已被 Git 忽略，Token 不会返回浏览器或写入数据库。未配置 Token 时仍可通过匿名公共接口检查；接口受限或网络不可用时，关于页会明确提示并给出手动访问仓库的入口。

检查顺序为 Release、远端 `package.json` 版本、最新提交。前两项可用于判断版本，只有提交信息时显示为需要人工判断。

发布维护者可将具有目标仓库 Contents 写权限的 `GITHUB_TOKEN` 写入本地 `.env`，然后运行：

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\publish-release.ps1
```

脚本会推送 `main`、推送 `v1.0.0` 标签，并创建或更新 GitHub Release。令牌只从本地 `.env` 或环境变量读取，不写入 Git 配置。

## 本地 API

```text
GET  /api/health
GET  /api/meta
GET  /api/search?q=&tag=&start=&end=&limit=&offset=
GET  /api/stats?month=YYYY-MM
POST /api/update/check
```

完整参数、返回结构和错误码见 [V1.0.0 交付说明](outputs/日知%20V1.0.0%20交付说明.md)。

只有主动点击“提炼”时，当前日期的正文和标签才会发送给所配置的模型。AI 结果先在预览中展示，确认后才回填到当天记录。

AI 请求由本地 Node 服务转发，不经过浏览器跨域请求。遇到短暂网络错误、服务端 5xx 或请求频率限制时最多自动重试两次。可在设置页点击“测试连接”查看真实响应延迟。

## 日历外观与自定义标签

日历顶部显示当天大号日期、农历、干支、星期和节气。点击“更换图片”或打开设置中的“外观与标签”：

- 上传本地图片作为日历背景，支持更换和移除
- 在图片预览中直接拖动画面选择保留区域，并调节图片区风格、调性、高度、焦点和遮罩强度
- 调整正文字体、字号、行距
- 开启或关闭页面点击、切换动画
- 维护系统自定义标签，编辑记录时会自动给出输入建议
- 选择统一排版样式组：标准运营、品牌专题、数据简报、审阅精简

在编辑器工具栏点击“样式”也可以快速调整正文排版。

编辑器默认采用左右分栏：左侧编辑 Markdown 源码，右侧显示完整排版效果，两侧可以独立滚动。拖动中间分隔条可调整宽度，工具栏中的“隐藏预览/显示预览”可以一键切换；分栏比例会保存到本地。

每日壁纸与全局 Banner 参数独立：可分别调整图片位置、格子遮罩、背景模糊和图片调性。首页笔记卡会自动提取标题和第一段有效摘要，并移除 Markdown 符号。

## 编辑器工具

- **复制**：复制选中文字；未选中时复制全文
- **替换**：查找、单次替换或全部替换
- **润色**：选择清楚、简洁、专业或学术风格，AI 返回结果预览后再确认替换
- **样式**：先用鼠标选中文字，再为选区套用标题、小标题、副标题、正文或小字层级；未选中时样式下拉框会禁用
- **文件**：上传最大 10MB 的本地文件；图片必须填写标题和图意摘要后才会插入
- **录音**：录制音频并保存为本地附件；浏览器支持 Web Speech API 时会同步转写文字
- **壁纸**：为当天记录上传图片，或从当天已插入图片中选择；壁纸同步显示在日历格子和编辑页面
- **删除**：在记录详情中永久删除该日正文、标签、附件、录音和 AI 结果

图片插入后会显示为图文块，而不是文件名：

```text
图 1
图片标题
图意摘要：图片展示的内容和变化
关键信息：数字、趋势或编辑结论
来源：资料或部门名称
```

旧图片附件如果没有摘要，会显示“图片摘要待补充”，可在编辑器实时预览的图片块中点击“修改图注”补充。

图片在编辑器中进入“实时排版预览”，与前后文字一起按文本流排列，不再作为独立卡片浮动显示。样式标记保存在 Markdown 正文中，AI 提炼和导出时会读取选区内文字。

录音转写依赖浏览器能力。Chrome/Edge 支持时可直接得到文字；不支持时仍会完整保存录音文件。Web Speech API 的语音处理方式由浏览器决定，部分浏览器可能使用在线语音服务。

## 本地数据

- 数据库：`data/study.db`
- 图片、附件与录音：`data/assets/`
- 已可无需联网使用的功能：记录、编辑、回溯、搜索、标签筛选、Markdown/JSON 导出
- JSON 备份包含正文、标签、附件信息、AI 结果和记录时间
- 完整迁移时请同时备份 `data/study.db`、`data/ai-secret.key` 和 `data/assets/`
- Markdown 导出只包含日期、标签和原始正文，适合交给外部 AI 总结

可以通过环境变量修改端口或数据库位置：

```powershell
$env:PORT="4300"
$env:STUDY_DB_PATH="D:\my-data\study.db"
npm start
```

## 快捷键

- `Ctrl/Cmd + K`：聚焦搜索
- `Ctrl/Cmd + S`：在编辑器中保存
- `Ctrl/Cmd + Enter`：在编辑器中提炼
- `Esc`：关闭详情、弹窗或编辑器
