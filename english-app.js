/**
 * 外研英语共用引擎（七/八/九年级）
 * 依赖：
 *   window.ENGLISH_CONFIG = { storagePrefix, metaLabel, tagUp, tagDown }
 *   var UNITS = [...]  // 由 english-data-*.js 提供
 */
if (typeof UNITS === 'undefined') {
  console.error('[english-app] UNITS missing — load english-data-*.js first');
}
// ===== 状态 =====
let currentIndex = 0;
let currentMode = 'browse';
let reciteLevel = 1;
let bookFilter = 'all';
let progress = {};
let flashIndex = 0;
let flashFlipped = false;
let reciteQueue = [];
let recitePos = 0;
// 默写按「整组单元」计一次，不按单词数
let reciteSession = { correct: 0, wrong: 0, skipped: 0, recorded: false };

const _cfg = (typeof window !== 'undefined' && window.ENGLISH_CONFIG) || {};
const STORAGE_KEY = _cfg.storagePrefix ? (_cfg.storagePrefix + '_progress') : 'english_fltrp_g7_progress';
const STORAGE_UNIT = _cfg.storagePrefix ? (_cfg.storagePrefix + '_unit') : 'english_fltrp_g7_unit';
const STORAGE_MODE = _cfg.storagePrefix ? (_cfg.storagePrefix + '_mode') : 'english_fltrp_g7_mode';
const STORAGE_THEME = _cfg.storagePrefix ? (_cfg.storagePrefix + '_theme') : 'english_fltrp_g7_theme';
const STORAGE_RL = _cfg.storagePrefix ? (_cfg.storagePrefix + '_rl') : 'english_fltrp_g7_rl';
const GRADE_META = _cfg.metaLabel || '外研版 · 七年级';
const TAG_UP = _cfg.tagUp || '七上';
const TAG_DOWN = _cfg.tagDown || '七下';

function loadProgress() {
  try {
    progress = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch (e) { progress = {}; }
}
function saveProgress() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}
function getUnitProgress(id) {
  return progress[id] || { level: 0, count: 0 };
}
/**
 * 单元进度
 * @param {string} id 单元 id
 * @param {number} quality 1弱 2中 3好 4掌握
 * @param {{asSession?: boolean}} opts asSession=true 时才 +1 练习组数（按单元整组，不按单词）
 */
function updateUnitProgress(id, quality, opts) {
  const asSession = !!(opts && opts.asSession);
  const p = getUnitProgress(id);
  if (asSession) {
    p.count = (p.count || 0) + 1;
  }
  if (quality >= 3) p.level = Math.min(4, Math.max(p.level || 0, quality));
  else if (quality === 1) p.level = Math.max(0, (p.level || 0) - 1);
  else p.level = Math.max(p.level || 0, 2);
  progress[id] = p;
  saveProgress();
  renderChapterList();
  updateStatsBar();
}

function resetReciteSession() {
  reciteSession = { correct: 0, wrong: 0, skipped: 0, recorded: false };
}

/** 默写整组跑完后记 1 次单元练习 */
function finishReciteSessionIfDone() {
  if (!reciteQueue.length || recitePos < reciteQueue.length) return;
  if (reciteSession.recorded) return;
  reciteSession.recorded = true;
  const { correct, wrong, skipped } = reciteSession;
  let q = 3;
  if (wrong === 0 && skipped === 0 && correct > 0) q = 4;
  else if (correct === 0 && (wrong > 0 || skipped > 0)) q = 1;
  else if (wrong > correct) q = 2;
  updateUnitProgress(unit().id, q, { asSession: true });
  showToast(`本单元默写完成 · 记 1 组（对${correct}/跳${skipped}）`);
}

/* showToast → ui-toast.js */

let _speakTimer = null;
let _voicesReady = false;
let _speakAllTimer = null;
let _speakAllActive = false;

function ensureVoices() {
  if (!window.speechSynthesis) return [];
  const voices = window.speechSynthesis.getVoices() || [];
  if (voices.length) _voicesReady = true;
  return voices;
}

if (typeof window !== 'undefined' && window.speechSynthesis) {
  ensureVoices();
  window.speechSynthesis.onvoiceschanged = ensureVoices;
}

function pickEnglishVoice() {
  const voices = ensureVoices();
  return voices.find(v => /^en(-|_)/i.test(v.lang) && /US|UK|GB|English/i.test(v.name + v.lang))
    || voices.find(v => /^en/i.test(v.lang))
    || null;
}

function makeUtterance(text) {
  const u = new SpeechSynthesisUtterance(String(text));
  u.lang = 'en-US';
  u.rate = 0.9;
  u.pitch = 1;
  u.volume = 1;
  const en = pickEnglishVoice();
  if (en) u.voice = en;
  return u;
}

function stopAllSpeech() {
  _speakAllActive = false;
  clearTimeout(_speakTimer);
  clearTimeout(_speakAllTimer);
  try {
    window.speechSynthesis && window.speechSynthesis.cancel();
  } catch (e) {}
}

function speak(text) {
  const t = String(text || '').trim();
  if (!t) return;
  if (!window.speechSynthesis) {
    showToast('当前浏览器不支持朗读');
    return;
  }
  try {
    // 打断「全部朗读」队列
    _speakAllActive = false;
    clearTimeout(_speakAllTimer);
    // Chrome：cancel 后立刻 speak 常会静音，需短暂延迟
    window.speechSynthesis.cancel();
    if (window.speechSynthesis.paused) window.speechSynthesis.resume();
    clearTimeout(_speakTimer);
    _speakTimer = setTimeout(() => {
      try {
        if (window.speechSynthesis.paused) window.speechSynthesis.resume();
        const u = makeUtterance(t);
        u.onerror = () => showToast('朗读失败，请检查系统语音');
        window.speechSynthesis.speak(u);
      } catch (e) {
        showToast('朗读失败');
      }
    }, 80);
  } catch (e) {
    showToast('朗读失败');
  }
}

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
}

function toggleTheme() {
  const html = document.documentElement;
  const next = html.getAttribute('data-theme') === 'dark' ? '' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem(STORAGE_THEME, next);
}

function toggleGuide() {
  document.getElementById('guideOverlay').classList.toggle('show');
}

function setBookFilter(book) {
  bookFilter = book;
  document.querySelectorAll('.book-filters button').forEach(b => {
    b.classList.toggle('active', b.dataset.book === book);
  });
  renderChapterList();
}

function filteredUnits() {
  const q = (document.getElementById('searchInput')?.value || '').trim().toLowerCase();
  let list = UNITS.map((u, i) => ({ ...u, _i: i }));
  if (bookFilter !== 'all') list = list.filter(u => u.book === bookFilter);
  if (q) {
    list = list.filter(u => {
      const hay = [u.title, u.titleZh, u.code, u.book, ...u.words.map(w => w.en + ' ' + w.zh)].join(' ').toLowerCase();
      return hay.includes(q);
    });
  }
  const sort = document.getElementById('sortSelect')?.value || 'num';
  if (sort === 'progress') {
    list.sort((a, b) => (getUnitProgress(b.id).level || 0) - (getUnitProgress(a.id).level || 0));
  } else if (sort === 'weak') {
    list.sort((a, b) => (getUnitProgress(a.id).level || 0) - (getUnitProgress(b.id).level || 0));
  }
  return list;
}

function renderChapterList() {
  const list = filteredUnits();
  const el = document.getElementById('chapterList');
  el.innerHTML = list.map(u => {
    const p = getUnitProgress(u.id);
    let badge = '';
    if (p.level >= 4) badge = '<span class="ch-badge">✓</span>';
    else if (p.level >= 2) badge = '<span class="ch-badge mid">·</span>';
    else if (p.count > 0) badge = '<span class="ch-badge weak">!</span>';
    const active = u._i === currentIndex ? ' active' : '';
    const tagClass = u.book === '上册' ? 'up' : 'down';
    return `<div class="chapter-item${active}" onclick="navigateTo(${u._i})">
      <span class="ch-num">${u.emoji}</span>
      <div class="ch-info">
        <div class="ch-title-sm">${u.code} ${u.title}</div>
        <div class="ch-preview">${u.titleZh} · ${u.words.length}词</div>
      </div>
      <span class="ch-tag ${tagClass}">${u.book === '上册' ? TAG_UP : TAG_DOWN}</span>
      ${badge}
    </div>`;
  }).join('') || '<div style="padding:16px;opacity:0.5;text-align:center;font-size:0.85em;">无匹配单元</div>';

  const mastered = UNITS.filter(u => getUnitProgress(u.id).level >= 4).length;
  const pct = Math.round((mastered / UNITS.length) * 100);
  document.getElementById('totalProgressBar').style.width = pct + '%';
  document.getElementById('totalProgressText').textContent = pct + '%';
}

function navigateTo(i) {
  if (i < 0 || i >= UNITS.length) return;
  currentIndex = i;
  flashIndex = 0;
  flashFlipped = false;
  try { localStorage.setItem(STORAGE_UNIT, UNITS[i].id); } catch (e) {}
  renderChapterList();
  renderContent();
  if (window.innerWidth <= 800) {
    document.getElementById('sidebar').classList.remove('open');
  }
}

function switchMode(mode) {
  if (mode === 'recite') {
    if (currentMode === 'recite') {
      reciteLevel = reciteLevel >= 3 ? 1 : reciteLevel + 1;
    }
    const labels = { 1: '默写 L1', 2: '默写 L2', 3: '默写 L3' };
    document.getElementById('reciteBtn').textContent = '🗣️ ' + labels[reciteLevel];
    currentMode = 'recite';
    buildReciteQueue();
  } else {
    currentMode = mode;
  }
  document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
  document.querySelector(`.mode-btn[data-mode="${mode === 'recite' ? 'recite' : currentMode}"]`)?.classList.add('active');
  if (mode === 'recite') document.querySelector('.mode-btn[data-mode="recite"]')?.classList.add('active');
  try {
    localStorage.setItem(STORAGE_MODE, currentMode);
    localStorage.setItem(STORAGE_RL, String(reciteLevel));
  } catch (e) {}
  flashIndex = 0;
  flashFlipped = false;
  renderContent();
}

function unit() { return UNITS[currentIndex]; }

function renderContent() {
  const u = unit();
  const c = document.getElementById('content');
  let html = `<div class="chapter-container${currentMode === 'flashcard' ? ' wide' : ''}">
    <div class="chapter-header">
      <div class="ch-title">${u.code} · ${u.title}</div>
      <div class="ch-subtitle">${u.titleZh}</div>
      <div class="ch-emoji">${u.emoji}</div>
      <div class="meta-row">
        <span class="meta-pill">${u.book}</span>
        <span class="meta-pill">${u.words.length} 单词</span>
        <span class="meta-pill">${u.phrases.length} 短语</span>
        <span class="meta-pill">${GRADE_META}</span>
      </div>
    </div>`;

  switch (currentMode) {
    case 'browse': html += renderBrowse(u); break;
    case 'phrase': html += renderPhrases(u); break;
    case 'pattern': html += renderPatterns(u); break;
    case 'grammar': html += renderGrammar(u); break;
    case 'cloze': html += renderCloze(u); break;
    case 'recite': html += renderRecite(u); break;
    case 'flashcard': html += renderFlashcard(u); break;
  }

  html += `<div class="nav-footer">
    <button onclick="navigateTo(${currentIndex - 1})" ${currentIndex <= 0 ? 'disabled style="opacity:0.4"' : ''}>◀ 上一单元</button>
    <button onclick="markMastered()" class="primary" style="background:var(--accent);color:#fff;border-color:var(--accent);">标记掌握</button>
    <button onclick="navigateTo(${currentIndex + 1})" ${currentIndex >= UNITS.length - 1 ? 'disabled style="opacity:0.4"' : ''}>下一单元 ▶</button>
  </div></div>`;

  c.innerHTML = html;
  updateStatsBar();
  if (currentMode === 'recite') {
    focusReciteInput();
    // L3：进入题目时自动播放单词发音
    if (reciteLevel === 3 && reciteQueue.length && recitePos < reciteQueue.length) {
      const w = reciteQueue[recitePos];
      if (w?.en) {
        // 稍延迟，避免与上一次 cancel/DOM 更新打架
        setTimeout(() => speak(w.en), 120);
      }
    }
  }
}

function replayReciteAudio() {
  if (currentMode !== 'recite' || reciteLevel !== 3) return;
  const w = reciteQueue[recitePos];
  if (w?.en) speak(w.en);
}

function renderBrowse(u) {
  let html = `<div class="section-title">📚 核心单词 <button type="button" class="section-speak" onclick="speakAllWords(event)" title="朗读本单元全部单词">🔊</button></div><div class="word-grid">`;
  u.words.forEach((w, i) => {
    html += `<div class="word-card" onclick="speakWord(${i})" title="点击朗读">
      <div class="en">${esc(w.en)} <span class="pos">${esc(w.pos || '')}</span></div>
      ${w.phon ? `<div class="phon">${esc(w.phon)}</div>` : ''}
      <div class="zh">${esc(w.zh)}</div>
    </div>`;
  });
  html += `</div>`;
  html += `<div class="section-title">📝 精选例句</div><div class="sentence-list">`;
  u.sentences.forEach((s, i) => {
    html += `<div class="sentence-item" onclick="speakSentence(${i})" style="cursor:pointer;">
      <button type="button" class="speak-btn" onclick="event.stopPropagation();speakSentence(${i})" title="朗读">🔊</button>
      <div style="flex:1">
        <div class="en">${esc(s.en)}</div>
        <div class="zh">${esc(s.zh)}</div>
      </div>
    </div>`;
  });
  html += `</div>`;
  if (u.tip) html += `<div class="tip-box">💡 ${esc(u.tip)}</div>`;
  return html;
}

function renderPhrases(u) {
  let html = `<div class="section-title">💬 重点短语 <span style="font-weight:400;opacity:0.55;font-size:0.85em;">点击朗读</span></div><div class="phrase-list">`;
  u.phrases.forEach((p, i) => {
    html += `<div class="phrase-item" onclick="speakPhrase(${i})" style="cursor:pointer;">
      <button type="button" class="speak-btn" onclick="event.stopPropagation();speakPhrase(${i})" title="朗读">🔊</button>
      <div style="flex:1">
        <div class="en">${esc(p.en)}</div>
        <div class="zh">${esc(p.zh)}</div>
      </div>
    </div>`;
  });
  html += `</div>`;
  html += `<div class="section-title">📝 相关例句</div><div class="sentence-list">`;
  u.sentences.forEach((s, i) => {
    html += `<div class="sentence-item" onclick="speakSentence(${i})" style="cursor:pointer;">
      <button type="button" class="speak-btn" onclick="event.stopPropagation();speakSentence(${i})" title="朗读">🔊</button>
      <div style="flex:1">
        <div class="en">${esc(s.en)}</div>
        <div class="zh">${esc(s.zh)}</div>
      </div>
    </div>`;
  });
  html += `</div>`;
  return html;
}

function speakPhrase(i) {
  const p = unit()?.phrases?.[i];
  if (p?.en) speak(p.en);
}

function speakSentence(i) {
  const s = unit()?.sentences?.[i];
  if (s?.en) speak(s.en);
}

function renderPatterns(u) {
  let html = `<div class="section-title">🔍 核心句型</div>`;
  u.patterns.forEach(p => {
    html += `<div class="pattern-card">
      <div class="pat-en">${esc(p.en)}</div>
      <div class="pat-zh">${esc(p.zh)}</div>
      <div class="pat-ex">例：${esc(p.ex)}</div>
    </div>`;
  });
  return html;
}

function renderGrammar(u) {
  let html = `<div class="section-title">📘 语法要点</div>`;
  u.grammar.forEach(g => {
    html += `<div class="grammar-box"><h4>${esc(g.title)}</h4><ul>`;
    g.points.forEach(pt => { html += `<li>${pt}</li>`; });
    html += `</ul></div>`;
  });
  if (u.tip) html += `<div class="tip-box">💡 ${esc(u.tip)}</div>`;
  return html;
}

function renderCloze(u) {
  // Build cloze from first 2 sentences + a few phrases
  const items = [];
  u.sentences.forEach(s => {
    const words = s.en.replace(/[.,!?]/g, '').split(/\s+/).filter(w => w.length > 3);
    if (words.length) {
      const target = words[Math.floor(words.length / 2)] || words[0];
      items.push({ full: s.en, blank: target, zh: s.zh });
    }
  });
  u.phrases.slice(0, 3).forEach(p => {
    const parts = p.en.split(/\s+/);
    if (parts.length >= 2) {
      const target = parts[parts.length - 1].replace(/[.,!?]/g, '');
      items.push({ full: p.en, blank: target, zh: p.zh });
    }
  });

  let html = `<div class="section-title">✏️ 填空练习 <span style="font-weight:400;opacity:0.6;font-size:0.85em;">点击下划线显示答案</span></div>`;
  html += `<div class="cloze-box">`;
  items.forEach((it, idx) => {
    const re = new RegExp(escapeReg(it.blank), 'i');
    const shown = it.full.replace(re, `<span class="cloze-blank" data-ans="${esc(it.blank)}" onclick="revealBlank(this)">____</span>`);
    html += `<div style="margin-bottom:14px;">
      <div>${idx + 1}. ${shown}</div>
      <div style="font-size:0.82em;opacity:0.55;margin-top:2px;">${esc(it.zh)}</div>
    </div>`;
  });
  html += `</div>
  <div class="action-row">
    <button onclick="document.querySelectorAll('.cloze-blank').forEach(b=>revealBlank(b,true))">显示全部</button>
    <button onclick="renderContent()">重置</button>
    <button class="primary" onclick="updateUnitProgress(unit().id,3,{asSession:true});showToast('已记录本单元练习 1 组 ✓')">完成练习</button>
  </div>`;
  return html;
}

function revealBlank(el, force) {
  if (el.classList.contains('revealed') && !force) {
    el.classList.remove('revealed');
    el.textContent = '____';
    return;
  }
  el.classList.add('revealed');
  el.textContent = el.dataset.ans;
}

function buildReciteQueue() {
  const u = unit();
  reciteQueue = u.words.map((w, i) => ({ type: 'word', ...w, i }));
  // shuffle lightly
  for (let i = reciteQueue.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [reciteQueue[i], reciteQueue[j]] = [reciteQueue[j], reciteQueue[i]];
  }
  recitePos = 0;
  resetReciteSession();
}

function renderRecite(u) {
  if (!reciteQueue.length) buildReciteQueue();
  if (recitePos >= reciteQueue.length) {
    // 整组默写结束：按单元记 1 次（不按单词数）
    finishReciteSessionIfDone();
    return `<div class="recite-prompt">
      <div class="prompt-sub">本单元默写完成 · 记 1 组</div>
      <div class="prompt-main">🎉 Well done!</div>
      <div class="prompt-sub">对 ${reciteSession.correct} · 跳过 ${reciteSession.skipped}</div>
      <div class="action-row">
        <button class="primary" onclick="buildReciteQueue();renderContent();">再练一轮</button>
        <button onclick="switchMode('browse')">返回单词</button>
      </div>
    </div>`;
  }
  const item = reciteQueue[recitePos];
  const levelTips = {
    1: '看中文，写出英文',
    2: '看英文，写出中文',
    3: '听发音，写出英文'
  };
  let promptMain = '', promptSub = '';
  if (reciteLevel === 1) {
    // L1 提示也用简短中文，便于对译
    promptMain = simpleZh(item.zh);
    promptSub = (item.pos || '') + ' · 写出英文';
  } else if (reciteLevel === 2) {
    promptMain = item.en;
    promptSub = (item.phon || '') + ' · 写出简单中文';
  } else {
    // L3：不显示英文单词，自动放音（只保留一处重听按钮）
    promptMain = '听音写词';
    promptSub = simpleZh(item.zh) + (item.pos ? ' · ' + item.pos : '');
  }

  return `<div class="recite-prompt">
    <div class="prompt-sub">L${reciteLevel} · ${levelTips[reciteLevel]} · ${recitePos + 1}/${reciteQueue.length}</div>
    <div class="prompt-main">${esc(promptMain)}</div>
    <div class="prompt-sub">${esc(promptSub)}</div>
    ${reciteLevel === 3 ? `<button type="button" class="speak-btn" style="font-size:1.25em;margin-top:8px;" onclick="replayReciteAudio()">🔊 再听一遍</button>` : ''}
  </div>
  <input class="recite-area" id="reciteInput" placeholder="在此输入答案…（Enter 检查 · 空格 跳过 · ? 看答案）" autofocus autocomplete="off" onkeydown="onReciteKeydown(event)" style="min-height:48px;">
  <div class="action-row">
    <button type="button" class="primary" onclick="checkRecite()">检查</button>
    <button type="button" onclick="showReciteAnswer()">看答案</button>
    <button type="button" onclick="skipRecite()">跳过</button>
  </div>
  <div id="reciteResult"></div>`;
}

function onReciteKeydown(event) {
  // Enter：检查；空格（空输入）：跳过；?：看答案
  if (event.key === 'Enter') {
    event.preventDefault();
    checkRecite();
    return;
  }
  if (event.key === '?' || (event.key === '/' && event.shiftKey) || event.code === 'Slash' && event.shiftKey) {
    event.preventDefault();
    showReciteAnswer();
    return;
  }
  // 部分键盘 ? 在 Shift+/，未拦截到时 key 可能为 '/'
  if (event.key === '/' && !event.ctrlKey && !event.altKey && !event.metaKey) {
    const el = event.target;
    if (!(el?.value || '').trim()) {
      event.preventDefault();
      showReciteAnswer();
      return;
    }
  }
  if (event.key === ' ' || event.code === 'Space' || event.key === 'Spacebar') {
    const el = event.target;
    const val = (el?.value || '');
    // 仅当输入框为空（或只有空格）时，空格键跳过，避免干扰正常输入
    if (!val.trim()) {
      event.preventDefault();
      skipRecite();
    }
  }
}

function focusReciteInput(opts) {
  const selectAll = !!(opts && opts.selectAll);
  const clear = !!(opts && opts.clear);
  // 等 DOM 更新后再聚焦（检查按钮/重绘后）
  requestAnimationFrame(() => {
    setTimeout(() => {
      const el = document.getElementById('reciteInput');
      if (!el) return;
      if (clear) el.value = '';
      el.focus();
      if (selectAll && el.value) {
        el.select();
      } else {
        try {
          const len = el.value.length;
          el.setSelectionRange(len, len);
        } catch (e) {}
      }
    }, 0);
  });
}

function checkRecite() {
  const item = reciteQueue[recitePos];
  const inputEl = document.getElementById('reciteInput');
  const input = (inputEl?.value || '').trim();
  const result = document.getElementById('reciteResult');
  if (!input) {
    showToast('请先输入答案');
    focusReciteInput();
    return;
  }

  let ok = false;
  let answer = '';
  if (reciteLevel === 1 || reciteLevel === 3) {
    answer = item.en;
    ok = normalizeEn(input) === normalizeEn(item.en);
  } else {
    // L2：接受简短中文义项
    answer = simpleZh(item.zh);
    ok = matchZhAnswer(input, item.zh);
  }

  if (ok) {
    const showZh = reciteLevel === 2 ? simpleZh(item.zh) : item.zh;
    result.innerHTML = `<div class="compare-result"><span class="match">✓ 正确！</span> ${esc(item.en)} — ${esc(showZh)}</div>`;
    reciteSession.correct += 1;
    setTimeout(() => {
      recitePos++;
      renderContent();
      focusReciteInput({ clear: true });
    }, 700);
  } else {
    result.innerHTML = `<div class="compare-result"><span class="mismatch">✗ 再试试</span><br>你的答案：${esc(input)}<br>参考：<strong>${esc(answer)}</strong></div>`;
    reciteSession.wrong += 1;
    // 答错：不记单元次数；光标回输入框并全选
    focusReciteInput({ selectAll: true });
  }
}

function showReciteAnswer() {
  const item = reciteQueue[recitePos];
  const result = document.getElementById('reciteResult');
  if (reciteLevel === 2) {
    // L2 只给最简单的中文参考
    const simple = simpleZh(item.zh);
    const alts = zhAnswerList(item.zh).filter(a => a !== simple).slice(0, 3);
    const altText = alts.length ? `<br><span style="opacity:0.65;font-size:0.9em;">也可：${esc(alts.join(' / '))}</span>` : '';
    result.innerHTML = `<div class="compare-result">答案：<strong>${esc(simple)}</strong>${altText}</div>`;
  } else {
    result.innerHTML = `<div class="compare-result">答案：<strong>${esc(item.en)}</strong> — ${esc(simpleZh(item.zh))} ${item.phon ? '(' + esc(item.phon) + ')' : ''}</div>`;
  }
  focusReciteInput({ selectAll: true });
}

function skipRecite() {
  reciteSession.skipped += 1;
  recitePos++;
  renderContent();
  focusReciteInput({ clear: true });
}

function normalizeEn(s) {
  return s.toLowerCase().replace(/[.,!?'"]/g, '').replace(/\s+/g, ' ').trim();
}

function normalizeZh(s) {
  return String(s || '')
    .replace(/\s+/g, '')
    .replace(/[，。、；：！？·\.\(\)（）\[\]【】"'“”‘’]/g, '')
    .toLowerCase();
}

/** 把释义拆成若干可接受的简短答案 */
function zhAnswerList(zh) {
  const raw = String(zh || '').trim();
  if (!raw) return [];
  const parts = raw
    .split(/[；;、\/｜|]/)
    .map(s => s.trim())
    .filter(Boolean);
  const list = [];
  for (const p of parts) {
    // 去掉括号补充：计划（名词）→ 计划
    const noParen = p.replace(/[（(][^）)]*[）)]/g, '').trim();
    if (noParen) list.push(noParen);
    list.push(p);
    // 「父亲或母亲」→ 也接受「父母」「父亲」「母亲」
    if (/或/.test(noParen)) {
      noParen.split('或').forEach(x => {
        const t = x.trim();
        if (t) list.push(t);
      });
    }
    // 「对…感兴趣」类：取核心两字以上片段
    const core = noParen.replace(/[…\.]/g, '').replace(/^(对|把|被|在|与|和|向)/, '');
    if (core && core.length >= 2 && core !== noParen) list.push(core);
  }
  // 去重，短的优先（默写 L2 倾向简单答案）
  const seen = new Set();
  const uniq = [];
  for (const a of list.sort((a, b) => a.length - b.length)) {
    const k = normalizeZh(a);
    if (!k || seen.has(k)) continue;
    seen.add(k);
    uniq.push(a);
  }
  return uniq;
}

/** L2 展示用：取最短、最简单的一个释义 */
function simpleZh(zh) {
  const list = zhAnswerList(zh);
  if (!list.length) return String(zh || '');
  // 优先 2–6 字的简短义
  const preferred = list.find(a => a.length >= 1 && a.length <= 6) || list[0];
  return preferred;
}

/** L2：用户中文是否匹配任一简短/完整释义 */
function matchZhAnswer(input, zh) {
  const inn = normalizeZh(input);
  if (!inn) return false;
  const answers = zhAnswerList(zh);
  for (const a of answers) {
    const an = normalizeZh(a);
    if (!an) continue;
    if (inn === an) return true;
    // 用户写得更短但命中答案核心
    if (an.length >= 2 && (an.includes(inn) || inn.includes(an))) {
      // 至少 1 个汉字，且不要过宽（单字仅当答案本身单字）
      if (inn.length >= 2 || an.length === 1) return true;
    }
  }
  // 完整原句宽松包含
  const full = normalizeZh(zh);
  if (full && (full.includes(inn) || inn.includes(full)) && inn.length >= 2) return true;
  return false;
}

function renderFlashcard(u) {
  let html = `<div class="section-title">🃏 单词闪卡 · ${u.words.length} 张 <span style="font-weight:400;opacity:0.6;">每行 3 张 · 点击发音并翻转</span></div>
  <div class="flashcard-grid">`;
  u.words.forEach((w, i) => {
    html += `<div class="flashcard" id="flashcard-${i}" data-word-i="${i}" onclick="onFlashcardClick(${i}, event)">
      <div class="flashcard-inner">
        <div class="flashcard-front">
          <div class="fc-word">${esc(w.en)}</div>
          ${w.phon ? `<div class="fc-phon">${esc(w.phon)}</div>` : ''}
        </div>
        <div class="flashcard-back">
          <div class="fc-zh">${esc(w.zh || '—')}</div>
          ${w.phon ? `<div class="fc-phon">${esc(w.phon)}</div>` : ''}
          ${w.pos ? `<div class="fc-pos">${esc(w.pos)}</div>` : ''}
        </div>
      </div>
    </div>`;
  });
  html += `</div>
  <div class="action-row">
    <button type="button" onclick="flipAllCards(false)">全部正面</button>
    <button type="button" onclick="flipAllCards(true)">全部反面</button>
    <button type="button" class="primary" onclick="updateUnitProgress(unit().id,4,{asSession:true});showToast('本单元闪卡已记 1 组 · 掌握 ✓')">全部掌握</button>
  </div>`;
  return html;
}

function speakWordAt(i) {
  const w = unit()?.words?.[i];
  if (w?.en) speak(w.en);
}

function onFlashcardClick(i, e) {
  speakWordAt(i);
  flipCard(i);
}

function flipCard(i) {
  document.getElementById('flashcard-' + i)?.classList.toggle('flipped');
}

function flipAllCards(open) {
  document.querySelectorAll('.flashcard').forEach(el => {
    el.classList.toggle('flipped', !!open);
  });
}

function markMastered() {
  updateUnitProgress(unit().id, 4, { asSession: true });
  showToast('本单元已记 1 组 · 标记掌握 ✓');
}

function speakWord(i) {
  const w = unit().words[i];
  if (w) speak(w.en);
}

/** 顺序朗读本单元全部核心单词（一次入队，兼容 Chrome） */
function speakAllWords(ev) {
  if (ev) {
    ev.preventDefault();
    ev.stopPropagation();
  }
  const list = (unit()?.words || []).map(w => (w.en || '').trim()).filter(Boolean);
  if (!list.length) {
    showToast('本单元暂无单词');
    return;
  }
  if (!window.speechSynthesis) {
    showToast('当前浏览器不支持朗读');
    return;
  }

  // 先停掉当前朗读
  stopAllSpeech();
  _speakAllActive = true;
  showToast(`开始朗读 ${list.length} 个单词…`);

  // 预热语音列表（部分浏览器首次为空）
  ensureVoices();

  // Chrome：cancel 后需延迟再 speak；整表一次入队比 onend 串联更稳
  _speakAllTimer = setTimeout(() => {
    if (!_speakAllActive) return;
    try {
      if (window.speechSynthesis.paused) window.speechSynthesis.resume();
      // 再保险：部分环境 cancel 后 speaking 标志未清
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
    } catch (e) {}

    _speakAllTimer = setTimeout(() => {
      if (!_speakAllActive) return;
      try {
        if (window.speechSynthesis.paused) window.speechSynthesis.resume();
        list.forEach((text, idx) => {
          const u = makeUtterance(text);
          // 词与词之间略停顿：在文本后加短停（部分引擎支持）
          // 用 rate 统一；onend 仅用于最后收尾提示
          if (idx === list.length - 1) {
            u.onend = () => {
              if (_speakAllActive) {
                _speakAllActive = false;
                showToast('本单元单词朗读完成');
              }
            };
          }
          u.onerror = () => { /* 跳过单个失败，继续队列 */ };
          window.speechSynthesis.speak(u);
        });
        // 若队列没挂上（Chrome 偶发），回退为逐个 speak
        setTimeout(() => {
          if (_speakAllActive && !window.speechSynthesis.speaking && !window.speechSynthesis.pending) {
            speakAllWordsFallback(list);
          }
        }, 400);
      } catch (e) {
        speakAllWordsFallback(list);
      }
    }, 120);
  }, 100);
}

/** 回退：逐词朗读（onend + 超时双保险） */
function speakAllWordsFallback(list) {
  let i = 0;
  _speakAllActive = true;
  const play = () => {
    if (!_speakAllActive) return;
    if (i >= list.length) {
      _speakAllActive = false;
      showToast('本单元单词朗读完成');
      return;
    }
    try {
      if (window.speechSynthesis.paused) window.speechSynthesis.resume();
      const text = list[i++];
      const u = makeUtterance(text);
      let done = false;
      const goNext = () => {
        if (done) return;
        done = true;
        clearTimeout(safety);
        setTimeout(play, 250);
      };
      const safety = setTimeout(goNext, Math.max(1800, text.length * 350));
      u.onend = goNext;
      u.onerror = goNext;
      window.speechSynthesis.speak(u);
    } catch (e) {
      setTimeout(play, 200);
    }
  };
  setTimeout(play, 80);
}

function updateStatsBar() {
  const u = unit();
  const p = getUnitProgress(u.id);
  const levels = ['未学', '待加强', '了解', '熟悉', '掌握'];
  document.getElementById('statsBar').innerHTML = `
    <span>📍 ${u.book} ${u.code}</span>
    <span>📚 ${u.words.length} 词 · ${u.phrases.length} 短语</span>
    <span>⭐ ${levels[p.level || 0]}（练 ${p.count || 0} 组）</span>
    <span>🎯 ${currentModeLabel()}</span>
  `;
}

function currentModeLabel() {
  const map = {
    browse: '单词', phrase: '短语', pattern: '句型', grammar: '语法',
    cloze: '填空', recite: '默写 L' + reciteLevel, flashcard: '闪卡'
  };
  return map[currentMode] || currentMode;
}

function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escapeReg(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ===== 键盘快捷键 =====
document.addEventListener('keydown', (e) => {
  if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT') return;
  if (e.shiftKey || e.ctrlKey || e.metaKey || e.altKey) return;
  if (e.key === 'h' || e.key === 'H') {
    e.preventDefault();
    location.href = 'index.html';
  }
});

// ===== Init =====
function init() {
  loadProgress();
  try {
    const theme = localStorage.getItem(STORAGE_THEME) || 'dark';
    document.documentElement.setAttribute('data-theme', theme);
    const savedId = localStorage.getItem(STORAGE_UNIT);
    if (savedId) {
      const idx = UNITS.findIndex(u => u.id === savedId);
      if (idx >= 0) currentIndex = idx;
    }
    const m = localStorage.getItem(STORAGE_MODE);
    if (m) currentMode = m;
    const rl = parseInt(localStorage.getItem(STORAGE_RL) || '1', 10);
    if (rl >= 1 && rl <= 3) reciteLevel = rl;
  } catch (e) {}

  // set active mode button
  document.querySelectorAll('.mode-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.mode === (currentMode === 'recite' ? 'recite' : currentMode) ||
      (currentMode === 'recite' && b.dataset.mode === 'recite'));
  });
  if (currentMode === 'recite') {
    document.getElementById('reciteBtn').textContent = '🗣️ 默写 L' + reciteLevel;
  }

  renderChapterList();
  renderContent();
}

init();
