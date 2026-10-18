# Development phase — 18 October 2026

Design V1 is implemented. The finder supports two journeys: locating a vehicle's paint label and searching a full paint code against verified records.

## Data state
No OEM paint-color records are in the repository or database. Source research currently supports pending, model-year-specific label-location candidates for the 2024 U.S. Honda Accord Hybrid and the 2025 Chevrolet Equinox EV. A 2017 Ford F-150 manual supports certification-label placement, but not the paint-field identifier, so its candidate is worded with that limitation. These records remain pending until individual editorial review.

## Local setup
1. Install Node.js 22 and run `npm ci`.
2. Run `npm run test:data`, `npm run test:locations`, `npm run typecheck`, and `npm run build`.
3. Run `npm run dev` for a local preview.
4. For PostgreSQL 15+, set `DATABASE_URL` in `.env.local`, run `npm run db:migrate`, then `npm run db:status`.
5. Run `npm run start -- -H 127.0.0.1 -p 3099`, then `BASE_URL=http://127.0.0.1:3099 npm run smoke:api`. With a configured test database, also run `npm run test:db-api`.

## Launch blockers
Public search remains empty until specific records have been researched, reviewed, and approved. A licensed or independently validated OEM paint-color dataset is not available. Public crawling is blocked by `robots.txt` and `noindex` metadata. Contact details, legal operator information, source-rights review, DNS, VPS access, rate limiting, backups, monitoring, and manual mobile/accessibility review still require completion before a public launch.
