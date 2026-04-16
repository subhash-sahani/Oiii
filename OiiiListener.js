import { friendRegistry } from './friendRegistry';
import { loadFriends } from './StorageHelper';

/**
 * This function processes incoming notifications.
 * @param {string} senderName - The name displayed on the notification.
 * @param {string} messageText - The content of the message.
 * @param {object} notification - The raw notification object from the library.
 */
export const handleNotification = (senderName, messageText) => {
  console.log(`System: New notification from ${senderName}`);

  // 1. Check if the sender is in our Oiii Friend Registry
  const friend = friendRegistry[senderName];

  if (friend) {
    console.log(`Oiii! Triggering ${friend.name}'s bouncer.`);
    return {
      shouldBounce: true,
      sticker: friend.sticker,
      speed: friend.speed,
      size: friend.size
    };
  }

  // 2. If not a registered friend, stay quiet.
  return { shouldBounce: false };
};

export const processIncomingNotification = async (notification) => {
  // Check if it's WhatsApp
  if (notification.app !== 'com.whatsapp') return null;

  const sender = notification.title; // In WhatsApp, title is usually the sender's name

  // 1. Try to load custom friends from storage first
  const savedFriends = await loadFriends();
  
  // 2. Combine saved friends with your default hard-coded ones
  const combinedRegistry = { ...friendRegistry, ...savedFriends };

  const message = notification.text;

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