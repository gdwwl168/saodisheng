/**
 * 书单页社区精选浮层：热门划线 + 高赞点评各一条
 * 依赖 window.NOTES_SOCIAL（notes-social.js）
 */
(function (global) {
  "use strict";

  if (global.__cjgSocialSheetReady) return;
  global.__cjgSocialSheetReady = true;

  var STYLE = [
    ".cjg-sheet-mask{position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:200;opacity:0;pointer-events:none;transition:opacity .2s}",
    ".cjg-sheet-mask.show{opacity:1;pointer-events:auto}",
    ".cjg-sheet{position:fixed;left:0;right:0;bottom:0;z-index:210;max-height:min(86vh,720px);",
    "background:var(--card-bg,#252540);color:var(--text,#d4c5a9);border-radius:16px 16px 0 0;",
    "box-shadow:0 -8px 32px rgba(0,0,0,.35);transform:translateY(105%);transition:transform .25s ease;",
    "display:flex;flex-direction:column;padding-bottom:env(safe-area-inset-bottom,0)}",
    ".cjg-sheet.show{transform:translateY(0)}",
    ".cjg-sheet-handle{width:40px;height:4px;border-radius:999px;background:var(--border,#3a3a55);margin:10px auto 6px;flex:0 0 auto}",
    ".cjg-sheet-head{display:flex;gap:12px;padding:6px 16px 12px;border-bottom:1px solid var(--border,#3a3a55);flex:0 0 auto}",
    ".cjg-sheet-head img,.cjg-sheet-cover{width:52px;height:70px;border-radius:6px;object-fit:cover;background:var(--border,#3a3a55);flex:0 0 auto}",
    ".cjg-sheet-head .info{flex:1;min-width:0}",
    ".cjg-sheet-head .t{font-weight:700;font-size:1em;line-height:1.35;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}",
    ".cjg-sheet-head .a{margin-top:4px;font-size:.8em;opacity:.65;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}",
    ".cjg-sheet-close{border:1px solid var(--border,#3a3a55);background:transparent;color:inherit;border-radius:999px;width:36px;height:36px;cursor:pointer;flex:0 0 auto;align-self:flex-start}",
    ".cjg-sheet-body{overflow:auto;-webkit-overflow-scrolling:touch;padding:12px 16px 8px;flex:1}",
    ".cjg-sheet-sec{margin:0 0 14px}",
    ".cjg-sheet-sec h4{font-size:.78em;letter-spacing:.12em;color:var(--accent,#c9a96e);margin:0 0 8px}",
    ".cjg-sheet-card{border:1px solid var(--border,#3a3a55);border-radius:12px;padding:12px;line-height:1.75;font-size:.92em;white-space:pre-wrap;word-break:break-word}",
    ".cjg-sheet-card.hot{border-left:3px solid #e07a3d}",
    ".cjg-sheet-card.praise{border-left:3px solid var(--gold,#c9a96e)}",
    ".cjg-sheet-meta{margin-top:8px;font-size:.72em;opacity:.7;display:flex;flex-wrap:wrap;gap:8px}",
    ".cjg-sheet-meta .hi{color:var(--gold,#c9a96e);font-weight:700;opacity:1}",
    ".cjg-sheet-empty{text-align:center;padding:20px 8px;opacity:.6;font-size:.9em;line-height:1.6}",
    ".cjg-sheet-actions{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;padding:10px 16px 16px;border-top:1px solid var(--border,#3a3a55);flex:0 0 auto}",
    ".cjg-sheet-actions a,.cjg-sheet-actions button{font-size:.85em;border:1px solid var(--border,#3a3a55);border-radius:999px;padding:9px 14px;background:var(--bg,#1a1a2e);color:var(--accent,#c9a96e);cursor:pointer;text-decoration:none;font-family:inherit}",
  ].join("");

  var styleEl = document.createElement("style");
  styleEl.textContent = STYLE;
  document.head.appendChild(styleEl);

  var mask = document.createElement("div");
  mask.className = "cjg-sheet-mask";
  mask.innerHTML =
    '<div class="cjg-sheet" role="dialog" aria-modal="true" aria-label="社区精选">' +
    '<div class="cjg-sheet-handle"></div>' +
    '<div class="cjg-sheet-head"></div>' +
    '<div class="cjg-sheet-body"></div>' +
    '<div class="cjg-sheet-actions"></div>' +
    "</div>";
  document.body.appendChild(mask);

  var sheet = mask.querySelector(".cjg-sheet");
  var head = mask.querySelector(".cjg-sheet-head");
  var body = mask.querySelector(".cjg-sheet-body");
  var actions = mask.querySelector(".cjg-sheet-actions");

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function stars(star) {
    var n = Math.max(0, Math.min(5, Math.round((Number(star) || 0) / 20)));
    return n ? "⭐".repeat(n) : "";
  }

  function close() {
    sheet.classList.remove("show");
    mask.classList.remove("show");
  }

  mask.addEventListener("click", function (e) {
    if (e.target === mask) close();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && mask.classList.contains("show")) {
      e.preventDefault();
      close();
    }
  });

  function openBookSheet(book) {
    if (!book) return;
    var social = (global.NOTES_SOCIAL || {})[String(book.id)] || {};
    var hot = social.hot;
    var rev = social.review;

    var cover = book.cover
      ? '<img src="' + esc(book.cover) + '" alt="">'
      : '<div class="cjg-sheet-cover"></div>';

    head.innerHTML =
      cover +
      '<div class="info"><div class="t">' +
      esc(book.title || "") +
      '</div><div class="a">' +
      esc(book.author || "") +
      "</div></div>" +
      '<button type="button" class="cjg-sheet-close" aria-label="关闭">✕</button>';

    head.querySelector(".cjg-sheet-close").onclick = close;

    var html = "";
    if (hot && hot.text) {
      html += '<section class="cjg-sheet-sec"><h4>🔥 热门划线</h4>';
      html += '<div class="cjg-sheet-card hot">' + esc(hot.text);
      html += '<div class="cjg-sheet-meta">';
      if (hot.chapter) html += "<span>" + esc(hot.chapter) + "</span>";
      if (hot.count) html += '<span class="hi">' + hot.count + " 人划线</span>";
      html += "</div></div></section>";
    }
    if (rev && rev.content) {
      html += '<section class="cjg-sheet-sec"><h4>👍 高赞点评</h4>';
      html += '<div class="cjg-sheet-card praise">' + esc(rev.content);
      html += '<div class="cjg-sheet-meta">';
      if (rev.author) html += "<span>" + esc(rev.author) + "</span>";
      if (rev.star) html += "<span>" + stars(rev.star) + "</span>";
      if (rev.likes) html += '<span class="hi">赞 ' + rev.likes + "</span>";
      if (rev.comments) html += "<span>评 " + rev.comments + "</span>";
      if (rev.date) html += "<span>" + esc(rev.date) + "</span>";
      html += "</div></div></section>";
    }
    if (!html) {
      html =
        '<div class="cjg-sheet-empty">这本书暂时还没有热门划线或高赞点评</div>';
    }
    body.innerHTML = html;

    actions.innerHTML = "";
    if (book.link) {
      var a = document.createElement("a");
      a.href = book.link;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.textContent = "打开微信读书";
      actions.appendChild(a);
    }
    var btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = "关闭";
    btn.onclick = close;
    actions.appendChild(btn);

    mask.classList.add("show");
    requestAnimationFrame(function () {
      sheet.classList.add("show");
    });
  }

  global.openBookSocialSheet = openBookSheet;
  global.closeBookSocialSheet = close;
})(window);
