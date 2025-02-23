import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, View, TextInput } from 'react-native';
import { Layout, Button, Text } from '@ui-kitten/components';
import { getAuth, signOut } from 'firebase/auth';
import { supabase } from './../supabase'; // Ensure this is correctly configured

const HomeScreen = ({ navigation }) => {
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [amountToAdd, setAmountToAdd] = useState(''); // Store the amount to add
  const auth = getAuth();
  const user = auth.currentUser;

  // Fetch user data from Supabase
  const fetchUserData = async () => {
    console.log("alex");
    if (user) {
      console.log("a intrat aici");
      console.log(user.email);
      const { data, error } = await supabase
        .from('users')
        .select('balance')
        .eq('email', user.email)
        .single(); // Fetch single row for the user

      if (error) {
        console.log("e eroare");
        console.error('Error fetching user balance:', error);
        Alert.alert('Error', 'Could not fetch user balance');
      } else {
        setBalance(data.balance); // Update state with fetched balance
      }
      console.log("alex2");
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      Alert.alert("Success", "You have successfully logged out");
      setLoading(false); // Set loading to false to prevent loading screen
      navigation.reset({ index: 0, routes: [{ name: 'Welcome' }] });
    } catch (error) {
      console.error("Error logging out:", error);
      Alert.alert("Logout Failed", "There was an issue logging out.");
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
    return (
      <Layout style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </Layout>
    );
  }

  return (
    <Layout style={styles.container}>
      <Text style={styles.balanceText}>Your Balance: {balance}</Text>
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
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
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

export default HomeScreen;
