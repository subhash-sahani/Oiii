import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Bouncer from './Bouncer';
import { handleNotification } from './OiiiListener';

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
  fullScreen: { flex: 1, backgroundColor: 'transparent' }
});

export default App;