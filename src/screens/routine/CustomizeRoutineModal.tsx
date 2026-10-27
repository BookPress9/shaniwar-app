import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Switch,
} from 'react-native';
import { COLORS } from '../../theme/colors';
import { TYPOGRAPHY } from '../../theme/typography';
import {
  routineService,
  ARCHETYPES,
  DincharyaArchetype,
} from '../../services/routineService';
import { HapticService } from '../../services/haptics';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export const CustomizeRoutineModal = ({ visible, onClose, onSaved }: Props) => {
  const [selectedArchetype, setSelectedArchetype] = useState<DincharyaArchetype>('builder');
  const [alarmHour, setAlarmHour] = useState(5);
  const [alarmMin, setAlarmMin] = useState(30);
  const [alarmMission, setAlarmMission] = useState<'walk' | 'shake' | 'photo'>('walk');

  const [focusStartHour, setFocusStartHour] = useState(9);
  const [focusEndHour, setFocusEndHour] = useState(13);

  const [enableDawnBreath, setEnableDawnBreath] = useState(true);
  const [enableMiddayStop, setEnableMiddayStop] = useState(true);
  const [enableNotifications, setEnableNotifications] = useState(true);

  useEffect(() => {
    if (visible) {
      routineService.getArchetype().then((arch) => setSelectedArchetype(arch));
      routineService.getRoutine().then((items) => {
        const alarm = items.find((i) => i.id === 'wake_alarm');
        if (alarm) {
          setAlarmHour(alarm.hour);
          setAlarmMin(alarm.minute);
          if (alarm.missionType) setAlarmMission(alarm.missionType);
        }
        const focus = items.find((i) => i.id === 'protection_window');
        if (focus) {
          setFocusStartHour(focus.hour);
          setFocusEndHour(focus.endHour || 13);
        }
      });
    }
  }, [visible]);

  const handleSelectArchetype = async (arch: DincharyaArchetype) => {
    HapticService.selection();
    setSelectedArchetype(arch);
    const updated = await routineService.applyArchetype(arch);
    const alarm = updated.find((i) => i.id === 'wake_alarm');
    if (alarm) {
      setAlarmHour(alarm.hour);
      setAlarmMin(alarm.minute);
      if (alarm.missionType) setAlarmMission(alarm.missionType);
    }
    const focus = updated.find((i) => i.id === 'protection_window');
    if (focus) {
      setFocusStartHour(focus.hour);
      setFocusEndHour(focus.endHour || 13);
    }
  };

  const handleSave = async () => {
    HapticService.heavyImpact();
    await routineService.updateAlarm(alarmHour, alarmMin, alarmMission);
    await routineService.updateProtectionWindow(focusStartHour, 0, focusEndHour, 0);

    const items = await routineService.getRoutine();
    for (const item of items) {
      if (item.id === 'dawn_breath' && item.enabled !== enableDawnBreath) {
        await routineService.toggleEnabled('dawn_breath');
      }
      if (item.id === 'midday_stop' && item.enabled !== enableMiddayStop) {
        await routineService.toggleEnabled('midday_stop');
      }
      if (!enableNotifications && item.notificationEnabled) {
        await routineService.toggleNotification(item.id);
      }
    }

    HapticService.successNotification();
    onSaved();
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.eyebrow}>दिनचर्या • DINCHARYA</Text>
              <Text style={styles.title}>CALIBRATE YOUR ARC</Text>
              <Text style={styles.subtitle}>Modern monks live in the world. Stay anchored.</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
            {/* 1. Life Archetype Selection */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTag}>STEP 1 • SELECT YOUR LIFE PATH</Text>
              <Text style={styles.sectionTitle}>Choose Your Dincharya Archetype</Text>
              <Text style={styles.sectionDesc}>
                Every life stage faces phone addiction differently. Pick your rhythm:
              </Text>

              <View style={styles.archetypeGrid}>
                {ARCHETYPES.map((arch) => {
                  const isSelected = selectedArchetype === arch.id;
                  return (
                    <TouchableOpacity
                      key={arch.id}
                      style={[styles.archetypeCard, isSelected && styles.archetypeCardSelected]}
                      onPress={() => handleSelectArchetype(arch.id)}
                      activeOpacity={0.8}
                    >
                      <View style={styles.archHeader}>
                        <Text style={styles.archIcon}>{arch.icon}</Text>
                        <Text style={[styles.archName, isSelected && { color: '#FFB800' }]}>
                          {arch.name}
                        </Text>
                      </View>
                      <Text style={styles.archTagline}>{arch.tagline}</Text>
                      <Text style={styles.archDesc}>{arch.description}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* 2. Wake Alarm Tuning */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTag}>CORE ANCHOR • MORNING IGNITION</Text>
              <Text style={styles.sectionTitle}>Wake Alarm & Mission</Text>

              <View style={styles.optionRow}>
                <Text style={styles.optionLabel}>Wake Time</Text>
                <View style={styles.timeChips}>
                  {[
                    { h: 5, m: 0, label: '05:00 AM' },
                    { h: 5, m: 30, label: '05:30 AM' },
                    { h: 5, m: 45, label: '05:45 AM' },
                    { h: 6, m: 0, label: '06:00 AM' },
                    { h: 6, m: 30, label: '06:30 AM' },
                  ].map((t) => {
                    const isSelected = alarmHour === t.h && alarmMin === t.m;
                    return (
                      <TouchableOpacity
                        key={t.label}
                        style={[styles.chip, isSelected && styles.chipSelected]}
                        onPress={() => {
                          setAlarmHour(t.h);
                          setAlarmMin(t.m);
                          HapticService.selection();
                        }}
                      >
                        <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                          {t.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              <View style={styles.optionRow}>
                <Text style={styles.optionLabel}>Wake Mission</Text>
                <View style={styles.missionChips}>
                  {[
                    { type: 'walk', label: '🚶 20-Step Walk' },
                    { type: 'shake', label: '📳 25 Shakes' },
                    { type: 'photo', label: '📸 Sink Photo' },
                  ].map((m) => {
                    const isSelected = alarmMission === m.type;
                    return (
                      <TouchableOpacity
                        key={m.type}
                        style={[styles.chip, isSelected && styles.chipSelected]}
                        onPress={() => {
                          setAlarmMission(m.type as any);
                          HapticService.selection();
                        }}
                      >
                        <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                          {m.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </View>

            {/* 3. Protection Window Tuning */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTag}>CORE ANCHOR • FOCUS SHIELD</Text>
              <Text style={styles.sectionTitle}>Deep Work / Presence Window</Text>

              <View style={styles.optionRow}>
                <Text style={styles.optionLabel}>Schedule</Text>
                <View style={styles.timeChips}>
                  {[
                    { start: 8, end: 12, label: '08:00 – 12:00' },
                    { start: 9, end: 13, label: '09:00 – 01:00' },
                    { start: 10, end: 14, label: '10:00 – 02:00' },
                    { start: 14, end: 18, label: '02:00 – 06:00' },
                  ].map((w) => {
                    const isSelected = focusStartHour === w.start && focusEndHour === w.end;
                    return (
                      <TouchableOpacity
                        key={w.label}
                        style={[styles.chip, isSelected && styles.chipSelected]}
                        onPress={() => {
                          setFocusStartHour(w.start);
                          setFocusEndHour(w.end);
                          HapticService.selection();
                        }}
                      >
                        <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                          {w.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </View>

            {/* 4. Hybrid Monk Injections */}
            <View style={styles.sectionCard}>
              <Text style={[styles.sectionTag, { color: '#FFB800' }]}>HYBRID MONK PATH</Text>
              <Text style={styles.sectionTitle}>Consciousness Injections</Text>

              <View style={styles.switchRow}>
                <View style={{ flex: 1, paddingRight: 10 }}>
                  <Text style={styles.switchTitle}>Dawn Breath Charge</Text>
                  <Text style={styles.switchSub}>3-min rapid spine oxygenation post-wake</Text>
                </View>
                <Switch
                  value={enableDawnBreath}
                  onValueChange={(val) => {
                    setEnableDawnBreath(val);
                    HapticService.selection();
                  }}
                  trackColor={{ false: '#333', true: '#FFB800' }}
                />
              </View>

              <View style={styles.switchRow}>
                <View style={{ flex: 1, paddingRight: 10 }}>
                  <Text style={styles.switchTitle}>Midday Osho STOP</Text>
                  <Text style={styles.switchSub}>60-sec absolute stillness freeze to break dopamine loop</Text>
                </View>
                <Switch
                  value={enableMiddayStop}
                  onValueChange={(val) => {
                    setEnableMiddayStop(val);
                    HapticService.selection();
                  }}
                  trackColor={{ false: '#333', true: '#FFB800' }}
                />
              </View>
            </View>

            {/* 5. Notifications */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTag}>NOTIFICATIONS</Text>
              <View style={styles.switchRow}>
                <View style={{ flex: 1, paddingRight: 10 }}>
                  <Text style={styles.switchTitle}>Transition Reminders</Text>
                  <Text style={styles.switchSub}>Live push alerts to keep you anchored through the day</Text>
                </View>
                <Switch
                  value={enableNotifications}
                  onValueChange={(val) => {
                    setEnableNotifications(val);
                    HapticService.selection();
                  }}
                  trackColor={{ false: '#333', true: '#FFB800' }}
                />
              </View>
            </View>
          </ScrollView>

          {/* Footer Save */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.85}>
              <Text style={styles.saveBtnText}>LOCK & ARM DINCHARYA 🔥</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#121212',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderColor: '#262626',
    maxHeight: '92%',
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#202020',
  },
  eyebrow: {
    ...TYPOGRAPHY.caption,
    color: '#FFB800',
    letterSpacing: 2,
    fontSize: 10,
    fontWeight: '800',
  },
  title: {
    ...TYPOGRAPHY.h3,
    color: '#EDEDED',
    letterSpacing: 1.5,
    marginTop: 2,
  },
  subtitle: {
    ...TYPOGRAPHY.caption,
    color: COLORS.TEXT_MUTED,
    marginTop: 2,
    fontSize: 11,
  },
  closeBtn: {
    padding: 8,
  },
  closeText: {
    color: COLORS.TEXT_MUTED,
    fontSize: 18,
  },
  content: {
    padding: 20,
    paddingBottom: 30,
  },
  sectionCard: {
    backgroundColor: '#171717',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#262626',
    marginBottom: 16,
  },
  sectionTag: {
    ...TYPOGRAPHY.caption,
    color: COLORS.ROUTINE_RED,
    letterSpacing: 2,
    fontWeight: '700',
    fontSize: 10,
    marginBottom: 4,
  },
  sectionTitle: {
    ...TYPOGRAPHY.body,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 4,
  },
  sectionDesc: {
    ...TYPOGRAPHY.caption,
    color: COLORS.TEXT_MUTED,
    marginBottom: 14,
    lineHeight: 18,
  },
  archetypeGrid: {
    gap: 10,
  },
  archetypeCard: {
    backgroundColor: '#1C1C1C',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#2C2C2C',
  },
  archetypeCardSelected: {
    borderColor: '#FFB800',
    backgroundColor: 'rgba(255, 184, 0, 0.08)',
  },
  archHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  archIcon: {
    fontSize: 18,
  },
  archName: {
    ...TYPOGRAPHY.body,
    fontWeight: '700',
    color: '#FFF',
    fontSize: 14,
  },
  archTagline: {
    ...TYPOGRAPHY.caption,
    color: '#FFB800',
    fontWeight: '600',
    fontSize: 11,
    marginBottom: 4,
  },
  archDesc: {
    ...TYPOGRAPHY.caption,
    color: COLORS.TEXT_MUTED,
    fontSize: 11,
    lineHeight: 15,
  },
  optionRow: {
    marginBottom: 14,
  },
  optionLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.TEXT_MUTED,
    marginBottom: 8,
    fontWeight: '600',
  },
  timeChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  missionChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#202020',
    borderWidth: 1,
    borderColor: '#303030',
  },
  chipSelected: {
    backgroundColor: 'rgba(255, 184, 0, 0.15)',
    borderColor: '#FFB800',
  },
  chipText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.TEXT_MUTED,
    fontWeight: '600',
  },
  chipTextSelected: {
    color: '#FFB800',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#222',
  },
  switchTitle: {
    ...TYPOGRAPHY.body,
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  switchSub: {
    ...TYPOGRAPHY.caption,
    color: COLORS.TEXT_MUTED,
    fontSize: 11,
    marginTop: 2,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#202020',
    backgroundColor: '#121212',
  },
  saveBtn: {
    backgroundColor: '#FFB800',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  saveBtnText: {
    color: '#000',
    fontWeight: '800',
    fontSize: 15,
    letterSpacing: 1,
  },
});
