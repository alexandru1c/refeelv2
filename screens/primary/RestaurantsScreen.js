import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { Layout, Card, Text, Spinner } from '@ui-kitten/components';
import { supabase } from './../../supabase';

// Create a static mapping for restaurant logos.
// Keys must match your folder names (all lowercase, no spaces).
const restaurantImages = {
  mitzu: require('../../assets/restaurants/mitzu/logo.png'),
  mcdonalds: require('../../assets/restaurants/mcdonalds/logo.png'),
  // Add additional mappings for each restaurant folder as needed
};

const getRestaurantLogo = (restaurantName) => {
  const key = restaurantName.toLowerCase().replace(/\s+/g, '');
  return restaurantImages[key] || require('../../assets/restaurants/default.png');
};

export default function RestaurantsScreen({ navigation }) {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRestaurants = async () => {
    const { data, error } = await supabase
      .from('restaurants')
      .select('*');
    if (error) {
      console.error('Error fetching restaurants:', error);
    } else {
      setRestaurants(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('RestaurantDetail', { restaurant: item })}>
      <Card style={styles.card} status="basic">
        <Image
          source={getRestaurantLogo(item.name)}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text category="h6">{item.name}</Text>
        {item.description && (
          <Text appearance="hint">{item.description}</Text>
        )}
      </Card>
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
      <Text category='h1' style={styles.header}>Restaurants</Text>
      <FlatList
        data={restaurants}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    marginTop: 50,
    marginBottom: 16,
    textAlign: 'center',
    color: '#1976D2',
  },
  list: {
    paddingBottom: 80,
  },
  card: {
    marginBottom: 16,
    alignItems: 'center',
    padding: 16,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
});
