import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

/**
 * Native iOS & Mobile Haptic Bridge.
 * Delivers refined tactile sensations for breath pacing,
 * vertebra ascension, and morning motion detection.
 */
export const HapticService = {
  /** Subtle tick when holding breath or navigating spine waypoints */
  selection: async () => {
    if (Platform.OS === 'web') return;
    try {
      await Haptics.selectionAsync();
    } catch {
      // Non-blocking fallback
    }
  },

  /** Gentle tactile cue on breath inhalation or step detected */
  lightImpact: async () => {
    if (Platform.OS === 'web') return;
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // Non-blocking fallback
    }
  },

  /** Grounding tactile pulse on breath exhalation */
  mediumImpact: async () => {
    if (Platform.OS === 'web') return;
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {
      // Non-blocking fallback
    }
  },

  /** Solid physical confirmation when waking motion threshold is crossed */
  heavyImpact: async () => {
    if (Platform.OS === 'web') return;
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    } catch {
      // Non-blocking fallback
    }
  },

  /** Celebratory tactile sequence when unlocking a new spine vertebra */
  successNotification: async () => {
    if (Platform.OS === 'web') return;
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {
      // Non-blocking fallback
    }
  },

  /**
   * Double-thump Presence Pulse:
   * A distinct double tactile rhythm (heavy + medium) that snaps the user out of distraction.
   */
  presencePulse: async () => {
    if (Platform.OS === 'web') return;
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      await new Promise((r) => setTimeout(r, 140));
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {
      // Non-blocking fallback
    }
  },

  /** Warning vibration on distraction or interruption */
  warningNotification: async () => {
    if (Platform.OS === 'web') return;
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    } catch {
      // Non-blocking fallback
    }
  },
};
