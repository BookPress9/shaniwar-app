import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { COLORS } from '../../theme/colors';
import { TYPOGRAPHY } from '../../theme/typography';
import { blockScheduler } from '../../features/focus/BlockScheduler';

export const MonkBlocks = ({ onBack }: { onBack?: () => void }) => {
  const [blocks, setBlocks] = useState(blockScheduler.getBlocks());
  const [newName, setNewName] = useState('');
  const [newStart, setNewStart] = useState('14:00');
  const [newEnd, setNewEnd] = useState('17:00');

  const handleAdd = () => {
    if (!newName.trim()) return;
    blockScheduler.addBlock(newName.trim(), newStart, newEnd, ['*']);
    setBlocks([...blockScheduler.getBlocks()]);
    setNewName('');
  };

  const handleToggle = (id: string) => {
    blockScheduler.toggleBlock(id);
    setBlocks([...blockScheduler.getBlocks()]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.tag}>DISCIPLINE SHIELD</Text>
      </View>

      <Text style={styles.title}>Monk Time Blocks</Text>
      <Text style={styles.subtitle}>
        Pre-committed focus windows. During active blocks, blacklisted apps are intercepted by the Monk Shield.
      </Text>

      {/* Add New Block Form */}
      <View style={styles.formCard}>
        <Text style={styles.formHeader}>CREATE NEW MONK BLOCK</Text>
        <TextInput
          style={styles.input}
          placeholder="Block Name (e.g. Afternoon Synthesis)"
          placeholderTextColor={COLORS.TEXT_MUTED}
          value={newName}
          onChangeText={setNewName}
        />
        <View style={styles.timeRow}>
          <TextInput
            style={[styles.input, styles.timeInput]}
            placeholder="Start (09:00)"
            placeholderTextColor={COLORS.TEXT_MUTED}
            value={newStart}
            onChangeText={setNewStart}
          />
          <TextInput
            style={[styles.input, styles.timeInput]}
            placeholder="End (12:00)"
            placeholderTextColor={COLORS.TEXT_MUTED}
            value={newEnd}
            onChangeText={setNewEnd}
          />
        </View>
        <TouchableOpacity style={styles.addButton} onPress={handleAdd} activeOpacity={0.8}>
          <Text style={styles.addButtonText}>LOCK IN NEW BLOCK +</Text>
        </TouchableOpacity>
      </View>

      {/* Existing Blocks List */}
      <Text style={styles.listHeader}>ACTIVE SCHEDULES</Text>
      {blocks.map((b) => (
        <View key={b.id} style={[styles.card, b.isActive && styles.cardActive]}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{b.name}</Text>
            <TouchableOpacity
              style={[styles.pill, b.isActive ? styles.pillActive : styles.pillInactive]}
              onPress={() => handleToggle(b.id)}
            >
              <Text style={styles.pillText}>{b.isActive ? 'ACTIVE' : 'MUTED'}</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.timeWindow}>{b.startTime} – {b.endTime}</Text>
          <Text style={styles.cardDetail}>
            Shield: {b.blockedApps.includes('*') ? 'All Distracting Apps' : `${b.blockedApps.length} Apps Blocked`}
          </Text>
        </View>
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
  formCard: {
    backgroundColor: COLORS.CARD,
    borderRadius: 14,
    padding: 16,
    marginVertical: 16,
    borderWidth: 1,
    borderColor: COLORS.BORDER_SUBTLE,
  },
  formHeader: {
    ...TYPOGRAPHY.caption,
    color: COLORS.PRIMARY,
    letterSpacing: 1,
    marginBottom: 12,
  },
  input: {
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: 8,
    padding: 12,
    color: COLORS.TEXT_PRIMARY,
    borderWidth: 1,
    borderColor: COLORS.BORDER_SUBTLE,
    marginBottom: 10,
    fontSize: 14,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeInput: {
    flex: 0.48,
  },
  addButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 4,
  },
  addButtonText: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.BACKGROUND,
  },
  listHeader: {
    ...TYPOGRAPHY.caption,
    color: COLORS.TEXT_MUTED,
    letterSpacing: 1.5,
    marginTop: 12,
    marginBottom: 8,
  },
  card: {
    backgroundColor: COLORS.CARD,
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.BORDER_SUBTLE,
  },
  cardActive: {
    borderColor: COLORS.PRIMARY,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.TEXT_PRIMARY,
  },
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  pillActive: {
    backgroundColor: 'rgba(201, 146, 42, 0.2)',
  },
  pillInactive: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  pillText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.PRIMARY,
    fontWeight: '700',
  },
  timeWindow: {
    ...TYPOGRAPHY.h3,
    color: COLORS.PRIMARY,
    marginVertical: 4,
  },
  cardDetail: {
    ...TYPOGRAPHY.caption,
    color: COLORS.TEXT_MUTED,
  },
});
