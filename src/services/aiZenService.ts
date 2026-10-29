import AsyncStorage from '@react-native-async-storage/async-storage';

export const AI_BASELINE_KEY = '@shaniwar_ai_energy_baseline_v1';

export type EnergyLeakId =
  | 'dopamine_feeds'
  | 'fragmented_work'
  | 'morning_inertia'
  | 'restless_mind';

export interface EnergyLeakOption {
  id: EnergyLeakId;
  label: string;
  tagline: string;
  icon: string;
  bodhidharmaDiagnosis: string;
  notificationArchetype: 'INTERCEPT_MIRROR' | 'SINGLE_POINT' | 'DAWN_IGNITOR' | 'STILLNESS_ANCHOR';
  priorityFocus: string;
}

export const ENERGY_LEAK_OPTIONS: EnergyLeakOption[] = [
  {
    id: 'dopamine_feeds',
    label: 'Dopamine Doomscrolling',
    tagline: 'Shorts, Reels, and late-night feed loops sucking attention.',
    icon: '⚡',
    bodhidharmaDiagnosis:
      'You feed the machine with seconds of your life and wonder why your soul is empty. We will not cage you with child locks. We will hold up the mirror. Stand at the threshold.',
    notificationArchetype: 'INTERCEPT_MIRROR',
    priorityFocus: 'Obsidian Shield & 7-Second Witness Mirror',
  },
  {
    id: 'fragmented_work',
    label: 'Workday Fragmentation',
    tagline: 'Rapid tab switching, urgent pings, and shallow multitasking.',
    icon: '💼',
    bodhidharmaDiagnosis:
      'Ten open tabs is not work; it is cowardice running from one difficult thought. When you work, work. When you stop, stop.',
    notificationArchetype: 'SINGLE_POINT',
    priorityFocus: 'Deep Work Protection Window & Osho Midday STOP',
  },
  {
    id: 'morning_inertia',
    label: 'Morning Inertia & Snooze',
    tagline: 'Dragging out of bed, hitting snooze, morning brain fog.',
    icon: '🌅',
    bodhidharmaDiagnosis:
      'The day does not begin when you finally roll out of bed. It begins the instant consciousness returns. Touch your feet to the earth. Ignite the solar arc.',
    notificationArchetype: 'DAWN_IGNITOR',
    priorityFocus: '20-Step CoreMotion Walk & Dawn Kundalini Breath',
  },
  {
    id: 'restless_mind',
    label: 'Restless Mind & Anxiety',
    tagline: 'Racing thoughts, overthinking, inability to enter stillness.',
    icon: '🌀',
    bodhidharmaDiagnosis:
      'Your mind is a room full of shouting voices because you believe you are one of them. Sit back into the witness. The breath is your anchor.',
    notificationArchetype: 'STILLNESS_ANCHOR',
    priorityFocus: '33 Living Spine Sadhana & Resonant Decay Silence',
  },
];

export interface AiDiagnosticProfile {
  leakId: EnergyLeakId;
  diagnosisText: string;
  notificationArchetype: string;
  priorityFocus: string;
  calibratedAt: string;
}

export const aiZenService = {
  getLeakOption(id: EnergyLeakId): EnergyLeakOption {
    const found = ENERGY_LEAK_OPTIONS.find((opt) => opt.id === id);
    return found || ENERGY_LEAK_OPTIONS[0];
  },

  async saveBaselineDiagnostic(leakId: EnergyLeakId): Promise<AiDiagnosticProfile> {
    const option = this.getLeakOption(leakId);
    const profile: AiDiagnosticProfile = {
      leakId,
      diagnosisText: option.bodhidharmaDiagnosis,
      notificationArchetype: option.notificationArchetype,
      priorityFocus: option.priorityFocus,
      calibratedAt: new Date().toISOString(),
    };

    try {
      await AsyncStorage.setItem(AI_BASELINE_KEY, JSON.stringify(profile));
    } catch (e) {
      console.warn('[AIZen] Failed to persist energy baseline:', e);
    }

    return profile;
  },

  async getBaselineDiagnostic(): Promise<AiDiagnosticProfile | null> {
    try {
      const data = await AsyncStorage.getItem(AI_BASELINE_KEY);
      if (!data) return null;
      return JSON.parse(data) as AiDiagnosticProfile;
    } catch {
      return null;
    }
  },

  getCuratedNotificationCopy(archetype: string): { title: string; body: string } {
    switch (archetype) {
      case 'INTERCEPT_MIRROR':
        return {
          title: 'THE MIRROR IS ACTIVE',
          body: 'You are at the threshold. Notice the unconscious impulse before you enter.',
        };
      case 'SINGLE_POINT':
        return {
          title: 'DEEP WORK FOCUS',
          body: 'One single task. No second tabs. Guard your prana.',
        };
      case 'DAWN_IGNITOR':
        return {
          title: 'SOLAR IGNITION',
          body: 'Feet to the floor. Twenty steps to wakefulness. Snooze does not exist.',
        };
      case 'STILLNESS_ANCHOR':
      default:
        return {
          title: 'RETURN TO THE WITNESS',
          body: 'Straighten your spine. One conscious breath. Let the noise dissolve.',
        };
    }
  },
};
