-- Apply after db/schema.sql. Publicly expose only reviewed location guidance.
CREATE OR REPLACE VIEW public_label_locations AS
SELECT m.name AS manufacturer, vm.name AS model, ll.year_from, ll.year_to,
       ll.location_text, ll.code_field_hint, s.url AS source_url
FROM label_locations ll
JOIN vehicle_models vm ON vm.id = ll.vehicle_model_id
JOIN manufacturers m ON m.id = vm.manufacturer_id
JOIN sources s ON s.id = ll.source_id
WHERE ll.verification = 'verified';
