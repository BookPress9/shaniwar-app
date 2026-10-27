import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { HapticService } from './haptics';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => {
    HapticService.mediumImpact();
    return {
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    };
  },
});

if (Platform.OS !== 'web') {
  Notifications.addNotificationReceivedListener(async () => {
    await HapticService.mediumImpact();
  });
}

class NotificationService {
  private hasPermission = false;

  async checkPermissions(): Promise<boolean> {
    if (Platform.OS === 'web') return false;
    try {
      const { status } = await Notifications.getPermissionsAsync();
      this.hasPermission = status === 'granted';
      return this.hasPermission;
    } catch {
      return false;
    }
  }

  async requestPermissions(): Promise<boolean> {
    if (Platform.OS === 'web') return false;

    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      this.hasPermission = finalStatus === 'granted';
      return this.hasPermission;
    } catch (err) {
      console.warn('[NotificationService] Permission check failed:', err);
      return false;
    }
  }

  async scheduleRoutineReminder(
    id: string,
    title: string,
    body: string,
    hour: number,
    minute: number
  ): Promise<string | null> {
    try {
      const permitted = await this.requestPermissions();
      if (!permitted) return null;

      // Cancel existing reminder with this id identifier
      await this.cancelReminder(id);

      const trigger: Notifications.DailyTriggerInput = {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute,
      };

      const notificationId = await Notifications.scheduleNotificationAsync({
        identifier: id,
        content: {
          title,
          body,
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger,
      });

      return notificationId;
    } catch (err) {
      console.warn(`[NotificationService] Failed to schedule reminder for ${id}:`, err);
      return null;
    }
  }

  async cancelReminder(id: string): Promise<void> {
    try {
      await Notifications.cancelScheduledNotificationAsync(id);
    } catch (err) {
      // Ignore if not found
    }
  }

  async cancelAll(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (err) {
      console.warn('[NotificationService] Cancel all failed:', err);
    }
  }
}

export const notificationService = new NotificationService();
