import AsyncStorage from '@react-native-async-storage/async-storage';
import { RoutineTimelineItem, routineService } from './routineService';

export const AI_BASELINE_KEY = '@shanivar_ai_energy_baseline_v2';

export type EnergyLeakId =
  | 'dopamine_feeds'
  | 'morning_inertia'
  | 'fragmented_work'
  | 'restless_mind';

export interface EnergyLeakOption {
  id: EnergyLeakId;
  label: string;
  tagline: string;
  icon: string;
  singleDiagnosis: string;
  priorityFocus: string;
  notificationArchetype: 'INTERCEPT_MIRROR' | 'DAWN_IGNITOR' | 'SINGLE_POINT' | 'STILLNESS_ANCHOR';
}

export const ENERGY_LEAK_OPTIONS: EnergyLeakOption[] = [
  {
    id: 'dopamine_feeds',
    label: 'The Midnight Scroll',
    tagline: 'Shorts, Reels, and algorithmic rabbit holes devouring the night.',
    icon: '⚡',
    singleDiagnosis:
      'You feed the machine with seconds of your life and wonder why your soul is empty. The midnight screen is the revenge of an unlived day. Stand at the threshold.',
    priorityFocus: 'Obsidian Shield & 7-Second Witness Mirror',
    notificationArchetype: 'INTERCEPT_MIRROR',
  },
  {
    id: 'morning_inertia',
    label: 'The Morning Paralysis',
    tagline: 'Dragging out of bed, hitting snooze, foggy starts before feet touch earth.',
    icon: '🌅',
    singleDiagnosis:
      'The day does not begin when you finally roll out of bed. It begins the instant consciousness returns. Touch your feet to the earth. Ignite the solar arc.',
    priorityFocus: '20-Step CoreMotion Walk & Dawn Kundalini Breath',
    notificationArchetype: 'DAWN_IGNITOR',
  },
  {
    id: 'fragmented_work',
    label: 'The Fractured Workday',
    tagline: 'Forty open tabs, urgent pings, and shallow multitasking frenzy.',
    icon: '💼',
    singleDiagnosis:
      'Ten open tabs is not work; it is cowardice running from one difficult thought. When you work, work. When you stop, stop.',
    priorityFocus: 'Deep Work Protection Window & Osho Midday STOP',
    notificationArchetype: 'SINGLE_POINT',
  },
  {
    id: 'restless_mind',
    label: 'The Restless Twilight',
    tagline: 'Racing thoughts, overthinking, anxiety masking nervous system fatigue.',
    icon: '🌀',
    singleDiagnosis:
      'Your mind is a room full of shouting voices because you believe you are one of them. Sit back into the witness. The breath is your anchor.',
    priorityFocus: '33 Living Spine Sadhana & Resonant Decay Silence',
    notificationArchetype: 'STILLNESS_ANCHOR',
  },
];

export interface TimePoint {
  hour: number;
  minute: number;
}

export interface CurrentRealityProfile {
  wakeTime: TimePoint; // e.g. 08:15 AM
  sleepTime: TimePoint; // e.g. 01:15 AM
  dailyDeepWorkHours: number; // e.g. 0.75 hours (45 min)
}

export interface TargetStanceProfile {
  wakeTime: TimePoint; // e.g. 05:30 AM
  sleepTime: TimePoint; // e.g. 10:00 PM
  dailyDeepWorkHours: number; // e.g. 4.0 hours
}

export interface DeltaLedger {
  lostMorningHours: number; // e.g. 2.75 hrs
  lostNightHours: number; // e.g. 3.25 hrs
  totalDailySurrenderedHours: number; // e.g. 4.5 hrs
  annualWakingDaysLost: number; // e.g. 68 full days/year
  annualConsciousHoursReclaimed: number; // e.g. 1,642 hrs/year
  sleepWindowTargetHours: number;
  sleepWindowTargetMinutes: number;
}

export interface FullOnboardingProfile {
  selectedLeaks: EnergyLeakId[];
  currentReality: CurrentRealityProfile;
  targetStance: TargetStanceProfile;
  deltaLedger: DeltaLedger;
  compoundDiagnosis: string;
  curatedArchetypes: string[];
  calibratedAt: string;
}

export const aiZenService = {
  getLeakOption(id: EnergyLeakId): EnergyLeakOption {
    const found = ENERGY_LEAK_OPTIONS.find((opt) => opt.id === id);
    return found || ENERGY_LEAK_OPTIONS[0];
  },

  /**
   * Generates Compound Bodhidharma Zen Synthesis strictly obeying the Three-Sentence Law.
   * Synthesizes the intersecting root causes when multiple attention leaks are selected.
   */
  generateCompoundDiagnosis(selectedLeaks: EnergyLeakId[]): {
    diagnosisText: string;
    priorityFocus: string;
    notificationArchetypes: string[];
  } {
    if (selectedLeaks.length === 0) {
      return {
        diagnosisText: 'Touch the conduits where your energy bleeds. Sovereign silence requires absolute honesty.',
        priorityFocus: 'Self-Inquiry & Baseline Grounding',
        notificationArchetypes: ['STILLNESS_ANCHOR'],
      };
    }

    if (selectedLeaks.length === 1) {
      const opt = this.getLeakOption(selectedLeaks[0]);
      return {
        diagnosisText: opt.singleDiagnosis,
        priorityFocus: opt.priorityFocus,
        notificationArchetypes: [opt.notificationArchetype],
      };
    }

    const hasMidnight = selectedLeaks.includes('dopamine_feeds');
    const hasMorning = selectedLeaks.includes('morning_inertia');
    const hasWork = selectedLeaks.includes('fragmented_work');
    const hasRestless = selectedLeaks.includes('restless_mind');

    // Multi-leak compound combinations (Three-Sentence Law)
    let diagnosisText = '';
    let priorityFocus = '';
    const archetypes: string[] = [];

    if (hasMidnight && hasMorning && hasWork && hasRestless) {
      diagnosisText =
        'The full siege: mind racing, morning sluggish, work scattered, feeds devouring the night. When everything is chaos, returning to the center is the only choice. We begin at vertebra zero.';
      priorityFocus = 'Complete Sovereign Sanctuary & Three Seals of Armor';
      archetypes.push('INTERCEPT_MIRROR', 'DAWN_IGNITOR', 'SINGLE_POINT', 'STILLNESS_ANCHOR');
    } else if (hasMidnight && hasMorning) {
      diagnosisText =
        'You do not wake up exhausted because you slept poorly; you scroll at midnight because you never claimed your dawn. The midnight screen is the revenge of an unlived day. We fix your sleep the instant your heels touch the earth.';
      priorityFocus = 'Dawn Walk Ignition & 10 PM Digital Blackout';
      archetypes.push('INTERCEPT_MIRROR', 'DAWN_IGNITOR');
    } else if (hasMidnight && hasWork) {
      diagnosisText =
        'You switch between fifty noisy browser tabs all day and self-medicate with algorithmic dopamine at night. Your attention is fractured from dawn until twilight. Choose one single task, take one conscious breath, and step into the circle.';
      priorityFocus = 'Deep Work Obsidian Shield & Evening Decompression';
      archetypes.push('INTERCEPT_MIRROR', 'SINGLE_POINT');
    } else if (hasWork && hasRestless) {
      diagnosisText =
        'Ten open tabs is not productivity; it is cowardice running from one difficult thought. Your racing thoughts reflect a scattered workspace. Sit back into the witness. Anchor the breath.';
      priorityFocus = 'Single-Point Execution & Midday Osho STOP';
      archetypes.push('SINGLE_POINT', 'STILLNESS_ANCHOR');
    } else if (hasMorning && hasRestless) {
      diagnosisText =
        'Your body awakens with a rush of cortisol because you drag yesterday into today. You cannot think your way out of morning fog. Stand upright. Breathe into the belly. Let the noise dissolve.';
      priorityFocus = 'Dawn Kundalini Breath & 33 Living Spine Grounding';
      archetypes.push('DAWN_IGNITOR', 'STILLNESS_ANCHOR');
    } else {
      diagnosisText =
        'Your life force is bleeding at multiple thresholds. We will not fix your life with productivity tips. We will place a mirror in your path. Stand upright.';
      priorityFocus = 'Obsidian Focus Shield & Sovereign Rhythm';
      archetypes.push('INTERCEPT_MIRROR', 'SINGLE_POINT');
    }

    return {
      diagnosisText,
      priorityFocus,
      notificationArchetypes: archetypes,
    };
  },

  /**
   * Computes the visceral "Delta Bridge" (The Ledger of Stolen Life)
   * contrasting Current Reality with the Target Stance.
   */
  computeDelta(
    current: CurrentRealityProfile,
    target: TargetStanceProfile
  ): DeltaLedger {
    // Current wake total minutes
    const curWakeMins = current.wakeTime.hour * 60 + current.wakeTime.minute;
    const tgtWakeMins = target.wakeTime.hour * 60 + target.wakeTime.minute;
    const morningDiffMins = Math.max(0, curWakeMins - tgtWakeMins);
    const lostMorningHours = Math.round((morningDiffMins / 60) * 10) / 10;

    // Current sleep total minutes (normalized across midnight)
    let curSleepMins = current.sleepTime.hour * 60 + current.sleepTime.minute;
    let tgtSleepMins = target.sleepTime.hour * 60 + target.sleepTime.minute;
    if (curSleepMins < 12 * 60) curSleepMins += 24 * 60; // e.g. 1:15 AM -> 25:15
    if (tgtSleepMins < 12 * 60) tgtSleepMins += 24 * 60; // e.g. 10:00 PM -> 22:00
    const nightDiffMins = Math.max(0, curSleepMins - tgtSleepMins);
    const lostNightHours = Math.round((nightDiffMins / 60) * 10) / 10;

    // Daily surrendered territory
    const totalDailySurrenderedHours = Math.round((lostMorningHours + lostNightHours) * 10) / 10;

    // Annual impact: 16 waking hours in a conscious human day
    const annualSurrenderedHours = totalDailySurrenderedHours * 365;
    const annualWakingDaysLost = Math.round(annualSurrenderedHours / 16);

    // Deep work reclaimed: Target (e.g. 4.0h) - Current (e.g. 0.75h)
    const dailyReclaimedFocus = Math.max(0, target.dailyDeepWorkHours - current.dailyDeepWorkHours);
    const annualConsciousHoursReclaimed = Math.round(dailyReclaimedFocus * 365);

    // Target Sleep duration
    let wakeMins = target.wakeTime.hour * 60 + target.wakeTime.minute;
    let sleepMins = target.sleepTime.hour * 60 + target.sleepTime.minute;
    if (wakeMins <= sleepMins) wakeMins += 24 * 60;
    const sleepDiff = wakeMins - sleepMins;
    const sleepWindowTargetHours = Math.floor(sleepDiff / 60);
    const sleepWindowTargetMinutes = sleepDiff % 60;

    return {
      lostMorningHours,
      lostNightHours,
      totalDailySurrenderedHours,
      annualWakingDaysLost,
      annualConsciousHoursReclaimed,
      sleepWindowTargetHours,
      sleepWindowTargetMinutes,
    };
  },

  /**
   * Generates a suggested 24/7 Dincharya (River Stones in a Zen Garden)
   * tailored to bridge the user's specific delta and leaks.
   */
  generateAdaptiveDincharya(
    target: TargetStanceProfile,
    selectedLeaks: EnergyLeakId[]
  ): RoutineTimelineItem[] {
    const wakeH = target.wakeTime.hour;
    const wakeM = target.wakeTime.minute;
    const sleepH = target.sleepTime.hour;
    const sleepM = target.sleepTime.minute;

    const items: RoutineTimelineItem[] = [
      {
        id: 'wake_alarm',
        type: 'alarm',
        title: 'Dawn Ignition',
        subtitle: '20-Step CoreMotion Walk • Zero Snooze',
        tag: 'CORE ANCHOR',
        timeDisplay: routineService.formatTimeDisplay(wakeH, wakeM),
        hour: wakeH,
        minute: wakeM,
        endHour: wakeH,
        endMinute: (wakeM + 15) % 60,
        enabled: true,
        notificationEnabled: true,
        isCustom: false,
        notificationTitle: '🔥 DAWN IGNITION',
        notificationBody: 'Feet to the earth. Twenty physical paces. Claim your morning.',
      },
      {
        id: 'dawn_breath',
        type: 'practice',
        title: 'Dawn Kundalini Breath & Spine Check',
        subtitle: 'Ascending Prana Wave • Box Breathing 4-4-4-4',
        tag: 'HYBRID MONK',
        timeDisplay: routineService.formatTimeDisplay((wakeH + 1) % 24, 0),
        hour: (wakeH + 1) % 24,
        minute: 0,
        endHour: (wakeH + 1) % 24,
        endMinute: 20,
        enabled: true,
        notificationEnabled: true,
        isCustom: false,
        notificationTitle: '⚡ DAWN BREATH',
        notificationBody: 'Sit upright. Align your 33 vertebrae. Breathe with intention.',
      },
      {
        id: 'protection_window',
        type: 'protection',
        title: 'The Golden Forge (Deep Work Shield)',
        subtitle: 'Obsidian Shield Active • Single-Point Execution',
        tag: 'CORE ANCHOR',
        timeDisplay: '09:00 AM – 01:00 PM',
        hour: 9,
        minute: 0,
        endHour: 13,
        endMinute: 0,
        enabled: true,
        notificationEnabled: true,
        isCustom: false,
        notificationTitle: '🛡️ THE GOLDEN FORGE',
        notificationBody: 'Four hours of impenetrable focus. Distraction shield engaged.',
      },
      {
        id: 'midday_stop',
        type: 'practice',
        title: 'Midday Osho STOP & Nourishment',
        subtitle: 'Freeze Attention • Screen-Free Nutrition & Optical Flow',
        tag: 'HYBRID MONK',
        timeDisplay: '01:15 PM',
        hour: 13,
        minute: 15,
        endHour: 14,
        endMinute: 0,
        enabled: true,
        notificationEnabled: true,
        isCustom: false,
        notificationTitle: '🛑 MIDDAY STOP',
        notificationBody: 'Stop everything. Witness your breath. Step away from the glass.',
      },
      {
        id: 'evening_transition',
        type: 'transition',
        title: 'Evening Sunset Decompression',
        subtitle: 'Optical Twilight Flow • Sever Work Armor',
        tag: 'DECOMPRESSION',
        timeDisplay: '06:30 PM',
        hour: 18,
        minute: 30,
        endHour: 19,
        endMinute: 15,
        enabled: true,
        notificationEnabled: true,
        isCustom: false,
        notificationTitle: '🌙 SUNSET THRESHOLD',
        notificationBody: 'The work day is dead. Do not carry its corpse into the evening.',
      },
      {
        id: 'sleep_sanctum',
        type: 'alarm',
        title: 'Digital Blackout (Sleep Sanctum)',
        subtitle: 'Phone Put Down • 7.5h Neural Slow-Wave Restoration',
        tag: 'CORE ANCHOR',
        timeDisplay: routineService.formatTimeDisplay(sleepH, sleepM),
        hour: sleepH,
        minute: sleepM,
        endHour: wakeH,
        endMinute: wakeM,
        enabled: true,
        notificationEnabled: true,
        isCustom: false,
        notificationTitle: '🌑 DIGITAL BLACKOUT',
        notificationBody: 'Glass goes dark. Nervous system returns to the quiet earth.',
      },
    ];

    // If midnight scroll was selected, reinforce an evening analog reading block
    if (selectedLeaks.includes('dopamine_feeds')) {
      items.splice(5, 0, {
        id: 'preset_reading',
        type: 'custom',
        title: 'Analog Wisdom & Reading',
        subtitle: 'Screen-Free Paper Book • Dissolve Cognitive Agitation',
        tag: 'STUDY',
        timeDisplay: '08:30 PM – 09:15 PM',
        hour: 20,
        minute: 30,
        endHour: 21,
        endMinute: 15,
        enabled: true,
        notificationEnabled: true,
        isCustom: true,
        notificationTitle: '📖 ANALOG WISDOM',
        notificationBody: 'Paper only. Zero blue light. Let the soul drink deep.',
      });
    }

    return items;
  },

  async saveOnboardingProfile(profile: FullOnboardingProfile): Promise<void> {
    try {
      await AsyncStorage.setItem(AI_BASELINE_KEY, JSON.stringify(profile));
    } catch (e) {
      console.warn('[AIZen] Failed to persist full profile:', e);
    }
  },

  async getOnboardingProfile(): Promise<FullOnboardingProfile | null> {
    try {
      const data = await AsyncStorage.getItem(AI_BASELINE_KEY);
      if (!data) return null;
      return JSON.parse(data) as FullOnboardingProfile;
    } catch {
      return null;
    }
  },
};
