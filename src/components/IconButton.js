import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet } from 'react-native';

import { colors, spacing } from '../theme';

export default function IconButton({ name, label, onPress, color = colors.textMuted }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={spacing.xs}
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
    >
      <Ionicons name={name} size={22} color={color} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { padding: spacing.sm },
  pressed: { opacity: 0.6 },
});
