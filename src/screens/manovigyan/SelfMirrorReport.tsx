import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { COLORS } from '../../theme/colors';
import { TYPOGRAPHY } from '../../theme/typography';
import { selfInquiryEngine } from '../../features/manovigyan/SelfInquiryEngine';

export const SelfMirrorReport = ({ onBack }: { onBack?: () => void }) => {
  const [filter, setFilter] = useState<'all' | 'true_self' | 'conditioned_armor'>('all');
  const ledger = selfInquiryEngine.getDeconstructionLedger();
  const radar = selfInquiryEngine.getRadarProfile();

  const filteredItems = ledger.filter((item) => {
    if (filter === 'all') return true;
    return item.nature === filter;
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.tag}>NETI-NETI DISIDENTIFICATION</Text>
      </View>

      <Text style={styles.title}>The Self-Mirror Ledger</Text>
      <Text style={styles.subtitle}>
        "You are not the mask you wore to survive. You are the space in which the mask is observed."
      </Text>

      {/* Overview Stat Badges */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>
            {ledger.filter((i) => i.nature === 'true_self').length}
          </Text>
          <Text style={styles.statLabel}>WHAT YOU ARE (CORE)</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statNumber, { color: COLORS.ROUTINE_RED }]}>
            {ledger.filter((i) => i.nature === 'conditioned_armor').length}
          </Text>
          <Text style={styles.statLabel}>WHAT YOU ARE NOT (ARMOR)</Text>
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterRow}>
        <TouchableOpacity
          style={[styles.filterTab, filter === 'all' && styles.filterTabActive]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>ALL</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterTab, filter === 'true_self' && styles.filterTabActive]}
          onPress={() => setFilter('true_self')}
        >
          <Text style={[styles.filterText, filter === 'true_self' && styles.filterTextActive]}>
            WHAT YOU ARE 🌿
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterTab, filter === 'conditioned_armor' && styles.filterTabActive]}
          onPress={() => setFilter('conditioned_armor')}
        >
          <Text style={[styles.filterText, filter === 'conditioned_armor' && styles.filterTextActive]}>
            WHAT YOU ARE NOT 🛡️
          </Text>
        </TouchableOpacity>
      </View>

      {/* Deconstruction Items */}
      {filteredItems.map((item) => {
        const isTrueSelf = item.nature === 'true_self';
        return (
          <View
            key={item.id}
            style={[
              styles.itemCard,
              isTrueSelf ? styles.cardTrueSelf : styles.cardConditioned,
            ]}
          >
            <View style={styles.itemHeader}>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text
                style={[
                  styles.badge,
                  isTrueSelf ? styles.badgeTrue : styles.badgeArmor,
                ]}
              >
                {isTrueSelf ? 'SOVEREIGN CORE' : 'CONDITIONED ARMOR'}
              </Text>
            </View>
            <Text style={styles.itemDescription}>{item.description}</Text>
            <Text style={styles.itemOrigin}>Origin: {item.origin}</Text>
          </View>
        );
      })}

      {/* Psychoanalytic Summary Card */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>CLINICAL & CONTEMPLATIVE SUMMARY</Text>
        <Text style={styles.summaryText}>
          Your primary defense mechanism is the <Text style={styles.highlight}>People-Pleasing Shield</Text>,
          activated during childhood to pacify unpredictable emotional climates. While this kept you secure,
          it now compromises your <Text style={styles.highlight}>Authenticity Index ({radar.authenticity}%)</Text>.
          Through Sadhna breath retention and Routine action alarms, you are retraining your nervous system to stay
          sovereign rather than accommodating.
        </Text>
      </View>
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
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 16,
  },
  backText: {
    ...TYPOGRAPHY.body,
    color: COLORS.PRIMARY,
  },
  tag: {
    ...TYPOGRAPHY.caption,
    color: COLORS.MANOVIGYAN_CYAN,
    letterSpacing: 1.5,
  },
  title: {
    ...TYPOGRAPHY.h1,
    color: COLORS.TEXT_PRIMARY,
  },
  subtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.TEXT_MUTED,
    marginVertical: 8,
    fontStyle: 'italic',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 16,
  },
  statBox: {
    flex: 0.48,
    backgroundColor: COLORS.CARD,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.BORDER_SUBTLE,
  },
  statNumber: {
    ...TYPOGRAPHY.h1,
    color: COLORS.MANOVIGYAN_CYAN,
    marginBottom: 4,
  },
  statLabel: {
    ...TYPOGRAPHY.caption,
    fontSize: 10,
    color: COLORS.TEXT_MUTED,
    textAlign: 'center',
  },
  filterRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.CARD,
    borderRadius: 10,
    padding: 4,
    marginBottom: 16,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  filterTabActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  filterText: {
    ...TYPOGRAPHY.caption,
    fontSize: 10,
    color: COLORS.TEXT_MUTED,
    fontWeight: '700',
  },
  filterTextActive: {
    color: COLORS.TEXT_PRIMARY,
  },
  itemCard: {
    backgroundColor: COLORS.CARD,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  cardTrueSelf: {
    borderColor: 'rgba(0, 210, 211, 0.3)',
    backgroundColor: 'rgba(0, 210, 211, 0.04)',
  },
  cardConditioned: {
    borderColor: 'rgba(232, 69, 69, 0.3)',
    backgroundColor: 'rgba(232, 69, 69, 0.04)',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  itemTitle: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.TEXT_PRIMARY,
    flex: 1,
  },
  badge: {
    ...TYPOGRAPHY.caption,
    fontSize: 9,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeTrue: {
    backgroundColor: 'rgba(0, 210, 211, 0.15)',
    color: COLORS.MANOVIGYAN_CYAN,
  },
  badgeArmor: {
    backgroundColor: 'rgba(232, 69, 69, 0.15)',
    color: COLORS.ROUTINE_RED,
  },
  itemDescription: {
    ...TYPOGRAPHY.body,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 8,
  },
  itemOrigin: {
    ...TYPOGRAPHY.caption,
    color: COLORS.TEXT_MUTED,
  },
  summaryCard: {
    backgroundColor: COLORS.CARD,
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.PRIMARY,
    marginTop: 12,
  },
  summaryTitle: {
    ...TYPOGRAPHY.caption,
    color: COLORS.PRIMARY,
    letterSpacing: 1,
    marginBottom: 8,
  },
  summaryText: {
    ...TYPOGRAPHY.body,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: 22,
  },
  highlight: {
    color: COLORS.TEXT_PRIMARY,
    fontWeight: '700',
  },
});
