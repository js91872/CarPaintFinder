# PostgreSQL setup and verified lookup

Install PostgreSQL 15+ and create a dedicated database/user with permission to create the application tables, views, triggers and migration ledger. Keep credentials outside Git. Set `DATABASE_URL` in the environment and run `npm run db:migrate`; the runner serializes concurrent migration attempts, records checksums, and applies ordered SQL changes.

Set `DATABASE_URL` in the runtime environment. Never commit real secrets. The API endpoint `/api/paint-search?make=Chevrolet&model=Silverado&year=2020` returns only records where both the color and its model-year application have been independently verified. With no database configured, it returns HTTP 503 rather than fabricated matches.

The sample JSON record is synthetic and must not be inserted as a real paint color. No OEM color catalog is included. The lookup uses parameterized SQL queries, bounds result size to 100 and rejects oversized input. Verification transitions are recorded in `review_audit_events`. Before public launch, add API rate limiting, monitoring, a licensed/verified dataset and a secure editorial review process.

## Source-backed research note
GM TechLink, Mid-May 2018, documents the QR certification label on 2018 model-year GM vehicles and the paint-code field in the decoded data: https://gm-techlink.com/wp-content/uploads/2018/07/GM_TechLink_10_Mid-May_2018.pdf . This establishes a label-reading method, **not** a complete make/model/year-to-color mapping or permission to reproduce a catalog.
