import { AbsoluteFill, Easing, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";

import { FADE, FPS, framesOf, type Cut } from "./cuts";

const ease = Easing.bezier(0.45, 0, 0.55, 1);

/**
 * Eine Szene: Haar bleibt farbtreu (kein Farbfilter), nur eine kaum merkliche Kamerafahrt nach vorn.
 * `start`/`end` in Quell-Frames; `push` = Kamerafahrt an/aus; `fadeIn` = Überblendung über die vorige Szene.
 */
function Shot({ src, start, end, fadeIn, push }: { src: string; start: number; end: number; fadeIn: boolean; push: boolean }) {
  const frame = useCurrentFrame();
  const length = end - start;
  const opacity = fadeIn ? interpolate(frame, [0, FADE - 1], [0, 1], { easing: ease, extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 1;
  const scale = push ? interpolate(frame, [0, length], [1.0, 1.035], { extrapolateRight: "clamp" }) : 1;
  return (
    <AbsoluteFill style={{ opacity }}>
      <OffthreadVideo
        muted
        src={staticFile(src)}
        style={{ height: "100%", objectFit: "cover", transform: `scale(${scale})`, width: "100%" }}
        trimAfter={end}
        trimBefore={start}
      />
    </AbsoluteFill>
  );
}

/**
 * Szenen überlappen um FADE Frames. Am Ende blenden die FADE Quell-Frames unmittelbar VOR dem Einstieg
 * der ersten Szene ein: Das letzte Bild des Films ist damit der direkte Vorgänger des ersten – nahtlose Schleife.
 */
export function Film({ cuts }: { cuts: Cut[] }) {
  let at = 0;
  const shots = cuts.map((cut, index) => {
    const from = at;
    at += framesOf(cut) - FADE;
    return { cut, from, index };
  });
  const first = cuts[0];
  const firstStart = Math.round(first.from * FPS);
  return (
    <AbsoluteFill style={{ backgroundColor: "#f4efe8" }}>
      {shots.map(({ cut, from, index }) => (
        <Sequence durationInFrames={framesOf(cut)} from={from} key={`${cut.src}-${cut.from}`}>
          <Shot end={Math.round(cut.to * FPS)} fadeIn={index > 0} push={index > 0} src={cut.src} start={Math.round(cut.from * FPS)} />
        </Sequence>
      ))}
      <Sequence durationInFrames={FADE} from={at}>
        <Shot end={firstStart} fadeIn push={false} src={first.src} start={firstStart - FADE} />
      </Sequence>
    </AbsoluteFill>
  );
}
