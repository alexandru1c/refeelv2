import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Layout, Card, Text, Spinner } from '@ui-kitten/components';
import { supabase } from './../../supabase';

export default function InsideRestaurantScreen({ route, navigation }) {
  const { restaurant } = route.params;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('restaurantId', restaurant.id);
    if (error) {
      console.error('Error fetching products:', error);
    } else {
      setProducts(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    setProducts([]);
    setLoading(true);
    fetchProducts();
  }, [restaurant.id]);

  const renderProductItem = ({ item }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => navigation.navigate('ProductDetail', { product: item })}
    >
      <Layout style={styles.card}>
        <Image
          source={{ uri: item.image_url }}
          style={styles.logo}
          resizeMode="cover"
        />
      </Layout>
      <Text category="h6" style={styles.itemTitle}>{item.name}</Text>
      {item.price && (
        <Text appearance="hint" style={styles.itemPrice}>
          {item.price} RON
        </Text>
      )}
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
      <Card style={styles.restaurantCard} status="basic" disabled={true}>
        <Text category="h4">
          {restaurant.displayName || restaurant.name}
        </Text>
        {restaurant.description && (
          <Text appearance="hint">{restaurant.description}</Text>
        )}
      </Card>
      <Text category="h5" style={styles.productsHeader}>Products</Text>
      <FlatList
      key="2"
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderProductItem}
        numColumns={2}
        contentContainerStyle={styles.productsList}
      />
    </Layout>
  );
}

const windowWidth = Dimensions.get('window').width;
const cardWidth = (windowWidth - 48) / 2; // accounts for padding and margins

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
    padding: 16,
  },
  restaurantCard: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 16,
  },
  productsHeader: {
    marginBottom: 8,
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
  },
  logo: {
    width: '100%',
    height: '100%',
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
});
