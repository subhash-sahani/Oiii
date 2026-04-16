import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  Text,
  Alert, 
  DeviceEventEmitter,
  TextInput // Added this
} from 'react-native';
import RNAndroidNotificationListener from 'react-native-android-notification-listener';

// Internal Imports
import Bouncer from './Bouncer';
import { friendRegistry } from './friendRegistry';
import { saveFriends } from './StorageHelper'; // Added this import

const App = () => {
  const [activeBouncer, setActiveBouncer] = useState<any>(null);
  const [newName, setNewName] = useState(''); // State for the input field

  // 1. Listen for background events
  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener('triggerOiii', (data) => {
      setActiveBouncer(data);
      setTimeout(() => setActiveBouncer(null), 15000);
    });
    return () => subscription.remove();
  }, []);

  const requestPermission = async () => {
    const status = await RNAndroidNotificationListener.getPermissionStatus();
    if (status !== 'authorized') {
      RNAndroidNotificationListener.requestPermission();
    }
  };

  const testBounce = () => {
    const testFriend = (friendRegistry as any)["Lelouch"];
    if (testFriend) {
      setActiveBouncer(testFriend);
      setTimeout(() => setActiveBouncer(null), 10000);
    }
  };

  // 2. Logic to add a new friend to storage
  const addNewFriend = async () => {
    if (newName.trim() === '') return;
    
    const updatedFriends = {
      ...friendRegistry,
      [newName]: {
        name: newName,
        sticker: require('./assets/stickers/lelouch.png'), // Defaulting to Lelouch
        size: 100,
        speed: 5
      }
    };

    await saveFriends(updatedFriends);
    Alert.alert("Success", `${newName} added! Now WhatsApp messages from them will trigger Oiii.`);
    setNewName('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.devPanel}>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Enable Notifications</Text>
        </TouchableOpacity>
        
        {/* ADD FRIEND UI SECTION */}
        <TextInput
          style={styles.input}
          placeholder="Enter WhatsApp Contact Name"
          value={newName}
          onChangeText={setNewName}
          placeholderTextColor="#999"
        />
        <TouchableOpacity style={[styles.button, {backgroundColor: '#03dac6'}]} onPress={addNewFriend}>
          <Text style={[styles.buttonText, {color: '#000'}]}>Add WhatsApp Friend</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={testBounce}>
          <Text style={styles.buttonText}>Test Bounce (Lelouch)</Text>
        </TouchableOpacity>
      </View>

      {activeBouncer && (
        <Bouncer 
          imageSource={activeBouncer.sticker} 
          size={activeBouncer.size || 100} 
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  devPanel: {
    marginTop: 80,
    alignItems: 'center',
    zIndex: 10,
  },
  input: {
    width: 250,
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    color: '#000'
  },
  button: {
    backgroundColor: '#6200ee',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    width: 250,
    alignItems: 'center',
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default App;