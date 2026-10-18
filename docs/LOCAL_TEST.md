# Local review and verification

1. Install Node.js 22, clone the repository, then run `npm ci`.
2. Run `npm run typecheck` and `npm run build`. Do not claim success until both commands exit 0.
3. Run `npm run dev`, then open http://localhost:3000.
4. In a second terminal run `npm run smoke:api`. Without PostgreSQL, valid searches return 503, which is expected. Invalid input must return 400.
5. Optional database setup: create a PostgreSQL 15+ database, configure `DATABASE_URL` in `.env.local`, then run `npm run db:migrate`. The migration runner applies ordered, checksummed migrations and safely adopts a complete database created by the older one-shot schema installer.
6. Run `npm run db:status` to inspect source, pending, verified and migration counts. Run `npm run test:db-api` against the production server to test verified-only queries and source links; this inserts and removes marked test fixtures.
7. Before public deployment, verify legal pages, accessibility, real content sources, DNS, TLS and server configuration. Indexing is disabled.

Do not import `data/import-example.json`: it contains synthetic records. CI runs migrations twice against a clean PostgreSQL service to check fresh installation and repeat execution, then verifies the production APIs using temporary fixture records.
