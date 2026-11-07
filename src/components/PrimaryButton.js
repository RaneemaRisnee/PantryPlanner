import { Pressable, StyleSheet, Text } from 'react-native';

import { colors, radius, spacing } from '../theme';

export default function PrimaryButton({ label, onPress, variant = 'solid', style }) {
  const outlined = variant === 'outline';
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        outlined && styles.outlined,
        pressed && styles.pressed,
        style,
      ]}
    >
      <Text style={[styles.label, outlined && styles.outlinedLabel]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.accent,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
  },
  outlined: { backgroundColor: colors.surface },
  pressed: { opacity: 0.8 },
  label: { color: colors.white, fontSize: 16, fontWeight: '600' },
  outlinedLabel: { color: colors.accent },
});
