/**
 * 公共 Toast 提示
 * 用法：
 *   <script src="ui-toast.js"></script>
 *   showToast('已保存');
 *   showToast('完成', 2000);
 *
 * 若页面已有 #toast 元素则复用，否则自动创建。
 */
(function (global) {
  var hideTimer = null;

  function ensureEl() {
    var el = document.getElementById('toast');
    if (el) return el;
    el = document.createElement('div');
    el.id = 'toast';
    el.setAttribute('role', 'status');
    el.style.cssText = [
      'position:fixed',
      'left:50%',
      'bottom:28px',
      'transform:translateX(-50%) translateY(12px)',
      'max-width:min(90vw,420px)',
      'padding:10px 16px',
      'border-radius:10px',
      'background:rgba(20,20,30,0.92)',
      'color:#f5e8d4',
      'font-size:14px',
      'line-height:1.4',
      'box-shadow:0 8px 28px rgba(0,0,0,0.35)',
      'opacity:0',
      'pointer-events:none',
      'z-index:99999',
      'transition:opacity .2s ease, transform .2s ease',
      'text-align:center',
    ].join(';');
    document.body.appendChild(el);
    return el;
  }

  function showToast(msg, ms) {
    if (ms == null) ms = 1600;
    var el = ensureEl();
    el.textContent = String(msg == null ? '' : msg);
    el.classList.add('show');
    el.style.opacity = '1';
    el.style.transform = 'translateX(-50%) translateY(0)';
    if (hideTimer) clearTimeout(hideTimer);
    hideTimer = setTimeout(function () {
      el.style.opacity = '0';
      el.style.transform = 'translateX(-50%) translateY(12px)';
      el.classList.remove('show');
    }, Math.max(400, ms | 0));
  }

  global.showToast = showToast;
})(typeof window !== 'undefined' ? window : this);
