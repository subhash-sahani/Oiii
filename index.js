import { AppRegistry, DeviceEventEmitter } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { RNAndroidNotificationListenerHeadlessJsName } from 'react-native-android-notification-listener';
import { processIncomingNotification } from './OiiiListener';

const headlessNotificationListener = async ({ notification }) => {
    if (!notification) return;

    try {
        const data = typeof notification === 'string' 
            ? JSON.parse(notification) 
            : notification;

        // Only process WhatsApp notifications
        if (data.app !== 'com.whatsapp') return;

        const result = await processIncomingNotification(data);

        if (result) {
            DeviceEventEmitter.emit('triggerOiii', result);
            console.log(`[Oiii Background] Triggered bouncer for: ${data.title}`);
        } else {
            console.log(`[Oiii Background] No match found for: ${data.title}`);
        }
    } catch (error) {
        console.error("[Oiii] Error parsing notification:", error);
    }
};

// Register background headless task FIRST
AppRegistry.registerHeadlessTask(
    RNAndroidNotificationListenerHeadlessJsName,
    () => headlessNotificationListener
);

// Register main app component
AppRegistry.registerComponent(appName, () => App);