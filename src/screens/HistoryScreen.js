import { useMemo } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import EmptyState from '../components/EmptyState';
import ListCard from '../components/ListCard';
import SummaryCard from '../components/SummaryCard';
import { useAppData } from '../context/AppDataContext';
import { colors, spacing } from '../theme';
import { itemsTotal, listProgress } from '../utils/calculations';
import { confirmDelete } from '../utils/confirm';
import { formatCurrency } from '../utils/format';

export default function HistoryScreen({ navigation }) {
  const { lists, items, deleteList } = useAppData();

  const completedLists = useMemo(
    () =>
      lists
        .filter((list) => list.completed)
        .sort((a, b) => (b.completedAt ?? '').localeCompare(a.completedAt ?? '')),
    [lists],
  );
  const itemsByList = useMemo(() => {
    const grouped = {};
    items.forEach((item) => {
      (grouped[item.listId] ??= []).push(item);
    });
    return grouped;
  }, [items]);
  const completedItems = completedLists.flatMap((list) => itemsByList[list.id] ?? []);
  const progress = listProgress(completedItems);

  const handleDelete = (list) => {
    confirmDelete('Delete list?', `"${list.title}" will be removed from your history.`, () =>
      deleteList(list.id),
    );
  };

  return (
    <FlatList
      style={styles.screen}
      contentContainerStyle={styles.content}
      data={completedLists}
      keyExtractor={(list) => list.id}
      ListHeaderComponent={
        completedLists.length > 0 ? (
          <View style={styles.summary}>
            <SummaryCard label="Completed lists" value={completedLists.length} style={styles.card} />
            <SummaryCard
              label="Items purchased"
              value={`${progress.purchased} of ${progress.total}`}
              style={styles.card}
            />
            <SummaryCard
              label="Estimated total of completed lists"
              value={formatCurrency(itemsTotal(completedItems))}
              style={styles.fullCard}
            />
          </View>
        ) : null
      }
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      ListEmptyComponent={
        <EmptyState
          icon="time-outline"
          title="No completed lists yet"
          message="Tap Complete on a list when you finish shopping and it will appear here."
        />
      }
      renderItem={({ item: list }) => (
        <ListCard
          list={list}
          items={itemsByList[list.id] ?? []}
          onOpen={() => navigation.navigate('Checklist', { listId: list.id, title: list.title })}
          onDelete={() => handleDelete(list)}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: colors.background, flex: 1 },
  content: { flexGrow: 1, padding: spacing.lg },
  summary: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginBottom: spacing.lg },
  card: { flexBasis: '47%', flexGrow: 1 },
  fullCard: { flexBasis: '100%' },
  separator: { height: spacing.md },
});
