# VesselIQ Passport

The verified history that travels with the hull. A focused landing page and a live Passport demo for a sample vessel, driven by data shaped to match the VesselIQ production schema.

## Routes

- `/` , landing page for brokers, buyers, and insurers
- `/passport/meridian` , a tabbed verified vessel record driven by `data/passport-demo-data-v2.json`
- `POST /api/access` , receives requests from the landing form

## Local development

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Production build

```bash
npm run build
npm run start
```

## Stack

Next.js 16 App Router, React 19, Tailwind CSS 4, TypeScript. No three.js, no WebGL, no chart libraries.

## Repo conventions

See `CLAUDE.md` for the schema fidelity rule, brand tokens, writing rules, and the honest telemetry framing.
