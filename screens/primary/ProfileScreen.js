import React from 'react';
import { StyleSheet } from 'react-native';
import { Layout, Text } from '@ui-kitten/components';

export default function ProfileScreen() {
  return (
    <Layout style={styles.container}>
      <Text category='h1'>Profile</Text>
      {/* Add your Profile functionality here */}
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
});
