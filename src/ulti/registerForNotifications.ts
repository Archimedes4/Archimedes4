import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { loadingStateEnum } from '../Types'

export default async function registerForPushNotificationsAsync(): Promise<{
  result: loadingStateEnum.success
  token: string;
} | {
  result: loadingStateEnum.failed
  error: string;
}> {
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      return {
        result: loadingStateEnum.failed,
        error: 'Permission not granted to get push token for push notification!'
      }
    }

    //TODO fix
    const projectId = 'e37f58d3-106c-4403-9f4d-f65867548aec';
    if (!projectId) {
      return {
        result: loadingStateEnum.failed,
        error: 'Project ID not found'
      }
    }
    try {
      const pushTokenString = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data
      return {
        result: loadingStateEnum.success,
        token: pushTokenString
      }
    } catch (e: unknown) {
      return {
        result: loadingStateEnum.failed,
        error: `${e}`
      }
    }
  } else {
    return {
      result: loadingStateEnum.failed,
      error: 'Must use physical device for push notifications'
    }
  }
}