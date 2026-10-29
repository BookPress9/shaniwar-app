import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Animated,
  Easing,
} from 'react-native';
import { COLORS } from '../../theme/colors';
import { TYPOGRAPHY } from '../../theme/typography';
import { HapticService } from '../../services/haptics';

interface Props {
  onBack?: () => void;
}

type ForgeDuration = 25 | 45 | 90;

export const FocusSession = ({ onBack }: Props) => {
  const [durationMinutes, setDurationMinutes] = useState<ForgeDuration>(90);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(90 * 60);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isWitnessMirrorOpen, setIsWitnessMirrorOpen] = useState<boolean>(false);
  const [witnessSecondsLeft, setWitnessSecondsLeft] = useState<number>(7);
  const [isWitnessBellArmed, setIsWitnessBellArmed] = useState<boolean>(false);
  const [witnessBellMinutesLeft, setWitnessBellMinutesLeft] = useState<number>(7);

  // Animations for breath pulsing and witness mirror
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const witnessCircleAnim = useRef(new Animated.Value(0.85)).current;

  // Breathing pulse animation in Forge
  useEffect(() => {
    if (isActive) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 4000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 0.95,
            duration: 4000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isActive]);

  // Main Forge countdown timer
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isActive && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            setIsActive(false);
            HapticService.resonantDecayToSilence();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, secondsRemaining]);

  // 7-Second Witness Mirror countdown
  useEffect(() => {
    let witnessInterval: ReturnType<typeof setInterval> | null = null;
    if (isWitnessMirrorOpen && witnessSecondsLeft > 0) {
      // Animate breath circle expansion over 7 seconds
      Animated.timing(witnessCircleAnim, {
        toValue: 1.15,
        duration: 7000,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();

      witnessInterval = setInterval(() => {
        setWitnessSecondsLeft((prev) => {
          if (prev <= 1) {
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (witnessInterval) clearInterval(witnessInterval);
    };
  }, [isWitnessMirrorOpen, witnessSecondsLeft]);

  // 7-Minute Witness Bell countdown when user enters unconscious stream consciously
  useEffect(() => {
    let bellInterval: ReturnType<typeof setInterval> | null = null;
    if (isWitnessBellArmed && witnessBellMinutesLeft > 0) {
      bellInterval = setInterval(() => {
        setWitnessBellMinutesLeft((prev) => {
          if (prev <= 1) {
            setIsWitnessBellArmed(false);
            // Low resonant Tibetan bell rings in mind
            HapticService.resonantDecayToSilence();
            return 7;
          }
          return prev - 1;
        });
      }, 60000); // Check each minute
    }
    return () => {
      if (bellInterval) clearInterval(bellInterval);
    };
  }, [isWitnessBellArmed, witnessBellMinutesLeft]);

  const handleSelectDuration = (mins: ForgeDuration) => {
    if (isActive) return;
    HapticService.selection();
    setDurationMinutes(mins);
    setSecondsRemaining(mins * 60);
  };

  const handleToggleForge = () => {
    if (!isActive) {
      HapticService.heavyImpact();
      setIsActive(true);
      setSecondsRemaining(durationMinutes * 60);
    } else {
      // Steve Jobs Filter: Trigger Witness Mirror instead of punitive popup
      triggerWitnessMirror();
    }
  };

  const triggerWitnessMirror = () => {
    HapticService.lightImpact();
    setWitnessSecondsLeft(7);
    witnessCircleAnim.setValue(0.85);
    setIsWitnessMirrorOpen(true);
  };

  const handleStepBackToCenter = () => {
    HapticService.successNotification();
    setIsWitnessMirrorOpen(false);
  };

  const handleEnterWithAwareness = () => {
    HapticService.selection();
    setIsWitnessMirrorOpen(false);
    setIsWitnessBellArmed(true);
    setWitnessBellMinutesLeft(7);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const totalSecs = durationMinutes * 60;
  const progressRatio = totalSecs > 0 ? (totalSecs - secondsRemaining) / totalSecs : 0;

  return (
    <View style={styles.container}>
      {/* Witness Hairline Indicator (Subtle Amber Hairline at the very top of the screen) */}
      {isWitnessBellArmed && (
        <View style={styles.witnessHairline}>
          <Text style={styles.witnessHairlineText}>
            WITNESS LAMP ACTIVE • {witnessBellMinutesLeft}M MONASTERY BELL RECALL
          </Text>
        </View>
      )}

      {/* Top Header */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => {
            HapticService.selection();
            onBack?.();
          }}
          activeOpacity={0.8}
        >
          <Text style={styles.backText}>← Routine</Text>
        </TouchableOpacity>
        <Text style={styles.tag}>JIRA DEV-102 • THE WITNESS MIRROR</Text>
      </View>

      {/* Main Title & Philosophical Grounding */}
      <View style={styles.headerArea}>
        <Text style={styles.eyebrow}>THE SACRED IRON ANCHOR 02</Text>
        <Text style={styles.title}>The Golden Forge</Text>
        <Text style={styles.subtext}>
          No digital toys. No cartoon trees. You are forging an unbroken column of human attention in
          the fire of sovereign restraint.
        </Text>
      </View>

      {/* Duration Selector */}
      <View style={styles.durationSelector}>
        {([25, 45, 90] as ForgeDuration[]).map((m) => (
          <TouchableOpacity
            key={m}
            style={[
              styles.durationChip,
              durationMinutes === m && styles.durationChipActive,
              isActive && durationMinutes !== m && { opacity: 0.3 },
            ]}
            onPress={() => handleSelectDuration(m)}
            disabled={isActive}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.durationChipText,
                durationMinutes === m && styles.durationChipTextActive,
              ]}
            >
              {m === 90 ? '90M MONASTIC' : m === 45 ? '45M FORGE' : '25M SPRINT'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Center Forge Disc (Obsidian Pool with Amber Perimeter) */}
      <View style={styles.forgeCenter}>
        <Animated.View
          style={[
            styles.forgeDisc,
            {
              transform: [{ scale: pulseAnim }],
              borderColor: isActive ? '#FF9500' : 'rgba(255, 255, 255, 0.1)',
            },
          ]}
        >
          <Text style={styles.forgeStateLabel}>
            {isActive ? 'SHIELD ARMED • PRESENCE ACTIVE' : 'FORGE DORMANT'}
          </Text>
          <Text style={styles.timerDisplay}>{formatTime(secondsRemaining)}</Text>
          <Text style={styles.forgeProgressLabel}>
            {Math.round(progressRatio * 100)}% LIFE FORCE RETAINED
          </Text>

          {/* Minimalist Progress Arc Bar */}
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progressRatio * 100}%` }]} />
          </View>
        </Animated.View>
      </View>

      {/* Action Controls */}
      <View style={styles.controlsArea}>
        <TouchableOpacity
          style={[styles.primaryForgeBtn, isActive && styles.primaryForgeBtnActive]}
          onPress={handleToggleForge}
          activeOpacity={0.85}
        >
          <Text style={styles.primaryForgeBtnText}>
            {isActive ? 'INTERRUPT FORGE (WITNESS CHECK)' : 'IGNITE THE GOLDEN FORGE →'}
          </Text>
        </TouchableOpacity>

        {isActive && (
          <TouchableOpacity
            style={styles.simDistractionBtn}
            onPress={triggerWitnessMirror}
            activeOpacity={0.8}
          >
            <Text style={styles.simDistractionText}>
              👁️ Test Witness Intercept (Mindless Reflex Tapped)
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* STEVE JOBS MANDATE: THE WITNESS MIRROR (SAKSHI) MODAL */}
      <Modal visible={isWitnessMirrorOpen} transparent animationType="fade">
        <View style={styles.witnessBackdrop}>
          <View style={styles.witnessCard}>
            <Text style={styles.witnessEyebrow}>THE WITNESS OF SAKSHI • 7-SECOND BREATH PAUSE</Text>

            {/* Expanding Inhale Ring */}
            <View style={styles.witnessCircleContainer}>
              <Animated.View
                style={[
                  styles.witnessCircle,
                  {
                    transform: [{ scale: witnessCircleAnim }],
                  },
                ]}
              >
                <Text style={styles.witnessCountText}>{witnessSecondsLeft}s</Text>
                <Text style={styles.witnessCountSub}>ONE BREATH</Text>
              </Animated.View>
            </View>

            {/* The Sparse Bodhidharma Koan */}
            <Text style={styles.witnessKoan}>
              “You are entering the unconscious stream. Enter if you choose. But do not go in blind.”
            </Text>

            <Text style={styles.witnessContext}>
              A monastery has no locked doors. Only a courtyard where you can hear your own
              footsteps.
            </Text>

            {/* The Sovereign Dual Choice */}
            <View style={styles.witnessActions}>
              <TouchableOpacity
                style={styles.witnessReturnBtn}
                onPress={handleStepBackToCenter}
                activeOpacity={0.85}
              >
                <Text style={styles.witnessReturnText}>STEP BACK TO THE CENTER</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.witnessEnterBtn}
                onPress={handleEnterWithAwareness}
                activeOpacity={0.85}
              >
                <Text style={styles.witnessEnterText}>
                  ENTER WITH AWARENESS (7 MINUTES WITH WITNESS BELL)
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#070807', // Obsidian Black
    padding: 24,
    justifyContent: 'space-between',
  },
  witnessHairline: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 24,
    backgroundColor: 'rgba(255, 149, 0, 0.25)',
    borderBottomWidth: 1,
    borderBottomColor: '#FF9500',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
  witnessHairlineText: {
    color: '#FFB800',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  backText: {
    ...TYPOGRAPHY.body,
    color: COLORS.PRIMARY,
    fontWeight: '600',
  },
  tag: {
    ...TYPOGRAPHY.caption,
    color: COLORS.PRIMARY,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  headerArea: {
    marginTop: 10,
  },
  eyebrow: {
    ...TYPOGRAPHY.caption,
    color: '#FF9500',
    fontWeight: '800',
    letterSpacing: 2,
    fontSize: 10,
    marginBottom: 4,
  },
  title: {
    ...TYPOGRAPHY.h1,
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subtext: {
    ...TYPOGRAPHY.body,
    color: '#8E958A',
    fontSize: 13,
    lineHeight: 19,
    marginTop: 6,
  },
  durationSelector: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 12,
  },
  durationChip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#121412',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
  },
  durationChipActive: {
    backgroundColor: 'rgba(255, 149, 0, 0.12)',
    borderColor: '#FF9500',
  },
  durationChipText: {
    color: '#8E958A',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  durationChipTextActive: {
    color: '#FF9500',
  },
  forgeCenter: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
  },
  forgeDisc: {
    width: 280,
    height: 280,
    borderRadius: 140,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0A0C0A',
    padding: 20,
    shadowColor: '#FF9500',
    shadowOpacity: 0.15,
    shadowRadius: 30,
    elevation: 8,
  },
  forgeStateLabel: {
    fontSize: 10,
    color: '#FF9500',
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  timerDisplay: {
    fontFamily: 'Courier',
    fontSize: 48,
    color: '#FFFFFF',
    fontWeight: '800',
    letterSpacing: 2,
  },
  forgeProgressLabel: {
    fontSize: 10,
    color: '#8E958A',
    fontWeight: '700',
    letterSpacing: 1,
    marginTop: 8,
  },
  progressTrack: {
    width: 140,
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
    overflow: 'hidden',
    marginTop: 14,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FF9500',
  },
  controlsArea: {
    marginBottom: 20,
    gap: 12,
  },
  primaryForgeBtn: {
    backgroundColor: '#FF9500',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryForgeBtnActive: {
    backgroundColor: '#1E221E',
    borderWidth: 1,
    borderColor: '#FF9500',
  },
  primaryForgeBtnText: {
    color: '#070807',
    fontWeight: '800',
    fontSize: 13,
    letterSpacing: 1,
  },
  simDistractionBtn: {
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 10,
    backgroundColor: '#0F110F',
  },
  simDistractionText: {
    color: '#8E958A',
    fontSize: 11,
    fontWeight: '600',
  },
  // Witness Mirror Modal Styles
  witnessBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(7, 8, 7, 0.96)', // Seamless dark obsidian pool
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  witnessCard: {
    width: '100%',
    maxWidth: 380,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 149, 0, 0.3)',
    borderRadius: 20,
    padding: 24,
    backgroundColor: '#0A0C0A',
  },
  witnessEyebrow: {
    fontSize: 9,
    color: '#FF9500',
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 20,
    textAlign: 'center',
  },
  witnessCircleContainer: {
    width: 160,
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  witnessCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 2,
    borderColor: '#FF9500',
    backgroundColor: 'rgba(255, 149, 0, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  witnessCountText: {
    fontSize: 36,
    color: '#FFFFFF',
    fontWeight: '800',
    fontFamily: 'Courier',
  },
  witnessCountSub: {
    fontSize: 9,
    color: '#FF9500',
    fontWeight: '800',
    letterSpacing: 2,
    marginTop: 2,
  },
  witnessKoan: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 24,
    marginTop: 18,
    fontStyle: 'italic',
  },
  witnessContext: {
    color: '#8E958A',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
    lineHeight: 16,
  },
  witnessActions: {
    width: '100%',
    gap: 12,
  },
  witnessReturnBtn: {
    backgroundColor: '#FF9500',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  witnessReturnText: {
    color: '#070807',
    fontWeight: '800',
    fontSize: 12,
    letterSpacing: 1,
  },
  witnessEnterBtn: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#121412',
  },
  witnessEnterText: {
    color: '#8E958A',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
    textAlign: 'center',
    paddingHorizontal: 8,
  },
});
