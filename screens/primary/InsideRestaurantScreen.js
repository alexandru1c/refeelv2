import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, Image } from 'react-native';
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
    <Card style={styles.productCard} status="basic">
      <Image
        source={{ uri: item.image_url }}
        style={styles.productLogo}
        resizeMode="cover"
      />
      <Text category="s1" style={styles.productName}>{item.name}</Text>
      {item.price && (
        <Text appearance="hint" style={styles.productPrice}>
          {item.price} RON
        </Text>
      )}
    </Card>
  );

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
      {loading ? (
        <Layout style={styles.loadingContainer}>
          <Spinner size="giant" />
        </Layout>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderProductItem}
          contentContainerStyle={styles.productsList}
        />
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
  productCard: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
    padding: 0,
  },
  productLogo: {
    width: '100%',
    height: 200,
  },
  productName: {
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  productPrice: {
    textAlign: 'center',
    marginBottom: 8,
    paddingHorizontal: 8,
  },
});
