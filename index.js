import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import RNAndroidNotificationListener from 'react-native-android-notification-listener';
import { handleNotification } from './OiiiListener';

// This is the background task that runs when a notification arrives
const headlessNotificationListener = async ({ notification }) => {
  if (notification) {
    const data = JSON.parse(notification);
    
    // We check if the notification is from WhatsApp
    if (data.app === 'com.whatsapp') {
      console.log('Oiii: WhatsApp message detected from:', data.title);
      
      // Trigger the bounce logic we wrote in OiiiListener.js
      handleNotification(data.title, data.text);
    }
  }
};

// Register the background task
AppRegistry.registerHeadlessTask(
  'RNAndroidNotificationListenerHeadlessJsName',
  () => headlessNotificationListener
);

AppRegistry.registerComponent(appName, () => App);