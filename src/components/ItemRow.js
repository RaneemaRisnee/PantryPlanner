import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing } from '../theme';
import { itemSubtotal } from '../utils/calculations';
import { formatCurrency } from '../utils/format';
import { MAX_QUANTITY } from '../utils/validation';
import IconButton from './IconButton';

export default function ItemRow({ item, onTogglePurchased, onChangeQuantity, onEdit, onDelete }) {
  const { purchased } = item;
  return (
    <View style={[styles.row, purchased && styles.rowPurchased]}>
      <Pressable
        accessibilityRole="checkbox"
        accessibilityLabel={`${item.name} purchased`}
        aria-checked={purchased}
        hitSlop={spacing.sm}
        onPress={onTogglePurchased}
        style={styles.checkbox}
      >
        <Ionicons
          name={purchased ? 'checkbox' : 'square-outline'}
          size={28}
          color={purchased ? colors.accent : colors.textMuted}
        />
      </Pressable>
      <View style={styles.details}>
        <Text style={[styles.name, purchased && styles.struck]} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.meta}>
          {item.category} · {formatCurrency(item.estimatedUnitPrice)} / {item.unit}
        </Text>
        {item.notes ? (
          <Text style={styles.notes} numberOfLines={2}>
            {item.notes}
          </Text>
        ) : null}
        <View style={styles.bottomRow}>
          <IconButton
            name="remove-circle-outline"
            label={`Decrease ${item.name} quantity`}
            disabled={item.quantity <= 1}
            onPress={() => onChangeQuantity(-1)}
          />
          <Text style={styles.quantity}>
            {item.quantity} {item.unit}
          </Text>
          <IconButton
            name="add-circle-outline"
            label={`Increase ${item.name} quantity`}
            disabled={item.quantity + 1 > MAX_QUANTITY}
            onPress={() => onChangeQuantity(1)}
          />
          <Text style={[styles.subtotal, purchased && styles.subtotalPurchased]}>
            {formatCurrency(itemSubtotal(item))}
          </Text>
        </View>
      </View>
      <View>
        <IconButton name="create-outline" label={`Edit ${item.name}`} onPress={onEdit} />
        <IconButton
          name="trash-outline"
          label={`Delete ${item.name}`}
          color={colors.danger}
          onPress={onDelete}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: 'flex-start',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    padding: spacing.md,
  },
  rowPurchased: { backgroundColor: colors.background },
  checkbox: { marginRight: spacing.sm, paddingTop: 2 },
  details: { flex: 1 },
  name: { color: colors.text, fontSize: 16, fontWeight: '600' },
  struck: { color: colors.textMuted, textDecorationLine: 'line-through' },
  meta: { color: colors.textMuted, fontSize: 13, marginTop: 2 },
  notes: { color: colors.textMuted, fontSize: 13, fontStyle: 'italic', marginTop: 2 },
  bottomRow: { alignItems: 'center', flexDirection: 'row', marginLeft: -spacing.sm },
  quantity: { color: colors.text, fontSize: 15, minWidth: 56, textAlign: 'center' },
  subtotal: {
    color: colors.primary,
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'right',
  },
  subtotalPurchased: { color: colors.textMuted },
});
