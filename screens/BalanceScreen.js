import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { supabase } from '../supabase'; // Import the Supabase client
import { getAuth } from 'firebase/auth';

const BalanceScreen = () => {
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [amountToAdd, setAmountToAdd] = useState(''); // Store the amount to add
  const auth = getAuth();
  const user = auth.currentUser;

  // Fetch user data from Supabase
  const fetchUserData = async () => {
    if (user) {
      const { data, error } = await supabase
        .from('users')
        .select('balance')
        .eq('email', user.email)
        .single(); // Fetch single row for the user

      if (error) {
        console.error('Error fetching user balance:', error);
        Alert.alert('Error', 'Could not fetch user balance');
      } else {
        setBalance(data.balance); // Update state with fetched balance
      }
      setLoading(false);
    }
  };

  // Refetch user data on mount and when user changes
  useEffect(() => {
    fetchUserData();
  }, [user]);

  // Function to handle refetching the data
  const refetchData = async () => {
    setLoading(true); // Show loading while fetching data
    await fetchUserData(); // Refetch the balance
  };

  // Function to handle adding balance
  const handleAddBalance = async () => {
    const amount = parseFloat(amountToAdd); // Convert input to number
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount to add.');
      return;
    }

    if (user) {
      // Update balance in Supabase
      const { data, error } = await supabase
        .from('users')
        .update({ balance: balance + amount }) // Increase balance
        .eq('email', user.email) // Find user by email
        .single();

      if (error) {
        console.error('Error updating balance:', error);
        Alert.alert('Error', 'Could not update balance');
      } else {
        await fetchUserData(); // Refetch the balance
        setAmountToAdd(''); // Clear the input field after adding balance
      }
    }
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.balanceText}>Your Balance: {balance}</Text>
      <TextInput
        style={styles.input}
        value={amountToAdd}
        onChangeText={setAmountToAdd}
        placeholder="Enter amount to add"
        keyboardType="numeric"
      />
      <Button title="Increase Balance" onPress={handleAddBalance} />
      <Button title="Refetch Information" onPress={refetchData} style={styles.refetchButton} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  balanceText: {
    fontSize: 18,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    width: '80%',
    padding: 10,
    marginVertical: 20,
    textAlign: 'center',
  },
  refetchButton: {
    marginTop: 10,
  },
});

export default BalanceScreen;
