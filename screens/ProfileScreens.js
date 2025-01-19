import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import { supabase } from '../supabase';
import { getAuth } from 'firebase/auth';

const ProfileScreen = () => {
  const [newName, setNewName] = useState('');
  const [newBalance, setNewBalance] = useState('');
  const [message, setMessage] = useState('');
  const auth = getAuth();
  const user = auth.currentUser;

  const updateUserProfile = async () => {
    if (user) {
      const { data, error } = await supabase
        .from('users')
        .update({ name: newName, balance: parseFloat(newBalance) })
        .eq('user_id', user.uid);

      if (error) {
        setMessage('Error updating profile: ' + error.message);
      } else {
        setMessage('Profile updated successfully');
      }
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Name"
        value={newName}
        onChangeText={setNewName}
      />
      <TextInput
        placeholder="Balance"
        value={newBalance}
        onChangeText={setNewBalance}
        keyboardType="numeric"
      />
      <Button title="Update Profile" onPress={updateUserProfile} />
      <Text>{message}</Text>
    </View>
  );
};

export default ProfileScreen;
