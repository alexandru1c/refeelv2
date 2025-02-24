import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Layout, Card, Text, Spinner } from '@ui-kitten/components';
import { supabase } from './../../supabase';

// Static mapping for restaurant logos using folder names under assets/restaurants.
const restaurantImages = {
  mitzu: require('../../assets/restaurants/mitzu/logo.png'),
  mcdonalds: require('../../assets/restaurants/mcdonalds/logo.png'),
  // Add additional mappings as needed.
};

const getRestaurantLogo = (restaurantName) => {
  const key = restaurantName.toLowerCase().replace(/\s+/g, '');
  console.log("Using key:", key);
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
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => navigation.navigate('RestaurantDetail', { restaurant: item })}
    >
      <Card style={styles.card} status="basic">
        <Image
          source={getRestaurantLogo(item.name)}
          style={[styles.logo, { backgroundColor: '#eee' }]}
          resizeMode="contain"
        />
        <Text category="h6" style={styles.itemTitle}>{item.name}</Text>
        {item.description && (
          <Text appearance="hint" style={styles.itemDescription}>{item.description}</Text>
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
        key="2"
        data={restaurants}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        numColumns={2}
        contentContainerStyle={styles.list}
      />
    </Layout>
  );
}

const windowWidth = Dimensions.get('window').width;
const cardWidth = (windowWidth - 48) / 2; // (16*2 padding + 16 between cards)

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
  itemContainer: {
    flex: 1,
    margin: 8,
  },
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    alignItems: 'center',
    padding: 0,
    width: cardWidth,
  },
    logo: {
        width: cardWidth,
        height: cardWidth,
    },
  itemTitle: {
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  itemDescription: {
    textAlign: 'center',
    marginBottom: 8,
    paddingHorizontal: 8,
  },
});
