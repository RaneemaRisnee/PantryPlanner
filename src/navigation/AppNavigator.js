import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import ItemFormScreen from '../screens/ItemFormScreen';
import ListsScreen from '../screens/ListsScreen';
import ShoppingChecklistScreen from '../screens/ShoppingChecklistScreen';
import { colors } from '../theme';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const headerOptions = {
  headerStyle: { backgroundColor: colors.primary },
  headerTintColor: colors.white,
  headerTitleStyle: { fontWeight: '700' },
};

const TAB_ICONS = { Home: 'home-outline', Lists: 'list-outline' };

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
        options={({ route }) => ({ title: route.params.title })}
      />
      <Stack.Screen
        name="ItemForm"
        component={ItemFormScreen}
        options={({ route }) => ({ title: route.params.itemId ? 'Edit Item' : 'Add Item' })}
      />
    </Stack.Navigator>
  );
}
