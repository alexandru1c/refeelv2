import React, { useState } from 'react';
import { Alert, StyleSheet } from 'react-native';
import { Layout, Input, Button, Text, Card } from '@ui-kitten/components';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useAuth } from '../firebaseContext';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { user } = useAuth();
  const auth = getAuth();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigation.navigate('Main');
    } catch (error) {
      Alert.alert('Login Failed', error.message);
    }
  };

  return (
    <Layout style={styles.container}>
      {/* Top header */}
      <Text category='h1' style={styles.header}>Login</Text>
      
      {/* Form Card */}
      <Card style={styles.card}>
        <Input
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Input
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
          autoCapitalize="none"
        />
        <Button style={styles.button} status="primary" onPress={handleLogin}>
          Login
        </Button>
        {/* Signup prompt */}
        <Text style={styles.signupPrompt} appearance="hint">
          New here?
        </Text>
        <Button style={styles.buttonOutline} appearance="outline" onPress={() => navigation.navigate('Signup')}>
          Signup
        </Button>
      </Card>
      
      {/* Optional Home button */}
      <Button style={styles.homeButton} appearance="ghost" onPress={() => navigation.navigate('Welcome')}>
        Home
      </Button>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F7F9FC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    marginBottom: 20,
    color: '#4CAF50',
  },
  card: {
    width: '100%',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginVertical: 10,
  },
  buttonOutline: {
    marginVertical: 10,
  },
  signupPrompt: {
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 5,
    color: '#8F9BB3',
  },
  homeButton: {
    marginTop: 10,
  },
});

