CREATE TABLE IF NOT EXISTS schema_migrations (
  id SERIAL PRIMARY KEY,
  filename VARCHAR(255) NOT NULL UNIQUE,
  applied_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE examinations
  ADD COLUMN IF NOT EXISTS doctor_id BIGINT,
  ADD COLUMN IF NOT EXISTS appointment_id BIGINT,
  ADD COLUMN IF NOT EXISTS cancellation_reason TEXT;

ALTER TABLE examinations DROP CONSTRAINT IF EXISTS examinations_status_check;
ALTER TABLE examinations
  ADD CONSTRAINT examinations_status_check
  CHECK (status IN ('Taslak', 'Bekliyor', 'Takipte', 'Tamamlandı', 'İptal Edildi'));

ALTER TABLE prescriptions
  ADD COLUMN IF NOT EXISTS diagnosis TEXT,
  ADD COLUMN IF NOT EXISTS complaint TEXT,
  ADD COLUMN IF NOT EXISTS treatment_goal TEXT,
  ADD COLUMN IF NOT EXISTS doctor_note TEXT,
  ADD COLUMN IF NOT EXISTS general_warning TEXT,
  ADD COLUMN IF NOT EXISTS control_date DATE,
  ADD COLUMN IF NOT EXISTS cancellation_reason TEXT,
  ADD COLUMN IF NOT EXISTS doctor_id BIGINT;

ALTER TABLE prescriptions DROP CONSTRAINT IF EXISTS prescriptions_status_check;
ALTER TABLE prescriptions
  ADD CONSTRAINT prescriptions_status_check
  CHECK (status IN ('Taslak', 'Aktif', 'Pasif', 'İptal', 'Tamamlandı', 'Süresi Doldu', 'İptal Edildi'));

ALTER TABLE prescription_medicines
  ADD COLUMN IF NOT EXISTS active_ingredient VARCHAR(200),
  ADD COLUMN IF NOT EXISTS form VARCHAR(100),
  ADD COLUMN IF NOT EXISTS time_label VARCHAR(100),
  ADD COLUMN IF NOT EXISTS quantity VARCHAR(100),
  ADD COLUMN IF NOT EXISTS schedule TEXT[],
  ADD COLUMN IF NOT EXISTS instruction TEXT,
  ADD COLUMN IF NOT EXISTS storage TEXT,
  ADD COLUMN IF NOT EXISTS missed_dose TEXT;

CREATE TABLE IF NOT EXISTS examination_payments (
  id BIGSERIAL PRIMARY KEY,
  examination_id BIGINT NOT NULL UNIQUE REFERENCES examinations(id) ON DELETE CASCADE,
  service_name VARCHAR(200) NOT NULL,
  total_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
  discount_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
  payable_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
  paid_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
  remaining_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
  payment_status VARCHAR(40) NOT NULL,
  payment_method VARCHAR(40) NOT NULL,
  receipt_no VARCHAR(80),
  payment_note TEXT,
  card_last_four VARCHAR(4),
  transaction_date DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT examination_payments_status_check
    CHECK (payment_status IN ('Ödendi', 'Kısmi Ödeme', 'Ödeme Bekliyor')),
  CONSTRAINT examination_payments_method_check
    CHECK (payment_method IN ('Nakit', 'Kredi Kartı', 'Banka Kartı', 'Havale / EFT', 'Henüz Ödenmedi')),
  CONSTRAINT examination_payments_amounts_check
    CHECK (
      total_amount >= 0
      AND discount_amount >= 0
      AND payable_amount >= 0
      AND paid_amount >= 0
      AND remaining_amount >= 0
      AND paid_amount <= payable_amount
    )
);

CREATE TABLE IF NOT EXISTS payment_movements (
  id BIGSERIAL PRIMARY KEY,
  payment_id BIGINT NOT NULL REFERENCES examination_payments(id) ON DELETE CASCADE,
  movement_date DATE NOT NULL,
  amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
  method VARCHAR(40) NOT NULL,
  status VARCHAR(40) NOT NULL DEFAULT 'Başarılı',
  receipt_no VARCHAR(80),
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS staff (
  id BIGSERIAL PRIMARY KEY,
  staff_no VARCHAR(30) NOT NULL UNIQUE,
  full_name VARCHAR(150) NOT NULL,
  initials VARCHAR(10) NOT NULL,
  role VARCHAR(80) NOT NULL,
  role_type VARCHAR(40) NOT NULL,
  department VARCHAR(120) NOT NULL,
  status VARCHAR(40) NOT NULL DEFAULT 'Aktif',
  phone VARCHAR(40) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  birth_date VARCHAR(80),
  hire_date VARCHAR(80),
  work_type VARCHAR(40) NOT NULL DEFAULT 'Tam Zamanlı',
  work_days VARCHAR(120) NOT NULL DEFAULT 'Pazartesi - Cuma',
  work_start TIME NOT NULL DEFAULT '09:00',
  work_end TIME NOT NULL DEFAULT '18:00',
  address TEXT,
  emergency_name VARCHAR(150),
  emergency_phone VARCHAR(40),
  note TEXT,
  role_title VARCHAR(120),
  role_items JSONB NOT NULL DEFAULT '[]'::jsonb,
  leave_annual INTEGER NOT NULL DEFAULT 20,
  leave_used INTEGER NOT NULL DEFAULT 0,
  leave_remaining INTEGER NOT NULL DEFAULT 20,
  leave_report INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT staff_status_check
    CHECK (status IN ('Aktif', 'Pasif', 'İzinli', 'Raporlu', 'İşten Ayrıldı')),
  CONSTRAINT staff_role_type_check
    CHECK (role_type IN ('doctor', 'nurse', 'secretary', 'advisor', 'accounting', 'support'))
);

CREATE UNIQUE INDEX IF NOT EXISTS staff_single_doctor_idx
  ON staff (role_type)
  WHERE role_type = 'doctor' AND status <> 'İşten Ayrıldı';

CREATE TABLE IF NOT EXISTS staff_schedules (
  id BIGSERIAL PRIMARY KEY,
  staff_id BIGINT NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
  day_name VARCHAR(20) NOT NULL,
  shift VARCHAR(40) NOT NULL,
  location VARCHAR(120) NOT NULL DEFAULT 'Ana Klinik',
  status VARCHAR(40) NOT NULL DEFAULT 'Planlandı',
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS staff_leaves (
  id BIGSERIAL PRIMARY KEY,
  staff_id BIGINT NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
  leave_no VARCHAR(40) NOT NULL UNIQUE,
  leave_type VARCHAR(80) NOT NULL,
  range_label VARCHAR(120) NOT NULL,
  days_label VARCHAR(40) NOT NULL,
  status VARCHAR(40) NOT NULL DEFAULT 'Onaylandı',
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS staff_activities (
  id BIGSERIAL PRIMARY KEY,
  staff_id BIGINT NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
  activity_no VARCHAR(40) NOT NULL UNIQUE,
  activity_date VARCHAR(40) NOT NULL,
  activity_time VARCHAR(40) NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS price_list (
  id BIGSERIAL PRIMARY KEY,
  price_no VARCHAR(40) NOT NULL UNIQUE,
  name VARCHAR(200) NOT NULL,
  category VARCHAR(80) NOT NULL,
  price NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
  description TEXT NOT NULL,
  status VARCHAR(40) NOT NULL DEFAULT 'Aktif',
  vat_rate NUMERIC(5, 2) NOT NULL DEFAULT 20,
  vat_included BOOLEAN NOT NULL DEFAULT TRUE,
  discount_allowed BOOLEAN NOT NULL DEFAULT TRUE,
  minimum_price NUMERIC(12, 2) NOT NULL DEFAULT 0,
  duration INTEGER NOT NULL DEFAULT 30,
  usage_area VARCHAR(200),
  patient_visible BOOLEAN NOT NULL DEFAULT TRUE,
  included_in_invoice BOOLEAN NOT NULL DEFAULT TRUE,
  usage_count INTEGER NOT NULL DEFAULT 0,
  internal_note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT price_list_status_check
    CHECK (status IN ('Aktif', 'Pasif', 'Arşivlendi'))
);

CREATE TABLE IF NOT EXISTS appointments (
  id BIGSERIAL PRIMARY KEY,
  appointment_no VARCHAR(40) NOT NULL UNIQUE,
  patient_id BIGINT NOT NULL REFERENCES patients(id) ON DELETE RESTRICT,
  doctor_id BIGINT REFERENCES staff(id) ON DELETE SET NULL,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 30,
  appointment_type VARCHAR(100) NOT NULL,
  status VARCHAR(40) NOT NULL DEFAULT 'Bekliyor',
  priority VARCHAR(40) NOT NULL DEFAULT 'Normal',
  reason TEXT NOT NULL,
  complaint TEXT,
  is_control BOOLEAN NOT NULL DEFAULT FALSE,
  previous_visit_id VARCHAR(40),
  doctor_note TEXT,
  reminder_method VARCHAR(40) NOT NULL DEFAULT 'SMS',
  reminder_time VARCHAR(40) NOT NULL DEFAULT '1 gün önce',
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT appointments_status_check
    CHECK (status IN ('Bekliyor', 'Onaylandı', 'Tamamlandı', 'İptal Edildi')),
  CONSTRAINT appointments_priority_check
    CHECK (priority IN ('Normal', 'Öncelikli', 'Acil'))
);

CREATE TABLE IF NOT EXISTS appointment_status_history (
  id BIGSERIAL PRIMARY KEY,
  appointment_id BIGINT NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
  old_status VARCHAR(40),
  new_status VARCHAR(40) NOT NULL,
  changed_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  note TEXT
);

CREATE TABLE IF NOT EXISTS medical_tests (
  id BIGSERIAL PRIMARY KEY,
  test_no VARCHAR(40) NOT NULL UNIQUE,
  patient_id BIGINT NOT NULL REFERENCES patients(id) ON DELETE RESTRICT,
  examination_id BIGINT REFERENCES examinations(id) ON DELETE SET NULL,
  doctor_id BIGINT REFERENCES staff(id) ON DELETE SET NULL,
  test_type VARCHAR(150) NOT NULL,
  category VARCHAR(80) NOT NULL,
  request_reason TEXT,
  doctor_name VARCHAR(150) NOT NULL DEFAULT 'Dr. Cumhur Kesemenli',
  test_date DATE NOT NULL,
  sample_at TIMESTAMPTZ,
  result_at TIMESTAMPTZ,
  status VARCHAR(40) NOT NULL DEFAULT 'Bekliyor',
  sample_type VARCHAR(120),
  unit VARCHAR(120),
  summary TEXT,
  clinical_suggestion TEXT,
  control_date DATE,
  patient_informed BOOLEAN NOT NULL DEFAULT FALSE,
  cancellation_reason TEXT,
  evaluation JSONB,
  metrics JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT medical_tests_status_check
    CHECK (status IN ('Bekliyor', 'İnceleniyor', 'Hazır', 'İptal Edildi'))
);

CREATE TABLE IF NOT EXISTS laboratory_results (
  id BIGSERIAL PRIMARY KEY,
  test_id BIGINT NOT NULL REFERENCES medical_tests(id) ON DELETE CASCADE,
  parameter_name VARCHAR(150) NOT NULL,
  result_value VARCHAR(80) NOT NULL,
  unit VARCHAR(40),
  reference_range VARCHAR(80),
  status VARCHAR(40) NOT NULL DEFAULT 'Normal',
  is_abnormal BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS imaging_findings (
  id BIGSERIAL PRIMARY KEY,
  test_id BIGINT NOT NULL REFERENCES medical_tests(id) ON DELETE CASCADE,
  label VARCHAR(150) NOT NULL,
  value TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS test_history (
  id BIGSERIAL PRIMARY KEY,
  test_id BIGINT NOT NULL REFERENCES medical_tests(id) ON DELETE CASCADE,
  history_date VARCHAR(40) NOT NULL,
  history_time VARCHAR(20) NOT NULL,
  action VARCHAR(150) NOT NULL,
  description TEXT,
  actor VARCHAR(150),
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS documents (
  id BIGSERIAL PRIMARY KEY,
  document_no VARCHAR(40) NOT NULL UNIQUE,
  owner_type VARCHAR(40) NOT NULL,
  owner_id BIGINT NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  stored_name VARCHAR(255) NOT NULL,
  mime_type VARCHAR(80) NOT NULL,
  file_ext VARCHAR(10) NOT NULL,
  size_bytes BIGINT NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  document_type VARCHAR(80),
  status VARCHAR(40) NOT NULL DEFAULT 'Geçerli',
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT documents_owner_type_check
    CHECK (owner_type IN ('examination', 'test', 'staff', 'prescription')),
  CONSTRAINT documents_mime_check
    CHECK (mime_type IN ('application/pdf', 'image/jpeg', 'image/png'))
);

CREATE TABLE IF NOT EXISTS activity_logs (
  id BIGSERIAL PRIMARY KEY,
  log_no VARCHAR(40) NOT NULL UNIQUE,
  staff_id BIGINT REFERENCES staff(id) ON DELETE SET NULL,
  actor_name VARCHAR(150) NOT NULL,
  actor_role VARCHAR(80),
  action VARCHAR(200) NOT NULL,
  page VARCHAR(80) NOT NULL,
  module VARCHAR(80) NOT NULL,
  target_type VARCHAR(80),
  target_id VARCHAR(80),
  target_name VARCHAR(200),
  target_route VARCHAR(200),
  status VARCHAR(40) NOT NULL DEFAULT 'Başarılı',
  severity VARCHAR(40) NOT NULL DEFAULT 'Bilgi',
  description TEXT,
  before_summary JSONB,
  after_summary JSONB,
  ip_address VARCHAR(80),
  device VARCHAR(120),
  event_code VARCHAR(80),
  request_id VARCHAR(80),
  session_id VARCHAR(80),
  duration VARCHAR(40),
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS clinic_settings (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  clinic_name VARCHAR(200) NOT NULL,
  phone VARCHAR(40),
  email VARCHAR(150),
  tax_number VARCHAR(40),
  address TEXT,
  appointment_reminders BOOLEAN NOT NULL DEFAULT TRUE,
  test_notifications BOOLEAN NOT NULL DEFAULT TRUE,
  daily_summary_email BOOLEAN NOT NULL DEFAULT FALSE,
  theme VARCHAR(20) NOT NULL DEFAULT 'light',
  report_access BOOLEAN NOT NULL DEFAULT TRUE,
  staff_price_edit BOOLEAN NOT NULL DEFAULT FALSE,
  log_view BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_profiles (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  staff_id BIGINT REFERENCES staff(id) ON DELETE SET NULL,
  full_name VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL,
  phone VARCHAR(40),
  role VARCHAR(80) NOT NULL,
  specialty VARCHAR(80),
  diploma_no VARCHAR(80),
  password_salt VARCHAR(64) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS support_tickets (
  id BIGSERIAL PRIMARY KEY,
  ticket_no VARCHAR(40) NOT NULL UNIQUE,
  subject VARCHAR(200) NOT NULL,
  category VARCHAR(80) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(40) NOT NULL DEFAULT 'Açık',
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE SEQUENCE IF NOT EXISTS appointment_no_seq START 1;
CREATE SEQUENCE IF NOT EXISTS staff_no_seq START 1;
CREATE SEQUENCE IF NOT EXISTS price_no_seq START 1;
CREATE SEQUENCE IF NOT EXISTS test_no_seq START 1;
CREATE SEQUENCE IF NOT EXISTS document_no_seq START 1;
CREATE SEQUENCE IF NOT EXISTS activity_log_no_seq START 1;
CREATE SEQUENCE IF NOT EXISTS support_ticket_no_seq START 1;

CREATE INDEX IF NOT EXISTS appointments_date_idx ON appointments (appointment_date DESC);
CREATE INDEX IF NOT EXISTS appointments_patient_idx ON appointments (patient_id);
CREATE INDEX IF NOT EXISTS appointments_doctor_idx ON appointments (doctor_id);
CREATE INDEX IF NOT EXISTS appointments_status_idx ON appointments (status);
CREATE INDEX IF NOT EXISTS medical_tests_date_idx ON medical_tests (test_date DESC);
CREATE INDEX IF NOT EXISTS medical_tests_patient_idx ON medical_tests (patient_id);
CREATE INDEX IF NOT EXISTS activity_logs_created_idx ON activity_logs (created_at DESC);
CREATE INDEX IF NOT EXISTS examination_payments_status_idx ON examination_payments (payment_status);
CREATE INDEX IF NOT EXISTS documents_owner_idx ON documents (owner_type, owner_id);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'examinations_doctor_id_fkey'
  ) THEN
    ALTER TABLE examinations
      ADD CONSTRAINT examinations_doctor_id_fkey
      FOREIGN KEY (doctor_id) REFERENCES staff(id) ON DELETE SET NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'examinations_appointment_id_fkey'
  ) THEN
    ALTER TABLE examinations
      ADD CONSTRAINT examinations_appointment_id_fkey
      FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE SET NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'prescriptions_doctor_id_fkey'
  ) THEN
    ALTER TABLE prescriptions
      ADD CONSTRAINT prescriptions_doctor_id_fkey
      FOREIGN KEY (doctor_id) REFERENCES staff(id) ON DELETE SET NULL;
  END IF;
END $$;
