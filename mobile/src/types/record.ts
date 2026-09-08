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
  display_name: 'Exemple Patient',
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
  display_name: 'Exemple Patient',
  preferred_lang: 'fr',
  blood_abo: null,
  blood_rh: null,
  blood_source: 'lab',
  blood_confirmed_on: '2024-03-15',
  allergies: [
    { name: 'AllergieExemple', severity: 'severe', detail: 'DetailExemple' },
    { name: 'AllergieExempleDeux', severity: 'moderate' },
  ],
  medications: [
    { name: 'MedicamentExemple', dose: 'DoseExemple', schedule: '2x/jour' },
    { name: 'MedicamentExempleDeux', dose: 'DoseExempleDeux', schedule: '1x/jour' },
  ],
  conditions: [
    { name: 'ConditionExemple', since: '2019' },
    { name: 'ConditionExempleDeux', since: '2020' },
  ],
  hospitals: [
    { name: 'Hopital Fictif', city: 'Montréal', note: 'Note exemple' },
  ],
  professionals: [
    { name: 'Docteure Exemple', role: 'Médecin de famille', phone: '514-555-0123' },
  ],
  emergency_name: 'Contact Exemple',
  emergency_phone: '514-555-9876',
  updated_at: new Date().toISOString(),
};
