/**
 * SVG-Filter für das Glas-Material (`.af-glass--lens`): leichte Lichtbrechung des Hintergrunds.
 * Rauschen (feTurbulence) verbiegt den Hintergrund (feDisplacementMap), danach etwas Mattierung.
 * Wird nur in Chromium per `backdrop-filter: url(#af-glass-lens)` benutzt (html.af-lens, siehe FxUi);
 * alle anderen Browser bekommen blur()/saturate(). Kein Skript, kein Drittanbieter.
 */
export function GlassDefs() {
  return (
    <svg aria-hidden="true" className="af-glass-defs" focusable="false" height="0" width="0">
      <filter colorInterpolationFilters="sRGB" height="100%" id="af-glass-lens" width="100%" x="0" y="0">
        <feTurbulence baseFrequency="0.011 0.034" numOctaves="2" result="noise" seed="11" type="fractalNoise" />
        <feGaussianBlur in="noise" result="soft" stdDeviation="1.4" />
        <feDisplacementMap in="SourceGraphic" in2="soft" result="bent" scale="16" xChannelSelector="R" yChannelSelector="G" />
        <feGaussianBlur in="bent" result="frost" stdDeviation="2.2" />
        <feColorMatrix in="frost" type="saturate" values="1.45" />
      </filter>
    </svg>
  );
}
