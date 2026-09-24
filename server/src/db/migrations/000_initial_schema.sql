CREATE SEQUENCE IF NOT EXISTS examination_no_seq START 1002;
CREATE SEQUENCE IF NOT EXISTS prescription_no_seq START 1001;

CREATE TABLE IF NOT EXISTS patients (
  id BIGSERIAL PRIMARY KEY,
  patient_no VARCHAR(20) NOT NULL UNIQUE,
  full_name VARCHAR(100) NOT NULL,
  identity_number VARCHAR(11) NOT NULL UNIQUE,
  birth_date DATE NOT NULL,
  gender VARCHAR(10) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(150) UNIQUE,
  blood_type VARCHAR(10),
  allergy TEXT,
  chronic_disease TEXT,
  regular_medicine TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'Aktif',
  previous_status VARCHAR(20),
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT patients_gender_check
    CHECK (gender IN ('Kadın', 'Erkek', 'Diğer')),
  CONSTRAINT patients_status_check
    CHECK (status IN ('Aktif', 'Pasif', 'Arşivlendi')),
  CONSTRAINT patients_previous_status_check
    CHECK (previous_status IS NULL OR previous_status IN ('Aktif', 'Pasif'))
);

CREATE TABLE IF NOT EXISTS examinations (
  id BIGSERIAL PRIMARY KEY,
  examination_no VARCHAR(30) NOT NULL UNIQUE DEFAULT (
    'DOS-' || to_char(CURRENT_DATE, 'YYYY') || '-' ||
    lpad(nextval('examination_no_seq')::text, 4, '0')
  ),
  patient_id BIGINT NOT NULL REFERENCES patients(id) ON DELETE RESTRICT,
  examination_date DATE NOT NULL,
  examination_time TIME NOT NULL,
  examination_type VARCHAR(100) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'Taslak',
  doctor_name VARCHAR(100) NOT NULL DEFAULT 'Dr. Cumhur Kesemenli',
  complaint TEXT NOT NULL,
  complaint_start_date TEXT,
  medical_history TEXT,
  past_diseases TEXT,
  medicines_used TEXT,
  known_allergies TEXT,
  blood_pressure VARCHAR(20),
  pulse VARCHAR(20),
  fever VARCHAR(20),
  height VARCHAR(20),
  weight VARCHAR(20),
  oxygen VARCHAR(20),
  findings TEXT NOT NULL,
  preliminary_diagnosis TEXT,
  diagnosis TEXT,
  performed_procedure TEXT,
  treatment_plan TEXT,
  doctor_note TEXT,
  needs_control BOOLEAN NOT NULL DEFAULT FALSE,
  control_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT examinations_status_check
    CHECK (status IN ('Taslak', 'Bekliyor', 'Takipte', 'Tamamlandı'))
);

CREATE INDEX IF NOT EXISTS examinations_date_index
  ON examinations (examination_date DESC);
CREATE INDEX IF NOT EXISTS examinations_patient_id_index
  ON examinations (patient_id);

CREATE TABLE IF NOT EXISTS examination_notes (
  id BIGSERIAL PRIMARY KEY,
  examination_id BIGINT NOT NULL REFERENCES examinations(id) ON DELETE CASCADE,
  title VARCHAR(150) NOT NULL,
  content TEXT,
  note_date DATE NOT NULL,
  note_time TIME,
  author_name VARCHAR(100) NOT NULL DEFAULT 'Dr. Cumhur Kesemenli',
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS examination_notes_examination_id_index
  ON examination_notes (examination_id);

CREATE TABLE IF NOT EXISTS prescriptions (
  id BIGSERIAL PRIMARY KEY,
  prescription_no VARCHAR(30) NOT NULL UNIQUE DEFAULT (
    'REC-' || to_char(CURRENT_DATE, 'YYYY') || '-' ||
    lpad(nextval('prescription_no_seq')::text, 4, '0')
  ),
  examination_id BIGINT NOT NULL UNIQUE REFERENCES examinations(id) ON DELETE CASCADE,
  prescription_date DATE NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'Aktif',
  doctor_name VARCHAR(100) NOT NULL DEFAULT 'Dr. Cumhur Kesemenli',
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT prescriptions_status_check
    CHECK (status IN ('Taslak', 'Aktif', 'Pasif', 'İptal'))
);

CREATE TABLE IF NOT EXISTS prescription_medicines (
  id BIGSERIAL PRIMARY KEY,
  prescription_id BIGINT NOT NULL REFERENCES prescriptions(id) ON DELETE CASCADE,
  medicine_name VARCHAR(200) NOT NULL,
  dose VARCHAR(100),
  frequency VARCHAR(150),
  duration VARCHAR(100),
  note TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS prescription_medicines_prescription_id_index
  ON prescription_medicines (prescription_id);
