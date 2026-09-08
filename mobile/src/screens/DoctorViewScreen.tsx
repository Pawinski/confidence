import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Paths, File } from 'expo-file-system';
import { colors, spacing, fontSize, commonStyles } from '../theme';
import { t, getLocale } from '../i18n';
import { loadRecord } from '../store';
import { PatientRecord, getBloodType, Allergy } from '../types/record';

type RootStackParamList = {
  Home: undefined;
  DoctorView: undefined;
  EditRecord: undefined;
};

type DoctorViewScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'DoctorView'>;
};

function getSourceLabel(source: string | null): string {
  if (source === 'lab') return t('sourceLab');
  if (source === 'booklet') return t('sourceBooklet');
  if (source === 'self') return t('sourceSelf');
  return '';
}

function getSeverityLabel(severity: string): string {
  if (severity === 'mild') return t('sevMild');
  if (severity === 'moderate') return t('sevModerate');
  if (severity === 'severe') return t('sevSevere');
  return severity;
}

function escapeHtml(value: string | null | undefined): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildCardHtml(record: PatientRecord): string {
  const lang = getLocale();
  const bloodType = getBloodType(record) || '—';
  const meta = [getSourceLabel(record.blood_source), record.blood_confirmed_on]
    .filter(Boolean)
    .join(' · ');

  const allergiesHtml =
    record.allergies.length === 0
      ? `<li class="empty">${escapeHtml(t('none'))}</li>`
      : record.allergies
          .map(
            (a) =>
              `<li><strong>${escapeHtml(a.name)}</strong> · ${escapeHtml(getSeverityLabel(a.severity))}${a.detail ? ` — ${escapeHtml(a.detail)}` : ''}</li>`
          )
          .join('');

  const medsHtml =
    record.medications.length === 0
      ? `<li class="empty">${escapeHtml(t('none'))}</li>`
      : record.medications
          .map(
            (m) =>
              `<li><strong>${escapeHtml(m.name)}</strong>${m.dose ? ` · ${escapeHtml(m.dose)}` : ''}${m.schedule ? ` · ${escapeHtml(m.schedule)}` : ''}</li>`
          )
          .join('');

  const condsHtml =
    record.conditions.length === 0
      ? `<li class="empty">${escapeHtml(t('none'))}</li>`
      : record.conditions
          .map(
            (c) =>
              `<li><strong>${escapeHtml(c.name)}</strong>${c.since ? ` · ${escapeHtml(c.since)}` : ''}</li>`
          )
          .join('');

  const emergency =
    [record.emergency_name, record.emergency_phone].filter(Boolean).join(' · ') ||
    t('none');

  const hospitalsHtml =
    record.hospitals.length === 0
      ? `<li class="empty">${escapeHtml(t('none'))}</li>`
      : record.hospitals
          .map(
            (h) =>
              `<li><strong>${escapeHtml(h.name)}</strong>${h.city ? ` · ${escapeHtml(h.city)}` : ''}${h.note ? ` · ${escapeHtml(h.note)}` : ''}</li>`
          )
          .join('');

  const professionalsHtml =
    record.professionals.length === 0
      ? `<li class="empty">${escapeHtml(t('none'))}</li>`
      : record.professionals
          .map(
            (p) =>
              `<li><strong>${escapeHtml(p.name)}</strong>${p.role ? ` · ${escapeHtml(p.role)}` : ''}${p.phone ? ` · ${escapeHtml(p.phone)}` : ''}</li>`
          )
          .join('');

  return `<!DOCTYPE html>
<html lang="${escapeHtml(lang)}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Confidence</title>
<style>
  :root { --bg:#f3efe6; --ink:#1b1814; --muted:#5c564c; --line:#d4cdc0; --card:#fffaf1; --blood:#8f1d1d; --warn:#6b3a1f; }
  * { box-sizing: border-box; }
  html, body { margin:0; background:var(--bg); color:var(--ink); font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
  .sheet { max-width:40rem; margin:0 auto; padding:1.25rem; }
  .kicker { letter-spacing:.14em; text-transform:uppercase; font-size:.8rem; color:var(--muted); }
  .name { font-size:1.6rem; margin:.2rem 0 1rem; font-weight: 500; }
  .eyebrow { color:var(--muted); letter-spacing:.08em; text-transform:uppercase; font-size:.78rem; margin:0; }
  .blood { font-size:clamp(4rem,18vw,6.5rem); line-height:.95; color:var(--blood); margin:.2rem 0; font-weight: 400; }
  .meta, .fine { color:var(--muted); }
  .warn { color:var(--warn); }
  .grid { display:grid; gap:.8rem; margin:1rem 0; }
  @media (min-width:640px) { .grid { grid-template-columns:1fr 1fr; } }
  h2 { font-weight:500; font-size:1.1rem; margin:0 0 .4rem; }
  ul { list-style:none; margin:0; padding:0; }
  li { padding: 0.25rem 0; }
  .empty { color:var(--muted); font-style: italic; }
  @media print {
    @page { size: letter; margin: 12mm; }
    html, body { background: white; }
    .sheet { padding: 0; }
  }
</style>
</head>
<body>
  <article class="sheet">
    <p class="kicker">Confidence</p>
    <p class="name">${escapeHtml(record.display_name)}</p>
    <p class="eyebrow">${escapeHtml(t('bloodType'))}</p>
    <p class="blood">${escapeHtml(bloodType)}</p>
    <p class="meta">${escapeHtml(meta)}</p>
    <p class="warn">${escapeHtml(t('transfusionNote'))}</p>
    <div class="grid">
      <section><h2>${escapeHtml(t('allergies'))}</h2><ul>${allergiesHtml}</ul></section>
      <section><h2>${escapeHtml(t('medications'))}</h2><ul>${medsHtml}</ul></section>
      <section><h2>${escapeHtml(t('conditions'))}</h2><ul>${condsHtml}</ul></section>
      <section><h2>${escapeHtml(t('emergency'))}</h2><p>${escapeHtml(emergency)}</p></section>
      <section><h2>${escapeHtml(t('hospitals'))}</h2><ul>${hospitalsHtml}</ul></section>
      <section><h2>${escapeHtml(t('professionals'))}</h2><ul>${professionalsHtml}</ul></section>
    </div>
    <p class="fine">${escapeHtml(t('cardFooter'))}</p>
  </article>
</body>
</html>`;
}

function ListItem({ primary, secondary }: { primary: string; secondary?: string }) {
  return (
    <View style={styles.listItem}>
      <Text style={styles.listPrimary}>{primary}</Text>
      {secondary && <Text style={styles.listSecondary}> · {secondary}</Text>}
    </View>
  );
}

export function DoctorViewScreen({ navigation }: DoctorViewScreenProps) {
  const [record, setRecord] = useState<PatientRecord | null>(null);

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

  const handlePrint = async () => {
    if (!record) return;
    try {
      const html = buildCardHtml(record);
      await Print.printAsync({ html });
    } catch (error) {
      Alert.alert(t('pdfError'));
    }
  };

  const handleSaveCard = async () => {
    if (!record) return;
    try {
      const html = buildCardHtml(record);
      const slug = record.display_name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      const filename = `confidence-${slug || 'card'}.html`;

      if (Platform.OS === 'web') {
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
        Alert.alert(t('cardSaved'));
        return;
      }

      const file = new File(Paths.cache, filename);
      await file.write(html);

      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(file.uri, {
          mimeType: 'text/html',
          dialogTitle: 'Confidence',
          UTI: 'public.html',
        });
      } else {
        Alert.alert(t('cardSaved'));
      }
    } catch (error) {
      Alert.alert(t('shareError'));
    }
  };

  if (!record) {
    return (
      <View style={[commonStyles.container, styles.loading]}>
        <Text style={commonStyles.bodyText}>Loading...</Text>
      </View>
    );
  }

  const bloodType = getBloodType(record);
  const meta = [getSourceLabel(record.blood_source), record.blood_confirmed_on]
    .filter(Boolean)
    .join(' · ');
  const emergency = [record.emergency_name, record.emergency_phone]
    .filter(Boolean)
    .join(' · ');

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
      >
        <Text style={styles.kicker}>Confidence</Text>
        <Text style={styles.name}>{record.display_name}</Text>

        <Text style={styles.eyebrow}>{t('bloodType')}</Text>
        <Text style={bloodType ? styles.bloodType : styles.bloodTypeEmpty}>
          {bloodType || '—'}
        </Text>
        <Text style={styles.meta}>{meta}</Text>
        <Text style={styles.warn}>{t('transfusionNote')}</Text>

        <View style={styles.grid}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('allergies')}</Text>
            {record.allergies.length === 0 ? (
              <Text style={styles.empty}>{t('none')}</Text>
            ) : (
              record.allergies.map((a, i) => (
                <ListItem
                  key={i}
                  primary={a.name}
                  secondary={`${getSeverityLabel(a.severity)}${a.detail ? ` — ${a.detail}` : ''}`}
                />
              ))
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('medications')}</Text>
            {record.medications.length === 0 ? (
              <Text style={styles.empty}>{t('none')}</Text>
            ) : (
              record.medications.map((m, i) => (
                <ListItem
                  key={i}
                  primary={m.name}
                  secondary={[m.dose, m.schedule].filter(Boolean).join(' · ')}
                />
              ))
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('conditions')}</Text>
            {record.conditions.length === 0 ? (
              <Text style={styles.empty}>{t('none')}</Text>
            ) : (
              record.conditions.map((c, i) => (
                <ListItem key={i} primary={c.name} secondary={c.since} />
              ))
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('emergency')}</Text>
            <Text style={emergency ? styles.bodyText : styles.empty}>
              {emergency || t('none')}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('hospitals')}</Text>
            {record.hospitals.length === 0 ? (
              <Text style={styles.empty}>{t('none')}</Text>
            ) : (
              record.hospitals.map((h, i) => (
                <ListItem
                  key={i}
                  primary={h.name}
                  secondary={[h.city, h.note].filter(Boolean).join(' · ')}
                />
              ))
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('professionals')}</Text>
            {record.professionals.length === 0 ? (
              <Text style={styles.empty}>{t('none')}</Text>
            ) : (
              record.professionals.map((p, i) => (
                <ListItem
                  key={i}
                  primary={p.name}
                  secondary={[p.role, p.phone].filter(Boolean).join(' · ')}
                />
              ))
            )}
          </View>
        </View>

        <Text style={styles.footer}>{t('cardFooter')}</Text>
      </ScrollView>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.primaryButton} onPress={handlePrint}>
          <Text style={styles.primaryButtonText}>{t('printPdf')}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.ghostButton} onPress={handleSaveCard}>
          <Text style={styles.ghostButtonText}>{t('saveCard')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.textButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.textButtonText}>{t('done')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.card,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  loading: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  kicker: {
    fontSize: fontSize.xs,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: colors.muted,
  },
  name: {
    fontSize: fontSize.xl,
    fontWeight: '500',
    color: colors.ink,
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  eyebrow: {
    fontSize: fontSize.xs,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.muted,
  },
  bloodType: {
    fontSize: fontSize.hero,
    fontWeight: '400',
    color: colors.blood,
    lineHeight: fontSize.hero * 1.05,
    marginVertical: spacing.xs,
  },
  bloodTypeEmpty: {
    fontSize: fontSize.hero,
    fontWeight: '400',
    color: colors.muted,
    lineHeight: fontSize.hero * 1.05,
    marginVertical: spacing.xs,
  },
  meta: {
    fontSize: fontSize.sm,
    color: colors.muted,
  },
  warn: {
    fontSize: fontSize.sm,
    color: colors.warn,
    marginTop: spacing.sm,
  },
  grid: {
    marginTop: spacing.lg,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: '500',
    color: colors.ink,
    marginBottom: spacing.sm,
  },
  listItem: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingVertical: spacing.xs,
  },
  listPrimary: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.ink,
  },
  listSecondary: {
    fontSize: fontSize.md,
    color: colors.muted,
  },
  bodyText: {
    fontSize: fontSize.md,
    color: colors.ink,
  },
  empty: {
    fontSize: fontSize.md,
    color: colors.muted,
    fontStyle: 'italic',
  },
  footer: {
    fontSize: fontSize.sm,
    color: colors.muted,
    textAlign: 'center',
    marginTop: spacing.lg,
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
  ghostButton: {
    backgroundColor: colors.ghost,
    paddingVertical: spacing.sm + 4,
    paddingHorizontal: spacing.lg,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.ghostBorder,
    alignItems: 'center',
  },
  ghostButtonText: {
    color: colors.ink,
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
