/* 手机左右滑动：上一章/下一篇
 * 右滑 → 上一个；左滑 → 下一个
 * 依赖全局：prevChapter/nextChapter 或 prevWork/nextWork
 */
(function () {
  var startX = null;
  var startY = null;
  var tracking = false;
  var locked = false; // 防止短时间内重复翻页
  var MIN_DX = 40;
  var MAX_RATIO = 0.85;

  function getNav() {
    var w = window;
    if (typeof w.nextChapter === 'function' && typeof w.prevChapter === 'function') {
      return { prev: w.prevChapter, next: w.nextChapter };
    }
    if (typeof w.nextWork === 'function' && typeof w.prevWork === 'function') {
      return { prev: w.prevWork, next: w.nextWork };
    }
    return null;
  }

  function isInteractive(el) {
    if (!el || !el.closest) return false;
    return !!el.closest(
      'input, textarea, select, button, a, label, ' +
      '.sidebar, .sidebar-backdrop, .topbar, .stats-bar, ' +
      '.magnifier-overlay, .recite-area, .notes-area, ' +
      '[contenteditable="true"]'
    );
  }

  function inSwipeZone(el) {
    if (!el || !el.closest) return false;
    // 正文区，或主栏中非顶栏/底栏区域
    if (el.closest('#content, .content')) return true;
    if (el.closest('.main') && !el.closest('.topbar, .stats-bar, .sidebar')) return true;
    return false;
  }

  function begin(x, y, target) {
    if (isInteractive(target) || !inSwipeZone(target)) {
      tracking = false;
      startX = null;
      return;
    }
    tracking = true;
    startX = x;
    startY = y;
  }

  function hasTextSelection() {
    try {
      var sel = window.getSelection && window.getSelection();
      return !!(sel && !sel.isCollapsed && String(sel).replace(/\s/g, '').length);
    } catch (err) {
      return false;
    }
  }

  function finish(x, y) {
    if (!tracking || startX == null) {
      tracking = false;
      startX = null;
      return;
    }
    var dx = x - startX;
    var dy = y - startY;
    tracking = false;
    startX = null;

    if (Math.abs(dx) < MIN_DX) return;
    if (Math.abs(dy) > Math.abs(dx) * MAX_RATIO) return;
    // 拖选正文复制时也会产生横向位移，勿当成翻页
    if (hasTextSelection()) return;

    var nav = getNav();
    if (!nav) return;

    if (locked) return;
    locked = true;
    setTimeout(function () { locked = false; }, 350);

    if (dx < 0) nav.next();
    else nav.prev();
  }

  function onTouchStart(e) {
    if (!e.touches || e.touches.length !== 1) return;
    begin(e.touches[0].clientX, e.touches[0].clientY, e.target);
  }
  function onTouchEnd(e) {
    if (!e.changedTouches || e.changedTouches.length !== 1) {
      tracking = false;
      startX = null;
      return;
    }
    finish(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
  }
  function onTouchCancel() {
    tracking = false;
    startX = null;
  }

  // 仅触控滑动翻页。桌面鼠标 pointer 会与「拖选复制正文」冲突：
  // 向右拖选结束时 dx>0 被误判为上一章。
  function bind(el) {
    if (!el || el._cjgSwipeBound) return;
    el._cjgSwipeBound = true;
    // 优先纵向滚动，横向交给我们判断
    try { el.style.touchAction = 'pan-y'; } catch (err) {}

    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchend', onTouchEnd, { passive: true });
    el.addEventListener('touchcancel', onTouchCancel, { passive: true });
  }

  function init() {
    var content = document.getElementById('content');
    var main = document.querySelector('.main');
    // 只绑一个根，避免冒泡双触发；优先 main 覆盖更大
    if (main) bind(main);
    else if (content) bind(content);
    else bind(document.body);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
