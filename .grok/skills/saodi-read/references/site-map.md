# 藏经阁 · 阅读库站点地图

数据仓库根 **ROOT**：本机 `saodisheng` 目录（扫地僧 · 藏经阁 PWA）。  
全局 Skill 通过 `SAODI_READ_ROOT` / 自动探测定位 ROOT；下列路径均相对 ROOT。

## 首页入口

`index.html` → 分区 **📚 阅读**

| 卡片 | 链接 |
|------|------|
| 在读书单 | `reading.html` |
| 已读书单 | `readed.html` |
| 未读书单 | `unread.html` |
| 划线与想法 | `notes.html` |
| 阅读库助手 | `saodi-read.html` |

## 页面职责

### reading.html — 在读
- 条件：未读完且有阅读记录（`readUpdateTime > 0`）
- 数据：页面内 `const BOOKS`
- 交互：点封面 → `social-sheet.js` 浮层（社区精选）→ 可打开微信读书
- 导航：在读 / 已读完 / 未读 / 划线
- 快捷键：`H` 回首页；左上角 🏠

### readed.html — 已读完
- 条件：`finishReading == 1`
- 排序：读完时间倒序
- 数据与交互同在读结构

### unread.html — 未读
- 条件：未读完且无阅读记录
- 排序：书籍更新时间倒序

### notes.html — 划线与想法（核心）
- 脚本：`notes-data.js`、`notes-social.js`
- 列表 → 沉浸阅读页
- 标签：**全部** / **扫地僧划线** / **扫地僧想法** / **社区精选**
- 社区精选：热门划线 1 条 + 高赞点评 1 条
- 字号 A+/A−，复制单条/本页

## 支撑脚本

| 文件 | 作用 |
|------|------|
| `notes-data.js` | 个人笔记快照 |
| `notes-social.js` | 社区精选快照（按 bookId） |
| `social-sheet.js` | 书单页底部浮层 |
| `theme-boot.js` | 主题 |
| `serve-pwa.ps1` / `start-server.bat` | 本地服务 |

## 与微信读书关系

静态页是**导出快照**，不是实时 API 代理。刷新需重新从微信读书拉数据并覆盖上述 JS/HTML 书单页。
