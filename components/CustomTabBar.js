import React from 'react';
import { StyleSheet } from 'react-native';
import { BottomNavigation, BottomNavigationTab, Icon } from '@ui-kitten/components';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const MapIcon = (props) => <Icon {...props} name='map-outline' />;
const RestaurantsIcon = (props) => <Icon {...props} name='home-outline' />;
const HistoryIcon = (props) => <Icon {...props} name='clock-outline' />;
const ProfileIcon = (props) => <Icon {...props} name='person-outline' />;

const CustomTabBar = ({ state, navigation }) => {
  const insets = useSafeAreaInsets();

  return (
    <BottomNavigation
      selectedIndex={state.index}
      onSelect={(index) => {
        const routeName = state.routes[index].name;
        navigation.navigate(routeName);
      }}
      style={[styles.bottomNavigation, { paddingBottom: insets.bottom || 10 }]}
      indicatorStyle={{ height: 0 }}  // Remove the indicator line
    >
      <BottomNavigationTab icon={MapIcon} style={styles.tab} />
      <BottomNavigationTab icon={RestaurantsIcon} style={styles.tab} />
      <BottomNavigationTab icon={HistoryIcon} style={styles.tab} />
      <BottomNavigationTab icon={ProfileIcon} style={styles.tab} />
    </BottomNavigation>
  );
};

const styles = StyleSheet.create({
  bottomNavigation: {
    height: 70,         // Base height for larger tap area
    borderTopWidth: 0,  // Remove the dividing line at the top
    elevation: 0,       // Remove Android shadow if any
  },
  tab: {
    paddingVertical: 10,
  },
});

export default CustomTabBar;
