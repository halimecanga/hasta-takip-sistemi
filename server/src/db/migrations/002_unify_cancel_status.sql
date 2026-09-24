UPDATE examinations
SET status = 'İptal'
WHERE status = 'İptal Edildi';

ALTER TABLE examinations DROP CONSTRAINT IF EXISTS examinations_status_check;
ALTER TABLE examinations
  ADD CONSTRAINT examinations_status_check
  CHECK (status IN ('Taslak', 'Bekliyor', 'Takipte', 'Tamamlandı', 'İptal'));

UPDATE prescriptions
SET status = 'İptal'
WHERE status = 'İptal Edildi';

ALTER TABLE prescriptions DROP CONSTRAINT IF EXISTS prescriptions_status_check;
ALTER TABLE prescriptions
  ADD CONSTRAINT prescriptions_status_check
  CHECK (status IN ('Taslak', 'Aktif', 'Pasif', 'İptal', 'Tamamlandı', 'Süresi Doldu'));
