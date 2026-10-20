import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { COLORS } from '../../theme/colors';
import { TYPOGRAPHY } from '../../theme/typography';
import { blockScheduler } from '../../features/focus/BlockScheduler';

export const RoutineHome = ({ onNavigate }: { onNavigate?: (screen: string) => void }) => {
  const [blocks, setBlocks] = useState(blockScheduler.getBlocks());
  const activeMonks = 1428; // Ambient body doubling counter (Flipd DNA)

  const toggleBlock = (id: string) => {
    blockScheduler.toggleBlock(id);
    setBlocks([...blockScheduler.getBlocks()]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.eyebrow}>DISCIPLINE OS</Text>
        <Text style={styles.title}>ROUTINE</Text>
        <View style={styles.ambientPill}>
          <View style={styles.greenPulse} />
          <Text style={styles.ambientText}>{activeMonks.toLocaleString()} Monks Locked In Now</Text>
        </View>
      </View>

      {/* Action Alarm Launcher */}
      <View style={styles.alarmCard}>
        <View style={styles.alarmHeader}>
          <Text style={styles.cardTag}>NEXT ACTION ALARM</Text>
          <Text style={styles.alarmTime}>05:30 AM</Text>
        </View>
        <Text style={styles.alarmSub}>Mission: 20-Step Walk + Sink Photo CV Match</Text>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onNavigate?.('AlarmMission')}
          activeOpacity={0.8}
        >
          <Text style={styles.actionButtonText}>TEST MORNING MISSION 🔥</Text>
        </TouchableOpacity>
      </View>

      {/* Focus Session Quick Jump */}
      <View style={styles.focusCard}>
        <Text style={styles.cardTag}>DEEP WORK COMMAND</Text>
        <Text style={styles.focusTitle}>25-Min Monk Tree Focus</Text>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => onNavigate?.('FocusSession')}
          activeOpacity={0.8}
        >
          <Text style={styles.secondaryButtonText}>ENTER MONK GROVE 🌲</Text>
        </TouchableOpacity>
      </View>

      {/* Daily Monk Blocks */}
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionHeader}>TODAY'S MONK BLOCKS</Text>
        <TouchableOpacity onPress={() => onNavigate?.('MonkBlocks')}>
          <Text style={styles.linkText}>Manage →</Text>
        </TouchableOpacity>
      </View>

      {blocks.map((block) => (
        <View key={block.id} style={[styles.blockCard, block.isActive && styles.blockCardActive]}>
          <View style={styles.blockInfo}>
            <Text style={styles.blockName}>{block.name}</Text>
            <Text style={styles.blockTime}>{block.startTime} – {block.endTime}</Text>
            <Text style={styles.blockStatus}>
              {block.isActive ? '🔒 Strict Lock Active' : '⚪ Paused'}
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.toggleButton, block.isActive && styles.toggleButtonActive]}
            onPress={() => toggleBlock(block.id)}
          >
            <Text style={styles.toggleText}>{block.isActive ? 'ARMED' : 'ARM'}</Text>
          </TouchableOpacity>
        </View>
      ))}

      {/* Evening Review Link */}
      <TouchableOpacity
        style={styles.reviewBanner}
        onPress={() => onNavigate?.('EveningReview')}
        activeOpacity={0.8}
      >
        <Text style={styles.reviewBannerText}>🌙 Complete Evening Review & Lock Tomorrow</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  eyebrow: {
    ...TYPOGRAPHY.caption,
    color: COLORS.ROUTINE_RED,
    letterSpacing: 2,
    marginBottom: 4,
  },
  title: {
    ...TYPOGRAPHY.h1,
    color: COLORS.TEXT_PRIMARY,
  },
  ambientPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(57, 217, 138, 0.1)',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: 'rgba(57, 217, 138, 0.3)',
  },
  greenPulse: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.SUCCESS,
    marginRight: 6,
  },
  ambientText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.SUCCESS,
    fontWeight: '600',
  },
  alarmCard: {
    backgroundColor: COLORS.CARD,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.ROUTINE_RED,
    marginBottom: 16,
  },
  alarmHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  cardTag: {
    ...TYPOGRAPHY.caption,
    color: COLORS.TEXT_MUTED,
    letterSpacing: 1.5,
  },
  alarmTime: {
    ...TYPOGRAPHY.h2,
    color: COLORS.ROUTINE_RED,
  },
  alarmSub: {
    ...TYPOGRAPHY.body,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 16,
  },
  actionButton: {
    backgroundColor: COLORS.ROUTINE_RED,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  actionButtonText: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.TEXT_PRIMARY,
    letterSpacing: 1,
  },
  focusCard: {
    backgroundColor: COLORS.CARD,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.PRIMARY,
    marginBottom: 24,
  },
  focusTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.PRIMARY,
    marginVertical: 8,
  },
  secondaryButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  secondaryButtonText: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.BACKGROUND,
    letterSpacing: 0.5,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionHeader: {
    ...TYPOGRAPHY.caption,
    color: COLORS.TEXT_MUTED,
    letterSpacing: 1.5,
  },
  linkText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.PRIMARY,
  },
  blockCard: {
    backgroundColor: COLORS.CARD,
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.BORDER_SUBTLE,
  },
  blockCardActive: {
    borderColor: COLORS.PRIMARY,
  },
  blockInfo: {
    flex: 1,
  },
  blockName: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 2,
  },
  blockTime: {
    ...TYPOGRAPHY.caption,
    color: COLORS.TEXT_MUTED,
    marginBottom: 2,
  },
  blockStatus: {
    ...TYPOGRAPHY.caption,
    color: COLORS.PRIMARY,
  },
  toggleButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.BORDER_SUBTLE,
  },
  toggleButtonActive: {
    backgroundColor: COLORS.PRIMARY,
    borderColor: COLORS.PRIMARY,
  },
  toggleText: {
    ...TYPOGRAPHY.caption,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
  },
  reviewBanner: {
    backgroundColor: COLORS.CARD,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderColor: COLORS.BORDER_SUBTLE,
  },
  reviewBannerText: {
    ...TYPOGRAPHY.body,
    color: COLORS.TEXT_SECONDARY,
  },
});
