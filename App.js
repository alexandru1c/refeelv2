import React from 'react';
import * as eva from '@eva-design/eva';
import { ApplicationProvider } from '@ui-kitten/components';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from './screens/WelcomeScreen';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import MainTabNavigator from './navigation/MainTabNavigator'; 
import { FirebaseAuthProvider } from './firebaseContext';

const Stack = createStackNavigator();

export default function App() {
  return (
    <FirebaseAuthProvider>
      <ApplicationProvider {...eva} theme={eva.light}>
        <NavigationContainer>
          <Stack.Navigator
          
            initialRouteName="Welcome"
            screenOptions={{
              headerShown: false, // Disable header on all screens
              gestureEnabled: false,
            }}
          >
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
            <Stack.Screen name="Main" component={MainTabNavigator} />
          </Stack.Navigator>
        </NavigationContainer>
      </ApplicationProvider>
    </FirebaseAuthProvider>
  );
}
