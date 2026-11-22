/**
 * Modul 20: Wunsch „kurzes Tageslichtvideo vor dem Versand“. Wird als feste Zeile an die Notiz bzw.
 * Nachricht gehängt (kein neues Datenbankfeld). Die Zeile ist deutsch, weil Andréia sie liest.
 */
export const VIDEO_REQUEST_LINE = "[Wunsch: kurzes Tageslichtvideo (ca. 10 Sekunden) vor dem Versand per WhatsApp]";

export function appendVideoRequest(text: string, max: number): string {
  const tail = `\n\n${VIDEO_REQUEST_LINE}`;
  const base = text.trim();
  const room = max - tail.length;
  const head = base.length > room ? base.slice(0, Math.max(0, room)).trimEnd() : base;
  return head ? `${head}${tail}` : VIDEO_REQUEST_LINE;
}
