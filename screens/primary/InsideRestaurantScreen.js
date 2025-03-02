import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, TouchableOpacity, Image, Dimensions, View } from 'react-native';
import { Layout, Text, Spinner, Button, Icon } from '@ui-kitten/components';
import { supabase } from './../../supabase';
import { useCart } from './../../CartContext';

const PlusIcon = (props) => <Icon {...props} name="plus-outline" />;

export default function InsideRestaurantScreen({ route, navigation }) {
  const { restaurant } = route.params;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { cartItems, addToCart } = useCart();

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('restaurantId', restaurant.id);

    if (error) {
      console.error('Error fetching products:', error);
    } else {
      setProducts(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    setProducts([]);
    setLoading(true);
    fetchProducts();
  }, [restaurant.id]);

  const handleAddProduct = (product) => {
    addToCart(product);
  };

  const totalCartQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalCartPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalCartCoins = cartItems.reduce((sum, item) => sum + item.coins * item.quantity, 0);


  const renderProductItem = ({ item }) => (
    <TouchableOpacity style={styles.itemContainer}>
      <Layout style={styles.card}>
        <Image source={{ uri: item.image_url }} style={styles.logo} resizeMode="cover" />
        <Button
          style={styles.addButton}
          accessoryLeft={PlusIcon}
          appearance="ghost"
          onPress={() => handleAddProduct(item)}
        />
      </Layout>
      <Text category="h6" style={styles.itemTitle}>{item.name}</Text>
      <Text appearance="hint" style={styles.itemPrice}>{item.price} RON</Text>
      <Text appearance="hint" style={styles.itemPrice}>{item.coins} coins</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <Layout style={styles.loadingContainer}>
        <Spinner size="giant" />
      </Layout>
    );
  }

  return (
    <Layout style={styles.container}>
      <Text category='h5' style={styles.productsHeader}>Products</Text>
      <FlatList
        data={products}
        keyExtractor={(item) => `${item.id}`}
        renderItem={renderProductItem}
        numColumns={2}
        contentContainerStyle={styles.productsList}
      />

{cartItems.length > 0 && (
  <TouchableOpacity style={styles.cartButton} onPress={() => navigation.navigate('CartScreen')}>
    <View style={styles.cartInfo}>
      <Text style={styles.cartText}>Your Cart</Text>
      <Text style={styles.cartDetails}>
        {totalCartQuantity} items | {totalCartPrice.toFixed(2)} RON | {totalCartCoins} coins
      </Text>
    </View>
    <View style={styles.cartIconContainer}>
    <Icon name="shopping-bag-outline" style={styles.cartIcon} fill="#2196F3" />
    </View>
  </TouchableOpacity>
)}
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#F7F9FC' },
  productsHeader: { marginTop: 50, marginBottom: 16, textAlign: 'left', color: '#000' },
  itemContainer: { flex: 1, margin: 8, alignItems: 'center' },
  card: { borderRadius: 16, width: Dimensions.get('window').width / 2 - 24, height: 150 },
  logo: { width: '100%', height: '100%' },
  addButton: { position: 'absolute', bottom: 8, right: 8 },
cartButton: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  backgroundColor: '#2196F3',  // Modern blue shade
  paddingVertical: 14, // Adjusted padding for better balance
  paddingHorizontal: 20,
  borderRadius: 40,  // More rounded for a smooth look
  position: 'absolute',
  bottom: 16,
  left: 16,
  right: 16,
  elevation: 6, // Shadow effect
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.2,
  shadowRadius: 4,
},
cartInfo: {
  flex: 1,
  alignItems: 'center',
},
cartText: {
  color: '#fff',
  fontSize: 16,
  fontWeight: 'bold',
},
cartDetails: {
  color: '#fff',
  fontSize: 14,
},
cartIcon: {
  width: 28,
  height: 28,
  tintColor: '#2196F3',  // Matching the button color
},
cartIconContainer: {
  backgroundColor: '#fff',
  borderRadius: 20,  // Circular background for icon
  padding: 8,
},
});
