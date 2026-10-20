import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { COLORS } from '../../theme/colors';
import { TYPOGRAPHY } from '../../theme/typography';
import { selfInquiryEngine } from '../../features/manovigyan/SelfInquiryEngine';
import { InquiryCategory } from '../../types';

export const ManovigyanHome = ({
  onNavigate,
}: {
  onNavigate?: (screen: string, params?: any) => void;
}) => {
  const [radar] = useState(selfInquiryEngine.getRadarProfile());
  const ledger = selfInquiryEngine.getDeconstructionLedger();
  const conditionedCount = ledger.filter((i) => i.nature === 'conditioned_armor').length;
  const trueSelfCount = ledger.filter((i) => i.nature === 'true_self').length;

  const categories: {
    key: InquiryCategory;
    title: string;
    subtitle: string;
    icon: string;
    count: string;
  }[] = [
    {
      key: 'masks',
      title: 'The Social Mask (Persona)',
      subtitle: 'Unmask who you were taught to be vs. your innate temperament',
      icon: '🎭',
      count: '3 Scenarios',
    },
    {
      key: 'stress_lines',
      title: 'Ego Defenses & Stress Lines',
      subtitle: 'Enneagram disintegration habits that disguise as identity',
      icon: '⚡',
      count: '4 Scenarios',
    },
    {
      key: 'locus_of_control',
      title: 'Locus of Desire & Ambition',
      subtitle: 'Identify whether your primary goals are authentic or borrowed',
      icon: '🎯',
      count: '3 Scenarios',
    },
    {
      key: 'shadow',
      title: 'The Shadow Mirror',
      subtitle: 'Dissect projections, subconscious blindspots & irritation triggers',
      icon: '🪞',
      count: '4 Scenarios',
    },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.eyebrow}>THE PSYCHOLOGY OF SELF</Text>
        <Text style={styles.title}>MANOVIGYAN</Text>
        <Text style={styles.tagline}>
          "Neti-Neti" — What You Are vs. What You Are Not
        </Text>
      </View>

      {/* Psychological Mirror Card */}
      <View style={styles.mirrorCard}>
        <View style={styles.mirrorHeader}>
          <Text style={styles.cardTag}>PSYCHOLOGICAL MIRROR STATUS</Text>
          <Text style={styles.mirrorIndexText}>
            {Math.round((radar.authenticity + radar.internalAgency + radar.shadowIntegration) / 3)}% Authentic
          </Text>
        </View>

        <Text style={styles.mirrorHeadline}>Deconstruction Balance</Text>
        <Text style={styles.mirrorSub}>
          {conditionedCount} Conditioned Masks Identified · {trueSelfCount} Sovereign Pillars Anchored
        </Text>

        {/* 6 Radar Metrics Grid */}
        <View style={styles.metricsGrid}>
          <View style={styles.metricItem}>
            <Text style={styles.metricVal}>{radar.authenticity}%</Text>
            <Text style={styles.metricLabel}>Authenticity</Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricVal}>{radar.internalAgency}%</Text>
            <Text style={styles.metricLabel}>Internal Agency</Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricVal}>{radar.shadowIntegration}%</Text>
            <Text style={styles.metricLabel}>Shadow Integr.</Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricVal}>{radar.emotionalWitnessing}%</Text>
            <Text style={styles.metricLabel}>Witnessing</Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricVal}>{radar.stressGroundedness}%</Text>
            <Text style={styles.metricLabel}>Stress Armor</Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricVal}>{radar.nonAttachment}%</Text>
            <Text style={styles.metricLabel}>Non-Attachment</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.ledgerButton}
          onPress={() => onNavigate?.('SelfMirrorReport')}
          activeOpacity={0.8}
        >
          <Text style={styles.ledgerButtonText}>VIEW FULL "WHAT YOU ARE NOT" LEDGER →</Text>
        </TouchableOpacity>
      </View>

      {/* Daily Mirror Dilemma Launcher */}
      <View style={styles.dailyCard}>
        <View style={styles.dailyHeaderRow}>
          <Text style={styles.dailyTag}>TODAY'S INQUIRY DILEMMA</Text>
          <Text style={styles.dailyTime}>3 MIN</Text>
        </View>
        <Text style={styles.dailyTitle}>The Mask of Constant Compliance</Text>
        <Text style={styles.dailyDescription}>
          When pressured, do you harmonize out of genuine peace, or out of childhood terror of confrontation?
        </Text>
        <TouchableOpacity
          style={styles.dailyButton}
          onPress={() => onNavigate?.('InquirySession', { dilemmaId: 'dilemma_1' })}
          activeOpacity={0.8}
        >
          <Text style={styles.dailyButtonText}>COMMENCE SELF-INQUIRY 👁️</Text>
        </TouchableOpacity>
      </View>

      {/* 4 Inquiry Paths */}
      <Text style={styles.sectionHeader}>FOUR PATHWAYS OF SELF-DECONSTRUCTION</Text>

      {categories.map((cat) => (
        <TouchableOpacity
          key={cat.key}
          style={styles.categoryCard}
          onPress={() => onNavigate?.('InquirySession', { category: cat.key })}
          activeOpacity={0.8}
        >
          <View style={styles.catIconWrap}>
            <Text style={styles.catIcon}>{cat.icon}</Text>
          </View>
          <View style={styles.catContent}>
            <View style={styles.catTitleRow}>
              <Text style={styles.catTitle}>{cat.title}</Text>
              <Text style={styles.catCount}>{cat.count}</Text>
            </View>
            <Text style={styles.catSub}>{cat.subtitle}</Text>
          </View>
        </TouchableOpacity>
      ))}
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
    marginBottom: 20,
  },
  eyebrow: {
    ...TYPOGRAPHY.caption,
    color: COLORS.MANOVIGYAN_CYAN,
    letterSpacing: 2,
    marginBottom: 4,
  },
  title: {
    ...TYPOGRAPHY.h1,
    color: COLORS.TEXT_PRIMARY,
  },
  tagline: {
    ...TYPOGRAPHY.body,
    color: COLORS.TEXT_MUTED,
    marginTop: 4,
  },
  mirrorCard: {
    backgroundColor: COLORS.CARD,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.MANOVIGYAN_CYAN,
    marginBottom: 20,
  },
  mirrorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTag: {
    ...TYPOGRAPHY.caption,
    color: COLORS.TEXT_MUTED,
    letterSpacing: 1.5,
  },
  mirrorIndexText: {
    ...TYPOGRAPHY.h3,
    color: COLORS.MANOVIGYAN_CYAN,
  },
  mirrorHeadline: {
    ...TYPOGRAPHY.h2,
    color: COLORS.TEXT_PRIMARY,
  },
  mirrorSub: {
    ...TYPOGRAPHY.caption,
    color: COLORS.TEXT_SECONDARY,
    marginVertical: 4,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 14,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 12,
    padding: 10,
  },
  metricItem: {
    width: '33.33%',
    alignItems: 'center',
    paddingVertical: 8,
  },
  metricVal: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.MANOVIGYAN_CYAN,
  },
  metricLabel: {
    ...TYPOGRAPHY.caption,
    fontSize: 10,
    color: COLORS.TEXT_MUTED,
    marginTop: 2,
  },
  ledgerButton: {
    backgroundColor: 'rgba(0, 210, 211, 0.12)',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 210, 211, 0.3)',
  },
  ledgerButtonText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.MANOVIGYAN_CYAN,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  dailyCard: {
    backgroundColor: COLORS.CARD,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.PRIMARY,
    marginBottom: 24,
  },
  dailyHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dailyTag: {
    ...TYPOGRAPHY.caption,
    color: COLORS.PRIMARY,
    letterSpacing: 1,
  },
  dailyTime: {
    ...TYPOGRAPHY.caption,
    color: COLORS.TEXT_MUTED,
  },
  dailyTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.TEXT_PRIMARY,
    marginTop: 6,
    marginBottom: 4,
  },
  dailyDescription: {
    ...TYPOGRAPHY.body,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 16,
  },
  dailyButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  dailyButtonText: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.BACKGROUND,
    letterSpacing: 0.5,
  },
  sectionHeader: {
    ...TYPOGRAPHY.caption,
    color: COLORS.TEXT_MUTED,
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  categoryCard: {
    backgroundColor: COLORS.CARD,
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.BORDER_SUBTLE,
  },
  catIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  catIcon: {
    fontSize: 22,
  },
  catContent: {
    flex: 1,
  },
  catTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  catTitle: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.TEXT_PRIMARY,
  },
  catCount: {
    ...TYPOGRAPHY.caption,
    color: COLORS.MANOVIGYAN_CYAN,
  },
  catSub: {
    ...TYPOGRAPHY.caption,
    color: COLORS.TEXT_MUTED,
    marginTop: 2,
  },
});
