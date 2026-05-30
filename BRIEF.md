# VesselIQ Passport, concept brief for alternative designs

A self-contained brief any Claude Code instance can read to generate exact alternative designs without needing to ask questions.

## What it is, in one paragraph

VesselIQ Passport is a **certified, transferable digital record for a vessel**. One vessel, one canonical Passport. The data is sourced from government registries (USCG documentation, MIC codes), captured at OEM commissioning, and added by verified service partners through their lifetime. Every fact carries provenance (source, license, capture timestamp) and a tier (1 government registry, 2 OEM, 3 verified partner, 4 owner submitted). The whole snapshot is cryptographically signed at mint time with ECDSA P-256 via AWS KMS, and anchored to a specific vessel version so it cannot drift. The brand promise: **the verified history that travels with the hull**.

It is positioned between a passport (portrait document, certified by an authority) and an engineering registry record (precise, signed, citable). Not a SaaS dashboard.

## Audiences and what they need to see

| Audience | What they need | Primary surface |
|---|---|---|
| **Brokers** (primary) | A credibility instrument they attach to listings. Close the trust gap before the table | Landing offer A, demo tour |
| **Buyers** | Proof of what they are acquiring, not retyped paperwork. Identity confirmed, history signed | Passport preview state, verify button |
| **Insurers** | Verified identity, equipment, and maintenance provenance to underwrite on data, not paperwork | Passport full state, signature block |
| **Owners / Captains / Managers** | Claim ownership of an existing record. Prove they are the rightful holder | (Future route) /claim-ownership |

The transactional model: **brokers commission the creation** ($X,XXX one time, includes verification and certification). **Buyers pay for transfer** at acquisition ($X,XXX one time). Maintenance subscription ($XX/month) keeps the passport live. Without it, the record is a static snapshot.

## The story the product tells, in plain language

This is the value proposition, told end to end. The guided demo at `/demo` walks a broker through this:

1. **You enter the HIN.** We look it up. If we have a record we show you the preview. If not, you can claim it and we begin building one.
2. **We collect the data and digitize the operation.** Our team scans registration, survey, manuals, service receipts. We verify identity against USCG, IMO, MIC, and OEM registries. Equipment is captured at commissioning, signed by the engineer.
3. **You get a tamper proof record.** Only you can transfer it. No one can modify the data. Every fact carries a source, a signature, a capture timestamp. The whole snapshot is cryptographically signed.
4. **Brokers manage transfers with your authorization.** Sales are a different problem. A broker can run the transfer, but only with your authorization. You hold the key throughout.

## The five lifecycle states

Every Passport surface respects one of five states. The lifecycle is from Bill's SOW.

| State | Buyer or owner sees | Treatment |
|---|---|---|
| **Preview, locked** | Identity, seal, score, source count. Equipment, maintenance, telemetry, provenance are locked | Buyer surface. AcquirePanel + StickyAcquireBar visible. Locked tabs show summary stat + lock card |
| **Certified, full** | The complete document, all five tabs open | Owner or post-transfer buyer surface |
| **Transfer pending** | Status band, from/to parties, initiated date, expected close. Asset frozen | Mid-acquisition surface. Persistent TransferProgressBanner sticky at top |
| **Archived** | Closed historical record from a prior owner, read only | Post-transfer for the prior holder. Calm muted treatment |
| **Revoked** | 410 Gone. Invalidated. Reason shown, tabs suppressed entirely | Bad data, regulatory issue. Red bordered |

The state chip sits next to the vessel name. The current implementation uses a query param `?view=preview|full|transfer|archived|revoked` for demo switching.

## The brand visual language

### Materials and color

- **Background**: warm parchment `#efe9da`, with a fine printed dot grain (radial-gradient at 3px and 7px)
- **Paper alts**: `#f5f0e3` (paper-2, slightly lighter), `#faf6ec` (paper-3, lightest)
- **Ink**: `#0c1117` (primary text)
- **Action color**: `#0a8a78` (teal), deeper `#086a5d`. Reserved for things the user can act on. Scarcity gives it meaning.
- **Lines**: hairlines at `rgba(12,17,23, 0.12)` weak, `0.28` strong, `0.06` soft
- **Muted**: `rgba(12,17,23, 0.58)` and `0.42`

### Typography

Three families, very deliberate roles:

- **Instrument Serif** (display + italic accents). Big numbers, headings, italicized phrases inside otherwise sans text. The "registry document" voice.
- **Instrument Sans** (body). Default for prose, ledger values, identifiers.
- **JetBrains Mono** (all labels, eyebrows, identifiers, technical strings). 10.5px / 0.18em letter-spacing / uppercase. The "marginalia" voice.

The display uses negative letter-spacing -0.022em and tight leading 0.95. Italic forms of Instrument Serif are used as accent within otherwise sans copy: `This is what your <em>next listing</em> could ship with`.

### Action affordances, the three CTAs

- `cta-primary` (filled teal, 2px radius, system fonts). Reserved for transactional CTAs only: HIN lookup submit, Have your Passport created, Unlock and transfer.
- `cta-secondary` (teal underline, no fill). For navigation and informational actions like Verify authenticity.
- `cta-quiet` (ink, no underline until hover). For breadcrumb-level links.

Decorative teal is banned. The action color earns its meaning by scarcity.

### Document devices

- **Hairlines as page rules** between sections. Not borders on cards, hairlines on the page.
- **Section numerals** in the margin: `§ I`, `§ II`, etc., in serif italic small caps. Marks document hierarchy.
- **Stamp chips**, rectangular, 1px hairline border, mono uppercase tracking 0.14em. For metadata badges (flag state, classification, doc type, expiry).
- **Tier pills**, T1 filled ink, T2 outlined ink, T3 outlined muted, T4 dashed outline. No teal anywhere. Communicates fact provenance grade.
- **Folio rail** at the top of every page. Three mono uppercase items: identifier / schema / issued date.
- **Seal stamp** as the brand mark. Circular SVG, ~140-184px. Outer rotating ring with `VESSELIQ • CERTIFIED PASSPORT •` text on a circular path, slowly rotating. Inner dashed ring. Inner teal score arc rendering the confidence percentage. Center serif number (the percentage). Above the number: `Confidence` mono label. Below: `of 100`.

### Anti-patterns to avoid

- Dashes in body copy. Use commas, periods, colons, "and". US English.
- Em dashes / en dashes. Not in this document language.
- Decorative teal. Action color only.
- Rounded cards as containers. Use hairlines on the page.
- Box shadows beyond the most subtle (a 1px ink-tinted hint). No floating-card aesthetic.
- mask-composite. Breaks on Safari 17.
- Heavy dependencies. No design system libraries, no animation libraries, no chart libraries. Inline SVG only.

## The data model, in one canonical shape

Every surface respects this shape. It mirrors the production Postgres schema (Bill's SOW). The demo data file at `data/passport-demo-data-v2.json` is shaped to this exactly so a real query drops in.

```
Passport
├── _meta              { passport_id, schema_version, issued, is_sample, slug }
├── vessel             { vessel_id, vessel_version_id, hin, mmsi, official_number_us, name, make, model, model_year, loa_m, beam_m, draft_m, depth_m, hull_material, vessel_type, classification_society, flag_state, doc_*, confidence_pct, attributes: { hero_image, hero_image_credit, ... } }
├── manufacturer       { mic, company_name, display_name, city, country, mic_status }
├── systems[]          { system_id, system_type (PROPULSION|ELECTRICAL|NAVIGATION), name, equipment[] }
│   └── equipment[]    { equipment_instance_id, serial_number, installed_at, subsystem_node_id, attributes, model: { manufacturer, model_number, equipment_type, specs } }
├── service_events[]   { service_event_id, event_date, event_type, meter_reading_hrs, work_order_ref, performed_by, task_code, notes, line_items[] }
├── provenance[]       { provenance_id, entity, source_name, source_type (government_registry|oem_data|user_submission), source_uri, source_url, license, captured_at, captured_by, payload_summary }
├── scoring            { confidence_pct, weights: { accuracy, provenance, completeness, consistency, timeliness }, breakdown: { identity, equipment, maintenance, provenance, documents } }
├── signature          { canonical_hash_sha256, signature_b64, signing_key_id, signing_key_version, algorithm (ECDSA_SHA_256), mint_timestamp, public_key_url }
└── fact_metadata      { "<dotted.path>": { tier (1-4), verification_status (UNVERIFIED|USER_CONFIRMED|EXPERT_VALIDATED), confidence_pct, provenance_id } }
```

The sample vessel is **Motor Yacht "Bruce Wayne"**, a Focus 5x at HIN `FCM5X021J526`. Builder photo (black hull on water, Dutch flag, sleek Focus Motor Yachts styling) is contained inside the left column of the passport header, 16:9 ratio, hairline frame, mono caption "BUILDER PHOTO, FOCUS MOTOR YACHTS" docked bottom-right with backdrop blur.

## Key surfaces

### Landing `/`

Five document sections, numbered § I through § V:

- **§ I Hero**: huge serif italic display headline ("The verified history that travels with the hull"). HIN lookup field as the primary entry point. Prominent secondary "See the guided demo" link to `/demo`. Tertiary text links (Open sample, Have your Passport created). Issued-under rail + seal stamp on the right.
- **§ II Problem**: "A yacht sale runs on a folder of PDFs." Two-column body explaining the trust gap.
- **§ III What it is**: three audience columns (Brokers, Buyers, Insurers) separated by vertical hairlines, no cards.
- **§ IV How it works**: four step grid (Identity from registries, Equipment at commissioning, Service by verified partners, Owner controls visibility).
- **§ V Have your Passport created**: the create offer. Four-step Included grid, pricing display, access form posts `offer=create`.
- **§ VI Acquire callout** (small): "Looking at a vessel with a Passport? Acquire it when you close the deal." Pricing display, links to the sample.

Section numerals (§ I through § V) appear in a small left margin column when md+.

### Passport `/passport/[slug]`

The certified document. Structure top to bottom:

1. Folio rail (Passport no., Schema, Issued)
2. Header band (two columns at lg)
   - Left column: vessel-type eyebrow + StateChip + Sample chip; vessel name h1 in big serif; make/model subtitle in serif italic; identifier row (HIN/Catalog/MMSI/Off.no.) in mono; chips row (flag, class, doc, expiry); hero photo contained at 16:9
   - Right column: seal stamp; snapshot anchor (mint timestamp + vessel version short id); score weighting (inline SVG horizontal stacked bar with 5 alpha-graded segments + a definition list); cryptographic signature block with Verify Authenticity button
3. State-specific bands (TransferBand on `transfer`, ArchivedBand on `archived`, RevokedBand on `revoked`)
4. AcquirePanel + StickyAcquireBar (preview state only, gated off sample by default)
5. PassportTabs (sticky top, 5 sections): Identity, Equipment, Maintenance, Telemetry, Provenance
6. Notice block at bottom: "Demonstration record"

### Demo tour `/demo/tour?step=N`

The guided demo is the broker's product experience. `/demo` is a Route Handler that 307-redirects to `/demo/tour?step=1`. This is the link you share with a broker.

6-panel narrative for brokers, each panel under a shared chrome (sticky top with step indicator and progress dots, sticky bottom with Previous/Next, margin annotation in right column).

| Step | Title | Content |
|---|---|---|
| 1 | How a Passport is built | Four phases of the journey: enter HIN, we collect and digitize, you get a tamper-proof record, brokers manage transfers with your authorization. Plain language, sets up the rest of the demo. |
| 2 | The Passport | Full Passport header. "This is what your next listing could ship with..." |
| 3 | What the buyer sees | Preview header + static Acquire band. "Buyers see proof before they pay..." |
| 4 | Verification | Focused vessel ID + seal + signature block. Verify button auto-fires after 1.5s, shows green check. "Tamper proof signature, ECDSA P-256, KMS signed..." |
| 5 | Transfer flow | Transfer status banner at top + transfer-pending header + TransferBand. "When the deal closes, you authorize the buyer..." |
| 6 | Closer | "Bring this to your *next listing*". HIN input + name + email. CTA "Have your Passport created" posts `offer=create` |

### Claim, lookup

- `/claim?hin=...` for HIN not found. "We do not have a Passport for this hull yet." Presents the create offer with the HIN pre-filled on the intake form.
- HIN lookup at the top of the landing. Server action `findVesselByHin` returns found (route to `/passport/<slug>?view=preview&from=lookup`) or not-found (route to `/claim`). The function is the seam, replaceable with Bill's real lookup API later.

## The trust system

Three interlocking elements:

### Tier pills, per-fact

Inline at the right of every ledger row that has a `fact_metadata` entry. Communicate where each fact came from:
- T1 government registry (filled ink, white text)
- T2 OEM commissioning (outlined ink)
- T3 verified partner (outlined muted)
- T4 owner submitted (dashed outline)

### Verify authenticity

A `cta-secondary` button in the signature block. Calls `GET /api/passport/[slug]/verify`. Three result states:
- Idle: button visible, shield glyph
- Verifying: small box with spinner, "Verifying with KMS public key."
- Verified (success): teal-bordered box, green check, "Signed by VesselIQ, ECDSA_SHA_256 via [key id]. Payload is byte intact."

The endpoint mirrors Bill's SOW shape, so when the real `/verify` endpoint ships, only the fetch URL changes.

### Snapshot anchor

A small block under the seal:
```
SNAPSHOT ANCHOR
Taken 28 May 2026 · 14:22 UTC.
Anchored to vessel version b2e8d3c4…
```

Communicates the immutability primitive: this is a point in time, edits after this timestamp do not change this record.

## The transactional flow, broker authorization gate

When a buyer clicks "Unlock and transfer" in the preview state, a modal opens with a 4-step status sequence (also rendered as a persistent sticky banner at the top of the page):

1. **Request submitted** — buyer fills name/email/optional message, posts to `/api/access` with `offer=transfer_access_request`
2. **Broker authorization** — pending until the broker decides
3. **Payment** — placeholder "Payment integration coming soon"
4. **Transfer complete** — navigation to `?view=transfer`

Demo affordances (Simulate broker authorization, Simulate payment, Simulate completion) live in dashed `Demo affordance, internal only` blocks. They are no-print and clearly visually distinct from real CTAs. They advance the state for sales demos.

The narrative is: **the broker holds the key**. Sensitive vessel records are released only after the broker managing the sale confirms the buyer is legitimate.

## Constraints, what designs must keep

- **Document aesthetic**, parchment + hairlines + Instrument Serif italic + mono labels + seal + folio rails. Not a SaaS dashboard.
- **The data layer**, every surface reads from this canonical shape (or its `fact_metadata` extension). Designs that invent fields drift from production.
- **Honest telemetry framing**, telemetry tab does not fabricate live data. Shows "coming soon" with the hardware in place fact and a roadmap.
- **The transfer status banner** is real product, not scaffolding. The four simulate buttons inside are scaffolding.
- **The demonstration record notice** at the bottom must remain legibly visible. Legal not stylistic.
- **No new heavy dependencies**, all visuals are inline SVG. No D3, no Recharts, no Framer Motion, no shadcn registry, no Figma plugins.
- **Print**, the full state must print clean. Watermarks and photos hide in print. The data area and the seal print as ink on parchment.

## What is open for redesign

- The layout of the **Passport header** is the most expensive real estate and the most underdesigned. Title block + seal + signature block + photo currently compete. Could be rebuilt entirely as long as the brand voice and data shape are respected.
- The **tabs** are sticky bar with 5 items. Could become a left-margin TOC, a paginated set, a single scrolling document, etc.
- The **demo tour** is currently 6 page-style steps with shared chrome. Could become a single scrolling spread, a kiosk-style auto-advance, a sectioned dossier, etc.
- The **landing** five sections are a vertical sequence with margin numerals. Could be a single-page document, a magazine layout, a registry catalog, etc.

What is NOT open: the brand promise, the data shape, the lifecycle states, the trust system primitives (seal, signature, tier pills, verify endpoint), the audiences.
