import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, spacing, fontSize, commonStyles } from '../theme';
import { t, getLocale } from '../i18n';
import { loadRecord, saveRecord } from '../store';
import {
  PatientRecord,
  BloodAbo,
  BloodRh,
  BloodSource,
  Allergy,
  Medication,
  Condition,
  Hospital,
  Professional,
} from '../types/record';

type RootStackParamList = {
  Home: undefined;
  DoctorView: undefined;
  EditRecord: undefined;
};

type EditRecordScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'EditRecord'>;
};

function parseLines<T>(
  text: string,
  mapFn: (parts: string[]) => T
): T[] {
  return text
    .split('\n')
    .map((row) => row.trim())
    .filter(Boolean)
    .map((row) => row.split('|').map((part) => part.trim()))
    .map(mapFn);
}

function formatAllergies(items: Allergy[]): string {
  return items
    .map((a) => [a.name, a.severity, a.detail].filter(Boolean).join(' | '))
    .join('\n');
}

function formatMedications(items: Medication[]): string {
  return items
    .map((m) => [m.name, m.dose, m.schedule].filter(Boolean).join(' | '))
    .join('\n');
}

function formatConditions(items: Condition[]): string {
  return items
    .map((c) => [c.name, c.since].filter(Boolean).join(' | '))
    .join('\n');
}

function formatHospitals(items: Hospital[]): string {
  return items
    .map((h) => [h.name, h.city, h.note].filter(Boolean).join(' | '))
    .join('\n');
}

function formatProfessionals(items: Professional[]): string {
  return items
    .map((p) => [p.name, p.role, p.phone].filter(Boolean).join(' | '))
    .join('\n');
}

export function EditRecordScreen({ navigation }: EditRecordScreenProps) {
  const [displayName, setDisplayName] = useState('');
  const [bloodAbo, setBloodAbo] = useState<BloodAbo>(null);
  const [bloodRh, setBloodRh] = useState<BloodRh>(null);
  const [bloodSource, setBloodSource] = useState<BloodSource>(null);
  const [bloodConfirmedOn, setBloodConfirmedOn] = useState('');
  const [allergiesText, setAllergiesText] = useState('');
  const [medicationsText, setMedicationsText] = useState('');
  const [conditionsText, setConditionsText] = useState('');
  const [hospitalsText, setHospitalsText] = useState('');
  const [professionalsText, setProfessionalsText] = useState('');
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    const record = await loadRecord();
    setDisplayName(record.display_name);
    setBloodAbo(record.blood_abo);
    setBloodRh(record.blood_rh);
    setBloodSource(record.blood_source);
    setBloodConfirmedOn(record.blood_confirmed_on || '');
    setAllergiesText(formatAllergies(record.allergies));
    setMedicationsText(formatMedications(record.medications));
    setConditionsText(formatConditions(record.conditions));
    setHospitalsText(formatHospitals(record.hospitals));
    setProfessionalsText(formatProfessionals(record.professionals));
    setEmergencyName(record.emergency_name || '');
    setEmergencyPhone(record.emergency_phone || '');
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSave = async () => {
    if (!displayName.trim()) {
      Alert.alert(t('name'), t('needSource'));
      return;
    }

    const hasAbo = bloodAbo !== null;
    const hasRh = bloodRh !== null;

    if (hasAbo !== hasRh) {
      Alert.alert(t('incompleteBlood'));
      return;
    }

    if (hasAbo && !bloodSource) {
      Alert.alert(t('needSource'));
      return;
    }

    const record: PatientRecord = {
      display_name: displayName.trim(),
      preferred_lang: getLocale(),
      blood_abo: bloodAbo || null,
      blood_rh: bloodRh || null,
      blood_source: bloodSource || null,
      blood_confirmed_on: bloodConfirmedOn || null,
      allergies: parseLines(allergiesText, (parts) => ({
        name: parts[0] || '',
        severity: (parts[1] as Allergy['severity']) || 'moderate',
        detail: parts[2] || '',
      })).filter((a) => a.name),
      medications: parseLines(medicationsText, (parts) => ({
        name: parts[0] || '',
        dose: parts[1] || '',
        schedule: parts[2] || '',
      })).filter((m) => m.name),
      conditions: parseLines(conditionsText, (parts) => ({
        name: parts[0] || '',
        since: parts[1] || '',
      })).filter((c) => c.name),
      hospitals: parseLines(hospitalsText, (parts) => ({
        name: parts[0] || '',
        city: parts[1] || '',
        note: parts[2] || '',
      })).filter((h) => h.name),
      professionals: parseLines(professionalsText, (parts) => ({
        name: parts[0] || '',
        role: parts[1] || '',
        phone: parts[2] || '',
      })).filter((p) => p.name),
      emergency_name: emergencyName.trim() || null,
      emergency_phone: emergencyPhone.trim() || null,
      updated_at: null,
    };

    await saveRecord(record);
    Alert.alert(t('saved'));
    navigation.goBack();
  };

  if (loading) {
    return (
      <View style={[commonStyles.container, styles.loading]}>
        <Text style={commonStyles.bodyText}>Loading...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>{t('editTitle')}</Text>

        <View style={styles.field}>
          <Text style={styles.label}>{t('name')}</Text>
          <TextInput
            style={styles.input}
            value={displayName}
            onChangeText={setDisplayName}
            maxLength={80}
            placeholder={t('name')}
            placeholderTextColor={colors.muted}
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.field, styles.flex1]}>
            <Text style={styles.label}>{t('abo')}</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={bloodAbo || ''}
                onValueChange={(value) => setBloodAbo(value === '' ? null : value as BloodAbo)}
                style={styles.picker}
              >
                <Picker.Item label="—" value="" />
                <Picker.Item label="O" value="O" />
                <Picker.Item label="A" value="A" />
                <Picker.Item label="B" value="B" />
                <Picker.Item label="AB" value="AB" />
              </Picker>
            </View>
          </View>

          <View style={[styles.field, styles.flex1]}>
            <Text style={styles.label}>{t('rh')}</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={bloodRh || ''}
                onValueChange={(value) => setBloodRh(value === '' ? null : value as BloodRh)}
                style={styles.picker}
              >
                <Picker.Item label="—" value="" />
                <Picker.Item label="+" value="+" />
                <Picker.Item label="−" value="-" />
              </Picker>
            </View>
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>{t('source')}</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={bloodSource || ''}
              onValueChange={(value) => setBloodSource(value === '' ? null : value as BloodSource)}
              style={styles.picker}
            >
              <Picker.Item label="—" value="" />
              <Picker.Item label={t('srcLab')} value="lab" />
              <Picker.Item label={t('srcBooklet')} value="booklet" />
              <Picker.Item label={t('srcSelf')} value="self" />
            </Picker>
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>{t('confirmedOn')}</Text>
          <TextInput
            style={styles.input}
            value={bloodConfirmedOn}
            onChangeText={setBloodConfirmedOn}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={colors.muted}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>{t('allergiesEdit')}</Text>
          <TextInput
            style={styles.textArea}
            value={allergiesText}
            onChangeText={setAllergiesText}
            multiline
            numberOfLines={4}
            placeholder={t('allergiesEdit')}
            placeholderTextColor={colors.muted}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>{t('medsEdit')}</Text>
          <TextInput
            style={styles.textArea}
            value={medicationsText}
            onChangeText={setMedicationsText}
            multiline
            numberOfLines={4}
            placeholder={t('medsEdit')}
            placeholderTextColor={colors.muted}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>{t('condsEdit')}</Text>
          <TextInput
            style={styles.textArea}
            value={conditionsText}
            onChangeText={setConditionsText}
            multiline
            numberOfLines={3}
            placeholder={t('condsEdit')}
            placeholderTextColor={colors.muted}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>{t('hospitalsEdit')}</Text>
          <TextInput
            style={styles.textArea}
            value={hospitalsText}
            onChangeText={setHospitalsText}
            multiline
            numberOfLines={3}
            placeholder={t('hospitalsEdit')}
            placeholderTextColor={colors.muted}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>{t('professionalsEdit')}</Text>
          <TextInput
            style={styles.textArea}
            value={professionalsText}
            onChangeText={setProfessionalsText}
            multiline
            numberOfLines={3}
            placeholder={t('professionalsEdit')}
            placeholderTextColor={colors.muted}
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.field, styles.flex1]}>
            <Text style={styles.label}>{t('emergencyName')}</Text>
            <TextInput
              style={styles.input}
              value={emergencyName}
              onChangeText={setEmergencyName}
              maxLength={80}
              placeholder={t('emergencyName')}
              placeholderTextColor={colors.muted}
            />
          </View>

          <View style={[styles.field, styles.flex1]}>
            <Text style={styles.label}>{t('emergencyPhone')}</Text>
            <TextInput
              style={styles.input}
              value={emergencyPhone}
              onChangeText={setEmergencyPhone}
              maxLength={32}
              placeholder={t('emergencyPhone')}
              placeholderTextColor={colors.muted}
              keyboardType="phone-pad"
            />
          </View>
        </View>
      </ScrollView>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.primaryButton} onPress={handleSave}>
          <Text style={styles.primaryButtonText}>{t('save')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.textButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.textButtonText}>{t('cancel')}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  loading: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: '600',
    color: colors.ink,
    marginBottom: spacing.lg,
  },
  field: {
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  flex1: {
    flex: 1,
  },
  label: {
    fontSize: fontSize.sm,
    color: colors.muted,
    marginBottom: spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    fontSize: fontSize.md,
    backgroundColor: colors.white,
    color: colors.ink,
  },
  textArea: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    fontSize: fontSize.md,
    backgroundColor: colors.white,
    color: colors.ink,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 8,
    backgroundColor: colors.white,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    color: colors.ink,
  },
  actions: {
    backgroundColor: colors.bg,
    padding: spacing.md,
    gap: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm + 4,
    paddingHorizontal: spacing.lg,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: colors.primaryText,
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  textButton: {
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  textButtonText: {
    color: colors.ink,
    fontSize: fontSize.md,
  },
});
