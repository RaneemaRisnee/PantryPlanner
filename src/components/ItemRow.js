import { StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing } from '../theme';
import { itemSubtotal } from '../utils/calculations';
import { formatCurrency } from '../utils/format';
import IconButton from './IconButton';

export default function ItemRow({ item, onEdit, onDelete }) {
  return (
    <View style={styles.row}>
      <View style={styles.details}>
        <Text style={styles.name} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.meta}>
          {item.category} · {item.quantity} {item.unit} × {formatCurrency(item.estimatedUnitPrice)}
        </Text>
        {item.notes ? (
          <Text style={styles.notes} numberOfLines={2}>
            {item.notes}
          </Text>
        ) : null}
        <Text style={styles.subtotal}>{formatCurrency(itemSubtotal(item))}</Text>
      </View>
      <IconButton name="create-outline" label={`Edit ${item.name}`} onPress={onEdit} />
      <IconButton
        name="trash-outline"
        label={`Delete ${item.name}`}
        color={colors.danger}
        onPress={onDelete}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    padding: spacing.md,
  },
  details: { flex: 1 },
  name: { color: colors.text, fontSize: 16, fontWeight: '600' },
  meta: { color: colors.textMuted, fontSize: 13, marginTop: 2 },
  notes: { color: colors.textMuted, fontSize: 13, fontStyle: 'italic', marginTop: 2 },
  subtotal: { color: colors.primary, fontSize: 15, fontWeight: '700', marginTop: spacing.xs },
});
