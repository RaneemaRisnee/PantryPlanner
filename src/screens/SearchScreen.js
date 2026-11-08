import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import ChipSelector from '../components/ChipSelector';
import EmptyState from '../components/EmptyState';
import { useAppData } from '../context/AppDataContext';
import { CATEGORIES } from '../data/constants';
import { colors, radius, spacing } from '../theme';
import { itemSubtotal } from '../utils/calculations';
import { ALL, STATUS_OPTIONS, filterItems } from '../utils/filters';
import { formatCurrency } from '../utils/format';

const CATEGORY_OPTIONS = [ALL, ...CATEGORIES];

export default function SearchScreen({ navigation }) {
  const { lists, items } = useAppData();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState(ALL);
  const [status, setStatus] = useState(ALL);

  const listTitles = useMemo(
    () => Object.fromEntries(lists.map((list) => [list.id, list.title])),
    [lists],
  );
  const results = useMemo(
    () => filterItems(items, { query, category, status }),
    [items, query, category, status],
  );

  const filters = (
    <View style={styles.filters}>
      <View style={styles.searchBox}>
        <Ionicons name="search" size={20} color={colors.textMuted} />
        <TextInput
          accessibilityLabel="Search products"
          value={query}
          onChangeText={setQuery}
          placeholder="Search by product name"
          placeholderTextColor={colors.textMuted}
          autoCorrect={false}
          returnKeyType="search"
          style={styles.searchInput}
        />
      </View>
      <ChipSelector
        label="Category"
        options={CATEGORY_OPTIONS}
        value={category}
        onChange={setCategory}
      />
      <ChipSelector label="Status" options={STATUS_OPTIONS} value={status} onChange={setStatus} />
      <Text style={styles.count}>
        {results.length} {results.length === 1 ? 'item' : 'items'} found
      </Text>
    </View>
  );

  return (
    <FlatList
      style={styles.screen}
      contentContainerStyle={styles.content}
      data={results}
      keyExtractor={(item) => item.id}
      keyboardShouldPersistTaps="handled"
      ListHeaderComponent={filters}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      ListEmptyComponent={
        <EmptyState
          icon="search-outline"
          title="No matching items"
          message="Try another name or clear the filters."
        />
      }
      renderItem={({ item }) => (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${item.name} in ${listTitles[item.listId]}`}
          onPress={() =>
            navigation.navigate('Checklist', { listId: item.listId, title: listTitles[item.listId] })
          }
          style={({ pressed }) => [styles.result, pressed && styles.pressed]}
        >
          <Ionicons
            name={item.purchased ? 'checkbox' : 'square-outline'}
            size={22}
            color={item.purchased ? colors.accent : colors.textMuted}
          />
          <View style={styles.resultDetails}>
            <Text style={[styles.name, item.purchased && styles.struck]} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={styles.meta} numberOfLines={1}>
              {listTitles[item.listId]} · {item.category} · {item.quantity} {item.unit}
            </Text>
          </View>
          <Text style={styles.subtotal}>{formatCurrency(itemSubtotal(item))}</Text>
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: colors.background, flex: 1 },
  content: { flexGrow: 1, padding: spacing.lg },
  filters: { marginBottom: spacing.md },
  searchBox: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.sm,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  searchInput: { color: colors.text, flex: 1, fontSize: 16, paddingVertical: spacing.md },
  count: { color: colors.textMuted, fontSize: 14 },
  separator: { height: spacing.sm },
  result: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.md,
  },
  pressed: { opacity: 0.85 },
  resultDetails: { flex: 1 },
  name: { color: colors.text, fontSize: 16, fontWeight: '600' },
  struck: { color: colors.textMuted, textDecorationLine: 'line-through' },
  meta: { color: colors.textMuted, fontSize: 13, marginTop: 2 },
  subtotal: { color: colors.primary, fontSize: 15, fontWeight: '700' },
});
