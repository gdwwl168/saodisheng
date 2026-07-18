/* 扫地僧 · 藏经阁 — PWA 注册与安装提示 */
(function () {
  var deferredPrompt = null;

  function isStandalone() {
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true
    );
  }

  function getInstallBtn() {
    return document.getElementById('pwaInstallBtn');
  }

  function showInstallBtn() {
    var btn = getInstallBtn();
    if (!btn) return;
    if (isStandalone()) {
      btn.hidden = true;
      return;
    }
    btn.hidden = false;
    btn.removeAttribute('aria-hidden');
  }

  function hideInstallBtn() {
    var btn = getInstallBtn();
    if (btn) btn.hidden = true;
  }

  function platform() {
    var ua = navigator.userAgent || '';
    // 华为/荣耀：P50 等无 GMS，需用华为浏览器「添加至桌面」，且常被权限拦截
    var huawei =
      /HUAWEI|HONOR|HarmonyOS|HMSCore|HuaweiBrowser/i.test(ua) ||
      (/Build\//i.test(ua) && /H\d{2}|LYA|ELS|NOH|JAD|BAL|ALN|BRA|ANP|ADA|FNE|MGA|ALT/i.test(ua));
    return {
      ios: /iphone|ipad|ipod/i.test(ua),
      android: /android/i.test(ua) || /HarmonyOS/i.test(ua),
      huawei: huawei,
      wechat: /MicroMessenger/i.test(ua),
      qq: /\bQQ\//i.test(ua) || (/\bMQQBrowser/i.test(ua) && /NetType/i.test(ua))
    };
  }

  function showGuide(title, html) {
    var overlay = document.getElementById('pwaGuideOverlay');
    var titleEl = document.getElementById('pwaGuideTitle');
    var bodyEl = document.getElementById('pwaGuideBody');
    if (!overlay || !bodyEl) {
      // 无弹层时退回 alert
      alert(title + '\n\n' + html.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' '));
      return;
    }
    if (titleEl) titleEl.textContent = title;
    bodyEl.innerHTML = html;
    overlay.classList.add('show');
  }

  function installGuideHtml() {
    var p = platform();
    var findIcon =
      '<div class="hint">安装成功后，桌面图标名称是「<strong>藏经阁</strong>」。' +
      '请左右滑动主屏幕各页查找；有的手机会放进「工具」文件夹。</div>';

    if (p.wechat || p.qq) {
      return (
        '<p>当前在微信/QQ 内置浏览器中，<strong>无法真正添加到系统桌面</strong>。</p>' +
        '<ol>' +
        '<li>点右上角 <strong>···</strong></li>' +
        '<li>选择 <strong>在浏览器中打开</strong>（Safari 或 Chrome）</li>' +
        '<li>在浏览器里再点右下角「安装到手机」</li>' +
        '</ol>' +
        findIcon
      );
    }

    if (p.ios) {
      return (
        '<p>iPhone / iPad 请用 <strong>Safari</strong>：</p>' +
        '<ol>' +
        '<li>确认底部有 Safari 工具栏</li>' +
        '<li>点中间 <strong>分享</strong> 按钮 □↑</li>' +
        '<li>向下滑动，点 <strong>添加到主屏幕</strong></li>' +
        '<li>名称保持「藏经阁」，再点右上角 <strong>添加</strong></li>' +
        '</ol>' +
        findIcon +
        '<div class="hint">若只有「添加到个人收藏」没有「添加到主屏幕」：说明不在 Safari 里，请复制链接用 Safari 打开。</div>'
      );
    }

    if (p.huawei) {
      return (
        '<p><strong>华为 P50 / 鸿蒙</strong> 没有完整 Google 服务，请用系统自带的 <strong>华为浏览器</strong>（不要用微信）：</p>' +
        '<ol>' +
        '<li>电脑运行 <code>start-server.bat</code>，手机连同一 Wi‑Fi</li>' +
        '<li>用<strong>华为浏览器</strong>打开：http://电脑IP:8787/</li>' +
        '<li>点右下角菜单 <strong>∷</strong>（或 ⋮）→ <strong>添加至</strong> → <strong>桌面</strong></li>' +
        '<li>名称可改为「藏经阁」，点确认 / ✔</li>' +
        '</ol>' +
        '<p>备选：浏览器里先<strong>收藏</strong>本页 → 我的 → 书签 → 长按该书签 → <strong>添加至桌面</strong></p>' +
        findIcon +
        '<div class="hint"><strong>华为添加成功但桌面没有？按下面开权限（关键）：</strong><br>' +
        '① 设置 → 应用和服务 → 应用管理 → <strong>浏览器</strong>（或华为浏览器）→ 权限 → 打开「<strong>创建桌面快捷方式</strong>」<br>' +
        '② 设置 → 应用和服务 → 权限管理 → 权限 → 找到「创建桌面快捷方式」→ 对浏览器选<strong>允许</strong><br>' +
        '③ 华为浏览器桌面快捷方式<strong>最多约 10 个</strong>，满了请删掉旧的再加<br>' +
        '④ 加完后左右滑遍所有桌面页；有的进了「工具」文件夹<br>' +
        '⑤ 仍没有：重启手机后再用华为浏览器添加一次</div>'
      );
    }

    if (p.android) {
      return (
        '<p>Android 请用 <strong>Chrome</strong>（或系统浏览器）：</p>' +
        '<ol>' +
        '<li>点右上角菜单 <strong>⋮</strong></li>' +
        '<li>选 <strong>安装应用</strong> 或 <strong>添加到主屏幕</strong> / <strong>添加快捷方式</strong></li>' +
        '<li>在弹出框点 <strong>添加</strong> / <strong>安装</strong></li>' +
        '</ol>' +
        findIcon +
        '<div class="hint"><strong>桌面没有图标？</strong>（很常见）<br>' +
        '到 设置 → 应用 → Chrome（或你的浏览器）→ 权限 / 其他权限 → 打开「<strong>创建桌面快捷方式</strong>」或「主屏幕快捷方式」，再重新添加一次。<br>' +
        '小米 / 华为 / OPPO / vivo 等常默认拦截。</div>'
      );
    }

    return (
      '<p>电脑请用 Chrome / Edge：</p>' +
      '<ol>' +
      '<li>地址栏右侧点「安装」图标，或菜单中的「安装应用」</li>' +
      '<li>需通过 http/https 访问（运行 serve-pwa.ps1），不要直接打开本地文件</li>' +
      '</ol>'
    );
  }

  // 首页按钮：默认可见
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', showInstallBtn);
  } else {
    showInstallBtn();
  }
  window.addEventListener('load', showInstallBtn);

  // Service Worker 注册（file:// 跳过）
  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('./sw.js', { scope: './' }).then(function (reg) {
        console.info('[PWA] Service Worker 已注册', reg.scope);
      }).catch(function (err) {
        console.warn('[PWA] 注册失败', err);
      });
    });
  } else if (location.protocol === 'file:') {
    console.info('[PWA] 请通过本地服务器打开（http://localhost），file:// 无法安装为 App');
  }

  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    deferredPrompt = e;
    showInstallBtn();
  });

  window.addEventListener('appinstalled', function () {
    deferredPrompt = null;
    hideInstallBtn();
    console.info('[PWA] 已安装到主屏幕');
    showGuide(
      '已触发安装',
      '<p>系统已接受安装请求。</p>' +
        '<div class="hint">请回到手机桌面，查找名为「<strong>藏经阁</strong>」的图标。' +
        '可左右滑动各主屏幕页；若没有，请到浏览器权限里允许「创建桌面快捷方式」后重试。</div>'
    );
  });

  window.pwaInstall = function () {
    if (isStandalone()) {
      showGuide('已在 App 中', '<p>当前已是主屏幕打开的 App 模式，无需再次安装。</p>');
      hideInstallBtn();
      return;
    }

    if (location.protocol === 'file:') {
      showGuide(
        '请用服务器打开',
        '<p>不能直接打开本地 html 文件来安装。</p>' +
          '<ol>' +
          '<li>在电脑运行 <code>serve-pwa.ps1</code> 或 <code>start-server.bat</code></li>' +
          '<li>手机连同一 Wi‑Fi，用浏览器打开 http://电脑IP:8787/</li>' +
          '<li>再点「安装到手机」</li>' +
          '</ol>'
      );
      return;
    }

    // 系统支持原生安装时直接弹出
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(function (choice) {
        deferredPrompt = null;
        if (choice && choice.outcome === 'accepted') {
          showGuide(
            '正在安装',
            '<p>你已确认安装。</p>' +
              '<div class="hint">回到桌面查找「<strong>藏经阁</strong>」。若没有图标：设置 → 应用 → 浏览器 → 允许「创建桌面快捷方式」，再装一次。</div>'
          );
        } else {
          showInstallBtn();
          showGuide('已取消', '<p>你取消了安装。需要时再点右下角「安装到手机」。</p>' + installGuideHtml());
        }
      }).catch(function () {
        deferredPrompt = null;
        showInstallBtn();
        showGuide('请手动添加', installGuideHtml());
      });
      return;
    }

    // 无原生事件：展示手动步骤（iOS / 部分安卓 / 局域网 http）
    showGuide('安装到主屏幕', installGuideHtml());
  };
})();
