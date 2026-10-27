import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TextInput,
  Modal,
  Switch,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../../theme/colors';
import { TYPOGRAPHY } from '../../theme/typography';
import { HapticService } from '../../services/haptics';
import {
  routineService,
  DincharyaArchetype,
  ARCHETYPES,
  RoutineTimelineItem,
} from '../../services/routineService';
import { notificationService } from '../../services/notificationService';
import { motionSensorService } from '../../services/motionSensor';
import { syncOutbox } from '../../services/syncOutbox';
import { isSupabaseConfigured, supabase } from '../../services/supabase';

export const ONBOARDING_DONE_KEY = '@hybrid_monk_onboarded_v1';

interface Props {
  onComplete: () => void;
  initialStep?: 1 | 2 | 3 | 4;
}

export const hasCompletedOnboarding = async (): Promise<boolean> => {
  try {
    const val = await AsyncStorage.getItem(ONBOARDING_DONE_KEY);
    return val === 'true';
  } catch {
    return false;
  }
};

export const resetOnboarding = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(ONBOARDING_DONE_KEY);
  } catch {
    // Ignore
  }
};

interface PopularRoutinePreset {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  hour: number;
  minute: number;
  endHour: number;
  endMinute: number;
  icon: string;
}

const POPULAR_PRESETS: PopularRoutinePreset[] = [
  {
    id: 'preset_gym',
    title: 'Physical Workout & Mobility',
    subtitle: 'Strength & Cardio • High-End Dopamine Calibration',
    tag: 'FITNESS',
    hour: 7,
    minute: 0,
    endHour: 8,
    endMinute: 0,
    icon: '🏋️',
  },
  {
    id: 'preset_lunch',
    title: 'Mindful Nutrition & Sunlight',
    subtitle: 'Nourishment Threshold • Screen-Free Eating & Sunlight',
    tag: 'NUTRITION',
    hour: 12,
    minute: 30,
    endHour: 13,
    endMinute: 15,
    icon: '🥗',
  },
  {
    id: 'preset_walk',
    title: 'Midday Sunlight Walk',
    subtitle: 'Optical Flow & Circadian Reset • Drop Mental Fatigue',
    tag: 'MOVEMENT',
    hour: 14,
    minute: 0,
    endHour: 14,
    endMinute: 30,
    icon: '🚶',
  },
  {
    id: 'preset_reading',
    title: 'Evening Deep Reading & Synthesis',
    subtitle: 'Analog Wisdom • Cognitive Deep Dive Before Bed',
    tag: 'STUDY',
    hour: 20,
    minute: 30,
    endHour: 21,
    endMinute: 15,
    icon: '📖',
  },
  {
    id: 'preset_family',
    title: 'Family Presence Blackout',
    subtitle: 'Zero Device Rule • Unconditional Connection & Conversation',
    tag: 'PRESENCE',
    hour: 19,
    minute: 0,
    endHour: 20,
    endMinute: 0,
    icon: '🏡',
  },
];

export const OnboardingScreen: React.FC<Props> = ({ onComplete, initialStep = 1 }) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(initialStep);
  const [selectedArch, setSelectedArch] = useState<DincharyaArchetype>('builder');

  // Circadian State (Step 2)
  const [wakeHour, setWakeHour] = useState(5);
  const [wakeMin, setWakeMin] = useState(30);
  const [wakeMission, setWakeMission] = useState<'walk' | 'shake' | 'photo'>('walk');
  const [sleepHour, setSleepHour] = useState(22);
  const [sleepMin, setSleepMin] = useState(0);

  // Day Planning State (Step 3)
  const [customItems, setCustomItems] = useState<RoutineTimelineItem[]>([]);
  const [enabledItemIds, setEnabledItemIds] = useState<string[]>([
    'wake_alarm',
    'dawn_breath',
    'protection_window',
    'midday_stop',
    'evening_transition',
    'sleep_sanctum',
  ]);

  // Custom Item Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [customSubtitle, setCustomSubtitle] = useState('');
  const [customTag, setCustomTag] = useState('DEEP WORK');
  const [customHour, setCustomHour] = useState(15);
  const [customMin, setCustomMin] = useState(0);
  const [customEndHour, setCustomEndHour] = useState(16);
  const [customEndMin, setCustomEndMin] = useState(0);

  // Permissions State (Step 4)
  const [notifPermissionGranted, setNotifPermissionGranted] = useState<boolean>(false);
  const [motionPermissionGranted, setMotionPermissionGranted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check initial permissions on mount
  useEffect(() => {
    notificationService.checkPermissions().then((granted) => {
      setNotifPermissionGranted(granted);
    });
    const motionAvailable = motionSensorService.isSensorAvailable();
    setMotionPermissionGranted(motionAvailable);
  }, []);

  // Update circadian defaults when archetype changes
  const handleSelectArchetype = (arch: DincharyaArchetype) => {
    HapticService.selection();
    setSelectedArch(arch);

    if (arch === 'builder') {
      setWakeHour(5);
      setWakeMin(30);
      setSleepHour(22);
      setSleepMin(0);
      setWakeMission('walk');
    } else if (arch === 'student') {
      setWakeHour(6);
      setWakeMin(0);
      setSleepHour(22);
      setSleepMin(30);
      setWakeMission('shake');
    } else if (arch === 'parent') {
      setWakeHour(5);
      setWakeMin(45);
      setSleepHour(22);
      setSleepMin(0);
      setWakeMission('walk');
    } else {
      setWakeHour(6);
      setWakeMin(30);
      setSleepHour(23);
      setSleepMin(0);
      setWakeMission('walk');
    }
  };

  // Stepper adjustments for wake and sleep times
  const adjustWakeTime = (deltaMinutes: number) => {
    HapticService.lightImpact();
    let totalMins = wakeHour * 60 + wakeMin + deltaMinutes;
    if (totalMins < 0) totalMins += 24 * 60;
    totalMins = totalMins % (24 * 60);
    setWakeHour(Math.floor(totalMins / 60));
    setWakeMin(totalMins % 60);
  };

  const adjustSleepTime = (deltaMinutes: number) => {
    HapticService.lightImpact();
    let totalMins = sleepHour * 60 + sleepMin + deltaMinutes;
    if (totalMins < 0) totalMins += 24 * 60;
    totalMins = totalMins % (24 * 60);
    setSleepHour(Math.floor(totalMins / 60));
    setSleepMin(totalMins % 60);
  };

  // Calculate sleep window duration
  const calculateSleepDuration = (): { hours: number; minutes: number } => {
    const sleepTotalMins = sleepHour * 60 + sleepMin;
    let wakeTotalMins = wakeHour * 60 + wakeMin;
    if (wakeTotalMins <= sleepTotalMins) {
      wakeTotalMins += 24 * 60;
    }
    const diff = wakeTotalMins - sleepTotalMins;
    return {
      hours: Math.floor(diff / 60),
      minutes: diff % 60,
    };
  };

  // Toggle item in Step 3
  const handleToggleItem = (id: string) => {
    HapticService.selection();
    setEnabledItemIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Quick add popular preset
  const handleAddPreset = (preset: PopularRoutinePreset) => {
    HapticService.mediumImpact();
    const id = `custom_${Date.now()}_${preset.id}`;
    const timeDisplay = routineService.formatTimeDisplay(
      preset.hour,
      preset.minute,
      preset.endHour,
      preset.endMinute
    );

    const newItem: RoutineTimelineItem = {
      id,
      type: 'custom',
      title: preset.title,
      subtitle: preset.subtitle,
      tag: preset.tag,
      timeDisplay,
      hour: preset.hour,
      minute: preset.minute,
      endHour: preset.endHour,
      endMinute: preset.endMinute,
      enabled: true,
      notificationEnabled: true,
      isCustom: true,
      notificationTitle: `⏱️ ${preset.title.toUpperCase()}`,
      notificationBody: `Time for ${preset.title}. Stay centered in your sovereign rhythm.`,
    };

    setCustomItems((prev) => [...prev, newItem]);
    setEnabledItemIds((prev) => [...prev, id]);
  };

  // Add custom routine item from modal form
  const handleSaveCustomItem = () => {
    if (!customTitle.trim()) return;
    HapticService.mediumImpact();

    const id = `custom_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const timeDisplay = routineService.formatTimeDisplay(
      customHour,
      customMin,
      customEndHour,
      customEndMin
    );

    const newItem: RoutineTimelineItem = {
      id,
      type: 'custom',
      title: customTitle.trim(),
      subtitle: customSubtitle.trim() || 'Custom Sovereign Routine Anchor',
      tag: customTag.toUpperCase(),
      timeDisplay,
      hour: customHour,
      minute: customMin,
      endHour: customEndHour,
      endMinute: customEndMin,
      enabled: true,
      notificationEnabled: true,
      isCustom: true,
      notificationTitle: `⏱️ ${customTitle.trim().toUpperCase()}`,
      notificationBody: `Time for ${customTitle.trim()}. Stay anchored in presence.`,
    };

    setCustomItems((prev) => [...prev, newItem]);
    setEnabledItemIds((prev) => [...prev, id]);
    setIsAddModalOpen(false);
    setCustomTitle('');
    setCustomSubtitle('');
  };

  // Remove a custom routine item
  const handleRemoveCustomItem = (id: string) => {
    HapticService.lightImpact();
    setCustomItems((prev) => prev.filter((it) => it.id !== id));
    setEnabledItemIds((prev) => prev.filter((itId) => itId !== id));
  };

  // Request notifications permission in Step 4
  const handleRequestNotifications = async () => {
    HapticService.heavyImpact();
    const granted = await notificationService.requestPermissions();
    setNotifPermissionGranted(granted);
    if (granted) {
      HapticService.successNotification();
    }
  };

  // Request motion sensor permission in Step 4
  const handleRequestMotion = async () => {
    HapticService.heavyImpact();
    const result = await motionSensorService.checkAndRequestPermissions();
    setMotionPermissionGranted(result.granted || result.available);
    if (result.granted || result.available) {
      HapticService.successNotification();
    }
  };

  // Lock in routine and complete onboarding
  const handleLockIn = async () => {
    setIsLoading(true);
    HapticService.heavyImpact();

    try {
      // 1. Calibrate and save routine with custom items, wake time, sleep time, and archetype
      await routineService.saveCalibratedRoutine({
        archetype: selectedArch,
        wakeHour,
        wakeMinute: wakeMin,
        wakeMission,
        sleepHour,
        sleepMinute: sleepMin,
        customItems,
        enabledItemIds,
      });

      // 2. Mark onboarding completed in AsyncStorage
      await AsyncStorage.setItem(ONBOARDING_DONE_KEY, 'true');

      // 3. Queue profile setup to Supabase outbox if user exists
      if (isSupabaseConfigured) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await syncOutbox.enqueue('profiles', {
            id: user.id,
            monk_title: selectedArch.toUpperCase(),
            updated_at: new Date().toISOString(),
          });
        }
      }
    } catch (e) {
      console.warn('[Onboarding] Error applying calibrated routine:', e);
    } finally {
      setIsLoading(false);
      onComplete();
    }
  };

  const sleepDuration = calculateSleepDuration();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#070807" />

      {/* Progress Bar & Header */}
      <View style={styles.progressContainer}>
        <View style={styles.stepIndicators}>
          {[1, 2, 3, 4].map((stepNum) => {
            const isCompleted = stepNum < currentStep;
            const isCurrent = stepNum === currentStep;
            return (
              <View
                key={stepNum}
                style={[
                  styles.stepSegment,
                  isCompleted && styles.stepSegmentCompleted,
                  isCurrent && styles.stepSegmentCurrent,
                ]}
              />
            );
          })}
        </View>
        <Text style={styles.stepLabel}>
          STEP {currentStep} OF 4 •{' '}
          {currentStep === 1
            ? 'LIFE ARCHETYPE'
            : currentStep === 2
            ? 'CIRCADIAN ANCHORS'
            : currentStep === 3
            ? 'PLAN YOUR DAY ARC'
            : 'ARM PERMISSIONS'}
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ==================== STEP 1: ARCHETYPE ==================== */}
        {currentStep === 1 && (
          <View>
            <View style={styles.header}>
              <Text style={styles.eyebrow}>THE SOVEREIGN RETURN</Text>
              <Text style={styles.title}>The world is loud.</Text>
              <Text style={styles.titleEm}>Be here.</Text>
              <Text style={styles.subtitle}>
                Ancient monks left the world behind to find themselves. We are the modern monks—living
                in the world, mastering the world, staying anchored.
              </Text>
            </View>

            <View style={styles.sectionHeaderBox}>
              <Text style={styles.sectionHeading}>SELECT YOUR DAILY ARCHETYPE</Text>
              <Text style={styles.sectionSub}>Choose your base lifestyle rhythm:</Text>
            </View>

            <View style={styles.archetypeGrid}>
              {ARCHETYPES.map((arch) => {
                const isSelected = selectedArch === arch.id;
                const defaultWakeTime =
                  arch.id === 'builder'
                    ? '05:30 AM'
                    : arch.id === 'student'
                    ? '06:00 AM'
                    : arch.id === 'parent'
                    ? '05:45 AM'
                    : '06:30 AM';

                return (
                  <TouchableOpacity
                    key={arch.id}
                    style={[styles.archCard, isSelected && styles.archCardSelected]}
                    onPress={() => handleSelectArchetype(arch.id)}
                    activeOpacity={0.85}
                  >
                    <View style={styles.archIconContainer}>
                      <Text style={styles.archIcon}>{arch.icon}</Text>
                    </View>
                    <View style={styles.archContent}>
                      <View style={styles.archTopRow}>
                        <Text style={[styles.archName, isSelected && styles.archNameSelected]}>
                          {arch.name}
                        </Text>
                        <Text style={[styles.archTime, isSelected && styles.archTimeSelected]}>
                          {defaultWakeTime}
                        </Text>
                      </View>
                      <Text style={styles.archTagline}>{arch.tagline}</Text>
                      <Text style={styles.archDescription} numberOfLines={2}>
                        {arch.description}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* ==================== STEP 2: CIRCADIAN CALIBRATION ==================== */}
        {currentStep === 2 && (
          <View>
            <View style={styles.header}>
              <Text style={styles.eyebrow}>CIRCADIAN CALIBRATION</Text>
              <Text style={styles.title}>Wake & Sleep Rhythm</Text>
              <Text style={styles.subtitle}>
                Lock in your morning ignition and evening recovery sanctum. Your protection window and
                energy arc revolve around these anchors.
              </Text>
            </View>

            {/* Wake Time Calibration */}
            <View style={styles.cardBox}>
              <View style={styles.cardBoxHeader}>
                <Text style={styles.cardBoxTag}>CORE ANCHOR 01 • MORNING IGNITION</Text>
                <Text style={styles.cardBoxTitle}>Wake Alarm Time</Text>
              </View>

              <View style={styles.clockDisplayRow}>
                <TouchableOpacity
                  style={styles.stepperBtn}
                  onPress={() => adjustWakeTime(-15)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.stepperBtnText}>- 15m</Text>
                </TouchableOpacity>

                <View style={styles.clockFace}>
                  <Text style={styles.clockTime}>
                    {routineService.formatTimeDisplay(wakeHour, wakeMin)}
                  </Text>
                  <Text style={styles.clockSub}>IMPOSSIBLE TO SNOOZE</Text>
                </View>

                <TouchableOpacity
                  style={styles.stepperBtn}
                  onPress={() => adjustWakeTime(15)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.stepperBtnText}>+ 15m</Text>
                </TouchableOpacity>
              </View>

              {/* Wake Time Quick Presets */}
              <View style={styles.presetChipsRow}>
                {[
                  { h: 5, m: 0, label: '05:00 AM' },
                  { h: 5, m: 30, label: '05:30 AM' },
                  { h: 5, m: 45, label: '05:45 AM' },
                  { h: 6, m: 0, label: '06:00 AM' },
                  { h: 6, m: 30, label: '06:30 AM' },
                ].map((preset) => {
                  const isSel = wakeHour === preset.h && wakeMin === preset.m;
                  return (
                    <TouchableOpacity
                      key={preset.label}
                      style={[styles.chip, isSel && styles.chipSelected]}
                      onPress={() => {
                        HapticService.selection();
                        setWakeHour(preset.h);
                        setWakeMin(preset.m);
                      }}
                    >
                      <Text style={[styles.chipText, isSel && styles.chipTextSelected]}>
                        {preset.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Wake Verification Mission Selector */}
              <View style={styles.missionContainer}>
                <Text style={styles.missionLabel}>WAKE VERIFICATION MISSION</Text>
                <View style={styles.missionChipsRow}>
                  {[
                    { type: 'walk', label: '🚶 20-Step Walk (CoreMotion)' },
                    { type: 'shake', label: '📳 25 Shakes' },
                    { type: 'photo', label: '📸 Bathroom Sink Photo' },
                  ].map((m) => {
                    const isSel = wakeMission === m.type;
                    return (
                      <TouchableOpacity
                        key={m.type}
                        style={[styles.missionChip, isSel && styles.missionChipSelected]}
                        onPress={() => {
                          HapticService.selection();
                          setWakeMission(m.type as any);
                        }}
                      >
                        <Text style={[styles.missionChipText, isSel && styles.missionChipTextSelected]}>
                          {m.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </View>

            {/* Sleep Sanctum Calibration */}
            <View style={styles.cardBox}>
              <View style={styles.cardBoxHeader}>
                <Text style={styles.cardBoxTag}>CORE ANCHOR 02 • RESTORATION</Text>
                <Text style={styles.cardBoxTitle}>Sleep Sanctum Time</Text>
              </View>

              <View style={styles.clockDisplayRow}>
                <TouchableOpacity
                  style={styles.stepperBtn}
                  onPress={() => adjustSleepTime(-15)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.stepperBtnText}>- 15m</Text>
                </TouchableOpacity>

                <View style={styles.clockFace}>
                  <Text style={styles.clockTime}>
                    {routineService.formatTimeDisplay(sleepHour, sleepMin)}
                  </Text>
                  <Text style={styles.clockSub}>DIGITAL BLACKOUT</Text>
                </View>

                <TouchableOpacity
                  style={styles.stepperBtn}
                  onPress={() => adjustSleepTime(15)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.stepperBtnText}>+ 15m</Text>
                </TouchableOpacity>
              </View>

              {/* Sleep Quick Presets */}
              <View style={styles.presetChipsRow}>
                {[
                  { h: 21, m: 30, label: '09:30 PM' },
                  { h: 22, m: 0, label: '10:00 PM' },
                  { h: 22, m: 30, label: '10:30 PM' },
                  { h: 23, m: 0, label: '11:00 PM' },
                  { h: 23, m: 30, label: '11:30 PM' },
                ].map((preset) => {
                  const isSel = sleepHour === preset.h && sleepMin === preset.m;
                  return (
                    <TouchableOpacity
                      key={preset.label}
                      style={[styles.chip, isSel && styles.chipSelected]}
                      onPress={() => {
                        HapticService.selection();
                        setSleepHour(preset.h);
                        setSleepMin(preset.m);
                      }}
                    >
                      <Text style={[styles.chipText, isSel && styles.chipTextSelected]}>
                        {preset.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Sleep Window Readout Banner */}
            <View style={styles.readoutCard}>
              <Text style={styles.readoutIcon}>🌙</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.readoutTitle}>
                  Restoration Window: {sleepDuration.hours}h {sleepDuration.minutes > 0 ? `${sleepDuration.minutes}m` : ''}
                </Text>
                <Text style={styles.readoutDesc}>
                  Provides optimal NREM slow-wave and REM brain restoration between digital blackout and
                  morning ignition.
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* ==================== STEP 3: DAY ARC PLANNING & CUSTOM ITEMS ==================== */}
        {currentStep === 3 && (
          <View>
            <View style={styles.header}>
              <Text style={styles.eyebrow}>INDIVIDUAL CUSTOMIZATION</Text>
              <Text style={styles.title}>Plan Your Whole Day</Text>
              <Text style={styles.subtitle}>
                Include additional routine items to tailor the timeline to your career, fitness, and
                personal life rhythm.
              </Text>
            </View>

            {/* Quick Add Popular Blocks */}
            <View style={styles.popularSection}>
              <Text style={styles.sectionHeading}>QUICK-ADD POPULAR ROUTINES</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.popularList}>
                {POPULAR_PRESETS.map((preset) => {
                  const isAlreadyAdded = customItems.some((ci) => ci.title === preset.title);
                  return (
                    <TouchableOpacity
                      key={preset.id}
                      style={[styles.popularCard, isAlreadyAdded && styles.popularCardAdded]}
                      onPress={() => !isAlreadyAdded && handleAddPreset(preset)}
                      activeOpacity={0.8}
                      disabled={isAlreadyAdded}
                    >
                      <Text style={styles.popularIcon}>{preset.icon}</Text>
                      <Text style={styles.popularTitle} numberOfLines={1}>
                        {preset.title}
                      </Text>
                      <Text style={styles.popularTime}>
                        {routineService.formatTimeDisplay(
                          preset.hour,
                          preset.minute,
                          preset.endHour,
                          preset.endMinute
                        )}
                      </Text>
                      <Text style={[styles.popularAction, isAlreadyAdded && { color: '#39D98A' }]}>
                        {isAlreadyAdded ? 'Added ✓' : '+ Add to Day'}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {/* Add Custom Routine Block CTA */}
            <TouchableOpacity
              style={styles.addCustomBtn}
              onPress={() => {
                HapticService.selection();
                setIsAddModalOpen(true);
              }}
              activeOpacity={0.85}
            >
              <Text style={styles.addCustomBtnText}>+ Add Custom Routine Block</Text>
            </TouchableOpacity>

            {/* Day Arc Timeline Preview */}
            <View style={styles.timelinePreviewSection}>
              <Text style={styles.sectionHeading}>YOUR DAY TIMELINE PREVIEW</Text>

              {/* Standard Core Items */}
              {[
                {
                  id: 'wake_alarm',
                  title: 'The Wake Alarm',
                  tag: 'CORE ANCHOR',
                  time: routineService.formatTimeDisplay(wakeHour, wakeMin),
                  icon: '🔥',
                  isLocked: true,
                },
                {
                  id: 'dawn_breath',
                  title: 'Dawn Kundalini Breath',
                  tag: 'HYBRID MONK',
                  time: routineService.formatTimeDisplay((wakeHour + 1) % 24, 0),
                  icon: '⚡',
                  isLocked: false,
                },
                {
                  id: 'protection_window',
                  title: 'Deep Work Protection Window',
                  tag: 'CORE ANCHOR',
                  time: '09:00 AM – 01:00 PM',
                  icon: '🛡️',
                  isLocked: false,
                },
                {
                  id: 'midday_stop',
                  title: 'Midday Osho STOP',
                  tag: 'HYBRID MONK',
                  time: '01:15 PM',
                  icon: '🛑',
                  isLocked: false,
                },
                {
                  id: 'evening_transition',
                  title: 'Evening Transition Threshold',
                  tag: 'DECOMPRESSION',
                  time: '06:30 PM',
                  icon: '🌙',
                  isLocked: false,
                },
                {
                  id: 'sleep_sanctum',
                  title: 'Sleep Sanctum',
                  tag: 'RECOVERY',
                  time: routineService.formatTimeDisplay(sleepHour, sleepMin),
                  icon: '🌑',
                  isLocked: true,
                },
              ].map((item) => {
                const isEnabled = enabledItemIds.includes(item.id);
                return (
                  <View key={item.id} style={styles.timelineItemRow}>
                    <Text style={styles.timelineItemIcon}>{item.icon}</Text>
                    <View style={{ flex: 1 }}>
                      <View style={styles.timelineItemTop}>
                        <Text style={styles.timelineItemTitle}>{item.title}</Text>
                        <Text style={styles.timelineItemTime}>{item.time}</Text>
                      </View>
                      <Text style={styles.timelineItemTag}>{item.tag}</Text>
                    </View>
                    {!item.isLocked && (
                      <Switch
                        value={isEnabled}
                        onValueChange={() => handleToggleItem(item.id)}
                        trackColor={{ false: '#222', true: '#FFB800' }}
                        thumbColor="#FFF"
                      />
                    )}
                  </View>
                );
              })}

              {/* Added Custom Items List */}
              {customItems.length > 0 && (
                <View style={styles.customItemsSection}>
                  <Text style={styles.customItemsHeader}>PERSONALIZED ROUTINE BLOCKS ({customItems.length})</Text>
                  {customItems.map((item) => (
                    <View key={item.id} style={styles.customItemRow}>
                      <Text style={styles.customItemIcon}>⭐</Text>
                      <View style={{ flex: 1 }}>
                        <View style={styles.timelineItemTop}>
                          <Text style={styles.customItemTitle}>{item.title}</Text>
                          <Text style={styles.timelineItemTime}>{item.timeDisplay}</Text>
                        </View>
                        <Text style={styles.customItemSub}>{item.subtitle}</Text>
                        <Text style={styles.timelineItemTag}>{item.tag}</Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => handleRemoveCustomItem(item.id)}
                        style={styles.deleteCustomBtn}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      >
                        <Text style={styles.deleteCustomText}>🗑️</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </View>
        )}

        {/* ==================== STEP 4: PERMISSIONS GATE ==================== */}
        {currentStep === 4 && (
          <View>
            <View style={styles.header}>
              <Text style={styles.eyebrow}>HARDWARE ARMING</Text>
              <Text style={styles.title}>Device Permissions</Text>
              <Text style={styles.subtitle}>
                Shaniwar enforces sovereign attention and zero-snooze mornings through native iOS and
                Android device capabilities.
              </Text>
            </View>

            {/* Permission Card 1: Notifications & Focus Shield */}
            <View style={styles.permCard}>
              <View style={styles.permHeader}>
                <View style={styles.permIconBox}>
                  <Text style={styles.permIcon}>🛡️</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.permTitle}>Focus Shield & Push Alerts</Text>
                  <Text style={styles.permSub}>
                    Required to sound daily routine alerts, enforce distraction blackout transitions, and
                    trigger the Obsidian Shield.
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={[
                  styles.permBtn,
                  notifPermissionGranted && styles.permBtnGranted,
                ]}
                onPress={handleRequestNotifications}
                activeOpacity={0.8}
                disabled={notifPermissionGranted}
              >
                <Text
                  style={[
                    styles.permBtnText,
                    notifPermissionGranted && styles.permBtnTextGranted,
                  ]}
                >
                  {notifPermissionGranted ? '✓ ALERT PERMISSION GRANTED' : 'GRANT ALERT PERMISSION'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Permission Card 2: CoreMotion Accelerometer */}
            <View style={styles.permCard}>
              <View style={styles.permHeader}>
                <View style={styles.permIconBox}>
                  <Text style={styles.permIcon}>🚶</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.permTitle}>CoreMotion & Physical Sensor</Text>
                  <Text style={styles.permSub}>
                    Verifies genuine 20-step morning walks and shake patterns. Without motion, the alarm
                    will continue sounding.
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={[
                  styles.permBtn,
                  motionPermissionGranted && styles.permBtnGranted,
                ]}
                onPress={handleRequestMotion}
                activeOpacity={0.8}
                disabled={motionPermissionGranted}
              >
                <Text
                  style={[
                    styles.permBtnText,
                    motionPermissionGranted && styles.permBtnTextGranted,
                  ]}
                >
                  {motionPermissionGranted ? '✓ MOTION SENSOR CALIBRATED' : 'CALIBRATE MOTION SENSOR'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Permission Card 3: Monastic Audio Alarm */}
            <View style={styles.permCard}>
              <View style={styles.permHeader}>
                <View style={styles.permIconBox}>
                  <Text style={styles.permIcon}>🔔</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.permTitle}>High-Priority Audio Alarm</Text>
                  <Text style={styles.permSub}>
                    Audio alert playback configured to awaken you even during Do Not Disturb or silent
                    profiles.
                  </Text>
                </View>
              </View>
              <View style={styles.permStatusPill}>
                <Text style={styles.permStatusText}>✓ HARDWARE AUDIO READY</Text>
              </View>
            </View>
          </View>
        )}

        {/* Bottom Navigation CTAs */}
        <View style={styles.bottomNavSection}>
          <View style={styles.navRow}>
            {currentStep > 1 && (
              <TouchableOpacity
                style={styles.backBtn}
                onPress={() => {
                  HapticService.selection();
                  setCurrentStep((prev) => (prev - 1) as any);
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.backBtnText}>← Back</Text>
              </TouchableOpacity>
            )}

            {currentStep < 4 ? (
              <TouchableOpacity
                style={[styles.nextBtn, currentStep === 1 && { flex: 1 }]}
                onPress={() => {
                  HapticService.selection();
                  setCurrentStep((prev) => (prev + 1) as any);
                }}
                activeOpacity={0.85}
              >
                <Text style={styles.nextBtnText}>
                  {currentStep === 1
                    ? 'CALIBRATE WAKE & SLEEP →'
                    : currentStep === 2
                    ? 'PLAN YOUR DAY ARC →'
                    : 'ARM NATIVE PERMISSIONS →'}
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.nextBtn, styles.lockInBtn]}
                onPress={handleLockIn}
                activeOpacity={0.85}
                disabled={isLoading}
              >
                <Text style={styles.lockInBtnText}>
                  {isLoading ? 'CALIBRATING ARC...' : 'LOCK IN SOVEREIGN DINCHARYA →'}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <Text style={styles.footnote}>
            100% offline-first • All choices editable anytime • No account required
          </Text>
        </View>
      </ScrollView>

      {/* Modal: Add Custom Routine Item */}
      <Modal visible={isAddModalOpen} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>ADD CUSTOM ROUTINE BLOCK</Text>
              <TouchableOpacity onPress={() => setIsAddModalOpen(false)}>
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.inputLabel}>ROUTINE NAME</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. Strength Training, Reading, Client Sprint"
                placeholderTextColor="#666"
                value={customTitle}
                onChangeText={setCustomTitle}
              />

              <Text style={styles.inputLabel}>SUBTITLE / INTENTION</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. Iron & Cardio • Zero phone scrolling"
                placeholderTextColor="#666"
                value={customSubtitle}
                onChangeText={setCustomSubtitle}
              />

              <Text style={styles.inputLabel}>CATEGORY TAG</Text>
              <View style={styles.tagChipsRow}>
                {['DEEP WORK', 'FITNESS', 'STUDY', 'NUTRITION', 'PRESENCE', 'MINDFULNESS'].map((tag) => {
                  const isSel = customTag === tag;
                  return (
                    <TouchableOpacity
                      key={tag}
                      style={[styles.tagChip, isSel && styles.tagChipSelected]}
                      onPress={() => {
                        HapticService.selection();
                        setCustomTag(tag);
                      }}
                    >
                      <Text style={[styles.tagChipText, isSel && styles.tagChipTextSelected]}>
                        {tag}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <Text style={styles.inputLabel}>START TIME</Text>
              <View style={styles.timeSelectRow}>
                <View style={styles.timeInputBox}>
                  <Text style={styles.timeValue}>
                    {routineService.formatTimeDisplay(customHour, customMin)}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.timeAdjustBtn}
                  onPress={() => {
                    HapticService.lightImpact();
                    let m = customHour * 60 + customMin + 30;
                    if (m >= 24 * 60) m = 0;
                    setCustomHour(Math.floor(m / 60));
                    setCustomMin(m % 60);
                  }}
                >
                  <Text style={styles.timeAdjustBtnText}>+ 30m</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.timeAdjustBtn}
                  onPress={() => {
                    HapticService.lightImpact();
                    let m = customHour * 60 + customMin - 30;
                    if (m < 0) m = 23 * 60 + 30;
                    setCustomHour(Math.floor(m / 60));
                    setCustomMin(m % 60);
                  }}
                >
                  <Text style={styles.timeAdjustBtnText}>- 30m</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.inputLabel}>END TIME</Text>
              <View style={styles.timeSelectRow}>
                <View style={styles.timeInputBox}>
                  <Text style={styles.timeValue}>
                    {routineService.formatTimeDisplay(customEndHour, customEndMin)}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.timeAdjustBtn}
                  onPress={() => {
                    HapticService.lightImpact();
                    let m = customEndHour * 60 + customEndMin + 30;
                    if (m >= 24 * 60) m = 0;
                    setCustomEndHour(Math.floor(m / 60));
                    setCustomEndMin(m % 60);
                  }}
                >
                  <Text style={styles.timeAdjustBtnText}>+ 30m</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.timeAdjustBtn}
                  onPress={() => {
                    HapticService.lightImpact();
                    let m = customEndHour * 60 + customEndMin - 30;
                    if (m < 0) m = 23 * 60 + 30;
                    setCustomEndHour(Math.floor(m / 60));
                    setCustomEndMin(m % 60);
                  }}
                >
                  <Text style={styles.timeAdjustBtnText}>- 30m</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.modalAddBtn}
                onPress={handleSaveCustomItem}
                activeOpacity={0.85}
              >
                <Text style={styles.modalAddBtnText}>INSERT INTO DAY ARC →</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#070807',
  },
  progressContainer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1E1A',
  },
  stepIndicators: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  stepSegment: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#1C221C',
  },
  stepSegmentCompleted: {
    backgroundColor: '#39D98A',
  },
  stepSegmentCurrent: {
    backgroundColor: '#FFB800',
  },
  stepLabel: {
    ...TYPOGRAPHY.caption,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: '#FFB800',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
  },
  eyebrow: {
    ...TYPOGRAPHY.caption,
    color: '#FFB800',
    letterSpacing: 2,
    fontSize: 10,
    fontWeight: '800',
    marginBottom: 6,
  },
  title: {
    fontSize: 30,
    fontWeight: '300',
    color: '#F4F4EC',
    lineHeight: 36,
  },
  titleEm: {
    fontSize: 30,
    fontWeight: '700',
    color: '#FFB800',
    lineHeight: 38,
    marginBottom: 8,
  },
  subtitle: {
    ...TYPOGRAPHY.body,
    fontSize: 13,
    lineHeight: 19,
    color: '#9CA395',
  },
  sectionHeaderBox: {
    marginBottom: 12,
  },
  sectionHeading: {
    ...TYPOGRAPHY.caption,
    fontSize: 10,
    fontWeight: '800',
    color: '#B49860',
    letterSpacing: 1.5,
  },
  sectionSub: {
    ...TYPOGRAPHY.caption,
    fontSize: 11,
    color: '#71796D',
    marginTop: 2,
  },
  archetypeGrid: {
    gap: 12,
  },
  archCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#101210',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#222820',
  },
  archCardSelected: {
    backgroundColor: '#161A14',
    borderColor: '#FFB800',
  },
  archIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#191E18',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  archIcon: {
    fontSize: 22,
  },
  archContent: {
    flex: 1,
  },
  archTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  archName: {
    ...TYPOGRAPHY.body,
    fontSize: 14,
    fontWeight: '700',
    color: '#D8DCD2',
  },
  archNameSelected: {
    color: '#FFF',
  },
  archTime: {
    ...TYPOGRAPHY.caption,
    fontSize: 11,
    fontWeight: '700',
    color: '#71796D',
  },
  archTimeSelected: {
    color: '#FFB800',
  },
  archTagline: {
    ...TYPOGRAPHY.caption,
    fontSize: 11,
    fontWeight: '600',
    color: '#8E958A',
    marginBottom: 4,
  },
  archDescription: {
    ...TYPOGRAPHY.caption,
    fontSize: 10,
    lineHeight: 14,
    color: '#656D60',
  },
  cardBox: {
    backgroundColor: '#101210',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#222820',
    marginBottom: 16,
  },
  cardBoxHeader: {
    marginBottom: 14,
  },
  cardBoxTag: {
    ...TYPOGRAPHY.caption,
    fontSize: 9,
    fontWeight: '800',
    color: '#FFB800',
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  cardBoxTitle: {
    ...TYPOGRAPHY.body,
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },
  clockDisplayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  stepperBtn: {
    backgroundColor: '#1A201A',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#2A332A',
  },
  stepperBtnText: {
    ...TYPOGRAPHY.caption,
    color: '#D8DCD2',
    fontWeight: '700',
    fontSize: 12,
  },
  clockFace: {
    alignItems: 'center',
  },
  clockTime: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFB800',
    letterSpacing: 1,
  },
  clockSub: {
    ...TYPOGRAPHY.caption,
    fontSize: 9,
    fontWeight: '700',
    color: '#71796D',
    letterSpacing: 1,
    marginTop: 2,
  },
  presetChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#181C18',
    borderWidth: 1,
    borderColor: '#242C24',
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
  missionContainer: {
    borderTopWidth: 1,
    borderTopColor: '#1A1E1A',
    paddingTop: 12,
  },
  missionLabel: {
    ...TYPOGRAPHY.caption,
    fontSize: 9,
    fontWeight: '800',
    color: '#8E958A',
    letterSpacing: 1,
    marginBottom: 8,
  },
  missionChipsRow: {
    gap: 8,
  },
  missionChip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: '#161916',
    borderWidth: 1,
    borderColor: '#222822',
  },
  missionChipSelected: {
    backgroundColor: '#1F251E',
    borderColor: '#39D98A',
  },
  missionChipText: {
    ...TYPOGRAPHY.caption,
    fontSize: 11,
    color: '#A0A89C',
    fontWeight: '600',
  },
  missionChipTextSelected: {
    color: '#39D98A',
    fontWeight: '700',
  },
  readoutCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#121614',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1F2822',
    marginBottom: 16,
  },
  readoutIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  readoutTitle: {
    ...TYPOGRAPHY.body,
    fontSize: 13,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 2,
  },
  readoutDesc: {
    ...TYPOGRAPHY.caption,
    fontSize: 10,
    color: '#858E80',
    lineHeight: 14,
  },
  popularSection: {
    marginBottom: 16,
  },
  popularList: {
    gap: 10,
    paddingVertical: 8,
  },
  popularCard: {
    backgroundColor: '#121612',
    borderRadius: 14,
    padding: 12,
    width: 140,
    borderWidth: 1,
    borderColor: '#222822',
  },
  popularCardAdded: {
    borderColor: '#39D98A',
    backgroundColor: '#131B15',
  },
  popularIcon: {
    fontSize: 20,
    marginBottom: 6,
  },
  popularTitle: {
    ...TYPOGRAPHY.caption,
    fontSize: 11,
    fontWeight: '700',
    color: '#E0E4DC',
    marginBottom: 2,
  },
  popularTime: {
    ...TYPOGRAPHY.caption,
    fontSize: 9,
    color: '#71796D',
    marginBottom: 8,
  },
  popularAction: {
    ...TYPOGRAPHY.caption,
    fontSize: 10,
    fontWeight: '800',
    color: '#FFB800',
  },
  addCustomBtn: {
    backgroundColor: '#181E18',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2E382E',
    borderStyle: 'dashed',
    marginBottom: 20,
  },
  addCustomBtnText: {
    ...TYPOGRAPHY.caption,
    color: '#FFB800',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  timelinePreviewSection: {
    backgroundColor: '#101210',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#222820',
  },
  timelineItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#181C18',
  },
  timelineItemIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  timelineItemTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timelineItemTitle: {
    ...TYPOGRAPHY.body,
    fontSize: 13,
    fontWeight: '700',
    color: '#D8DCD2',
  },
  timelineItemTime: {
    ...TYPOGRAPHY.caption,
    fontSize: 10,
    fontWeight: '700',
    color: '#FFB800',
  },
  timelineItemTag: {
    ...TYPOGRAPHY.caption,
    fontSize: 9,
    color: '#656D60',
    fontWeight: '700',
    marginTop: 2,
  },
  customItemsSection: {
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#242C24',
  },
  customItemsHeader: {
    ...TYPOGRAPHY.caption,
    fontSize: 9,
    fontWeight: '800',
    color: '#39D98A',
    letterSpacing: 1,
    marginBottom: 8,
  },
  customItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    backgroundColor: '#141814',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 8,
  },
  customItemIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  customItemTitle: {
    ...TYPOGRAPHY.body,
    fontSize: 12,
    fontWeight: '700',
    color: '#FFF',
  },
  customItemSub: {
    ...TYPOGRAPHY.caption,
    fontSize: 10,
    color: '#8E958A',
    marginTop: 1,
  },
  deleteCustomBtn: {
    padding: 6,
    marginLeft: 8,
  },
  deleteCustomText: {
    fontSize: 14,
  },
  permCard: {
    backgroundColor: '#101210',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#222820',
    marginBottom: 14,
  },
  permHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  permIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#191E18',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  permIcon: {
    fontSize: 20,
  },
  permTitle: {
    ...TYPOGRAPHY.body,
    fontSize: 14,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 4,
  },
  permSub: {
    ...TYPOGRAPHY.caption,
    fontSize: 11,
    lineHeight: 16,
    color: '#8E958A',
  },
  permBtn: {
    backgroundColor: '#FFB800',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  permBtnGranted: {
    backgroundColor: '#19281C',
    borderWidth: 1,
    borderColor: '#39D98A',
  },
  permBtnText: {
    ...TYPOGRAPHY.caption,
    color: '#070807',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  permBtnTextGranted: {
    color: '#39D98A',
  },
  permStatusPill: {
    backgroundColor: '#151D17',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#29432E',
  },
  permStatusText: {
    ...TYPOGRAPHY.caption,
    color: '#39D98A',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  bottomNavSection: {
    paddingTop: 16,
  },
  navRow: {
    flexDirection: 'row',
    gap: 12,
  },
  backBtn: {
    backgroundColor: '#161A16',
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#283228',
  },
  backBtnText: {
    ...TYPOGRAPHY.caption,
    color: '#A0A89C',
    fontSize: 12,
    fontWeight: '700',
  },
  nextBtn: {
    flex: 1,
    backgroundColor: '#FFB800',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FFB800',
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
  },
  nextBtnText: {
    ...TYPOGRAPHY.caption,
    color: '#070807',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
  },
  lockInBtn: {
    backgroundColor: '#FFB800',
  },
  lockInBtnText: {
    ...TYPOGRAPHY.caption,
    color: '#070807',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  footnote: {
    ...TYPOGRAPHY.caption,
    color: '#555C50',
    fontSize: 10,
    textAlign: 'center',
    marginTop: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#101210',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#283228',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    ...TYPOGRAPHY.caption,
    fontSize: 12,
    fontWeight: '800',
    color: '#FFB800',
    letterSpacing: 1.2,
  },
  modalCloseText: {
    color: '#888',
    fontSize: 18,
    fontWeight: '700',
  },
  inputLabel: {
    ...TYPOGRAPHY.caption,
    fontSize: 9,
    fontWeight: '800',
    color: '#8E958A',
    letterSpacing: 1,
    marginBottom: 6,
    marginTop: 10,
  },
  textInput: {
    backgroundColor: '#161A16',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#FFF',
    fontSize: 13,
    borderWidth: 1,
    borderColor: '#263026',
  },
  tagChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagChip: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#181C18',
    borderWidth: 1,
    borderColor: '#283228',
  },
  tagChipSelected: {
    backgroundColor: '#FFB800',
    borderColor: '#FFB800',
  },
  tagChipText: {
    ...TYPOGRAPHY.caption,
    fontSize: 10,
    color: '#8E958A',
    fontWeight: '700',
  },
  tagChipTextSelected: {
    color: '#070807',
    fontWeight: '800',
  },
  timeSelectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  timeInputBox: {
    flex: 1,
    backgroundColor: '#161A16',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#263026',
  },
  timeValue: {
    color: '#FFB800',
    fontSize: 14,
    fontWeight: '700',
  },
  timeAdjustBtn: {
    backgroundColor: '#1F251F',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#2E3A2E',
  },
  timeAdjustBtnText: {
    ...TYPOGRAPHY.caption,
    color: '#D8DCD2',
    fontSize: 11,
    fontWeight: '700',
  },
  modalAddBtn: {
    backgroundColor: '#FFB800',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  modalAddBtnText: {
    ...TYPOGRAPHY.caption,
    color: '#070807',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
});
