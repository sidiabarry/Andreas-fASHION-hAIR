/**
 * Kapitelmarke des roten Fadens (I Extensions · II Topper und Perücken · III Maßanfertigung):
 * große römische Ziffer als Lichtkante, daneben ein feiner Goldfaden. Rein dekorativ bis auf den Text.
 */
export function Chapter({ label, numeral }: { label: string; numeral: string }) {
  return (
    <p className="h-chapter h-in">
      <span aria-hidden="true" className="h-chapter__num">
        {numeral}
      </span>
      <span className="af-sr">
        {label} {numeral}
      </span>
      <span aria-hidden="true" className="h-chapter__line" />
      <span aria-hidden="true" className="h-chapter__label">
        {label}
      </span>
    </p>
  );
}
