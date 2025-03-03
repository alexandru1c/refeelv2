import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, View, Image, TouchableOpacity } from 'react-native';
import { Layout, Text, Button, Icon } from '@ui-kitten/components';
import { useCart } from './../../CartContext';
import { useNavigation } from '@react-navigation/native';
import { supabase } from './../../supabase';
import { getAuth } from "firebase/auth";
import { v4 as uuidv4 } from 'uuid'; // Unique QR Code generator
import 'react-native-get-random-values';
import { useFocusEffect } from '@react-navigation/native';


export default function RewardsCartScreen() {
  const { cartItems, decreaseQuantity, increaseQuantity, removeFromCart, clearCart } = useCart();
  const navigation = useNavigation();
  
  // State for user balance
  const [userBalance, setUserBalance] = useState(null);

  // Calculate total coins from cart items
  const totalCoins = cartItems.reduce((sum, item) => sum + item.coins * item.quantity, 0);

  // Fetch user balance from Supabase
  const fetchUserBalance = async () => {
    try {
      const auth = getAuth();
      const userUuid = auth.currentUser.uid;

      const { data, error } = await supabase
        .from("users")
        .select("balance")
        .eq("userUuid", userUuid)
        .single();

      if (error) {
        throw new Error(`Error fetching balance: ${error.message}`);
      }
      setUserBalance(data.balance);
    } catch (error) {
      console.error("Error fetching user balance:", error);
    }
  };

  // Handle reward order submission to Supabase
  const handleRewardOrder = async () => {
    try {
      if (cartItems.length === 0) return;

      const auth = getAuth();
      const userUuid = auth.currentUser.uid;
      const restaurantId = cartItems[0]?.restaurantId;

      const qrCode = uuidv4();

      const { data: restaurantData, error: restaurantError } = await supabase
        .from("restaurants")
        .select("displayName")
        .eq("id", restaurantId)
        .single();

      if (restaurantError) {
        throw new Error(`Error fetching restaurant name: ${restaurantError.message}`);
      }

      const restaurantName = restaurantData?.displayName || "the restaurant";

      // Insert into Supabase
      const { data: rewardOrder, error: rewardOrderError } = await supabase
        .from("reward_orders")
        .insert([{ userUuid, restaurantId, coinsValue: totalCoins, qrCode, redeemed: "pending" }])
        .select();

      if (rewardOrderError) {
        throw new Error(`Error inserting rewardOrder: ${rewardOrderError.message}`);
      }

      const rewardOrderId = rewardOrder[0].id;

      // Insert rewardOrder products
      const rewardOrderProducts = cartItems.map(item => ({
        rewardOrderId: rewardOrderId,
        productId: item.id,
        quantity: item.quantity,
      }));

      const { error: productsError } = await supabase.from("reward_products").insert(rewardOrderProducts);

      if (productsError) {
        throw new Error(`Error inserting rewardOrder products: ${productsError.message}`);
      }

      const remainingBalance = userBalance - totalCoins;

      await supabase
        .from('users')
        .update({ balance: remainingBalance })
        .eq('userUuid', userUuid);

      // Clear cart and navigate
      clearCart();
      navigation.navigate("RewardConfirmation", { qrCode, restaurantName });
    } catch (error) {
      console.error("handleRewardOrder Error:", error);
    }
  };

  // Render each cart item
  const renderCartItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image source={{ uri: item.image_url }} style={styles.itemImage} resizeMode="cover" />
      <View style={styles.itemDetails}>
        <Text category="h6" style={styles.itemName}>{item.name}</Text>
        
        <View style={styles.priceContainer}>
          {item.coins && <Text appearance="hint">{(item.coins * item.quantity)} coins</Text>}
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

  // Fetch user balance when the component mounts
  useEffect(() => {
    fetchUserBalance();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchUserBalance(); // Refetch balance when the screen is focused
    }, [])
  );

  // Calculate balance status and button state
  const getBalanceStatus = () => {
    if (userBalance === null) return { color: 'grey', text: 'Loading...', disabled: true };

    if (userBalance > totalCoins) {
      return { color: 'green', text: `Balance: ${userBalance} coins`, disabled: false };
    } else if (userBalance === totalCoins) {
      return { color: 'orange', text: `Balance: ${userBalance} coins`, disabled: false };
    } else {
      return { color: 'red', text: `Balance: ${userBalance} coins`, disabled: true };
    }
  };

  const { color, text, disabled } = getBalanceStatus();

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
            <Text category="h6" style={styles.totalText}>Total Coins: {totalCoins} coins</Text>
            <Text category="h6" style={[styles.balanceText, { color }]}>{text}</Text>
          </View>

          {/* Reward Order Now Button */}
          <Button
            style={[styles.checkoutButton, disabled && styles.disabledButton]}
            onPress={() => handleRewardOrder()}
            disabled={disabled}
          >
            {disabled ? "Your balance is lower than the total" : "Order Now"}
          </Button>
        </>
      )}
    </Layout>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F7F9FC',
  },
  header: {
    marginBottom: 16,
    color: '#000',
    marginTop: 35,
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
    justifyContent: 'center',
    marginLeft: 10,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  quantityButton: {
    marginHorizontal: 6,
    width: 34,
    height: 34,
    borderRadius: 20,
    backgroundColor: '#2196F3',
    borderWidth: 0,
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
  balanceText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
  },
  emptyCartText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
  },
  checkoutButton: {
    marginTop: 20,
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignSelf: 'center',
    backgroundColor: '#2196F3',
    borderWidth: 0,
  },
  disabledButton: {
    backgroundColor: '#B0BEC5',
  },
  priceContainer: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    alignItems: 'flex-end',
  },
});
