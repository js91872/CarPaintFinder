# CarPaintFinder

Vehicle paint-code identification portal. Research-stage application: no VIN-to-paint-code promises, no unverified OEM color database.

## Stack
Next.js App Router, TypeScript, CSS. Data is source-attributed and marked by verification status.

## Run
`npm ci && npm run dev`

For public search APIs, configure `DATABASE_URL` and apply the versioned
database migrations with `npm run db:migrate`. Without a database, health checks
work and validated search requests return HTTP 503; no sample OEM codes are
seeded.

## Verification
`npm run test:data && npm run test:locations && npm run typecheck && npm run build`

Database setup and API checks are documented in `docs/LOCAL_TEST.md` and
`docs/LOCAL_DATABASE_SETUP.md`. Public crawling remains disabled by `robots.txt`
and the site's `noindex` metadata until the owner approves launch.

## Data policy
Only publish manufacturer/model/year instructions supported by an attributable source. Do not scrape proprietary competitor catalogs or imply that a VIN directly encodes paint color. Initial guides are educational and require vehicle-specific verification.
