import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Layout, Text, Button } from '@ui-kitten/components';
import { useNavigation, useRoute } from '@react-navigation/native';
import QRCode from 'react-native-qrcode-svg'; // Add this at the top


export default function RewardConfirmationScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { qrCode, restaurantName } = route.params;  // Retrieve the QR Code & restaurantName


  return (
    <Layout style={styles.container}>
      <Text category="h4" style={styles.thankYouText}>Thank you for your order!</Text>
      <Text appearance="hint" style={styles.infoText}>
        Your order has been placed successfully.
      </Text>
      <Text category="h6" style={styles.qrText}>
        This is your QR code which you can show to {restaurantName}.
      </Text>
      <View style={styles.qrContainer}>
  <Text style={styles.qrText}>This is your QR code for {restaurantName}:</Text>
  <View style={styles.qrWrapper}>
    <QRCode value={qrCode} size={200} backgroundColor="transparent" />
  </View>
</View>

<Button 
  style={styles.closeButton} 
  onPress={() => navigation.reset({
    index: 0,
    routes: [{ name: 'Restaurants' }], // Ensure this matches the tab name in MainTabNavigator
  })}
>
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
  qrText: {
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: 'bold',
    fontSize: 16,
  },
  closeButton: {
    marginTop: 20,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  qrContainer: {
  marginTop: 20,
  alignItems: 'center',
  justifyContent: 'center',
},
qrText: {
  fontSize: 16,
  marginBottom: 10,
  textAlign: 'center',
  fontWeight: 'bold',
},
qrWrapper: {
  backgroundColor: '#fff',  // White background for QR Code
  borderRadius: 20,         // Rounded corners
  padding: 15,              // Padding around QR Code
  overflow: 'hidden',       // Ensures content stays rounded
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.2,
  shadowRadius: 4,
  elevation: 5,             // Shadow effect for Android
},
});
