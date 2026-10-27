import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase, isSupabaseConfigured } from './supabase';

const OUTBOX_KEY = '@hybrid_monk_outbox_v1';

export interface OutboxItem {
  id: string;
  table: 'daily_logs' | 'routine_plans' | 'practice_attempts' | 'self_reports' | 'profiles';
  payload: Record<string, any>;
  enqueuedAt: number;
  retryCount: number;
}

export class SyncOutbox {
  private isFlushing = false;

  async getQueue(): Promise<OutboxItem[]> {
    try {
      const raw = await AsyncStorage.getItem(OUTBOX_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
      }
    } catch {
      // Fallback
    }
    return [];
  }

  private async setQueue(items: OutboxItem[]): Promise<void> {
    try {
      await AsyncStorage.setItem(OUTBOX_KEY, JSON.stringify(items));
    } catch {
      // Non-blocking
    }
  }

  async enqueue(table: OutboxItem['table'], payload: Record<string, any>): Promise<void> {
    const queue = await this.getQueue();
    const item: OutboxItem = {
      id: `${table}_${payload.id || payload.log_date || Date.now()}`,
      table,
      payload,
      enqueuedAt: Date.now(),
      retryCount: 0,
    };

    // Idempotent replace if already exists in queue
    const filtered = queue.filter((q) => q.id !== item.id);
    filtered.push(item);
    await this.setQueue(filtered);

    // Eager flush attempt
    this.flush();
  }

  async flush(): Promise<{ success: number; failed: number }> {
    if (this.isFlushing || !isSupabaseConfigured) {
      return { success: 0, failed: 0 };
    }

    this.isFlushing = true;
    const queue = await this.getQueue();
    if (queue.length === 0) {
      this.isFlushing = false;
      return { success: 0, failed: 0 };
    }

    const remaining: OutboxItem[] = [];
    let successCount = 0;
    let failedCount = 0;

    for (const item of queue) {
      try {
        const { error } = await supabase.from(item.table).upsert(item.payload);
        if (error) {
          item.retryCount += 1;
          remaining.push(item);
          failedCount += 1;
        } else {
          successCount += 1;
        }
      } catch {
        item.retryCount += 1;
        remaining.push(item);
        failedCount += 1;
      }
    }

    await this.setQueue(remaining);
    this.isFlushing = false;
    return { success: successCount, failed: failedCount };
  }
}

export const syncOutbox = new SyncOutbox();
