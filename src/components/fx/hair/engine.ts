/**
 * Haar als Material: einzelne Strähnen als Feder-Ketten (Verlet-Integration mit Längen-Bedingungen),
 * gezeichnet als feine, additive Goldlinien in WebGL2 (ein Draw-Call). Zwei Ordnungen:
 *   0 = Vorhang (Haar fällt von oben), 1 = Phönix (Flügel, Schweif, Kopf aus Haar).
 * `morph` blendet weich zwischen beiden. Zeiger und Scroll wirken als Wind.
 * Keine Abhängigkeiten; ~6 000 Knoten auf dem Desktop, ~2 500 auf dem Handy.
 */
export type HairOptions = { strands: number; segments: number; dprMax: number };

type Layout = { rx: number; ry: number; a: number; len: number; curl: number };

const VERT = `#version 300 es
precision highp float;
layout(location=0) in vec2 aPos;
layout(location=1) in vec2 aMeta; // t entlang der Strähne (0 Ansatz … 1 Spitze), Farbton-Zufall
uniform vec2 uRes;
uniform float uGlow;
out vec3 vCol;
out float vA;
void main() {
  vec2 p = aPos / uRes * 2.0 - 1.0;
  gl_Position = vec4(p.x, -p.y, 0.0, 1.0);
  float t = aMeta.x;
  vec3 root = mix(vec3(0.42, 0.2, 0.07), vec3(0.62, 0.3, 0.1), aMeta.y);
  vec3 mid = mix(vec3(0.88, 0.62, 0.2), vec3(0.95, 0.72, 0.32), aMeta.y);
  vec3 tip = vec3(1.0, 0.9, 0.7);
  vCol = t < 0.55 ? mix(root, mid, t / 0.55) : mix(mid, tip, (t - 0.55) / 0.45);
  vA = (0.22 + 0.5 * smoothstep(0.0, 0.25, t)) * (1.0 - smoothstep(0.82, 1.0, t)) * uGlow;
}`;

const FRAG = `#version 300 es
precision mediump float;
in vec3 vCol;
in float vA;
out vec4 o;
void main() { o = vec4(vCol * vA, vA); }`;

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
  const s = gl.createShader(type);
  if (!s) throw new Error("hair: shader");
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) || "hair: compile");
  return s;
}

/** Kleiner, deterministischer Zufall (gleiche Frisur bei jedem Laden). */
function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

export class HairField {
  private gl: WebGL2RenderingContext;
  private buf: WebGLBuffer;
  private uRes: WebGLUniformLocation | null;
  private uGlow: WebGLUniformLocation | null;
  private n: number;
  private s: number;
  private pos: Float32Array; // x,y je Knoten
  private prev: Float32Array;
  private verts: Float32Array; // je Liniensegment 2 Punkte × (x, y, t, hue)
  private hue: Float32Array;
  private curtain: Layout[] = [];
  private wings: Layout[] = [];
  private w = 1;
  private h = 1;
  private dpr = 1;
  private center = { x: 0.62, y: 0.42, scale: 1 };
  private morph = 0;
  private morphFrom = 0;
  private morphTo = 0;
  private morphStart = 0;
  private morphDur = 2600;
  private time = 0;
  private raf = 0;
  private running = false;
  private last = 0;
  private pointer = { x: -1e4, y: -1e4, vx: 0, vy: 0, on: false };
  private gust = 0;
  private glow = 1;
  /** Mittlere Bildzeit (ms) für die automatische Drosselung. */
  frameMs = 16;
  onSlow: (() => void) | null = null;
  private slowFrames = 0;

  constructor(
    private canvas: HTMLCanvasElement,
    opts: HairOptions,
  ) {
    const gl = canvas.getContext("webgl2", { alpha: true, antialias: true, depth: false, premultipliedAlpha: true });
    if (!gl) throw new Error("hair: webgl2");
    this.gl = gl;
    this.n = opts.strands;
    this.s = opts.segments;
    this.dpr = Math.min(window.devicePixelRatio || 1, opts.dprMax);
    const prog = gl.createProgram();
    if (!prog) throw new Error("hair: program");
    gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog) || "hair: link");
    gl.useProgram(prog);
    this.uRes = gl.getUniformLocation(prog, "uRes");
    this.uGlow = gl.getUniformLocation(prog, "uGlow");
    const nodes = this.n * (this.s + 1);
    this.pos = new Float32Array(nodes * 2);
    this.prev = new Float32Array(nodes * 2);
    this.verts = new Float32Array(this.n * this.s * 2 * 4);
    this.hue = new Float32Array(this.n);
    const r = rng(19);
    for (let k = 0; k < this.n; k++) this.hue[k] = r();
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    const buf = gl.createBuffer();
    if (!buf) throw new Error("hair: buffer");
    this.buf = buf;
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, this.verts.byteLength, gl.DYNAMIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 16, 0);
    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 16, 8);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE);
    gl.clearColor(0, 0, 0, 0);
    this.resize();
    this.reset(0);
  }

  /** Mittelpunkt des Phönix relativ zur Fläche (0…1) und Größe. */
  setCenter(x: number, y: number, scale: number) {
    this.center = { scale, x, y };
    this.build();
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    this.w = Math.max(1, rect.width);
    this.h = Math.max(1, rect.height);
    this.canvas.width = Math.round(this.w * this.dpr);
    this.canvas.height = Math.round(this.h * this.dpr);
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    this.build();
  }

  /** Legt beide Ordnungen fest (in CSS-Pixeln der Fläche). */
  private build() {
    const { w, h } = this;
    const r = rng(7);
    const unit = Math.min(w, h * 1.25) * this.center.scale;
    const cx = w * this.center.x;
    const cy = h * this.center.y;
    const n = this.n;
    // Flügel je 36 % (Federn hängen an einem gebogenen Flügelarm), Schweif 18 %, Körper und Hals 10 %
    const wingN = Math.round(n * 0.36);
    const tailN = Math.round(n * 0.18);
    const wings: Layout[] = [];
    const bez = (p0: number, p1: number, p2: number, t: number) => (1 - t) * (1 - t) * p0 + 2 * (1 - t) * t * p1 + t * t * p2;
    for (const side of [-1, 1]) {
      for (let i = 0; i < wingN; i++) {
        const u = (i + r() * 0.6) / wingN;
        // Flügelarm: Schulter → Ellbogen → Spitze (hoch erhoben)
        const rx = cx + side * unit * bez(0.03, 0.2, 0.47, u);
        const ry = cy - unit * bez(0.02, 0.36, 0.4, u);
        // Federn zeigen nach unten-außen; an der Spitze flacher (Handschwingen)
        const deg = -98 + u * 78 + (r() - 0.5) * 10;
        const ang = (deg * Math.PI) / 180;
        const a = side > 0 ? ang : Math.PI - ang;
        const prim = Math.sin(Math.PI * Math.min(1, u * 1.15));
        wings.push({ a, curl: side * (0.25 + u * 0.35) * (r() * 0.5 + 0.75), len: unit * (0.14 + 0.3 * prim) * (0.85 + r() * 0.3), rx, ry });
      }
    }
    for (let i = 0; i < tailN; i++) {
      const u = i / Math.max(1, tailN - 1) - 0.5;
      // Schweif wie eine Flamme: lang, nach unten, an den Enden eingerollt
      wings.push({ a: -Math.PI / 2 + u * 0.55, curl: u * 2.4 + (r() - 0.5) * 0.5, len: unit * (0.34 + (0.5 - Math.abs(u)) * 0.36 + r() * 0.08), rx: cx + u * unit * 0.05, ry: cy + unit * 0.04 });
    }
    const bodyN = n - wings.length;
    for (let i = 0; i < bodyN; i++) {
      const u = i / Math.max(1, bodyN - 1);
      if (u < 0.45) {
        // Hals und Kopf: nach oben, zur Seite gebogen
        wings.push({ a: Math.PI / 2 + 0.15 + (r() - 0.5) * 0.25, curl: 1.1 + r() * 0.4, len: unit * (0.12 + r() * 0.05), rx: cx + (r() - 0.5) * unit * 0.02, ry: cy - unit * 0.02 });
      } else {
        // Körper: kurze, dichte Strähnen
        wings.push({ a: -Math.PI / 2 + (r() - 0.5) * 1.6, curl: (r() - 0.5) * 0.8, len: unit * (0.05 + r() * 0.06), rx: cx + (r() - 0.5) * unit * 0.05, ry: cy + (r() - 0.5) * unit * 0.05 });
      }
    }
    wings.length = n;
    // Zuordnung: Strähnen von links nach rechts im Vorhang ↔ links nach rechts im Phönix
    const order = wings.map((l, i) => ({ i, x: l.rx + Math.cos(l.a) * l.len * 0.6 })).sort((p, q) => p.x - q.x);
    this.wings = order.map((o) => wings[o.i]);
    const curtain: Layout[] = [];
    for (let k = 0; k < n; k++) {
      const u = (k + 0.5) / n;
      curtain.push({ a: -Math.PI / 2 + (r() - 0.5) * 0.06, curl: (r() - 0.5) * 0.5, len: h * (0.42 + r() * 0.36), rx: w * (0.04 + u * 0.92) + (r() - 0.5) * 8, ry: -6 - r() * 20 });
    }
    this.curtain = curtain;
  }

  /** Startzustand ohne Einschwingen (z. B. sofort als Phönix für die statische Fassung). */
  reset(m: number) {
    this.morph = this.morphFrom = this.morphTo = m;
    for (let k = 0; k < this.n; k++) {
      const L = this.lerpLayout(k, m);
      const seg = L.len / this.s;
      let x = L.rx;
      let y = L.ry;
      for (let i = 0; i <= this.s; i++) {
        const j = (k * (this.s + 1) + i) * 2;
        this.pos[j] = this.prev[j] = x;
        this.pos[j + 1] = this.prev[j + 1] = y;
        const ang = L.a + L.curl * (i / this.s);
        x += Math.cos(ang) * seg;
        y -= Math.sin(ang) * seg;
      }
    }
  }

  private lerpLayout(k: number, m: number): Layout {
    const c = this.curtain[k];
    const g = this.wings[k];
    const e = ease(Math.min(1, Math.max(0, m)));
    // kürzester Winkelweg
    let da = g.a - c.a;
    while (da > Math.PI) da -= Math.PI * 2;
    while (da < -Math.PI) da += Math.PI * 2;
    return { a: c.a + da * e, curl: c.curl + (g.curl - c.curl) * e, len: c.len + (g.len - c.len) * e, rx: c.rx + (g.rx - c.rx) * e, ry: c.ry + (g.ry - c.ry) * e };
  }

  /** 0 = Vorhang, 1 = Phönix; weich über `dur` ms. */
  setMorph(to: number, dur = 2600) {
    if (to === this.morphTo) return;
    this.morphFrom = this.morph;
    this.morphTo = to;
    this.morphStart = this.time;
    this.morphDur = dur;
  }

  setPointer(x: number, y: number, on: boolean) {
    if (on && this.pointer.on) {
      this.pointer.vx = x - this.pointer.x;
      this.pointer.vy = y - this.pointer.y;
    } else {
      this.pointer.vx = this.pointer.vy = 0;
    }
    this.pointer.x = x;
    this.pointer.y = y;
    this.pointer.on = on;
  }

  /** Scroll-Geschwindigkeit in px/Bild als kurzer Windstoß. */
  setGust(v: number) {
    this.gust = Math.max(-40, Math.min(40, v));
  }

  setGlow(g: number) {
    this.glow = g;
  }

  /** Ein Simulationsschritt (dt in ms, gekappt). */
  step(dt: number) {
    this.time += dt;
    const p = Math.min(1, (this.time - this.morphStart) / this.morphDur);
    this.morph = this.morphFrom + (this.morphTo - this.morphFrom) * p;
    const m = this.morph;
    const f = Math.min(dt, 34) / 16.67;
    const stiff = 0.018 + 0.09 * ease(m);
    const gravity = 0.18 * (1 - m * 0.85);
    const damp = 0.955;
    const t = this.time * 0.001;
    const px = this.pointer.x;
    const py = this.pointer.y;
    const pr = Math.min(this.w, this.h) * 0.16;
    const pvx = this.pointer.vx * 0.22;
    const pvy = this.pointer.vy * 0.22;
    const gust = this.gust * 0.05;
    this.gust *= 0.9;
    this.pointer.vx *= 0.8;
    this.pointer.vy *= 0.8;
    const S = this.s;
    for (let k = 0; k < this.n; k++) {
      const L = this.lerpLayout(k, m);
      const seg = L.len / S;
      const base = k * (S + 1) * 2;
      // Ansatz sitzt fest
      this.pos[base] = this.prev[base] = L.rx;
      this.pos[base + 1] = this.prev[base + 1] = L.ry;
      let tx = L.rx;
      let ty = L.ry;
      const sway = Math.sin(t * 0.9 + k * 0.37) * 0.35 + Math.sin(t * 0.43 + k * 0.11) * 0.25;
      for (let i = 1; i <= S; i++) {
        const j = base + i * 2;
        const ang = L.a + L.curl * (i / S) + sway * 0.06 * (i / S);
        tx += Math.cos(ang) * seg;
        ty -= Math.sin(ang) * seg;
        const x = this.pos[j];
        const y = this.pos[j + 1];
        let vx = (x - this.prev[j]) * damp;
        let vy = (y - this.prev[j + 1]) * damp;
        const tt = i / S;
        vx += (tx - x) * stiff * f + sway * 0.04 * tt * f + gust * tt * 0.3;
        vy += (ty - y) * stiff * f + gravity * f + gust * tt;
        const dx = x - px;
        const dy = y - py;
        const d2 = dx * dx + dy * dy;
        if (d2 < pr * pr) {
          const fall = 1 - Math.sqrt(d2) / pr;
          vx += (pvx + (dx / (Math.sqrt(d2) + 1)) * 1.2) * fall * tt;
          vy += (pvy + (dy / (Math.sqrt(d2) + 1)) * 1.2) * fall * tt;
        }
        this.prev[j] = x;
        this.prev[j + 1] = y;
        this.pos[j] = x + vx;
        this.pos[j + 1] = y + vy;
      }
      // Längen-Bedingungen (zwei Durchläufe, Ansatz fest)
      for (let it = 0; it < 2; it++) {
        for (let i = 1; i <= S; i++) {
          const a = base + (i - 1) * 2;
          const b = base + i * 2;
          const dx = this.pos[b] - this.pos[a];
          const dy = this.pos[b + 1] - this.pos[a + 1];
          const d = Math.sqrt(dx * dx + dy * dy) || 1;
          const diff = (d - seg) / d;
          if (i === 1) {
            this.pos[b] -= dx * diff;
            this.pos[b + 1] -= dy * diff;
          } else {
            this.pos[a] += dx * diff * 0.5;
            this.pos[a + 1] += dy * diff * 0.5;
            this.pos[b] -= dx * diff * 0.5;
            this.pos[b + 1] -= dy * diff * 0.5;
          }
        }
      }
    }
  }

  draw() {
    const gl = this.gl;
    const S = this.s;
    let o = 0;
    for (let k = 0; k < this.n; k++) {
      const base = k * (S + 1) * 2;
      const hue = this.hue[k];
      for (let i = 0; i < S; i++) {
        const a = base + i * 2;
        this.verts[o++] = this.pos[a];
        this.verts[o++] = this.pos[a + 1];
        this.verts[o++] = i / S;
        this.verts[o++] = hue;
        this.verts[o++] = this.pos[a + 2];
        this.verts[o++] = this.pos[a + 3];
        this.verts[o++] = (i + 1) / S;
        this.verts[o++] = hue;
      }
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buf);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.verts);
    gl.uniform2f(this.uRes, this.w, this.h);
    gl.uniform1f(this.uGlow, this.glow);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.LINES, 0, this.n * S * 2);
  }

  /** Statische Fassung: Phönix einschwingen lassen und ein einziges Bild zeichnen. */
  still() {
    this.stop();
    this.reset(1);
    for (let i = 0; i < 90; i++) this.step(16.67);
    this.draw();
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.last = performance.now();
    const loop = (now: number) => {
      if (!this.running) return;
      const dt = now - this.last;
      this.last = now;
      this.frameMs = this.frameMs * 0.94 + dt * 0.06;
      if (this.frameMs > 26) {
        if (++this.slowFrames > 90) {
          this.slowFrames = 0;
          this.onSlow?.();
        }
      } else this.slowFrames = 0;
      this.step(dt);
      this.draw();
      this.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }

  destroy() {
    this.stop();
    this.gl.getExtension("WEBGL_lose_context")?.loseContext();
  }
}
