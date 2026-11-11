import { StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing } from '../theme';

// Use compact for half-width cards that show currency amounts.
export default function SummaryCard({ label, value, compact = false, style }) {
  return (
    <View style={[styles.card, style]}>
      <Text style={[styles.value, compact && styles.compactValue]} numberOfLines={1} adjustsFontSizeToFit>
        {value}
      </Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    padding: spacing.lg,
  },
  value: { color: colors.primary, fontSize: 24, fontWeight: '700' },
  compactValue: { fontSize: 18 },
  label: { color: colors.textMuted, fontSize: 14, marginTop: spacing.xs },
});
