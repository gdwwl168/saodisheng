# article/ · Markdown 草稿约定

本目录**只放 `.md` 草稿**，给人写、改、备份用。  
**不参与**站点运行：手机上的文章库读的是 `saodi-do.html` + `saodi-do-data.js`。

---

## 分工

| 阶段 | 放哪 | 说明 |
|------|------|------|
| 素材 | `notes.html` / 划线 | 扫地僧划线、想法 |
| **草稿** | **`article/*.md`** | Mark Text 打开写；可反复改 |
| **定稿上架** | `saodi-do-data.js` | 进文章库，可阅读、带格式复制 |
| 阅读入口 | `saodi-do.html` | 首页「📚 阅读 → 文章库」 |

读后感上架时务必填 **`no`**（= `notes-data.js` 有划线书序），与「划线与想法」**同号同书**（🕯️ 1 蜡烛 =《技术与文明》…）。

---

## 文件命名

```text
article/
  README.md                      ← 本约定（勿删）
  _template.md                   ← 空白模板（可复制）
  01 · 蜡烛 · 技术与文明.md      ← 序号 + 联想词 + 书名（推荐）
  04 · 帆船 · 袁隆平的世界.md
  认知主题学习笔记.md            ← 非书目读后感可不加序号
```

规则：

1. **只用 `.md`**，不要往这里堆 html / txt / pdf（转换用 markitdown 后再放 md）。
2. **读后感文件名**：`两位序号 · 联想词 · 书名.md`  
   序号与「划线与想法」同号，联想词用 `hints-map.js`（如 `05 · 钩子 · 生命3.0.md`）。
3. 站点 URL 仍用 `saodi-do-data.js` 里的英文/拼音 **`id`**；草稿文首 YAML 可写 `id:` / `no:` 对应。
4. 未定标题可用日期：`2026-07-21-草稿.md`，定稿再改成「序号 · 联想词 · 书名」。

---

## 一篇文章的流程

1. 复制 `_template.md` → 改成 `NN · 联想词 · 书名.md`
2. 用 **Mark Text**（或任意编辑器）写正文  
   - 划线引用用 `>`  
   - 小标题用 `##`  
   - 强调用 `**黑体**`
3. 改到满意后：说一句  
   **「把 article/某某.md 定稿进文章库」**  
   → 写入 `saodi-do-data.js`（`bodyHtml`），站点即可读
4. 上架后：草稿可留着当源稿，或在文首标 `状态：已上架`

---

## 草稿文首建议（YAML 可选）

```markdown
---
id: jishu-yu-wenming
title: 《技术与文明》读后感：……
date: 2026-07-20
tags: [读后感, 技术]
source: 张笑宇《技术与文明》
status: 草稿
---
```

`status` 可用：`草稿` / `修订中` / `已上架`

---

## 不要做的事

- 不要指望打开 `article/xxx.md` 就出现在文章库列表里（不会自动同步）。
- 不要把定稿只放在 md 里却不上架——手机站读不到。
- 不要把 `saodi-do-data.js` 当草稿本反复手工搓超长 HTML（先 md 再上架更轻松）。

---

## 与工具

- 写 md：**Mark Text**（`D:\Programs\MarkText`）
- PDF/Word → md：`python -m markitdown 文件 -o article/某名.md`
- 从划线生成初稿：`/saodi-read` 后保存到 `article/`
