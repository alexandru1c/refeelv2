// MainTabNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import MapScreen from '../screens/primary/MapScreen';
import RestaurantsScreen from '../screens/primary/RestaurantsScreen';
import HistoryScreen from '../screens/primary/HistoryScreen';
import ProfileScreen from '../screens/primary/ProfileScreen';
import InsideRestaurantScreen from '../screens/primary/InsideRestaurantScreen';
import CartScreen from '../screens/primary/CartScreen';
import CustomTabBar from '../components/CustomTabBar';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();


export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tab.Screen name="Map" component={MapScreen} />
      <Tab.Screen name="Restaurants" component={RestaurantsScreen} />
      <Tab.Screen name="History" component={HistoryScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="InsideRestaurant" component={InsideRestaurantScreen} />
      <Stack.Screen name="CartScreen" component={CartScreen} />
    </Tab.Navigator>
  );
}
