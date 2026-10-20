import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../../theme/colors';
import { TYPOGRAPHY } from '../../theme/typography';
import { pomodoroSession } from '../../features/focus/PomodoroSession';

export const FocusSession = ({ onBack }: { onBack?: () => void }) => {
  const [taskName, setTaskName] = useState('Deep Work Architecture');
  const [secondsRemaining, setSecondsRemaining] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [treeHealth, setTreeHealth] = useState(100);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isActive && secondsRemaining > 0) {
      interval = setInterval(() => {
        const update = pomodoroSession.tick();
        setSecondsRemaining(update.secondsRemaining);
        setTreeHealth(update.treeHealthPercent);
        if (update.isComplete) {
          setIsActive(false);
        }
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, secondsRemaining]);

  const handleToggleTimer = () => {
    if (!isActive) {
      pomodoroSession.startSession(taskName, 25);
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  };

  const handleSimulateDistraction = () => {
    const health = pomodoroSession.penalizeAppSwitch();
    setTreeHealth(health);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.tag}>FOREST LOSS AVERSION</Text>
      </View>

      <Text style={styles.title}>Monk Grove Focus</Text>
      <Text style={styles.taskLabel}>CURRENT INTENTION: {taskName}</Text>

      {/* Center Monk Tree Visualization */}
      <View style={styles.treeContainer}>
        <View style={[styles.treeAura, { borderColor: treeHealth > 50 ? COLORS.SUCCESS : COLORS.ROUTINE_RED }]}>
          <Text style={styles.treeEmoji}>{treeHealth > 50 ? '🌲' : treeHealth > 20 ? '🥀' : '🪵'}</Text>
          <Text style={styles.timerDisplay}>{formatTime(secondsRemaining)}</Text>
          <Text style={styles.healthText}>
            Tree Health: {treeHealth}% {treeHealth < 100 ? '(Distraction Detected)' : '(Optimal)'}
          </Text>
        </View>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.primaryButton, isActive && styles.primaryButtonActive]}
          onPress={handleToggleTimer}
          activeOpacity={0.8}
        >
          <Text style={styles.primaryButtonText}>{isActive ? 'PAUSE FOCUS' : 'COMMENCE FOCUS SESSION'}</Text>
        </TouchableOpacity>

        {isActive && (
          <TouchableOpacity
            style={styles.testPenaltyButton}
            onPress={handleSimulateDistraction}
            activeOpacity={0.8}
          >
            <Text style={styles.testPenaltyText}>⚠️ Simulate Leaving App (-25% Tree Health)</Text>
          </TouchableOpacity>
        )}
      </View>
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
    color: COLORS.PRIMARY,
    letterSpacing: 1.5,
  },
  title: {
    ...TYPOGRAPHY.h1,
    color: COLORS.TEXT_PRIMARY,
    marginTop: 16,
  },
  taskLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.PRIMARY,
    letterSpacing: 1,
    marginTop: 4,
  },
  treeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  treeAura: {
    width: 250,
    height: 250,
    borderRadius: 125,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
  },
  treeEmoji: {
    fontSize: 72,
    marginBottom: 8,
  },
  timerDisplay: {
    ...TYPOGRAPHY.h1,
    fontSize: 40,
    color: COLORS.TEXT_PRIMARY,
  },
  healthText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.TEXT_MUTED,
    marginTop: 6,
  },
  controls: {
    marginBottom: 20,
  },
  primaryButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonActive: {
    backgroundColor: COLORS.CARD,
    borderWidth: 1,
    borderColor: COLORS.PRIMARY,
  },
  primaryButtonText: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.BACKGROUND,
    letterSpacing: 1,
  },
  testPenaltyButton: {
    marginTop: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  testPenaltyText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.ROUTINE_RED,
  },
});
