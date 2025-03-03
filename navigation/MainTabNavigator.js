// MainTabNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import MapScreen from '../screens/primary/MapScreen';
import RestaurantsScreen from '../screens/primary/RestaurantsScreen';
import HistoryScreen from '../screens/primary/HistoryScreen';
import ProfileScreen from '../screens/primary/ProfileScreen';
import InsideRestaurantScreen from '../screens/primary/InsideRestaurantScreen';
import InsideRewardsScreen from '../screens/primary/InsideRewardsScreen';
import CartScreen from '../screens/primary/CartScreen';
import RewardsCartScreen from '../screens/primary/RewardsCartScreen';
import CustomTabBar from '../components/CustomTabBar';
import OrderConfirmationScreen from '../screens/primary/OrderConfirmationScreen';
import RewardConfirmationScreen from '../screens/primary/RewardConfirmationScreen';
import RewardsStoreScreen from '../screens/primary/RewardsStoreScreen';


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
      <Tab.Screen name="InsideRewards" component={InsideRewardsScreen} />
      <Stack.Screen name="CartScreen" component={CartScreen} />
      <Stack.Screen name="RewardsCartScreen" component={RewardsCartScreen} />
      <Stack.Screen name="OrderConfirmation" component={OrderConfirmationScreen} />
      <Stack.Screen name="RewardConfirmation" component={RewardConfirmationScreen} />
      <Stack.Screen name="RewardsStore" component={RewardsStoreScreen} />
    </Tab.Navigator>
  );
}
