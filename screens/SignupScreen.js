import React, { useState } from 'react';
import { Alert, StyleSheet } from 'react-native';
import { Layout, Input, Button, Text } from '@ui-kitten/components';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { supabase } from './../supabase'; // Assuming supabase client is also correctly initialized

export default function SignupScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const auth = getAuth();

  const handleSignup = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // If user does not exist, create a new record in Supabase
      const { error: insertError } = await supabase
        .from('users')
        .insert([{ name: name, balance: 0, email: email }]);
      if (insertError) {
        console.error('Error inserting user data into Supabase:', insertError);
      }
      Alert.alert('Success', 'Account created. Please log in.');
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Signup Failed', error.message);
    }
  };

  return (
    <Layout style={styles.container}>
      <Text category='h1' style={styles.header}>
        Signup
      </Text>
      <Input
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
        autoCapitalize="none"
      />
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
      <Button style={styles.button} status="success" onPress={handleSignup}>
        Signup
      </Button>
      <Button
        style={styles.button}
        appearance="outline"
        onPress={() => navigation.navigate('Welcome')}
      >
        Home
      </Button>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 30,
    alignSelf: 'center',
  },
  input: {
    marginBottom: 20,
  },
  button: {
    marginBottom: 15,
  },
});
