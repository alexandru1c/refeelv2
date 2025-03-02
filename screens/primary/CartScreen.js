import React from 'react';
import { StyleSheet, FlatList, Image, Alert } from 'react-native';
import { Layout, Text, Button, Icon, Card } from '@ui-kitten/components';
import { useCart } from './../../CartContext';

const TrashIcon = (props) => <Icon {...props} name="trash-2-outline" />;

export default function CartScreen({ navigation }) {
  const { cartItems, removeFromCart, clearCart } = useCart();

  const handleOrder = () => {
    if (cartItems.length === 0) {
      Alert.alert("Cart is empty", "Please add items before ordering.");
      return;
    }
    Alert.alert("Order Placed", "Your order has been placed successfully!");
    clearCart(); // Clears the cart after order placement
    navigation.navigate('RestaurantsScreen'); // Redirect back to restaurants
  };

  const renderCartItem = ({ item }) => (
    <Card style={styles.cartItem}>
      <Image source={{ uri: item.image_url }} style={styles.productImage} resizeMode="cover" />
      <Layout style={styles.itemDetails}>
        <Text category="s1">{item.name}</Text>
        <Text appearance="hint">{item.price} RON</Text>
        <Button
          style={styles.removeButton}
          appearance="ghost"
          status="danger"
          accessoryLeft={TrashIcon}
          onPress={() => removeFromCart(item.id)}
        />
      </Layout>
    </Card>
  );

  return (
    <Layout style={styles.container}>
      <Text category="h5" style={styles.header}>Shopping Cart</Text>
      {cartItems.length === 0 ? (
        <Text style={styles.emptyCart}>Your cart is empty</Text>
      ) : (
        <>
          <FlatList
            data={cartItems}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderCartItem}
            contentContainerStyle={styles.cartList}
          />
          <Button style={styles.orderButton} onPress={handleOrder}>
            Place Order
          </Button>
        </>
      )}
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  emptyCart: {
    textAlign: 'center',
    fontSize: 16,
    color: 'gray',
    marginTop: 50,
  },
  cartList: {
    paddingBottom: 80,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    marginBottom: 12,
    padding: 12,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
  },
  removeButton: {
    alignSelf: 'flex-end',
  },
  orderButton: {
    marginTop: 20,
    width: '100%',
    borderRadius: 12,
  },
});
