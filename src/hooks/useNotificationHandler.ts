import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { useEffect, useRef } from "react"
import { AppState, Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async (e) => {
    console.log(e)
    return {
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }},
});

export default function useNotificationHandler() {
  const appState = useRef(AppState.currentState);

  const notificationListener = useRef<Notifications.Subscription | null>(null);

  async function handleNotifications() {
    const result = await Notifications.getLastNotificationResponseAsync()
    const url = result?.notification.request.content.data.url
    if (typeof url === 'string') {
      router.push(url)
    }
  }

  useEffect(() => {
    if (Platform.OS !== 'ios') {
      return
    }
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log(notification)
    });
    handleNotifications()
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        handleNotifications()
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [])
  return null
}