import { useEffect, useMemo } from 'react';
import { SectionList, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import EmptyState from '../components/EmptyState';
import ItemRow from '../components/ItemRow';
import PrimaryButton from '../components/PrimaryButton';
import ProgressBar from '../components/ProgressBar';
import { useAppData } from '../context/AppDataContext';
import { colors, spacing } from '../theme';
import { itemsTotal, listProgress, remainingTotal, stepQuantity } from '../utils/calculations';
import { confirmDelete } from '../utils/confirm';
import { groupByCategory } from '../utils/categories';
import { formatCurrency, formatDate } from '../utils/format';

export default function ShoppingChecklistScreen({ navigation, route }) {
  const { listId } = route.params;
  const { lists, items, deleteItem, togglePurchased, updateItem, setListCompleted } = useAppData();
  const insets = useSafeAreaInsets();

  const list = lists.find((candidate) => candidate.id === listId);
  const listItems = useMemo(() => items.filter((item) => item.listId === listId), [items, listId]);
  const sections = useMemo(() => groupByCategory(listItems), [listItems]);
  const progress = listProgress(listItems);

  // Keeps the header in step when the list is renamed.
  useEffect(() => {
    if (list) navigation.setOptions({ title: list.title });
  }, [list, navigation]);

  if (!list) return null;

  const handleDelete = (item) => {
    confirmDelete('Delete item?', `"${item.name}" will be removed from this list.`, () =>
      deleteItem(item.id),
    );
  };

  const handleComplete = () => {
    setListCompleted(listId, true);
    navigation.goBack();
  };

  return (
    <View style={styles.screen}>
      <View style={styles.summary}>
        {list.completed ? (
          <Text style={styles.completedNote}>Completed {formatDate(list.completedAt)}</Text>
        ) : null}
        <Text style={styles.summaryLabel}>
          {progress.purchased} of {progress.total} purchased
        </Text>
        <ProgressBar fraction={progress.fraction} />
        <View style={styles.totals}>
          <View>
            <Text style={styles.summaryLabel}>Estimated total</Text>
            <Text style={styles.summaryTotal}>{formatCurrency(itemsTotal(listItems))}</Text>
          </View>
          <View style={styles.remaining}>
            <Text style={styles.summaryLabel}>Still to buy</Text>
            <Text style={styles.remainingTotal}>{formatCurrency(remainingTotal(listItems))}</Text>
          </View>
        </View>
      </View>
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        stickySectionHeadersEnabled={false}
        renderSectionHeader={({ section }) => (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {section.title} · {section.data.length}
            </Text>
            <Text style={styles.sectionTotal}>{formatCurrency(section.total)}</Text>
          </View>
        )}
        SectionSeparatorComponent={() => <View style={styles.sectionGap} />}
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
            onTogglePurchased={() => togglePurchased(item.id)}
            onChangeQuantity={(step) =>
              updateItem(item.id, { quantity: stepQuantity(item.quantity, step) })
            }
            onEdit={() => navigation.navigate('ItemForm', { listId, itemId: item.id })}
            onDelete={() => handleDelete(item)}
          />
        )}
      />
      <View style={[styles.footer, { paddingBottom: spacing.lg + insets.bottom }]}>
        <PrimaryButton
          label="Add item"
          onPress={() => navigation.navigate('ItemForm', { listId })}
          style={styles.footerButton}
        />
        {list.completed ? (
          <PrimaryButton
            label="Reopen list"
            variant="outline"
            onPress={() => setListCompleted(listId, false)}
            style={styles.footerButton}
          />
        ) : (
          <PrimaryButton
            label="Complete"
            variant="outline"
            onPress={handleComplete}
            style={styles.footerButton}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: colors.background, flex: 1 },
  summary: { backgroundColor: colors.accentSoft, gap: spacing.sm, padding: spacing.lg },
  completedNote: { color: colors.primary, fontSize: 14, fontWeight: '700' },
  summaryLabel: { color: colors.textMuted, fontSize: 14 },
  totals: { flexDirection: 'row', justifyContent: 'space-between' },
  summaryTotal: { color: colors.primary, fontSize: 22, fontWeight: '700', marginTop: 2 },
  remaining: { alignItems: 'flex-end' },
  remainingTotal: { color: colors.text, fontSize: 22, fontWeight: '700', marginTop: 2 },
  content: { flexGrow: 1, paddingBottom: spacing.lg, paddingHorizontal: spacing.lg },
  separator: { height: spacing.md },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: spacing.lg,
  },
  sectionTitle: { color: colors.primary, fontSize: 15, fontWeight: '700' },
  sectionTotal: { color: colors.textMuted, fontSize: 14, fontWeight: '600' },
  sectionGap: { height: spacing.sm },
  footer: {
    backgroundColor: colors.surface,
    borderTopColor: colors.border,
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  footerButton: { flex: 1 },
});
