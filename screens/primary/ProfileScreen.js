import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, View, Image, TextInput, TouchableOpacity } from 'react-native';
import { Layout, Button, Text, Avatar, Spinner, Icon } from '@ui-kitten/components';
import { getAuth, signOut, updateProfile, updateEmail, updatePassword } from 'firebase/auth';
import { supabase } from './../../supabase';
import { useNavigation } from '@react-navigation/native';

export default function ProfileScreen() {
  const [userData, setUserData] = useState({ name: '', email: '', balance: 0 });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPasswordField, setShowPasswordField] = useState(false);
  const auth = getAuth();
  const user = auth.currentUser;
  const navigation = useNavigation();

  // Fetch user data from Supabase
  const fetchUserData = async () => {
    if (user) {
      const { data, error } = await supabase
        .from('users')
        .select('name, balance')
        .eq('email', user.email)
        .single();

      if (error) {
        console.error('Error fetching user data:', error);
        Alert.alert('Error', 'Could not fetch user details');
      } else {
        setUserData({ ...data, email: user.email });
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

  // Update User Profile
  const handleUpdateProfile = async () => {
    try {
      if (newName && newName !== user.displayName) {
        await updateProfile(user, { displayName: newName });
        await supabase.from('users').update({ name: newName }).eq('email', user.email);
      }
      if (newEmail && newEmail !== user.email) {
        await updateEmail(user, newEmail);
        await supabase.from('users').update({ email: newEmail }).eq('email', user.email);
      }
      Alert.alert("Profile Updated", "Your profile details have been updated successfully.");
      fetchUserData();
      setEditing(false);
    } catch (error) {
      Alert.alert("Update Failed", error.message);
    }
  };

  // Change Password
  const handleChangePassword = async () => {
    try {
      if (!newPassword || newPassword.length < 6) {
        Alert.alert("Error", "Password must be at least 6 characters.");
        return;
      }
      await updatePassword(user, newPassword);
      Alert.alert("Success", "Password updated successfully!");
      setNewPassword('');
      setShowPasswordField(false); // Hide after successful update
    } catch (error) {
      Alert.alert("Update Failed", error.message);
    }
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
      {/* Profile Header */}
      <View style={styles.profileSection}>
        <Avatar 
          source={require('./../../assets/user-default.png')} 
          size="giant" 
          style={styles.avatar} 
        />
        {editing ? (
          <>
            <TextInput
              style={styles.input}
              placeholder="Enter new name"
              value={newName}
              onChangeText={setNewName}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter new email"
              value={newEmail}
              onChangeText={setNewEmail}
            />
            <Button style={styles.updateButton} onPress={handleUpdateProfile}>Save Changes</Button>
          </>
        ) : (
          <>
            <Text category="h5" style={styles.userName}>{userData.name || "User"}</Text>
            <Text appearance="hint" style={styles.userEmail}>{userData.email}</Text>
            <TouchableOpacity onPress={() => setEditing(true)}>
              <Text style={styles.editProfileText}>Edit Profile</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* Balance Section */}
      <View style={styles.balanceContainer}>
        <Text category="h6" style={styles.balanceText}>Balance</Text>
        <Text category="h4" style={styles.balanceAmount}>{userData.balance} coins</Text>
      </View>

      <View style={styles.passwordContainer}>
  {showPasswordField && (
    <TextInput
      style={styles.input}
      placeholder="Enter new password"
      secureTextEntry
      value={newPassword}
      onChangeText={setNewPassword}
    />
  )}
  <View style={styles.passwordButtonContainer}>
    <Button 
      onPress={() => {
        setShowPasswordField(!showPasswordField);
        setNewPassword("");}} 
      style={[styles.passwordButton, showPasswordField ? styles.greenButton : null]}
    >
      {showPasswordField ? "Save Password" : "Change Password"}
    </Button>
    {showPasswordField && (
      <Button 
        onPress={() => {
          setShowPasswordField(false);
        setNewPassword("");}}
        style={styles.cancelButton} 
        appearance="ghost"
      >
        Cancel
      </Button>
    )}
  </View>
</View>


      {/* Navigation Buttons */}
      <View style={styles.buttonContainer}>
        <Button style={styles.secondaryButton} onPress={() => navigation.navigate("HistoryScreen")}>
          View Order History
        </Button>
        <Button style={styles.secondaryButton} onPress={() => navigation.navigate("SettingsScreen")}>
          App Settings
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
    marginBottom: 20,
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
  editProfileText: {
    color: '#2196F3',
    fontSize: 16,
    marginTop: 5,
  },
  balanceContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
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
  input: {
    height: 50,
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  updateButton: {
    marginBottom: 10,
  },
  passwordContainer: {
    width: '100%',
    marginBottom: 10,
  },
  passwordButton: {
    marginBottom: 20,
  },
  buttonContainer: {
    width: '100%',
  },
  secondaryButton: {
    marginBottom: 10,
  },
  logoutButton: {
    borderRadius: 30,
  },
  passwordButtonContainer: {
  flexDirection: 'row',
  justifyContent: 'space-between',
},
passwordButton: {
  flex: 1,
  marginRight: 10,
},
cancelButton: {
  flex: 1,
},
greenButton: {
  backgroundColor: 'green',
},

});
