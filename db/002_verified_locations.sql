CREATE OR REPLACE VIEW public_paint_applications AS
SELECT pc.id AS paint_color_id, m.name AS manufacturer, vm.name AS model,
       pc.oem_code, pc.name AS color_name, pa.year_from, pa.year_to,
       s.url AS source_url
FROM paint_applications pa
JOIN paint_colors pc ON pc.id = pa.paint_color_id
JOIN vehicle_models vm ON vm.id = pa.vehicle_model_id
JOIN manufacturers m ON m.id = vm.manufacturer_id
JOIN sources s ON s.id = pa.source_id
WHERE pc.verification = 'verified' AND pa.verification = 'verified';

CREATE OR REPLACE VIEW public_label_locations AS
SELECT m.name AS manufacturer, vm.name AS model, ll.year_from, ll.year_to,
       ll.location_text, ll.code_field_hint, s.url AS source_url
FROM label_locations ll
JOIN vehicle_models vm ON vm.id = ll.vehicle_model_id
JOIN manufacturers m ON m.id = vm.manufacturer_id
JOIN sources s ON s.id = ll.source_id
WHERE ll.verification = 'verified';
