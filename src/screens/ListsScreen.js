import { useEffect, useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import EmptyState from '../components/EmptyState';
import ListCard from '../components/ListCard';
import ListFormModal from '../components/ListFormModal';
import PrimaryButton from '../components/PrimaryButton';
import { useAppData } from '../context/AppDataContext';
import { colors, spacing } from '../theme';
import { confirmDelete } from '../utils/confirm';

export default function ListsScreen({ navigation, route }) {
  const { lists, items, createList, updateList, deleteList } = useAppData();
  const [formVisible, setFormVisible] = useState(false);
  const [editingList, setEditingList] = useState(null);

  const activeLists = useMemo(() => lists.filter((list) => !list.completed), [lists]);
  const itemsByList = useMemo(() => {
    const grouped = {};
    items.forEach((item) => {
      (grouped[item.listId] ??= []).push(item);
    });
    return grouped;
  }, [items]);

  const openForm = (list = null) => {
    setEditingList(list);
    setFormVisible(true);
  };

  useEffect(() => {
    if (route.params?.create) {
      openForm();
      navigation.setParams({ create: undefined });
    }
  }, [route.params?.create, navigation]);

  const openList = (list) => {
    navigation.navigate('Checklist', { listId: list.id, title: list.title });
  };

  const handleSubmit = (values) => {
    setFormVisible(false);
    if (editingList) {
      updateList(editingList.id, values);
    } else {
      const id = createList(values);
      openList({ id, title: values.title.trim() });
    }
  };

  const handleDelete = (list) => {
    const count = itemsByList[list.id]?.length ?? 0;
    confirmDelete(
      'Delete list?',
      `"${list.title}" and its ${count} item(s) will be removed.`,
      () => deleteList(list.id),
    );
  };

  return (
    <View style={styles.screen}>
      <FlatList
        data={activeLists}
        keyExtractor={(list) => list.id}
        contentContainerStyle={styles.content}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <EmptyState
            icon="basket-outline"
            title="No active shopping lists"
            message="Create a list to start planning. Completed lists are in History."
          />
        }
        renderItem={({ item: list }) => (
          <ListCard
            list={list}
            items={itemsByList[list.id] ?? []}
            onOpen={() => openList(list)}
            onEdit={() => openForm(list)}
            onDelete={() => handleDelete(list)}
          />
        )}
      />
      <View style={styles.footer}>
        <PrimaryButton label="New list" onPress={() => openForm()} />
      </View>
      {formVisible ? (
        <ListFormModal
          list={editingList}
          onCancel={() => setFormVisible(false)}
          onSubmit={handleSubmit}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: colors.background, flex: 1 },
  content: { flexGrow: 1, padding: spacing.lg },
  separator: { height: spacing.md },
  footer: {
    backgroundColor: colors.surface,
    borderTopColor: colors.border,
    borderTopWidth: 1,
    padding: spacing.lg,
  },
});
