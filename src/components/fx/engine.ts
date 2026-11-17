import { buildShape, type ShapeName } from "./shapes";

/**
 * Goldfeld: tausende feine Licht- und Glutteilchen in reinem WebGL2, ein Draw-Call.
 *
 * - Jedes Teilchen hat einen Ausgangs- und einen Zielpunkt (aFrom/aTo) und wandert zeitbasiert
 *   mit eigenem Versatz und leichtem Bogen dorthin: Formen fließen ineinander statt zu springen.
 * - Ein Teil der Teilchen bleibt immer frei (Glut, die im Atelierlicht aufsteigt); mit `loose`
 *   lösen sich auch die Formteilchen und steigen mit auf (Hero-Anfang).
 * - Licht: additive Mischung, weicher Kern, Tiefenunschärfe (fern = größer, weicher, blasser),
 *   zartes Funkeln. Farben von Champagner über Phönix-Gold bis Kupferglut (`heat`).
 * - Zeiger/Touch: sanfte Verdrängung mit Wirbel, klingt von selbst ab.
 */

export type SceneTarget = {
  shape: ShapeName;
  /** Mitte in NDC (-1..1) */
  x: number;
  y: number;
  /** Größe relativ zur kürzeren Bildschirmkante (1 = halbe kurze Kante als Radius) */
  s: number;
  alpha: number;
  loose: number;
  heat: number;
};

const MORPH_S = 2.1;
const VERT = `#version 300 es
precision highp float;
layout(location=0) in vec4 aFrom;
layout(location=1) in vec4 aTo;
layout(location=2) in vec4 aSeed;
uniform float uT;
uniform float uP;
uniform float uLoose;
uniform float uHeat;
uniform float uAlpha;
uniform float uPx;
uniform vec2 uUnit;
uniform vec2 uAspect;
uniform vec3 uPointer;
uniform float uAmbient;
uniform float uScroll;
out vec3 vColor;
out float vA;
out float vSoft;
const vec3 CHAMP = vec3(0.965, 0.890, 0.706);
const vec3 GOLD = vec3(0.910, 0.682, 0.137);
const vec3 DEEP = vec3(0.725, 0.522, 0.102);
const vec3 EMBER = vec3(0.880, 0.400, 0.140);
float ease(float x) { return x < 0.5 ? 4.0 * x * x * x : 1.0 - pow(-2.0 * x + 2.0, 3.0) * 0.5; }
void main() {
  float st = 0.6;
  float p = clamp(uP * (1.0 + st) - aSeed.z * st, 0.0, 1.0);
  float e = ease(p);
  vec3 pos = mix(aFrom.xyz, aTo.xyz, e);
  vec2 dir = aTo.xy - aFrom.xy;
  pos.xy += vec2(-dir.y, dir.x) * sin(e * 3.14159) * (aSeed.x - 0.5) * 0.7;
  float w = mix(aFrom.w, aTo.w, step(0.5, e));
  if (w >= 1.0) {
    float t = w - 1.0;
    float sway = sin(uT * 0.7 + t * 4.2 + aSeed.y * 1.3) * 0.04 * t + sin(uT * 0.29 + aSeed.x * 6.28) * 0.012 * t;
    pos.x += sway * uUnit.x;
    pos.y += cos(uT * 0.52 + t * 3.1) * 0.01 * t * uUnit.y;
  }
  pos.xy += vec2(sin(uT * 0.41 + aSeed.y * 21.0), cos(uT * 0.37 + aSeed.x * 19.0)) * 0.0028;
  float speed = 0.012 + aSeed.w * 0.028;
  float rise = fract(aSeed.y + uT * speed + uScroll * (0.00004 + aSeed.z * 0.0001));
  vec3 freeP = vec3((aSeed.x * 2.0 - 1.0) * 1.08 + sin(uT * 0.3 + aSeed.z * 12.0 + rise * 6.0) * 0.07, rise * 2.4 - 1.2, aSeed.z * 2.0 - 1.0);
  float amb = step(aSeed.w, uAmbient);
  float loose = max(amb, clamp(uLoose * (0.75 + aSeed.x * 0.5), 0.0, 1.0));
  pos = mix(pos, freeP, loose);
  vec2 d = (pos.xy - uPointer.xy) * uAspect;
  float f = exp(-dot(d, d) / 0.028) * uPointer.z;
  vec2 n = normalize(d + vec2(1e-5));
  pos.xy += (n * 0.07 + vec2(-n.y, n.x) * 0.05) * f / uAspect;
  float persp = 1.0 / (1.0 + pos.z * 0.14);
  gl_Position = vec4(pos.xy * persp, 0.0, 1.0);
  float blur = clamp(abs(pos.z) - 0.25, 0.0, 1.2);
  float size = uPx * (0.6 + aSeed.y * 1.15) * (1.0 + blur * 2.2) * persp;
  gl_PointSize = min(size, 40.0);
  float tw = 0.62 + 0.38 * sin(uT * (0.7 + aSeed.x * 2.4) + aSeed.y * 40.0);
  float spark = pow(max(0.0, sin(uT * (0.35 + aSeed.z * 0.9) + aSeed.w * 50.0)), 30.0) * 1.6;
  vec3 c = mix(GOLD, CHAMP, smoothstep(0.5, 1.0, aSeed.y));
  c = mix(c, DEEP, step(aSeed.x, 0.2));
  float heat = clamp(max(uHeat, amb * 0.55) * (0.4 + aSeed.z), 0.0, 1.0);
  c = mix(c, EMBER, heat * 0.85);
  float fade = mix(1.0, smoothstep(0.0, 0.12, rise) * smoothstep(1.0, 0.7, rise), loose);
  vColor = c;
  vSoft = clamp(blur, 0.0, 1.0);
  vA = uAlpha * (tw + spark) * fade * mix(1.0, 0.5, amb) / (1.0 + blur * 2.6);
}`;

const FRAG = `#version 300 es
precision mediump float;
in vec3 vColor;
in float vA;
in float vSoft;
out vec4 o;
void main() {
  vec2 c = gl_PointCoord * 2.0 - 1.0;
  float r2 = dot(c, c);
  if (r2 > 1.0) discard;
  float core = exp(-r2 * mix(10.0, 2.6, vSoft)) * (1.0 - r2 * 0.3);
  vec3 col = vColor * core * vA;
  o = vec4(col, max(col.r, max(col.g, col.b)));
}`;

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
  const s = gl.createShader(type);
  if (!s) throw new Error("shader");
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) ?? "shader");
  return s;
}

const easeCPU = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

export type EngineOptions = { count: number; dprMax: number; ambient: number };

export class GoldField {
  private gl: WebGL2RenderingContext;
  private prog: WebGLProgram;
  private fromBuf: WebGLBuffer;
  private toBuf: WebGLBuffer;
  private from: Float32Array;
  private to: Float32Array;
  private seeds: Float32Array;
  private raw = new Map<ShapeName, Float32Array>();
  private samples: Float32Array | null = null;
  private u: Record<string, WebGLUniformLocation | null> = {};
  private n: number;
  private target: SceneTarget | null = null;
  private morphStart = -10;
  private now = 0;
  private raf = 0;
  private running = false;
  private w = 1;
  private h = 1;
  private dpr = 1;
  private cur = { alpha: 0, loose: 1, heat: 1, unit: 1 };
  private pointer = { x: 0, y: 0, s: 0, goal: 0 };
  private scroll = 0;
  private last = 0;
  /** Gezählte Bilder (für Messungen von außen). */
  frames = 0;

  constructor(
    private canvas: HTMLCanvasElement,
    private opts: EngineOptions,
  ) {
    const gl = canvas.getContext("webgl2", { alpha: true, antialias: false, depth: false, premultipliedAlpha: true, powerPreference: "high-performance" });
    if (!gl) throw new Error("webgl2");
    this.gl = gl;
    this.n = opts.count;
    const prog = gl.createProgram();
    if (!prog) throw new Error("program");
    gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog) ?? "link");
    this.prog = prog;
    for (const name of ["uT", "uP", "uLoose", "uHeat", "uAlpha", "uPx", "uUnit", "uAspect", "uPointer", "uAmbient", "uScroll"]) {
      this.u[name] = gl.getUniformLocation(prog, name);
    }
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    this.seeds = new Float32Array(this.n * 4);
    for (let i = 0; i < this.seeds.length; i++) this.seeds[i] = Math.random();
    this.from = new Float32Array(this.n * 4);
    this.to = new Float32Array(this.n * 4);
    // Start: alle Teilchen als Glut unten in der Mitte
    const start = this.layout(this.rawShape("embers"), { alpha: 0, heat: 1, loose: 1, s: 1, shape: "embers", x: 0, y: -0.2 });
    this.from.set(start);
    this.to.set(start);
    const mk = (loc: number, data: Float32Array, usage: number) => {
      const b = gl.createBuffer();
      if (!b) throw new Error("buffer");
      gl.bindBuffer(gl.ARRAY_BUFFER, b);
      gl.bufferData(gl.ARRAY_BUFFER, data, usage);
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 4, gl.FLOAT, false, 0, 0);
      return b;
    };
    this.fromBuf = mk(0, this.from, gl.DYNAMIC_DRAW);
    this.toBuf = mk(1, this.to, gl.DYNAMIC_DRAW);
    mk(2, this.seeds, gl.STATIC_DRAW);
    gl.disable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE);
    gl.clearColor(0, 0, 0, 0);
    this.resize();
  }

  setSamples(samples: Float32Array | null) {
    this.samples = samples;
    this.raw.delete("phoenix");
    if (this.target?.shape === "phoenix") this.retarget(this.target, true);
  }

  private rawShape(name: ShapeName) {
    let shape = this.raw.get(name);
    if (!shape) {
      shape = buildShape(name, this.n, this.samples);
      this.raw.set(name, shape);
    }
    return shape;
  }

  /** Formraum → Bildschirm (NDC). Strähnen-Lebensart (w) bleibt erhalten. */
  private layout(raw: Float32Array, t: SceneTarget) {
    const out = new Float32Array(raw.length);
    const min = Math.min(this.w, this.h);
    const ux = (t.s * min) / this.w;
    const uy = (t.s * min) / this.h;
    for (let i = 0; i < raw.length; i += 4) {
      out[i] = t.x + raw[i] * ux;
      out[i + 1] = t.y + raw[i + 1] * uy;
      out[i + 2] = raw[i + 2];
      out[i + 3] = raw[i + 3];
    }
    return out;
  }

  /** Aktueller Stand jedes Teilchens auf der CPU (gleiche Formel wie im Shader, ohne Bogen). */
  private freeze() {
    const p = Math.min(1, (this.now - this.morphStart) / MORPH_S);
    if (p >= 1) return this.to.slice();
    const st = 0.6;
    const out = new Float32Array(this.to.length);
    for (let i = 0, k = 0; i < this.n; i++, k += 4) {
      const pi = Math.min(1, Math.max(0, p * (1 + st) - this.seeds[k + 2] * st));
      const e = easeCPU(pi);
      out[k] = this.from[k] + (this.to[k] - this.from[k]) * e;
      out[k + 1] = this.from[k + 1] + (this.to[k + 1] - this.from[k + 1]) * e;
      out[k + 2] = this.from[k + 2] + (this.to[k + 2] - this.from[k + 2]) * e;
      out[k + 3] = e < 0.5 ? this.from[k + 3] : this.to[k + 3];
    }
    return out;
  }

  private retarget(t: SceneTarget, morph: boolean) {
    const next = this.layout(this.rawShape(t.shape), t);
    const gl = this.gl;
    if (morph) {
      this.from = this.freeze();
      this.morphStart = this.now;
    } else {
      this.from = next;
      this.morphStart = -10;
    }
    this.to = next;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.fromBuf);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.from);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.toBuf);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.to);
  }

  setScene(t: SceneTarget) {
    const prev = this.target;
    this.target = t;
    if (prev && prev.shape === t.shape && prev.x === t.x && prev.y === t.y && prev.s === t.s) return;
    this.retarget(t, true);
    if (!this.running) this.draw();
  }

  setPointer(x: number, y: number, active: boolean) {
    this.pointer.x = (x / this.w) * 2 - 1;
    this.pointer.y = 1 - (y / this.h) * 2;
    this.pointer.goal = active ? 1 : 0;
  }

  setScroll(y: number) {
    this.scroll = y;
  }

  resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, this.opts.dprMax);
    const w = window.innerWidth;
    const h = window.innerHeight;
    if (w === this.w && h === this.h && dpr === this.dpr) return;
    this.w = w;
    this.h = h;
    this.dpr = dpr;
    this.canvas.width = Math.round(w * dpr);
    this.canvas.height = Math.round(h * dpr);
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    if (this.target) this.retarget(this.target, true);
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.last = performance.now();
    const loop = () => {
      if (!this.running) return;
      this.draw();
      this.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }

  /** Ein Bild zeichnen (auch im Stillstand, z. B. nach Pause). */
  draw() {
    const nowMs = performance.now();
    const dt = Math.min(0.1, Math.max(0, (nowMs - this.last) / 1000));
    this.last = nowMs;
    if (this.running) this.now += dt;
    const t = this.target;
    const k = 1 - Math.exp(-dt / 0.9);
    if (t) {
      this.cur.alpha += (t.alpha - this.cur.alpha) * k;
      this.cur.loose += (t.loose - this.cur.loose) * (1 - Math.exp(-dt / 1.3));
      this.cur.heat += (t.heat - this.cur.heat) * (1 - Math.exp(-dt / 1.6));
      this.cur.unit += (t.s - this.cur.unit) * k;
    }
    const pk = 1 - Math.exp(-dt / (this.pointer.goal > this.pointer.s ? 0.15 : 0.9));
    this.pointer.s += (this.pointer.goal - this.pointer.s) * pk;
    if (this.pointer.goal > 0) this.pointer.goal = Math.max(0, this.pointer.goal - dt * 0.8);
    const gl = this.gl;
    const min = Math.min(this.w, this.h);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(this.prog);
    gl.uniform1f(this.u.uT, this.now + 40);
    gl.uniform1f(this.u.uP, Math.min(1, (this.now - this.morphStart) / MORPH_S));
    gl.uniform1f(this.u.uLoose, this.cur.loose);
    gl.uniform1f(this.u.uHeat, this.cur.heat);
    gl.uniform1f(this.u.uAlpha, this.cur.alpha);
    gl.uniform1f(this.u.uPx, 2.6 * this.dpr * Math.min(1.25, Math.max(0.8, min / 800)));
    gl.uniform2f(this.u.uUnit, (this.cur.unit * min) / this.w, (this.cur.unit * min) / this.h);
    gl.uniform2f(this.u.uAspect, this.w / min, this.h / min);
    gl.uniform3f(this.u.uPointer, this.pointer.x, this.pointer.y, this.pointer.s);
    gl.uniform1f(this.u.uAmbient, this.opts.ambient);
    gl.uniform1f(this.u.uScroll, this.scroll);
    gl.drawArrays(gl.POINTS, 0, this.n);
    this.frames++;
  }

  destroy() {
    this.stop();
    this.gl.getExtension("WEBGL_lose_context")?.loseContext();
  }
}
