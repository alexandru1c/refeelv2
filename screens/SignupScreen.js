import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Layout, Input, Button, Text } from '@ui-kitten/components';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { supabase } from './../supabase'; // Ensure your Supabase client is correctly configured

export default function SignupScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const auth = getAuth();

  const handleSignup = async () => {
    // Clear any previous email error
    setEmailError('');

    // Check if the email already exists in Supabase
    const { data: existingUsers, error: queryError } = await supabase
      .from('users')
      .select('email')
      .eq('email', email);

    if (queryError) {
      // Optionally handle query error here
      return;
    }

    if (existingUsers && existingUsers.length > 0) {
      // Email already exists, set error message and clear password field
      setEmailError('This email is already used.');
      setPassword('');
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // If user does not exist, create a new record in Supabase
      const { error: insertError } = await supabase
        .from('users')
        .insert([{ name: name, balance: 0, email: email }]);
        
      if (insertError) {
        console.error('Error inserting user data into Supabase:', insertError);
      }
      navigation.navigate('Login');
    } catch (error) {
      // Handle additional signup errors if necessary
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
      {/* Display error message below the name input */}
      {emailError !== '' && (
        <Text style={styles.errorText} status="danger">
          {emailError}
        </Text>
      )}
      <Input
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        status={emailError ? 'danger' : 'basic'}
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
  errorText: {
    marginBottom: 10,
    alignSelf: 'center',
  },
});
