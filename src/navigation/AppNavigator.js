import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Pressable, StyleSheet, Text } from 'react-native';

import HistoryScreen from '../screens/HistoryScreen';
import HomeScreen from '../screens/HomeScreen';
import ItemFormScreen from '../screens/ItemFormScreen';
import ListSummaryScreen from '../screens/ListSummaryScreen';
import ListsScreen from '../screens/ListsScreen';
import SearchScreen from '../screens/SearchScreen';
import ShoppingChecklistScreen from '../screens/ShoppingChecklistScreen';
import { colors, spacing } from '../theme';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const headerOptions = {
  headerStyle: { backgroundColor: colors.primary },
  headerTintColor: colors.white,
  headerTitleStyle: { fontWeight: '700' },
};

const TAB_ICONS = {
  Home: 'home-outline',
  Lists: 'list-outline',
  Search: 'search-outline',
  History: 'time-outline',
};

function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        ...headerOptions,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarIcon: ({ color, size }) => (
          <Ionicons name={TAB_ICONS[route.name]} color={color} size={size} />
        ),
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'PantryPlanner', tabBarLabel: 'Home' }}
      />
      <Tab.Screen
        name="Lists"
        component={ListsScreen}
        options={{ title: 'My Shopping Lists', tabBarLabel: 'Lists' }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{ title: 'Categories & Search', tabBarLabel: 'Search' }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{ title: 'Shopping History', tabBarLabel: 'History' }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={headerOptions}>
      <Stack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }} />
      <Stack.Screen
        name="Checklist"
        component={ShoppingChecklistScreen}
        options={({ navigation, route }) => ({
          title: route.params.title,
          headerRight: () => (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="List summary"
              hitSlop={spacing.sm}
              onPress={() => navigation.navigate('ListSummary', { listId: route.params.listId })}
              style={({ pressed }) => [styles.headerAction, pressed && styles.pressed]}
            >
              <Text style={styles.headerButton}>Summary</Text>
            </Pressable>
          ),
        })}
      />
      <Stack.Screen
        name="ListSummary"
        component={ListSummaryScreen}
        options={{ title: 'Shopping Summary' }}
      />
      <Stack.Screen
        name="ItemForm"
        component={ItemFormScreen}
        options={({ route }) => ({ title: route.params.itemId ? 'Edit Item' : 'Add Item' })}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  headerAction: { paddingHorizontal: spacing.sm },
  headerButton: { color: colors.white, fontSize: 16, fontWeight: '600' },
  pressed: { opacity: 0.6 },
});
