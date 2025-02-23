// CustomTabBar.js
import React from 'react';
import { BottomNavigation, BottomNavigationTab } from '@ui-kitten/components';

const CustomTabBar = ({ state, descriptors, navigation }) => {
  return (
    <BottomNavigation
      selectedIndex={state.index}
      onSelect={(index) => {
        const routeName = state.routes[index].name;
        navigation.navigate(routeName);
      }}>
      <BottomNavigationTab title="Map" />
      <BottomNavigationTab title="Restaurants" />
      <BottomNavigationTab title="History" />
      <BottomNavigationTab title="Profile" />
    </BottomNavigation>
  );
};

export default CustomTabBar;
