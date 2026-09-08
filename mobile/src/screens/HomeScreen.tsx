import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, spacing, fontSize, commonStyles } from '../theme';
import { t } from '../i18n';
import { loadRecord } from '../store';
import { PatientRecord, Allergy } from '../types/record';
import { BloodCard, ListSection } from '../components';

type RootStackParamList = {
  Home: undefined;
  DoctorView: undefined;
  EditRecord: undefined;
};

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

function getSeverityLabel(severity: string): string {
  if (severity === 'mild') return t('sevMild');
  if (severity === 'moderate') return t('sevModerate');
  if (severity === 'severe') return t('sevSevere');
  return severity;
}

function formatAllergy(item: Allergy): { primary: string; secondary: string } {
  const parts = [getSeverityLabel(item.severity)];
  if (item.detail) parts.push(item.detail);
  return { primary: item.name, secondary: parts.join(' — ') };
}

export function HomeScreen({ navigation }: HomeScreenProps) {
  const [record, setRecord] = useState<PatientRecord | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    const data = await loadRecord();
    setRecord(data);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  if (!record) {
    return (
      <View style={[commonStyles.container, styles.loading]}>
        <Text style={commonStyles.bodyText}>Loading...</Text>
      </View>
    );
  }

  const emergency = [record.emergency_name, record.emergency_phone]
    .filter(Boolean)
    .join(' · ');

  return (
    <ScrollView
      style={commonStyles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <BloodCard
        record={record}
        onShowDoctor={() => navigation.navigate('DoctorView')}
        onEdit={() => navigation.navigate('EditRecord')}
      />

      <View style={styles.grid}>
        <ListSection
          title={t('allergies')}
          items={record.allergies.map(formatAllergy)}
        />

        <ListSection
          title={t('medications')}
          items={record.medications.map((m) => ({
            primary: m.name,
            secondary: [m.dose, m.schedule].filter(Boolean).join(' · '),
          }))}
        />

        <ListSection
          title={t('conditions')}
          items={record.conditions.map((c) => ({
            primary: c.name,
            secondary: c.since,
          }))}
        />

        <ListSection
          title={t('emergency')}
          items={emergency ? [{ primary: emergency }] : []}
        />

        <ListSection
          title={t('hospitals')}
          items={record.hospitals.map((h) => ({
            primary: h.name,
            secondary: [h.city, h.note].filter(Boolean).join(' · '),
          }))}
        />

        <ListSection
          title={t('professionals')}
          items={record.professionals.map((p) => ({
            primary: p.name,
            secondary: [p.role, p.phone].filter(Boolean).join(' · '),
          }))}
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.holder}>
          {record.display_name} · {t('youHold')}
        </Text>
        <Text style={styles.fine}>{t('deviceNote')}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.md,
    paddingBottom: spacing.xl * 2,
  },
  loading: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  grid: {
    marginTop: spacing.sm,
  },
  footer: {
    marginTop: spacing.lg,
    alignItems: 'center',
  },
  holder: {
    fontSize: fontSize.sm,
    color: colors.ink,
    textAlign: 'center',
  },
  fine: {
    fontSize: fontSize.xs,
    color: colors.muted,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
});
