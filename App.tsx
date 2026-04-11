import React from 'react';
import { StyleSheet, View, SafeAreaView, StatusBar } from 'react-native';
import Bouncer from './Bouncer';
import { friendRegistry } from './friendRegistry';

const App = () => {
  // For testing, we'll trigger Lelouch's sticker
  const activeFriend = friendRegistry["Lelouch"];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.canvas}>
        {/* This is the character that will bounce across the screen */}
        <Bouncer
          imageSource={activeFriend.sticker}
          size={activeFriend.size}
          />
      </View>
      </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0', // Light background
  },
  canvas: {
    flex: 1,
    overflow: 'hidden', // Keeps the character inside the screen bounds
  },
});

export default App;