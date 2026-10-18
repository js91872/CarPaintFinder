# CarPaintFinder deployment runbook (review only)

**Do not deploy to a public hostname or enable indexing until the owner approves.** This document is a runbook, not a record of completed deployment.

## Preflight
1. Confirm Node.js 22, PostgreSQL 15+, sufficient VPS resources, DNS ownership, and an unused application port.
2. Run `npm ci`, `npm run test:data`, `npm run test:locations`, `npm run typecheck`, `npm run build` in a clean checkout.
3. Create a dedicated PostgreSQL database and minimally privileged application role. Store `DATABASE_URL` in a protected environment file outside the repository; never commit it.
4. Run `npm run db:migrate` and `npm run db:status`. A new database has no verified OEM records until independently reviewed imports are approved.
5. Run `npm run start -- -p 3099` on loopback behind a reverse proxy. Check `/api/health` and `npm run smoke:api`.
6. Configure HTTPS, proxy headers, service restart policy, logs, backups and firewall rules. Confirm other sites on the VPS are unaffected.
7. Complete legal pages, contact details, actual source-rights review and manual mobile/accessibility QA.
8. Keep `robots.txt` disallowing all crawling and meta noindex until the owner signs off on substantial verified content.

## Rollback
Keep the previous application release and environment file. On a failed health check, stop the new service and restart the previous release. Database migrations must be reviewed for backwards compatibility before production use. Back up the database before migration.
