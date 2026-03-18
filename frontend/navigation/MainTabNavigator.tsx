import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import DashboardScreen from '../page/DashboardScreen';
import MovementsScreen from '../page/MovementsScreen';
import StatisticsScreen from '../page/StatisticsScreen';
import MapScreen from '../page/MapScreen';
import AdminScreen from '../page/AdminScreen';
import CategoriesScreen from '../page/CategoriesScreen';
import TopUsersScreen from '../page/TopUsersScreen';

import { AuthContext } from '../context/AuthContext';

export type MainTabParamList = {
  Dashboard: undefined;
  Movements: undefined;
  Statistics: undefined;
  Map: undefined;
  Categories: undefined;
  AdminStack: undefined;
};

export type AdminStackParamList = {
  AdminPanel: undefined;
  TopUsers: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createNativeStackNavigator<AdminStackParamList>();

function AdminStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleAlign: 'center',
      }}
    >
      <Stack.Screen
        name="AdminPanel"
        component={AdminScreen}
        options={{ title: 'Admin' }}
      />
      <Stack.Screen
        name="TopUsers"
        component={TopUsersScreen}
        options={{ title: 'Top 10' }}
      />
    </Stack.Navigator>
  );
}

export default function MainTabNavigator() {
  const { user } = useContext(AuthContext);

  return (
    <Tab.Navigator
      initialRouteName="Dashboard"
      screenOptions={{
        headerTitleAlign: 'center',
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ title: 'Dashboard' }}
      />

      <Tab.Screen
        name="Movements"
        component={MovementsScreen}
        options={{ title: 'Movimientos' }}
      />

      <Tab.Screen
        name="Statistics"
        component={StatisticsScreen}
        options={{ title: 'Estadísticas' }}
      />

      <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{ title: 'Mapa' }}
      />

      <Tab.Screen
        name="Categories"
        component={CategoriesScreen}
        options={{ title: 'Categorías' }}
      />

      {user?.role === 'ADMIN' ? (
        <Tab.Screen
          name="AdminStack"
          component={AdminStackNavigator}
          options={{
            title: 'Admin',
            headerShown: false,
          }}
        />
      ) : null}
    </Tab.Navigator>
  );
}