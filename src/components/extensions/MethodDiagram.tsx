import type { MethodId } from "@/lib/collection";

/**
 * Querschnitt je Technik: Kopfhaut (Linie), eigenes Haar (gedämpft), Befestigung (dunkel), Extension (Gold).
 * Reine Vektorgrafik, skaliert ohne Unschärfe, funktioniert in jeder Farbzone über currentColor und Tokens.
 */
export function MethodDiagram({ id, title }: { id: MethodId; title: string }) {
  const own = Array.from({ length: 9 }, (_, i) => 26 + i * 24);
  return (
    <svg className="xd" role="img" viewBox="0 0 240 150" xmlns="http://www.w3.org/2000/svg">
      <title>{title}</title>
      {/* Kopfhaut */}
      <path className="xd__scalp" d="M6 34 Q120 6 234 34" />
      {/* Eigenes Haar */}
      {own.map((x, i) => {
        // Startpunkt auf der Kopfhaut-Kurve (quadratische Bézierkurve, Scheitel bei x = 120, y = 20)
        const y = 21 + 14 * ((x - 120) / 114) ** 2;
        return <path className="xd__own" d={`M${x} ${y.toFixed(1)} q ${i % 2 ? 3 : -3} 60 ${i % 2 ? -2 : 2} 118`} key={x} />;
      })}
      {DRAW[id]()}
    </svg>
  );
}

/** Extension-Haar als Bündel goldener Linien ab einer Linie y. */
function strands(x1: number, x2: number, y: number, count = 10, length = 92) {
  const step = (x2 - x1) / (count - 1);
  return Array.from({ length: count }, (_, i) => {
    const x = x1 + i * step;
    return <path className="xd__ext" d={`M${x.toFixed(1)} ${y} q ${i % 2 ? 4 : -4} ${length / 2} ${i % 3 ? 2 : -2} ${length}`} key={i} />;
  });
}

function rings(x1: number, x2: number, y: number, count = 6) {
  const step = (x2 - x1) / (count - 1);
  return Array.from({ length: count }, (_, i) => <circle className="xd__ring" cx={x1 + i * step} cy={y} key={i} r={3.4} />);
}

const DRAW: Record<MethodId, () => React.ReactNode> = {
  butterfly: () => (
    <>
      {rings(46, 194, 44)}
      <path className="xd__band" d="M40 50 H200" />
      {/* Flügel: das Haar der Tresse legt sich über die Ringe */}
      <path className="xd__flap" d="M40 50 C70 30 170 30 200 50" />
      {strands(42, 198, 52, 12)}
    </>
  ),
  clip: () => (
    <>
      <rect className="xd__band" height="6" rx="2" width="150" x="45" y="44" />
      {[70, 120, 170].map((x) => (
        <g className="xd__clip" key={x}>
          <rect height="12" rx="3" width="22" x={x - 11} y="38" />
          <path d={`M${x - 8} 50 v8 M${x - 3} 50 v8 M${x + 2} 50 v8 M${x + 7} 50 v8`} />
        </g>
      ))}
      {strands(48, 192, 50, 11)}
    </>
  ),
  genius: () => (
    <>
      {rings(46, 194, 42)}
      <path className="xd__stitch" d="M46 42 L56 48 L66 42 L76 48 L86 42 L96 48 L106 42 L116 48 L126 42 L136 48 L146 42 L156 48 L166 42 L176 48 L186 42 L194 46" />
      <path className="xd__band xd__band--flat" d="M42 49 H198" />
      {strands(44, 196, 50, 12)}
    </>
  ),
  invisible: () => (
    <>
      {[70, 120, 170].map((x) => (
        <g key={x}>
          <rect className="xd__tape xd__tape--thin" height="3" rx="1" width="34" x={x - 17} y="46" />
          {strands(x - 15, x + 15, 49, 5, 90)}
        </g>
      ))}
    </>
  ),
  keratin: () => (
    <>
      {[54, 78, 102, 126, 150, 174].map((x) => (
        <g key={x}>
          <ellipse className="xd__bond" cx={x} cy="48" rx="4" ry="7" />
          {strands(x - 2, x + 2, 54, 2, 88)}
        </g>
      ))}
    </>
  ),
  tape: () => (
    <>
      {[78, 162].map((x) => (
        <g key={x}>
          <rect className="xd__tape" height="7" rx="1.5" width="46" x={x - 23} y="40" />
          <rect className="xd__tape" height="7" rx="1.5" width="46" x={x - 23} y="50" />
          {strands(x - 21, x + 21, 57, 7, 84)}
        </g>
      ))}
    </>
  ),
  thin: () => (
    <>
      {rings(46, 194, 43)}
      <path className="xd__stitch" d="M46 43 L56 47 L66 43 L76 47 L86 43 L96 47 L106 43 L116 47 L126 43 L136 47 L146 43 L156 47 L166 43 L176 47 L186 43 L194 46" />
      <path className="xd__band xd__band--hair" d="M42 48 H198" />
      {strands(44, 196, 49, 14)}
    </>
  ),
};
