import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  Text,
  Alert, 
  DeviceEventEmitter,
  FlatList,
  TextInput
} from 'react-native';
import RNAndroidNotificationListener from 'react-native-android-notification-listener';

// Internal Imports
import Bouncer from './Bouncer';
import { friendRegistry } from './friendRegistry';
import { saveFriends, loadFriends, deleteFriend } from './StorageHelper';

const App = () => {
  const [activeBouncer, setActiveBouncer] = useState<any>(null);
  const [newName, setNewName] = useState('');
  const [friendsList, setFriendsList] = useState<any[]>([]);

  // 1. Initial Load & Notification Listener
  useEffect(() => {
    const init = async () => {
      const saved = await loadFriends();
      // Merge defaults with saved friends and update list state
      const combined = { ...friendRegistry, ...saved };
      setFriendsList(Object.values(combined));
    };
    init();

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
    } else {
      Alert.alert("Permission", "Already enabled!");
    }
  };

  const testBounce = () => {
    const testFriend = (friendRegistry as any)["Lelouch"];
    if (testFriend) {
      setActiveBouncer(testFriend);
      setTimeout(() => setActiveBouncer(null), 10000);
    }
  };

  // 2. Add Friend Logic with UI Update
  const addNewFriend = async () => {
    if (newName.trim() === '') return;
    
    const newFriend = {
      name: newName,
      sticker: require('./assets/stickers/lelouch.png'),
      size: 100,
      speed: 5
    };

    const currentSaved = await loadFriends() || {};
    const updated = { ...currentSaved, [newName]: newFriend };
    
    await saveFriends(updated);
    
    // Crucial: Update the list so the UI reflects the change immediately
    const combined = { ...friendRegistry, ...updated };
    setFriendsList(Object.values(combined));
    
    Alert.alert("Success", `${newName} added!`);
    setNewName('');
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={friendsList}
        keyExtractor={(item) => item.name}
        ListHeaderComponent={
          <View style={styles.devPanel}>
            <Text style={styles.title}>Oiii Settings</Text>
            
            <TouchableOpacity style={styles.button} onPress={requestPermission}>
              <Text style={styles.buttonText}>Enable Notification Service</Text>
            </TouchableOpacity>
            
            <TextInput
              style={styles.input}
              placeholder="WhatsApp Contact Name"
              value={newName}
              onChangeText={setNewName}
              placeholderTextColor="#999"
            />
            
            <TouchableOpacity style={[styles.button, {backgroundColor: '#03dac6'}]} onPress={addNewFriend}>
              <Text style={[styles.buttonText, {color: '#000'}]}>+ Add Friend</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, {backgroundColor: '#bb86fc'}]} onPress={testBounce}>
              <Text style={styles.buttonText}>Manual Test (Lelouch)</Text>
            </TouchableOpacity>

            <Text style={styles.subTitle}>Active Oiii Friends:</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.friendRow}>
            <Text style={styles.friendName}>{item.name}</Text>
          </View>
        )}
      />

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
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  devPanel: { padding: 20, alignItems: 'center', marginTop: 40 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#6200ee', marginBottom: 20 },
  subTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 20, alignSelf: 'flex-start' },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    color: '#000'
  },
  button: {
    backgroundColor: '#6200ee',
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
    width: '100%',
    alignItems: 'center',
    elevation: 3,
  },
  buttonText: { color: 'white', fontWeight: 'bold' },
  friendRow: {
    backgroundColor: '#fff',
    padding: 15,
    marginHorizontal: 20,
    marginVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#eee'
  },
  friendName: { fontSize: 16, color: '#333' }
});

export default App;