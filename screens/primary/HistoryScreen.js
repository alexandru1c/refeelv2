import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, View, Image, Modal, TouchableOpacity, Pressable } from 'react-native';
import { Layout, Text, Spinner, Icon, Button } from '@ui-kitten/components';
import { supabase } from './../../supabase';
import { getAuth } from "firebase/auth";
import { SafeAreaView } from 'react-native-safe-area-context';
import QRCode from 'react-native-qrcode-svg';

export default function HistoryScreen() {
  const [orders, setOrders] = useState([]);
  const [rewardOrders, setRewardOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQRCode, setSelectedQRCode] = useState(null);
  const [selectedOrderStatus, setSelectedOrderStatus] = useState(null);
  const [activeTab, setActiveTab] = useState('orders'); // "orders" or "rewards"
  const [isQRModalVisible, setIsQRModalVisible] = useState(false);


  useEffect(() => {
    if (activeTab === 'orders') {
      fetchOrders();
    } else {
      fetchRewardOrders();
    }
  }, [activeTab]);

  const fetchOrders = async () => {
    setLoading(true);
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

  const fetchRewardOrders = async () => {
    setLoading(true);
    try {
      const auth = getAuth();
      const userUuid = auth.currentUser?.uid;
      if (!userUuid) {
        console.error("User not logged in");
        return;
      }

      const { data: rewardOrdersData } = await supabase
        .from('reward_orders')
        .select('*')
        .eq('userUuid', userUuid)
        .order('created_at', { ascending: false });

      const enrichedRewards = await Promise.all(
        rewardOrdersData.map(async (rewardOrder) => {
          
          const { data: rewardProducts } = await supabase
            .from('reward_products')
            .select('quantity, productId')
            .eq('rewardOrderId', rewardOrder.id);

          const productIds = rewardProducts.map(p => p.productId);
          let productDetails = [];

          if (productIds.length > 0) {
            const { data: productsData } = await supabase
              .from('products')
              .select('id, name, image_url')
              .in('id', productIds);

            productDetails = rewardProducts.map(op => {
              const product = productsData.find(p => p.id === op.productId);
              return {
                ...op,
                product,
              };
            });
          }

          const { data: restaurant, error: restaurantError } = await supabase
      .from('restaurants')
      .select('name')
      .eq('id', rewardOrder.restaurantId)
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
            ...rewardOrder,
            restaurant: {
              ...restaurant,
              logo: restaurantLogoPath,
            },
            products: productDetails || [],
          };
        })
      );

      setRewardOrders(enrichedRewards);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching reward orders:", error);
      setLoading(false);
    }
  };


  const renderTab = () => (
    <View style={styles.tabContainer}>
      <Pressable onPress={() => setActiveTab('orders')}>
        <Text style={[styles.tab, activeTab === 'orders' && styles.activeTab]}>Orders</Text>
      </Pressable>
      <Text style={styles.separator}> | </Text>
      <Pressable onPress={() => setActiveTab('rewards')}>
        <Text style={[styles.tab, activeTab === 'rewards' && styles.activeTab]}>Rewards</Text>
      </Pressable>
    </View>
  );
  

  const renderRewardItem = ({ item }) => (
<View style={styles.orderContainer}>
  <View style={styles.restaurantContainer}>
    <Image source={item.restaurant.logo} style={styles.restaurantImage} />
    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
  <View style={{ marginLeft: 10 }}>
    <Text category="h6">{item.restaurant.name}</Text>
    <Text appearance="hint">{new Date(item.created_at).toLocaleString()}</Text>
  </View>
  {getStatusIcon(item.validated || item.redeemed)}
</View>

  </View>
  {item.products.map((product, index) => (
  <View key={index} style={styles.productContainer}>
    <Image source={{ uri: product.product.image_url }} style={styles.productImage} />
    <View>
      <Text>{product.quantity} x {product.product.name}</Text>
    </View>
  </View>
))}

<View style={styles.rewardSummary}>
  <Text category="h6" >Redeemed coins: {item.coinsValue}</Text>
  <View style={styles.rewardQrButtonContainer}>
    <Button style={styles.qrButton} onPress={() => {
  setSelectedQRCode(item.qrCode);
  setSelectedOrderStatus(item.validated || item.redeemed);
  setIsQRModalVisible(true); // Show modal
}}
>
      QR Code
    </Button>
  </View>
</View>
    </View>
  );

  const renderOrderItem = ({ item }) => (
    <View style={styles.orderContainer}>
      <View style={styles.restaurantContainer}>
        <Image source={item.restaurant.logo} style={styles.restaurantImage} />
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
  <View style={{ marginLeft: 10 }}>
    <Text category="h6">{item.restaurant.name}</Text>
    <Text appearance="hint">{new Date(item.created_at).toLocaleString()}</Text>
  </View>
  {getStatusIcon(item.validated)}
</View>
      </View>
  
      {item.products.map((product, index) => (
        <View key={index} style={styles.productContainer}>
          <Image source={{ uri: product.product.image_url }} style={styles.productImage} />
          <View>
            <Text>{product.quantity} x {product.product.name}</Text>
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
  setSelectedOrderStatus(item.validated || item.redeemed);
  setIsQRModalVisible(true); // Show modal
}}
>
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
        {renderTab()}
      </SafeAreaView>

      {loading ? (
        <Spinner size="large" />
      ) : (
        <FlatList
  data={activeTab === 'orders' ? orders : rewardOrders}
  keyExtractor={(item) => item.id.toString()}
  renderItem={activeTab === 'orders' ? renderOrderItem : renderRewardItem} 
/>
      )}

      {/* QR Code Modal */}
      <Modal visible={isQRModalVisible} transparent animationType="fade">
      <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={() => setIsQRModalVisible(false)}>
          <Icon name="close-outline" fill="black" style={styles.closeIcon} />
            </TouchableOpacity>
            <Text category="h5" style={styles.qrTitle}>Your QR Code</Text>

{selectedQRCode ? (
  <QRCode value={selectedQRCode} size={200} />
) : (
  <Text category="h6" style={{ marginTop: 20 }}>No QR Code Available</Text>
)}

{/* Order Status Label */}
{selectedOrderStatus && (
  <View style={[styles.statusBadge, getStatusStyle(selectedOrderStatus)]}>
    <Text style={styles.statusText}>{getStatusText(selectedOrderStatus)}</Text>
  </View>
)}

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
rewardSummary: {
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
rewardQrButtonContainer: {
  position: 'absolute',
  top:5,
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

  tabContainer: {
  flexDirection: 'row', // Aligns items in a row
  justifyContent: 'center', // Centers them
  alignItems: 'center', // Aligns text vertically
  marginBottom: 10, // Adds some spacing below the tabs
},
tab: {
  fontSize: 18,
  color: '#888', // Default color
  paddingHorizontal: 10, // Adds some space between text
},

separator: {
  fontSize: 18,
  color: '#888', // Keeps it subtle
},

activeTab: {
  fontWeight: 'bold', // Makes the active tab bold
  color: '#000', // Changes color to black for active tab
},


});

