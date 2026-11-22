"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

/**
 * Modul 11: Klick-Geräusch der Clips. Es gibt keine Aufnahme; das Geräusch wird per Web Audio
 * nachgebildet (zwei kurze, gefilterte Rauschimpulse) und deshalb ausdrücklich als Simulation gezeigt.
 */
function playClick() {
  const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctx) return;
  const ctx = new Ctx();
  const burst = (at: number, freq: number, gain: number) => {
    const length = Math.floor(ctx.sampleRate * 0.045);
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < length; i += 1) data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (length * 0.16));
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = freq;
    filter.Q.value = 1.4;
    const volume = ctx.createGain();
    volume.gain.value = gain;
    source.connect(filter).connect(volume).connect(ctx.destination);
    source.start(ctx.currentTime + at);
  };
  burst(0, 2600, 0.9);
  burst(0.11, 1900, 0.7);
  window.setTimeout(() => void ctx.close(), 700);
}

export function SoftClipAudio() {
  const t = useTranslations("pdp");
  const [pulse, setPulse] = useState(0);
  return (
    <div className="af-pdp__helper-body">
      <button
        className="af-cta-line"
        onClick={() => {
          playClick();
          setPulse((n) => n + 1);
        }}
        type="button"
      >
        {t("clipPlay")}
      </button>
      <span aria-hidden="true" className="af-pdp__pulse" key={pulse} data-on={pulse > 0} />
      <p className="af-note">{t("clipNote")}</p>
    </div>
  );
}
