/**
 * 音效模块（自 snake.html 抽出）
 * Web Audio API，无外部音频文件
 * 用法：<script src="sound-snake.js"></script>
 */
// ——— 音效（Web Audio，无外部资源）———
var Sound = {
    enabled: localStorage.getItem('snakeSound') !== '0',
    ctx: null,
    master: null,
    init() {
        if (this.ctx) {
            if (this.ctx.state === 'suspended') this.ctx.resume().catch(() => {});
            return;
        }
        try {
            const AC = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AC();
            this.master = this.ctx.createGain();
            this.master.gain.value = this.enabled ? 0.9 : 0;
            this.master.connect(this.ctx.destination);
        } catch (e) {}
    },
    unlock() {
        this.init();
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume().catch(() => {});
        }
    },
    toggle() {
        this.enabled = !this.enabled;
        localStorage.setItem('snakeSound', this.enabled ? '1' : '0');
        this.init();
        if (this.master) this.master.gain.value = this.enabled ? 0.9 : 0;
        if (this.enabled) this.blip(660, 0.06, 0.08);
        return this.enabled;
    },
    _beep(freq, dur, type, vol, slideTo) {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx || !this.master) return;
        const ctx = this.ctx;
        const t = ctx.currentTime;
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = type || 'sine';
        o.frequency.setValueAtTime(freq, t);
        if (slideTo) o.frequency.exponentialRampToValueAtTime(Math.max(40, slideTo), t + dur);
        const v = Math.max(0.001, vol || 0.08);
        g.gain.setValueAtTime(v, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + dur);
        o.connect(g);
        g.connect(this.master);
        o.start(t);
        o.stop(t + dur + 0.02);
    },
    blip(freq, dur, vol) { this._beep(freq, dur || 0.06, 'sine', vol || 0.08); },
    eat(len) {
        // 吃到食物：短促上行，随身长略升调
        const base = 420 + Math.min(280, (len || 3) * 6);
        this._beep(base, 0.07, 'square', 0.07);
        setTimeout(() => this._beep(base * 1.35, 0.09, 'sine', 0.08), 40);
    },
    levelUp() {
        [523, 659, 784].forEach((f, i) => {
            setTimeout(() => this._beep(f, 0.1, 'sine', 0.09), i * 70);
        });
    },
    start() {
        [392, 523, 659].forEach((f, i) => {
            setTimeout(() => this._beep(f, 0.08, 'sine', 0.08), i * 55);
        });
    },
    pause() { this._beep(360, 0.08, 'triangle', 0.06); },
    resume() { this._beep(520, 0.08, 'triangle', 0.06); },
    hurt() {
        this._beep(220, 0.12, 'square', 0.07, 100);
        setTimeout(() => this._beep(180, 0.1, 'triangle', 0.06), 80);
    },
    die() {
        this._beep(280, 0.18, 'sawtooth', 0.07, 80);
        setTimeout(() => this._beep(160, 0.22, 'triangle', 0.08, 60), 90);
    },
    record() {
        [523, 659, 784, 1046].forEach((f, i) => {
            setTimeout(() => this._beep(f, 0.1, 'sine', 0.09), i * 80);
        });
    },
    win() {
        [523, 659, 784, 1046, 784, 1046].forEach((f, i) => {
            setTimeout(() => this._beep(f, 0.12, 'sine', 0.09), i * 90);
        });
    },
    // 通关仪式：更长的上行琶音
    ceremony() {
        const notes = [392, 523, 659, 784, 988, 1046, 1175, 1319];
        notes.forEach((f, i) => {
            setTimeout(() => this._beep(f, 0.16, 'sine', 0.1), i * 100);
        });
        setTimeout(() => {
            [784, 988, 1175, 1568].forEach((f, i) => {
                setTimeout(() => this._beep(f, 0.22, 'triangle', 0.08), i * 80);
            });
        }, 850);
    }
};
