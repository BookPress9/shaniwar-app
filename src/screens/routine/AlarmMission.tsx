import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../../theme/colors';
import { TYPOGRAPHY } from '../../theme/typography';
import { MissionType } from '../../types';
import { missionRunner } from '../../features/alarm/MissionRunner';

export const AlarmMission = ({ onBack }: { onBack?: () => void }) => {
  const [selectedType, setSelectedType] = useState<MissionType>('shake');
  const [currentCount, setCurrentCount] = useState(0);
  const targetCount = selectedType === 'shake' ? 25 : selectedType === 'walk' ? 20 : 1;
  const [isDone, setIsDone] = useState(false);

  const startMission = (type: MissionType) => {
    setSelectedType(type);
    setCurrentCount(0);
    setIsDone(false);
    missionRunner.startMission(type, targetCount);
  };

  const handleSimulateAction = () => {
    if (isDone) return;
    const nextCount = currentCount + 1;
    setCurrentCount(nextCount);
    const progress = missionRunner.recordIncrement();
    if (nextCount >= targetCount || progress.isVerified) {
      setIsDone(true);
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.statusLabel}>EMBODIED MISSION</Text>
      </View>

      <Text style={styles.title}>Silence the Monk Alarm</Text>
      <Text style={styles.subtitle}>
        Physical proof of wakefulness required. No snooze buttons exist.
      </Text>

      {/* Mission Type Selector */}
      <View style={styles.selectorRow}>
        {(['shake', 'walk', 'photo', 'qr'] as MissionType[]).map((type) => (
          <TouchableOpacity
            key={type}
            style={[styles.selectorTab, selectedType === type && styles.selectorTabActive]}
            onPress={() => startMission(type)}
          >
            <Text style={[styles.selectorTabText, selectedType === type && styles.selectorTabTextActive]}>
              {type.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Main Mission Display */}
      <View style={styles.missionCircleContainer}>
        <View style={[styles.pulseCircle, isDone && styles.pulseCircleDone]}>
          <Text style={styles.counterText}>
            {selectedType === 'photo' || selectedType === 'qr'
              ? isDone ? 'VERIFIED' : 'READY'
              : `${currentCount} / ${targetCount}`}
          </Text>
          <Text style={styles.counterSub}>
            {selectedType === 'shake'
              ? 'Vigorous Shakes'
              : selectedType === 'walk'
              ? 'Steps Taken'
              : selectedType === 'photo'
              ? 'Match Household Anchor'
              : 'Scan Bathroom QR'}
          </Text>
        </View>
      </View>

      {/* Action / Sensor Simulator Button */}
      <TouchableOpacity
        style={[styles.triggerButton, isDone && styles.triggerButtonDone]}
        onPress={handleSimulateAction}
        activeOpacity={0.8}
      >
        <Text style={styles.triggerButtonText}>
          {isDone
            ? 'MISSION VERIFIED ✓'
            : selectedType === 'shake'
            ? 'SIMULATE SHAKE (+1)'
            : selectedType === 'walk'
            ? 'SIMULATE STEP (+1)'
            : selectedType === 'photo'
            ? 'VERIFY CAMERA MATCH'
            : 'VERIFY QR CODE SCAN'}
        </Text>
      </TouchableOpacity>

      {isDone && (
        <View style={styles.wakeUpCheckNotice}>
          <Text style={styles.noticeTitle}>⚡ DOUBLE GATE ACTIVE</Text>
          <Text style={styles.noticeBody}>
            Monk Confirmation check scheduled in 5 minutes. If missed, alarm reactivates.
          </Text>
        </View>
      )}
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
  statusLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.ROUTINE_RED,
    letterSpacing: 1.5,
  },
  title: {
    ...TYPOGRAPHY.h1,
    color: COLORS.TEXT_PRIMARY,
    marginTop: 16,
  },
  subtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.TEXT_MUTED,
    marginTop: 4,
  },
  selectorRow: {
    flexDirection: 'row',
    marginVertical: 20,
    backgroundColor: COLORS.CARD,
    borderRadius: 12,
    padding: 4,
  },
  selectorTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  selectorTabActive: {
    backgroundColor: COLORS.ROUTINE_RED,
  },
  selectorTabText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.TEXT_MUTED,
    fontWeight: '700',
  },
  selectorTabTextActive: {
    color: COLORS.TEXT_PRIMARY,
  },
  missionCircleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 40,
  },
  pulseCircle: {
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 3,
    borderColor: COLORS.ROUTINE_RED,
    backgroundColor: 'rgba(232, 69, 69, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  pulseCircleDone: {
    borderColor: COLORS.SUCCESS,
    backgroundColor: 'rgba(57, 217, 138, 0.1)',
  },
  counterText: {
    ...TYPOGRAPHY.h1,
    fontSize: 32,
    color: COLORS.TEXT_PRIMARY,
  },
  counterSub: {
    ...TYPOGRAPHY.caption,
    color: COLORS.TEXT_MUTED,
    marginTop: 8,
    textAlign: 'center',
  },
  triggerButton: {
    backgroundColor: COLORS.ROUTINE_RED,
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  triggerButtonDone: {
    backgroundColor: COLORS.SUCCESS,
  },
  triggerButtonText: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.TEXT_PRIMARY,
    letterSpacing: 1,
  },
  wakeUpCheckNotice: {
    backgroundColor: COLORS.CARD,
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.PRIMARY,
    marginTop: 12,
  },
  noticeTitle: {
    ...TYPOGRAPHY.caption,
    color: COLORS.PRIMARY,
    fontWeight: '700',
    marginBottom: 4,
  },
  noticeBody: {
    ...TYPOGRAPHY.caption,
    color: COLORS.TEXT_SECONDARY,
  },
});
