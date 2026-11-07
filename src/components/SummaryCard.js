import { StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing } from '../theme';

export default function SummaryCard({ label, value, style }) {
  return (
    <View style={[styles.card, style]}>
      <Text style={styles.value} numberOfLines={1} adjustsFontSizeToFit>
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
  label: { color: colors.textMuted, fontSize: 14, marginTop: spacing.xs },
});
