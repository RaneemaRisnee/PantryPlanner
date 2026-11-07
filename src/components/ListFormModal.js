import { useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing } from '../theme';
import { validateList } from '../utils/validation';
import FormField from './FormField';
import PrimaryButton from './PrimaryButton';

// Pass a list to edit it. Leave list empty to create a new one.
// Mount this only while the form is open, so each opening starts from fresh values.
export default function ListFormModal({ list, onCancel, onSubmit }) {
  const [title, setTitle] = useState(list?.title ?? '');
  const [description, setDescription] = useState(list?.description ?? '');
  const [errors, setErrors] = useState({});

  const handleSubmit = () => {
    const nextErrors = validateList({ title });
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      onSubmit({ title, description });
    }
  };

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onCancel}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.backdrop}
      >
        <Pressable accessibilityLabel="Close" style={StyleSheet.absoluteFill} onPress={onCancel} />
        <View style={styles.sheet}>
          <Text style={styles.heading}>{list ? 'Edit list' : 'New shopping list'}</Text>
          <FormField
            label="Title"
            value={title}
            onChangeText={setTitle}
            placeholder="e.g. Weekly Groceries"
            error={errors.title}
            maxLength={60}
          />
          <FormField
            label="Description (optional)"
            value={description}
            onChangeText={setDescription}
            placeholder="What is this list for?"
            maxLength={160}
            multiline
          />
          <View style={styles.actions}>
            <PrimaryButton label="Cancel" variant="outline" onPress={onCancel} style={styles.action} />
            <PrimaryButton label="Save" onPress={handleSubmit} style={styles.action} />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    flex: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  sheet: { backgroundColor: colors.background, borderRadius: radius.md, padding: spacing.lg },
  heading: { color: colors.text, fontSize: 20, fontWeight: '700', marginBottom: spacing.lg },
  actions: { flexDirection: 'row', gap: spacing.md },
  action: { flex: 1 },
});
