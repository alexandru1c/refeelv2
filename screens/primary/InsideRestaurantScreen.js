import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, TouchableOpacity, Image, Dimensions } from 'react-native';
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
      {item.price && <Text appearance="hint" style={styles.itemPrice}>{item.price} RON</Text>}
      {item.coins && <Text appearance="hint" style={styles.itemPrice}>{item.coins} coins</Text>}
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
        keyExtractor={(item) => `${item.product_id || item.id}`} // ✅ Ensures unique key
        renderItem={renderProductItem}
        numColumns={2}
        contentContainerStyle={styles.productsList}
      />
      {cartItems.length > 0 && (
        <TouchableOpacity style={styles.cartButton} onPress={() => navigation.navigate('CartScreen')}>
          <Icon name="shopping-cart-outline" style={styles.cartIcon} fill="#fff" />
          <Text style={styles.cartCount}>{cartItems.length}</Text>
        </TouchableOpacity>
      )}
    </Layout>
  );
}

const windowWidth = Dimensions.get('window').width;
const cardWidth = (windowWidth - 48) / 2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
    padding: 16,
  },
  productsHeader: {
    marginTop: 50,
    marginBottom: 16,
    textAlign: 'left',
    color: '#000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productsList: {
    paddingBottom: 80,
  },
  itemContainer: {
    flex: 1,
    margin: 8,
    alignItems: 'center',
  },
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    width: cardWidth,
    height: cardWidth,
    backgroundColor: '#fff',
    position: 'relative',
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  addButton: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 4,
  },
  itemTitle: {
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  itemPrice: {
    textAlign: 'center',
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  cartButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: '#1976D2',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 8,
    elevation: 5,
  },
  cartIcon: {
    width: 24,
    height: 24,
  },
  cartCount: {
    color: '#fff',
    marginLeft: 4,
  },
});
