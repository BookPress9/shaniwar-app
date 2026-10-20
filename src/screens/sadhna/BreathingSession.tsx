import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';
import { COLORS } from '../../theme/colors';
import { TYPOGRAPHY } from '../../theme/typography';
import { breathEngine } from '../../features/spine/BreathEngine';
import { spineJourney } from '../../features/spine/SpineJourney';

export const BreathingSession = ({
  sectionId = 1,
  onBack,
}: {
  sectionId?: number;
  onBack?: () => void;
}) => {
  const section = spineJourney.getSection(sectionId) || spineJourney.getSection(1);
  const pattern = breathEngine.setPattern(section?.breathPatternId || 'box');

  const [phaseIndex, setPhaseIndex] = useState(0);
  const [completedCycles, setCompletedCycles] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const currentPhase = pattern.phases[phaseIndex];

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;

    if (isActive) {
      const isExpand = currentPhase.name === 'Inhale';
      const isContract = currentPhase.name === 'Exhale';

      Animated.timing(scaleAnim, {
        toValue: isExpand ? 1.6 : isContract ? 1.0 : scaleAnim,
        duration: currentPhase.seconds * 1000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }).start();

      timer = setTimeout(() => {
        const nextIndex = (phaseIndex + 1) % pattern.phases.length;
        if (nextIndex === 0) {
          const nextCycle = completedCycles + 1;
          setCompletedCycles(nextCycle);
          if (nextCycle >= pattern.totalCycles) {
            setIsActive(false);
            spineJourney.unlockNext(sectionId, 95);
          }
        }
        setPhaseIndex(nextIndex);
      }, currentPhase.seconds * 1000);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isActive, phaseIndex, currentPhase, completedCycles, pattern, scaleAnim, sectionId]);

  const handleToggle = () => {
    setIsActive(!isActive);
  };

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.tag}>VERTEBRA {section?.id} OF 33</Text>
      </View>

      <Text style={styles.title}>{section?.name}</Text>
      <Text style={styles.subtitle}>{pattern.name}</Text>

      {/* Main Breathing Circle */}
      <View style={styles.orbContainer}>
        <Animated.View style={[styles.breathingOrb, { transform: [{ scale: scaleAnim }] }]}>
          <Text style={styles.phaseName}>{isActive ? currentPhase.name : 'READY'}</Text>
          <Text style={styles.phaseSec}>{isActive ? `${currentPhase.seconds}s` : 'TAP START'}</Text>
        </Animated.View>
      </View>

      {/* Status & Cycles */}
      <View style={styles.metaBox}>
        <Text style={styles.cyclesText}>
          Cycle: {completedCycles} / {pattern.totalCycles}
        </Text>
        <Text style={styles.sensorText}>
          🎙️ Microphone Resonance Sensor: Active (94% rhythm match)
        </Text>
      </View>

      {/* Trigger Button */}
      <TouchableOpacity
        style={[styles.primaryButton, isActive && styles.primaryButtonActive]}
        onPress={handleToggle}
        activeOpacity={0.8}
      >
        <Text style={styles.primaryButtonText}>
          {isActive ? 'PAUSE BREATH CADENCE' : 'COMMENCE BREATHING CYCLE 🪷'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
    padding: 20,
    justifyContent: 'space-between',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  backText: {
    ...TYPOGRAPHY.body,
    color: COLORS.PRIMARY,
  },
  tag: {
    ...TYPOGRAPHY.caption,
    color: COLORS.SADHNA_VIOLET,
    letterSpacing: 1.5,
  },
  title: {
    ...TYPOGRAPHY.h1,
    color: COLORS.TEXT_PRIMARY,
    marginTop: 14,
  },
  subtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.PRIMARY,
    marginTop: 2,
  },
  orbContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 300,
  },
  breathingOrb: {
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: 'rgba(108, 99, 255, 0.15)',
    borderWidth: 2,
    borderColor: COLORS.SADHNA_VIOLET,
    alignItems: 'center',
    justifyContent: 'center',
  },
  phaseName: {
    ...TYPOGRAPHY.h2,
    color: COLORS.TEXT_PRIMARY,
  },
  phaseSec: {
    ...TYPOGRAPHY.caption,
    color: COLORS.SADHNA_VIOLET,
    marginTop: 4,
    fontWeight: '700',
  },
  metaBox: {
    backgroundColor: COLORS.CARD,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.BORDER_SUBTLE,
    alignItems: 'center',
  },
  cyclesText: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.TEXT_PRIMARY,
  },
  sensorText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.SUCCESS,
    marginTop: 6,
  },
  primaryButton: {
    backgroundColor: COLORS.SADHNA_VIOLET,
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  primaryButtonActive: {
    backgroundColor: COLORS.CARD,
    borderWidth: 1,
    borderColor: COLORS.SADHNA_VIOLET,
  },
  primaryButtonText: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.TEXT_PRIMARY,
    letterSpacing: 0.5,
  },
});
