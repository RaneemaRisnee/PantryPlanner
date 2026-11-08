import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing } from '../theme';
import { itemsTotal, listProgress } from '../utils/calculations';
import { formatCurrency, formatDate } from '../utils/format';
import IconButton from './IconButton';
import ProgressBar from './ProgressBar';

// onEdit and onDelete are optional. Each one shows its button only when given.
export default function ListCard({ list, items, onOpen, onEdit, onDelete }) {
  const progress = listProgress(items);
  const actionCount = (onEdit ? 1 : 0) + (onDelete ? 1 : 0);
  const dateLabel =
    list.completed && list.completedAt
      ? `Completed ${formatDate(list.completedAt)}`
      : `Created ${formatDate(list.createdAt)}`;

  return (
    <View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Open ${list.title}`}
        onPress={onOpen}
        style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      >
        <View style={[styles.titleBlock, { paddingRight: actionCount * 42 }]}>
          <Text style={styles.title} numberOfLines={1}>
            {list.title}
          </Text>
          <Text style={styles.meta}>{dateLabel}</Text>
        </View>
        {list.description ? (
          <Text style={styles.description} numberOfLines={2}>
            {list.description}
          </Text>
        ) : null}
        <ProgressBar fraction={progress.fraction} />
        <View style={styles.footer}>
          <Text style={styles.meta}>
            {progress.purchased} of {progress.total} purchased
          </Text>
          <Text style={styles.total}>{formatCurrency(itemsTotal(items))}</Text>
        </View>
      </Pressable>
      {/* Siblings of the card, because nested buttons are unreachable by screen readers. */}
      {actionCount > 0 ? (
        <View style={styles.actions}>
          {onEdit ? (
            <IconButton name="create-outline" label={`Edit ${list.title}`} onPress={onEdit} />
          ) : null}
          {onDelete ? (
            <IconButton
              name="trash-outline"
              label={`Delete ${list.title}`}
              color={colors.danger}
              onPress={onDelete}
            />
          ) : null}
        </View>
      ) : null}
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
  pressed: { opacity: 0.85 },
  titleBlock: { marginBottom: spacing.sm },
  actions: {
    flexDirection: 'row',
    position: 'absolute',
    right: spacing.sm,
    top: spacing.sm,
  },
  title: { color: colors.text, fontSize: 17, fontWeight: '700' },
  description: { color: colors.textMuted, fontSize: 14, marginBottom: spacing.sm },
  meta: { color: colors.textMuted, fontSize: 13, marginTop: 2 },
  footer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  total: { color: colors.primary, fontSize: 15, fontWeight: '700' },
});
