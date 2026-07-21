# CLAUDE.md

扫地僧 · 藏经阁项目指令。本文件同时为 `.grok/skills/saodi-read/SKILL.md` 的 Claude Code 等价实现。

---

## 0. 数据根目录

本文件所在目录即为 ROOT（含 `index.html`、`notes-data.js` 等）。

---

## 1. 网站结构

| 能力 | 页面 | 数据来源 |
|------|------|----------|
| 首页入口 | `index.html` → 分区「📚 阅读」 | — |
| 阅读库助手说明 | `saodi-read.html` | saodi-read 用法与可复制话术 |
| 在读书单 | `reading.html` | 页面内嵌 `const BOOKS = [...]` |
| 已读书单 | `readed.html` | 同上 |
| 未读书单 | `unread.html` | 同上 |
| 划线与想法（主库） | `notes.html` | `notes-data.js` + `notes-social.js` |
| 书单浮层（社区精选） | reading/readed/unread 点封面 | `notes-social.js` + `social-sheet.js` |

---

## 2. 数据获取

### A. 本地文件（首选）

| 文件 | 全局变量 | 内容 |
|------|----------|------|
| `notes-data.js` | `NOTES_META`, `window.NOTES` | 有笔记的书 + 扫地僧划线/想法全文 |
| `notes-social.js` | `NOTES_SOCIAL_META`, `window.NOTES_SOCIAL` | 全书热门划线 1 条 + 高赞点评 1 条 |
| `reading.html` / `readed.html` / `unread.html` | `const BOOKS` | 书架元数据 |

解析方式：用 Python 或 Node 正则提取 JSON，不整文件肉眼读。参考脚本：`.grok/skills/saodi-read/scripts/query_library.py`

CLI 检索：
```powershell
python .grok/skills/saodi-read/scripts/query_library.py --stats
python .grok/skills/saodi-read/scripts/query_library.py --kw 认知 --limit 20
python .grok/skills/saodi-read/scripts/query_library.py --book 技术与文明
```

### B. 微信读书实时接口（仅同步时）

通过 weread-skills 调用。禁止编造划线/评论；没有数据就说明没有。

---

## 3. 称呼约定

- 个人划线 → **扫地僧划线**
- 个人想法 → **扫地僧想法**
- 公开热门划线 / 高赞点评 → **社区精选**（他人内容）

---

## 4. 能力清单

| 类型 | 做法 |
|------|------|
| 主题划线汇编 | 搜 NOTES → 按书分组 → 学习笔记 |
| 单本深读包 | 划线 + 想法 + 社区热门/高赞 |
| 读后感 | 800–2000 字，带金句，标明素材来源 |
| 深度扩写 | 标明素材来自哪些划线 |
| 阅读周报 | 近 N 天统计 + 洞见 |
| 公众号选题 | 5 个选题（标题+角度+书） |
| 书架盘点 | 在读/已读/未读与分类 |
| 数据刷新 | 说明需重导 notes / social |

---

## 5. 输出约定

- 列表：书名 · 作者 · 日期 · 类型
- 划线引用：`>` 块引用
- 想法：abstract 原文 + content
- 文首注明素材条数与数据截至时间（NOTES_META.generatedAt）
- 社区点评注明「读者评论」
- 不泄露 `WEREAD_API_KEY`
- 不擅自 push / 改站，除非用户要求

---

## 6. 可复用话术

1. 「从阅读库找出关于『认知科学』的所有划线，整理成学习笔记」
2. 「基于最近一个月读的书和评论，策划 5 个公众号选题」
3. 「把《技术与文明》的划线和想法扩成 2000 字」
4. 「生成本周阅读周报」
5. 「对比扫地僧划线与社区热门划线」
6. 「未读书单里财经类挑 3 本」
