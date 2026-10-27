import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Linking,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../../theme/colors';
import { TYPOGRAPHY } from '../../theme/typography';
import { HapticService } from '../../services/haptics';
import { dbService } from '../../services/db';

interface Props {
  onBack: () => void;
}

type ImpulseIntention = 'boredom' | 'work' | 'conscious' | null;

const IMPULSE_VICTORY_KEY = '@hybrid_monk_shield_victories';

export const InstagramShieldIntercept = ({ onBack }: Props) => {
  const [consciousCountdown, setConsciousCountdown] = useState<number>(10);
  const [canProceed, setCanProceed] = useState(false);
  const [hasStartedTimer, setHasStartedTimer] = useState(false);
  const [selectedIntention, setSelectedIntention] = useState<ImpulseIntention>(null);
  const [victoriesCount, setVictoriesCount] = useState<number>(3);

  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Fire wake/alert haptic on intercept
    HapticService.heavyImpact();

    // Load victory tally
    AsyncStorage.getItem(IMPULSE_VICTORY_KEY).then((val) => {
      if (val) setVictoriesCount(parseInt(val, 10));
    });

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 1800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1.0,
          duration: 1800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handleStartConsciousTimer = () => {
    setHasStartedTimer(true);
    HapticService.selection();

    let remaining = 10;
    const interval = setInterval(() => {
      remaining -= 1;
      setConsciousCountdown(remaining);
      HapticService.lightImpact();

      if (remaining <= 0) {
        clearInterval(interval);
        setCanProceed(true);
        HapticService.heavyImpact();
      }
    }, 1000);
  };

  const handleSelectIntention = (intention: ImpulseIntention) => {
    HapticService.selection();
    setSelectedIntention(intention);
    if (!hasStartedTimer) {
      handleStartConsciousTimer();
    }
  };

  const handleProceedToInstagram = async () => {
    HapticService.mediumImpact();
    const instagramUrl = 'instagram://app';
    const canOpen = await Linking.canOpenURL(instagramUrl);
    if (canOpen) {
      await Linking.openURL(instagramUrl);
    } else {
      await Linking.openURL('https://instagram.com');
    }
    onBack();
  };

  const handleDrownInPresence = async () => {
    HapticService.successNotification();
    const newCount = victoriesCount + 1;
    setVictoriesCount(newCount);
    await AsyncStorage.setItem(IMPULSE_VICTORY_KEY, newCount.toString());

    // Log victory over drift in database
    await dbService.logPracticeAttempt(98, 30, 100);
    onBack();
  };

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <View style={styles.shieldPill}>
          <Text style={styles.shieldIcon}>🛡️</Text>
          <Text style={styles.shieldPillText}>OBSIDIAN SHIELD ACTIVE</Text>
        </View>

        <View style={styles.victoryBadge}>
          <Text style={styles.victoryBadgeText}>⚡ {victoriesCount} Conquered Today</Text>
        </View>

        <TouchableOpacity onPress={onBack} style={styles.closeBtn}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Main Core Eye */}
        <View style={styles.centerCard}>
          <Animated.View
            style={[
              styles.pulseOrb,
              { transform: [{ scale: pulseAnim }] },
              selectedIntention === 'boredom' && styles.pulseOrbVictory,
            ]}
          >
            <Text style={styles.orbEmoji}>
              {selectedIntention === 'boredom' ? '🧘' : '👁️'}
            </Text>
          </Animated.View>

          <Text style={styles.interceptTitle}>UNCONSCIOUS DRIFT INTERCEPTED</Text>
          <Text style={styles.interceptSub}>
            You reached for Instagram out of automatic habit. Before dopamine takes over, pause.
          </Text>

          {/* Intention Categorization Chips (One Sec / Opal UX Pattern) */}
          <View style={styles.intentionSection}>
            <Text style={styles.intentionPrompt}>WHAT IS DRIVING THIS IMPULSE?</Text>
            <View style={styles.intentionRow}>
              {[
                { id: 'boredom', label: '🥱 Boredom Loop', tag: 'DOPAMINE' },
                { id: 'work', label: '💼 Work / Message', tag: 'TASK' },
                { id: 'conscious', label: '🎯 Intentional Choice', tag: 'AWARE' },
              ].map((item) => {
                const isSel = selectedIntention === item.id;
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[styles.intentionChip, isSel && styles.intentionChipSelected]}
                    onPress={() => handleSelectIntention(item.id as any)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.intentionText, isSel && styles.intentionTextSelected]}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Conscious Pause Guidance */}
          <View style={styles.pauseCard}>
            <Text style={styles.pauseTag}>
              {selectedIntention === 'boredom'
                ? 'VICTORY OPPORTUNITY'
                : 'CONSCIOUS THRESHOLD'}
            </Text>
            <Text style={styles.pauseTitle}>
              {hasStartedTimer
                ? `3 CONSCIOUS BREATHS • ${consciousCountdown}s`
                : 'NAME YOUR INTENTION'}
            </Text>
            <Text style={styles.pausePrompt}>
              {selectedIntention === 'boredom'
                ? 'You caught the dopamine reflex in flight. Close the app to claim today’s victory.'
                : 'Notice your feet on the floor. Take a full inhale and exhale into your belly.'}
            </Text>
          </View>

          <Text style={styles.inquiryQuote}>
            “Are you living this moment, or is an algorithm living you?”
          </Text>
        </View>

        {/* Action Decision */}
        <View style={styles.bottomActions}>
          <TouchableOpacity
            style={[
              styles.presenceBtn,
              selectedIntention === 'boredom' && styles.presenceBtnHighlight,
            ]}
            onPress={handleDrownInPresence}
            activeOpacity={0.85}
          >
            <Text style={styles.presenceBtnText}>
              {selectedIntention === 'boredom'
                ? 'CONQUER IMPULSE & STEP BACK (+1) ✨'
                : 'STAY ANCHORED (CLOSE APP) ✨'}
            </Text>
          </TouchableOpacity>

          {!hasStartedTimer ? (
            <TouchableOpacity
              style={styles.proceedSecondaryBtn}
              onPress={handleStartConsciousTimer}
              activeOpacity={0.8}
            >
              <Text style={styles.proceedSecondaryText}>
                I genuinely need Instagram (10s breath check)
              </Text>
            </TouchableOpacity>
          ) : !canProceed ? (
            <View style={styles.timerBox}>
              <Text style={styles.timerText}>
                Deep Inhale... Hold... Exhale... ({consciousCountdown}s)
              </Text>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.unlockedBtn}
              onPress={handleProceedToInstagram}
              activeOpacity={0.85}
            >
              <Text style={styles.unlockedBtnText}>
                OPEN INSTAGRAM CONSCIOUSLY →
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#070807',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32,
    justifyContent: 'space-between',
    minHeight: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  shieldPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 184, 0, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 184, 0, 0.3)',
  },
  shieldIcon: {
    fontSize: 12,
    marginRight: 6,
  },
  shieldPillText: {
    ...TYPOGRAPHY.caption,
    color: '#FFB800',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  victoryBadge: {
    backgroundColor: '#162217',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#2D4430',
  },
  victoryBadgeText: {
    ...TYPOGRAPHY.caption,
    color: '#39D98A',
    fontSize: 10,
    fontWeight: '800',
  },
  closeBtn: {
    padding: 6,
  },
  closeText: {
    color: '#8E958A',
    fontSize: 16,
    fontWeight: '700',
  },
  centerCard: {
    alignItems: 'center',
    marginVertical: 14,
  },
  pulseOrb: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#171B16',
    borderWidth: 2,
    borderColor: '#FFB800',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#FFB800',
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 6,
  },
  pulseOrbVictory: {
    borderColor: '#39D98A',
    shadowColor: '#39D98A',
  },
  orbEmoji: {
    fontSize: 32,
  },
  interceptTitle: {
    ...TYPOGRAPHY.h3,
    color: '#F4F4EC',
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  interceptSub: {
    ...TYPOGRAPHY.body,
    color: '#8E958A',
    textAlign: 'center',
    fontSize: 12,
    lineHeight: 18,
    maxWidth: '90%',
    marginBottom: 16,
  },
  intentionSection: {
    width: '100%',
    marginBottom: 14,
  },
  intentionPrompt: {
    ...TYPOGRAPHY.caption,
    color: '#B49860',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.2,
    textAlign: 'center',
    marginBottom: 8,
  },
  intentionRow: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
  },
  intentionChip: {
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: '#121512',
    borderWidth: 1,
    borderColor: '#242C24',
  },
  intentionChipSelected: {
    backgroundColor: '#19251A',
    borderColor: '#39D98A',
  },
  intentionText: {
    ...TYPOGRAPHY.caption,
    color: '#9CA395',
    fontSize: 11,
    fontWeight: '600',
  },
  intentionTextSelected: {
    color: '#39D98A',
    fontWeight: '800',
  },
  pauseCard: {
    width: '100%',
    backgroundColor: '#101310',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#222820',
    alignItems: 'center',
    marginBottom: 14,
  },
  pauseTag: {
    ...TYPOGRAPHY.caption,
    color: '#FFB800',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  pauseTitle: {
    ...TYPOGRAPHY.body,
    color: '#FFF',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 4,
  },
  pausePrompt: {
    ...TYPOGRAPHY.caption,
    color: '#8E958A',
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 16,
  },
  inquiryQuote: {
    ...TYPOGRAPHY.caption,
    color: '#656D60',
    fontSize: 11,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  bottomActions: {
    gap: 10,
    paddingTop: 10,
  },
  presenceBtn: {
    backgroundColor: '#FFB800',
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: '#FFB800',
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
  },
  presenceBtnHighlight: {
    backgroundColor: '#39D98A',
    shadowColor: '#39D98A',
  },
  presenceBtnText: {
    ...TYPOGRAPHY.caption,
    color: '#070807',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
  },
  proceedSecondaryBtn: {
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#121512',
    borderWidth: 1,
    borderColor: '#242A24',
    alignItems: 'center',
  },
  proceedSecondaryText: {
    ...TYPOGRAPHY.caption,
    color: '#8E958A',
    fontSize: 11,
    fontWeight: '600',
  },
  timerBox: {
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#161916',
    borderWidth: 1,
    borderColor: '#FFB80040',
    alignItems: 'center',
  },
  timerText: {
    ...TYPOGRAPHY.caption,
    color: '#FFB800',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  unlockedBtn: {
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#1A221A',
    borderWidth: 1,
    borderColor: '#39D98A',
    alignItems: 'center',
  },
  unlockedBtnText: {
    ...TYPOGRAPHY.caption,
    color: '#39D98A',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
});
