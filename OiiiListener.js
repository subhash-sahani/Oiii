import { friendRegistry } from './friendRegistry';

/**
 * This function processes incoming notifications.
 * @param {string} senderName - The name displayed on the notification.
 * @param {string} messageText - The content of the message.
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