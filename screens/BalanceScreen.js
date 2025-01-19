import React from 'react';
import { Button, View, Text, StyleSheet } from 'react-native';
import { useAuth } from '../firebaseContext';

export default function BalanceScreen({ navigation }) {
  const { user, logout } = useAuth();

  if (!user) {
    navigation.navigate('Home');
    return null;
  }

  return (
    <View style={styles.container}>
    <Text>Balance: $1200</Text>
    <Button title="Logout" onPress={logout} />
      <Button title="Home" onPress={() => navigation.navigate('Home')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
