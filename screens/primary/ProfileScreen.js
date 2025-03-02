import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, View, Image } from 'react-native';
import { Layout, Button, Text, Avatar, Spinner } from '@ui-kitten/components';
import { getAuth, signOut } from 'firebase/auth';
import { supabase } from './../../supabase';

export default function ProfileScreen({ navigation }) {
  const [userName, setUserName] = useState(0);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  const user = auth.currentUser;

  // Fetch user data from Supabase
  const fetchUserData = async () => {
    if (user) {
      const { data, error } = await supabase
        .from('users')
        .select('balance, name')
        .eq('email', user.email)
        .single();

        console.log(data)

      if (error) {
        console.error('Error fetching user data:', error);
        Alert.alert('Error', 'Could not fetch user details');
      } else {
        setUserName(data.name)
        setBalance(data.balance);
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [user]);

  // Logout function
  const handleLogout = async () => {
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Logout", onPress: async () => {
            try {
              await signOut(auth);
              navigation.reset({ index: 0, routes: [{ name: 'Welcome' }] });
            } catch (error) {
              Alert.alert("Logout Failed", "There was an issue logging out.");
            }
          } 
        }
      ]
    );
  };

  if (loading) {
    return (
      <Layout style={styles.loadingContainer}>
        <Spinner size="large" />
      </Layout>
    );
  }

  return (
    <Layout style={styles.container}>
      {/* User Avatar */}
      <View style={styles.profileSection}>
        <Avatar 
          source={require('./../../assets/user-default.png')} 
          size="giant" 
          style={styles.avatar} 
        />
        <Text category="h5" style={styles.userName}>{userName}</Text>
        <Text appearance="hint" style={styles.userEmail}>{user.email}</Text>
      </View>

      {/* Balance Section */}
      <View style={styles.balanceContainer}>
        <Text category="h6" style={styles.balanceText}>Balance</Text>
        <Text category="h4" style={styles.balanceAmount}>{balance} coins</Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <Button onPress={fetchUserData} style={styles.refetchButton}>
          Refresh Balance
        </Button>
        <Button style={styles.logoutButton} status="danger" onPress={handleLogout}>
          Logout
        </Button>
      </View>
    </Layout>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F7F9FC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  userEmail: {
    fontSize: 14,
    color: '#6c757d',
  },
  balanceContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  balanceText: {
    fontSize: 18,
    color: '#6c757d',
  },
  balanceAmount: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  refetchButton: {
    width: '100%',
    marginBottom: 10,
    borderRadius: 30,
  },
  logoutButton: {
    width: '100%',
    borderRadius: 30,
  },
});

