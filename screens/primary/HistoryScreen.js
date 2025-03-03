import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, View, Image, Modal, TouchableOpacity } from 'react-native';
import { Layout, Text, Spinner, Icon, Button } from '@ui-kitten/components';
import { supabase } from './../../supabase';
import { getAuth } from "firebase/auth";
import { SafeAreaView } from 'react-native-safe-area-context';
import QRCode from 'react-native-qrcode-svg';

export default function HistoryScreen() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQRCode, setSelectedQRCode] = useState(null);
  const [selectedOrderStatus, setSelectedOrderStatus] = useState(null);

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

      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .eq('userUuid', userUuid)
        .order('created_at', { ascending: false });

      if (ordersError) {
        throw new Error(ordersError.message);
      }

      const enrichedOrders = await Promise.all(
        ordersData.map(async (order) => {
          const { data: orderProducts, error: orderProductsError } = await supabase
            .from('order_products')
            .select('quantity, productId')
            .eq('orderId', order.id);

          if (orderProductsError) {
            throw new Error(orderProductsError.message);
          }

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

            productDetails = orderProducts.map(op => {
              const product = productsData.find(p => p.id === op.productId);
              return {
                ...op,
                product,
                totalPrice: product ? (product.price || 0) * op.quantity : 0,
                totalCoins: product ? (product.coins || 0) * op.quantity : 0,
              };
            });
          }

          const { data: restaurant, error: restaurantError } = await supabase
            .from('restaurants')
            .select('name')
            .eq('id', order.restaurantId)
            .single();

          if (restaurantError) {
            throw new Error(restaurantError.message);
          }

          const restaurantLogos = {
            mitzu: require('./../../assets/restaurants/mitzu/logo.png'),
            mcdonalds: require('./../../assets/restaurants/mcdonalds/logo.png'),
          };

          const getRestaurantLogo = (restaurantName) => {
            return restaurantLogos[restaurantName.toLowerCase()] || require('./../../assets/restaurants/default.png');
          };

          const restaurantLogoPath = getRestaurantLogo(restaurant.name.toLowerCase());

          return {
            ...order,
            restaurant: {
              ...restaurant,
              logo: restaurantLogoPath,
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

  const handleCloseQRModal = () => {
    setQrCode(null); // Ensures QR code input is reset AFTER closing
    setIsQRModalVisible(false);
  };

  const getStatusIcon = (status) => {
    if (status === 'pending') {
      return <Icon name="clock-outline" style={styles.statusIcon} fill="#FFA500" />; // Yellow for pending
    }
    if (status === 'cancelled') {
      return <Icon name="close-circle-outline" style={styles.statusIcon} fill="#FF3B30" />; // Red for cancelled
    }
    if (status === 'successful') {
      return <Icon name="checkmark-circle-2-outline" style={styles.statusIcon} fill="#4CAF50" />; // Green for successful
    }
    return <Icon name="close-circle-outline" style={styles.statusIcon} fill="#FF3B30" />; // Red for cancelled
  };

  const renderOrderItem = ({ item }) => (
    <View style={styles.orderContainer}>
      <View style={styles.restaurantContainer}>
        <Image source={item.restaurant.logo} style={styles.restaurantImage} />
        <View>
          <Text category="h6">{item.restaurant.name}</Text>
          <Text appearance="hint">Order Date: {new Date(item.created_at).toLocaleString()}</Text>
        </View>
        {getStatusIcon(item.validated)}
      </View>

      {item.products.map((product, index) => (
        <View key={index} style={styles.productContainer}>
          <Image source={{ uri: product.product.image_url }} style={styles.productImage} />
          <View>
            <Text>{product.product.name}</Text>
            <Text appearance="hint">Qty: {product.quantity}</Text>
            <Text appearance="hint">
  Total Price: {(product.totalPrice ? product.totalPrice.toFixed(2) : "0.00")} RON
</Text>
<Text appearance="hint">
  Total Coins: {product.totalCoins ?? 0}
</Text>

          </View>
        </View>
      ))}

      <View style={styles.orderSummary}>
  <Text category="h6">Total: {item.ronValue.toFixed(2)} RON</Text>
  <Text category="h6">Coins Earned: {item.coinsValue}</Text>
  <View style={styles.qrButtonContainer}>
  <Button style={styles.qrButton} onPress={() => {
  setSelectedQRCode(item.qrCode);
  setSelectedOrderStatus(item.validated); // Store the order status
}}>
  QR Code
</Button>

  </View>
</View>

    </View>
  );
  const getStatusText = (status) => {
    if (status === 'pending') return 'Pending';
    if (status === 'cancelled') return 'Cancelled';
    if (status === 'successful') return 'Successful';
    return 'No need to validate the QR';
  };
  
  const getStatusStyle = (status) => {
    if (status === 'pending') return { backgroundColor: '#FFA500' }; // Yellow
    if (status === 'cancelled') return { backgroundColor: '#FF3B30' }; // Red
    if (status === 'successful') return { backgroundColor: '#4CAF50' }; // Green
    return { backgroundColor: '#007BFF' }; // Blue (default)
  };
  

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

      {/* QR Code Modal */}
      <Modal visible={!!selectedQRCode} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setSelectedQRCode(null)}>
              <Icon name="close-outline" fill="black" style={styles.closeIcon} />
            </TouchableOpacity>
            <Text category="h5" style={styles.qrTitle}>Your QR Code</Text>

{selectedQRCode ? (
  <QRCode value={selectedQRCode} size={200} />
) : (
  <Text category="h6" style={{ marginTop: 20 }}>No QR Code Available</Text>
)}

{/* Order Status Label */}
<View style={[styles.statusBadge, getStatusStyle(selectedOrderStatus)]}>
  <Text style={styles.statusText}>{getStatusText(selectedOrderStatus)}</Text>
</View>

          </View>
        </View>
      </Modal>
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
    paddingTop: 2,
    paddingBottom: 2,
    alignItems: 'center',
    backgroundColor: '#F7F9FC',
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
    justifyContent: 'space-between',
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
  paddingBottom: 10, // Adds spacing for the button
  position: 'relative', // Allows absolute positioning inside
},
qrButtonContainer: {
  position: 'absolute',
  bottom: 10,
  right: 10,
},

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContent: {
    width: '75%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
  },
  qrTitle: {
    marginBottom: 15,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  statusIcon: {
    width: 24,
    height: 24,
marginLeft: 10,
  },
  closeIcon: {
    width: 24,
    height: 24,
  },
  statusBadge: {
  marginTop: 15,
  paddingVertical: 8,
  paddingHorizontal: 16,
  borderRadius: 20,
  alignItems: 'center',
  justifyContent: 'center',
},

statusText: {
  color: '#fff',
  fontSize: 16,
  fontWeight: 'bold',
},

});

