import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { COLORS } from '../../theme/colors';
import { TYPOGRAPHY } from '../../theme/typography';

export const EveningReview = ({ onBack }: { onBack?: () => void }) => {
  const [intention, setIntention] = useState('');
  const [locked, setLocked] = useState(false);
  const disciplineScore = 88;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.tag}>DAY CLOSING CEREMONY</Text>
      </View>

      <Text style={styles.title}>Evening Review</Text>
      <Text style={styles.subtitle}>
        Accountability is non-negotiable. Inspect today's execution and calibrate tomorrow's morning alarm.
      </Text>

      {/* Score Card */}
      <View style={styles.scoreCard}>
        <Text style={styles.scoreLabel}>TODAY'S DISCIPLINE SCORE</Text>
        <Text style={styles.scoreNumber}>{disciplineScore}%</Text>
        <Text style={styles.scoreSub}>3/3 Monk Blocks Protected · 1 Living Tree Planted</Text>
      </View>

      {/* Block Audit */}
      <View style={styles.auditCard}>
        <Text style={styles.auditTitle}>BLOCK AUDIT</Text>
        <Text style={styles.auditItem}>✓ Morning Command Block (06:00 - 08:00) — Passed</Text>
        <Text style={styles.auditItem}>✓ Deep Work Monastery (09:00 - 12:00) — Passed</Text>
        <Text style={styles.auditItem}>✓ Evening Sadhna (20:00 - 21:00) — Passed</Text>
      </View>

      {/* Tomorrow Intention Setting */}
      <View style={styles.intentionCard}>
        <Text style={styles.intentionTitle}>ARM TOMORROW'S INTENTION</Text>
        <TextInput
          style={styles.input}
          placeholder="What single mission must you accomplish before 12:00 PM?"
          placeholderTextColor={COLORS.TEXT_MUTED}
          value={intention}
          onChangeText={setIntention}
          multiline
        />
        <TouchableOpacity
          style={[styles.lockButton, locked && styles.lockButtonDone]}
          onPress={() => setLocked(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.lockButtonText}>
            {locked ? 'INTENTION LOCKED IN ✓' : 'LOCK IN TOMORROW & ARM 05:30 ALARM 🔒'}
          </Text>
        </TouchableOpacity>
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
    color: COLORS.ROUTINE_RED,
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
  },
  scoreCard: {
    backgroundColor: COLORS.CARD,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.PRIMARY,
    marginVertical: 16,
  },
  scoreLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.PRIMARY,
    letterSpacing: 1.5,
  },
  scoreNumber: {
    ...TYPOGRAPHY.h1,
    fontSize: 54,
    color: COLORS.TEXT_PRIMARY,
    marginVertical: 8,
  },
  scoreSub: {
    ...TYPOGRAPHY.caption,
    color: COLORS.TEXT_MUTED,
  },
  auditCard: {
    backgroundColor: COLORS.CARD,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.BORDER_SUBTLE,
  },
  auditTitle: {
    ...TYPOGRAPHY.caption,
    color: COLORS.TEXT_MUTED,
    letterSpacing: 1.5,
    marginBottom: 10,
  },
  auditItem: {
    ...TYPOGRAPHY.body,
    color: COLORS.SUCCESS,
    marginBottom: 6,
  },
  intentionCard: {
    backgroundColor: COLORS.CARD,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.BORDER_SUBTLE,
  },
  intentionTitle: {
    ...TYPOGRAPHY.caption,
    color: COLORS.ROUTINE_RED,
    letterSpacing: 1,
    marginBottom: 10,
  },
  input: {
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: 8,
    padding: 14,
    color: COLORS.TEXT_PRIMARY,
    fontSize: 14,
    minHeight: 80,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: COLORS.BORDER_SUBTLE,
    marginBottom: 12,
  },
  lockButton: {
    backgroundColor: COLORS.ROUTINE_RED,
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  lockButtonDone: {
    backgroundColor: COLORS.SUCCESS,
  },
  lockButtonText: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.TEXT_PRIMARY,
    letterSpacing: 0.5,
  },
});
