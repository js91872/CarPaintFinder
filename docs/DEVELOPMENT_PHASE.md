# Development phase — 18 October 2026

Design V1 frozen. The finder now supports separate **locate my code** and **I have a code** journeys.

## Data strategy
Verified paint colors and verified label locations are separate datasets. Both must cite source documentation and be reviewed for year/model applicability. Manufacturer homepages are starting points, not evidence for individual year-specific claims.

## Local setup
1. `npm install`
2. `npm run typecheck && npm run build`
3. `npm run dev`
4. For PostgreSQL, create a database and apply `db/schema.sql` followed by `db/002_verified_locations.sql`; configure `DATABASE_URL` in `.env.local` and restart.
5. Test `/api/paint-search?code=EXAMPLE` and `/api/label-locations?make=Chevrolet`. With an empty database these should return an empty results array; without a configured database, HTTP 503 is expected.

## Launch blockers
No verified color records or location rows have been added. No manufacturer model-year compatibility should be inferred from generic guides. Do not enable indexing or AdSense until the content and data have been reviewed.
