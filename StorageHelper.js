import AsyncStorage from '@react-native-async-storage/async-storage';

const FRIENDS_KEY = '@oiii_friends';

export const saveFriends = async (friends) => {
  try {
    const jsonValue = JSON.stringify(friends);
    await AsyncStorage.setItem(FRIENDS_KEY, jsonValue);
  } catch (e) {
    console.error("Error saving friends", e);
  }
};

export const loadFriends = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(FRIENDS_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error("Error loading friends", e);
  }
};