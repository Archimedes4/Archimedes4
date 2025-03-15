import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { useEffect, useRef } from "react"
import { AppState, Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async (e) => {
    console.log(e)
    return {
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
  }},
});

export default function useNotificationHandler() {
  const appState = useRef(AppState.currentState);

  const notificationListener = useRef<Notifications.Subscription | null>(null);

  async function handleNotifications() {
    const result = await Notifications.getLastNotificationResponseAsync()
    router.push(result?.notification.request.content.data.url)
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