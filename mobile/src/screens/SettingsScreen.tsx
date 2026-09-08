import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { colors, spacing, fontSize, commonStyles } from '../theme';
import { t, getLocale, setLocale } from '../i18n';
import { loadLocale, saveLocale } from '../store';

interface SettingsScreenProps {
  onLocaleChange: () => void;
}

export function SettingsScreen({ onLocaleChange }: SettingsScreenProps) {
  const [currentLocale, setCurrentLocale] = useState<'fr' | 'en'>(getLocale());

  useEffect(() => {
    loadLocale().then((saved) => {
      if (saved) {
        setCurrentLocale(saved);
      }
    });
  }, []);

  const handleLocaleChange = async (locale: 'fr' | 'en') => {
    setLocale(locale);
    setCurrentLocale(locale);
    await saveLocale(locale);
    onLocaleChange();
  };

  return (
    <ScrollView
      style={commonStyles.container}
      contentContainerStyle={styles.content}
    >
      <Text style={styles.sectionTitle}>{t('language')}</Text>

      <View style={styles.card}>
        <TouchableOpacity
          style={[
            styles.option,
            currentLocale === 'fr' && styles.optionSelected,
          ]}
          onPress={() => handleLocaleChange('fr')}
        >
          <Text
            style={[
              styles.optionText,
              currentLocale === 'fr' && styles.optionTextSelected,
            ]}
          >
            🇫🇷 {t('french')}
          </Text>
          {currentLocale === 'fr' && (
            <Text style={styles.checkmark}>✓</Text>
          )}
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity
          style={[
            styles.option,
            currentLocale === 'en' && styles.optionSelected,
          ]}
          onPress={() => handleLocaleChange('en')}
        >
          <Text
            style={[
              styles.optionText,
              currentLocale === 'en' && styles.optionTextSelected,
            ]}
          >
            🇬🇧 {t('english')}
          </Text>
          {currentLocale === 'en' && (
            <Text style={styles.checkmark}>✓</Text>
          )}
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>{t('about')}</Text>

      <View style={styles.card}>
        <Text style={styles.aboutText}>{t('aboutText')}</Text>
        <View style={styles.versionRow}>
          <Text style={styles.label}>{t('version')}</Text>
          <Text style={styles.value}>0.1.0</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>{t('deviceNote')}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.md,
    paddingBottom: spacing.xl * 2,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.ink,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    overflow: 'hidden',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
  },
  optionSelected: {
    backgroundColor: colors.bg,
  },
  optionText: {
    fontSize: fontSize.md,
    color: colors.ink,
  },
  optionTextSelected: {
    fontWeight: '600',
  },
  checkmark: {
    fontSize: fontSize.lg,
    color: colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.line,
    marginLeft: spacing.md,
  },
  aboutText: {
    fontSize: fontSize.md,
    color: colors.ink,
    lineHeight: 24,
    padding: spacing.md,
  },
  versionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  label: {
    fontSize: fontSize.md,
    color: colors.muted,
  },
  value: {
    fontSize: fontSize.md,
    color: colors.ink,
  },
  footer: {
    marginTop: spacing.xl,
    alignItems: 'center',
  },
  footerText: {
    fontSize: fontSize.sm,
    color: colors.muted,
    textAlign: 'center',
  },
});
