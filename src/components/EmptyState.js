import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing } from '../theme';

export default function EmptyState({ icon, title, message }) {
  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={48} color={colors.textMuted} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', padding: spacing.xl, marginTop: spacing.xl },
  title: { color: colors.text, fontSize: 18, fontWeight: '700', marginTop: spacing.md },
  message: { color: colors.textMuted, fontSize: 15, marginTop: spacing.xs, textAlign: 'center' },
});
