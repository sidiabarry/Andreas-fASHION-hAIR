# Design Brief: Andrea's Fashion Hair (revision 2)

Revision 2 replaces the first direction after the owner's brief: the phoenix carries the brand, the real logo and the complete real catalog are used, and the page is built to sell. The boards in `refs/` document the first direction and are kept as a record only.

## Design read
For women (and men) in Germany who are losing hair or have lost it, of every hair colour and background. Register: calm, exact, dignified. The page never pities and never shouts. It should make someone want their piece before another person takes it.

## Concept spine
**Der Phönix.** Andrea's own mark and her own words: a person whose hair returns is "wie neu geboren". The page tells one rebirth: embers, wings of light, hair, mirror.

## Delivery tier
`cinema`. The scroll-scrubbed film is the Tier-1 mechanic. Surrounding motion is transform-only and reduced-motion gated. No smooth-scroll library: native scrolling keeps input latency at zero.

## Locked palette (derived from the owner's logo, which names the gold)
- ground `#100e0d`, surface `#181513`, raised `#201c19`, hairline `#2c2622`
- type `#f4efe8`, muted `#a89e94`
- single accent: phoenix gold `#e0a526` (the logo's own colour)
The gold is the brand's existing colour, so it overrides the default palette bans. One theme: every section is dark.

## Locked type
Geist (400 to 700, tight tracking) with Geist Mono for prices and micro labels. No serif.

## Animation mode: animated-website
Journey shape: **single-shot**. One continuous 15 s take, cut into three contiguous segments of the same master so each seam is the next frame, never a cut.

**Journey**
1. `Neubeginn`: "Wie neu geboren." Embers in darkness begin to rise.
2. `Identität`: "Es ist nicht nur Haar." The embers open into phoenix wings made of light.
3. `Unsichtbar`: "Niemand sieht einen Übergang." The wings cool into real hair; the camera settles on the parting.
The film enacts the spine literally: what burned down rises and becomes hair.

**World grammar**: seamless near-black studio, one bone-white ceramic head form, warm honey hair, gold rim light `#e0a526`, 85 mm, shallow depth of field, locked exposure, no text.
**Mobile framing**: subject centered, 720p encodes, same framing through a cover crop.
**Delivery budget**: desktop 8.8 MiB, mobile 5.1 MiB (limits 32 and 16).

## Section plan (home)
1. Journey film, three chapters, copy over the film.
2. Facts strip: four hard numbers in a ruled row.
3. Finder: "Was fehlt Ihnen gerade?" need tabs that swap a product row.
4. Handwerk: image left, four-row definition list right.
5. Gerade im Atelier: eight one-of-one pieces, one of them sold.
6. Phönix: centered story over the wing image, Andrea's quote.
7. Extensions: copy left, image right, six methods, inquiry CTA.
8. Drei Schritte: three numbered columns, risk reversal.
9. Fragen: accordion that answers the buying objections.
10. Closing: full-bleed mirror image with the final CTA.
Families: pinned film, ruled stat row, tabbed grid, split with list, product grid, centered story, split with chips, numbered columns, accordion, image banner. No family twice in a row.
Eyebrows: three in ten sections (film kicker, Handwerk, Extensions).

## Conversion design (honest levers only)
- Real scarcity: every hairpiece exists once. A reserved piece is marked "Verkauft" for everyone, enforced on the server.
- Risk reversal: nothing is paid at checkout. Andrea confirms personally, then sends PayPal or bank details.
- Objections answered before the price: visibility, colour match, fastening, delivery time.
- Authority from a true story: Andrea has worked with hair since she was nineteen and wears a piece herself.
- One next step per screen, one label per intent.
No invented reviews, no countdown timers, no strike-through prices.

## CTA inventory (each its own component)
- `Kollektion ansehen`: gold pill with a light sweep and a sliding arrow.
- `Persönlich beraten lassen`: underlined text link whose gap opens on hover.
- `Mein Stück finden`: mono label whose corner ticks grow into a full frame.
- `In den Warenkorb`: outlined bar that fills with gold from the left, price on the right.
- `Verbindlich reservieren` / `Anfrage senden`: full-width light band that turns gold.
- Need tabs: pills that invert when selected.

## Asset plan
- Owner's phoenix logo, used as is (nav, story, favicon, order confirmation).
- Film: one master, three desktop and three mobile segments, posters from the encoded clips.
- Product photography: the owner's 44 hairpiece photos re-lit on the studio ground, hair untouched. Her unedited photos stay on every product page.
- Four generated images: craft hands, phoenix wings, extensions still life, mirror.
- Launch cover and OG card from the branding pipeline.

## Content source
All 50 products, prices and specifications come from the owner's current shop. Portuguese and English texts were translated into German. Nothing about a product was invented beyond the wording.
