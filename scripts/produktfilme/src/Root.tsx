import { Composition } from "remotion";

import { FILMS, FPS, totalFrames } from "./cuts";
import { Film } from "./Film";

export function RemotionRoot() {
  return (
    <>
      {Object.entries(FILMS).map(([id, cuts]) => (
        <Composition
          component={Film}
          defaultProps={{ cuts }}
          durationInFrames={totalFrames(cuts)}
          fps={FPS}
          height={1024}
          id={id}
          key={id}
          width={576}
        />
      ))}
    </>
  );
}
