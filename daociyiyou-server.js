/**
 * 到此一游 - 微信扫码签到服务器
 *
 * 使用方法:
 * 1. 填写下方 CONFIG 中的 WECHAT_APPID 和 WECHAT_SECRET
 * 2. npm install express axios
 * 3. node daociyiyou-server.js
 * 4. 将服务器部署到公网（需HTTPS），并在微信公众平台配置回调域名
 */

const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// ============ 配置区 ============
const CONFIG = {
  WECHAT_APPID: '你的AppID',        // 微信公众号AppID
  WECHAT_SECRET: '你的AppSecret',   // 微信公众号AppSecret
  PORT: 3456,                        // 服务端口
  BASE_URL: 'https://你的域名.com',   // 公网访问地址（需HTTPS）
  DATA_FILE: path.join(__dirname, 'daociyiyou-data.json'),
  MAX_VISITORS: 500,                 // 最多保留记录数
};
// ===============================

const app = express();
app.use(express.static(__dirname));

// 加载/保存数据
function loadData() {
  try {
    if (fs.existsSync(CONFIG.DATA_FILE)) {
      return JSON.parse(fs.readFileSync(CONFIG.DATA_FILE, 'utf-8'));
    }
  } catch (e) { console.error('数据加载失败:', e.message); }
  return { visitors: [] };
}

function saveData(data) {
  // 限制数量
  if (data.visitors.length > CONFIG.MAX_VISITORS) {
    data.visitors = data.visitors.slice(0, CONFIG.MAX_VISITORS);
  }
  fs.writeFileSync(CONFIG.DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// ============ API 路由 ============

// CORS 中间件（允许前端跨域请求）
app.use('/api', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

/**
 * GET /api/leaderboard
 * 返回排行榜数据
 */
app.get('/api/leaderboard', (req, res) => {
  const data = loadData();
  // 按时间倒序（最新在前）
  const visitors = data.visitors
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .map(v => ({
      nickname: v.nickname,
      headimgurl: v.headimgurl,
      created_at: v.created_at,
      // 格式化显示时间
      time_display: formatTime(v.created_at),
    }));
  res.json({ visitors, total: visitors.length });
});

/**
 * GET /api/checkin
 * 微信OAuth入口 —— 重定向到微信授权页
 * 用户扫码后访问此URL，会被重定向到微信授权
 */
app.get('/api/checkin', (req, res) => {
  const state = crypto.randomBytes(16).toString('hex');
  const redirectUri = encodeURIComponent(`${CONFIG.BASE_URL}/api/callback`);
  const authUrl = [
    'https://open.weixin.qq.com/connect/oauth2/authorize',
    `?appid=${CONFIG.WECHAT_APPID}`,
    `&redirect_uri=${redirectUri}`,
    '&response_type=code',
    '&scope=snsapi_userinfo',
    `&state=${state}`,
    '#wechat_redirect',
  ].join('');
  res.redirect(authUrl);
});

/**
 * GET /api/callback
 * 微信OAuth回调 —— 用code换用户信息，记录签到
 */
app.get('/api/callback', async (req, res) => {
  const { code, state } = req.query;

  if (!code) {
    return res.status(400).send('<h1>授权失败</h1><p>未获取到授权码，请重新扫码。</p>');
  }

  try {
    // 1. 用code换取access_token和openid
    const tokenUrl = 'https://api.weixin.qq.com/sns/oauth2/access_token';
    const tokenRes = await axios.get(tokenUrl, {
      params: {
        appid: CONFIG.WECHAT_APPID,
        secret: CONFIG.WECHAT_SECRET,
        code,
        grant_type: 'authorization_code',
      },
    });

    const { access_token, openid, errcode, errmsg } = tokenRes.data;
    if (errcode) {
      console.error('Token换取失败:', errmsg);
      return res.status(400).send(`<h1>授权失败</h1><p>${errmsg}</p>`);
    }

    // 2. 用access_token获取用户信息
    const userUrl = 'https://api.weixin.qq.com/sns/userinfo';
    const userRes = await axios.get(userUrl, {
      params: { access_token, openid, lang: 'zh_CN' },
    });

    const { nickname, headimgurl } = userRes.data;

    // 3. 存储签到记录
    const data = loadData();
    // 同一用户只保留最新记录，删除旧记录
    data.visitors = data.visitors.filter(v => v.openid !== openid);
    data.visitors.push({
      openid,
      nickname: filterEmoji(nickname),
      headimgurl,
      created_at: new Date().toISOString(),
    });
    saveData(data);

    // 4. 跳转回主页面
    const mainPage = `${CONFIG.BASE_URL}/daociyiyou.html?from=wechat&nickname=${encodeURIComponent(nickname)}`;
    res.send(`
      <!DOCTYPE html>
      <html lang="zh-CN">
      <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>签到成功 · 到此一游</title>
      <style>
        body {
          margin: 0; padding: 40px 20px;
          font-family: "Noto Serif SC", "STSong", serif;
          background: #f5f0e8; color: #3d3226;
          text-align: center; min-height: 100vh;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
        }
        .check-circle {
          width: 80px; height: 80px; border-radius: 50%;
          background: #8b4513; color: #fff;
          display: flex; align-items: center; justify-content: center;
          font-size: 2.5em; margin-bottom: 20px;
          animation: pop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        @keyframes pop { 0% { transform: scale(0); } 100% { transform: scale(1); } }
        h1 { font-size: 1.6em; color: #8b4513; letter-spacing: 0.15em; margin: 0 0 8px; }
        .nick { font-size: 1.1em; opacity: 0.7; margin-bottom: 24px; }
        .btn {
          display: inline-block; padding: 12px 32px;
          background: #8b4513; color: #fff; text-decoration: none;
          border-radius: 24px; letter-spacing: 0.1em;
          font-size: 0.95em; transition: all 0.3s;
        }
        .btn:hover { opacity: 0.85; transform: translateY(-2px); }
      </style>
      </head>
      <body>
      <div class="check-circle">✓</div>
      <h1>签到成功</h1>
      <p class="nick">${nickname}，欢迎来到藏经阁</p>
      <a class="btn" href="${mainPage}">查看排行榜 →</a>
      <script>setTimeout(function(){ location.href = '${mainPage}'; }, 2000);</script>
      </body>
      </html>
    `);
  } catch (err) {
    console.error('OAuth回调异常:', err);
    res.status(500).send('<h1>服务器错误</h1><p>签到失败，请稍后再试。</p>');
  }
});

/**
 * GET /api/qrcode-url
 * 返回扫码URL（方便前端生成二维码）
 */
app.get('/api/qrcode-url', (req, res) => {
  res.json({ url: `${CONFIG.BASE_URL}/api/checkin` });
});

// ============ 工具函数 ============

/** 过滤昵称中的emoji（微信昵称常有emoji，部分系统显示为乱码） */
function filterEmoji(nickname) {
  if (!nickname) return '匿名游客';
  // 保留中英文、数字、常用符号，过滤4字节emoji
  let filtered = '';
  for (const ch of nickname) {
    const code = ch.codePointAt(0);
    // 过滤掉大部分emoji范围
    if (code > 0xffff) continue;        // 4字节字符
    if (code >= 0x1f300 && code <= 0x1f9ff) continue; // emoji & pictographs
    if (code >= 0x2600 && code <= 0x27bf) continue;    // misc symbols
    filtered += ch;
  }
  return filtered.trim() || '匿名游客';
}

/** 格式化时间显示 */
function formatTime(isoStr) {
  const d = new Date(isoStr);
  const now = new Date();
  const diffMs = now - d;
  const diffMin = Math.floor(diffMs / 60000);
  const diffHour = Math.floor(diffMs / 3600000);
  const diffDay = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return '刚刚';
  if (diffMin < 60) return `${diffMin}分钟前`;
  if (diffHour < 24) return `${diffHour}小时前`;
  if (diffDay < 7) return `${diffDay}天前`;

  const month = d.getMonth() + 1;
  const day = d.getDate();
  const hour = String(d.getHours()).padStart(2, '0');
  const minute = String(d.getMinutes()).padStart(2, '0');
  return `${month}月${day}日 ${hour}:${minute}`;
}

// ============ 启动服务 ============

app.listen(CONFIG.PORT, () => {
  console.log(`
╔═══════════════════════════════════════╗
║     🏮 到此一游 · 签到服务已启动     ║
╠═══════════════════════════════════════╣
║  本地地址: http://localhost:${CONFIG.PORT}  ║
║  扫码入口: ${CONFIG.BASE_URL}/api/checkin ║
║  排行榜API: /api/leaderboard         ║
╚═══════════════════════════════════════╝
  `);
});
