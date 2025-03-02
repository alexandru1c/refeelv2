import React from 'react';
import { StyleSheet, FlatList, View, Image } from 'react-native';
import { Layout, Text, Button, Icon } from '@ui-kitten/components';
import { useCart } from './../../CartContext'; // Ensure the correct path

export default function CartScreen() {
  const { cartItems = [], addToCart, decreaseQuantity, increaseQuantity, removeFromCart } = useCart();

  // Calculate total price
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Render each cart item
  const renderCartItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image source={{ uri: item.image_url }} style={styles.itemImage} resizeMode="cover" />
      <View style={styles.itemDetails}>
        <Text category="h6">{item.name}</Text>
        <Text appearance="hint">{(item.price * item.quantity).toFixed(2)} RON</Text> 

        {/* Quantity Controls */}
        <View style={styles.quantityContainer}>
          <Button
            style={styles.quantityButton}
            size="tiny"
            accessoryLeft={(props) => <Icon {...props} name="minus-outline" />}
            onPress={() => {
              if (item.quantity === 1) {
                removeFromCart(item.id); // Removes item when quantity is 1
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
            keyExtractor={(item, index) => `${item.id}_${index}`} // Ensures a unique key
            renderItem={renderCartItem}
          />
          {/* Total Price */}
          <Text category="h6" style={styles.totalText}>Total: {totalPrice.toFixed(2)} RON</Text>
          {/* Checkout Button */}
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
    alignItems: 'center',
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
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  quantityButton: {
    marginHorizontal: 6,
    width: 30, // Smaller buttons
    height: 30,
  },
  quantityText: {
    marginHorizontal: 8,
    fontSize: 16,
  },
  totalText: {
    textAlign: 'right',
    marginTop: 16,
    fontWeight: 'bold',
    fontSize: 18,
  },
  emptyCartText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
  },
  checkoutButton: {
    marginTop: 20,
  },
});
