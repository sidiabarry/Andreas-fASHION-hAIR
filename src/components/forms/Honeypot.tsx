import { useId } from "react";

/** Verstecktes Feld gegen Spam-Bots. Für Menschen unsichtbar und nicht fokussierbar. */
export function Honeypot() {
  const id = useId();
  return (
    <div aria-hidden="true" className="af-hp">
      <label htmlFor={id}>Website</label>
      <input autoComplete="off" id={id} name="website" tabIndex={-1} type="text" />
    </div>
  );
}
