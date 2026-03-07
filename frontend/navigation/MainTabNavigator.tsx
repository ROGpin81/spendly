import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import DashboardScreen from '../page/DashboardScreen';
import MovementsScreen from '../page/MovementsScreen';
import StatisticsScreen from '../page/StatisticsScreen';
import MapScreen from '../page/MapScreen';
import AdminScreen from '../page/AdminScreen';

export type MainTabParamList = {
  Dashboard: undefined;
  Movements: undefined;
  Statistics: undefined;
  Map: undefined;
  Admin: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainTabNavigator() {
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
        name="Admin"
        component={AdminScreen}
        options={{ title: 'Admin' }}
      />
    </Tab.Navigator>
  );
}