/* 扫地僧 · 藏经阁 PWA Service Worker */
// v2：安装时只缓存外壳，避免手机端一次拉几十个文件导致连接被强制关闭
const CACHE_VERSION = 'cangjingge-v8';

// 仅预缓存启动必需资源（小而稳）
const PRECACHE = [
  './',
  './index.html',
  './manifest.webmanifest',
  './12345.png',
  './icon-192.png',
  './icon-512.png',
  './apple-touch-icon.png',
  './pwa-register.js',
  './theme-boot.js',
  './swipe-nav.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then(async (cache) => {
      // 串行写入，降低对本机简易 HTTP 服务的并发冲击
      for (const url of PRECACHE) {
        try {
          await cache.add(new Request(url, { cache: 'reload' }));
        } catch (e) {
          // 单个失败不阻断安装
          console.warn('[SW] precache skip', url, e);
        }
      }
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  // 只处理同源
  if (url.origin !== self.location.origin) return;

  // 音视频 / 字幕 / Range 请求：不走 SW 缓存，避免破坏拖动进度与播放
  const path = url.pathname.toLowerCase();
  const isMedia =
    /\.(mp4|webm|m4v|mov|mp3|wav|ogg|m4a|vtt|srt)$/i.test(path) ||
    req.headers.has('range');
  if (isMedia) {
    event.respondWith(fetch(req));
    return;
  }

  // 导航请求：网络优先，失败回缓存 / 首页
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (res && res.ok) {
            const copy = res.clone();
            caches.open(CACHE_VERSION).then((c) => c.put(req, copy));
          }
          return res;
        })
        .catch(async () => {
          const cached = await caches.match(req);
          return cached || caches.match('./index.html');
        })
    );
    return;
  }

  // 静态资源：缓存优先，后台更新
  event.respondWith(
    caches.match(req).then((cached) => {
      const fetching = fetch(req)
        .then((res) => {
          if (res && res.status === 200 && res.type === 'basic') {
            const copy = res.clone();
            caches.open(CACHE_VERSION).then((c) => c.put(req, copy));
          }
          return res;
        })
        .catch(() => cached);
      return cached || fetching;
    })
  );
});
