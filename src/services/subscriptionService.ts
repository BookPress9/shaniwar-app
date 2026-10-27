import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  SubscriptionTier,
  BillingPeriod,
  SubscriptionPlan,
  UserSubscriptionState,
} from '../types';
import { supabase, isSupabaseConfigured } from './supabase';
import { HapticService } from './haptics';

const STORAGE_KEY = '@hybrid_monk_subscription_v1';

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'plan_single',
    tier: 'single',
    name: 'Solitary Monk',
    tagline: 'Individual Mastery & Pure Focus',
    description: 'For ambitious builders, students, and seekers ready to eliminate digital noise and master their day.',
    icon: '🧘',
    maxMembers: 1,
    monthlyPriceUSD: 9.99,
    annualPriceUSD: 59.99, // $4.99/mo
    targetAudience: 'Single Users • Students • Founders',
    features: [
      'Unlimited Dincharya Protection Windows',
      'Native iPhone Instagram & TikTok Blocker Wrapper',
      'CoreMotion Gait Walk Verification (No Snooze)',
      'Custom Naam Japa Sacred Heartbeat Haptics',
      'Full 33-Vertebra Kundalini Spine Journey',
      'Unconscious Drift Intercept & Osho Mirror',
    ],
  },
  {
    id: 'plan_duo',
    tier: 'duo',
    name: 'Duo Monks',
    tagline: 'The Sacred Partner Pact',
    description: 'For couples, co-founders, and partners who refuse to let screens destroy their presence together.',
    icon: '⚡',
    maxMembers: 2,
    monthlyPriceUSD: 14.99,
    annualPriceUSD: 89.99, // $7.49/mo total ($3.75/person)
    badge: 'POPULAR FOR COUPLES',
    targetAudience: 'Couples • Partners • Co-Founders',
    features: [
      'Everything in Solitary Monk for 2 Independent Accounts',
      'Shared Evening Presence Shield (Mutual Bedtime Blackout)',
      'Partner Wake-Up Alert (Know when your partner rises)',
      'Dual Sovereign Sankalp Connection',
      'Shared 7-Day Consistency Streak',
      'Save 25% compared to two individual plans',
    ],
  },
  {
    id: 'plan_family',
    tier: 'family',
    name: 'Household Monastery',
    tagline: 'The Digital Detox Sanctuary',
    description: 'Protect your entire family from algorithmic addiction. Transform your home into a sanctuary of deep presence.',
    icon: '🏡',
    maxMembers: 5,
    monthlyPriceUSD: 19.99,
    annualPriceUSD: 119.99, // $9.99/mo total ($2.00/person)
    badge: 'BEST VALUE (UP TO 5 USERS)',
    targetAudience: 'Parents • Families • Multi-Device',
    features: [
      'Everything in Duo for up to 5 Family Members',
      'Family Dinner Table Presence Shield (Sync phone blackout)',
      'Teen & Student Study Shield (Block TikTok during homework)',
      'Parental Digital Harmony Dashboard',
      'Multi-Device Sync (iPhone, iPad, Family devices)',
      'Save over 60% with universal household access',
    ],
  },
];

const DEFAULT_STATE: UserSubscriptionState = {
  tier: 'free',
  period: 'annual',
  isActive: false,
  isTrial: false,
  memberSlots: 1,
};

class SubscriptionService {
  private state: UserSubscriptionState = { ...DEFAULT_STATE };
  private isLoaded = false;

  async getSubscription(): Promise<UserSubscriptionState> {
    if (!this.isLoaded) await this.load();
    return { ...this.state };
  }

  async load(): Promise<UserSubscriptionState> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.state = { ...DEFAULT_STATE, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.warn('[SubscriptionService] Load error:', e);
    }
    this.isLoaded = true;
    return { ...this.state };
  }

  async subscribe(
    tier: SubscriptionTier,
    period: BillingPeriod
  ): Promise<UserSubscriptionState> {
    await HapticService.heavyImpact();

    const plan = SUBSCRIPTION_PLANS.find((p) => p.tier === tier);
    const now = Date.now();
    const trialDays = 7;
    const trialEnd = now + trialDays * 24 * 60 * 60 * 1000;
    const durationDays = period === 'annual' ? 365 + trialDays : 30 + trialDays;
    const expiresAt = now + durationDays * 24 * 60 * 60 * 1000;

    const inviteCode =
      tier === 'duo' || tier === 'family'
        ? `MONK-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
        : undefined;

    this.state = {
      tier,
      period,
      isActive: true,
      isTrial: true,
      trialEndTimestamp: trialEnd,
      expiresAtTimestamp: expiresAt,
      memberSlots: plan?.maxMembers || 1,
      inviteCode,
    };

    await this.persistAndSync();
    await HapticService.successNotification();
    return { ...this.state };
  }

  async restorePurchases(): Promise<UserSubscriptionState> {
    await HapticService.selection();
    // In production, queries Apple StoreKit / RevenueCat receipt validation
    await this.load();
    return { ...this.state };
  }

  async cancelSubscription(): Promise<UserSubscriptionState> {
    this.state = {
      ...this.state,
      isActive: false,
      tier: 'free',
    };
    await this.persistAndSync();
    return { ...this.state };
  }

  isFeatureUnlocked(featureKey: 'unlimited_protection' | 'duo_sync' | 'family_sync'): boolean {
    if (!this.state.isActive) return false;
    if (this.state.tier === 'family') return true;
    if (this.state.tier === 'duo') return featureKey !== 'family_sync';
    if (this.state.tier === 'single') return featureKey === 'unlimited_protection';
    return false;
  }

  private async persistAndSync(): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));

      // Sync with Supabase profiles table if available
      if (isSupabaseConfigured) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.from('profiles').upsert({
            id: user.id,
            subscription_tier: this.state.tier,
            subscription_active: this.state.isActive,
            updated_at: new Date().toISOString(),
          });
        }
      }
    } catch (e) {
      console.warn('[SubscriptionService] Sync error:', e);
    }
  }
}

export const subscriptionService = new SubscriptionService();
