import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, View, TextInput } from 'react-native';
import { Layout, Button, Text } from '@ui-kitten/components';
import { getAuth, signOut } from 'firebase/auth';
import { supabase } from './../../supabase'; // Ensure this is correctly configured

export default function ProfileScreen({ navigation }) {
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [amountToAdd, setAmountToAdd] = useState('');
  const auth = getAuth();
  const user = auth.currentUser;

  // Fetch user data from Supabase
  const fetchUserData = async () => {
    if (user) {
      const { data, error } = await supabase
        .from('users')
        .select('balance')
        .eq('email', user.email)
        .single();

      if (error) {
        console.error('Error fetching user balance:', error);
        Alert.alert('Error', 'Could not fetch user balance');
      } else {
        setBalance(data.balance);
      }
      setLoading(false);
    }
  };

  // Logout function
  const handleLogout = async () => {
    try {
      await signOut(auth);
      Alert.alert("Success", "You have successfully logged out");
      setLoading(false);
      navigation.reset({ index: 0, routes: [{ name: 'Welcome' }] });
    } catch (error) {
      console.error("Error logging out:", error);
      Alert.alert("Logout Failed", "There was an issue logging out.");
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [user]);

  // Refetch user data
  const refetchData = async () => {
    setLoading(true);
    await fetchUserData();
  };

  // Add balance logic
  const handleAddBalance = async () => {
    const amount = parseFloat(amountToAdd);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount to add.');
      return;
    }
    if (user) {
      const { data, error } = await supabase
        .from('users')
        .update({ balance: balance + amount })
        .eq('email', user.email)
        .single();

      if (error) {
        console.error('Error updating balance:', error);
        Alert.alert('Error', 'Could not update balance');
      } else {
        await fetchUserData();
        setAmountToAdd('');
      }
    }
  };

  if (loading) {
    return (
      <Layout style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </Layout>
    );
  }

  return (
    <Layout style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.balanceText}>Balanta: {balance} coins</Text>
        <TextInput
          style={styles.input}
          value={amountToAdd}
          onChangeText={setAmountToAdd}
          placeholder="Enter amount to add"
          keyboardType="numeric"
        />
        <Button onPress={handleAddBalance}>Increase Balance</Button>
        <Button onPress={refetchData} style={styles.refetchButton}>
          Refetch Information
        </Button>
        <Button style={styles.logoutButton} status="danger" onPress={handleLogout}>
          Logout
        </Button>
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  balanceText: {
    fontSize: 24,
    marginBottom: 40,
    color: '#333',
  },
  input: {
    height: 50,
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  refetchButton: {
    marginVertical: 10,
  },
  logoutButton: {
    width: '100%',
    borderRadius: 30,
    marginTop: 20,
  },
});
