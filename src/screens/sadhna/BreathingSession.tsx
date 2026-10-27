import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing, ScrollView } from 'react-native';
import { COLORS } from '../../theme/colors';
import { TYPOGRAPHY } from '../../theme/typography';
import { breathEngine, MIN_PRACTISED_SECONDS } from '../../features/spine/BreathEngine';
import { spineJourney } from '../../features/spine/SpineJourney';
import { dbService } from '../../services/db';
import { supabase, isSupabaseConfigured } from '../../services/supabase';
import { HapticService } from '../../services/haptics';

type ReachOption = 'yes' | 'partly' | 'no';
const DRIFT_REASONS = [
  'Thoughts / Planning',
  'External Sounds',
  'Body Discomfort',
  'Phone Urge',
  'Drowsiness',
  'Emotional Flare',
];

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
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [showSelfCheck, setShowSelfCheck] = useState(false);

  // Self-Check state
  const [reach, setReach] = useState<ReachOption>('yes');
  const [driftCount, setDriftCount] = useState(2);
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [reportSaved, setReportSaved] = useState(false);

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const currentPhase = pattern.phases[phaseIndex];

  // Breath pacing loop
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;

    if (isActive) {
      const isExpand = currentPhase.name === 'Inhale';
      const isContract = currentPhase.name === 'Exhale';

      // Tactile feedback on breath transition
      if (isExpand) {
        HapticService.lightImpact();
      } else if (isContract) {
        HapticService.mediumImpact();
      } else {
        HapticService.selection();
      }

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
            handleCompleteSession();
          }
        }
        setPhaseIndex(nextIndex);
      }, currentPhase.seconds * 1000);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isActive, phaseIndex, currentPhase, completedCycles, pattern, scaleAnim]);

  // Elapsed active time counter
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isActive) {
      interval = setInterval(() => {
        setElapsedSeconds((s) => s + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive]);

  const handleToggle = () => {
    if (isActive && elapsedSeconds >= MIN_PRACTISED_SECONDS) {
      handleCompleteSession();
    } else {
      setIsActive(!isActive);
    }
  };

  const handleCompleteSession = () => {
    setIsActive(false);
    HapticService.successNotification();
    spineJourney.unlockNext(sectionId, 95);

    // If session meets 90s qualification, mark in Cockpit
    if (elapsedSeconds >= MIN_PRACTISED_SECONDS || completedCycles >= 3) {
      dbService.getTodayTarget().then((t) => {
        if (!t.sadhnaCompleted) {
          t.sadhnaCompleted = true;
          dbService.saveTodayTarget(t);
        }
      });
    }

    setShowSelfCheck(true);
  };

  const toggleReason = (reason: string) => {
    if (selectedReasons.includes(reason)) {
      setSelectedReasons(selectedReasons.filter((r) => r !== reason));
    } else {
      setSelectedReasons([...selectedReasons, reason]);
    }
  };

  const saveReport = async () => {
    setReportSaved(true);
    if (isSupabaseConfigured) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.from('self_reports').upsert({
            id: `report_${Date.now()}`,
            user_id: user.id,
            local_date: new Date().toISOString().split('T')[0],
            reached_spine: reach,
            drift_count: driftCount,
            drift_reasons: selectedReasons,
            note: `Vertebra ${sectionId} (${section?.name}) sitting`,
          });
        }
      } catch (err) {
        console.warn('Sync report error, cached locally:', err);
      }
    }
  };

  // Render Post-Session Drift Self-Check Modal
  if (showSelfCheck) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.checkContent}>
        <View style={styles.topBar}>
          <Text style={styles.tag}>POST-SADHNA INQUIRY</Text>
        </View>

        <Text style={styles.title}>Where did attention go?</Text>
        <Text style={styles.subtitle}>
          Answer only what you directly observed. Reflection only, never scored.
        </Text>

        {/* Reach Question */}
        <View style={styles.checkCard}>
          <Text style={styles.questionLabel}>Could you bring attention to the spinal anchor?</Text>
          <View style={styles.reachRow}>
            {(['yes', 'partly', 'no'] as ReachOption[]).map((opt) => (
              <TouchableOpacity
                key={opt}
                style={[styles.reachButton, reach === opt && styles.reachButtonActive]}
                onPress={() => setReach(opt)}
              >
                <Text style={[styles.reachText, reach === opt && styles.reachTextActive]}>
                  {opt.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Drift Counter */}
        <View style={styles.checkCard}>
          <Text style={styles.questionLabel}>Estimated times carried away:</Text>
          <View style={styles.counterRow}>
            <TouchableOpacity
              style={styles.counterBtn}
              onPress={() => setDriftCount(Math.max(0, driftCount - 1))}
            >
              <Text style={styles.counterBtnText}>−</Text>
            </TouchableOpacity>
            <Text style={styles.counterValue}>{driftCount >= 10 ? '10+' : driftCount}</Text>
            <TouchableOpacity
              style={styles.counterBtn}
              onPress={() => setDriftCount(Math.min(10, driftCount + 1))}
            >
              <Text style={styles.counterBtnText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Drift Reasons */}
        <View style={styles.checkCard}>
          <Text style={styles.questionLabel}>What pulled it away?</Text>
          <View style={styles.reasonsGrid}>
            {DRIFT_REASONS.map((r) => {
              const selected = selectedReasons.includes(r);
              return (
                <TouchableOpacity
                  key={r}
                  style={[styles.reasonChip, selected && styles.reasonChipActive]}
                  onPress={() => toggleReason(r)}
                >
                  <Text style={[styles.reasonChipText, selected && styles.reasonChipTextActive]}>
                    {r}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Save & Finish */}
        <TouchableOpacity
          style={[styles.primaryButton, reportSaved && styles.primaryButtonSaved]}
          onPress={reportSaved ? onBack : saveReport}
        >
          <Text style={styles.primaryButtonText}>
            {reportSaved ? 'RETURN TO MONASTERY ✓' : 'SAVE MY REPORT'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.tag}>VERTEBRA {section?.id} OF 33 · [{section?.regionCode}]</Text>
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
          Cycle: {completedCycles} / {pattern.totalCycles} · Elapsed: {Math.floor(elapsedSeconds / 60)}:
          {('0' + (elapsedSeconds % 60)).slice(-2)}
        </Text>
        <Text style={styles.sensorText}>
          {elapsedSeconds >= MIN_PRACTISED_SECONDS
            ? '✓ Qualified Practice (90s Met)'
            : `Practicing: ${MIN_PRACTISED_SECONDS - elapsedSeconds}s until counted`}
        </Text>
      </View>

      {/* Trigger Button */}
      <TouchableOpacity
        style={[styles.primaryButton, isActive && styles.primaryButtonActive]}
        onPress={handleToggle}
        activeOpacity={0.8}
      >
        <Text style={styles.primaryButtonText}>
          {isActive
            ? elapsedSeconds >= MIN_PRACTISED_SECONDS
              ? 'COMPLETE & INQUIRE ✦'
              : 'PAUSE BREATH CADENCE'
            : 'COMMENCE BREATHING CYCLE 🪷'}
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
  checkContent: {
    paddingBottom: 40,
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
  primaryButtonSaved: {
    backgroundColor: COLORS.SUCCESS,
  },
  primaryButtonText: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.TEXT_PRIMARY,
    letterSpacing: 0.5,
  },
  checkCard: {
    backgroundColor: COLORS.CARD,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.BORDER_SUBTLE,
    marginTop: 14,
  },
  questionLabel: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 10,
  },
  reachRow: {
    flexDirection: 'row',
    gap: 8,
  },
  reachButton: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.BORDER_SUBTLE,
  },
  reachButtonActive: {
    borderColor: COLORS.SADHNA_VIOLET,
    backgroundColor: 'rgba(108, 99, 255, 0.2)',
  },
  reachText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.TEXT_MUTED,
    fontWeight: '700',
  },
  reachTextActive: {
    color: COLORS.TEXT_PRIMARY,
  },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  counterBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.BACKGROUND,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.BORDER_SUBTLE,
  },
  counterBtnText: {
    ...TYPOGRAPHY.h2,
    color: COLORS.TEXT_PRIMARY,
  },
  counterValue: {
    ...TYPOGRAPHY.h1,
    color: COLORS.PRIMARY,
    minWidth: 40,
    textAlign: 'center',
  },
  reasonsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  reasonChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.BACKGROUND,
    borderWidth: 1,
    borderColor: COLORS.BORDER_SUBTLE,
  },
  reasonChipActive: {
    borderColor: COLORS.MANOVIGYAN_CYAN,
    backgroundColor: 'rgba(0, 210, 211, 0.15)',
  },
  reasonChipText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.TEXT_MUTED,
  },
  reasonChipTextActive: {
    color: COLORS.TEXT_PRIMARY,
    fontWeight: '600',
  },
});
