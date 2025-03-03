import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Layout, Text } from '@ui-kitten/components';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

export default function MapScreen() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  // Fetch location when the component mounts
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location.coords);
    })();
  }, []);

  // If the location is not loaded yet, show a loading message
  if (errorMsg) {
    return (
      <Layout style={styles.container}>
        <Text>{errorMsg}</Text>
      </Layout>
    );
  }

  if (!location) {
    return (
      <Layout style={styles.container}>
        <Text>Loading...</Text>
      </Layout>
    );
  }

  return (
    <Layout style={styles.container}>
      <Text category="h1">Map</Text>
      {/* Interactive Map */}
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        showsUserLocation={true} // This will show the user's current location
        followUserLocation={true} // This will make the map follow the user's location
      >
        {/* Add a marker at the user's location */}
        <Marker coordinate={{ latitude: location.latitude, longitude: location.longitude }} title="You are here" />
      </MapView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  map: {
    width: '100%',
    height: '80%',
  },
});
