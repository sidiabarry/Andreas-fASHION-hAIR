/** Vertrauen in einem Atemzug: belegte Fakten als langsam laufendes Band (pausierbar). */
export function Ribbon({ items, label }: { items: string[]; label: string }) {
  const row = (hidden: boolean) => (
    <ul aria-hidden={hidden || undefined} aria-label={hidden ? undefined : label} className="ribbon__row">
      {items.map((item) => (
        <li key={item}>
          <svg aria-hidden="true" className="ribbon__spark" height="10" viewBox="0 0 10 10" width="10">
            <path d="M5 0 6 4 10 5 6 6 5 10 4 6 0 5 4 4z" fill="currentColor" />
          </svg>
          {item}
        </li>
      ))}
    </ul>
  );
  return (
    <section className="ribbon">
      <div className="ribbon__track">
        {row(false)}
        {row(true)}
      </div>
    </section>
  );
}
