import React from 'react';
import { StyleSheet } from 'react-native';
import { Layout, Text, Button } from '@ui-kitten/components';
import { Video } from 'expo-av';

export default function WelcomeScreen({ navigation }) {
  return (
    <Layout style={styles.container}>
      <Video
        source={require('../assets/background.mp4')}
        rate={1.0}
        volume={1.0}
        isMuted={true}
        resizeMode="cover"
        shouldPlay
        isLooping
        style={styles.backgroundVideo}
      />
      <Layout style={styles.overlay}>
        <Text category='h1' style={styles.title}>
          Welcome to Refeel!
        </Text>
        <Button style={styles.button} status="primary" onPress={() => navigation.navigate('Login')}>
          Login
        </Button>
        <Button style={styles.buttonOutline} appearance="outline" onPress={() => navigation.navigate('Signup')}>
          New here? Signup
        </Button>
      </Layout>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#000', // fallback background color
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    // Optional semi-transparent overlay for readability
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  title: {
    marginBottom: 40,
    color: '#FFFFFF', // white for contrast on video
    textAlign: 'center',
  },
  button: {
    marginBottom: 20,
    width: '80%',
    borderRadius: 30,
  },
  buttonOutline: {
    marginBottom: 20,
    width: '80%',
    borderRadius: 30,
  },
});
