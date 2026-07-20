# -*- coding: utf-8 -*-
"""检索藏经阁阅读库本地数据（项目 / 全局 Skill 脚本）。

用法:
  python .grok/skills/saodi-read/scripts/query_library.py --stats
  python .grok/skills/saodi-read/scripts/query_library.py --kw 认知 --limit 20
  python .../query_library.py --root "C:\\path\\to\\saodisheng" --shelf
"""
from __future__ import annotations

import argparse
import json
import os
import re
import sys
from datetime import datetime
from pathlib import Path


def _looks_like_root(p: Path) -> bool:
    return p.is_dir() and (
        (p / "notes-data.js").exists()
        or (p / "notes.html").exists()
        or ((p / "index.html").exists() and (p / "reading.html").exists())
    )


def resolve_root(explicit: str | None = None) -> Path:
    if explicit:
        p = Path(explicit).expanduser().resolve()
        if not p.is_dir():
            raise FileNotFoundError(f"--root 不存在: {p}")
        return p

    for key in ("SAODI_READ_ROOT", "SAODISHENG_ROOT"):
        v = os.environ.get(key)
        if v:
            p = Path(v).expanduser()
            if p.is_dir():
                return p.resolve()

    cwd = Path.cwd().resolve()
    if _looks_like_root(cwd):
        return cwd

    # 脚本位于 <ROOT>/.grok/skills/saodi-read/scripts/ 时，向上找仓库根
    here = Path(__file__).resolve().parent
    for p in (here, *here.parents):
        if _looks_like_root(p):
            return p

    home = Path.home()
    candidates = [
        home / "OneDrive" / "saodisheng",
        home / "OneDrive" / "文档" / "saodisheng",
        home / "OneDrive" / "Documents" / "saodisheng",
        Path(r"C:\Users\吴伟龙\OneDrive\saodisheng"),
    ]
    for p in candidates:
        if _looks_like_root(p):
            return p.resolve()

    raise FileNotFoundError(
        "找不到藏经阁 ROOT。请设置环境变量 SAODI_READ_ROOT，或使用 --root <路径>"
    )


def load_notes(root: Path):
    path = root / "notes-data.js"
    if not path.exists():
        return {}, []
    t = path.read_text(encoding="utf-8")
    meta_m = re.search(r"NOTES_META = (\{.*?\});", t)
    meta = json.loads(meta_m.group(1)) if meta_m else {}
    start = t.index("window.NOTES = ") + len("window.NOTES = ")
    notes = json.loads(t[start : t.rindex(";")])
    return meta, notes


def load_social(root: Path):
    path = root / "notes-social.js"
    if not path.exists():
        return {}, {}
    t = path.read_text(encoding="utf-8")
    meta_m = re.search(r"NOTES_SOCIAL_META = (\{.*?\});", t)
    meta = json.loads(meta_m.group(1)) if meta_m else {}
    start = t.index("window.NOTES_SOCIAL = ") + len("window.NOTES_SOCIAL = ")
    social = json.loads(t[start : t.rindex(";")])
    return meta, social


def load_books_html(root: Path, name: str):
    path = root / name
    if not path.exists():
        return []
    t = path.read_text(encoding="utf-8")
    key = "const BOOKS = "
    if key not in t:
        return []
    i = t.index(key) + len(key)
    start = t.index("[", i)
    depth = 0
    for j in range(start, len(t)):
        if t[j] == "[":
            depth += 1
        elif t[j] == "]":
            depth -= 1
            if depth == 0:
                return json.loads(t[start : j + 1])
    return []


def parse_date(s: str | None):
    if not s:
        return None
    try:
        return datetime.strptime(s[:10], "%Y-%m-%d").date()
    except Exception:
        return None


def match_kw(text: str, kws: list[str]) -> bool:
    low = (text or "").lower()
    return all(k.lower() in low for k in kws)


def search(notes, kws, since=None, until=None, book_sub=None, kind=None):
    hits = []
    for b in notes:
        title = b.get("title") or ""
        author = b.get("author") or ""
        if book_sub and book_sub.lower() not in title.lower() and book_sub.lower() not in author.lower():
            continue
        bid = b.get("id")

        if kind in (None, "hl", "划线"):
            for h in b.get("highlights") or []:
                blob = f"{title} {author} {h.get('text','')} {h.get('chapter','')}"
                if kws and not match_kw(blob, kws):
                    continue
                d = parse_date(h.get("date"))
                if since and (not d or d < since):
                    continue
                if until and (not d or d > until):
                    continue
                hits.append(
                    {
                        "type": "扫地僧划线",
                        "book": title,
                        "author": author,
                        "id": bid,
                        "chapter": h.get("chapter") or "",
                        "date": h.get("date") or "",
                        "text": h.get("text") or "",
                    }
                )

        if kind in (None, "idea", "想法"):
            for idea in b.get("ideas") or []:
                blob = (
                    f"{title} {author} {idea.get('content','')} "
                    f"{idea.get('abstract','')} {idea.get('chapter','')}"
                )
                if kws and not match_kw(blob, kws):
                    continue
                d = parse_date(idea.get("date"))
                if since and (not d or d < since):
                    continue
                if until and (not d or d > until):
                    continue
                hits.append(
                    {
                        "type": "扫地僧想法",
                        "book": title,
                        "author": author,
                        "id": bid,
                        "chapter": idea.get("chapter") or "",
                        "date": idea.get("date") or "",
                        "text": idea.get("content") or "",
                        "abstract": idea.get("abstract") or "",
                    }
                )
    return hits


def print_hits(hits, limit: int):
    print(f"命中 {len(hits)} 条（显示前 {min(limit, len(hits))}）\n")
    for i, h in enumerate(hits[:limit], 1):
        print(f"{i}. [{h['type']}] 《{h['book']}》· {h['author']}")
        if h.get("chapter") or h.get("date"):
            print(f"   {h.get('chapter','')} · {h.get('date','')}")
        if h.get("abstract"):
            ab = h["abstract"]
            print(f"   原文：{ab[:120]}{'…' if len(ab) > 120 else ''}")
        text = h.get("text") or ""
        print(f"   > {text[:200]}{'…' if len(text) > 200 else ''}")
        print()


def main():
    ap = argparse.ArgumentParser(description="藏经阁阅读库本地检索（全局 Skill）")
    ap.add_argument("--root", default="", help="藏经阁仓库根目录")
    ap.add_argument("--kw", nargs="*", default=[], help="关键词（可多个，AND）")
    ap.add_argument("--book", default="", help="书名/作者子串")
    ap.add_argument("--since", default="", help="起始日期 YYYY-MM-DD")
    ap.add_argument("--until", default="", help="结束日期 YYYY-MM-DD")
    ap.add_argument("--kind", choices=["hl", "idea"], default=None)
    ap.add_argument("--limit", type=int, default=30)
    ap.add_argument("--stats", action="store_true")
    ap.add_argument("--shelf", action="store_true")
    ap.add_argument("--social", default="", help="bookId，打印社区精选")
    ap.add_argument("--json", action="store_true")
    args = ap.parse_args()

    try:
        root = resolve_root(args.root or None)
    except FileNotFoundError as e:
        print(str(e), file=sys.stderr)
        sys.exit(1)

    print(f"ROOT={root}", file=sys.stderr)
    meta, notes = load_notes(root)
    smeta, social = load_social(root)

    if args.stats:
        print("=== NOTES ===")
        print(json.dumps(meta, ensure_ascii=False, indent=2))
        print("=== SOCIAL ===")
        print(json.dumps(smeta, ensure_ascii=False, indent=2))
        return

    if args.shelf:
        for name, label in (
            ("reading.html", "在读"),
            ("readed.html", "已读"),
            ("unread.html", "未读"),
        ):
            books = load_books_html(root, name)
            print(f"{label}: {len(books)} 本")
        return

    if args.social:
        print(json.dumps(social.get(str(args.social)), ensure_ascii=False, indent=2))
        return

    since = parse_date(args.since) if args.since else None
    until = parse_date(args.until) if args.until else None
    hits = search(
        notes,
        args.kw,
        since=since,
        until=until,
        book_sub=args.book or None,
        kind=args.kind,
    )
    hits.sort(key=lambda x: x.get("date") or "", reverse=True)

    if args.json:
        print(json.dumps(hits[: args.limit], ensure_ascii=False, indent=2))
    else:
        if not args.kw and not args.book:
            print("请提供 --kw 或 --book，或使用 --stats / --shelf", file=sys.stderr)
            sys.exit(2)
        print_hits(hits, args.limit)


if __name__ == "__main__":
    main()
