import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase, isSupabaseConfigured } from './supabase';

export interface UserDailyTarget {
  alarmPassed: boolean;
  sadhnaCompleted: boolean;
  manovigyanCompleted: boolean;
  streakDays: number;
  lastUpdated: string;
}

const STORAGE_KEYS = {
  DAILY_TARGET: '@hybrid_monk_daily_target',
  PROFILE: '@hybrid_monk_profile',
  SEVEN_DAY_HISTORY: '@hybrid_monk_7day_history',
};

export class DatabaseService {
  /**
   * Retrieves or initializes today's tracking state.
   */
  async getTodayTarget(): Promise<UserDailyTarget> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.DAILY_TARGET);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Fallback
    }

    const initial: UserDailyTarget = {
      alarmPassed: true,
      sadhnaCompleted: false,
      manovigyanCompleted: false,
      streakDays: 14,
      lastUpdated: new Date().toISOString().split('T')[0],
    };

    await this.saveTodayTarget(initial);
    return initial;
  }

  async saveTodayTarget(target: UserDailyTarget): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.DAILY_TARGET, JSON.stringify(target));

      // If Supabase cloud is configured, push to database
      if (isSupabaseConfigured) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.from('daily_logs').upsert({
            user_id: user.id,
            log_date: target.lastUpdated,
            alarm_cleared: target.alarmPassed,
            sadhna_minutes: target.sadhnaCompleted ? 15 : 0,
            manovigyan_inquiry_completed: target.manovigyanCompleted,
            daily_score: Math.round(
              ((Number(target.alarmPassed) +
                Number(target.sadhnaCompleted) +
                Number(target.manovigyanCompleted)) /
                3) *
                100
            ),
          });
        }
      }
    } catch (e) {
      console.warn('Persistence error, using local cache:', e);
    }
  }

  async toggleAnchor(anchor: 'alarmPassed' | 'sadhnaCompleted' | 'manovigyanCompleted'): Promise<UserDailyTarget> {
    const current = await this.getTodayTarget();
    current[anchor] = !current[anchor];
    await this.saveTodayTarget(current);
    return current;
  }

  async getSevenDayHistory(): Promise<Array<{ day: string; status: 'passed' | 'partial' | 'pending' }>> {
    return [
      { day: 'M', status: 'passed' },
      { day: 'T', status: 'passed' },
      { day: 'W', status: 'passed' },
      { day: 'T', status: 'passed' },
      { day: 'F', status: 'passed' },
      { day: 'S', status: 'partial' },
      { day: 'S', status: 'pending' },
    ];
  }
}

export const dbService = new DatabaseService();
