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
import {
  aiZenService,
  ENERGY_LEAK_OPTIONS,
  EnergyLeakId,
} from '../../services/aiZenService';

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

  // Step 1: AI Energy Diagnostic & Archetype (Jira DEV-99)
  const [selectedLeak, setSelectedLeak] = useState<EnergyLeakId>('dopamine_feeds');
  const [selectedArch, setSelectedArch] = useState<DincharyaArchetype>('builder');

  // Step 2: Circadian State (The Solar Arc)
  const [wakeHour, setWakeHour] = useState(5);
  const [wakeMin, setWakeMin] = useState(30);
  const [wakeMission, setWakeMission] = useState<'walk' | 'shake' | 'photo'>('walk');
  const [sleepHour, setSleepHour] = useState(22);
  const [sleepMin, setSleepMin] = useState(0);

  // Step 2/3: Day Planning State
  const [customItems, setCustomItems] = useState<RoutineTimelineItem[]>([]);
  const [enabledItemIds, setEnabledItemIds] = useState<string[]>([
    'wake_alarm',
    'dawn_breath',
    'protection_window',
    'midday_stop',
    'evening_transition',
    'sleep_sanctum',
  ]);

  // Step 3: 33 Spine Initiation State
  const [isVertebra01Ignited, setIsVertebra01Ignited] = useState<boolean>(false);

  // Step 4: Hardware Arming & Resonant Decay Test (Jira DEV-98)
  const [isHapticDecayActive, setIsHapticDecayActive] = useState<boolean>(false);
  const [decayPhase, setDecayPhase] = useState<'idle' | 'striking' | 'decaying' | 'silence'>('idle');
  const [notifPermissionGranted, setNotifPermissionGranted] = useState<boolean>(false);
  const [motionPermissionGranted, setMotionPermissionGranted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);

  // Custom Item Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [customSubtitle, setCustomSubtitle] = useState('');
  const [customTag, setCustomTag] = useState('DEEP WORK');
  const [customHour, setCustomHour] = useState(15);
  const [customMin, setCustomMin] = useState(0);
  const [customEndHour, setCustomEndHour] = useState(16);
  const [customEndMin, setCustomEndMin] = useState(0);

  // Check initial permissions on mount
  useEffect(() => {
    notificationService.checkPermissions().then((granted) => {
      setNotifPermissionGranted(granted);
    });
    const motionAvailable = motionSensorService.isSensorAvailable();
    setMotionPermissionGranted(motionAvailable);
  }, []);

  // Handle AI Leak Diagnostic selection
  const handleSelectLeak = (leakId: EnergyLeakId) => {
    HapticService.selection();
    setSelectedLeak(leakId);
  };

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

  // Toggle routine items
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

  // Step 3: Ignite Vertebra 01 (Coccyx/Root)
  const handleTouchVertebra01 = async () => {
    await HapticService.vertebralAscensionWave();
    setIsVertebra01Ignited(true);
  };

  // Step 4: Test Resonant Decay to Pure Silence (Jira DEV-98)
  const handleTestResonantDecay = async () => {
    if (isHapticDecayActive) return;
    setIsHapticDecayActive(true);
    setDecayPhase('striking');

    setTimeout(() => setDecayPhase('decaying'), 200);
    setTimeout(() => setDecayPhase('silence'), 800);
    setTimeout(() => {
      setIsHapticDecayActive(false);
      setDecayPhase('idle');
    }, 2400);

    await HapticService.resonantDecayToSilence();
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

      // 2. Persist AI baseline diagnostic profile (DEV-99)
      await aiZenService.saveBaselineDiagnostic(selectedLeak);

      // 3. Mark onboarding completed in AsyncStorage
      await AsyncStorage.setItem(ONBOARDING_DONE_KEY, 'true');

      // 4. Queue profile setup to Supabase outbox if user exists
      if (isSupabaseConfigured) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await syncOutbox.enqueue('profiles', {
            id: user.id,
            monk_title: selectedArch.toUpperCase(),
            energy_leak: selectedLeak,
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
  const currentLeakOption = aiZenService.getLeakOption(selectedLeak);

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
            ? 'THE SOVEREIGN THRESHOLD'
            : currentStep === 2
            ? 'THE SOLAR ARC (DINCHARYA)'
            : currentStep === 3
            ? 'THE 33 LIVING SPINE (SADHANA)'
            : 'HARDWARE AS SPIRIT'}
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ==================== STEP 1: AI ENERGY DIAGNOSTIC & ARCHETYPE (DEV-99) ==================== */}
        {currentStep === 1 && (
          <View>
            <View style={styles.header}>
              <Text style={styles.eyebrow}>THE SOVEREIGN RETURN</Text>
              <Text style={styles.title}>The world is loud.</Text>
              <Text style={styles.titleEm}>Where does your life force bleed?</Text>
              <Text style={styles.subtitle}>
                Before setting a routine, acknowledge the leak. Shaniwar places a mirror before you,
                not a cage.
              </Text>
            </View>

            {/* AI Energy Diagnostic Leak Options */}
            <View style={styles.sectionHeaderBox}>
              <Text style={styles.sectionHeading}>IDENTIFY YOUR PRIMARY ATTENTION LEAK</Text>
              <Text style={styles.sectionSub}>Select the pattern draining your life force:</Text>
            </View>

            <View style={styles.leakGrid}>
              {ENERGY_LEAK_OPTIONS.map((leak) => {
                const isSelected = selectedLeak === leak.id;
                return (
                  <TouchableOpacity
                    key={leak.id}
                    style={[styles.leakCard, isSelected && styles.leakCardSelected]}
                    onPress={() => handleSelectLeak(leak.id)}
                    activeOpacity={0.85}
                  >
                    <View style={styles.leakTopRow}>
                      <Text style={styles.leakIcon}>{leak.icon}</Text>
                      <Text style={[styles.leakLabel, isSelected && styles.leakLabelSelected]}>
                        {leak.label}
                      </Text>
                    </View>
                    <Text style={styles.leakTagline}>{leak.tagline}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Bodhidharma Zen Intelligence Mirror Card (DEV-99) */}
            <View style={styles.zenMirrorCard}>
              <View style={styles.zenMirrorBadgeRow}>
                <Text style={styles.zenMirrorBadge}>ZEN INTELLIGENCE • BODHIDHARMA MIRROR</Text>
                <Text style={styles.zenMirrorFocus}>{currentLeakOption.priorityFocus}</Text>
              </View>
              <Text style={styles.zenMirrorText}>
                "{currentLeakOption.bodhidharmaDiagnosis}"
              </Text>
            </View>

            {/* Base Life Archetype Selector */}
            <View style={[styles.sectionHeaderBox, { marginTop: 24 }]}>
              <Text style={styles.sectionHeading}>CALIBRATE LIFE ARCHETYPE</Text>
              <Text style={styles.sectionSub}>Choose your initial circadian baseline:</Text>
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

        {/* ==================== STEP 2: THE SOLAR ARC (DINCHARYA) ==================== */}
        {currentStep === 2 && (
          <View>
            <View style={styles.header}>
              <Text style={styles.eyebrow}>THE CROSS OF EXISTENCE • HORIZONTAL AXIS</Text>
              <Text style={styles.title}>The Solar Arc</Text>
              <Text style={styles.titleEm}>Planetary Rhythm.</Text>
              <Text style={styles.subtitle}>
                The sun rises, prana surges, twilight settles, the body restores. Your 24-hour day is
                an unbroken arc of light and blood.
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
                  <Text style={styles.clockSub}>COREMOTION • ZERO SNOOZE</Text>
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
                  Provides optimal slow-wave NREM and REM brain restoration between blackout and morning
                  ignition.
                </Text>
              </View>
            </View>

            {/* Day Arc Timeline Preview & Custom Add */}
            <View style={[styles.sectionHeaderBox, { marginTop: 24 }]}>
              <Text style={styles.sectionHeading}>INDIVIDUAL TIMELINE CUSTOMIZATION</Text>
              <Text style={styles.sectionSub}>Quickly attach daily blocks to your solar arc:</Text>
            </View>

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

            {/* Timeline Preview List */}
            <View style={styles.timelinePreviewSection}>
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

        {/* ==================== STEP 3: THE 33 LIVING SPINE (SADHANA) ==================== */}
        {currentStep === 3 && (
          <View>
            <View style={styles.header}>
              <Text style={styles.eyebrow}>THE CROSS OF EXISTENCE • VERTICAL AXIS</Text>
              <Text style={styles.title}>The 33 Living Spine</Text>
              <Text style={styles.titleEm}>Awakened Consciousness.</Text>
              <Text style={styles.subtitle}>
                Your spine is your physical reality right now. 33 vertebrae of ascending awareness—from
                earth grounding at the coccyx to pure sovereign witness (Sakshi) at the crown.
              </Text>
            </View>

            {/* Vertebra 01 Interactive Initiation Card */}
            <TouchableOpacity
              style={[
                styles.spineInitiationCard,
                isVertebra01Ignited && styles.spineInitiationCardIgnited,
              ]}
              onPress={handleTouchVertebra01}
              activeOpacity={0.85}
            >
              <View style={styles.spineInitiationHeader}>
                <View
                  style={[
                    styles.spineNodePulse,
                    isVertebra01Ignited && styles.spineNodePulseIgnited,
                  ]}
                >
                  <Text style={styles.spineNodeNumber}>01</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.spineNodeTitle}>VERTEBRA 01 • MULADHARA (ROOT COCCYX)</Text>
                  <Text style={styles.spineNodeSub}>
                    {isVertebra01Ignited
                      ? 'CURRENT IGNITED • GROUNDING SEALED'
                      : 'TOUCH TO IGNITE YOUR NERVOUS SYSTEM'}
                  </Text>
                </View>
              </View>

              {isVertebra01Ignited ? (
                <View style={styles.spineIgnitedBanner}>
                  <Text style={styles.spineIgnitedCheck}>✓</Text>
                  <Text style={styles.spineIgnitedText}>
                    "The foundation is sealed. 32 thresholds await above. One conscious breath at a
                    time."
                  </Text>
                </View>
              ) : (
                <View style={styles.spinePromptBox}>
                  <Text style={styles.spinePromptText}>
                    Tap to trigger the Vertebral Ascension Wave through your device.
                  </Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Spine Architectural Map Preview */}
            <View style={[styles.sectionHeaderBox, { marginTop: 24 }]}>
              <Text style={styles.sectionHeading}>THE FOUR SPINAL CONSCIOUSNESS ZONES</Text>
              <Text style={styles.sectionSub}>Ascending column of sovereign awareness:</Text>
            </View>

            <View style={styles.spineZonesContainer}>
              {[
                {
                  zone: 'CERVICAL & CRANIAL (25–33)',
                  title: 'Sakshi / The Witness State',
                  desc: 'Pure sovereign awareness looking directly at the digital matrix untouched.',
                  color: '#FFB800',
                  active: false,
                },
                {
                  zone: 'THORACIC (17–24)',
                  title: 'Heart Center / Stillness in Chaos',
                  desc: 'De-armoring the chest. Witnessing digital agitation without flinching.',
                  color: '#6C63FF',
                  active: false,
                },
                {
                  zone: 'LUMBAR (09–16)',
                  title: 'Solar Plexus / Vital Prana',
                  desc: '90-minute sustained deep focus capacity without dopamine grasping.',
                  color: '#E84545',
                  active: false,
                },
                {
                  zone: 'SACRAL & COCCYX (01–08)',
                  title: 'Root / Grounding in Reality',
                  desc: 'Circadian ignition. Feet on the earth. Waking up without device noise.',
                  color: '#39D98A',
                  active: true,
                },
              ].map((z, idx) => (
                <View key={idx} style={[styles.spineZoneCard, z.active && styles.spineZoneCardActive]}>
                  <View style={styles.spineZoneTop}>
                    <Text style={[styles.spineZoneTag, { color: z.color }]}>{z.zone}</Text>
                    {z.active && <Text style={styles.spineZoneCurrent}>ACTIVE THRESHOLD</Text>}
                  </View>
                  <Text style={styles.spineZoneTitle}>{z.title}</Text>
                  <Text style={styles.spineZoneDesc}>{z.desc}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* ==================== STEP 4: HARDWARE ARMING & RESONANT DECAY TEST (DEV-98) ==================== */}
        {currentStep === 4 && (
          <View>
            <View style={styles.header}>
              <Text style={styles.eyebrow}>HARDWARE AS SPIRIT</Text>
              <Text style={styles.title}>Sensory Engine & Arming</Text>
              <Text style={styles.titleEm}>Zero Clipping. Pure Silence.</Text>
              <Text style={styles.subtitle}>
                Shaniwar treats your glass and haptic actuators as a sacred instrument. Zero cloud tracking,
                zero ads, pure presence.
              </Text>
            </View>

            {/* Interactive Resonant Decay Test Card (Jira DEV-98) */}
            <View style={styles.decayCard}>
              <View style={styles.decayHeader}>
                <Text style={styles.decayBadge}>JIRA DEV-98 • SENSORY PRECISION</Text>
                <Text style={styles.decayTitle}>Resonant Decay to Pure Silence</Text>
                <Text style={styles.decayDesc}>
                  Experience the multi-tier micro-frequency haptic curve mimicking a Tibetan singing bowl
                  decaying into zero silence.
                </Text>
              </View>

              <TouchableOpacity
                style={[
                  styles.decayTestBtn,
                  isHapticDecayActive && styles.decayTestBtnActive,
                ]}
                onPress={handleTestResonantDecay}
                activeOpacity={0.85}
              >
                <Text style={styles.decayTestBtnText}>
                  {decayPhase === 'idle'
                    ? '🔔 TEST RESONANT DECAY TO SILENCE'
                    : decayPhase === 'striking'
                    ? '⚡ INITIAL STRIKE (HEAVY)...'
                    : decayPhase === 'decaying'
                    ? '〰️ HARMONIC ATTENUATION...'
                    : '✓ PURE SILENCE REACHED'}
                </Text>
              </TouchableOpacity>

              <View style={styles.decayWaveContainer}>
                {[1.0, 0.75, 0.5, 0.3, 0.15, 0.05, 0.0].map((amp, idx) => (
                  <View
                    key={idx}
                    style={[
                      styles.decayWaveBar,
                      {
                        height: Math.max(4, amp * 28),
                        opacity: isHapticDecayActive ? 0.4 + (1 - amp) * 0.6 : 0.3,
                        backgroundColor: isHapticDecayActive ? '#FFB800' : '#444',
                      },
                    ]}
                  />
                ))}
              </View>
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
                    Required to trigger routine transitions, enforce the 7-second witness mirror, and
                    sound alarms.
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
                  <Text style={styles.permTitle}>CoreMotion Sensor (Non-Snooze)</Text>
                  <Text style={styles.permSub}>
                    Verifies genuine 20-step morning walks. Without physical movement, the alarm will
                    continue sounding.
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
                  <Text style={styles.permTitle}>High-Priority Monastic Audio</Text>
                  <Text style={styles.permSub}>
                    Audio alert playback configured to awaken you even during Do Not Disturb or silent
                    modes.
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
                    ? 'PROCEED TO SOLAR ARC →'
                    : currentStep === 2
                    ? 'INITIATE 33 LIVING SPINE →'
                    : 'ARM HARDWARE SENSORS →'}
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
                  {isLoading ? 'CALIBRATING SPIRIT...' : 'ENTER THE VIRTUAL MONASTERY →'}
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
                <Text style={styles.modalAddBtnText}>INSERT INTO SOLAR ARC →</Text>
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
    backgroundColor: '#FFB800',
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
    fontSize: 28,
    fontWeight: '300',
    color: '#F4F4EC',
    lineHeight: 34,
  },
  titleEm: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFB800',
    lineHeight: 36,
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

  // Step 1: AI Energy Diagnostic styles
  leakGrid: {
    gap: 10,
    marginBottom: 16,
  },
  leakCard: {
    backgroundColor: '#101310',
    borderWidth: 1,
    borderColor: '#202620',
    borderRadius: 14,
    padding: 14,
  },
  leakCardSelected: {
    borderColor: '#FFB800',
    backgroundColor: '#171B14',
  },
  leakTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 4,
  },
  leakIcon: {
    fontSize: 18,
  },
  leakLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#DDD',
  },
  leakLabelSelected: {
    color: '#FFB800',
  },
  leakTagline: {
    fontSize: 11,
    color: '#8E958A',
    lineHeight: 16,
  },
  zenMirrorCard: {
    backgroundColor: '#151713',
    borderWidth: 1,
    borderColor: '#FFB80055',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
  },
  zenMirrorBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  zenMirrorBadge: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: '#FFB800',
  },
  zenMirrorFocus: {
    fontSize: 9,
    fontWeight: '700',
    color: '#39D98A',
  },
  zenMirrorText: {
    fontSize: 13,
    fontStyle: 'italic',
    color: '#E6E8E2',
    lineHeight: 20,
  },

  // Archetypes
  archetypeGrid: {
    gap: 10,
    marginBottom: 16,
  },
  archCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#101310',
    borderWidth: 1,
    borderColor: '#202620',
    borderRadius: 14,
    padding: 12,
    gap: 12,
  },
  archCardSelected: {
    borderColor: '#FFB800',
    backgroundColor: '#171B14',
  },
  archIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#1C221C',
    alignItems: 'center',
    justifyContent: 'center',
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
    fontSize: 13,
    fontWeight: '700',
    color: '#DDD',
  },
  archNameSelected: {
    color: '#FFB800',
  },
  archTime: {
    fontSize: 10,
    fontWeight: '700',
    color: '#71796D',
  },
  archTimeSelected: {
    color: '#FFB800',
  },
  archTagline: {
    fontSize: 10,
    fontWeight: '600',
    color: '#B49860',
    marginBottom: 2,
  },
  archDescription: {
    fontSize: 10,
    color: '#8E958A',
    lineHeight: 14,
  },

  // Step 2: Solar Arc
  cardBox: {
    backgroundColor: '#111411',
    borderWidth: 1,
    borderColor: '#222822',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
  },
  cardBoxHeader: {
    marginBottom: 12,
  },
  cardBoxTag: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFB800',
    letterSpacing: 1.5,
    marginBottom: 2,
  },
  cardBoxTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F4F4EC',
  },
  clockDisplayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  stepperBtn: {
    backgroundColor: '#1C221C',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  stepperBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#CCCCCC',
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
    fontSize: 9,
    fontWeight: '800',
    color: '#71796D',
    letterSpacing: 1,
    marginTop: 2,
  },
  presetChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    justifyContent: 'center',
    marginBottom: 10,
  },
  chip: {
    backgroundColor: '#171B17',
    borderWidth: 1,
    borderColor: '#283028',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  chipSelected: {
    backgroundColor: '#FFB800',
    borderColor: '#FFB800',
  },
  chipText: {
    fontSize: 10,
    color: '#9CA395',
    fontWeight: '600',
  },
  chipTextSelected: {
    color: '#000000',
    fontWeight: '800',
  },
  missionContainer: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#1F251F',
    paddingTop: 10,
  },
  missionLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#B49860',
    letterSpacing: 1,
    marginBottom: 6,
  },
  missionChipsRow: {
    gap: 6,
  },
  missionChip: {
    backgroundColor: '#171B17',
    borderWidth: 1,
    borderColor: '#242C24',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  missionChipSelected: {
    borderColor: '#FFB800',
    backgroundColor: '#1F231B',
  },
  missionChipText: {
    fontSize: 11,
    color: '#CCCCCC',
    fontWeight: '600',
  },
  missionChipTextSelected: {
    color: '#FFB800',
    fontWeight: '700',
  },
  readoutCard: {
    backgroundColor: '#121A13',
    borderWidth: 1,
    borderColor: '#253E29',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  readoutIcon: {
    fontSize: 22,
  },
  readoutTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#86E09E',
    marginBottom: 2,
  },
  readoutDesc: {
    fontSize: 10,
    color: '#71796D',
    lineHeight: 14,
  },
  popularList: {
    gap: 10,
    paddingBottom: 8,
  },
  popularCard: {
    backgroundColor: '#121612',
    borderWidth: 1,
    borderColor: '#242D24',
    borderRadius: 10,
    padding: 10,
    minWidth: 130,
  },
  popularCardAdded: {
    borderColor: '#39D98A55',
    backgroundColor: '#101C12',
  },
  popularIcon: {
    fontSize: 16,
    marginBottom: 4,
  },
  popularTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#EEE',
  },
  popularTime: {
    fontSize: 9,
    color: '#FFB800',
    marginTop: 2,
  },
  popularAction: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFB800',
    marginTop: 4,
  },
  addCustomBtn: {
    backgroundColor: '#161C16',
    borderWidth: 1,
    borderColor: '#2D382D',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 16,
  },
  addCustomBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#CCCCCC',
  },
  timelinePreviewSection: {
    gap: 8,
    marginBottom: 16,
  },
  timelineItemRow: {
    backgroundColor: '#111411',
    borderWidth: 1,
    borderColor: '#202620',
    borderRadius: 10,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  timelineItemIcon: {
    fontSize: 16,
  },
  timelineItemTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timelineItemTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#EEE',
  },
  timelineItemTime: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFB800',
  },
  timelineItemTag: {
    fontSize: 8,
    fontWeight: '800',
    color: '#71796D',
    letterSpacing: 1,
    marginTop: 2,
  },
  customItemsSection: {
    marginTop: 8,
    gap: 6,
  },
  customItemsHeader: {
    fontSize: 9,
    fontWeight: '800',
    color: '#B49860',
    letterSpacing: 1,
    marginBottom: 4,
  },
  customItemRow: {
    backgroundColor: '#141814',
    borderWidth: 1,
    borderColor: '#2B382B',
    borderRadius: 10,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  customItemIcon: {
    fontSize: 14,
  },
  customItemTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFF',
  },
  customItemSub: {
    fontSize: 9,
    color: '#8E958A',
  },
  deleteCustomBtn: {
    padding: 4,
  },
  deleteCustomText: {
    fontSize: 14,
  },

  // Step 3: 33 Living Spine Styles
  spineInitiationCard: {
    backgroundColor: '#121412',
    borderWidth: 1,
    borderColor: '#262D26',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  spineInitiationCardIgnited: {
    borderColor: '#FFB800',
    backgroundColor: '#191C15',
  },
  spineInitiationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  spineNodePulse: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#444',
    backgroundColor: '#171B17',
    alignItems: 'center',
    justifyContent: 'center',
  },
  spineNodePulseIgnited: {
    borderColor: '#FFB800',
    backgroundColor: '#FFB80020',
  },
  spineNodeNumber: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFB800',
  },
  spineNodeTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFB800',
    letterSpacing: 1,
  },
  spineNodeSub: {
    fontSize: 9,
    fontWeight: '700',
    color: '#8E958A',
    marginTop: 2,
  },
  spineIgnitedBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#2B3224',
  },
  spineIgnitedCheck: {
    fontSize: 14,
    color: '#39D98A',
    fontWeight: '800',
  },
  spineIgnitedText: {
    flex: 1,
    fontSize: 11,
    fontStyle: 'italic',
    color: '#E0E2DC',
    lineHeight: 16,
  },
  spinePromptBox: {
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#202620',
  },
  spinePromptText: {
    fontSize: 10,
    color: '#71796D',
  },
  spineZonesContainer: {
    gap: 10,
    marginBottom: 16,
  },
  spineZoneCard: {
    backgroundColor: '#101310',
    borderWidth: 1,
    borderColor: '#202620',
    borderRadius: 12,
    padding: 12,
  },
  spineZoneCardActive: {
    borderColor: '#39D98A55',
    backgroundColor: '#121A13',
  },
  spineZoneTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  spineZoneTag: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
  },
  spineZoneCurrent: {
    fontSize: 8,
    fontWeight: '800',
    color: '#39D98A',
    backgroundColor: '#182E1D',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  spineZoneTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#E0E2DC',
    marginBottom: 2,
  },
  spineZoneDesc: {
    fontSize: 10,
    color: '#71796D',
    lineHeight: 14,
  },

  // Step 4: Hardware Arming & Resonant Decay (DEV-98)
  decayCard: {
    backgroundColor: '#121512',
    borderWidth: 1,
    borderColor: '#242B24',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  decayHeader: {
    marginBottom: 12,
  },
  decayBadge: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFB800',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  decayTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#F4F4EC',
    marginBottom: 4,
  },
  decayDesc: {
    fontSize: 11,
    color: '#8E958A',
    lineHeight: 16,
  },
  decayTestBtn: {
    backgroundColor: '#192019',
    borderWidth: 1,
    borderColor: '#FFB800',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  decayTestBtnActive: {
    backgroundColor: '#FFB800',
  },
  decayTestBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFB800',
    letterSpacing: 1,
  },
  decayWaveContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 32,
  },
  decayWaveBar: {
    width: 6,
    borderRadius: 3,
  },

  permCard: {
    backgroundColor: '#101310',
    borderWidth: 1,
    borderColor: '#202620',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  permHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 10,
  },
  permIconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#181E18',
    alignItems: 'center',
    justifyContent: 'center',
  },
  permIcon: {
    fontSize: 18,
  },
  permTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#EEE',
    marginBottom: 2,
  },
  permSub: {
    fontSize: 10,
    color: '#8E958A',
    lineHeight: 14,
  },
  permBtn: {
    backgroundColor: '#FFB800',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  permBtnGranted: {
    backgroundColor: '#1C2E1F',
    borderWidth: 1,
    borderColor: '#39D98A',
  },
  permBtnText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#000',
    letterSpacing: 1,
  },
  permBtnTextGranted: {
    color: '#39D98A',
  },
  permStatusPill: {
    backgroundColor: '#17271A',
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: 'center',
  },
  permStatusText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#39D98A',
    letterSpacing: 1,
  },

  // Bottom Navigation
  bottomNavSection: {
    marginTop: 10,
    paddingBottom: 20,
  },
  navRow: {
    flexDirection: 'row',
    gap: 10,
  },
  backBtn: {
    backgroundColor: '#161A16',
    borderWidth: 1,
    borderColor: '#242C24',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  backBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#A0A89C',
  },
  nextBtn: {
    flex: 1,
    backgroundColor: '#FFB800',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  lockInBtn: {
    backgroundColor: '#FFB800',
  },
  nextBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#000000',
    letterSpacing: 1,
  },
  lockInBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#000000',
    letterSpacing: 1,
  },
  footnote: {
    textAlign: 'center',
    fontSize: 10,
    color: '#656D60',
    marginTop: 10,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#121512',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderColor: '#263026',
    padding: 20,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFB800',
    letterSpacing: 1.5,
  },
  modalCloseText: {
    fontSize: 16,
    color: '#AAA',
    fontWeight: '700',
  },
  inputLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#B49860',
    letterSpacing: 1,
    marginTop: 12,
    marginBottom: 6,
  },
  textInput: {
    backgroundColor: '#171B17',
    borderWidth: 1,
    borderColor: '#263026',
    borderRadius: 8,
    padding: 10,
    color: '#FFF',
    fontSize: 12,
  },
  tagChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tagChip: {
    backgroundColor: '#171B17',
    borderWidth: 1,
    borderColor: '#263026',
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  tagChipSelected: {
    borderColor: '#FFB800',
    backgroundColor: '#FFB80020',
  },
  tagChipText: {
    fontSize: 10,
    color: '#AAA',
    fontWeight: '600',
  },
  tagChipTextSelected: {
    color: '#FFB800',
    fontWeight: '700',
  },
  timeSelectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timeInputBox: {
    flex: 1,
    backgroundColor: '#171B17',
    borderWidth: 1,
    borderColor: '#263026',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
  },
  timeValue: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFB800',
  },
  timeAdjustBtn: {
    backgroundColor: '#1C221C',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  timeAdjustBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#CCCCCC',
  },
  modalAddBtn: {
    backgroundColor: '#FFB800',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  modalAddBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#000',
    letterSpacing: 1,
  },
});
