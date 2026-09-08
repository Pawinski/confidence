import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, fontSize, commonStyles } from '../theme';
import { t } from '../i18n';

interface ListSectionProps {
  title: string;
  items: Array<{ primary: string; secondary?: string }>;
}

export function ListSection({ title, items }: ListSectionProps) {
  return (
    <View style={styles.container}>
      <Text style={commonStyles.sectionTitle}>{title}</Text>
      {items.length === 0 ? (
        <Text style={styles.empty}>{t('none')}</Text>
      ) : (
        items.map((item, index) => (
          <View
            key={index}
            style={[
              styles.item,
              index === items.length - 1 && styles.itemLast,
            ]}
          >
            <Text style={styles.primary}>{item.primary}</Text>
            {item.secondary && (
              <Text style={styles.secondary}> · {item.secondary}</Text>
            )}
          </View>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  item: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  itemLast: {
    borderBottomWidth: 0,
    paddingBottom: 0,
  },
  primary: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.ink,
  },
  secondary: {
    fontSize: fontSize.md,
    color: colors.muted,
  },
  empty: {
    fontSize: fontSize.md,
    color: colors.muted,
    fontStyle: 'italic',
  },
});
