import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Bouncer from './Bouncer';
import { handleNotification } from './OiiiListener';

import RNAndroidNotificationListener from 'react-native-android-notification-listener';

// Inside your App component:
const requestPermission = async () => {
  const status = await RNAndroidNotificationListener.getPermissionStatus();
  if (status !== 'authorized') {
    RNAndroidNotificationListener.requestPermission();
  }
};

const App = () => {
  const [activeBouncer, setActiveBouncer] = useState<any>(null);

  // This is a mock function to simulate a WhatsApp message coming in
  // In the real app, this is triggered by the native Android listener
  const simulateIncomingOiii = (name: string) => {
    const result = handleNotification(name, "Hey!");
    if (result.shouldBounce) {
      setActiveBouncer(result);
      
      // Auto-hide the character after 15 seconds
      setTimeout(() => setActiveBouncer(null), 15000);
    }
  };

  return (
    <View style={styles.fullScreen}>
      {activeBouncer && (
        <Bouncer 
          imageSource={activeBouncer.sticker} 
          size={activeBouncer.size} 
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent', // Crucial for the overlay feel
  },
  canvas: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});

export default App;