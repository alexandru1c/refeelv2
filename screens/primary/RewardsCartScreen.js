import React from 'react';
import { StyleSheet, FlatList, View, Image } from 'react-native';
import { Layout, Text, Button, Icon } from '@ui-kitten/components';
import { useCart } from './../../CartContext';
import { useNavigation } from '@react-navigation/native';
import { supabase } from './../../supabase';
import { v4 as uuidv4 } from 'uuid'; // Unique QR Code generator
import { getAuth } from "firebase/auth";
import 'react-native-get-random-values';

export default function RewardsCartScreen() {
  const { cartItems, decreaseQuantity, increaseQuantity, removeFromCart, clearCart } = useCart();
  const navigation = useNavigation();

  // Calculate total price and total coins
  const totalCoins = cartItems.reduce((sum, item) => sum + item.coins * item.quantity, 0);

  // Handles rewardOrder submission to Supabase
  const handleRewardOrder = async () => {
    try {
        console.log("alex");
        console.log(cartItems.length);

        if (cartItems.length === 0) return;
        console.log("alex2");

        const auth = getAuth();
        const userUuid = auth.currentUser.uid;
        const restaurantId = cartItems[0]?.restaurantId;

        console.log("Generating QR Code...");
        const qrCode = uuidv4();
        console.log("Generated QR Code:", qrCode);

        if (!qrCode) {
            throw new Error("QR Code generation failed.");
        }

        console.log("Fetching restaurant name...");
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
            .insert([{ userUuid, restaurantId, coinsValue: totalCoins, qrCode,  redeemed: "pending"  }])
            .select();

        if (rewardOrderError) {
            throw new Error(`Error inserting rewardOrder: ${rewardOrderError.message}`);
        }

        console.log("rewardOrder inserted successfully!", rewardOrder);

        const rewardOrderId = rewardOrder[0].id;
        console.log(rewardOrderId);

        // Insert rewardOrder products
        const rewardOrderProducts = cartItems.map(item => ({
            rewardOrderId: rewardOrderId,
            productId: item.id,
            quantity: item.quantity,
        }));

        console.log(rewardOrderProducts);
        const { error: productsError } = await supabase.from("reward_products").insert(rewardOrderProducts);

        if (productsError) {
            throw new Error(`Error inserting rewardOrder products: ${productsError.message}`);
        }

        console.log("rewardOrder products inserted successfully!");

        const { data } = await supabase
        .from("users")
        .select("balance")
        .eq("userUuid", userUuid)
        .single()

        console.log("alexu")

        console.log(data)

        console.log(data.balance);
        console.log(totalCoins)

        const remaingBalance = data.balance - totalCoins;

        const { error } = await supabase
        .from('users')
        .update({ balance: remaingBalance })
        .eq('userUuid', userUuid)

        // Clear cart and navigate
        clearCart();
        navigation.navigate("RewardConfirmation", { qrCode, restaurantName });
      } catch (error) {
        console.error("handlerewardOrder Error:", error);
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
          </View>
          
          {/* rewardOrder Now Button */}
          <Button style={styles.checkoutButton} onPress={() => handleRewardOrder()}>
          Order Now
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
  productName: {
    fontSize: 18, 
    fontWeight: 'bold',
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
  priceContainer: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    alignItems: 'flex-end',
  },
});
