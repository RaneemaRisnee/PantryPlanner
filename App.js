import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import PrimaryButton from './src/components/PrimaryButton';
import { AppDataProvider, useAppData } from './src/context/AppDataContext';
import AppNavigator from './src/navigation/AppNavigator';
import { colors, spacing } from './src/theme';
import { confirmAction } from './src/utils/confirm';

function AppContent() {
  const { status, reload, startFresh } = useAppData();

  if (status === 'loading') {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  if (status === 'error') {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorTitle}>Your saved lists could not be loaded</Text>
        <Text style={styles.errorText}>
          Try again first. If the problem continues, the saved data may be damaged. Starting fresh
          keeps a backup of it on this device and opens the app with no lists.
        </Text>
        <PrimaryButton label="Try again" onPress={reload} style={styles.errorButton} />
        <PrimaryButton
          label="Start fresh"
          variant="outline"
          style={styles.errorButton}
          onPress={() =>
            confirmAction(
              'Start fresh?',
              'The app will open with no lists. Your current data is kept as a backup on this device.',
              'Start fresh',
              startFresh,
            )
          }
        />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppDataProvider>
        <AppContent />
      </AppDataProvider>
      <StatusBar style="light" />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    backgroundColor: colors.background,
  },
  errorTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  errorText: {
    color: colors.textMuted,
    fontSize: 15,
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  errorButton: { alignSelf: 'stretch', marginBottom: spacing.md },
});
