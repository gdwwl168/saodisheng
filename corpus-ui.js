/**
 * 语料切换条 UI（依赖 corpus.js + 可选 hints-map.js）
 *
 * 页面需提供：
 *   #corpusBar   语料切换按钮容器（可选，有则渲染）
 *   #corpusTitle 当前篇目标题（可选）
 *   #corpusMeta  进度 3/81（可选）
 *   #corpusPrev / #corpusNext 上一篇/下一篇（可选）
 *
 * 配置（可选）：
 *   window.CORPUS_UI = {
 *     storageKey: 'my-corpus',      // localStorage 键前缀
 *     onChange: function () {},     // 切换语料/篇目后回调
 *     formatTitle: function (ctx) { // 自定义标题
 *       // ctx: { corpusId, index, item, n, emoji, name, hint }
 *       return '...';
 *     }
 *   }
 *
 * 导出：
 *   getCorpus, getCorpusItems, setCorpus, shiftCorpusItem,
 *   updateCorpusPanel, refreshCorpusBar, clampCorpusIndex
 */
(function (global) {
  function cfg() {
    return global.CORPUS_UI || {};
  }

  function storageKey(suffix) {
    var base = cfg().storageKey || 'cjg-corpus';
    return base + (suffix ? ':' + suffix : '');
  }

  function getCorpusId() {
    if (global.corpusId) return global.corpusId;
    try {
      var saved = localStorage.getItem(storageKey('id'));
      if (saved && global.CORPUS && global.CORPUS[saved]) return saved;
    } catch (e) {}
    return 'ddj';
  }

  function setCorpusId(id) {
    global.corpusId = id;
    try {
      localStorage.setItem(storageKey('id'), id);
    } catch (e) {}
  }

  function getIndex() {
    var n = global.corpusIndex;
    if (typeof n === 'number' && !isNaN(n)) return n;
    try {
      var saved = parseInt(localStorage.getItem(storageKey('index')) || '0', 10);
      if (!isNaN(saved)) return saved;
    } catch (e) {}
    return 0;
  }

  function setIndex(i) {
    global.corpusIndex = i;
    try {
      localStorage.setItem(storageKey('index'), String(i));
    } catch (e) {}
  }

  function getCorpus() {
    var id = getCorpusId();
    if (!global.CORPUS) return { name: '—', items: [] };
    return global.CORPUS[id] || global.CORPUS.ddj || { name: '—', items: [] };
  }

  function getCorpusItems() {
    var c = getCorpus();
    return (c && c.items) || [];
  }

  function clampCorpusIndex() {
    var items = getCorpusItems();
    if (!items.length) {
      setIndex(0);
      return 0;
    }
    var i = getIndex();
    i = ((i % items.length) + items.length) % items.length;
    setIndex(i);
    return i;
  }

  function defaultFormatTitle(ctx) {
    var emoji = ctx.emoji ? ctx.emoji + ' ' : '';
    var hint = ctx.hint ? ' · ' + ctx.hint : '';
    if (ctx.corpusId === 'ddj') {
      return emoji + '第' + ctx.n + '章 · ' + ctx.name + hint;
    }
    return emoji + ctx.n + '. ' + ctx.name + hint;
  }

  function updateCorpusPanel() {
    clampCorpusIndex();
    var items = getCorpusItems();
    var titleEl = document.getElementById('corpusTitle');
    var metaEl = document.getElementById('corpusMeta');
    var corpusId = getCorpusId();

    if (!items.length) {
      if (titleEl) titleEl.textContent = getCorpus().name || '—';
      if (metaEl) metaEl.textContent = '';
      if (typeof cfg().onChange === 'function') cfg().onChange();
      return;
    }

    var index = getIndex();
    var item = items[index] || {};
    var n = index + 1;
    var emoji = item.emoji || (global.hintEmoji && global.hintEmoji[n]) || '';
    var name = item.title || '';
    var hint = item.hint || (global.hintsMap && global.hintsMap[n]) || '';
    var ctx = {
      corpusId: corpusId,
      index: index,
      item: item,
      n: n,
      emoji: emoji,
      name: name,
      hint: hint,
    };
    var formatter = typeof cfg().formatTitle === 'function' ? cfg().formatTitle : defaultFormatTitle;
    if (titleEl) titleEl.textContent = formatter(ctx);
    if (metaEl) metaEl.textContent = n + ' / ' + items.length;
    if (typeof cfg().onChange === 'function') cfg().onChange();
  }

  function refreshCorpusBar() {
    var bar = document.getElementById('corpusBar');
    if (!bar || !global.CORPUS || !global.CORPUS_ORDER) return;
    var corpusId = getCorpusId();
    bar.innerHTML = global.CORPUS_ORDER.map(function (id) {
      var c = global.CORPUS[id];
      if (!c) return '';
      var n = id === 'ddj' ? ((c.items && c.items.length) || 81) : ((c.items && c.items.length) || 0);
      var active = id === corpusId ? ' active' : '';
      return (
        '<button type="button" data-corpus="' +
        id +
        '" class="' +
        active.trim() +
        '" title="' +
        (c.name || id) +
        ' · ' +
        n +
        ' 篇">' +
        (c.name || id) +
        '</button>'
      );
    }).join('');

    bar.querySelectorAll('button[data-corpus]').forEach(function (btn) {
      btn.onclick = function () {
        setCorpus(btn.getAttribute('data-corpus'));
      };
    });
  }

  function setCorpus(id) {
    if (!global.CORPUS || !global.CORPUS[id]) return;
    setCorpusId(id);
    setIndex(0);
    refreshCorpusBar();
    updateCorpusPanel();
  }

  function shiftCorpusItem(delta) {
    var items = getCorpusItems();
    if (!items.length) return;
    var i = getIndex() + (delta || 0);
    i = ((i % items.length) + items.length) % items.length;
    setIndex(i);
    updateCorpusPanel();
  }

  function bindNav() {
    var prev = document.getElementById('corpusPrev');
    var next = document.getElementById('corpusNext');
    if (prev) prev.onclick = function () { shiftCorpusItem(-1); };
    if (next) next.onclick = function () { shiftCorpusItem(1); };
  }

  function initCorpusUI(options) {
    if (options) global.CORPUS_UI = Object.assign({}, cfg(), options);
    // restore
    global.corpusId = getCorpusId();
    global.corpusIndex = getIndex();
    if (global.CORPUS && !global.CORPUS[global.corpusId]) global.corpusId = 'ddj';
    clampCorpusIndex();
    refreshCorpusBar();
    updateCorpusPanel();
    bindNav();
  }

  global.getCorpus = getCorpus;
  global.getCorpusItems = getCorpusItems;
  global.clampCorpusIndex = clampCorpusIndex;
  global.updateCorpusPanel = updateCorpusPanel;
  global.refreshCorpusBar = refreshCorpusBar;
  global.setCorpus = setCorpus;
  global.shiftCorpusItem = shiftCorpusItem;
  global.initCorpusUI = initCorpusUI;
})(typeof window !== 'undefined' ? window : this);
