import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import ChipSelector from '../components/ChipSelector';
import FormField from '../components/FormField';
import PrimaryButton from '../components/PrimaryButton';
import { useAppData } from '../context/AppDataContext';
import { CATEGORIES, UNITS } from '../data/constants';
import { colors, spacing } from '../theme';
import { validateItem } from '../utils/validation';

export default function ItemFormScreen({ navigation, route }) {
  const { listId, itemId } = route.params;
  const { items, addItem, updateItem } = useAppData();
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();
  const existing = itemId ? items.find((item) => item.id === itemId) : undefined;

  const [name, setName] = useState(existing?.name ?? '');
  const [category, setCategory] = useState(existing?.category ?? '');
  const [quantity, setQuantity] = useState(existing ? String(existing.quantity) : '1');
  const [unit, setUnit] = useState(existing?.unit ?? '');
  const [price, setPrice] = useState(existing ? String(existing.estimatedUnitPrice) : '');
  const [notes, setNotes] = useState(existing?.notes ?? '');
  const [errors, setErrors] = useState({});

  const handleSave = () => {
    const result = validateItem({ name, category, quantity, unit, estimatedUnitPrice: price });
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
    navigation.goBack();
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
            style={styles.rowField}
          />
          <FormField
            label="Unit price (LKR)"
            value={price}
            onChangeText={setPrice}
            keyboardType="decimal-pad"
            placeholder="0.00"
            error={errors.estimatedUnitPrice}
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
