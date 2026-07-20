/**
 * 音效模块（自 7749.html 抽出）
 * Web Audio API，无外部音频文件
 * 用法：<script src="sound-tetris.js"></script>
 */
// ==================== 音效系统（与扫雷保持一致风格） ====================
var Sound = {
  enabled: true,
  ctx: null,
  masterGain: null,
  _needsResume: false,
  _lastChordTime: 0,

  init() {
    if (this.ctx) {
      if (this._needsResume && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      return;
    }
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AC();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 1.0;
      this.masterGain.connect(this.ctx.destination);
      if (this.ctx.state === 'suspended') {
        this._needsResume = true;
      }
    } catch (e) {}
  },

  _unlockedOnce: false,
  unlock() {
    if (!this.ctx) this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().then(() => {
        this._needsResume = false;
        // 首次解锁播放欢迎音，确认音频已激活
        if (!this._unlockedOnce && this.enabled) {
          this._unlockedOnce = true;
          this._beep(523, 0.08, 'sine', 0.06);
          setTimeout(() => this._beep(659, 0.08, 'sine', 0.06), 60);
          setTimeout(() => this._beep(784, 0.10, 'sine', 0.06), 120);
        }
      }).catch(() => {});
    }
  },

  toggle() {
    this.enabled = !this.enabled;
    if (this.masterGain) {
      this.masterGain.gain.value = this.enabled ? 1.0 : 0;
    }
    return this.enabled;
  },

  _piano(freq, velocity, duration) {
    if (!this.ctx || !this.enabled) return;
    const ctx = this.ctx;
    const t = ctx.currentTime;
    const harmonics = [
      { mult: 1.0, gain: 1.0 },
      { mult: 2.0, gain: 0.55 },
      { mult: 3.0, gain: 0.30 },
      { mult: 4.0, gain: 0.15 },
      { mult: 5.0, gain: 0.07 },
    ];
    harmonics.forEach(h => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      const detune = (Math.random() - 0.5) * 3;
      osc.frequency.setValueAtTime(h.mult * freq + detune, t);
      const vol = h.gain * velocity * 0.22;
      g.gain.setValueAtTime(vol, t);
      g.gain.exponentialRampToValueAtTime(vol * 0.6, t + 0.08);
      g.gain.exponentialRampToValueAtTime(vol * 0.15, t + 0.4);
      g.gain.exponentialRampToValueAtTime(0.001, t + (duration || 1.5));
      osc.connect(g);
      g.connect(this.masterGain);
      osc.start(t);
      osc.stop(t + (duration || 1.5) + 0.1);
    });
  },

  _noise(dur, gain) {
    if (!this.ctx || !this.enabled) return;
    const ctx = this.ctx;
    const t = ctx.currentTime;
    const bufferSize = ctx.sampleRate * dur;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 2);
    }
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    const g = ctx.createGain();
    g.gain.setValueAtTime(gain, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2000, t);
    src.connect(filter);
    filter.connect(g);
    g.connect(this.masterGain);
    src.start(t);
    src.stop(t + dur);
  },

  _beep(freq, dur, type, vol) {
    if (!this.ctx || !this.enabled) return;
    const ctx = this.ctx;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type || 'sine';
    osc.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(vol || 0.12, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + (dur || 0.08));
    osc.connect(g);
    g.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + (dur || 0.08) + 0.02);
  },

  // ========== 俄罗斯方块音效 ==========

  move() {
    // 左右移动：清脆短促的咔嗒声
    this._beep(300, 0.05, 'square', 0.12);
  },

  // ========== 和弦系统（与扫雷统一风格） ==========

  _freqForSum(sum) {
    const pool = [262, 294, 330, 392, 440, 523, 587, 659, 784];
    const low = [131, 147, 165, 196, 220];
    const s = Math.abs(Math.round(sum != null ? sum : 0));
    const r = Math.random();
    let idx;
    if (r < 0.50) {
      idx = Math.floor(Math.random() * pool.length);
    } else if (r < 0.78) {
      const base = s % pool.length;
      idx = Math.max(0, Math.min(pool.length - 1, base + Math.floor(Math.random() * 5) - 2));
    } else {
      return low[Math.floor(Math.random() * low.length)];
    }
    return pool[idx];
  },

  _pianoSoft(freq, velocity) {
    if (!this.ctx || !this.enabled) return;
    const ctx = this.ctx;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(velocity * 0.12, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
    osc.connect(g);
    g.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.4);
  },

  chord(sum) {
    // 和弦：70%齐奏，30%滚奏琶音（与扫雷一致）
    const s = Math.abs(Math.round(sum != null ? sum : 4));
    const root = this._freqForSum(s);
    const rolled = Math.random() < 0.3;

    let notes;
    if (s <= 3) {
      notes = [[root,0.22,1.8],[root*1.25,0.16,1.5],[root*1.5,0.18,1.6],[root*2,0.14,2.0]];
    } else if (s <= 7) {
      notes = [[root,0.22,1.8],[root*1.2,0.15,1.5],[root*1.5,0.18,1.6],[root*2,0.13,2.0]];
    } else if (s <= 12) {
      notes = [[root,0.22,1.8],[root*1.33,0.14,1.4],[root*1.5,0.17,1.6],[root*2,0.13,2.0]];
    } else {
      notes = [[root,0.24,2.0],[root*1.5,0.18,1.7],[root*2,0.16,2.0],[root*3,0.14,2.2]];
    }

    notes.forEach(([freq, vel, dur], i) => {
      const stagger = rolled ? i * 35 + Math.random() * 12 : Math.random() * 5;
      setTimeout(() => this._piano(freq, vel, dur), stagger);
    });
  },

  mokugyo() {
    // 木鱼：空心木质敲击声，用于自然下落
    if (!this.ctx || !this.enabled) return;
    const ctx = this.ctx;
    const t = ctx.currentTime;
    const baseFreq = 900 + Math.random() * 300;
    // 主音：短促三角波，模拟空心木头共鸣
    [baseFreq, baseFreq * 1.6].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);
      g.gain.setValueAtTime(i === 0 ? 0.10 : 0.04, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
      osc.connect(g);
      g.connect(this.masterGain);
      osc.start(t);
      osc.stop(t + 0.06);
    });
    // 微噪音增加质感
    this._noise(0.02, 0.015);
  },

  softDrop() {
    // 手动软降：急促短音
    this._beep(800 + Math.random() * 400, 0.04, 'square', 0.08);
  },

  rotate() {
    // 旋转：上升的叮咚声
    this._beep(440, 0.05, 'sine', 0.06);
    setTimeout(() => this._beep(660, 0.05, 'sine', 0.05), 25);
  },

  lock() {
    // 方块锁定：低沉的叩击
    this._beep(120, 0.06, 'triangle', 0.08);
  },

  hardDrop() {
    // 硬降：金属感的重击 + 低频残响
    this._beep(100, 0.10, 'square', 0.12);
    if (!this.ctx || !this.enabled) return;
    const ctx = this.ctx;
    const t = ctx.currentTime;
    [60, 50, 40].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, t + i * 0.03);
      g.gain.setValueAtTime(0.06, t + i * 0.03);
      g.gain.exponentialRampToValueAtTime(0.001, t + i * 0.03 + 0.15);
      osc.connect(g);
      g.connect(this.masterGain);
      osc.start(t + i * 0.03);
      osc.stop(t + i * 0.03 + 0.2);
    });
    this._noise(0.1, 0.08);
  },

  lineClear(count) {
    // 消行：根据行数播放不同长度的五声音阶旋律
    if (!this.ctx || !this.enabled) return;
    const pentatonic = [262, 330, 392, 523, 659, 784, 1047];
    const noteCount = Math.min(count * 2 + 1, 7);
    for (let i = 0; i < noteCount; i++) {
      const freq = pentatonic[i];
      const vel = 0.25 + (i / noteCount) * 0.45;
      setTimeout(() => this._piano(freq, vel, 0.9), i * 55);
    }
  },

  tetris() {
    // 四行消除 Tetris!：辉煌的琶音
    if (!this.ctx || !this.enabled) return;
    [392, 523, 659, 784, 1047, 1319, 1568, 1047].forEach((freq, i) => {
      const vel = 0.35 + (i / 8) * 0.4;
      setTimeout(() => this._piano(freq, vel, 1.2), i * 45);
    });
    setTimeout(() => this._piano(392, 0.60, 2.5), 400);
  },

  levelUp() {
    // 升级：三音上行
    [523, 659, 784].forEach((freq, i) => {
      setTimeout(() => this._piano(freq, 0.50, 0.8), i * 80);
    });
  },

  gameOver() {
    // 游戏结束：下行悲伤旋律（与扫雷 lose 一致）
    if (!this.ctx || !this.enabled) return;
    const notes = [[440, 0, 0.35, 0.9], [349, 150, 0.35, 0.8], [277, 300, 0.35, 0.9], [220, 480, 0.3, 1.2]];
    notes.forEach(([freq, delay, vel, dur]) => {
      setTimeout(() => this._piano(freq, vel, dur), delay);
    });
  },

  newHigh() {
    // 新纪录：胜利号角（与扫雷 win 一致风格）
    const melody = [262, 330, 392, 523, 659, 784, 1047];
    melody.forEach((freq, i) => {
      const vel = 0.6 + (i / melody.length) * 0.3;
      setTimeout(() => this._piano(freq, vel, 1.4), i * 90 + Math.random() * 20);
    });
  },

  pause() {
    this._beep(600, 0.06, 'sine', 0.06);
    setTimeout(() => this._beep(400, 0.06, 'sine', 0.06), 80);
  },

  resume() {
    this._beep(400, 0.06, 'sine', 0.06);
    setTimeout(() => this._beep(600, 0.06, 'sine', 0.06), 80);
  },

  start() {
    // 游戏开始：短暂欢快上行
    [262, 392, 523].forEach((freq, i) => {
      setTimeout(() => this._beep(freq, 0.08, 'sine', 0.07), i * 60);
    });
  },
};
