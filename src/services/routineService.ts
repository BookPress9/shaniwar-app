import AsyncStorage from '@react-native-async-storage/async-storage';
import { notificationService } from './notificationService';
import { dbService } from './db';

export type RoutineItemType = 'alarm' | 'protection' | 'practice' | 'transition' | 'custom';
export type DincharyaArchetype = 'builder' | 'student' | 'parent' | 'professional';

export interface ArchetypeMeta {
  id: DincharyaArchetype;
  name: string;
  tagline: string;
  description: string;
  icon: string;
}

export const ARCHETYPES: ArchetypeMeta[] = [
  {
    id: 'builder',
    name: 'Builder / Gen Z Creator',
    tagline: 'High Output & Unstoppable Focus',
    description: 'Designed for founders, coders, and ambitious creators who want to conquer the world without dopamine burnout.',
    icon: '⚡',
  },
  {
    id: 'student',
    name: 'Student / Scholar',
    tagline: 'Anti-Doomscroll & Deep Study',
    description: 'Shatter exam anxiety, break TikTok addiction, and lock into deep study sessions without phone distractions.',
    icon: '📚',
  },
  {
    id: 'parent',
    name: 'Parent / Family Anchor',
    tagline: 'Sacred Mornings & Present Family',
    description: 'Reclaim early morning solitude before the household wakes, and seal phone-free evenings for your children.',
    icon: '🏡',
  },
  {
    id: 'professional',
    name: 'Modern Householder',
    tagline: 'Career Mastery & True Decompression',
    description: 'Armor your high-yield workday from Slack noise and consciously drop work stress at the evening threshold.',
    icon: '💼',
  },
];

export interface RoutineTimelineItem {
  id: string;
  type: RoutineItemType;
  title: string;
  timeDisplay: string;
  hour: number;
  minute: number;
  endHour?: number;
  endMinute?: number;
  subtitle: string;
  tag: string;
  isHybridMonkPath?: boolean;
  isCustom?: boolean;
  enabled: boolean;
  notificationEnabled: boolean;
  missionType?: 'walk' | 'shake' | 'photo';
  targetCount?: number;
  practiceType?: 'kundalini_breath' | 'osho_stop' | 'evening_witness';
  notificationTitle: string;
  notificationBody: string;
}

const STORAGE_KEY = '@hybrid_monk_dincharya_v2';
const ARCHETYPE_KEY = '@hybrid_monk_dincharya_archetype';

const ARCHETYPE_PRESETS: Record<DincharyaArchetype, RoutineTimelineItem[]> = {
  builder: [
    {
      id: 'wake_alarm',
      type: 'alarm',
      title: 'The Wake Alarm (Morning Ignition)',
      timeDisplay: '05:30 AM',
      hour: 5,
      minute: 30,
      subtitle: '20-Step CoreMotion Walk • Impossible to Snooze',
      tag: 'CORE ANCHOR',
      enabled: true,
      notificationEnabled: true,
      missionType: 'walk',
      targetCount: 20,
      notificationTitle: '🔥 WAKE UP, MONK',
      notificationBody: 'The morning ignition has begun. Stand up and complete your 20 steps.',
    },
    {
      id: 'dawn_breath',
      type: 'practice',
      title: 'Dawn Kundalini Breath',
      timeDisplay: '06:00 AM',
      hour: 6,
      minute: 0,
      subtitle: '3-Min Ascending Spine Charge • Clear Mental Fog',
      tag: 'HYBRID MONK PATH',
      isHybridMonkPath: true,
      enabled: true,
      notificationEnabled: true,
      practiceType: 'kundalini_breath',
      notificationTitle: '⚡ DAWN CHARGE',
      notificationBody: '3 minutes to electrify your spine and align your awareness.',
    },
    {
      id: 'protection_window',
      type: 'protection',
      title: 'Deep Work Protection Window',
      timeDisplay: '09:00 AM – 01:00 PM',
      hour: 9,
      minute: 0,
      endHour: 13,
      endMinute: 0,
      subtitle: 'Obsidian Shield • Distraction Blackout Active',
      tag: 'CORE ANCHOR',
      enabled: true,
      notificationEnabled: true,
      notificationTitle: '🛡️ MONK SHIELD ARMED',
      notificationBody: 'Your 4-hour high-yield protection window is active. Close all tabs.',
    },
    {
      id: 'midday_stop',
      type: 'practice',
      title: 'Midday Osho STOP',
      timeDisplay: '01:15 PM',
      hour: 13,
      minute: 15,
      subtitle: '60-Second Absolute Freeze • CoreMotion Tremor Check',
      tag: 'HYBRID MONK PATH',
      isHybridMonkPath: true,
      enabled: true,
      notificationEnabled: true,
      practiceType: 'osho_stop',
      notificationTitle: '🛑 STOP.',
      notificationBody: 'Freeze wherever you are for 60 seconds. Witness the observer.',
    },
    {
      id: 'evening_transition',
      type: 'transition',
      title: 'Evening Transition Threshold',
      timeDisplay: '06:30 PM',
      hour: 18,
      minute: 30,
      subtitle: 'Drop the Armor • Close Work Loops & Witness',
      tag: 'DECOMPRESSION',
      enabled: true,
      notificationEnabled: true,
      practiceType: 'evening_witness',
      notificationTitle: '🌙 DROP THE ARMOR',
      notificationBody: 'Work is finished. Step from the arena into presence.',
    },
    {
      id: 'sleep_sanctum',
      type: 'transition',
      title: 'Sleep Sanctum',
      timeDisplay: '10:00 PM',
      hour: 22,
      minute: 0,
      subtitle: 'Digital Blackout • Nervous System Restoration',
      tag: 'RECOVERY',
      enabled: true,
      notificationEnabled: true,
      notificationTitle: '🌑 SANCTUM SEALED',
      notificationBody: 'Disconnect from all screens. Sleep like a sovereign monk.',
    },
  ],
  student: [
    {
      id: 'wake_alarm',
      type: 'alarm',
      title: 'The Wake Alarm (Scholar Rise)',
      timeDisplay: '06:00 AM',
      hour: 6,
      minute: 0,
      subtitle: '25 Shakes Mission • Wake the Nervous System',
      tag: 'CORE ANCHOR',
      enabled: true,
      notificationEnabled: true,
      missionType: 'shake',
      targetCount: 25,
      notificationTitle: '📚 SCHOLAR, RISE',
      notificationBody: 'Shake off sleep fog. Today’s mastery begins now.',
    },
    {
      id: 'dawn_breath',
      type: 'practice',
      title: 'Brain Oxygenation Charge',
      timeDisplay: '06:30 AM',
      hour: 6,
      minute: 30,
      subtitle: '3-Min Focus Priming • Sharpen Memory Retainment',
      tag: 'HYBRID MONK PATH',
      isHybridMonkPath: true,
      enabled: true,
      notificationEnabled: true,
      practiceType: 'kundalini_breath',
      notificationTitle: '⚡ BRAIN CHARGE',
      notificationBody: 'Prime your prefrontal cortex with 3 minutes of high-frequency oxygenation.',
    },
    {
      id: 'protection_window',
      type: 'protection',
      title: 'Library Study Shield',
      timeDisplay: '02:00 PM – 06:00 PM',
      hour: 14,
      minute: 0,
      endHour: 18,
      endMinute: 0,
      subtitle: 'Anti-Doomscroll Lock • Undivided Exam & Project Focus',
      tag: 'CORE ANCHOR',
      enabled: true,
      notificationEnabled: true,
      notificationTitle: '🛡️ STUDY SHIELD ACTIVE',
      notificationBody: 'Phone distractions silenced. Lock in on your study material.',
    },
    {
      id: 'midday_stop',
      type: 'practice',
      title: 'Afternoon Brain Reset',
      timeDisplay: '04:15 PM',
      hour: 16,
      minute: 15,
      subtitle: '60-Second Stillness • Shatter Study Fatigue',
      tag: 'HYBRID MONK PATH',
      isHybridMonkPath: true,
      enabled: true,
      notificationEnabled: true,
      practiceType: 'osho_stop',
      notificationTitle: '🛑 BREATHE & PAUSE',
      notificationBody: 'Step back from the books for 60 seconds. Rest the intellect.',
    },
    {
      id: 'evening_transition',
      type: 'transition',
      title: 'Evening Synthesis & Decompression',
      timeDisplay: '08:30 PM',
      hour: 20,
      minute: 30,
      subtitle: 'Review Day’s Learnings • Detach from Performance Anxiety',
      tag: 'DECOMPRESSION',
      enabled: true,
      notificationEnabled: true,
      practiceType: 'evening_witness',
      notificationTitle: '🌙 CLOSE THE BOOKS',
      notificationBody: 'The mind has digested enough. Step into calm relaxation.',
    },
    {
      id: 'sleep_sanctum',
      type: 'transition',
      title: 'Sleep Sanctum',
      timeDisplay: '10:30 PM',
      hour: 22,
      minute: 30,
      subtitle: 'Screen-Free Memory Consolidation',
      tag: 'RECOVERY',
      enabled: true,
      notificationEnabled: true,
      notificationTitle: '🌑 RESTORE',
      notificationBody: 'Sleep consolidates memory. Screens off.',
    },
  ],
  parent: [
    {
      id: 'wake_alarm',
      type: 'alarm',
      title: 'Sacred Solitude Dawn',
      timeDisplay: '05:45 AM',
      hour: 5,
      minute: 45,
      subtitle: 'Wake Before Household • 20-Step Quiet Walk',
      tag: 'CORE ANCHOR',
      enabled: true,
      notificationEnabled: true,
      missionType: 'walk',
      targetCount: 20,
      notificationTitle: '🌅 SACRED SOLITUDE',
      notificationBody: 'Wake before the home stirs. These quiet morning minutes are yours.',
    },
    {
      id: 'dawn_breath',
      type: 'practice',
      title: 'Grounding Anchor Breath',
      timeDisplay: '06:15 AM',
      hour: 6,
      minute: 15,
      subtitle: '3-Min Presence Alignment • Cultivate Patience',
      tag: 'HYBRID MONK PATH',
      isHybridMonkPath: true,
      enabled: true,
      notificationEnabled: true,
      practiceType: 'kundalini_breath',
      notificationTitle: '🧘 ANCHOR YOURSELF',
      notificationBody: 'Ground your emotional nervous system before serving your family.',
    },
    {
      id: 'protection_window',
      type: 'protection',
      title: 'Morning Duty & Work Sprint',
      timeDisplay: '09:30 AM – 01:30 PM',
      hour: 9,
      minute: 30,
      endHour: 13,
      endMinute: 30,
      subtitle: 'Condensed Productive Hours • Zero Mindless Scrolling',
      tag: 'CORE ANCHOR',
      enabled: true,
      notificationEnabled: true,
      notificationTitle: '🛡️ WORK SPRINT',
      notificationBody: 'Focus intensely so work doesn’t bleed into family time.',
    },
    {
      id: 'midday_stop',
      type: 'practice',
      title: 'Midday Emotional Reset',
      timeDisplay: '02:00 PM',
      hour: 14,
      minute: 0,
      subtitle: '60-Sec Stillness • Reset Fatigue & Reactivity',
      tag: 'HYBRID MONK PATH',
      isHybridMonkPath: true,
      enabled: true,
      notificationEnabled: true,
      practiceType: 'osho_stop',
      notificationTitle: '🛑 RECENTER',
      notificationBody: 'Drop all frantic rushing. Take 60 seconds of complete stillness.',
    },
    {
      id: 'evening_transition',
      type: 'transition',
      title: 'Family Presence Shield',
      timeDisplay: '06:00 PM – 08:30 PM',
      hour: 18,
      minute: 0,
      endHour: 20,
      endMinute: 30,
      subtitle: 'Phone Blackout • Undivided Connection with Children & Partner',
      tag: 'PRESENCE SHIELD',
      enabled: true,
      notificationEnabled: true,
      practiceType: 'evening_witness',
      notificationTitle: '🏡 BE HERE NOW',
      notificationBody: 'Put your phone away. Give your loved ones your unconditional gaze.',
    },
    {
      id: 'sleep_sanctum',
      type: 'transition',
      title: 'Sleep Sanctum',
      timeDisplay: '10:00 PM',
      hour: 22,
      minute: 0,
      subtitle: 'Restorative Silence • Renew for Tomorrow',
      tag: 'RECOVERY',
      enabled: true,
      notificationEnabled: true,
      notificationTitle: '🌑 PEACEFUL REST',
      notificationBody: 'The home is safe. Surrender all responsibilities to sleep.',
    },
  ],
  professional: [
    {
      id: 'wake_alarm',
      type: 'alarm',
      title: 'Executive Dawn Awakening',
      timeDisplay: '06:30 AM',
      hour: 6,
      minute: 30,
      subtitle: '20-Step CoreMotion Walk • Clean Circadian Start',
      tag: 'CORE ANCHOR',
      enabled: true,
      notificationEnabled: true,
      missionType: 'walk',
      targetCount: 20,
      notificationTitle: '☕ STAND TALL',
      notificationBody: 'A new day in the arena begins. Walk 20 steps to seal wakefulness.',
    },
    {
      id: 'dawn_breath',
      type: 'practice',
      title: 'Pre-Market Mind Clarity',
      timeDisplay: '07:00 AM',
      hour: 7,
      minute: 0,
      subtitle: '3-Min Centering • Cut Email Anticipation Anxiety',
      tag: 'HYBRID MONK PATH',
      isHybridMonkPath: true,
      enabled: true,
      notificationEnabled: true,
      practiceType: 'kundalini_breath',
      notificationTitle: '⚡ CLEAR INTENT',
      notificationBody: 'Breathe into your spine before checking communication channels.',
    },
    {
      id: 'protection_window',
      type: 'protection',
      title: 'Strategic Focus Window',
      timeDisplay: '10:00 AM – 02:00 PM',
      hour: 10,
      minute: 0,
      endHour: 14,
      endMinute: 0,
      subtitle: 'Slack & Email Shield • Deep Analytical & Creative Flow',
      tag: 'CORE ANCHOR',
      enabled: true,
      notificationEnabled: true,
      notificationTitle: '🛡️ FLOW STATE ARMED',
      notificationBody: 'High-value output window. No reactive email checking.',
    },
    {
      id: 'midday_stop',
      type: 'practice',
      title: 'Corporate Decompression Stop',
      timeDisplay: '02:15 PM',
      hour: 14,
      minute: 15,
      subtitle: '60-Sec Sensory Reset • Drop Cognitive Load',
      tag: 'HYBRID MONK PATH',
      isHybridMonkPath: true,
      enabled: true,
      notificationEnabled: true,
      practiceType: 'osho_stop',
      notificationTitle: '🛑 STEP BACK',
      notificationBody: '60 seconds of silent observation. You are more than your job title.',
    },
    {
      id: 'evening_transition',
      type: 'transition',
      title: 'Drop the Work Armor',
      timeDisplay: '07:00 PM',
      hour: 19,
      minute: 0,
      subtitle: 'Sever Workplace Tension • Reclaim Sovereign Evening',
      tag: 'DECOMPRESSION',
      enabled: true,
      notificationEnabled: true,
      practiceType: 'evening_witness',
      notificationTitle: '🌙 UNPLUG THE CORPORATE MIND',
      notificationBody: 'The workday is dead. Step into your real, conscious life.',
    },
    {
      id: 'sleep_sanctum',
      type: 'transition',
      title: 'Sleep Sanctum',
      timeDisplay: '11:00 PM',
      hour: 23,
      minute: 0,
      subtitle: 'Blue Light Blackout • Deep REM Recovery',
      tag: 'RECOVERY',
      enabled: true,
      notificationEnabled: true,
      notificationTitle: '🌑 SLEEP DEEPLY',
      notificationBody: 'Put away all notifications. Rest like a sovereign mind.',
    },
  ],
};

class RoutineService {
  private items: RoutineTimelineItem[] = [...ARCHETYPE_PRESETS.builder];
  private currentArchetype: DincharyaArchetype = 'builder';
  private isLoaded = false;

  async getArchetype(): Promise<DincharyaArchetype> {
    if (!this.isLoaded) await this.loadRoutine();
    return this.currentArchetype;
  }

  async getRoutine(): Promise<RoutineTimelineItem[]> {
    if (!this.isLoaded) await this.loadRoutine();
    return [...this.items];
  }

  async loadRoutine(): Promise<RoutineTimelineItem[]> {
    try {
      const storedArchetype = await AsyncStorage.getItem(ARCHETYPE_KEY);
      if (storedArchetype && (storedArchetype in ARCHETYPE_PRESETS)) {
        this.currentArchetype = storedArchetype as DincharyaArchetype;
      }

      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.items = parsed;
        } else {
          this.items = [...ARCHETYPE_PRESETS[this.currentArchetype]];
        }
      } else {
        this.items = [...ARCHETYPE_PRESETS[this.currentArchetype]];
      }
    } catch (e) {
      console.warn('[RoutineService] Error loading routine:', e);
      this.items = [...ARCHETYPE_PRESETS.builder];
    }
    this.isLoaded = true;
    return [...this.items];
  }

  async applyArchetype(archetype: DincharyaArchetype): Promise<RoutineTimelineItem[]> {
    this.currentArchetype = archetype;
    this.items = [...ARCHETYPE_PRESETS[archetype]];
    await AsyncStorage.setItem(ARCHETYPE_KEY, archetype);
    await this.persistAndSync();

    // Reschedule notifications for the new archetype
    for (const item of this.items) {
      if (item.enabled && item.notificationEnabled) {
        await notificationService.scheduleRoutineReminder(
          item.id,
          item.notificationTitle,
          item.notificationBody,
          item.hour,
          item.minute
        );
      }
    }

    return [...this.items];
  }

  async updateItem(updated: RoutineTimelineItem): Promise<RoutineTimelineItem[]> {
    this.items = this.items.map((it) => (it.id === updated.id ? updated : it));
    await this.persistAndSync();
    return [...this.items];
  }

  async toggleNotification(id: string): Promise<RoutineTimelineItem | undefined> {
    const item = this.items.find((it) => it.id === id);
    if (!item) return undefined;

    item.notificationEnabled = !item.notificationEnabled;

    if (item.notificationEnabled) {
      await notificationService.scheduleRoutineReminder(
        item.id,
        item.notificationTitle,
        item.notificationBody,
        item.hour,
        item.minute
      );
    } else {
      await notificationService.cancelReminder(item.id);
    }

    await this.persistAndSync();
    return item;
  }

  async toggleEnabled(id: string): Promise<RoutineTimelineItem | undefined> {
    const item = this.items.find((it) => it.id === id);
    if (!item) return undefined;

    item.enabled = !item.enabled;
    if (!item.enabled) {
      await notificationService.cancelReminder(item.id);
    } else if (item.notificationEnabled) {
      await notificationService.scheduleRoutineReminder(
        item.id,
        item.notificationTitle,
        item.notificationBody,
        item.hour,
        item.minute
      );
    }

    await this.persistAndSync();
    return item;
  }

  async updateAlarm(hour: number, minute: number, missionType: 'walk' | 'shake' | 'photo'): Promise<void> {
    const alarm = this.items.find((i) => i.id === 'wake_alarm');
    if (alarm) {
      alarm.hour = hour;
      alarm.minute = minute;
      alarm.missionType = missionType;
      alarm.timeDisplay = this.formatTimeDisplay(hour, minute);
      alarm.subtitle = `${missionType === 'walk' ? '20-Step CoreMotion Walk' : '25 Shakes'} • Impossible to Snooze`;
      if (alarm.notificationEnabled) {
        await notificationService.scheduleRoutineReminder(
          alarm.id,
          alarm.notificationTitle,
          alarm.notificationBody,
          hour,
          minute
        );
      }
      await this.persistAndSync();
    }
  }

  async updateProtectionWindow(startHour: number, startMinute: number, endHour: number, endMinute: number): Promise<void> {
    const protection = this.items.find((i) => i.id === 'protection_window');
    if (protection) {
      protection.hour = startHour;
      protection.minute = startMinute;
      protection.endHour = endHour;
      protection.endMinute = endMinute;
      protection.timeDisplay = `${this.formatTimeDisplay(startHour, startMinute)} – ${this.formatTimeDisplay(endHour, endMinute)}`;
      if (protection.notificationEnabled) {
        await notificationService.scheduleRoutineReminder(
          protection.id,
          protection.notificationTitle,
          protection.notificationBody,
          startHour,
          startMinute
        );
      }
      await this.persistAndSync();
    }
  }

  async updateSleepSanctum(hour: number, minute: number): Promise<void> {
    const sleep = this.items.find((i) => i.id === 'sleep_sanctum');
    if (sleep) {
      sleep.hour = hour;
      sleep.minute = minute;
      sleep.timeDisplay = this.formatTimeDisplay(hour, minute);
      if (sleep.notificationEnabled) {
        await notificationService.scheduleRoutineReminder(
          sleep.id,
          sleep.notificationTitle,
          sleep.notificationBody,
          hour,
          minute
        );
      }
      await this.persistAndSync();
    }
  }

  async addCustomItem(params: {
    title: string;
    subtitle?: string;
    tag?: string;
    hour: number;
    minute: number;
    endHour?: number;
    endMinute?: number;
    notificationEnabled?: boolean;
    notificationTitle?: string;
    notificationBody?: string;
  }): Promise<RoutineTimelineItem> {
    const id = `custom_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const timeDisplay = this.formatTimeDisplay(params.hour, params.minute, params.endHour, params.endMinute);
    const tag = (params.tag || 'CUSTOM').toUpperCase();
    const subtitle = params.subtitle || 'Personalized Routine Anchor';
    const notifTitle = params.notificationTitle || `⏱️ ${params.title.toUpperCase()}`;
    const notifBody = params.notificationBody || `Time for ${params.title}. Stay centered and focused.`;
    const notificationEnabled = params.notificationEnabled !== false;

    const newItem: RoutineTimelineItem = {
      id,
      type: 'custom',
      title: params.title,
      timeDisplay,
      hour: params.hour,
      minute: params.minute,
      endHour: params.endHour,
      endMinute: params.endMinute,
      subtitle,
      tag,
      isCustom: true,
      enabled: true,
      notificationEnabled,
      notificationTitle: notifTitle,
      notificationBody: notifBody,
    };

    this.items.push(newItem);
    this.sortItemsChronologically();
    await this.persistAndSync();

    if (notificationEnabled) {
      await notificationService.scheduleRoutineReminder(
        newItem.id,
        notifTitle,
        notifBody,
        params.hour,
        params.minute
      );
    }

    return newItem;
  }

  async deleteItem(id: string): Promise<RoutineTimelineItem[]> {
    this.items = this.items.filter((it) => it.id !== id);
    await notificationService.cancelReminder(id);
    await this.persistAndSync();
    return [...this.items];
  }

  sortItemsChronologically(): void {
    this.items.sort((a, b) => {
      const aMins = a.hour * 60 + a.minute;
      const bMins = b.hour * 60 + b.minute;
      return aMins - bMins;
    });
  }

  async saveCalibratedRoutine(params: {
    archetype: DincharyaArchetype;
    wakeHour: number;
    wakeMinute: number;
    wakeMission?: 'walk' | 'shake' | 'photo';
    sleepHour: number;
    sleepMinute: number;
    customItems?: RoutineTimelineItem[];
    enabledItemIds?: string[];
  }): Promise<RoutineTimelineItem[]> {
    this.currentArchetype = params.archetype;
    await AsyncStorage.setItem(ARCHETYPE_KEY, params.archetype);

    const baseItems: RoutineTimelineItem[] = JSON.parse(JSON.stringify(ARCHETYPE_PRESETS[params.archetype]));

    const wake = baseItems.find((i) => i.id === 'wake_alarm');
    if (wake) {
      wake.hour = params.wakeHour;
      wake.minute = params.wakeMinute;
      if (params.wakeMission) wake.missionType = params.wakeMission;
      wake.timeDisplay = this.formatTimeDisplay(params.wakeHour, params.wakeMinute);
      wake.subtitle = `${wake.missionType === 'walk' ? '20-Step CoreMotion Walk' : '25 Shakes'} • Impossible to Snooze`;
    }

    const sleep = baseItems.find((i) => i.id === 'sleep_sanctum');
    if (sleep) {
      sleep.hour = params.sleepHour;
      sleep.minute = params.sleepMinute;
      sleep.timeDisplay = this.formatTimeDisplay(params.sleepHour, params.sleepMinute);
    }

    const custom = params.customItems || [];
    const merged = [...baseItems, ...custom];

    if (params.enabledItemIds) {
      merged.forEach((item) => {
        item.enabled = params.enabledItemIds!.includes(item.id);
      });
    }

    this.items = merged;
    this.sortItemsChronologically();
    await this.persistAndSync();

    await notificationService.cancelAll();
    for (const item of this.items) {
      if (item.enabled && item.notificationEnabled) {
        await notificationService.scheduleRoutineReminder(
          item.id,
          item.notificationTitle,
          item.notificationBody,
          item.hour,
          item.minute
        );
      }
    }

    return [...this.items];
  }

  formatTimeDisplay(hour: number, minute: number, endHour?: number, endMinute?: number): string {
    const formatSingle = (h: number, m: number) => {
      const period = h >= 12 ? 'PM' : 'AM';
      const h12 = h % 12 === 0 ? 12 : h % 12;
      const mStr = m.toString().padStart(2, '0');
      return `${h12.toString().padStart(2, '0')}:${mStr} ${period}`;
    };

    const startStr = formatSingle(hour, minute);
    if (endHour !== undefined) {
      const endStr = formatSingle(endHour, endMinute || 0);
      return `${startStr} – ${endStr}`;
    }
    return startStr;
  }

  private async persistAndSync(): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(this.items));
      const morningTime = this.items.find((i) => i.id === 'wake_alarm')?.timeDisplay || '05:30 AM';
      const eveningTime = this.items.find((i) => i.id === 'evening_transition')?.timeDisplay || '06:30 PM';
      await dbService.saveRoutinePlan(morningTime, eveningTime);
    } catch (e) {
      console.warn('[RoutineService] Sync error:', e);
    }
  }

  getCurrentActiveItem(): RoutineTimelineItem | null {
    const now = new Date();
    const currentMins = now.getHours() * 60 + now.getMinutes();

    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i];
      if (!item.enabled) continue;

      const itemStartMins = item.hour * 60 + item.minute;
      const itemEndMins = item.endHour !== undefined
        ? item.endHour * 60 + (item.endMinute || 0)
        : itemStartMins + 60;

      if (currentMins >= itemStartMins && currentMins < itemEndMins) {
        return item;
      }
    }

    return null;
  }
}

export const routineService = new RoutineService();
