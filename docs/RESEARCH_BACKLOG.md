# CarPaintFinder — source research backlog

## Current source-backed candidates
- Ford F-150 2017: `data/location-candidates-ford-2017.json`
- Honda Accord Hybrid 2024: `data/location-candidates-oem-2024-2025.json`
- Chevrolet Equinox EV 2025: `data/location-candidates-oem-2024-2025.json`

These are **pending** records, not approved. Confirm the cited original document, model year, market and exact label terminology before publication.

## Highest-priority evidence gaps
1. Toyota Corolla — find original manufacturer documentation showing the paint/color code field and the model year it covers.
2. Jeep Compass — find original Jeep/Mopar owner or service documentation with a model-year-specific exterior paint code location.
3. Ford F-150 2017 — inspect the source document and confirm its exact model and label terminology.
4. Honda Accord Hybrid 2024 — verify cited manual section, market scope and label location.
5. Chevrolet Equinox EV 2025 — verify center-pillar barcode and alternative label location from cited manual.
6. Paint colors — independently source the OEM code, official color name, model, year and market. Never infer year ranges from a color name or VIN.

## Acceptance criteria
- Source URL opens to the cited manufacturer document.
- A reviewer records exact year/model applicability.
- Source clearly supports the claimed code or label location.
- No unlicensed proprietary dataset copying or manual illustration reproduction.
- Public data is limited to approved records.

## Next build tasks
- Importer dry-run and duplicate reporting
- Approval audit log with reviewer/date/evidence notes
- Additional sourced candidate batches after documentation review
- Automated API tests with a disposable PostgreSQL test database
