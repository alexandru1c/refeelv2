import React from 'react';
import { StyleSheet, FlatList, View, Image } from 'react-native';
import { Layout, Text, Button, Icon } from '@ui-kitten/components';
import { useCart } from './../../CartContext';

export default function CartScreen() {
  const { cartItems, addToCart, decreaseQuantity, increaseQuantity, removeFromCart } = useCart();

  // Calculate total price and total coins
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalCoins = cartItems.reduce((sum, item) => sum + item.coins * item.quantity, 0);

  // Render each cart item
  const renderCartItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image source={{ uri: item.image_url }} style={styles.itemImage} resizeMode="cover" />
      <View style={styles.itemDetails}>
  <Text category="h6">{item.name}</Text>
  
  <View style={styles.priceContainer}>
    <Text appearance="hint">{(item.price * item.quantity).toFixed(2)} RON</Text>
    {item.coins && (
      <Text appearance="hint">{(item.coins * item.quantity)} coins</Text>
    )}
  </View>

  {/* Quantity Controls */}
  <View style={styles.quantityContainer}>
    <Button
      style={styles.quantityButton}
      size="tiny"
      accessoryLeft={(props) => <Icon {...props} name="minus-outline" />}
      onPress={() => {
        if (item.quantity === 1) {
          removeFromCart(item.id);
        } else {
          decreaseQuantity(item.id);
        }
      }}
    />
    <Text style={styles.quantityText}>{item.quantity}</Text>
    <Button
      style={styles.quantityButton}
      size="tiny"
      accessoryLeft={(props) => <Icon {...props} name="plus-outline" />}
      onPress={() => increaseQuantity(item.id)}
    />
  </View>
</View>
    </View>
  );

  return (
    <Layout style={styles.container}>
      <Text category="h5" style={styles.header}>Your Cart</Text>

      {cartItems.length === 0 ? (
        <Text style={styles.emptyCartText}>Your cart is empty.</Text>
      ) : (
        <>
          <FlatList
            data={cartItems}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderCartItem}
          />
          {/* Display total RON and total Coins */}
          <View style={styles.totalContainer}>
            <Text category="h6" style={styles.totalText}>Total: {totalPrice.toFixed(2)} RON</Text>
            <Text category="h6" style={styles.totalText}>Total Coins: {totalCoins} coins</Text>
          </View>
          
          <Button style={styles.checkoutButton}>Order Now</Button>
        </>
      )}
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F7F9FC',
  },
  header: {
    marginBottom: 16,
    color: '#000',
  },
itemContainer: {
  flexDirection: 'row',
  alignItems: 'center', // Ensure vertical alignment
  justifyContent: 'space-between', // Space out elements
  backgroundColor: '#fff',
  padding: 12,
  borderRadius: 8,
  marginBottom: 12,
  shadowColor: '#000',
  shadowOpacity: 0.1,
  shadowOffset: { width: 0, height: 2 },
  shadowRadius: 4,
  elevation: 2,
},
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 12,
  },
itemDetails: {
  flex: 1,
  justifyContent: 'center', // Center content vertically
  marginLeft: 10, // Adjust spacing from image
},
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
quantityButton: {
  marginHorizontal: 6,
  width: 30,
  height: 30,
  borderRadius: 50, // Fully circular buttons
},
  quantityText: {
    marginHorizontal: 8,
    fontSize: 16,
  },
  totalContainer: {
    alignItems: 'center',
    marginTop: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptyCartText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
  },
checkoutButton: {
  marginTop: 20,
  borderRadius: 25, // More rounded
  paddingHorizontal: 20, // Reduce extra blue padding
  paddingVertical: 10, // Make it smaller
  alignSelf: 'center', // Center it
},
priceContainer: {
  position: 'absolute',
  bottom: 10, // Move it to the bottom
  right: 10,  // Align to the right
  alignItems: 'flex-end',
},

});
