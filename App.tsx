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
import { saveFriends, loadFriends, deleteFriend, saveSingleFriend } from './StorageHelper';
import { initNotificationListener } from './OiiiListener';

// Types
interface Friend {
  name: string;
  sticker: any;
  size?: number;
  speed?: number;
}

interface BouncerData {
  sticker: any;
  size?: number;
  speed?: number;
}

const App = () => {
  const [activeBouncer, setActiveBouncer] = useState<BouncerData | null>(null);
  const [newName, setNewName] = useState<string>('');
  const [friendsList, setFriendsList] = useState<Friend[]>([]);

  // 1. Initial Load, Notification Listener & Permission Check
  useEffect(() => {
    const init = async () => {
      // Check notification permission on startup
      const status = await RNAndroidNotificationListener.getPermissionStatus();
      if (status !== 'authorized') {
        Alert.alert(
          "Permission Needed",
          "Oiii needs notification access to detect your friends. Please enable it.",
          [{ text: "Open Settings", onPress: () => RNAndroidNotificationListener.requestPermission() }]
        );
      }

      // Load saved friends and merge with defaults
      const saved = await loadFriends();
      const combined = { ...friendRegistry, ...saved };
      setFriendsList(Object.values(combined));
    };
    init();

    // Initialize the real notification listener
    initNotificationListener((bouncerData) => {
      setActiveBouncer(bouncerData);
      setTimeout(() => setActiveBouncer(null), 15000);
    });

    // Listen for manual triggers
    const subscription = DeviceEventEmitter.addListener('triggerOiii', (data: BouncerData) => {
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
      Alert.alert("Permission", "Notification access is already enabled!");
    }
  };

  const testBounce = () => {
    const testFriend = (friendRegistry as any)["Lelouch"];
    if (testFriend) {
      setActiveBouncer(testFriend);
      setTimeout(() => setActiveBouncer(null), 10000);
    } else {
      Alert.alert("Test Failed", "Lelouch not found in registry. Check friendRegistry.js");
    }
  };

  // 2. Add Friend Logic
  const addNewFriend = async () => {
    if (newName.trim() === '') {
      Alert.alert("Error", "Please enter a name first!");
      return;
    }

    const newFriend: Friend = {
      name: newName.trim(),
      sticker: require('./assets/stickers/lelouch.png'),
      size: 100,
      speed: 5
    };

    const success = await saveSingleFriend(newName.trim(), newFriend);

    if (success) {
      const saved = await loadFriends();
      const combined = { ...friendRegistry, ...saved };
      setFriendsList(Object.values(combined));
      Alert.alert("Success", `${newName.trim()} added!`);
      setNewName('');
    } else {
      Alert.alert("Error", "Failed to save friend. Please try again.");
    }
  };

  // 3. Delete Friend Logic
  const handleDeleteFriend = async (name: string) => {
    Alert.alert(
      "Delete Friend",
      `Remove ${name} from Oiii?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const updated = await deleteFriend(name);
            if (updated !== null) {
              const combined = { ...friendRegistry, ...updated };
              setFriendsList(Object.values(combined));
            }
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={friendsList}
        keyExtractor={(item) => item.name}
        ListHeaderComponent={
          <View style={styles.devPanel}>
            <Text style={styles.title}>Oiii 👋</Text>

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

            <TouchableOpacity style={[styles.button, { backgroundColor: '#03dac6' }]} onPress={addNewFriend}>
              <Text style={[styles.buttonText, { color: '#000' }]}>+ Add Friend</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, { backgroundColor: '#bb86fc' }]} onPress={testBounce}>
              <Text style={styles.buttonText}>Manual Test (Lelouch)</Text>
            </TouchableOpacity>

            <Text style={styles.subTitle}>Active Oiii Friends:</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.friendRow}>
            <Text style={styles.friendName}>{item.name}</Text>
            <TouchableOpacity onPress={() => handleDeleteFriend(item.name)}>
              <Text style={styles.deleteButton}>✕</Text>
            </TouchableOpacity>
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
    borderColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  friendName: { fontSize: 16, color: '#333' },
  deleteButton: { fontSize: 16, color: '#ff4444', fontWeight: 'bold' }
});

export default App;