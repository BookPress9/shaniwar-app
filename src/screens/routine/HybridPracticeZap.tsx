import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Vibration } from 'react-native';
import { COLORS } from '../../theme/colors';
import { TYPOGRAPHY } from '../../theme/typography';
import { HapticService } from '../../services/haptics';
import { motionSensorService } from '../../services/motionSensor';
import { dbService } from '../../services/db';

interface Props {
  practiceType: 'kundalini_breath' | 'osho_stop' | 'evening_witness';
  onBack: () => void;
}

export const HybridPracticeZap = ({ practiceType, onBack }: Props) => {
  const [secondsLeft, setSecondsLeft] = useState(
    practiceType === 'osho_stop' ? 60 : practiceType === 'kundalini_breath' ? 90 : 60
  );
  const [phase, setPhase] = useState<'CHARGE' | 'HOLD' | 'STILL' | 'COMPLETE'>('CHARGE');
  const [motionJitter, setMotionJitter] = useState(0);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.25,
          duration: practiceType === 'kundalini_breath' ? 1200 : 2500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1.0,
          duration: practiceType === 'kundalini_breath' ? 1200 : 2500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // CoreMotion Tremor Monitoring for Osho STOP
    if (practiceType === 'osho_stop') {
      motionSensorService.startListening(100, (progress) => {
        // Any motion spike
        setMotionJitter((prev) => prev + 1);
        HapticService.lightImpact();
      });
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleComplete();
          return 0;
        }

        // Mid-way phase switch for Kundalini breath (Charge -> Empty Hold)
        if (practiceType === 'kundalini_breath' && prev === 30) {
          setPhase('HOLD');
          HapticService.heavyImpact();
        }

        if (practiceType === 'kundalini_breath') {
          HapticService.lightImpact();
        }

        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
      motionSensorService.stopListening();
    };
  }, []);

  const handleComplete = () => {
    setPhase('COMPLETE');
    HapticService.successNotification();
    dbService.logPracticeAttempt(
      practiceType === 'osho_stop' ? 99 : 1,
      practiceType === 'osho_stop' ? 60 : 90,
      100
    );
  };

  const getTitle = () => {
    if (practiceType === 'osho_stop') return 'OSHO STOP';
    if (practiceType === 'kundalini_breath') return 'KUNDALINI CHARGE';
    return 'EVENING WITNESS';
  };

  const getInstructions = () => {
    if (practiceType === 'osho_stop') {
      return phase === 'COMPLETE'
        ? 'Stillness solidified. You snapped the algorithm.'
        : 'FREEZE. Zero movement. Do not adjust your posture. Observe the mind trying to twitch.';
    }
    if (practiceType === 'kundalini_breath') {
      if (phase === 'HOLD') {
        return 'EXHALE FULLY & HOLD ON EMPTY. Surrender to the silent void inside the spine.';
      }
      return phase === 'COMPLETE'
        ? 'Voltage charged. Central channel cleared.'
        : 'RAPID BELLOWS BREATH. Deep belly pump in and out through the nose.';
    }
    return phase === 'COMPLETE'
      ? 'Armor released. Step into sovereign rest.'
      : 'Breathe slowly. Release every attachment to today’s battles. You are the sky, not the clouds.';
  };

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backText}>← Routine</Text>
        </TouchableOpacity>
        <Text style={styles.tag}>HYBRID MONK PATH</Text>
      </View>

      <View style={styles.centerContainer}>
        {/* Animated Energy Core */}
        <Animated.View
          style={[
            styles.pulseOrb,
            { transform: [{ scale: pulseAnim }] },
            phase === 'HOLD' && styles.pulseOrbHold,
            phase === 'COMPLETE' && styles.pulseOrbComplete,
          ]}
        >
          <Text style={styles.emoji}>
            {phase === 'COMPLETE'
              ? '✨'
              : practiceType === 'osho_stop'
              ? '🛑'
              : phase === 'HOLD'
              ? '🌑'
              : '⚡'}
          </Text>
        </Animated.View>

        <Text style={styles.title}>{getTitle()}</Text>
        <Text style={styles.timer}>
          {phase === 'COMPLETE' ? '00:00' : `${Math.floor(secondsLeft / 60)}:${(secondsLeft % 60).toString().padStart(2, '0')}`}
        </Text>

        <View style={styles.instructionCard}>
          <Text style={styles.instructionText}>{getInstructions()}</Text>
        </View>

        {practiceType === 'osho_stop' && phase !== 'COMPLETE' && (
          <View style={styles.motionBadge}>
            <Text style={styles.motionText}>
              CoreMotion Tremor Count: <Text style={styles.goldText}>{motionJitter}</Text>
            </Text>
          </View>
        )}
      </View>

      {/* Bottom CTA */}
      <View style={styles.bottomBar}>
        {phase === 'COMPLETE' ? (
          <TouchableOpacity style={styles.finishBtn} onPress={onBack} activeOpacity={0.85}>
            <Text style={styles.finishBtnText}>RETURN TO ROUTINE 🔥</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.abortBtn} onPress={onBack} activeOpacity={0.8}>
            <Text style={styles.abortText}>End Practice</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
    padding: 24,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 16,
  },
  backButton: {
    padding: 8,
  },
  backText: {
    ...TYPOGRAPHY.body,
    color: COLORS.TEXT_MUTED,
  },
  tag: {
    ...TYPOGRAPHY.caption,
    color: '#FFB800',
    letterSpacing: 2,
    fontWeight: '700',
  },
  centerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseOrb: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255, 184, 0, 0.12)',
    borderWidth: 2,
    borderColor: '#FFB800',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    shadowColor: '#FFB800',
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 8,
  },
  pulseOrbHold: {
    borderColor: '#6C63FF',
    backgroundColor: 'rgba(108, 99, 255, 0.15)',
    shadowColor: '#6C63FF',
  },
  pulseOrbComplete: {
    borderColor: COLORS.SUCCESS,
    backgroundColor: 'rgba(57, 217, 138, 0.15)',
    shadowColor: COLORS.SUCCESS,
  },
  emoji: {
    fontSize: 44,
  },
  title: {
    ...TYPOGRAPHY.h2,
    color: COLORS.TEXT_PRIMARY,
    letterSpacing: 3,
    marginBottom: 8,
  },
  timer: {
    fontSize: 52,
    fontWeight: '800',
    color: '#FFB800',
    fontVariant: ['tabular-nums'],
    marginBottom: 24,
  },
  instructionCard: {
    backgroundColor: '#141414',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#262626',
    maxWidth: 320,
  },
  instructionText: {
    ...TYPOGRAPHY.body,
    color: COLORS.TEXT_PRIMARY,
    textAlign: 'center',
    lineHeight: 22,
  },
  motionBadge: {
    marginTop: 18,
    backgroundColor: '#1E1E1E',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  motionText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.TEXT_MUTED,
  },
  goldText: {
    color: '#FFB800',
    fontWeight: '700',
  },
  bottomBar: {
    paddingBottom: 24,
  },
  finishBtn: {
    backgroundColor: '#FFB800',
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: 'center',
  },
  finishBtnText: {
    color: '#000',
    fontWeight: '800',
    fontSize: 16,
    letterSpacing: 1,
  },
  abortBtn: {
    alignItems: 'center',
    padding: 12,
  },
  abortText: {
    color: COLORS.TEXT_MUTED,
    ...TYPOGRAPHY.caption,
  },
});
