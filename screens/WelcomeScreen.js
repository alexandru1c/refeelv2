import React from 'react';
import { StyleSheet } from 'react-native';
import { Layout, Text, Button } from '@ui-kitten/components';

export default function WelcomeScreen({ navigation }) {
  return (
    <Layout style={styles.container}>
      <Text category='h1' style={styles.title}>
        Welcome to Refeel!
      </Text>
      
      <Button
        style={styles.button}
        status="success"
        onPress={() => navigation.navigate('Login')}
      >
        Login
      </Button>
      
      <Button
        style={styles.button}
        status="success"
        onPress={() => navigation.navigate('Signup')}
      >
        Signup
      </Button>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    marginBottom: 40,
    color: '#4CAF50',
  },
  button: {
    marginBottom: 20,
    width: '80%',
    borderRadius: 30,
  },
});
