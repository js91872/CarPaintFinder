# OEM source research — batch 01 (October 2026)

## Candidate records
- 2024 Honda Accord Hybrid (U.S.): manufacturer's owner's manual Exterior Care / Painting the Vehicle section identifies the color-code label at the driver's doorjamb. Candidate: `data/location-candidates-oem-2024-2025.json`.
- 2025 Chevrolet Equinox EV: manufacturer's owner's manual Service Parts Identification section describes a large barcode on the center-pillar certification label and an alternative information label inside the trunk. Candidate: same JSON.
- 2017 Ford F-150: earlier source candidate is retained in `data/location-candidates-ford-2017.json`. Its linked manual and exact paint-code field still require human review.

## Review policy
All new records are pending, not verified. These sources substantiate *label locations*, not complete paint-color offerings, formulas, exact vehicle matches, or all years. Do not infer colors or carry location claims to adjacent model years. The importer deliberately cannot approve data.

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
