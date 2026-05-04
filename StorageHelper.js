import AsyncStorage from '@react-native-async-storage/async-storage';

const FRIENDS_KEY = '@oiii_friends';

export const saveFriends = async (friends) => {
  try {
    const jsonValue = JSON.stringify(friends);
    await AsyncStorage.setItem(FRIENDS_KEY, jsonValue);
    return true;
  } catch (e) {
    console.error("Error saving friends", e);
    return false;
  }
};

export const loadFriends = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(FRIENDS_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : {};
  } catch (e) {
    console.error("Error loading friends", e);
    return {};
  }
};

export const saveSingleFriend = async (name, friendData) => {
  try {
    const currentFriends = await loadFriends();
    currentFriends[name] = friendData;
    await saveFriends(currentFriends);
    return true;
  } catch (e) {
    console.error("Error saving friend", e);
    return false;
  }
};

export const deleteFriend = async (name) => {
  try {
    const currentFriends = await loadFriends();
    delete currentFriends[name];
    await saveFriends(currentFriends);
    return currentFriends;
  } catch (e) {
    console.error("Error deleting friend", e);
    return null;
  }
};