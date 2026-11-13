import { usePreventRemove } from '@react-navigation/native';
import { useHeaderHeight } from '@react-navigation/elements';
import { useEffect, useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import ChipSelector from '../components/ChipSelector';
import EmptyState from '../components/EmptyState';
import FormField from '../components/FormField';
import PrimaryButton from '../components/PrimaryButton';
import { useAppData } from '../context/AppDataContext';
import { CATEGORIES, UNITS } from '../data/constants';
import { colors, spacing } from '../theme';
import { confirmAction } from '../utils/confirm';
import { validateItem } from '../utils/validation';

export default function ItemFormScreen({ navigation, route }) {
  const { listId, itemId } = route.params;
  const { items, addItem, updateItem } = useAppData();
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();
  const existing = itemId ? items.find((item) => item.id === itemId) : undefined;

  const [initial] = useState(() => ({
    name: existing?.name ?? '',
    category: existing?.category ?? '',
    quantity: existing ? String(existing.quantity) : '1',
    unit: existing?.unit ?? '',
    price: existing ? String(existing.estimatedUnitPrice) : '',
    notes: existing?.notes ?? '',
  }));
  const [name, setName] = useState(initial.name);
  const [category, setCategory] = useState(initial.category);
  const [quantity, setQuantity] = useState(initial.quantity);
  const [unit, setUnit] = useState(initial.unit);
  const [price, setPrice] = useState(initial.price);
  const [notes, setNotes] = useState(initial.notes);
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);

  const otherNames = useMemo(
    () => items.filter((item) => item.listId === listId && item.id !== itemId).map((item) => item.name),
    [items, listId, itemId],
  );

  const current = { name, category, quantity, unit, price, notes };
  const hasChanges = Object.keys(initial).some((key) => initial[key] !== current[key]);

  // Asks before leaving with unsaved changes, including the back gesture.
  usePreventRemove(hasChanges && !saved, ({ data }) => {
    confirmAction(
      'Discard changes?',
      'Your changes to this item have not been saved.',
      'Discard',
      () => navigation.dispatch(data.action),
    );
  });

  // Leaves only after the saved flag is applied, so the discard prompt is not shown.
  useEffect(() => {
    if (saved) navigation.goBack();
  }, [saved, navigation]);

  if (itemId && !existing && !saved) {
    return (
      <View style={styles.screen}>
        <EmptyState
          icon="alert-circle-outline"
          title="Item not found"
          message="This item may have been deleted. Go back to the list to continue."
        />
      </View>
    );
  }

  const handleSave = () => {
    const result = validateItem(
      { name, category, quantity, unit, estimatedUnitPrice: price },
      otherNames,
    );
    setErrors(result.errors);
    if (!result.isValid) return;

    const fields = {
      name: name.trim(),
      category,
      quantity: result.quantity,
      unit,
      estimatedUnitPrice: result.estimatedUnitPrice,
      notes: notes.trim(),
    };
    if (existing) {
      updateItem(existing.id, fields);
    } else {
      addItem(listId, fields);
    }
    setSaved(true);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={headerHeight}
      style={styles.screen}
    >
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: spacing.lg + insets.bottom }]}
        keyboardShouldPersistTaps="handled"
      >
        <FormField
          label="Product name"
          value={name}
          onChangeText={setName}
          placeholder="e.g. Rice"
          error={errors.name}
          maxLength={60}
        />
        <ChipSelector
          label="Category"
          options={CATEGORIES}
          value={category}
          onChange={setCategory}
          error={errors.category}
        />
        <View style={styles.row}>
          <FormField
            label="Quantity"
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="decimal-pad"
            error={errors.quantity}
            maxLength={9}
            style={styles.rowField}
          />
          <FormField
            label="Unit price (LKR)"
            value={price}
            onChangeText={setPrice}
            keyboardType="decimal-pad"
            placeholder="0.00"
            error={errors.estimatedUnitPrice}
            maxLength={11}
            style={styles.rowField}
          />
        </View>
        <ChipSelector
          label="Unit"
          options={UNITS}
          value={unit}
          onChange={setUnit}
          error={errors.unit}
        />
        <FormField
          label="Notes (optional)"
          value={notes}
          onChangeText={setNotes}
          placeholder="Brand, size or anything to remember"
          maxLength={160}
          multiline
        />
        <PrimaryButton label={existing ? 'Save changes' : 'Add to list'} onPress={handleSave} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: colors.background, flex: 1 },
  content: { padding: spacing.lg },
  row: { flexDirection: 'row', gap: spacing.md },
  rowField: { flex: 1 },
});
