import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Alert,
} from 'react-native';
import { COLORS } from '../../theme/colors';
import { TYPOGRAPHY } from '../../theme/typography';
import {
  subscriptionService,
  SUBSCRIPTION_PLANS,
} from '../../services/subscriptionService';
import { SubscriptionTier, BillingPeriod } from '../../types';
import { HapticService } from '../../services/haptics';

interface Props {
  onBack: () => void;
  onSuccess?: () => void;
}

export const PaywallScreen = ({ onBack, onSuccess }: Props) => {
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier>('duo');
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>('annual');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTier, setActiveTier] = useState<SubscriptionTier>('free');

  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    subscriptionService.getSubscription().then((sub) => {
      setActiveTier(sub.tier);
      if (sub.isActive && sub.tier !== 'free') {
        setSelectedTier(sub.tier);
        setBillingPeriod(sub.period);
      }
    });

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.12,
          duration: 2200,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1.0,
          duration: 2200,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const selectedPlan =
    SUBSCRIPTION_PLANS.find((p) => p.tier === selectedTier) || SUBSCRIPTION_PLANS[1];

  const handleSubscribe = async () => {
    HapticService.heavyImpact();
    setIsLoading(true);

    try {
      const state = await subscriptionService.subscribe(selectedTier, billingPeriod);
      setIsLoading(false);
      Alert.alert(
        'Sovereign Access Unlocked ✨',
        `Welcome to the ${selectedPlan.name} tier. Your 7-day trial is now active.`,
        [
          {
            text: 'Begin Practice',
            onPress: () => {
              onSuccess?.();
              onBack();
            },
          },
        ]
      );
    } catch {
      setIsLoading(false);
      Alert.alert('Notice', 'Unable to complete transaction. Please try again.');
    }
  };

  const handleRestore = async () => {
    HapticService.selection();
    const sub = await subscriptionService.restorePurchases();
    if (sub.isActive) {
      Alert.alert('Purchases Restored', `Your active tier is ${sub.tier.toUpperCase()}.`);
      onBack();
    } else {
      Alert.alert('No Active Subscription', 'No prior active subscription found.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.closeBtn}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleRestore} style={styles.restoreBtn}>
          <Text style={styles.restoreText}>Restore Purchases</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Animated.View
            style={[
              styles.heroOrb,
              { transform: [{ scale: pulseAnim }] },
            ]}
          >
            <Text style={styles.heroEmoji}>👑</Text>
          </Animated.View>

          <Text style={styles.eyebrow}>SHANIVAR BY THE HYBRID MONK</Text>
          <Text style={styles.heroTitle}>MONK PASS • SOVEREIGN DISCIPLINE</Text>
          <Text style={styles.heroSub}>
            Step out of the algorithmic trance. Master waking, guard your focus, and stay anchored individually, as a couple, or as a family.
          </Text>
        </View>

        {/* Period Switcher (Annual vs Monthly) */}
        <View style={styles.periodSwitcherWrapper}>
          <View style={styles.periodSwitcher}>
            <TouchableOpacity
              style={[
                styles.periodTab,
                billingPeriod === 'annual' && styles.periodTabActive,
              ]}
              onPress={() => {
                HapticService.selection();
                setBillingPeriod('annual');
              }}
            >
              <Text
                style={[
                  styles.periodTabText,
                  billingPeriod === 'annual' && styles.periodTabTextActive,
                ]}
              >
                Annual (Save 50%)
              </Text>
              <View style={styles.saveBadge}>
                <Text style={styles.saveBadgeText}>7-DAY TRIAL</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.periodTab,
                billingPeriod === 'monthly' && styles.periodTabActive,
              ]}
              onPress={() => {
                HapticService.selection();
                setBillingPeriod('monthly');
              }}
            >
              <Text
                style={[
                  styles.periodTabText,
                  billingPeriod === 'monthly' && styles.periodTabTextActive,
                ]}
              >
                Monthly
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 3 Tier Cards: Single, Duo, Family */}
        <View style={styles.tiersContainer}>
          {SUBSCRIPTION_PLANS.map((plan) => {
            const isSelected = selectedTier === plan.tier;
            const price =
              billingPeriod === 'annual'
                ? `$${(plan.annualPriceUSD / 12).toFixed(2)}/mo`
                : `$${plan.monthlyPriceUSD.toFixed(2)}/mo`;

            const billedNote =
              billingPeriod === 'annual'
                ? `Billed annually at $${plan.annualPriceUSD}/yr`
                : 'Billed monthly, cancel anytime';

            const perPersonNote =
              plan.maxMembers > 1 && billingPeriod === 'annual'
                ? `($${(plan.annualPriceUSD / 12 / plan.maxMembers).toFixed(2)} / person / mo)`
                : null;

            return (
              <TouchableOpacity
                key={plan.id}
                style={[styles.tierCard, isSelected && styles.tierCardSelected]}
                onPress={() => {
                  HapticService.selection();
                  setSelectedTier(plan.tier);
                }}
                activeOpacity={0.85}
              >
                {/* Badge if available */}
                {plan.badge && (
                  <View style={styles.badgeWrapper}>
                    <Text style={styles.badgeText}>{plan.badge}</Text>
                  </View>
                )}

                <View style={styles.tierTopRow}>
                  <View style={styles.tierTitleGroup}>
                    <Text style={styles.tierIcon}>{plan.icon}</Text>
                    <div>
                      <Text style={[styles.tierName, isSelected && { color: '#FFB800' }]}>
                        {plan.name}
                      </Text>
                      <Text style={styles.tierTarget}>{plan.targetAudience}</Text>
                    </div>
                  </View>

                  <View style={styles.priceGroup}>
                    <Text style={styles.priceMain}>{price}</Text>
                    {perPersonNote && (
                      <Text style={styles.perPersonText}>{perPersonNote}</Text>
                    )}
                  </View>
                </View>

                <Text style={styles.tierDescription}>{plan.description}</Text>
                <Text style={styles.billedNote}>{billedNote}</Text>

                {/* Radio selection circle */}
                <View style={styles.selectRow}>
                  <View
                    style={[
                      styles.radioCircle,
                      isSelected && styles.radioCircleActive,
                    ]}
                  >
                    {isSelected && <View style={styles.radioDot} />}
                  </View>
                  <Text style={[styles.selectText, isSelected && { color: '#FFB800' }]}>
                    {isSelected ? 'SELECTED PLAN' : 'SELECT'}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Feature List of Selected Plan */}
        <View style={styles.featuresCard}>
          <Text style={styles.featuresHeading}>
            WHAT’S INCLUDED IN {selectedPlan.name.toUpperCase()}
          </Text>
          <View style={styles.featureList}>
            {selectedPlan.features.map((feat, i) => (
              <View key={i} style={styles.featureRow}>
                <Text style={styles.checkIcon}>✓</Text>
                <Text style={styles.featureText}>{feat}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* The Couple & Family Philosophy Card */}
        <View style={styles.philosophyCard}>
          <Text style={styles.philosophyTag}>THE COLLECTIVE TRUTH</Text>
          <Text style={styles.philosophyText}>
            “Phone addiction is rarely an isolated vice. When one partner doomscrolls in bed, intimacy
            dissolves. When parents scroll, children disconnect. Hybrid Monk Duo and Family plans
            create a shared pact: we disconnect together to be truly alive together.”
          </Text>
        </View>
      </ScrollView>

      {/* Sticky Bottom Purchase Action */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.subscribeBtn}
          onPress={handleSubscribe}
          disabled={isLoading}
          activeOpacity={0.85}
        >
          <Text style={styles.subscribeBtnText}>
            {isLoading
              ? 'ACTIVATING ACCESS...'
              : `START 7-DAY FREE TRIAL • ${selectedPlan.name.toUpperCase()}`}
          </Text>
        </TouchableOpacity>

        <Text style={styles.guaranteeText}>
          {billingPeriod === 'annual'
            ? `7 days free, then $${selectedPlan.annualPriceUSD}/yr. Cancel anytime in iOS Subscriptions.`
            : `$${selectedPlan.monthlyPriceUSD}/month. Cancel anytime.`}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#070707',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  closeBtn: {
    padding: 8,
  },
  closeText: {
    color: COLORS.TEXT_MUTED,
    fontSize: 20,
  },
  restoreBtn: {
    padding: 8,
  },
  restoreText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.TEXT_MUTED,
    fontSize: 12,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  heroOrb: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255, 184, 0, 0.12)',
    borderWidth: 2,
    borderColor: '#FFB800',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#FFB800',
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 6,
  },
  heroEmoji: {
    fontSize: 32,
  },
  eyebrow: {
    ...TYPOGRAPHY.caption,
    color: '#FFB800',
    letterSpacing: 2,
    fontSize: 10,
    fontWeight: '800',
    marginBottom: 4,
  },
  heroTitle: {
    ...TYPOGRAPHY.h2,
    color: '#FFF',
    letterSpacing: 1.5,
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 6,
  },
  heroSub: {
    ...TYPOGRAPHY.caption,
    color: COLORS.TEXT_MUTED,
    textAlign: 'center',
    fontSize: 12,
    lineHeight: 18,
    maxWidth: 320,
  },
  periodSwitcherWrapper: {
    alignItems: 'center',
    marginBottom: 20,
  },
  periodSwitcher: {
    flexDirection: 'row',
    backgroundColor: '#141414',
    padding: 4,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#262626',
    width: '100%',
    maxWidth: 340,
  },
  periodTab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  periodTabActive: {
    backgroundColor: '#222',
  },
  periodTabText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.TEXT_MUTED,
    fontWeight: '700',
    fontSize: 12,
  },
  periodTabTextActive: {
    color: '#FFF',
  },
  saveBadge: {
    position: 'absolute',
    top: -8,
    right: 8,
    backgroundColor: '#FFB800',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  saveBadgeText: {
    color: '#000',
    fontWeight: '900',
    fontSize: 8,
    letterSpacing: 0.5,
  },
  tiersContainer: {
    gap: 14,
    marginBottom: 20,
  },
  tierCard: {
    backgroundColor: '#121212',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1.5,
    borderColor: '#242424',
    position: 'relative',
  },
  tierCardSelected: {
    borderColor: '#FFB800',
    backgroundColor: '#16140D',
    shadowColor: '#FFB800',
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
  },
  badgeWrapper: {
    position: 'absolute',
    top: -10,
    right: 16,
    backgroundColor: '#FFB800',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
  },
  badgeText: {
    color: '#000',
    fontWeight: '900',
    fontSize: 9,
    letterSpacing: 1,
  },
  tierTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  tierTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  tierIcon: {
    fontSize: 24,
  },
  tierName: {
    ...TYPOGRAPHY.body,
    fontWeight: '800',
    color: '#FFF',
    fontSize: 16,
  },
  tierTarget: {
    ...TYPOGRAPHY.caption,
    color: COLORS.TEXT_MUTED,
    fontSize: 10,
  },
  priceGroup: {
    alignItems: 'flex-end',
  },
  priceMain: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFF',
    fontVariant: ['tabular-nums'],
  },
  perPersonText: {
    ...TYPOGRAPHY.caption,
    color: '#39D98A',
    fontSize: 10,
    fontWeight: '700',
  },
  tierDescription: {
    ...TYPOGRAPHY.caption,
    color: '#D4D4D4',
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 4,
  },
  billedNote: {
    ...TYPOGRAPHY.caption,
    color: COLORS.TEXT_MUTED,
    fontSize: 11,
    marginBottom: 12,
  },
  selectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#202020',
  },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: '#444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleActive: {
    borderColor: '#FFB800',
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFB800',
  },
  selectText: {
    ...TYPOGRAPHY.caption,
    fontWeight: '800',
    fontSize: 10,
    letterSpacing: 1,
    color: COLORS.TEXT_MUTED,
  },
  featuresCard: {
    backgroundColor: '#121212',
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#242424',
    marginBottom: 20,
  },
  featuresHeading: {
    ...TYPOGRAPHY.caption,
    color: '#FFB800',
    letterSpacing: 1.5,
    fontSize: 10,
    fontWeight: '800',
    marginBottom: 12,
  },
  featureList: {
    gap: 10,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  checkIcon: {
    color: '#39D98A',
    fontWeight: '900',
    fontSize: 13,
  },
  featureText: {
    ...TYPOGRAPHY.caption,
    color: '#EDEDED',
    fontSize: 12,
    lineHeight: 16,
    flex: 1,
  },
  philosophyCard: {
    backgroundColor: '#141414',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#242424',
  },
  philosophyTag: {
    ...TYPOGRAPHY.caption,
    color: '#6C63FF',
    letterSpacing: 1.5,
    fontSize: 9,
    fontWeight: '800',
    marginBottom: 6,
  },
  philosophyText: {
    ...TYPOGRAPHY.caption,
    color: '#A0A0A0',
    fontStyle: 'italic',
    lineHeight: 17,
    fontSize: 11,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#1A1A1A',
    backgroundColor: '#070707',
  },
  subscribeBtn: {
    backgroundColor: '#FFB800',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 8,
  },
  subscribeBtnText: {
    color: '#000',
    fontWeight: '900',
    fontSize: 14,
    letterSpacing: 1,
  },
  guaranteeText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.TEXT_MUTED,
    textAlign: 'center',
    fontSize: 11,
  },
});
