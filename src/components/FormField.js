import { StyleSheet, Text, TextInput, View } from 'react-native';

import { colors, radius, spacing } from '../theme';

export default function FormField({ label, error, style, ...inputProps }) {
  return (
    <View style={[styles.field, style]}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        placeholderTextColor={colors.textMuted}
        style={[
          styles.input,
          inputProps.multiline && styles.multiline,
          error && styles.inputError,
        ]}
        {...inputProps}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

export const fieldStyles = StyleSheet.create({
  label: { color: colors.text, fontSize: 14, fontWeight: '600', marginBottom: spacing.xs },
  error: { color: colors.danger, fontSize: 13, marginTop: spacing.xs },
});

const styles = StyleSheet.create({
  field: { marginBottom: spacing.lg },
  label: fieldStyles.label,
  error: fieldStyles.error,
  input: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.sm,
    borderWidth: 1,
    color: colors.text,
    fontSize: 16,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  multiline: { minHeight: 72, textAlignVertical: 'top' },
  inputError: { borderColor: colors.danger },
});
