/* ============================================================
   Placeholder music engine.

   generative ambient in A minor pentatonic — a slow pad under a
   sparse arpeggio, through a lowpass and a feedback delay. It is
   a stand-in, but it is a *real* signal chain: filter, delay and
   analyser all sit downstream of the source.

   ── SWAPPING IN YOUR REAL TRACKS ──────────────────────────
   drop files into /public/audio, then:

       createEngine({ trackUrl: "/audio/your-track.mp3" })

   the <audio> element is routed through the exact same filter →
   delay → analyser chain, so the scroll response and the keycap
   backlighting keep working untouched. Nothing else changes.
   ============================================================ */

export interface EngineOptions {
  /** point this at a file in /public/audio to replace the placeholder */
  trackUrl?: string;
}

export interface AudioEngine {
  start(): Promise<void>;
  stop(): void;
  isRunning(): boolean;
  /** 0..1 — driven by scroll depth; opens the filter and lifts the mix */
  setIntensity(v: number): void;
  /** fills `out` with normalised 0..1 band levels, low → high */
  readLevels(out: Float32Array): void;
  dispose(): void;
}

type Ctor = typeof AudioContext;

function getAudioContextCtor(): Ctor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    AudioContext?: Ctor;
    webkitAudioContext?: Ctor;
  };
  return w.AudioContext ?? w.webkitAudioContext ?? null;
}

/* A minor pentatonic, four bars of harmony */
const CHORDS: number[][] = [
  [110.0, 164.81, 261.63], // Am
  [87.31, 130.81, 220.0], //  F
  [130.81, 196.0, 329.63], // C
  [98.0, 146.83, 246.94], //  G
];

const ARP = [220.0, 261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33];

const TEMPO = 84;
const STEP = 60 / TEMPO / 2; // eighth notes
const LOOKAHEAD_MS = 25;
const SCHEDULE_AHEAD = 0.12;

export function createEngine(options: EngineOptions = {}): AudioEngine {
  let ctx: AudioContext | null = null;
  let master: GainNode | null = null;
  let filter: BiquadFilterNode | null = null;
  let analyser: AnalyserNode | null = null;
  let padGain: GainNode | null = null;
  let bins: Uint8Array | null = null;

  let padVoices: OscillatorNode[] = [];
  let timer: ReturnType<typeof setInterval> | null = null;
  let audioEl: HTMLAudioElement | null = null;

  let running = false;
  let intensity = 0;
  let nextNoteTime = 0;
  let step = 0;

  function build(Ctor: Ctor) {
    ctx = new Ctor();

    master = ctx.createGain();
    master.gain.value = 0;

    filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 700;
    filter.Q.value = 0.6;

    analyser = ctx.createAnalyser();
    analyser.fftSize = 512;
    analyser.smoothingTimeConstant = 0.78;
    bins = new Uint8Array(analyser.frequencyBinCount);

    // a little air around everything
    const delay = ctx.createDelay(1.5);
    delay.delayTime.value = 0.42;
    const feedback = ctx.createGain();
    feedback.gain.value = 0.34;
    const wet = ctx.createGain();
    wet.gain.value = 0.3;
    const damp = ctx.createBiquadFilter();
    damp.type = "highpass";
    damp.frequency.value = 320;

    filter.connect(master);
    filter.connect(delay);
    delay.connect(damp);
    damp.connect(feedback);
    feedback.connect(delay);
    damp.connect(wet);
    wet.connect(master);

    master.connect(analyser);
    analyser.connect(ctx.destination);
  }

  /** the real-file path: same chain, different source */
  function attachTrack(url: string) {
    if (!ctx || !filter) return;
    audioEl = new Audio(url);
    audioEl.loop = true;
    audioEl.crossOrigin = "anonymous";
    const src = ctx.createMediaElementSource(audioEl);
    src.connect(filter);
    void audioEl.play().catch(() => {
      /* autoplay refused — the power key click will retry */
    });
  }

  function startPad() {
    if (!ctx || !filter) return;
    padGain = ctx.createGain();
    padGain.gain.value = 0.16;
    padGain.connect(filter);

    // three detuned voices per chord tone, retuned on the fly
    CHORDS[0].forEach((f) => {
      for (let d = -1; d <= 1; d++) {
        const osc = ctx!.createOscillator();
        osc.type = "sawtooth";
        osc.frequency.value = f;
        osc.detune.value = d * 7;
        const g = ctx!.createGain();
        g.gain.value = 0.09;
        osc.connect(g);
        g.connect(padGain!);
        osc.start();
        padVoices.push(osc);
      }
    });
  }

  function retunePad(chord: number[], when: number) {
    padVoices.forEach((osc, i) => {
      const f = chord[Math.floor(i / 3) % chord.length];
      osc.frequency.setTargetAtTime(f, when, 0.9);
    });
  }

  function pluck(freq: number, when: number, velocity: number) {
    if (!ctx || !filter) return;
    const osc = ctx.createOscillator();
    osc.type = "triangle";
    osc.frequency.value = freq;

    const g = ctx.createGain();
    g.gain.setValueAtTime(0, when);
    g.gain.linearRampToValueAtTime(velocity, when + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, when + 1.5);

    osc.connect(g);
    g.connect(filter);
    osc.start(when);
    osc.stop(when + 1.6);
  }

  function schedule() {
    if (!ctx) return;
    while (nextNoteTime < ctx.currentTime + SCHEDULE_AHEAD) {
      const bar = Math.floor(step / 8) % CHORDS.length;

      if (step % 8 === 0) retunePad(CHORDS[bar], nextNoteTime);

      // sparse at rest, busier as you scroll in
      const density = 0.28 + intensity * 0.34;
      if (Math.random() < density) {
        const note = ARP[(step * 3 + bar) % ARP.length];
        const octave = Math.random() < 0.22 ? 2 : 1;
        pluck(note * octave, nextNoteTime, 0.075 + Math.random() * 0.05);
      }

      nextNoteTime += STEP;
      step++;
    }
  }

  async function start() {
    if (running) return;

    const Ctor = getAudioContextCtor();
    if (!Ctor) return;

    if (!ctx) {
      build(Ctor);
      if (options.trackUrl) attachTrack(options.trackUrl);
      else startPad();
    }
    if (!ctx || !master) return;

    await ctx.resume();
    if (audioEl) void audioEl.play().catch(() => {});

    // fade up rather than snap — the machine warms
    const now = ctx.currentTime;
    master.gain.cancelScheduledValues(now);
    master.gain.setValueAtTime(master.gain.value, now);
    master.gain.linearRampToValueAtTime(0.85, now + 2.4);

    nextNoteTime = now + 0.08;
    if (!options.trackUrl) {
      timer = setInterval(schedule, LOOKAHEAD_MS);
    }
    running = true;
  }

  function stop() {
    if (!running || !ctx || !master) return;
    const now = ctx.currentTime;
    master.gain.cancelScheduledValues(now);
    master.gain.setValueAtTime(master.gain.value, now);
    master.gain.linearRampToValueAtTime(0, now + 0.7);
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
    if (audioEl) audioEl.pause();
    running = false;
  }

  function setIntensity(v: number) {
    intensity = Math.min(1, Math.max(0, v));
    if (!ctx || !filter || !padGain) return;
    const now = ctx.currentTime;
    // opening the lowpass as you scroll is what makes it feel like
    // the track is arriving rather than just getting louder
    filter.frequency.setTargetAtTime(700 + intensity * 4200, now, 0.35);
    padGain.gain.setTargetAtTime(0.16 + intensity * 0.1, now, 0.5);
  }

  function readLevels(out: Float32Array) {
    if (!analyser || !bins) {
      out.fill(0);
      return;
    }
    analyser.getByteFrequencyData(bins as unknown as Uint8Array<ArrayBuffer>);

    const n = out.length;
    const usable = Math.floor(bins.length * 0.62); // ignore dead top end
    for (let i = 0; i < n; i++) {
      // log spacing — low frequencies get the room they deserve
      const lo = Math.floor(Math.pow(i / n, 1.7) * usable);
      const hi = Math.max(lo + 1, Math.floor(Math.pow((i + 1) / n, 1.7) * usable));
      let sum = 0;
      for (let b = lo; b < hi; b++) sum += bins[b];
      out[i] = Math.min(1, sum / (hi - lo) / 190);
    }
  }

  function dispose() {
    stop();
    padVoices.forEach((o) => {
      try {
        o.stop();
      } catch {
        /* already stopped */
      }
    });
    padVoices = [];
    if (audioEl) {
      audioEl.src = "";
      audioEl = null;
    }
    void ctx?.close();
    ctx = null;
  }

  return {
    start,
    stop,
    isRunning: () => running,
    setIntensity,
    readLevels,
    dispose,
  };
}
