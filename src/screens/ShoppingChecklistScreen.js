import { useEffect, useMemo } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import EmptyState from '../components/EmptyState';
import ItemRow from '../components/ItemRow';
import PrimaryButton from '../components/PrimaryButton';
import { useAppData } from '../context/AppDataContext';
import { colors, spacing } from '../theme';
import { itemsTotal } from '../utils/calculations';
import { confirmDelete } from '../utils/confirm';
import { formatCurrency } from '../utils/format';

export default function ShoppingChecklistScreen({ navigation, route }) {
  const { listId } = route.params;
  const { lists, items, deleteItem } = useAppData();
  const insets = useSafeAreaInsets();

  const list = lists.find((candidate) => candidate.id === listId);
  const listItems = useMemo(() => items.filter((item) => item.listId === listId), [items, listId]);

  // Keeps the header in step when the list is renamed.
  useEffect(() => {
    if (list) navigation.setOptions({ title: list.title });
  }, [list, navigation]);

  const handleDelete = (item) => {
    confirmDelete('Delete item?', `"${item.name}" will be removed from this list.`, () =>
      deleteItem(item.id),
    );
  };

  return (
    <View style={styles.screen}>
      <View style={styles.summary}>
        <Text style={styles.summaryLabel}>
          {listItems.length} {listItems.length === 1 ? 'item' : 'items'} · Estimated total
        </Text>
        <Text style={styles.summaryTotal}>{formatCurrency(itemsTotal(listItems))}</Text>
      </View>
      <FlatList
        data={listItems}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <EmptyState
            icon="cart-outline"
            title="This list is empty"
            message="Add the groceries you need to buy."
          />
        }
        renderItem={({ item }) => (
          <ItemRow
            item={item}
            onEdit={() => navigation.navigate('ItemForm', { listId, itemId: item.id })}
            onDelete={() => handleDelete(item)}
          />
        )}
      />
      <View style={[styles.footer, { paddingBottom: spacing.lg + insets.bottom }]}>
        <PrimaryButton label="Add item" onPress={() => navigation.navigate('ItemForm', { listId })} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: colors.background, flex: 1 },
  summary: { backgroundColor: colors.accentSoft, padding: spacing.lg },
  summaryLabel: { color: colors.textMuted, fontSize: 14 },
  summaryTotal: { color: colors.primary, fontSize: 24, fontWeight: '700', marginTop: 2 },
  content: { flexGrow: 1, padding: spacing.lg },
  separator: { height: spacing.md },
  footer: {
    backgroundColor: colors.surface,
    borderTopColor: colors.border,
    borderTopWidth: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
});
