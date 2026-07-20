/* 扫地僧 · 藏经阁 — 主题早加载 + 切换
 * 用法：在 <head> 中先写
 *   <meta name="cjg-theme-key" content="存储键">
 *   <meta name="cjg-theme-light" content="">  <!-- 桌面默认，可省略 -->
 *   <script src="theme-boot.js"></script>
 * 规则：localStorage 无记录时，手机默认 dark，桌面用 light 默认值。
 *
 * 切换：
 *   cjgToggleTheme()           // 使用 meta 中的 key
 *   cjgToggleTheme('my_key')   // 指定 key
 *   toggleTheme()              // 兼容旧页面 onclick
 */
(function () {
  function isMobile() {
    try {
      if (/Android|iPhone|iPad|iPod|Mobile|HarmonyOS|HUAWEI|HONOR|webOS|BlackBerry|IEMobile/i.test(navigator.userAgent)) {
        return true;
      }
      if (window.matchMedia && window.matchMedia('(max-width: 768px)').matches) return true;
    } catch (e) {}
    return false;
  }

  window.cjgIsMobile = isMobile;

  window.cjgDefaultTheme = function (lightDefault) {
    if (lightDefault === undefined) lightDefault = '';
    return isMobile() ? 'dark' : lightDefault;
  };

  /** 读取主题：有本地记录用记录，否则手机 dark */
  window.cjgResolveTheme = function (key, lightDefault) {
    if (lightDefault === undefined) lightDefault = '';
    try {
      var saved = localStorage.getItem(key);
      if (saved !== null) return saved;
    } catch (e) {}
    return window.cjgDefaultTheme(lightDefault);
  };

  function metaThemeKey() {
    var meta = document.querySelector('meta[name="cjg-theme-key"]');
    return meta ? (meta.getAttribute('content') || '') : '';
  }

  /** 切换 dark / 默认，并写入 localStorage */
  window.cjgToggleTheme = function (key) {
    if (!key) key = metaThemeKey();
    var html = document.documentElement;
    var cur = html.getAttribute('data-theme') || '';
    var next = cur === 'dark' ? '' : 'dark';
    try {
      html.setAttribute('data-theme', next);
    } catch (e) {}
    if (key) {
      try {
        localStorage.setItem(key, next);
      } catch (e2) {}
    }
    return next;
  };

  // 兼容各页已有的 onclick="toggleTheme()"
  if (typeof window.toggleTheme !== 'function') {
    window.toggleTheme = function () {
      return window.cjgToggleTheme();
    };
  }

  var meta = document.querySelector('meta[name="cjg-theme-key"]');
  if (!meta) return;
  var key = meta.getAttribute('content') || '';
  if (!key) return;
  var lightMeta = document.querySelector('meta[name="cjg-theme-light"]');
  var lightDefault = lightMeta ? lightMeta.getAttribute('content') : '';
  if (lightDefault === null) lightDefault = '';

  var theme = window.cjgResolveTheme(key, lightDefault);
  try {
    document.documentElement.setAttribute('data-theme', theme);
  } catch (e) {}
})();
