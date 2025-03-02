import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, View, Image } from 'react-native';
import { Layout, Text, Spinner } from '@ui-kitten/components';
import { supabase } from './../../supabase';
import { getAuth } from "firebase/auth";
import { SafeAreaView } from 'react-native-safe-area-context'; // Import SafeAreaView


export default function HistoryScreen() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const auth = getAuth();
      const userUuid = auth.currentUser?.uid;
      if (!userUuid) {
        console.error("User not logged in");
        return;
      }
  
      // Fetch orders for the logged-in user
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .eq('userUuid', userUuid)
        .order('created_at', { ascending: false });
  
      if (ordersError) {
        throw new Error(ordersError.message);
      }
  
      // Fetch products and restaurant details for each order
      const enrichedOrders = await Promise.all(
        ordersData.map(async (order) => {
          // Fetch products manually by joining with order_products
          const { data: orderProducts, error: orderProductsError } = await supabase
            .from('order_products')
            .select('quantity, productId')
            .eq('orderId', order.id);
  
          if (orderProductsError) {
            throw new Error(orderProductsError.message);
          }
  
          // Fetch product details separately
          const productIds = orderProducts.map(p => p.productId);
          let productDetails = [];
  
          if (productIds.length > 0) {
            const { data: productsData, error: productsError } = await supabase
              .from('products')
              .select('id, name, image_url, price, coins')
              .in('id', productIds);
  
            if (productsError) {
              throw new Error(productsError.message);
            }
  
            // Map products to the order_products
            productDetails = orderProducts.map(op => ({
              ...op,
              product: productsData.find(p => p.id === op.productId),
            }));
          }
  
          // Fetch restaurant details
          const { data: restaurant, error: restaurantError } = await supabase
            .from('restaurants')
            .select('name') // Fetch only the name
            .eq('id', order.restaurantId)
            .single();
  
          if (restaurantError) {
            throw new Error(restaurantError.message);
          }
  
          // Generate local restaurant logo path
          const restaurantLogos = {
            mitzu: require('./../../assets/restaurants/mitzu/logo.png'),
            mcdonalds: require('./../../assets/restaurants/mcdonalds/logo.png'),
          };
          
          // Fallback function to get the logo
          const getRestaurantLogo = (restaurantName) => {
            return restaurantLogos[restaurantName.toLowerCase()] || require('./../../assets/restaurants/default.png');
          };
          
          // Assign restaurant logo path dynamically
          const restaurantLogoPath = getRestaurantLogo(restaurant.name.toLowerCase());
          
          
  
          return {
            ...order,
            restaurant: {
              ...restaurant,
              logo: restaurantLogoPath, // Attach local logo path
            },
            products: productDetails || [],
          };
        })
      );
  
      setOrders(enrichedOrders);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setLoading(false);
    }
  };
  

  const renderOrderItem = ({ item }) => (
    <View style={styles.orderContainer}>
      {/* Restaurant Details */}
      <View style={styles.restaurantContainer}>
      <Image source={item.restaurant.logo} style={styles.restaurantImage} />
      <View>
          <Text category="h6">{item.restaurant.name}</Text>
          <Text appearance="hint">Order Date: {new Date(item.created_at).toLocaleString()}</Text>
        </View>
      </View>
  
      {/* Order Products */}
      {item.products.map((product, index) => (
        <View key={index} style={styles.productContainer}>
          <Image source={{ uri: product.product.image_url }} style={styles.productImage} />
          <View>
            <Text>{product.product.name}</Text>
            <Text appearance="hint">Qty: {product.quantity}</Text>
            <Text appearance="hint">Price: {product.product.price} RON</Text>
            <Text appearance="hint">Coins: {product.product.coins}</Text>
          </View>
        </View>
      ))}
  
      {/* Order Summary */}
      <View style={styles.orderSummary}>
        <Text category="h6">Total: {item.ronValue.toFixed(2)} RON</Text>
        <Text category="h6">Coins Earned: {item.coinsValue}</Text>
      </View>
    </View>
  );
  

  return (
    <Layout style={styles.container}>
<SafeAreaView style={styles.safeArea}>
  <Text category='h5' style={styles.header}>Orders List</Text>
</SafeAreaView>

      {loading ? (
        <Spinner size="large" />
      ) : orders.length === 0 ? (
        <Text style={styles.noOrdersText}>No past orders found.</Text>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderOrderItem}
        />
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
safeArea: {
  paddingTop: 2, // Ensures it's not in the notch
  paddingBottom: 2, // Adds some spacing below
  alignItems: 'center', // Centers the text
  backgroundColor: '#F7F9FC', // Matches screen background
},

header: {
  fontSize: 22,
  fontWeight: 'bold',
  textAlign: 'left',
},

  orderContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  restaurantContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  restaurantImage: {
    width: 50,
    height: 50,
    borderRadius: 10,
    marginRight: 12,
  },
  productContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    padding: 8,
    borderRadius: 6,
    marginBottom: 6,
  },
  productImage: {
    width: 40,
    height: 40,
    borderRadius: 6,
    marginRight: 10,
  },
  orderSummary: {
    marginTop: 10,
    borderTopWidth: 1,
    borderColor: '#ddd',
    paddingTop: 10,
  },
  noOrdersText: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 20,
  },
});
