@AGENTS.md

# VesselIQ Passport, working notes for future sessions

## What this repo is

A standalone Next.js app, deployed separately from the marketing site. Two surfaces:

1. `/` , a focused landing page selling the VesselIQ Passport to brokers, buyers, and insurers.
2. `/passport/[slug]` , a tabbed verified vessel record. Today there is one slug, `meridian`.

This is not the broader VesselIQ platform. Keep it lean.

## Schema fidelity, the load bearing rule

The demo data file at `data/passport-demo-data-v2.json` is shaped to match the production PostgreSQL schema field for field, across these entities, `vessel`, `system`, `equipment_instance`, `equipment_model`, `service_event`, `service_line_item`, `vessel_provenance`, `manufacturers`.

When the read only production database connection lands, a query returning this same shape drops in with no remapping. Component code reads these field names directly. Do not rename, normalize, or wrap the data into a derived shape, the whole point is the field names match.

If a field is missing for a component, add it to the JSON with a realistic value that matches the schema. Do not invent fields the schema does not have.

## Honest telemetry framing

The production schema does NOT store live telemetry yet. The Telemetry tab must not fabricate live telemetry data. It shows three things only,

1. A clear statement that live telemetry is rolling out with VesselIQ Pro hardware.
2. The real fact that this hull has a telemetry logger commissioned, read from the JSON (`equipment_instance_id eqi-0005`, CSS Electronics CANedge3).
3. A roadmap of what will attach when the live channel activates.

Frame it as roadmap, not as current data. This keeps the demo honest with an insurer who asks to see real data.

## Brand tokens

Defined in `app/globals.css`,

- ink `#0c1117`
- teal `#0a8a78`
- teal deep `#086a5d`
- canvas `#f6f4ef`
- paper `#ffffff`

Fonts via `next/font/google`,

- Instrument Sans, body
- Instrument Serif, italic accents only
- JetBrains Mono, eyebrows, hashes, HINs, timestamps, serials

## Writing rules

- Prefer commas, periods, colons, spaces over dashes in user facing copy. No em dashes, no en dashes, no hyphens in compound modifiers.
- Exempt, code identifiers, file paths, npm package names, ISO timestamps, hashes, HINs, part numbers.
- US English spellings.
- No Claude Code or Anthropic attribution anywhere in the codebase, commit messages, or PRs.

## Lean stack constraint

No three.js, no WebGL, no chart libraries, no animation libraries, no UI kits. Inline SVG only for small visuals like the confidence ring, score bars, and verified marks. If a feature seems to need a heavy dep, find a simpler path or ship without it.

Dependencies must stay at, `next`, `react`, `react-dom`, and the Tailwind 4 plus eslint dev deps that ship in the create-next-app template.

## Conventions

- Server components by default. Tab switching is a single small client island (`PassportTabs`), the landing form is another (`AccessForm`).
- Data imported at build time from the JSON so pages prerender static. `/passport/[slug]` uses `generateStaticParams` plus `dynamicParams = false`.
- `params` is `Promise<...>` on Next 16, always `await props.params`.
- Path alias `@/*` resolves to the repo root.

## Layout

```
app/
  page.tsx                  landing page
  layout.tsx                fonts, root html
  globals.css               brand tokens, base typography
  components/               shared site components (nav, footer, form, ring)
  api/access/route.ts       landing form receiver
  passport/[slug]/
    page.tsx                passport route
    components/             header, tabs, and the five tab views
data/passport-demo-data-v2.json   the shape source of truth for now
lib/
  passport-types.ts         schema typed
  passport-data.ts          loader by slug
  format.ts                 dates, money, numbers
```

## Build expectations

`npm run build` must pass. Both routes prerendered, `/api/access` is the only dynamic surface.
