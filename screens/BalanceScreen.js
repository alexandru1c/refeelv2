import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { supabase } from '../supabase'; // Import the Supabase client
import { getAuth } from 'firebase/auth';

const BalanceScreen = () => {
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('users')
          .select('balance')
          .eq('user_id', user.uid)
          .single();

        if (error) {
          console.error('Error fetching user balance:', error);
        } else {
          setBalance(data.balance);
        }
        setLoading(false);
      }
    };
    fetchUserData();
  }, [user]);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View>
      <Text>Your Balance: {balance}</Text>
    </View>
  );
};

export default BalanceScreen;
