import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, TouchableOpacity, Image, Dimensions, View, Animated } from 'react-native';
import { Layout, Text, Spinner, Button, Icon } from '@ui-kitten/components';
import { supabase } from './../../supabase';
import { useCart } from './../../CartContext';

export default function InsideRewardsScreen({ route, navigation }) {
  const { restaurant } = route.params;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { cartItems, addToCart } = useCart();
  const scaleAnim = new Animated.Value(1);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products_rewards')
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
    // Simple animation effect
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    addToCart(product);
  };

  const totalCartQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalCartCoins = cartItems.reduce((sum, item) => sum + item.coins * item.quantity, 0);

  const renderProductItem = ({ item }) => (
    <TouchableOpacity style={styles.itemContainer}>
      <Layout style={styles.card}>
        <Image source={{ uri: item.image_url }} style={styles.logo} resizeMode="cover" />
        <Animated.View style={[styles.addButtonWrapper, { transform: [{ scale: scaleAnim }] }]}>
          <TouchableOpacity style={styles.addButton} onPress={() => handleAddProduct(item)}>
            <Icon name="plus-circle-outline" style={styles.addIcon} fill="#fff" />
          </TouchableOpacity>
        </Animated.View>
      </Layout>
      <Text category="h6" style={styles.itemTitle}>{item.name}</Text>
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
        <TouchableOpacity style={styles.cartButton} onPress={() => navigation.navigate('RewardsCartScreen')}>
          <View style={styles.cartInfo}>
            <Text style={styles.cartText}>Your Cart</Text>
            <Text style={styles.cartDetails}>
              {totalCartQuantity} items | {totalCartCoins} coins
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
  card: { borderRadius: 16, width: Dimensions.get('window').width / 2 - 24, height: 150, overflow: 'hidden' },
  logo: { width: '100%', height: '100%' },

  /** ✅ Modern Add Button */
  addButtonWrapper: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    borderRadius: 50,
    elevation: 4, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
addButton: {
    width: 45,
    height: 45,
    borderRadius: 50,
    backgroundColor: '#00C6A7', // Modern Teal (You can change this)
    justifyContent: 'center',
    alignItems: 'center',
},

  addIcon: {
    width: 30,
    height: 30,
    tintColor: '#fff',
  },

  /** Cart Button */
  cartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#2196F3',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 40,
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    elevation: 6,
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
  },
  cartIconContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 8,
  },

  /** Product Information */
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 6,
  },
  itemPrice: {
    fontSize: 14,
    color: '#757575',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

