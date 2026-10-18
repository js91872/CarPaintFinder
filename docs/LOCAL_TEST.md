# Local review and verification

1. Install Node.js 22, clone the repository, then run `npm install`.
2. Run `npm run typecheck` and `npm run build`. Do not claim success until both commands exit 0.
3. Run `npm run dev`, then open http://localhost:3000.
4. In a second terminal run `npm run smoke:api`. Without PostgreSQL, valid searches return 503, which is expected. Invalid input must return 400.
5. Optional database setup: create a PostgreSQL 15+ database and execute `db/schema.sql` once. For existing databases created before the verified label-location view was added, apply `db/migrations/002_public_label_locations.sql` instead. Configure `DATABASE_URL` in `.env.local` and restart Next.js.
6. Run `npm run db:status` to inspect source, pending and verified record counts.
7. Before public deployment, verify legal pages, accessibility, real content sources, DNS, TLS and server configuration. Indexing is disabled.

Do not import `data/import-example.json`: it contains synthetic records.
