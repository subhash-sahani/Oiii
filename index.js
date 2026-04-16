import { AppRegistry, DeviceEventEmitter } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { RNAndroidNotificationListenerHeadlessJsName } from 'react-native-android-notification-listener';
import { processIncomingNotification } from './OiiiListener';

/**
 * The Headless Task
 * This runs in the background even when the app is closed.
 */
const headlessNotificationListener = async ({ notification }) => {
    if (notification) {
        // 1. Convert the JSON string to an object
        const data = JSON.parse(notification);

        // 2. Use your logic from Step 13 to check the sender/app
        const result = processIncomingNotification(data);
        
        if (result) {
            // 3. Broadcast the 'Oiii' event to the UI (App.tsx)
            // This works if the app is open or in the background.
            DeviceEventEmitter.emit('triggerOiii', result);
            console.log(`[Oiii Background] Triggered bouncer for: ${data.title}`);
        }
    }
};

// Register the background task with the specific library name
AppRegistry.registerHeadlessTask(
    RNAndroidNotificationListenerHeadlessJsName, 
    () => headlessNotificationListener
);

// Standard app registration
AppRegistry.registerComponent(appName, () => App);