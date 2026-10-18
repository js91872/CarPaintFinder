# Local PostgreSQL setup (Ubuntu / Debian)

The website works without a database, but verified searches return HTTP 503 until PostgreSQL is configured.

## 1. Install and create database

Run on your local machine:

```bash
sudo apt update
sudo apt install -y postgresql postgresql-client
sudo systemctl enable --now postgresql
sudo -u postgres createuser --pwprompt carpaintfinder
sudo -u postgres createdb -O carpaintfinder carpaintfinder
```

Choose a strong password at the prompt. If the role or database already exists, skip its creation.

## 2. Apply database migrations

```bash
cd ~/CarPaintFinder
npm run db:migrate
npm run db:status
```

Migrations are versioned and checksummed. The runner records each applied migration and refuses to silently rerun edited migration files. It can adopt a complete database created with the older `db/schema.sql` bootstrap.

## 3. Configure local app

Create `.env.local` (excluded from Git) and set:

```dotenv
DATABASE_URL=postgresql://carpaintfinder:YOUR_URL_ENCODED_PASSWORD@127.0.0.1:5432/carpaintfinder
```

If the password contains special URL characters, percent-encode it in the connection string. Restart `npm run dev` after editing this file.

## 4. Import the sourced Ford research candidate

```bash
npm run import:locations -- data/location-candidates-ford-2017.json
```

This writes the candidate as `pending`. It **will not appear** in the public lookup until an editor verifies the precise manual/model/year applicability and explicitly changes its status in the database. See `docs/EDITORIAL_WORKFLOW.md`.

For paint candidate JSON files:

```bash
npm run import:paint -- path/to/your-paint-candidates.json
```

Do **not** import `data/import-example.json`; it is synthetic.

## 5. Smoke-test API

```bash
curl -i 'http://localhost:3000/api/label-locations?make=Ford&model=F-150&year=2017'
curl -i 'http://localhost:3000/api/paint-search?make=Ford&model=F-150&year=2017'
```

With a configured but unapproved database, the expected response is HTTP 200 with `results: []`. This is intentional. No fictitious paint codes are seeded.

## Publishing gate

The app currently disallows crawling in `robots.txt` and sets noindex metadata. Do not remove these restrictions until meaningful, reviewed, source-backed content is available and the legal/contact pages are finalized.
