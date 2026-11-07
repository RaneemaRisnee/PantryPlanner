import { ScrollView, StyleSheet, Text, View } from 'react-native';

import PrimaryButton from '../components/PrimaryButton';
import SummaryCard from '../components/SummaryCard';
import { useAppData } from '../context/AppDataContext';
import { colors, spacing } from '../theme';
import { dashboardSummary } from '../utils/calculations';
import { formatCurrency } from '../utils/format';

export default function HomeScreen({ navigation }) {
  const { lists, items } = useAppData();
  const summary = dashboardSummary({ lists, items });

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Your shopping at a glance</Text>
      <SummaryCard
        label="Estimated shopping total"
        value={formatCurrency(summary.estimatedTotal)}
        style={styles.fullCard}
      />
      <View style={styles.grid}>
        <SummaryCard label="Lists" value={summary.listCount} style={styles.gridCard} />
        <SummaryCard label="Total items" value={summary.totalItems} style={styles.gridCard} />
        <SummaryCard label="Purchased" value={summary.purchasedItems} style={styles.gridCard} />
        <SummaryCard label="Remaining" value={summary.remainingItems} style={styles.gridCard} />
      </View>
      <PrimaryButton
        label="View my lists"
        onPress={() => navigation.navigate('Lists')}
        style={styles.action}
      />
      <PrimaryButton
        label="Create a new list"
        variant="outline"
        onPress={() => navigation.navigate('Lists', { create: true })}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: colors.background, flex: 1 },
  content: { padding: spacing.lg },
  heading: { color: colors.text, fontSize: 20, fontWeight: '700', marginBottom: spacing.lg },
  fullCard: { marginBottom: spacing.md },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginBottom: spacing.xl },
  gridCard: { flexBasis: '47%', flexGrow: 1 },
  action: { marginBottom: spacing.md },
});
