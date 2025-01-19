import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import BalanceScreen from './screens/BalanceScreen';
import { FirebaseAuthProvider } from './firebaseContext'; // A context to manage the user session

const Stack = createStackNavigator();

export default function App() {
  return (
    <FirebaseAuthProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
          <Stack.Screen name="Balance" component={BalanceScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </FirebaseAuthProvider>
  );
}
