import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { COLORS } from '../../theme/colors';
import { TYPOGRAPHY } from '../../theme/typography';
import { blockScheduler } from '../../features/focus/BlockScheduler';
import { spineJourney } from '../../features/spine/SpineJourney';
import { selfInquiryEngine } from '../../features/manovigyan/SelfInquiryEngine';
import { dbService, UserDailyTarget } from '../../services/db';
import { isSupabaseConfigured } from '../../services/supabase';
import { AuthModal } from '../auth/AuthModal';

export const SovereignCockpit = ({
  onNavigate,
}: {
  onNavigate?: (tab: string, screen?: string, params?: any) => void;
}) => {
  const [dailyTarget, setDailyTarget] = useState<UserDailyTarget>({
    alarmPassed: true,
    sadhnaCompleted: false,
    manovigyanCompleted: false,
    streakDays: 14,
    lastUpdated: new Date().toISOString().split('T')[0],
  });

  const [history, setHistory] = useState<Array<{ day: string; status: 'passed' | 'partial' | 'pending' }>>([]);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Sync state from DatabaseService (AsyncStorage + Supabase)
  useEffect(() => {
    const loadData = async () => {
      const target = await dbService.getTodayTarget();
      const pastWeek = await dbService.getSevenDayHistory();
      setDailyTarget(target);
      setHistory(pastWeek);
    };
    loadData();
  }, []);

  const blocks = blockScheduler.getBlocks();
  const armedBlocksCount = blocks.filter((b) => b.isActive).length;
  const unlockedVertebrae = spineJourney.getUnlockedCount();
  const radar = selfInquiryEngine.getRadarProfile();
  const ledger = selfInquiryEngine.getDeconstructionLedger();
  const shedMasksCount = ledger.filter((i) => i.nature === 'conditioned_armor').length;

  // Calculate clean progress
  const completedCount =
    Number(dailyTarget.alarmPassed) +
    Number(dailyTarget.sadhnaCompleted) +
    Number(dailyTarget.manovigyanCompleted);
  const progressPercent = Math.round((completedCount / 3) * 100);

  const toggleAnchorStatus = async (anchor: 'alarmPassed' | 'sadhnaCompleted' | 'manovigyanCompleted') => {
    const updated = await dbService.toggleAnchor(anchor);
    setDailyTarget({ ...updated });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* 1. TOP HEADER: Status, Sync & Streak */}
      <View style={styles.topHeader}>
        <TouchableOpacity style={styles.profileBadge} onPress={() => setShowAuthModal(true)}>
          <Text style={styles.profileIcon}>👤</Text>
          <View>
            <Text style={styles.profileName}>SOVEREIGN MONK</Text>
            <Text style={styles.syncState}>
              {isSupabaseConfigured ? '🟢 Supabase Cloud Synced' : '💾 Local Storage Active'}
            </Text>
          </View>
        </TouchableOpacity>

        <View style={styles.streakPill}>
          <Text style={styles.streakFire}>🔥</Text>
          <Text style={styles.streakCount}>{dailyTarget.streakDays} DAYS</Text>
        </View>
      </View>

      {/* 2. TODAY'S MASTER PROGRESS BAR */}
      <View style={styles.progressCard}>
        <View style={styles.progressHeaderRow}>
          <Text style={styles.progressCardTitle}>TODAY'S DISCIPLINE TARGET</Text>
          <Text style={styles.progressRatioText}>{completedCount} of 3 Anchors Complete ({progressPercent}%)</Text>
        </View>

        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
        </View>

        <Text style={styles.progressMotivation}>
          {completedCount === 3
            ? '🏆 Full Monastery Alignment Achieved. Day Locked.'
            : completedCount === 2
            ? '⚡ 1 Anchor remaining to protect today’s streak.'
            : '🌅 Morning commenced. Execute your routine anchors.'}
        </Text>
      </View>

      {/* 3. THE 3 MANDATORY DAILY ANCHORS (Goal-Oriented Checklist) */}
      <Text style={styles.sectionTitle}>TODAY'S 3 MANDATORY ANCHORS</Text>

      {/* ANCHOR 1: ROUTINE ALARM */}
      <View style={[styles.anchorCard, dailyTarget.alarmPassed && styles.anchorPassed]}>
        <TouchableOpacity
          style={[styles.checkbox, dailyTarget.alarmPassed && styles.checkboxActive]}
          onPress={() => toggleAnchorStatus('alarmPassed')}
        >
          <Text style={styles.checkboxText}>{dailyTarget.alarmPassed ? '✓' : ''}</Text>
        </TouchableOpacity>

        <View style={styles.anchorInfo}>
          <View style={styles.anchorTitleRow}>
            <Text style={styles.anchorName}>1. Dawn Action Alarm (05:30 AM)</Text>
            <Text style={[styles.statusTag, dailyTarget.alarmPassed ? styles.tagPassed : styles.tagPending]}>
              {dailyTarget.alarmPassed ? 'VERIFIED' : 'PENDING'}
            </Text>
          </View>
          <Text style={styles.anchorSub}>20-Step Spatial Walk + Bathroom Sink CV Verification</Text>
        </View>

        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => onNavigate?.('ROUTINE', 'AlarmMission')}
        >
          <Text style={styles.actionBtnText}>Test →</Text>
        </TouchableOpacity>
      </View>

      {/* ANCHOR 2: SADHNA BREATH */}
      <View style={[styles.anchorCard, dailyTarget.sadhnaCompleted && styles.anchorPassed]}>
        <TouchableOpacity
          style={[styles.checkbox, dailyTarget.sadhnaCompleted && styles.checkboxActive]}
          onPress={() => toggleAnchorStatus('sadhnaCompleted')}
        >
          <Text style={styles.checkboxText}>{dailyTarget.sadhnaCompleted ? '✓' : ''}</Text>
        </TouchableOpacity>

        <View style={styles.anchorInfo}>
          <View style={styles.anchorTitleRow}>
            <Text style={styles.anchorName}>2. Spine Sadhna (Vertebra {unlockedVertebrae})</Text>
            <Text style={[styles.statusTag, dailyTarget.sadhnaCompleted ? styles.tagPassed : styles.tagActive]}>
              {dailyTarget.sadhnaCompleted ? 'COMPLETED' : 'ACTIVE'}
            </Text>
          </View>
          <Text style={styles.anchorSub}>Box Breath (4-4-4-4) · 12 Continuous Cadence Cycles</Text>
        </View>

        <TouchableOpacity
          style={[styles.actionBtn, styles.actionBtnGold]}
          onPress={() => onNavigate?.('SADHNA', 'BreathingSession', { sectionId: unlockedVertebrae })}
        >
          <Text style={styles.actionBtnTextGold}>Breathe →</Text>
        </TouchableOpacity>
      </View>

      {/* ANCHOR 3: MANOVIGYAN INQUIRY */}
      <View style={[styles.anchorCard, dailyTarget.manovigyanCompleted && styles.anchorPassed]}>
        <TouchableOpacity
          style={[styles.checkbox, dailyTarget.manovigyanCompleted && styles.checkboxActive]}
          onPress={() => toggleAnchorStatus('manovigyanCompleted')}
        >
          <Text style={styles.checkboxText}>{dailyTarget.manovigyanCompleted ? '✓' : ''}</Text>
        </TouchableOpacity>

        <View style={styles.anchorInfo}>
          <View style={styles.anchorTitleRow}>
            <Text style={styles.anchorName}>3. Manovigyan Self-Inquiry</Text>
            <Text style={[styles.statusTag, dailyTarget.manovigyanCompleted ? styles.tagPassed : styles.tagPending]}>
              {dailyTarget.manovigyanCompleted ? 'SHED' : 'PENDING'}
            </Text>
          </View>
          <Text style={styles.anchorSub}>Dissect The Social Compliance Mask · "What You Are Not"</Text>
        </View>

        <TouchableOpacity
          style={[styles.actionBtn, styles.actionBtnCyan]}
          onPress={() => onNavigate?.('MANOVIGYAN', 'InquirySession')}
        >
          <Text style={styles.actionBtnTextCyan}>Inquire →</Text>
        </TouchableOpacity>
      </View>

      {/* 4. 7-DAY CONSISTENCY MATRIX */}
      <View style={styles.matrixCard}>
        <View style={styles.matrixHeader}>
          <Text style={styles.matrixTitle}>7-DAY DISCIPLINE MATRIX</Text>
          <Text style={styles.matrixScore}>6 of 7 Days Defended</Text>
        </View>

        <View style={styles.daysRow}>
          {history.map((h, idx) => (
            <View key={idx} style={styles.dayCol}>
              <View
                style={[
                  styles.dayDot,
                  h.status === 'passed' && styles.dotPassed,
                  h.status === 'partial' && styles.dotPartial,
                  h.status === 'pending' && styles.dotPending,
                ]}
              >
                <Text style={styles.dotIcon}>
                  {h.status === 'passed' ? '✓' : h.status === 'partial' ? '⚡' : '○'}
                </Text>
              </View>
              <Text style={styles.dayLabel}>{h.day}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* 5. LIVE DATABASE CORE METRICS */}
      <Text style={styles.sectionTitle}>PER-USER TRACKABLE METRICS</Text>

      <View style={styles.metricsGrid}>
        <View style={styles.metricCard}>
          <Text style={styles.metricVal}>{armedBlocksCount} / {blocks.length}</Text>
          <Text style={styles.metricLabel}>Monk Blocks Guarded</Text>
          <Text style={styles.metricSub}>Strict OS Shield Active</Text>
        </View>

        <View style={styles.metricCard}>
          <Text style={[styles.metricVal, { color: COLORS.SADHNA_VIOLET }]}>
            {unlockedVertebrae} / 33
          </Text>
          <Text style={styles.metricLabel}>Spine Stations Passed</Text>
          <Text style={styles.metricSub}>94% Breath Resonance</Text>
        </View>

        <View style={styles.metricCard}>
          <Text style={[styles.metricVal, { color: COLORS.MANOVIGYAN_CYAN }]}>
            {radar.authenticity}%
          </Text>
          <Text style={styles.metricLabel}>Authenticity Index</Text>
          <Text style={styles.metricSub}>{shedMasksCount} False Personas Shed</Text>
        </View>
      </View>

      {/* Auth Modal Launcher */}
      <AuthModal visible={showAuthModal} onClose={() => setShowAuthModal(false)} />
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
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileIcon: {
    fontSize: 24,
    marginRight: 10,
    backgroundColor: COLORS.CARD,
    padding: 6,
    borderRadius: 8,
  },
  profileName: {
    ...TYPOGRAPHY.bodyBold,
    fontSize: 13,
    color: COLORS.TEXT_PRIMARY,
  },
  syncState: {
    ...TYPOGRAPHY.caption,
    fontSize: 10,
    color: COLORS.PRIMARY,
    marginTop: 1,
  },
  streakPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(232, 69, 69, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(232, 69, 69, 0.3)',
  },
  streakFire: {
    fontSize: 16,
    marginRight: 4,
  },
  streakCount: {
    ...TYPOGRAPHY.caption,
    color: COLORS.ROUTINE_RED,
    fontWeight: '700',
  },
  progressCard: {
    backgroundColor: COLORS.CARD,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.PRIMARY,
    marginBottom: 22,
  },
  progressHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  progressCardTitle: {
    ...TYPOGRAPHY.caption,
    fontSize: 10,
    color: COLORS.PRIMARY,
    fontWeight: '700',
    letterSpacing: 1,
  },
  progressRatioText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.TEXT_PRIMARY,
    fontWeight: '700',
  },
  progressTrack: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.PRIMARY,
  },
  progressMotivation: {
    ...TYPOGRAPHY.caption,
    color: COLORS.TEXT_SECONDARY,
    fontStyle: 'italic',
  },
  sectionTitle: {
    ...TYPOGRAPHY.caption,
    color: COLORS.TEXT_MUTED,
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  anchorCard: {
    backgroundColor: COLORS.CARD,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.BORDER_SUBTLE,
  },
  anchorPassed: {
    borderColor: 'rgba(57, 217, 138, 0.3)',
    backgroundColor: 'rgba(57, 217, 138, 0.03)',
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: COLORS.BORDER_SUBTLE,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  checkboxActive: {
    backgroundColor: COLORS.SUCCESS,
    borderColor: COLORS.SUCCESS,
  },
  checkboxText: {
    color: COLORS.BACKGROUND,
    fontWeight: '800',
    fontSize: 14,
  },
  anchorInfo: {
    flex: 1,
  },
  anchorTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 3,
  },
  anchorName: {
    ...TYPOGRAPHY.bodyBold,
    fontSize: 13,
    color: COLORS.TEXT_PRIMARY,
  },
  statusTag: {
    ...TYPOGRAPHY.caption,
    fontSize: 8,
    fontWeight: '700',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  tagPassed: {
    backgroundColor: 'rgba(57, 217, 138, 0.15)',
    color: COLORS.SUCCESS,
  },
  tagActive: {
    backgroundColor: 'rgba(201, 146, 42, 0.15)',
    color: COLORS.PRIMARY,
  },
  tagPending: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    color: COLORS.TEXT_MUTED,
  },
  anchorSub: {
    ...TYPOGRAPHY.caption,
    fontSize: 10,
    color: COLORS.TEXT_MUTED,
  },
  actionBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginLeft: 8,
  },
  actionBtnGold: {
    backgroundColor: 'rgba(201, 146, 42, 0.15)',
  },
  actionBtnCyan: {
    backgroundColor: 'rgba(0, 210, 211, 0.15)',
  },
  actionBtnText: {
    ...TYPOGRAPHY.caption,
    fontSize: 11,
    color: COLORS.TEXT_SECONDARY,
    fontWeight: '700',
  },
  actionBtnTextGold: {
    ...TYPOGRAPHY.caption,
    fontSize: 11,
    color: COLORS.PRIMARY,
    fontWeight: '700',
  },
  actionBtnTextCyan: {
    ...TYPOGRAPHY.caption,
    fontSize: 11,
    color: COLORS.MANOVIGYAN_CYAN,
    fontWeight: '700',
  },
  matrixCard: {
    backgroundColor: COLORS.CARD,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.BORDER_SUBTLE,
    marginVertical: 14,
  },
  matrixHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  matrixTitle: {
    ...TYPOGRAPHY.caption,
    fontSize: 10,
    color: COLORS.PRIMARY,
    letterSpacing: 1,
    fontWeight: '700',
  },
  matrixScore: {
    ...TYPOGRAPHY.caption,
    color: COLORS.SUCCESS,
    fontWeight: '700',
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayCol: {
    alignItems: 'center',
  },
  dayDot: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    backgroundColor: '#1E1E1E',
  },
  dotPassed: {
    backgroundColor: COLORS.SUCCESS,
  },
  dotPartial: {
    backgroundColor: COLORS.PRIMARY,
  },
  dotPending: {
    backgroundColor: '#262626',
  },
  dotIcon: {
    color: COLORS.BACKGROUND,
    fontWeight: '700',
    fontSize: 12,
  },
  dayLabel: {
    ...TYPOGRAPHY.caption,
    fontSize: 10,
    color: COLORS.TEXT_MUTED,
  },
  metricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  metricCard: {
    width: '31%',
    backgroundColor: COLORS.CARD,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.BORDER_SUBTLE,
    alignItems: 'center',
  },
  metricVal: {
    ...TYPOGRAPHY.h3,
    fontSize: 16,
    color: COLORS.ROUTINE_RED,
    marginBottom: 2,
  },
  metricLabel: {
    ...TYPOGRAPHY.caption,
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
    textAlign: 'center',
    marginBottom: 2,
  },
  metricSub: {
    ...TYPOGRAPHY.caption,
    fontSize: 8,
    color: COLORS.TEXT_MUTED,
    textAlign: 'center',
  },
});
