export type BloodAbo = 'A' | 'B' | 'AB' | 'O' | null;
export type BloodRh = '+' | '-' | null;
export type BloodSource = 'lab' | 'booklet' | 'self' | null;
export type AllergySeverity = 'mild' | 'moderate' | 'severe';

export interface Allergy {
  name: string;
  severity: AllergySeverity;
  detail?: string;
}

export interface Medication {
  name: string;
  dose?: string;
  schedule?: string;
}

export interface Condition {
  name: string;
  since?: string;
}

export interface Hospital {
  name: string;
  city?: string;
  note?: string;
}

export interface Professional {
  name: string;
  role?: string;
  phone?: string;
}

export interface PatientRecord {
  display_name: string;
  preferred_lang: 'fr' | 'en';
  blood_abo: BloodAbo;
  blood_rh: BloodRh;
  blood_source: BloodSource;
  blood_confirmed_on: string | null;
  allergies: Allergy[];
  medications: Medication[];
  conditions: Condition[];
  hospitals: Hospital[];
  professionals: Professional[];
  emergency_name: string | null;
  emergency_phone: string | null;
  updated_at: string | null;
}

export function getBloodType(record: PatientRecord): string | null {
  if (record.blood_abo && record.blood_rh) {
    return `${record.blood_abo}${record.blood_rh}`;
  }
  return null;
}

export const DEFAULT_RECORD: PatientRecord = {
  display_name: 'Alexander Pawinski',
  preferred_lang: 'fr',
  blood_abo: null,
  blood_rh: null,
  blood_source: null,
  blood_confirmed_on: null,
  allergies: [],
  medications: [],
  conditions: [],
  hospitals: [],
  professionals: [],
  emergency_name: null,
  emergency_phone: null,
  updated_at: null,
};

export const SAMPLE_RECORD: PatientRecord = {
  display_name: 'Alexander Pawinski',
  preferred_lang: 'fr',
  blood_abo: 'O',
  blood_rh: '+',
  blood_source: 'lab',
  blood_confirmed_on: '2024-03-15',
  allergies: [
    { name: 'Pénicilline', severity: 'severe', detail: 'Anaphylaxie' },
    { name: 'Arachides', severity: 'moderate' },
  ],
  medications: [
    { name: 'Metformine', dose: '500mg', schedule: '2x/jour' },
    { name: 'Lisinopril', dose: '10mg', schedule: '1x/jour' },
  ],
  conditions: [
    { name: 'Diabète de type 2', since: '2019' },
    { name: 'Hypertension', since: '2020' },
  ],
  hospitals: [
    { name: 'CHUM', city: 'Montréal', note: 'Hôpital principal' },
  ],
  professionals: [
    { name: 'Dr. Marie Tremblay', role: 'Médecin de famille', phone: '514-555-0123' },
  ],
  emergency_name: 'Sophie Pawinski',
  emergency_phone: '514-555-9876',
  updated_at: new Date().toISOString(),
};
