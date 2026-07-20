/**
 * 音效模块（自 saolei.html 抽出）
 * Web Audio API，无外部音频文件
 * 用法：<script src="sound-minesweeper.js"></script>
 */
/* ============================================================
   声音系统 —— 钢琴音色 + Web Audio API 合成
   ============================================================ */
var Sound = {
  ctx: null,
  enabled: true,
  hoverEnabled: false,
  masterGain: null,
  _suppress: false,   // 和弦操作时抑制单格声音

  init() {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      return;
    }
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AC();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.5;
      this.masterGain.connect(this.ctx.destination);
      // iOS 需要用户手势后才能播放，如果创建后是 suspended 状态，记录一下
      if (this.ctx.state === 'suspended') {
        this._needsResume = true;
      }
    } catch (e) {}
  },

  // iOS 音频解锁：必须在用户手势中调用
  unlock() {
    if (!this.ctx) {
      this.init();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().then(() => {
        this._needsResume = false;
      }).catch(() => {});
    }
  },

  toggle() {
    this.enabled = !this.enabled;
    if (this.masterGain) {
      this.masterGain.gain.value = this.enabled ? 0.5 : 0;
    }
    return this.enabled;
  },

  // 钢琴音色：基频 + 多次泛音 + 快速衰减
  _piano(freq, velocity = 0.7, duration = 1.5) {
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
      g.gain.exponentialRampToValueAtTime(0.001, t + duration);
      osc.connect(g);
      g.connect(this.masterGain);
      osc.start(t);
      osc.stop(t + duration + 0.1);
    });
  },

  // 轻触音（连锁展开用，支持力度参数）
  _pianoSoft(freq, velocity = 0.09) {
    if (!this.ctx || !this.enabled) return;
    const ctx = this.ctx;
    const t = ctx.currentTime;
    [1.0, 2.0, 3.0, 4.0].forEach(mult => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      const detune = (Math.random() - 0.5) * 2;
      osc.frequency.setValueAtTime(mult * freq + detune, t);
      const vol = (1 / mult) * velocity;
      g.gain.setValueAtTime(vol, t);
      g.gain.exponentialRampToValueAtTime(vol * 0.25, t + 0.06);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
      osc.connect(g);
      g.connect(this.masterGain);
      osc.start(t);
      osc.stop(t + 0.6);
    });
  },

  // 噪音（爆炸用）
  _noise(duration, gain = 0.2) {
    if (!this.ctx || !this.enabled) return;
    const ctx = this.ctx;
    const t = ctx.currentTime;
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 2);
    }
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    const g = ctx.createGain();
    g.gain.setValueAtTime(gain, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + duration);
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2000, t);
    src.connect(filter);
    filter.connect(g);
    g.connect(this.masterGain);
    src.start(t);
    src.stop(t + duration);
  },

  _freqForSum(sum) {
    // 固定五声音阶音高池(Hz)，总和影响偏好但随机数主导，创造惊喜
    const pool = [262, 294, 330, 392, 440, 523, 587, 659, 784];
    const s = Math.abs(Math.round(sum != null ? sum : 0));
    const r = Math.random();
    let idx;
    if (r < 0.55) {
      // 55% 完全随机从音池中抽取，每次都是惊喜
      idx = Math.floor(Math.random() * pool.length);
    } else if (r < 0.80) {
      // 25% 总和相关但加随机跳动
      const base = s % pool.length;
      idx = Math.max(0, Math.min(pool.length - 1, base + Math.floor(Math.random() * 5) - 2));
    } else {
      // 20% 大跳：随机八度跳跃，制造戏剧性
      const low = [131, 147, 165, 196, 220];
      const high = [1047, 1175, 1319, 1568, 1760];
      const dramatic = Math.random() < 0.5 ? low : high;
      return dramatic[Math.floor(Math.random() * dramatic.length)];
    }
    return pool[idx];
  },



  // ── 公开接口（与旧版兼容）──

  click(sum) {
    // 单击=单音，但偶尔加花：装饰音、双音、或力度突变
    if (this._suppress) return;
    const freq = this._freqForSum(sum);
    const r = Math.random();
    if (r < 0.18) {
      // 18% 前倚音装饰
      const graceFreq = freq * 0.75;
      this._pianoSoft(graceFreq, 0.06);
      setTimeout(() => this._piano(freq, 0.50, 0.7), 35);
    } else if (r < 0.28) {
      // 10% 双音齐鸣（五度），像钢琴左右手
      this._piano(freq, 0.45, 0.9);
      setTimeout(() => this._piano(freq * 1.5, 0.35, 0.7), 15);
    } else if (r < 0.35) {
      // 7% 强力重击
      this._piano(freq, 0.75, 0.5);
    } else {
      // 65% 正常单音
      this._piano(freq, 0.55, 0.8);
    }
  },

  // 20种钢琴演奏风格，每次连锁展开随机选一种
  _generatePhrase(totalNotes, startFreq) {
    const p = [1, 9/8, 5/4, 3/2, 5/3];  // 五声音阶比率
    const t = totalNotes;
    const f = startFreq;

    // 20种风格 → 每种有独特的音高序列和节奏模式
    const style = Math.floor(Math.random() * 20);
    const notes = [];

    switch (style) {
      case 0: // 舒缓上行 — 均匀步步高
        for (let i = 0; i < t; i++) {
          notes.push({ f: f * p[i % 5] * (1 + Math.floor(i / 5)), d: i * 110, v: 0.05 + i / t * 0.07 });
        } break;
      case 1: // 急流下行 — 从高音倾泻
        for (let i = 0; i < t; i++) {
          const idx = t - 1 - i;
          notes.push({ f: f * p[idx % 5] * (1 + Math.floor(idx / 5)) * 0.7, d: i * 70, v: 0.11 - i / t * 0.05 });
        } break;
      case 2: // 波浪起伏 — 来回荡漾
        for (let i = 0; i < t; i++) {
          const wave = Math.sin(i * Math.PI / (t * 0.55)) * Math.min(t / 2, 8);
          const idx = Math.max(0, Math.round(wave));
          notes.push({ f: f * p[idx % 5] * (1 + Math.floor(idx / 5)), d: i * 65 + Math.random() * 25, v: 0.05 + Math.abs(Math.sin(i / t * Math.PI)) * 0.08 });
        } break;
      case 3: // 跳跃和弦 — 分解大跳
        for (let i = 0; i < t; i++) {
          const deg = [1, 5 / 4, 3 / 2, 2, 3, 1.5, 2.5, 4][i % 8];
          notes.push({ f: f * deg, d: i * 55, v: 0.06 + (i % 3 === 0 ? 0.06 : 0) });
        } break;
      case 4: // 五声漫步 — 随机上下
        for (let i = 0, s = 0; i < t; i++) {
          s = Math.max(0, s + Math.floor(Math.random() * 5) - 1);
          notes.push({ f: f * p[s % 5] * (1 + Math.floor(s / 5)), d: i * 70 + Math.random() * 35, v: 0.05 + Math.random() * 0.06 });
        } break;
      case 5: // 爵士摇摆 — 长-短交替
        for (let i = 0; i < t; i++) {
          notes.push({ f: f * p[i % 5] * (1 + Math.floor(i / 4)), d: Math.floor(i / 2) * 150 + (i % 2) * 40, v: i % 2 ? 0.06 : 0.10 });
        } break;
      case 6: // 古典琶音 — 三连音上行
        for (let i = 0; i < t; i++) {
          const oct = 1 + Math.floor(i / 3);
          notes.push({ f: f * [1, 1.25, 1.5][i % 3] * oct, d: i * 80, v: 0.07 + i / t * 0.04 });
        } break;
      case 7: // 蓝调弯音 — 半音化偏移
        for (let i = 0; i < t; i++) {
          const bend = (Math.random() - 0.5) * 0.06;
          notes.push({ f: f * (p[i % 5] + bend) * (1 + Math.floor(i / 5)), d: i * 85, v: 0.05 + Math.random() * 0.07 });
        } break;
      case 8: // 东方五声 — 宫商角徵羽顺序
        for (let i = 0; i < t; i++) {
          const order = [0, 2, 4, 1, 3];  // 跳跃音阶
          notes.push({ f: f * p[order[i % 5]] * (1 + Math.floor(i / 5)), d: i * 95, v: 0.06 + i / t * 0.05 });
        } break;
      case 9: // 华尔兹 — 强-弱-弱
        for (let i = 0; i < t; i++) {
          notes.push({ f: f * p[i % 5] * (1 + Math.floor(i / 5)), d: i * 100, v: i % 3 === 0 ? 0.12 : 0.04 });
        } break;
      case 10: // 探戈切分 — 重音在弱拍
        for (let i = 0; i < t; i++) {
          const synco = i % 4 === 2 ? 0.11 : (i % 4 === 0 ? 0.07 : 0.04);
          notes.push({ f: f * p[i % 5] * (1 + Math.floor(i / 5)), d: i * 60, v: synco });
        } break;
      case 11: // 急速冲刺 — 越来越快
        for (let i = 0; i < t; i++) {
          notes.push({ f: f * p[i % 5] * (2 + Math.floor(i / 3)), d: i * Math.max(15, 75 - i * 2.5), v: 0.05 + i / t * 0.08 });
        } break;
      case 12: // 钟声齐鸣 — 泛音列
        for (let i = 0; i < t; i++) {
          const overtones = [1, 2, 3, 4, 5, 6, 8];
          notes.push({ f: f * overtones[i % 7], d: i * 120, v: 0.10 - i / t * 0.05 });
        } break;
      case 13: // 梦幻涟漪 — 音与音叠在一起
        for (let i = 0; i < t; i++) {
          notes.push({ f: f * p[i % 5] * (1 + Math.floor(i / 5)), d: i * 40, v: 0.04 + 0.02 * Math.sin(i) });
        } break;
      case 14: // 进行曲 — 坚定均匀
        for (let i = 0; i < t; i++) {
          notes.push({ f: f * p[i % 5] * (1 + Math.floor(i / 5)), d: i * 130, v: 0.09 });
        } break;
      case 15: // 自由散板 — 时快时慢
        for (let i = 0, acc = 0; i < t; i++) {
          const gap = 40 + Math.random() * 140;
          acc += gap;
          notes.push({ f: f * p[i % 5] * (1 + Math.floor(i / 5)), d: acc, v: 0.05 + Math.random() * 0.08 });
        } break;
      case 16: // 滚奏连音 — 密集同音重复
        for (let i = 0; i < t; i++) {
          notes.push({ f: f * p[Math.floor(i / 3) % 5] * (1 + Math.floor(i / 10)), d: i * 22, v: 0.03 + (i % 3 === 0 ? 0.06 : 0) });
        } break;
      case 17: // 问答对位 — 高低音交替
        for (let i = 0; i < t; i++) {
          const high = i % 2 === 0;
          const oct = high ? 3 : 1;
          notes.push({ f: f * p[i % 5] * oct, d: i * 90, v: high ? 0.08 : 0.06 });
        } break;
      case 18: // 大跳炫技 — 八度大跳
        for (let i = 0; i < t; i++) {
          const leap = i % 3 === 0 ? 4 : (i % 3 === 1 ? 0.5 : 1);
          notes.push({ f: f * p[i % 5] * leap, d: i * 75, v: 0.06 + (i % 3 === 0 ? 0.06 : 0) });
        } break;
      case 19: // 终曲华彩 — 先慢后快再慢收
        for (let i = 0; i < t; i++) {
          const pos = i / t;
          const spacing = pos < 0.2 ? 140 : (pos < 0.6 ? 60 : 100);
          const vel = pos < 0.2 ? 0.06 : (pos < 0.7 ? 0.12 : 0.05);
          notes.push({ f: f * p[i % 5] * (1 + Math.floor(i / 4)), d: i * spacing, v: vel });
        } break;
    }

    return notes;
  },

  cascade(count, sum) {
    // 连锁展开：总和决定基调，格子越多音符越多、演奏越久
    if (this._suppress) return;
    const totalNotes = Math.min(35, Math.max(2, count));
    const startFreq = this._freqForSum(sum);
    const phrase = this._generatePhrase(totalNotes, startFreq);

    phrase.forEach(note => {
      setTimeout(() => this._pianoSoft(note.f, note.v), note.d);
    });

    // 收尾和弦：最后一个音之后，弹一组轻柔长音收束全曲
    const lastDelay = phrase.length > 0 ? phrase[phrase.length - 1].d : 0;
    setTimeout(() => {
      this._piano(startFreq, 0.22, 2.2);
      setTimeout(() => this._piano(startFreq * 1.5, 0.18, 1.8), 110);
      setTimeout(() => this._piano(startFreq * 2, 0.14, 2.0), 220);
    }, lastDelay + 160);
  },

  flag() {
    // 插旗：清脆八度双音叮咚
    if (!this.ctx || !this.enabled) return;
    const ctx = this.ctx;
    const t = ctx.currentTime;
    [1760, 2349].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t + i * 0.015);
      g.gain.setValueAtTime(0.10, t + i * 0.015);
      g.gain.exponentialRampToValueAtTime(0.001, t + i * 0.015 + 0.12);
      osc.connect(g);
      g.connect(this.masterGain);
      osc.start(t + i * 0.015);
      osc.stop(t + i * 0.015 + 0.15);
    });
  },

  unflag() {
    // 取消插旗：轻声回落滑音
    if (!this.ctx || !this.enabled) return;
    const ctx = this.ctx;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, t);
    osc.frequency.exponentialRampToValueAtTime(400, t + 0.10);
    g.gain.setValueAtTime(0.07, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
    osc.connect(g);
    g.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.15);
  },

  // 悬停提示音：极轻柔短音揭露隐藏数字
  hoverHint(sum) {
    if (!this.ctx || !this.enabled || !this.hoverEnabled) return;
    const map = {'-1':110,'0':165,'1':262,'2':294,'3':330,'4':392,'5':440,'6':523,'7':587,'8':659};
    const freq = map[String(sum)] || 262;
    const ctx = this.ctx;
    const t = ctx.currentTime;
    [1.0, 2.0].forEach(mult => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(mult * freq, t);
      g.gain.setValueAtTime((1 / mult) * 0.04, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
      osc.connect(g);
      g.connect(this.masterGain);
      osc.start(t);
      osc.stop(t + 0.3);
    });
  },

  explosion() {
    // 爆炸：噪音 + 低频轰降 + 金属残响
    this._noise(0.7, 0.40);
    [80, 70, 60, 50].forEach((freq, i) => {
      if (!this.ctx || !this.enabled) return;
      const ctx = this.ctx;
      const t = ctx.currentTime + i * 0.04;
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, t);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.3, t + 0.6);
      g.gain.setValueAtTime(0.12, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.65);
      osc.connect(g);
      g.connect(this.masterGain);
      osc.start(t);
      osc.stop(t + 0.7);
    });
    setTimeout(() => {
      if (!this.ctx || !this.enabled) return;
      const osc2 = this.ctx.createOscillator();
      const g2 = this.ctx.createGain();
      osc2.type = 'square';
      osc2.frequency.setValueAtTime(200, this.ctx.currentTime);
      osc2.frequency.exponentialRampToValueAtTime(50, this.ctx.currentTime + 0.3);
      g2.gain.setValueAtTime(0.06, this.ctx.currentTime);
      g2.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);
      osc2.connect(g2);
      g2.connect(this.masterGain);
      osc2.start(this.ctx.currentTime);
      osc2.stop(this.ctx.currentTime + 0.4);
    }, 60);
  },

  win() {
    // 胜利：随机选择一条五声音阶上行旋律，每次都不同
    const r = Math.random();
    let melody;
    if (r < 0.3) {
      melody = [262, 330, 392, 523, 659, 784, 1047];
    } else if (r < 0.55) {
      melody = [392, 523, 659, 784, 1047, 1319, 1568];
    } else if (r < 0.75) {
      melody = [196, 262, 330, 392, 523, 659, 784, 523, 392];
    } else {
      melody = [262, 392, 523, 330, 659, 392, 784, 523, 1047];
    }
    melody.forEach((freq, i) => {
      const vel = 0.6 + (i / melody.length) * 0.3;
      setTimeout(() => this._piano(freq, vel, 1.4), i * 90 + Math.random() * 20);
    });
  },

  lose() {
    // 失败：随机选择一种下行悲剧色彩旋律
    const r = Math.random();
    let notes;
    if (r < 0.4) {
      notes = [[440,0,0.35,0.9],[349,150,0.35,0.8],[277,300,0.35,0.9],[220,480,0.3,1.2]];
    } else if (r < 0.7) {
      notes = [[523,0,0.30,0.7],[392,130,0.30,0.7],[294,270,0.32,0.8],[196,420,0.28,1.3]];
    } else {
      notes = [[659,0,0.32,0.6],[440,120,0.28,0.7],[330,250,0.30,0.8],[165,400,0.25,1.5]];
    }
    notes.forEach(([freq, delay, vel, dur]) => {
      setTimeout(() => this._piano(freq, vel, dur), delay);
    });
  },

  hint() {
    // 禅心指引：空灵五度泛音，余韵悠长
    if (!this.ctx || !this.enabled) return;
    const ctx = this.ctx;
    const t = ctx.currentTime;
    [784, 1175, 1568].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t + i * 0.10);
      g.gain.setValueAtTime(0.09, t + i * 0.10);
      g.gain.exponentialRampToValueAtTime(0.001, t + i * 0.10 + 0.40);
      osc.connect(g);
      g.connect(this.masterGain);
      osc.start(t + i * 0.10);
      osc.stop(t + i * 0.10 + 0.45);
    });
  },

  chord(sum) {
    // 双击=和弦：70%齐奏，30%滚奏琶音（钢琴刮键效果）
    this._suppress = true;
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

    const maxDur = Math.max(...notes.map(n => n[2]));
    const totalDelay = rolled ? (notes.length - 1) * 47 : 0;
    setTimeout(() => { this._suppress = false; }, totalDelay + maxDur * 1000 + 50);
  },

  // 声音开关按钮用的测试音
  beep(freq, duration, type, volume) {
    if (!this.ctx || !this.enabled) return;
    const ctx = this.ctx;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type || 'sine';
    osc.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(volume || 0.12, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + (duration || 0.08));
    osc.connect(g);
    g.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + (duration || 0.08) + 0.02);
  }
};
