import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Switch,
  TextInput,
} from 'react-native';
import { COLORS } from '../../theme/colors';
import { TYPOGRAPHY } from '../../theme/typography';
import {
  routineService,
  ARCHETYPES,
  DincharyaArchetype,
  RoutineTimelineItem,
} from '../../services/routineService';
import { HapticService } from '../../services/haptics';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSaved: () => void;
  onRerunOnboarding?: () => void;
}

export const CustomizeRoutineModal = ({
  visible,
  onClose,
  onSaved,
  onRerunOnboarding,
}: Props) => {
  const [selectedArchetype, setSelectedArchetype] = useState<DincharyaArchetype>('builder');
  const [alarmHour, setAlarmHour] = useState(5);
  const [alarmMin, setAlarmMin] = useState(30);
  const [alarmMission, setAlarmMission] = useState<'walk' | 'shake' | 'photo'>('walk');

  const [sleepHour, setSleepHour] = useState(22);
  const [sleepMin, setSleepMin] = useState(0);

  const [focusStartHour, setFocusStartHour] = useState(9);
  const [focusEndHour, setFocusEndHour] = useState(13);

  const [enableDawnBreath, setEnableDawnBreath] = useState(true);
  const [enableMiddayStop, setEnableMiddayStop] = useState(true);
  const [enableNotifications, setEnableNotifications] = useState(true);

  // Custom Items State
  const [customItems, setCustomItems] = useState<RoutineTimelineItem[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [newTag, setNewTag] = useState('DEEP WORK');
  const [newStartHour, setNewStartHour] = useState(15);
  const [newStartMin, setNewStartMin] = useState(0);
  const [newEndHour, setNewEndHour] = useState(16);
  const [newEndMin, setNewEndMin] = useState(0);

  useEffect(() => {
    if (visible) {
      loadState();
    }
  }, [visible]);

  const loadState = async () => {
    const arch = await routineService.getArchetype();
    setSelectedArchetype(arch);

    const items = await routineService.getRoutine();
    const alarm = items.find((i) => i.id === 'wake_alarm');
    if (alarm) {
      setAlarmHour(alarm.hour);
      setAlarmMin(alarm.minute);
      if (alarm.missionType) setAlarmMission(alarm.missionType);
    }

    const sleep = items.find((i) => i.id === 'sleep_sanctum');
    if (sleep) {
      setSleepHour(sleep.hour);
      setSleepMin(sleep.minute);
    }

    const focus = items.find((i) => i.id === 'protection_window');
    if (focus) {
      setFocusStartHour(focus.hour);
      setFocusEndHour(focus.endHour || 13);
    }

    const dawn = items.find((i) => i.id === 'dawn_breath');
    if (dawn) setEnableDawnBreath(dawn.enabled);

    const stop = items.find((i) => i.id === 'midday_stop');
    if (stop) setEnableMiddayStop(stop.enabled);

    setCustomItems(items.filter((i) => i.isCustom));
  };

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
    const sleep = updated.find((i) => i.id === 'sleep_sanctum');
    if (sleep) {
      setSleepHour(sleep.hour);
      setSleepMin(sleep.minute);
    }
    const focus = updated.find((i) => i.id === 'protection_window');
    if (focus) {
      setFocusStartHour(focus.hour);
      setFocusEndHour(focus.endHour || 13);
    }
    setCustomItems(updated.filter((i) => i.isCustom));
  };

  const handleAddCustomBlock = async () => {
    if (!newTitle.trim()) return;
    HapticService.mediumImpact();

    const created = await routineService.addCustomItem({
      title: newTitle.trim(),
      subtitle: newSubtitle.trim() || 'Personalized Routine Anchor',
      tag: newTag.toUpperCase(),
      hour: newStartHour,
      minute: newStartMin,
      endHour: newEndHour,
      endMinute: newEndMin,
      notificationEnabled: true,
    });

    setCustomItems((prev) => [...prev, created]);
    setNewTitle('');
    setNewSubtitle('');
    setShowAddForm(false);
  };

  const handleDeleteCustomBlock = async (id: string) => {
    HapticService.lightImpact();
    await routineService.deleteItem(id);
    setCustomItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleSave = async () => {
    HapticService.heavyImpact();
    await routineService.updateAlarm(alarmHour, alarmMin, alarmMission);
    await routineService.updateSleepSanctum(sleepHour, sleepMin);
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

            {/* 3. Sleep Sanctum Tuning */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTag}>CORE ANCHOR • RESTORATION</Text>
              <Text style={styles.sectionTitle}>Sleep Sanctum Time</Text>

              <View style={styles.optionRow}>
                <Text style={styles.optionLabel}>Digital Blackout</Text>
                <View style={styles.timeChips}>
                  {[
                    { h: 21, m: 30, label: '09:30 PM' },
                    { h: 22, m: 0, label: '10:00 PM' },
                    { h: 22, m: 30, label: '10:30 PM' },
                    { h: 23, m: 0, label: '11:00 PM' },
                    { h: 23, m: 30, label: '11:30 PM' },
                  ].map((t) => {
                    const isSelected = sleepHour === t.h && sleepMin === t.m;
                    return (
                      <TouchableOpacity
                        key={t.label}
                        style={[styles.chip, isSelected && styles.chipSelected]}
                        onPress={() => {
                          setSleepHour(t.h);
                          setSleepMin(t.m);
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
            </View>

            {/* 4. Protection Window Tuning */}
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

            {/* 5. Personalized Routine Blocks (Customizable Day Planning) */}
            <View style={styles.sectionCard}>
              <View style={styles.customHeaderRow}>
                <View>
                  <Text style={[styles.sectionTag, { color: '#39D98A' }]}>INDIVIDUAL DAY PLANNING</Text>
                  <Text style={styles.sectionTitle}>Custom Routine Blocks</Text>
                </View>
                <TouchableOpacity
                  style={styles.addBlockTriggerBtn}
                  onPress={() => setShowAddForm(!showAddForm)}
                >
                  <Text style={styles.addBlockTriggerText}>{showAddForm ? 'Close' : '+ Add Block'}</Text>
                </TouchableOpacity>
              </View>

              {/* Add Custom Form */}
              {showAddForm && (
                <View style={styles.addFormBox}>
                  <Text style={styles.formLabel}>BLOCK TITLE</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="e.g. Gym & Iron, Reading, Project Deep Dive"
                    placeholderTextColor="#666"
                    value={newTitle}
                    onChangeText={setNewTitle}
                  />

                  <Text style={styles.formLabel}>CATEGORY TAG</Text>
                  <View style={styles.tagChips}>
                    {['FITNESS', 'DEEP WORK', 'STUDY', 'NUTRITION', 'PRESENCE', 'RECOVERY'].map((t) => {
                      const isSel = newTag === t;
                      return (
                        <TouchableOpacity
                          key={t}
                          style={[styles.tagChip, isSel && styles.tagChipSel]}
                          onPress={() => setNewTag(t)}
                        >
                          <Text style={[styles.tagChipText, isSel && styles.tagChipTextSel]}>{t}</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>

                  <Text style={styles.formLabel}>
                    TIME: {routineService.formatTimeDisplay(newStartHour, newStartMin, newEndHour, newEndMin)}
                  </Text>
                  <View style={styles.timeButtonsRow}>
                    <TouchableOpacity
                      style={styles.timeAdjBtn}
                      onPress={() => {
                        let m = newStartHour * 60 + newStartMin + 30;
                        if (m >= 24 * 60) m = 0;
                        setNewStartHour(Math.floor(m / 60));
                        setNewStartMin(m % 60);
                      }}
                    >
                      <Text style={styles.timeAdjBtnText}>Start +30m</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.timeAdjBtn}
                      onPress={() => {
                        let m = newEndHour * 60 + newEndMin + 30;
                        if (m >= 24 * 60) m = 0;
                        setNewEndHour(Math.floor(m / 60));
                        setNewEndMin(m % 60);
                      }}
                    >
                      <Text style={styles.timeAdjBtnText}>End +30m</Text>
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity style={styles.confirmAddBtn} onPress={handleAddCustomBlock}>
                    <Text style={styles.confirmAddBtnText}>INSERT INTO ROUTINE →</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* List of Custom Items */}
              {customItems.length === 0 ? (
                <Text style={styles.noCustomText}>
                  No custom blocks added yet. Tap "+ Add Block" to tailor your full day.
                </Text>
              ) : (
                <View style={styles.customList}>
                  {customItems.map((item) => (
                    <View key={item.id} style={styles.customItemCard}>
                      <View style={{ flex: 1 }}>
                        <View style={styles.customItemTop}>
                          <Text style={styles.customItemTitle}>{item.title}</Text>
                          <Text style={styles.customItemTime}>{item.timeDisplay}</Text>
                        </View>
                        <Text style={styles.customItemSub}>{item.subtitle}</Text>
                        <Text style={styles.customItemTag}>{item.tag}</Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => handleDeleteCustomBlock(item.id)}
                        style={styles.deleteBtn}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      >
                        <Text style={styles.deleteBtnText}>🗑️</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
            </View>

            {/* 6. Hybrid Monk Injections */}
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

            {/* 7. Notifications */}
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

            {/* 8. Relaunch Full Onboarding Wizard */}
            {onRerunOnboarding && (
              <TouchableOpacity
                style={styles.rerunOnboardingBtn}
                onPress={() => {
                  HapticService.lightImpact();
                  onClose();
                  onRerunOnboarding();
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.rerunOnboardingText}>🔄 Rerun Full 4-Step Onboarding Wizard</Text>
              </TouchableOpacity>
            )}
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
    backgroundColor: '#101210',
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
    fontWeight: '700',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  sectionCard: {
    backgroundColor: '#151715',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#242A24',
    marginBottom: 16,
  },
  sectionTag: {
    ...TYPOGRAPHY.caption,
    color: COLORS.PRIMARY,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  sectionTitle: {
    ...TYPOGRAPHY.body,
    fontSize: 15,
    fontWeight: '700',
    color: '#FFF',
    marginTop: 4,
    marginBottom: 4,
  },
  sectionDesc: {
    ...TYPOGRAPHY.caption,
    color: COLORS.TEXT_MUTED,
    fontSize: 11,
    lineHeight: 16,
    marginBottom: 12,
  },
  archetypeGrid: {
    gap: 8,
  },
  archetypeCard: {
    backgroundColor: '#111311',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#222822',
  },
  archetypeCardSelected: {
    backgroundColor: '#171B16',
    borderColor: '#FFB800',
  },
  archHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  archIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  archName: {
    ...TYPOGRAPHY.body,
    fontSize: 13,
    fontWeight: '700',
    color: '#D8DCD2',
  },
  archTagline: {
    ...TYPOGRAPHY.caption,
    fontSize: 10,
    color: '#8E958A',
    marginBottom: 2,
  },
  archDesc: {
    ...TYPOGRAPHY.caption,
    fontSize: 9,
    color: '#656D60',
    lineHeight: 13,
  },
  optionRow: {
    marginTop: 12,
  },
  optionLabel: {
    ...TYPOGRAPHY.caption,
    color: '#9CA395',
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 8,
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
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#101210',
    borderWidth: 1,
    borderColor: '#262C26',
  },
  chipSelected: {
    backgroundColor: '#FFB800',
    borderColor: '#FFB800',
  },
  chipText: {
    ...TYPOGRAPHY.caption,
    color: '#8E958A',
    fontSize: 11,
    fontWeight: '600',
  },
  chipTextSelected: {
    color: '#070807',
    fontWeight: '800',
  },
  customHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  addBlockTriggerBtn: {
    backgroundColor: '#1E251E',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#39D98A',
  },
  addBlockTriggerText: {
    ...TYPOGRAPHY.caption,
    fontSize: 10,
    fontWeight: '800',
    color: '#39D98A',
  },
  addFormBox: {
    backgroundColor: '#121512',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#293329',
    marginBottom: 12,
  },
  formLabel: {
    ...TYPOGRAPHY.caption,
    fontSize: 9,
    fontWeight: '800',
    color: '#8E958A',
    letterSpacing: 1,
    marginBottom: 4,
    marginTop: 6,
  },
  formInput: {
    backgroundColor: '#181C18',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: '#FFF',
    fontSize: 12,
    borderWidth: 1,
    borderColor: '#283228',
  },
  tagChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tagChip: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    backgroundColor: '#161916',
    borderWidth: 1,
    borderColor: '#283028',
  },
  tagChipSel: {
    backgroundColor: '#FFB800',
    borderColor: '#FFB800',
  },
  tagChipText: {
    ...TYPOGRAPHY.caption,
    fontSize: 9,
    color: '#8E958A',
    fontWeight: '700',
  },
  tagChipTextSel: {
    color: '#070807',
  },
  timeButtonsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 6,
  },
  timeAdjBtn: {
    backgroundColor: '#1A201A',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#2E382E',
  },
  timeAdjBtnText: {
    ...TYPOGRAPHY.caption,
    fontSize: 10,
    fontWeight: '700',
    color: '#D8DCD2',
  },
  confirmAddBtn: {
    backgroundColor: '#39D98A',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 12,
  },
  confirmAddBtnText: {
    ...TYPOGRAPHY.caption,
    color: '#070807',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  noCustomText: {
    ...TYPOGRAPHY.caption,
    color: '#656D60',
    fontSize: 11,
    fontStyle: 'italic',
    paddingVertical: 4,
  },
  customList: {
    gap: 8,
  },
  customItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111411',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#222822',
  },
  customItemTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  customItemTitle: {
    ...TYPOGRAPHY.body,
    fontSize: 12,
    fontWeight: '700',
    color: '#FFF',
  },
  customItemTime: {
    ...TYPOGRAPHY.caption,
    fontSize: 10,
    fontWeight: '700',
    color: '#FFB800',
  },
  customItemSub: {
    ...TYPOGRAPHY.caption,
    fontSize: 10,
    color: '#8E958A',
    marginTop: 1,
  },
  customItemTag: {
    ...TYPOGRAPHY.caption,
    fontSize: 9,
    color: '#39D98A',
    fontWeight: '700',
    marginTop: 2,
  },
  deleteBtn: {
    padding: 6,
    marginLeft: 8,
  },
  deleteBtnText: {
    fontSize: 14,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#1E241E',
  },
  switchTitle: {
    ...TYPOGRAPHY.body,
    fontSize: 13,
    fontWeight: '600',
    color: '#EDEDED',
  },
  switchSub: {
    ...TYPOGRAPHY.caption,
    color: COLORS.TEXT_MUTED,
    fontSize: 10,
    marginTop: 2,
  },
  rerunOnboardingBtn: {
    backgroundColor: '#151915',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2A342A',
    marginBottom: 16,
  },
  rerunOnboardingText: {
    ...TYPOGRAPHY.caption,
    color: '#FFB800',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#202020',
    backgroundColor: '#101210',
  },
  saveBtn: {
    backgroundColor: '#FFB800',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnText: {
    ...TYPOGRAPHY.caption,
    color: '#070807',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
});
