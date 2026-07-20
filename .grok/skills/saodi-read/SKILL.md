---
name: saodi-read
description: >
  扫地僧 · 藏经阁阅读库助手（项目 Skill）：基于本站书架、扫地僧划线/想法与社区精选数据，
  检索整理笔记、写读后感、做主题学习笔记、阅读周报、公众号选题与深度扩写。
  触发词：个人阅读库、书架、在读、已读、未读、划线、想法、笔记、读后感、阅读周报、
  公众号选题、学习笔记、社区精选、热门划线、高赞点评、微信读书同步、saodi-read。
  Use when the user runs /saodi-read or asks to work from 藏经阁 reading data.
---

# saodi-read — 藏经阁阅读库（项目）

本 Skill 随 **扫地僧 · 藏经阁** 仓库分发，打开本仓库即可用 `/saodi-read`。  
公开说明页：`saodi-read.html`（首页「📚 阅读」入口）。

默认**先读本地静态数据**；只有用户明确要求「同步/更新微信读书」时才调接口。

称呼约定：
- 个人划线 → **扫地僧划线**
- 个人想法 → **扫地僧想法**
- 公开热门划线 / 高赞点评 → **社区精选**（他人内容）

---

## 0. 定位数据根目录 ROOT

所有相对路径（`notes-data.js` 等）相对于 **ROOT = 本仓库根目录**（含 `index.html` / `notes-data.js`）。

按顺序解析，命中即用：

1. 环境变量 `SAODI_READ_ROOT` 或 `SAODISHENG_ROOT`（若设置且目录存在）
2. 当前工作区根若含 `notes-data.js` 或 `notes.html` → 即为 ROOT
3. 本 Skill 位于 `.grok/skills/saodi-read/` 时，向上两级若存在 `notes-data.js` → 即为 ROOT
4. 常见本机路径（存在则用）：
   - `%USERPROFILE%\OneDrive\saodisheng`
   - `%USERPROFILE%\OneDrive\文档\saodisheng`
5. 仍找不到 → 询问用户仓库路径

CLI 检索（优先本仓库脚本）：

```powershell
python .grok/skills/saodi-read/scripts/query_library.py --stats
python .grok/skills/saodi-read/scripts/query_library.py --kw 认知 --limit 20
python .grok/skills/saodi-read/scripts/query_library.py --book 技术与文明
```

也可用 `--root <路径>` 覆盖。

---

## 1. 网站结构（路径地图）

路径均相对 ROOT：

| 能力 | 页面 | 数据来源 |
|------|------|----------|
| 首页入口 | `index.html` → 分区「📚 阅读」 | — |
| 阅读库助手说明 | `saodi-read.html` | 本 Skill 用法与可复制话术 |
| 在读书单 | `reading.html` | 页面内嵌 `const BOOKS = [...]` |
| 已读书单 | `readed.html` | 同上 |
| 未读书单 | `unread.html` | 同上 |
| 划线与想法（主库） | `notes.html` | `notes-data.js` + `notes-social.js` |
| 书单浮层（社区精选） | 在读/已读/未读点击封面 | `notes-social.js` + `social-sheet.js` |

本地预览：在 ROOT 下运行 `serve-pwa.ps1` / `start-server.bat`。

详细字段：`references/data-schema.md`  
站点索引：`references/site-map.md`

---

## 2. 数据怎么获取（优先级）

### A. 本地文件（首选）

在 **ROOT** 下解析，**不要**整文件肉眼阅读几 MB 的 JS。

| 文件 | 全局变量 | 内容 |
|------|----------|------|
| `notes-data.js` | `NOTES_META`, `NOTES` | 有笔记的书 + **扫地僧划线/想法** 全文 |
| `notes-social.js` | `NOTES_SOCIAL_META`, `NOTES_SOCIAL` | 全书 **热门划线 1 条 + 高赞点评 1 条** |
| `reading.html` / `readed.html` / `unread.html` | `const BOOKS` | 书架元数据 |

**解析模板**：

```python
# -*- coding: utf-8 -*-
import json, os, re
from pathlib import Path

def resolve_root() -> Path:
    for key in ("SAODI_READ_ROOT", "SAODISHENG_ROOT"):
        v = os.environ.get(key)
        if v and Path(v).is_dir():
            return Path(v)
    cwd = Path.cwd()
    if (cwd / "notes-data.js").exists() or (cwd / "notes.html").exists():
        return cwd
    # skill 在 .grok/skills/saodi-read/ 时，ROOT 为仓库根
    here = Path(__file__).resolve().parent if "__file__" in dir() else cwd
    for p in (here, *here.parents):
        if (p / "notes-data.js").exists() or (p / "notes.html").exists():
            return p
    raise FileNotFoundError("找不到 saodisheng ROOT，请设置 SAODI_READ_ROOT")

ROOT = resolve_root()

def load_notes():
    t = (ROOT / "notes-data.js").read_text(encoding="utf-8")
    meta = json.loads(re.search(r"NOTES_META = (\{.*?\});", t).group(1))
    start = t.index("window.NOTES = ") + len("window.NOTES = ")
    notes = json.loads(t[start:t.rindex(";")])
    return meta, notes

def load_social():
    t = (ROOT / "notes-social.js").read_text(encoding="utf-8")
    meta = json.loads(re.search(r"NOTES_SOCIAL_META = (\{.*?\});", t).group(1))
    start = t.index("window.NOTES_SOCIAL = ") + len("window.NOTES_SOCIAL = ")
    social = json.loads(t[start:t.rindex(";")])
    return meta, social

def load_books_html(name):
    t = (ROOT / name).read_text(encoding="utf-8")
    i = t.index("const BOOKS = ") + len("const BOOKS = ")
    start = t.index("[", i)
    depth = 0
    for j in range(start, len(t)):
        if t[j] == "[": depth += 1
        elif t[j] == "]":
            depth -= 1
            if depth == 0:
                return json.loads(t[start:j+1])
    raise ValueError(name)
```

### B. 打开网页（辅助）

本地 `http://<host>/notes.html`、`saodi-read.html` 等；检索仍以 JS 数据文件为准。

### C. 微信读书实时接口（仅同步时）

- `WEREAD_API_KEY`（`wrk-...`）
- `POST https://i.weread.qq.com/api/agent/gateway`
- 参数与 `api_name`、`skill_version` 同层平铺（见 **weread-skills**）

常用：`/shelf/sync`、`/user/notebooks`、`/book/bookmarklist`、`/review/list/mine`、`/book/bestbookmarks`、`/review/list`。

**禁止**编造划线/评论；没有数据就说明没有。

---

## 3. 标准工作流

1. 解析 ROOT → 确认 `notes-data.js` 等存在  
2. 定任务：检索 / 整理 / 写作 / 选题 / 周报 / 同步  
3. 定数据：划线想法 / 书架 / 社区精选  
4. 检索过滤（关键词、书名、日期）  
5. 再创作时区分「引用」与「扩写」  
6. 中文交付；长文可写到 ROOT 下用户指定文件  
7. 同步仅在用户明确要求时执行  

时间字段：划线/想法 `date`；在读=最近阅读；已读=读完日；社区 `review.date`。

主题检索：在 title、author、划线 text/chapter、想法 content/abstract 中子串匹配，可扩展近义词。

---

## 4. 能力清单

| 类型 | 做法 |
|------|------|
| 主题划线汇编 | 搜 NOTES → 按书分组 → 学习笔记 |
| 单本深读包 | 划线 + 想法 + 社区热门/高赞 |
| 读后感 | 800–2000 字，带金句 |
| 深度扩写 | 标明素材来自哪些划线 |
| 阅读周报 | 近 N 天统计 + 洞见 |
| 公众号选题 | 5 个选题（标题+角度+书） |
| 书架盘点 | 在读/已读/未读与分类 |
| 数据刷新 | 说明需重导 notes / social |

---

## 5. 可复用话术

1. 「从阅读库找出关于『认知科学』的所有划线，整理成学习笔记」  
2. 「基于最近一个月读的书和评论，策划 5 个公众号选题」  
3. 「把《技术与文明》的划线和想法扩成 2000 字」  
4. 「生成本周阅读周报」  
5. 「对比扫地僧划线与社区热门划线」  
6. 「/saodi-read 未读书单里财经类挑 3 本」  

---

## 6. 输出约定

- 列表：书名 · 作者 · 日期 · 类型  
- 划线：`>` 引用  
- 想法：abstract 原文 + content  
- 文首注明素材条数与数据截至时间（META.generatedAt）  

---

## 7. 边界

- 不泄露 `WEREAD_API_KEY`  
- 社区点评注明「读者评论」  
- 不擅自 push / 改站，除非用户要求  
- 数据为快照，非实时  
