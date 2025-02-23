import React from 'react';
import { StyleSheet } from 'react-native';
import { Layout, Text } from '@ui-kitten/components';

export default function HistoryScreen() {
  return (
    <Layout style={styles.container}>
      <Text category='h1'>History</Text>
      {/* Add your History functionality here */}
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
