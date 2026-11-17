/** Verstecktes Feld gegen Spam-Bots. Für Menschen unsichtbar und nicht fokussierbar. */
export function Honeypot() {
  return (
    <div aria-hidden="true" className="af-hp">
      <label htmlFor="af-website">Website</label>
      <input autoComplete="off" id="af-website" name="website" tabIndex={-1} type="text" />
    </div>
  );
}
