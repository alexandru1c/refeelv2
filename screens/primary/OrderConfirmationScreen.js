import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Layout, Text, Button } from '@ui-kitten/components';
import { useNavigation } from '@react-navigation/native';

export default function OrderConfirmationScreen() {
  const navigation = useNavigation();

  return (
    <Layout style={styles.container}>
      <Text category="h4" style={styles.thankYouText}>Thank you for your order!</Text>
      <Text appearance="hint" style={styles.infoText}>
        Your order has been placed successfully.
      </Text>
      <Button style={styles.closeButton} onPress={() => navigation.navigate('RestaurantsScreen')}>
        Close
      </Button>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F7F9FC',
  },
  thankYouText: {
    marginBottom: 12,
    fontWeight: 'bold',
  },
  infoText: {
    textAlign: 'center',
    marginBottom: 20,
  },
  closeButton: {
    marginTop: 20,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
});
