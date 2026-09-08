import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, fontSize, commonStyles } from '../theme';
import { t } from '../i18n';
import { PatientRecord, getBloodType } from '../types/record';

interface BloodCardProps {
  record: PatientRecord;
  onShowDoctor: () => void;
  onEdit: () => void;
}

function getSourceLabel(source: string | null): string {
  if (source === 'lab') return t('sourceLab');
  if (source === 'booklet') return t('sourceBooklet');
  if (source === 'self') return t('sourceSelf');
  return '';
}

function getMetaText(record: PatientRecord): string {
  const bits: string[] = [];
  if (record.blood_source) {
    bits.push(getSourceLabel(record.blood_source));
  }
  if (record.blood_confirmed_on) {
    bits.push(record.blood_confirmed_on);
  }
  return bits.join(' · ');
}

export function BloodCard({ record, onShowDoctor, onEdit }: BloodCardProps) {
  const bloodType = getBloodType(record);

  return (
    <View style={styles.container}>
      <Text style={commonStyles.eyebrow}>{t('bloodType')}</Text>
      <Text style={bloodType ? styles.bloodType : styles.bloodTypeEmpty}>
        {bloodType || '—'}
      </Text>
      <Text style={styles.meta}>
        {bloodType ? getMetaText(record) : t('addBloodHint')}
      </Text>
      <Text style={commonStyles.warnText}>{t('transfusionNote')}</Text>

      <View style={styles.actions}>
        <TouchableOpacity
          style={commonStyles.primaryButton}
          onPress={onShowDoctor}
        >
          <Text style={commonStyles.primaryButtonText}>{t('showDoctor')}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={commonStyles.ghostButton} onPress={onEdit}>
          <Text style={commonStyles.ghostButtonText}>{t('edit')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  bloodType: {
    fontSize: fontSize.hero,
    fontWeight: '400',
    color: colors.blood,
    lineHeight: fontSize.hero * 1.05,
    marginVertical: spacing.sm,
  },
  bloodTypeEmpty: {
    fontSize: fontSize.hero,
    fontWeight: '400',
    color: colors.muted,
    lineHeight: fontSize.hero * 1.05,
    marginVertical: spacing.sm,
  },
  meta: {
    fontSize: fontSize.sm,
    color: colors.muted,
    marginBottom: spacing.xs,
  },
  actions: {
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
});
