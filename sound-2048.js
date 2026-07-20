/**
 * 音效模块（自 2048.html 抽出）
 * Web Audio API，无外部音频文件
 * 用法：<script src="sound-2048.js"></script>
 */
/* ============================================================
   声音系统 —— 钢琴音色 + Web Audio API 合成
   ============================================================ */
var Sound = {
  ctx: null,
  enabled: true,
  masterGain: null,

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
      this.masterGain.gain.value = 0.45;
      this.masterGain.connect(this.ctx.destination);
    } catch (e) {}
  },

  unlock() {
    if (!this.ctx) this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  },

  toggle() {
    this.enabled = !this.enabled;
    if (this.masterGain) {
      this.masterGain.gain.value = this.enabled ? 0.45 : 0;
    }
    return this.enabled;
  },

  // ── 基础音色引擎 ──
  _piano(freq, velocity = 0.7, duration = 1.2) {
    if (!this.ctx || !this.enabled) return;
    const ctx = this.ctx;
    const t = ctx.currentTime;
    const harmonics = [
      { mult: 1.0, gain: 1.0 },
      { mult: 2.0, gain: 0.5 },
      { mult: 3.0, gain: 0.25 },
      { mult: 4.0, gain: 0.12 },
    ];
    harmonics.forEach(h => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      const detune = (Math.random() - 0.5) * 3;
      osc.frequency.setValueAtTime(h.mult * freq + detune, t);
      const vol = h.gain * velocity * 0.2;
      g.gain.setValueAtTime(vol, t);
      g.gain.exponentialRampToValueAtTime(vol * 0.5, t + 0.1);
      g.gain.exponentialRampToValueAtTime(0.001, t + duration);
      osc.connect(g);
      g.connect(this.masterGain);
      osc.start(t);
      osc.stop(t + duration + 0.1);
    });
  },

  _pianoSoft(freq, velocity = 0.06, duration = 0.35) {
    if (!this.ctx || !this.enabled) return;
    const ctx = this.ctx;
    const t = ctx.currentTime;
    [1.0, 2.0].forEach(mult => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(mult * freq, t);
      const vol = (1 / mult) * velocity;
      g.gain.setValueAtTime(vol, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + duration);
      osc.connect(g);
      g.connect(this.masterGain);
      osc.start(t);
      osc.stop(t + duration + 0.05);
    });
  },

  // ── 木鱼声 ── 空心木质敲击，禅修韵味
  _woodenFish() {
    if (!this.ctx || !this.enabled) return;
    const ctx = this.ctx;
    const t = ctx.currentTime;
    const baseFreq = 280; // 280 Hz，木鱼基频

    // ① 敲击瞬态 — 噪声模拟木槌击打瞬间
    const bufSize = Math.floor(ctx.sampleRate * 0.025);
    const buffer = ctx.createBuffer(1, bufSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufSize * 0.06));
    }
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    const bf = ctx.createBiquadFilter();
    bf.type = 'bandpass';
    bf.frequency.setValueAtTime(baseFreq * 0.9, t);
    bf.Q.setValueAtTime(1.2, t);
    const gn = ctx.createGain();
    gn.gain.setValueAtTime(0.18, t);
    gn.gain.exponentialRampToValueAtTime(0.001, t + 0.025);
    src.connect(bf);
    bf.connect(gn);
    gn.connect(this.masterGain);
    src.start(t);
    src.stop(t + 0.03);

    // ② 木腔体共振 — 三角波，空心木头的主体音色
    const oscBody = ctx.createOscillator();
    const gBody = ctx.createGain();
    oscBody.type = 'triangle';
    oscBody.frequency.setValueAtTime(baseFreq, t);
    oscBody.frequency.exponentialRampToValueAtTime(baseFreq * 0.70, t + 0.12);
    gBody.gain.setValueAtTime(0.20, t);
    gBody.gain.setValueAtTime(0.16, t + 0.01);
    gBody.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
    oscBody.connect(gBody);
    gBody.connect(this.masterGain);
    oscBody.start(t);
    oscBody.stop(t + 0.26);

    // ③ 空腔低频 — 正弦波，木鱼中空腔体的低沉嗡鸣
    const oscCavity = ctx.createOscillator();
    const gCavity = ctx.createGain();
    oscCavity.type = 'sine';
    oscCavity.frequency.setValueAtTime(baseFreq * 0.55, t);
    gCavity.gain.setValueAtTime(0.16, t);
    gCavity.gain.setValueAtTime(0.12, t + 0.015);
    gCavity.gain.exponentialRampToValueAtTime(0.001, t + 0.38);
    oscCavity.connect(gCavity);
    gCavity.connect(this.masterGain);
    oscCavity.start(t);
    oscCavity.stop(t + 0.42);

    // ④ 木质泛音 — 轻微高次谐波，木头纹理感
    const oscWood = ctx.createOscillator();
    const gWood = ctx.createGain();
    oscWood.type = 'sine';
    oscWood.frequency.setValueAtTime(baseFreq * 2.05, t);
    gWood.gain.setValueAtTime(0.06, t);
    gWood.gain.exponentialRampToValueAtTime(0.001, t + 0.10);
    oscWood.connect(gWood);
    gWood.connect(this.masterGain);
    oscWood.start(t);
    oscWood.stop(t + 0.12);
  },

  // 公开接口
  woodenFish() {
    this._woodenFish();
  },

  _ping(freq, velocity = 0.08, duration = 0.18) {
    // 明亮短促的叮声
    if (!this.ctx || !this.enabled) return;
    const ctx = this.ctx;
    const t = ctx.currentTime;
    [1.0, 2.0, 3.0].forEach(mult => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(mult * freq, t);
      const vol = (1 / mult) * velocity;
      g.gain.setValueAtTime(vol, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + duration);
      osc.connect(g);
      g.connect(this.masterGain);
      osc.start(t);
      osc.stop(t + duration + 0.02);
    });
  },

  _pickFreq() {
    // 从丰富音池中选音高，带随机跳跃
    const r = Math.random();
    if (r < 0.4) {
      const pool = [262, 294, 330, 349, 392, 440, 494, 523, 587, 659, 698, 784];
      return pool[Math.floor(Math.random() * pool.length)];
    } else if (r < 0.7) {
      return 220 + Math.random() * 560;
    } else if (r < 0.9) {
      const low = [131, 147, 165, 196, 220, 247];
      return low[Math.floor(Math.random() * low.length)];
    } else {
      const high = [880, 988, 1047, 1175, 1319, 1568];
      return high[Math.floor(Math.random() * high.length)];
    }
  },

  // ── 20 种滑动音色（每次随机抽选）──
  move() {
    if (!this.ctx || !this.enabled) return;
    const style = Math.floor(Math.random() * 20);
    const freq = this._pickFreq();
    const ctx = this.ctx;
    const t = ctx.currentTime;

    switch (style) {
      case 0: // 轻柔单音
        this._pianoSoft(freq, 0.06);
        break;
      case 1: // 双音五度和声
        this._pianoSoft(freq, 0.05);
        this._pianoSoft(freq * 1.5, 0.04);
        break;
      case 2: // 前倚音装饰 — 低半音滑入
        this._pianoSoft(freq * 0.85, 0.04, 0.15);
        setTimeout(() => this._pianoSoft(freq, 0.07, 0.28), 35);
        break;
      case 3: // 八度跳跃 — 低高交替
        this._pianoSoft(freq * 0.5, 0.05, 0.20);
        setTimeout(() => this._pianoSoft(freq, 0.06, 0.25), 50);
        break;
      case 4: // 上行小琶音 — 三连音
        this._pianoSoft(freq, 0.04, 0.18);
        setTimeout(() => this._pianoSoft(freq * 1.25, 0.04, 0.18), 40);
        setTimeout(() => this._pianoSoft(freq * 1.5, 0.05, 0.20), 80);
        break;
      case 5: // 下行小琶音
        this._pianoSoft(freq * 1.5, 0.05, 0.18);
        setTimeout(() => this._pianoSoft(freq * 1.25, 0.04, 0.18), 35);
        setTimeout(() => this._pianoSoft(freq, 0.06, 0.20), 70);
        break;
      case 6: // 断奏弹跳 — 极短促
        this._ping(freq, 0.09, 0.10);
        break;
      case 7: // 双断奏
        this._ping(freq, 0.07, 0.08);
        setTimeout(() => this._ping(freq * 1.2, 0.06, 0.08), 50);
        break;
      case 8: // 颤音 — 快速交替
        this._pianoSoft(freq, 0.04, 0.10);
        setTimeout(() => this._pianoSoft(freq * 1.06, 0.04, 0.10), 30);
        setTimeout(() => this._pianoSoft(freq, 0.04, 0.10), 60);
        break;
      case 9: // 柔和钟声 — 长延音泛音
        this._piano(freq, 0.15, 2.5);
        setTimeout(() => this._piano(freq * 2, 0.08, 1.8), 120);
        break;
      case 10: // 钢片琴闪烁 — 高音明亮
        this._ping(freq * 2, 0.10, 0.22);
        setTimeout(() => this._ping(freq * 3, 0.06, 0.18), 70);
        break;
      case 11: // 爵士摇摆 — 附点节奏
        this._pianoSoft(freq, 0.06, 0.30);
        setTimeout(() => this._pianoSoft(freq * 1.33, 0.04, 0.18), 100);
        break;
      case 12: // 五声漫步 — 羽调上行
        this._pianoSoft(freq, 0.05, 0.22);
        setTimeout(() => this._pianoSoft(freq * 1.2, 0.04, 0.20), 55);
        setTimeout(() => this._pianoSoft(freq * 1.5, 0.05, 0.22), 110);
        break;
      case 13: // 蓝调弯音 — 微降半音
        const bend = freq * 0.94;
        this._pianoSoft(bend, 0.05, 0.25);
        setTimeout(() => this._pianoSoft(freq, 0.06, 0.25), 60);
        break;
      case 14: // 回声 — 同音延迟弱化
        this._pianoSoft(freq, 0.08, 0.28);
        setTimeout(() => this._pianoSoft(freq, 0.04, 0.20), 150);
        setTimeout(() => this._pianoSoft(freq, 0.02, 0.15), 280);
        break;
      case 15: // 马林巴 — 短促低频
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq * 0.5, t);
        g.gain.setValueAtTime(0.07, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
        osc.connect(g);
        g.connect(this.masterGain);
        osc.start(t);
        osc.stop(t + 0.3);
        break;
      case 16: // 竖琴刮奏 — 快速连音
        for (let i = 0; i < 4; i++) {
          setTimeout(() => this._pianoSoft(freq * Math.pow(1.12, i), 0.04, 0.12), i * 25);
        }
        break;
      case 17: // 华丽颤音 — 大三度颤音
        this._pianoSoft(freq, 0.06, 0.30);
        setTimeout(() => this._pianoSoft(freq * 1.26, 0.05, 0.28), 52);
        setTimeout(() => this._pianoSoft(freq, 0.06, 0.30), 104);
        break;
      case 18: // 风铃 — 高音渐散
        const chimes = [freq * 1.5, freq * 2, freq * 2.5, freq * 3];
        chimes.forEach((f, i) => {
          setTimeout(() => this._ping(f, 0.05 - i * 0.01, 0.3 + i * 0.1), i * 45);
        });
        break;
      case 19: // 爵士低音 — 低沉漫步
        this._piano(freq * 0.5, 0.18, 0.55);
        setTimeout(() => this._piano(freq * 0.67, 0.14, 0.45), 120);
        break;
    }
  },

  // ── 20 种合并音色（每次随机抽选）──
  merge(value) {
    if (!this.ctx || !this.enabled) return;
    const baseFreq = 220 + Math.log2(value) * 42;
    const velocity = Math.min(0.55, 0.1 + Math.log2(value) * 0.06);
    const duration = Math.min(1.8, 0.5 + Math.log2(value) * 0.12);
    const style = Math.floor(Math.random() * 20);

    const playNote = (f, v, d, delay) => {
      setTimeout(() => this._piano(f, v, d), delay);
    };

    switch (style) {
      case 0: // 双音齐鸣 — 纯五度
        playNote(baseFreq, velocity, duration, 0);
        playNote(baseFreq * 1.5, velocity * 0.7, duration * 0.8, 40);
        break;
      case 1: // 大三和弦齐奏
        playNote(baseFreq, velocity, duration, 0);
        playNote(baseFreq * 1.25, velocity * 0.65, duration * 0.85, 30);
        playNote(baseFreq * 1.5, velocity * 0.6, duration * 0.75, 60);
        break;
      case 2: // 滚奏琶音 — 从低到高
        playNote(baseFreq, velocity * 0.5, duration * 0.6, 0);
        playNote(baseFreq * 1.25, velocity * 0.6, duration * 0.7, 30);
        playNote(baseFreq * 1.5, velocity * 0.7, duration * 0.8, 60);
        playNote(baseFreq * 2, velocity * 0.6, duration * 0.9, 90);
        break;
      case 3: // 反琶音 — 从高到低
        playNote(baseFreq * 2, velocity * 0.6, duration * 0.7, 0);
        playNote(baseFreq * 1.5, velocity * 0.6, duration * 0.7, 35);
        playNote(baseFreq * 1.25, velocity * 0.55, duration * 0.7, 70);
        playNote(baseFreq, velocity * 0.65, duration, 105);
        break;
      case 4: // 四度和声 — 空灵
        playNote(baseFreq, velocity, duration, 0);
        playNote(baseFreq * 1.33, velocity * 0.65, duration * 0.8, 45);
        playNote(baseFreq * 1.75, velocity * 0.55, duration * 0.7, 90);
        break;
      case 5: // 八度大跳
        playNote(baseFreq, velocity * 0.7, duration * 0.6, 0);
        playNote(baseFreq * 2, velocity * 0.8, duration, 55);
        break;
      case 6: // 前倚音加强 — 装饰音后主音
        playNote(baseFreq * 0.8, velocity * 0.3, 0.15, 0);
        playNote(baseFreq, velocity * 0.85, duration, 40);
        playNote(baseFreq * 1.5, velocity * 0.5, duration * 0.7, 80);
        break;
      case 7: // 强力重击 — 短而响亮
        playNote(baseFreq, velocity * 1.2, duration * 0.5, 0);
        playNote(baseFreq * 1.5, velocity * 0.8, duration * 0.45, 25);
        break;
      case 8: // 钟声延音 — 长泛音
        playNote(baseFreq, velocity * 0.55, duration * 2, 0);
        setTimeout(() => playNote(baseFreq * 2, velocity * 0.35, duration * 1.5, 0), 150);
        break;
      case 9: // 颤音合奏 — 微细抖动
        playNote(baseFreq, velocity * 0.65, duration, 0);
        playNote(baseFreq * 1.02, velocity * 0.3, duration * 0.5, 50);
        playNote(baseFreq * 1.5, velocity * 0.55, duration * 0.9, 70);
        break;
      case 10: // 泛音列 — 自然泛音上行
        [1, 2, 3, 4, 5].forEach((mult, i) => {
          playNote(baseFreq * mult, velocity * (1 / mult) * 1.2, duration * (1 - i * 0.15), i * 40);
        });
        break;
      case 11: // 小七和弦 — 蓝调风味
        playNote(baseFreq, velocity * 0.65, duration, 0);
        playNote(baseFreq * 1.2, velocity * 0.5, duration * 0.85, 45);
        playNote(baseFreq * 1.5, velocity * 0.55, duration * 0.8, 85);
        playNote(baseFreq * 1.75, velocity * 0.4, duration * 0.7, 120);
        break;
      case 12: // 悬挂和弦 — 张力后释放
        playNote(baseFreq, velocity * 0.6, duration * 0.7, 0);
        playNote(baseFreq * 1.26, velocity * 0.55, duration * 0.8, 50);
        playNote(baseFreq * 1.5, velocity * 0.6, duration, 100);
        break;
      case 13: // 华尔兹 — 强弱弱
        playNote(baseFreq, velocity * 0.8, duration * 0.9, 0);
        playNote(baseFreq * 1.25, velocity * 0.4, duration * 0.5, 120);
        playNote(baseFreq * 1.5, velocity * 0.35, duration * 0.5, 220);
        break;
      case 14: // 探戈切分
        playNote(baseFreq, velocity * 0.5, duration * 0.4, 0);
        playNote(baseFreq * 1.5, velocity * 0.75, duration * 0.9, 70);
        playNote(baseFreq * 1.25, velocity * 0.4, duration * 0.5, 160);
        break;
      case 15: // 东方五声 — 宫商角徵羽
        const pentFreqs = [baseFreq, baseFreq * 1.125, baseFreq * 1.25, baseFreq * 1.5, baseFreq * 1.6875];
        pentFreqs.forEach((f, i) => {
          playNote(f, velocity * (0.4 + i * 0.12), duration * (0.5 + i * 0.1), i * 55);
        });
        break;
      case 16: // 大跳炫技
        playNote(baseFreq * 0.5, velocity * 0.5, duration * 0.5, 0);
        playNote(baseFreq * 2, velocity * 0.75, duration * 0.85, 60);
        playNote(baseFreq * 1.5, velocity * 0.55, duration * 0.7, 130);
        break;
      case 17: // 晶莹叮咚
        this._ping(baseFreq, velocity * 0.6, 0.12);
        setTimeout(() => this._ping(baseFreq * 1.5, velocity * 0.5, 0.10), 40);
        playNote(baseFreq, velocity * 0.55, duration * 0.8, 90);
        break;
      case 18: // 渐强滚奏 — 音量递增
        for (let i = 0; i < 6; i++) {
          playNote(baseFreq * [1, 1.12, 1.25, 1.33, 1.5, 2][i], velocity * (0.2 + i * 0.12), duration * 0.6, i * 28);
        }
        break;
      case 19: // 收束和弦 — 三音同时后延音
        playNote(baseFreq, velocity * 0.6, duration * 1.6, 0);
        playNote(baseFreq * 1.5, velocity * 0.5, duration * 1.4, 15);
        playNote(baseFreq * 2, velocity * 0.4, duration * 1.8, 30);
        break;
    }
  },

  // ── 20 种连锁风格（每次随机抽选）──
  _generatePhrase(totalNotes, startFreq) {
    const p = [1, 9/8, 5/4, 4/3, 3/2, 5/3, 16/9]; // 自然音阶比率
    const t = totalNotes;
    const f = startFreq;
    const style = Math.floor(Math.random() * 20);
    const notes = [];

    switch (style) {
      case 0: // 舒缓上行
        for (let i = 0; i < t; i++) {
          notes.push({ f: f * p[i % 7] * (1 + Math.floor(i / 7)), d: i * 100, v: 0.04 + i / t * 0.06 });
        } break;
      case 1: // 急流下行
        for (let i = 0; i < t; i++) {
          const idx = t - 1 - i;
          notes.push({ f: f * p[idx % 7] * (1 + Math.floor(idx / 7)), d: i * 65, v: 0.10 - i / t * 0.04 });
        } break;
      case 2: // 波浪起伏
        for (let i = 0; i < t; i++) {
          const wave = Math.sin(i * Math.PI / (t * 0.5)) * Math.min(t / 2, 8);
          const idx = Math.max(0, Math.round(wave));
          notes.push({ f: f * p[idx % 7] * (1 + Math.floor(idx / 7)), d: i * 60 + Math.random() * 20, v: 0.04 + Math.abs(Math.sin(i / t * Math.PI)) * 0.07 });
        } break;
      case 3: // 跳跃和弦 — 分解大跳
        for (let i = 0; i < t; i++) {
          const deg = [1, 5/4, 3/2, 2, 3, 1.5, 2.5, 4][i % 8];
          notes.push({ f: f * deg, d: i * 50, v: 0.05 + (i % 3 === 0 ? 0.05 : 0) });
        } break;
      case 4: // 五声漫步 — 随机上下
        for (let i = 0, s = 0; i < t; i++) {
          s = Math.max(0, s + Math.floor(Math.random() * 5) - 2);
          notes.push({ f: f * p[s % 7] * (1 + Math.floor(s / 7)), d: i * 65 + Math.random() * 30, v: 0.04 + Math.random() * 0.05 });
        } break;
      case 5: // 爵士摇摆
        for (let i = 0; i < t; i++) {
          notes.push({ f: f * p[i % 7] * (1 + Math.floor(i / 6)), d: Math.floor(i / 2) * 140 + (i % 2) * 35, v: i % 2 ? 0.05 : 0.09 });
        } break;
      case 6: // 古典琶音 — 三连音
        for (let i = 0; i < t; i++) {
          const oct = 1 + Math.floor(i / 3);
          notes.push({ f: f * [1, 1.25, 1.5][i % 3] * oct, d: i * 75, v: 0.06 + i / t * 0.04 });
        } break;
      case 7: // 蓝调弯音 — 半音偏移
        for (let i = 0; i < t; i++) {
          const bend = (Math.random() - 0.5) * 0.05;
          notes.push({ f: f * (p[i % 7] + bend) * (1 + Math.floor(i / 7)), d: i * 80, v: 0.04 + Math.random() * 0.06 });
        } break;
      case 8: // 东方五声 — 羽调式
        for (let i = 0; i < t; i++) {
          const order = [0, 2, 4, 1, 3, 5, 6];
          notes.push({ f: f * p[order[i % 7]] * (1 + Math.floor(i / 7)), d: i * 90, v: 0.05 + i / t * 0.05 });
        } break;
      case 9: // 华尔兹 — 强-弱-弱
        for (let i = 0; i < t; i++) {
          notes.push({ f: f * p[i % 7] * (1 + Math.floor(i / 7)), d: i * 95, v: i % 3 === 0 ? 0.10 : 0.03 });
        } break;
      case 10: // 探戈切分
        for (let i = 0; i < t; i++) {
          const synco = i % 4 === 2 ? 0.10 : (i % 4 === 0 ? 0.06 : 0.03);
          notes.push({ f: f * p[i % 7] * (1 + Math.floor(i / 7)), d: i * 55, v: synco });
        } break;
      case 11: // 急速冲刺
        for (let i = 0; i < t; i++) {
          notes.push({ f: f * p[i % 7] * (2 + Math.floor(i / 5)), d: i * Math.max(12, 70 - i * 2.5), v: 0.04 + i / t * 0.07 });
        } break;
      case 12: // 钟声齐鸣 — 泛音列
        for (let i = 0; i < t; i++) {
          const overtones = [1, 2, 3, 4, 5, 6, 8];
          notes.push({ f: f * overtones[i % 7], d: i * 115, v: 0.09 - i / t * 0.04 });
        } break;
      case 13: // 梦幻涟漪
        for (let i = 0; i < t; i++) {
          notes.push({ f: f * p[i % 7] * (1 + Math.floor(i / 7)), d: i * 38, v: 0.03 + 0.02 * Math.sin(i * 0.8) });
        } break;
      case 14: // 进行曲 — 坚定均匀
        for (let i = 0; i < t; i++) {
          notes.push({ f: f * p[i % 7] * (1 + Math.floor(i / 7)), d: i * 125, v: 0.08 });
        } break;
      case 15: // 自由散板
        for (let i = 0, acc = 0; i < t; i++) {
          const gap = 38 + Math.random() * 135;
          acc += gap;
          notes.push({ f: f * p[i % 7] * (1 + Math.floor(i / 7)), d: acc, v: 0.04 + Math.random() * 0.07 });
        } break;
      case 16: // 滚奏连音
        for (let i = 0; i < t; i++) {
          notes.push({ f: f * p[Math.floor(i / 3) % 7] * (1 + Math.floor(i / 12)), d: i * 20, v: 0.025 + (i % 3 === 0 ? 0.05 : 0) });
        } break;
      case 17: // 问答对位
        for (let i = 0; i < t; i++) {
          const oct = i % 2 === 0 ? 2 : 1;
          notes.push({ f: f * p[i % 7] * oct, d: i * 85, v: i % 2 === 0 ? 0.07 : 0.05 });
        } break;
      case 18: // 大跳炫技
        for (let i = 0; i < t; i++) {
          const leap = i % 3 === 0 ? 3 : (i % 3 === 1 ? 0.5 : 1);
          notes.push({ f: f * p[i % 7] * leap, d: i * 72, v: 0.05 + (i % 3 === 0 ? 0.05 : 0) });
        } break;
      case 19: // 先慢后快再慢收 — 华彩
        for (let i = 0; i < t; i++) {
          const pos = i / t;
          const spacing = pos < 0.2 ? 135 : (pos < 0.65 ? 55 : 95);
          notes.push({ f: f * p[i % 7] * (1 + Math.floor(i / 5)), d: i * spacing, v: pos < 0.2 ? 0.05 : (pos < 0.7 ? 0.10 : 0.04) });
        } break;
    }
    return notes;
  },

  cascade(count) {
    if (!this.ctx || !this.enabled) return;
    const totalNotes = Math.min(30, Math.max(2, count));
    const startFreq = this._pickFreq();
    const phrase = this._generatePhrase(totalNotes, startFreq);

    phrase.forEach(note => {
      setTimeout(() => this._pianoSoft(note.f, note.v, 0.28), note.d);
    });

    // 收尾和弦
    const lastDelay = phrase.length > 0 ? phrase[phrase.length - 1].d : 0;
    setTimeout(() => {
      this._piano(startFreq, 0.18, 2.0);
      setTimeout(() => this._piano(startFreq * 1.5, 0.14, 1.6), 100);
      setTimeout(() => this._piano(startFreq * 2, 0.10, 1.8), 200);
    }, lastDelay + 150);
  },

  // ── 新游戏开场 ──
  newGame() {
    if (!this.ctx || !this.enabled) return;
    const ctx = this.ctx;
    const t = ctx.currentTime;
    const melody = [262, 330, 392, 523, 659, 523, 392, 330];
    melody.forEach((freq, i) => {
      setTimeout(() => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        g.gain.setValueAtTime(0.08, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);
        osc.connect(g);
        g.connect(this.masterGain);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.5);
      }, i * 80);
    });
  },

  // ── 胜利（20种随机）──
  win() {
    if (!this.ctx || !this.enabled) return;
    const r = Math.random();
    let melody;
    if (r < 0.15) {
      melody = [262, 330, 392, 523, 659, 784, 1047, 1319];
    } else if (r < 0.30) {
      melody = [392, 523, 659, 784, 1047, 1319, 1568, 2093];
    } else if (r < 0.45) {
      melody = [196, 262, 330, 392, 523, 659, 784, 523, 392];
    } else if (r < 0.60) {
      melody = [262, 392, 523, 330, 659, 392, 784, 523, 1047];
    } else if (r < 0.72) {
      // 琶音上行
      melody = [262, 330, 392, 523, 659, 784, 880, 1047, 1319, 1568];
    } else if (r < 0.83) {
      // 凯旋进行曲
      melody = [523, 523, 523, 659, 784, 784, 659, 784, 1047, 784];
    } else if (r < 0.92) {
      // 舒缓颂歌
      melody = [262, 330, 262, 392, 330, 523, 392, 659, 523, 784, 1047];
    } else {
      // 华丽终曲
      melody = [262, 392, 330, 523, 392, 659, 523, 784, 659, 1047, 784, 1319, 1047, 1568];
    }
    melody.forEach((freq, i) => {
      const vel = 0.5 + (i / melody.length) * 0.35;
      setTimeout(() => this._piano(freq, vel, 1.3), i * 80 + Math.random() * 15);
    });
  },

  // ── 失败（20种随机）──
  lose() {
    if (!this.ctx || !this.enabled) return;
    const r = Math.random();
    let notes;
    if (r < 0.25) {
      notes = [[440, 0, 0.28, 0.8], [349, 140, 0.26, 0.7], [277, 280, 0.24, 0.8], [220, 430, 0.22, 1.1]];
    } else if (r < 0.45) {
      notes = [[523, 0, 0.26, 0.6], [392, 130, 0.25, 0.65], [294, 270, 0.24, 0.75], [196, 420, 0.22, 1.2]];
    } else if (r < 0.63) {
      notes = [[659, 0, 0.25, 0.5], [440, 120, 0.24, 0.6], [330, 250, 0.23, 0.7], [165, 400, 0.20, 1.4]];
    } else if (r < 0.78) {
      notes = [[330, 0, 0.24, 0.7], [294, 120, 0.22, 0.65], [262, 240, 0.20, 0.75], [220, 370, 0.18, 1.0], [175, 500, 0.15, 1.3]];
    } else if (r < 0.90) {
      notes = [[392, 0, 0.30, 0.55], [311, 100, 0.27, 0.6], [262, 200, 0.23, 0.7], [208, 320, 0.20, 0.9], [156, 440, 0.16, 1.2]];
    } else {
      // 半音阶下行
      notes = [[466, 0, 0.22, 0.45], [440, 90, 0.21, 0.5], [415, 180, 0.20, 0.55], [392, 270, 0.19, 0.6], [370, 360, 0.17, 0.7], [349, 450, 0.15, 0.85]];
    }
    notes.forEach(([freq, delay, vel, dur]) => {
      setTimeout(() => this._piano(freq, vel, dur), delay);
    });
  },

  // ── 无效操作（20种随机趣味音）──
  invalid() {
    if (!this.ctx || !this.enabled) return;
    const style = Math.floor(Math.random() * 20);
    const ctx = this.ctx;
    const t = ctx.currentTime;

    switch (style) {
      case 0: case 1: case 2: // 低沉短音
        [110, 100, 90][style].forEach(f => {
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(f, t);
          g.gain.setValueAtTime(0.07, t);
          g.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
          osc.connect(g);
          g.connect(this.masterGain);
          osc.start(t);
          osc.stop(t + 0.15);
        });
        break;
      case 3: case 4: // 木头敲击声 — 短促噪音
        const bufSize = ctx.sampleRate * 0.08;
        const buffer = ctx.createBuffer(1, bufSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufSize; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufSize, 3);
        const src = ctx.createBufferSource();
        src.buffer = buffer;
        const gf = ctx.createBiquadFilter();
        gf.type = 'bandpass';
        gf.frequency.setValueAtTime(style === 3 ? 400 : 600, t);
        gf.Q.setValueAtTime(2, t);
        const gn = ctx.createGain();
        gn.gain.setValueAtTime(0.08, t);
        gn.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
        src.connect(gf); gf.connect(gn); gn.connect(this.masterGain);
        src.start(t); src.stop(t + 0.1);
        break;
      case 5: case 6: // 下滑音
        const osc1 = ctx.createOscillator();
        const g1 = ctx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(style === 5 ? 200 : 150, t);
        osc1.frequency.exponentialRampToValueAtTime(80, t + 0.15);
        g1.gain.setValueAtTime(0.06, t);
        g1.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
        osc1.connect(g1); g1.connect(this.masterGain);
        osc1.start(t); osc1.stop(t + 0.2);
        break;
      case 7: case 8: // 双音不和谐
        this._pianoSoft(style === 7 ? 180 : 160, 0.06, 0.15);
        setTimeout(() => this._pianoSoft(style === 7 ? 175 : 158, 0.05, 0.15), 40);
        break;
      case 9: case 10: // 极轻气声
        this._pianoSoft(style === 9 ? 130 : 120, 0.03, 0.22);
        break;
      case 11: case 12: // 拨弦弹跳
        this._ping(style === 11 ? 200 : 180, 0.05, 0.06);
        break;
      case 13: case 14: // 低音大提琴拨弦
        this._piano(style === 13 ? 82 : 73, 0.12, 0.3);
        break;
      case 15: case 16: case 17: case 18: case 19: // 随机趣味音
        const quirkFreqs = [95, 105, 115, 85, 75];
        this._pianoSoft(quirkFreqs[style - 15], 0.04, 0.18);
        break;
    }
  }
};
