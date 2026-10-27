import { Platform } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import { missionRunner, MissionProgress } from '../features/alarm/MissionRunner';

/**
 * Native iOS & Mobile Accelerometer Hardware Bridge.
 * Binds device sensor stream directly to the Genuine Motion Tracker.
 */
export class MotionSensorService {
  private subscription: { remove: () => void } | null = null;
  private isAvailable = false;

  async startListening(
    updateIntervalMs = 50,
    onProgressUpdate?: (progress: MissionProgress) => void
  ): Promise<boolean> {
    if (Platform.OS === 'web') {
      return false;
    }

    try {
      this.isAvailable = await Accelerometer.isAvailableAsync();
      if (!this.isAvailable) {
        return false;
      }

      Accelerometer.setUpdateInterval(updateIntervalMs);

      this.subscription = Accelerometer.addListener(({ x, y, z }) => {
        // CoreMotion on iOS gives values in units of g (1.0 = 9.81 m/s²)
        // Convert to m/s²: value * 9.81
        const accelX = x * 9.81;
        const accelY = y * 9.81;
        const accelZ = z * 9.81;

        const progress = missionRunner.processMotionSample(accelX, accelY, accelZ);
        if (onProgressUpdate) {
          onProgressUpdate(progress);
        }
      });

      return true;
    } catch (e) {
      console.warn('Motion sensor listener unavailable:', e);
      return false;
    }
  }

  stopListening(): void {
    if (this.subscription) {
      this.subscription.remove();
      this.subscription = null;
    }
  }

  isSensorAvailable(): boolean {
    return this.isAvailable;
  }
}

export const motionSensorService = new MotionSensorService();
