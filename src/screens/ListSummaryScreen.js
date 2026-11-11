import { ScrollView, StyleSheet, Text, View } from 'react-native';

import EmptyState from '../components/EmptyState';
import ProgressBar from '../components/ProgressBar';
import SummaryCard from '../components/SummaryCard';
import { useAppData } from '../context/AppDataContext';
import { colors, radius, spacing } from '../theme';
import { itemSubtotal, itemsTotal, listProgress, remainingTotal } from '../utils/calculations';
import { categoryBreakdown, mostExpensiveItems } from '../utils/categories';
import { formatCurrency, formatDate } from '../utils/format';

export default function ListSummaryScreen({ route }) {
  const { listId } = route.params;
  const { lists, items } = useAppData();
  const list = lists.find((candidate) => candidate.id === listId);
  if (!list) return null;

  const listItems = items.filter((item) => item.listId === listId);
  const progress = listProgress(listItems);
  const total = itemsTotal(listItems);
  const stillToBuy = remainingTotal(listItems);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>{list.title}</Text>
      <Text style={styles.meta}>
        {list.completed && list.completedAt
          ? `Completed ${formatDate(list.completedAt)}`
          : `Created ${formatDate(list.createdAt)}`}
      </Text>

      {listItems.length === 0 ? (
        <EmptyState
          icon="pie-chart-outline"
          title="Nothing to summarise"
          message="Add items to this list to see its cost summary."
        />
      ) : (
        <>
          <SummaryCard label="Estimated total" value={formatCurrency(total)} style={styles.fullCard} />
          <View style={styles.grid}>
            <SummaryCard
              label="Purchased"
              value={formatCurrency(total - stillToBuy)}
              compact
              style={styles.gridCard}
            />
            <SummaryCard
              label="Still to buy"
              value={formatCurrency(stillToBuy)}
              compact
              style={styles.gridCard}
            />
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Progress: {progress.purchased} of {progress.total} items
            </Text>
            <ProgressBar fraction={progress.fraction} />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Cost by category</Text>
            {categoryBreakdown(listItems).map((row) => (
              <View key={row.category} style={styles.categoryRow}>
                <View style={styles.categoryText}>
                  <Text style={styles.categoryName}>{row.category}</Text>
                  <Text style={styles.meta}>
                    {row.purchasedCount} of {row.itemCount} purchased
                  </Text>
                </View>
                <View style={styles.categoryAmount}>
                  <Text style={styles.amount}>{formatCurrency(row.total)}</Text>
                  <Text style={styles.meta}>{Math.round(row.share * 100)}% of total</Text>
                </View>
                <View style={styles.shareTrack}>
                  <View style={[styles.shareFill, { width: `${row.share * 100}%` }]} />
                </View>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Most expensive items</Text>
            {mostExpensiveItems(listItems).map((item, index) => (
              <View key={item.id} style={styles.topItem}>
                <Text style={styles.rank}>{index + 1}</Text>
                <View style={styles.categoryText}>
                  <Text style={styles.categoryName}>{item.name}</Text>
                  <Text style={styles.meta}>
                    {item.quantity} {item.unit} × {formatCurrency(item.estimatedUnitPrice)}
                  </Text>
                </View>
                <Text style={styles.amount}>{formatCurrency(itemSubtotal(item))}</Text>
              </View>
            ))}
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: colors.background, flex: 1 },
  content: { padding: spacing.lg },
  heading: { color: colors.text, fontSize: 22, fontWeight: '700' },
  meta: { color: colors.textMuted, fontSize: 13, marginTop: 2 },
  fullCard: { marginBottom: spacing.md, marginTop: spacing.lg },
  grid: { flexDirection: 'row', gap: spacing.md },
  gridCard: { flex: 1 },
  section: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    gap: spacing.sm,
    marginTop: spacing.lg,
    padding: spacing.lg,
  },
  sectionTitle: { color: colors.text, fontSize: 16, fontWeight: '700' },
  categoryRow: {
    borderTopColor: colors.border,
    borderTopWidth: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingTop: spacing.sm,
  },
  categoryText: { flex: 1 },
  categoryName: { color: colors.text, fontSize: 15, fontWeight: '600' },
  categoryAmount: { alignItems: 'flex-end' },
  amount: { color: colors.primary, fontSize: 15, fontWeight: '700' },
  shareTrack: {
    backgroundColor: colors.accentSoft,
    borderRadius: radius.pill,
    flexBasis: '100%',
    height: 6,
    marginTop: spacing.sm,
    overflow: 'hidden',
  },
  shareFill: { backgroundColor: colors.accent, height: '100%' },
  topItem: {
    alignItems: 'center',
    borderTopColor: colors.border,
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: spacing.md,
    paddingTop: spacing.sm,
  },
  rank: { color: colors.accent, fontSize: 18, fontWeight: '700', width: 20 },
});
