import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, TouchableOpacity, Image, Dimensions, Alert } from 'react-native';
import { Layout, Card, Text, Spinner, Button, Icon } from '@ui-kitten/components';
import { supabase } from './../../supabase';

const PlusIcon = (props) => <Icon {...props} name="plus-outline" />;

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

  const handleAddProduct = (product) => {
    Alert.alert("Produs adaugat", `${product.name} a fost adaugat in cosul de cumparaturi.`);
  };

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
        <Button 
          style={styles.addButton} 
          accessoryLeft={PlusIcon} 
          appearance="ghost"
          onPress={() => handleAddProduct(item)}
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
      <Text category='h5' style={styles.productsHeader}>Products</Text>
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
const cardWidth = (windowWidth - 48) / 2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
    padding: 16,
  },
  productsHeader: {
    marginBottom: 8,
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
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    // Android elevation
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
});
