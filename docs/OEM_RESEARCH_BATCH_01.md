# OEM source research — batch 01 (October 2026)

## Candidate records
- 2024 Honda Accord Hybrid (U.S.): Honda's owner's manual, Exterior Care / Painting the Vehicle, says to refer to the color-code label and temperature notice label affixed to the driver's doorjamb before painting. The source does not give a paint code or formula. Candidate: `data/location-candidates-oem-2024-2025.json`.
- 2025 Chevrolet Equinox EV: GM's owner's manual, Service Parts Identification, says the center-pillar certification-label barcode may contain VIN, model designation, paint information and production options; if absent, the same information is on a trunk label. This is label guidance, not paint-code catalog data. Candidate: same JSON.
- 2017 Ford F-150: the official owner's manual supports the Safety Compliance Certification Label position (driver-side hinge pillar, latch post, or door edge) but the reviewed manual does not identify the paint field. The candidate text now states that limitation and remains pending in `data/location-candidates-ford-2017.json`.

## Review policy
All new database records are pending, not verified. The first two manuals substantiate specific *label location / paint-information instructions*, not complete paint-color offerings, formulas, exact color matches, or adjacent model years. The Ford manual supports label placement only. No OEM paint-color records are currently available for public search. Do not infer colors or carry location claims to adjacent model years. The importer deliberately cannot approve data.

## Next manufacturer research
- Toyota Corolla: model-year-specific owner's manual or manufacturer documentation for the color/trim label.
- Jeep Compass: model-year-specific Mopar/Jeep documentation.
- Ford F-150: verify original 2017 owner's manual source and EXT PNT label description.

Avoid copying third-party bulk paint databases. A comprehensive paint-code dataset requires licensed manufacturer/aftermarket data or individually validated original sources.

## Local actions
```bash
git pull --ff-only origin main
npm run import:locations -- data/location-candidates-oem-2024-2025.json
npm run db:status
```

Pending records remain hidden from public search until review and approval.
