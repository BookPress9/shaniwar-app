import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { COLORS } from '../../theme/colors';
import { TYPOGRAPHY } from '../../theme/typography';
import { pomodoroSession } from '../../features/focus/PomodoroSession';

export const FocusSession = ({ onBack }: { onBack?: () => void }) => {
  const [taskName, setTaskName] = useState('Deep Work Architecture');
  const [secondsRemaining, setSecondsRemaining] = useState(25 * 60);
  const totalSeconds = 25 * 60;
  const [isActive, setIsActive] = useState(false);
  const [treeHealth, setTreeHealth] = useState(100);
  const [showGiveUpModal, setShowGiveUpModal] = useState(false);

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
      setShowGiveUpModal(true);
    }
  };

  const handleConfirmGiveUp = () => {
    setShowGiveUpModal(false);
    setIsActive(false);
    setTreeHealth(0); // Withers tree
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

  // Determine Growth Stage (Forest Loss Aversion DNA)
  const elapsed = totalSeconds - secondsRemaining;
  const progressRatio = elapsed / totalSeconds;
  let treeEmoji = '🌱'; // Seedling (0 - 25%)
  let treeStageName = 'Stage 1: Fragile Seedling';

  if (treeHealth <= 0) {
    treeEmoji = '🪵';
    treeStageName = 'Withered Stump (Killed)';
  } else if (treeHealth <= 40) {
    treeEmoji = '🥀';
    treeStageName = 'Dying Cedar (Distraction Critical)';
  } else if (progressRatio > 0.75) {
    treeEmoji = '🌲';
    treeStageName = 'Stage 4: Ancient Sovereign Cedar';
  } else if (progressRatio > 0.4) {
    treeEmoji = '🪴';
    treeStageName = 'Stage 3: Flourishing Sapling';
  } else if (progressRatio > 0.15) {
    treeEmoji = '🌿';
    treeStageName = 'Stage 2: Sprouting Branch';
  }

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.tag}>FOREST LOSS AVERSION ENGINE</Text>
      </View>

      <Text style={styles.title}>Monk Grove Sanctuary</Text>
      <Text style={styles.taskLabel}>CURRENT ANCHOR: {taskName}</Text>

      {/* Center Monk Tree Visualization */}
      <View style={styles.treeContainer}>
        <View style={[styles.treeAura, { borderColor: treeHealth > 50 ? COLORS.SUCCESS : COLORS.ROUTINE_RED }]}>
          <Text style={styles.treeEmoji}>{treeEmoji}</Text>
          <Text style={styles.treeStageTitle}>{treeStageName}</Text>
          <Text style={styles.timerDisplay}>{formatTime(secondsRemaining)}</Text>
          <Text style={styles.healthText}>
            Tree Health: {treeHealth}% {treeHealth < 100 && treeHealth > 0 ? '(Distraction Alert)' : ''}
          </Text>

          {/* Growth Progress Line */}
          <View style={styles.growthBarTrack}>
            <View style={[styles.growthBarFill, { width: `${progressRatio * 100}%` }]} />
          </View>
        </View>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.primaryButton, isActive && styles.primaryButtonActive]}
          onPress={handleToggleTimer}
          activeOpacity={0.8}
        >
          <Text style={styles.primaryButtonText}>
            {isActive ? 'ABORT & QUIT FOCUS' : 'COMMENCE 25-MIN FOCUS'}
          </Text>
        </TouchableOpacity>

        {isActive && (
          <TouchableOpacity
            style={styles.testPenaltyButton}
            onPress={handleSimulateDistraction}
            activeOpacity={0.8}
          >
            <Text style={styles.testPenaltyText}>⚠️ Simulate Leaving App (-25% Health Penalty)</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Forest Guilt Warning Modal (Loss Aversion Engine) */}
      <Modal visible={showGiveUpModal} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalEmoji}>🥀</Text>
            <Text style={styles.modalTitle}>Give Up and Kill Your Tree?</Text>
            <Text style={styles.modalDesc}>
              Leaving now will immediately kill your growing Cedar. A withered stump will be permanently logged in your 30-Day Monk Grove landscape.
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalKeepGoingBtn}
                onPress={() => setShowGiveUpModal(false)}
              >
                <Text style={styles.modalKeepGoingText}>STAY & PROTECT TREE 🌲</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalGiveUpBtn}
                onPress={handleConfirmGiveUp}
              >
                <Text style={styles.modalGiveUpText}>Give Up (Kill Tree)</Text>
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
    fontWeight: '700',
  },
  title: {
    ...TYPOGRAPHY.h1,
    color: COLORS.TEXT_PRIMARY,
    marginTop: 14,
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
    width: 270,
    height: 270,
    borderRadius: 135,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    padding: 10,
  },
  treeEmoji: {
    fontSize: 68,
    marginBottom: 4,
  },
  treeStageTitle: {
    ...TYPOGRAPHY.caption,
    fontSize: 10,
    color: COLORS.SUCCESS,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  timerDisplay: {
    ...TYPOGRAPHY.h1,
    fontSize: 38,
    color: COLORS.TEXT_PRIMARY,
  },
  healthText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.TEXT_MUTED,
    fontSize: 10,
    marginTop: 4,
  },
  growthBarTrack: {
    width: 140,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
    overflow: 'hidden',
    marginTop: 10,
  },
  growthBarFill: {
    height: '100%',
    backgroundColor: COLORS.SUCCESS,
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
    borderColor: COLORS.ROUTINE_RED,
  },
  primaryButtonText: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.BACKGROUND,
    letterSpacing: 1,
  },
  testPenaltyButton: {
    marginTop: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  testPenaltyText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.ROUTINE_RED,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    backgroundColor: COLORS.CARD,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.ROUTINE_RED,
    width: '100%',
  },
  modalEmoji: {
    fontSize: 48,
    marginBottom: 10,
  },
  modalTitle: {
    ...TYPOGRAPHY.h2,
    color: COLORS.TEXT_PRIMARY,
    textAlign: 'center',
    marginBottom: 8,
  },
  modalDesc: {
    ...TYPOGRAPHY.body,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  modalActions: {
    width: '100%',
  },
  modalKeepGoingBtn: {
    backgroundColor: COLORS.SUCCESS,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  modalKeepGoingText: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.BACKGROUND,
    letterSpacing: 0.5,
  },
  modalGiveUpBtn: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalGiveUpText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.ROUTINE_RED,
  },
});
