import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

/**
 * Native iOS & Android Precision Micro-Frequency Haptic Bridge.
 * (Jira DEV-98: Tuned for breath pacing, spine energy ascension,
 * and seamless decay into pure silence).
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

  /**
   * Resonant Decay into Pure Silence (Jira DEV-98):
   * Mimics the strike of a hand-hammered Himalayan singing bowl.
   * A heavy initial kinetic pulse that gradually attenuates through
   * micro-intervals into stillness with zero harsh cutoff.
   */
  resonantDecayToSilence: async () => {
    if (Platform.OS === 'web') return;
    try {
      // Initial Strike
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      await new Promise((r) => setTimeout(r, 180));
      // First Harmonic Decay
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      await new Promise((r) => setTimeout(r, 240));
      // Second Harmonic Decay
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      await new Promise((r) => setTimeout(r, 320));
      // Final Whisper Tick
      await Haptics.selectionAsync();
      // -> Pure Silence
    } catch {
      // Non-blocking fallback
    }
  },

  /**
   * Vertebral Ascension Wave (Jira DEV-98):
   * An ascending micro-frequency wave that travels up the spine.
   */
  vertebralAscensionWave: async () => {
    if (Platform.OS === 'web') return;
    try {
      await Haptics.selectionAsync();
      await new Promise((r) => setTimeout(r, 100));
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      await new Promise((r) => setTimeout(r, 120));
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      await new Promise((r) => setTimeout(r, 140));
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    } catch {
      // Non-blocking fallback
    }
  },
};
