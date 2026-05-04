import RNAndroidNotificationListener from 'react-native-android-notification-listener';
import { friendRegistry } from './friendRegistry';
import { loadFriends } from './StorageHelper';

// Initialize the notification listener - call this in App.js on startup
export const initNotificationListener = (onBouncerTrigger) => {
  RNAndroidNotificationListener.onNotificationReceived = async (notification) => {
    const result = await processIncomingNotification(notification);
    if (result) {
      onBouncerTrigger(result);
    }
  };
};

export const handleNotification = async (senderName) => {
  console.log(`System: Manual check for ${senderName}`);

  const savedFriends = await loadFriends().catch(() => ({}));
  const combinedRegistry = { ...friendRegistry, ...savedFriends };
  const friend = combinedRegistry[senderName];

  if (friend) {
    return {
      shouldBounce: true,
      sticker: friend.sticker,
      speed: friend.speed || 5,
      size: friend.size || 100
    };
  }

  return { shouldBounce: false };
};

export const processIncomingNotification = async (notification) => {
  if (notification.app !== 'com.whatsapp') return null;

  // subText is more reliable for actual sender name in WhatsApp
  const sender = notification.subText || notification.title;
  
  const savedFriends = await loadFriends().catch(() => ({}));
  const combinedRegistry = { ...friendRegistry, ...savedFriends };

  console.log(`Checking registry for: ${sender}`);

  const friendMatch = combinedRegistry[sender];

  if (friendMatch) {
    return {
      name: friendMatch.name,
      sticker: friendMatch.sticker,
      size: friendMatch.size || 100,
      speed: friendMatch.speed || 5,
    };
  }

  return null;
};