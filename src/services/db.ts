import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase, isSupabaseConfigured } from './supabase';
import { syncOutbox } from './syncOutbox';

export interface UserDailyTarget {
  alarmPassed: boolean;
  sadhnaCompleted: boolean;
  manovigyanCompleted: boolean;
  streakDays: number;
  lastUpdated: string;
}

export interface DayHistoryRecord {
  alarmPassed: boolean;
  sadhnaCompleted: boolean;
  manovigyanCompleted: boolean;
  score: number;
}

const STORAGE_KEYS = {
  DAILY_TARGET: '@hybrid_monk_daily_target',
  PROFILE: '@hybrid_monk_profile',
  DAILY_HISTORY_MAP: '@hybrid_monk_daily_history_map',
};

const DAY_LABELS = ['Su', 'M', 'Tu', 'W', 'Th', 'F', 'Sa'];

export class DatabaseService {
  /**
   * Retrieves or initializes today's tracking state.
   * Automatically handles new day rollover and streak recalculation.
   */
  async getTodayTarget(): Promise<UserDailyTarget> {
    const todayStr = new Date().toISOString().split('T')[0];

    try {
      const storedRaw = await AsyncStorage.getItem(STORAGE_KEYS.DAILY_TARGET);
      if (storedRaw) {
        const stored: UserDailyTarget = JSON.parse(storedRaw);

        // Same day -> return active target
        if (stored.lastUpdated === todayStr) {
          return stored;
        }

        // New day detected -> Archive previous day's result into history
        await this.archiveDayResult(stored.lastUpdated, stored);

        // Calculate if previous day was successful (at least 2 of 3 anchors passed)
        const passedCount =
          Number(stored.alarmPassed) +
          Number(stored.sadhnaCompleted) +
          Number(stored.manovigyanCompleted);
        const continuedStreak = passedCount >= 2 ? (stored.streakDays || 1) + 1 : 1;

        const newDayTarget: UserDailyTarget = {
          alarmPassed: false,
          sadhnaCompleted: false,
          manovigyanCompleted: false,
          streakDays: continuedStreak,
          lastUpdated: todayStr,
        };

        await this.saveTodayTarget(newDayTarget);
        return newDayTarget;
      }
    } catch {
      // Fallback below
    }

    const initial: UserDailyTarget = {
      alarmPassed: false,
      sadhnaCompleted: false,
      manovigyanCompleted: false,
      streakDays: 1,
      lastUpdated: todayStr,
    };

    await this.saveTodayTarget(initial);
    return initial;
  }

  async saveTodayTarget(target: UserDailyTarget): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.DAILY_TARGET, JSON.stringify(target));

      // Also record today in the local history map
      await this.archiveDayResult(target.lastUpdated, target);

      // If Supabase cloud is configured, enqueue to idempotent outbox
      if (isSupabaseConfigured) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await syncOutbox.enqueue('daily_logs', {
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

  async saveRoutinePlan(morningWakeTime: string, eveningReviewTime: string): Promise<void> {
    try {
      await AsyncStorage.setItem('@hybrid_monk_routine_plan', JSON.stringify({ morningWakeTime, eveningReviewTime }));
      if (isSupabaseConfigured) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await syncOutbox.enqueue('routine_plans', {
            user_id: user.id,
            morning_wake_time: morningWakeTime,
            evening_review_time: eveningReviewTime,
            active_mission_types: ['walk', 'shake'],
          });
        }
      }
    } catch (e) {
      console.warn('Routine plan save error:', e);
    }
  }

  async logPracticeAttempt(sectionId: number, durationSeconds: number, accuracyScore: number): Promise<void> {
    try {
      const today = await this.getTodayTarget();
      today.sadhnaCompleted = true;
      await this.saveTodayTarget(today);

      if (isSupabaseConfigured) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await syncOutbox.enqueue('practice_attempts', {
            user_id: user.id,
            section_id: sectionId,
            duration_seconds: durationSeconds,
            accuracy_score: accuracyScore,
          });
        }
      }
    } catch (e) {
      console.warn('Practice attempt log error:', e);
    }
  }

  private async archiveDayResult(dateStr: string, target: UserDailyTarget): Promise<void> {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEYS.DAILY_HISTORY_MAP);
      const historyMap: Record<string, DayHistoryRecord> = raw ? JSON.parse(raw) : {};

      const passedCount =
        Number(target.alarmPassed) +
        Number(target.sadhnaCompleted) +
        Number(target.manovigyanCompleted);

      historyMap[dateStr] = {
        alarmPassed: target.alarmPassed,
        sadhnaCompleted: target.sadhnaCompleted,
        manovigyanCompleted: target.manovigyanCompleted,
        score: Math.round((passedCount / 3) * 100),
      };

      await AsyncStorage.setItem(STORAGE_KEYS.DAILY_HISTORY_MAP, JSON.stringify(historyMap));
    } catch {
      // Non-blocking
    }
  }

  /**
   * Generates dynamic 7-day consistency status ending today.
   */
  async getSevenDayHistory(): Promise<Array<{ day: string; status: 'passed' | 'partial' | 'pending' }>> {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEYS.DAILY_HISTORY_MAP);
      const historyMap: Record<string, DayHistoryRecord> = raw ? JSON.parse(raw) : {};
      const today = new Date();

      const past7: Array<{ day: string; status: 'passed' | 'partial' | 'pending' }> = [];

      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(today.getDate() - i);
        const dateKey = d.toISOString().split('T')[0];
        const dayLabel = DAY_LABELS[d.getDay()];

        const record = historyMap[dateKey];
        if (!record) {
          // If past day with no record -> pending; if today -> pending until completed
          past7.push({ day: dayLabel, status: 'pending' });
        } else if (record.score === 100) {
          past7.push({ day: dayLabel, status: 'passed' });
        } else if (record.score > 0) {
          past7.push({ day: dayLabel, status: 'partial' });
        } else {
          past7.push({ day: dayLabel, status: 'pending' });
        }
      }

      return past7;
    } catch {
      return [
        { day: 'M', status: 'pending' },
        { day: 'Tu', status: 'pending' },
        { day: 'W', status: 'pending' },
        { day: 'Th', status: 'pending' },
        { day: 'F', status: 'pending' },
        { day: 'Sa', status: 'pending' },
        { day: 'Su', status: 'pending' },
      ];
    }
  }
}

export const dbService = new DatabaseService();
