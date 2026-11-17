/** JSON-LD als Datenblock (kein ausführbares Skript, daher nicht von der CSP betroffen). */
export function JsonLd({ data }: { data: object }) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return <script dangerouslySetInnerHTML={{ __html: json }} type="application/ld+json" />;
}
