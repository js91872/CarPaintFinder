# Source review and publication workflow

The importer stores all records as `pending`. Nothing becomes visible until the relevant records have been checked and explicitly approved. **Never run automated blanket approval queries.**

1. Identify a manufacturer-issued, model-year-specific document or another reliable source with clear factual provenance.
2. Check the original document, model, year, market, code and exact label position. Note conflicting documentation.
3. Record source URL, publisher, document title and the assessment of reuse rights. The database stores this provenance; source URLs alone do not establish permission to reproduce copyrighted material.
4. Import candidate paint records using `node scripts/import-candidates.mjs path/to/records.json`; import label locations using `node scripts/import-locations.mjs path/to/locations.json`.
5. Review individual database rows and approve only those supported by the evidence. `paint_colors` and `paint_applications` must both be marked verified; set `paint_colors.verified_at` on approval. Label locations have an independent verification flag.
6. Retest public APIs for exact model/year and code. Check the displayed source URLs and verify that unrelated years do not match.
7. If evidence changes, revert verification to pending or rejected and document the correction.

## Manual review queries (read-only)

```sql
SELECT id,oem_code,name,source_id,verification FROM paint_colors WHERE verification='pending' ORDER BY id;
SELECT id,paint_color_id,vehicle_model_id,year_from,year_to,verification FROM paint_applications WHERE verification='pending' ORDER BY id;
SELECT id,vehicle_model_id,year_from,year_to,location_text,verification FROM label_locations WHERE verification='pending' ORDER BY id;
```

Never approve the placeholder record in `data/import-example.json`. It is deliberately blocked by the database importer.
