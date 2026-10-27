import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Linking,
} from 'react-native';
import { COLORS } from '../../theme/colors';
import { TYPOGRAPHY } from '../../theme/typography';
import { HapticService } from '../../services/haptics';
import { dbService } from '../../services/db';

interface Props {
  onBack: () => void;
}

export const InstagramShieldIntercept = ({ onBack }: Props) => {
  const [consciousCountdown, setConsciousCountdown] = useState<number>(10);
  const [canProceed, setCanProceed] = useState(false);
  const [hasStartedTimer, setHasStartedTimer] = useState(false);

  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Fire wake/alert haptic on intercept
    HapticService.heavyImpact();

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

  const handleProceedToInstagram = async () => {
    HapticService.mediumImpact();
    // Launch Instagram native app scheme
    const instagramUrl = 'instagram://app';
    const canOpen = await Linking.canOpenURL(instagramUrl);
    if (canOpen) {
      await Linking.openURL(instagramUrl);
    } else {
      await Linking.openURL('https://instagram.com');
    }
    onBack();
  };

  const handleDrownInPresence = () => {
    HapticService.successNotification();
    // Log victory over drift
    dbService.logPracticeAttempt(98, 30, 100);
    onBack();
  };

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <View style={styles.shieldPill}>
          <Text style={styles.shieldIcon}>🛡️</Text>
          <Text style={styles.shieldPillText}>IPHONE SHIELD WRAPPER ACTIVE</Text>
        </View>
        <TouchableOpacity onPress={onBack} style={styles.closeBtn}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
      </View>

      {/* Main Core */}
      <View style={styles.centerCard}>
        <Animated.View
          style={[
            styles.pulseOrb,
            { transform: [{ scale: pulseAnim }] },
          ]}
        >
          <Text style={styles.orbEmoji}>👁️</Text>
        </Animated.View>

        <Text style={styles.interceptTitle}>UNCONSCIOUS DRIFT INTERCEPTED</Text>
        <Text style={styles.interceptSub}>
          You reached for Instagram out of reflex. Before you scroll, wake up.
        </Text>

        {/* Conscious Pause Card */}
        <View style={styles.pauseCard}>
          <Text style={styles.pauseTag}>CONSCIOUS PAUSE</Text>
          <Text style={styles.pauseTitle}>BREATHE DEEPLY</Text>
          <Text style={styles.pausePrompt}>Break the reflex loop. Notice your body right here.</Text>
        </View>

        <Text style={styles.inquiryQuote}>
          “Are you living this moment, or is an algorithm living you?”
        </Text>
      </View>

      {/* Action Decision */}
      <View style={styles.bottomActions}>
        <TouchableOpacity
          style={styles.presenceBtn}
          onPress={handleDrownInPresence}
          activeOpacity={0.85}
        >
          <Text style={styles.presenceBtnText}>STAY ANCHORED (CLOSE APP) ✨</Text>
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
              Take 3 conscious breaths... {consciousCountdown}s
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#070707',
    padding: 24,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
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
  closeBtn: {
    padding: 8,
  },
  closeText: {
    color: COLORS.TEXT_MUTED,
    fontSize: 18,
  },
  centerCard: {
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  pulseOrb: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(232, 69, 69, 0.12)',
    borderWidth: 2,
    borderColor: COLORS.ROUTINE_RED,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: COLORS.ROUTINE_RED,
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 6,
  },
  orbEmoji: {
    fontSize: 36,
  },
  interceptTitle: {
    ...TYPOGRAPHY.h2,
    color: '#FFF',
    textAlign: 'center',
    letterSpacing: 2,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 8,
  },
  interceptSub: {
    ...TYPOGRAPHY.caption,
    color: COLORS.TEXT_MUTED,
    textAlign: 'center',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 20,
    maxWidth: 300,
  },
  pauseCard: {
    backgroundColor: '#131313',
    padding: 18,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#333',
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
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
    ...TYPOGRAPHY.h3,
    color: '#FFF',
    fontSize: 18,
    letterSpacing: 2,
    fontWeight: '800',
    marginBottom: 4,
  },
  pausePrompt: {
    ...TYPOGRAPHY.caption,
    color: COLORS.TEXT_MUTED,
    fontSize: 11,
    textAlign: 'center',
  },
  inquiryQuote: {
    ...TYPOGRAPHY.caption,
    color: '#A0A0A0',
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 18,
    fontSize: 12,
  },
  bottomActions: {
    gap: 12,
    paddingBottom: 20,
  },
  presenceBtn: {
    backgroundColor: '#FFB800',
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: 'center',
  },
  presenceBtnText: {
    color: '#000',
    fontWeight: '800',
    fontSize: 14,
    letterSpacing: 1,
  },
  proceedSecondaryBtn: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  proceedSecondaryText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.TEXT_MUTED,
    fontSize: 12,
    textDecorationLine: 'underline',
  },
  timerBox: {
    backgroundColor: '#181818',
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
    alignItems: 'center',
  },
  timerText: {
    ...TYPOGRAPHY.caption,
    color: '#FFB800',
    fontWeight: '700',
    fontSize: 13,
  },
  unlockedBtn: {
    backgroundColor: '#262626',
    borderWidth: 1,
    borderColor: '#444',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  unlockedBtnText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 13,
    letterSpacing: 1,
  },
});
