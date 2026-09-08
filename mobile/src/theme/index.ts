import { StyleSheet } from 'react-native';

export const colors = {
  bg: '#f3efe6',
  ink: '#1b1814',
  muted: '#5c564c',
  line: '#d4cdc0',
  card: '#fffaf1',
  blood: '#8f1d1d',
  warn: '#6b3a1f',
  white: '#ffffff',
  primary: '#1b1814',
  primaryText: '#ffffff',
  ghost: 'transparent',
  ghostBorder: '#1b1814',
};

export const fonts = {
  serif: 'Georgia',
  ui: 'System',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const fontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 20,
  xl: 28,
  xxl: 48,
  hero: 72,
};

export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: spacing.md,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  eyebrow: {
    fontSize: fontSize.xs,
    color: colors.muted,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: spacing.xs,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: '500',
    color: colors.ink,
    marginBottom: spacing.sm,
  },
  bodyText: {
    fontSize: fontSize.md,
    color: colors.ink,
    lineHeight: 24,
  },
  mutedText: {
    fontSize: fontSize.sm,
    color: colors.muted,
  },
  warnText: {
    fontSize: fontSize.sm,
    color: colors.warn,
    marginTop: spacing.sm,
  },
  bloodType: {
    fontSize: fontSize.hero,
    fontWeight: '400',
    color: colors.blood,
    lineHeight: fontSize.hero * 1.1,
  },
  bloodTypeEmpty: {
    fontSize: fontSize.hero,
    fontWeight: '400',
    color: colors.muted,
    lineHeight: fontSize.hero * 1.1,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm + 4,
    paddingHorizontal: spacing.lg,
    borderRadius: 8,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
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
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  ghostButtonText: {
    color: colors.ink,
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  textButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  textButtonText: {
    color: colors.ink,
    fontSize: fontSize.md,
  },
  row: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },
  spaceBetween: {
    justifyContent: 'space-between' as const,
  },
  listItem: {
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  listItemLast: {
    borderBottomWidth: 0,
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
    textAlignVertical: 'top' as const,
  },
  label: {
    fontSize: fontSize.sm,
    color: colors.muted,
    marginBottom: spacing.xs,
  },
  fieldGroup: {
    marginBottom: spacing.md,
  },
});
