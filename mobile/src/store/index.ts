import AsyncStorage from '@react-native-async-storage/async-storage';
import { PatientRecord, DEFAULT_RECORD, SAMPLE_RECORD } from '../types/record';

const RECORD_KEY = 'confidence.record.v1';
const LOCALE_KEY = 'confidence.locale';
const USE_SAMPLE_DATA_KEY = 'confidence.useSampleData';

function normalizeRecord(raw: Partial<PatientRecord> | null): PatientRecord {
  const r = { ...DEFAULT_RECORD, ...(raw || {}) };
  r.allergies = Array.isArray(r.allergies) ? r.allergies : [];
  r.medications = Array.isArray(r.medications) ? r.medications : [];
  r.conditions = Array.isArray(r.conditions) ? r.conditions : [];
  r.hospitals = Array.isArray(r.hospitals) ? r.hospitals : [];
  r.professionals = Array.isArray(r.professionals) ? r.professionals : [];
  return r;
}

export async function loadRecord(): Promise<PatientRecord> {
  try {
    const useSample = await AsyncStorage.getItem(USE_SAMPLE_DATA_KEY);
    if (useSample === null) {
      await AsyncStorage.setItem(USE_SAMPLE_DATA_KEY, 'true');
      await AsyncStorage.setItem(RECORD_KEY, JSON.stringify(SAMPLE_RECORD));
      return SAMPLE_RECORD;
    }

    const raw = await AsyncStorage.getItem(RECORD_KEY);
    if (raw) {
      return normalizeRecord(JSON.parse(raw));
    }
    return normalizeRecord(null);
  } catch {
    return normalizeRecord(null);
  }
}

export async function saveRecord(record: PatientRecord): Promise<PatientRecord> {
  const next = normalizeRecord(record);
  next.updated_at = new Date().toISOString();
  await AsyncStorage.setItem(RECORD_KEY, JSON.stringify(next));
  return next;
}

export async function loadLocale(): Promise<'fr' | 'en' | null> {
  try {
    const locale = await AsyncStorage.getItem(LOCALE_KEY);
    if (locale === 'fr' || locale === 'en') {
      return locale;
    }
    return null;
  } catch {
    return null;
  }
}

export async function saveLocale(locale: 'fr' | 'en'): Promise<void> {
  await AsyncStorage.setItem(LOCALE_KEY, locale);
}

export async function clearAllData(): Promise<void> {
  await AsyncStorage.multiRemove([RECORD_KEY, LOCALE_KEY, USE_SAMPLE_DATA_KEY]);
}
