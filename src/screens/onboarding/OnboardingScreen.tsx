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
  CurrentRealityProfile,
  TargetStanceProfile,
} from '../../services/aiZenService';

export const ONBOARDING_DONE_KEY = '@hybrid_monk_onboarded_v2';

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

export const OnboardingScreen: React.FC<Props> = ({ onComplete, initialStep = 1 }) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(initialStep);

  // Step 1: Multi-Select Attention Leaks (DEV-99 & DEV-100)
  const [selectedLeaks, setSelectedLeaks] = useState<EnergyLeakId[]>([
    'dopamine_feeds',
    'morning_inertia',
  ]);

  // Step 2: The Dial of Truth (Current Reality vs Target Stance)
  const [currentWakeHour, setCurrentWakeHour] = useState(8);
  const [currentWakeMin, setCurrentWakeMin] = useState(15);
  const [currentSleepHour, setCurrentSleepHour] = useState(1);
  const [currentSleepMin, setCurrentSleepMin] = useState(15);
  const [currentFocusHours, setCurrentFocusHours] = useState(1.0);

  const [targetWakeHour, setTargetWakeHour] = useState(5);
  const [targetWakeMin, setTargetWakeMin] = useState(30);
  const [targetSleepHour, setTargetSleepHour] = useState(22);
  const [targetSleepMin, setTargetSleepMin] = useState(0);
  const [targetFocusHours, setTargetFocusHours] = useState(4.0);

  // Step 3: Generated Editable 24/7 Dincharya (River Stones in a Zen Garden)
  const [dincharyaItems, setDincharyaItems] = useState<RoutineTimelineItem[]>([]);
  const [isDincharyaGenerated, setIsDincharyaGenerated] = useState(false);

  // Step 4: Hardware as Spirit & Resonant Decay (DEV-98 & DEV-100)
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

  // Permissions check on mount
  useEffect(() => {
    notificationService.checkPermissions().then((granted) => {
      setNotifPermissionGranted(granted);
    });
    const motionAvailable = motionSensorService.isSensorAvailable();
    setMotionPermissionGranted(motionAvailable);
  }, []);

  // Generate initial Dincharya when transitioning to Step 3
  useEffect(() => {
    if (currentStep === 3 && !isDincharyaGenerated) {
      const generated = aiZenService.generateAdaptiveDincharya(
        {
          wakeTime: { hour: targetWakeHour, minute: targetWakeMin },
          sleepTime: { hour: targetSleepHour, minute: targetSleepMin },
          dailyDeepWorkHours: targetFocusHours,
        },
        selectedLeaks
      );
      setDincharyaItems(generated);
      setIsDincharyaGenerated(true);
    }
  }, [currentStep, isDincharyaGenerated, targetWakeHour, targetWakeMin, targetSleepHour, targetSleepMin, targetFocusHours, selectedLeaks]);

  // Toggle Attention Leak Conduit (Multi-Select with Kinetic Haptics)
  const handleToggleLeak = (leakId: EnergyLeakId) => {
    HapticService.heavyImpact();
    setSelectedLeaks((prev) => {
      if (prev.includes(leakId)) {
        return prev.filter((id) => id !== leakId);
      } else {
        return [...prev, leakId];
      }
    });
  };

  // Stepper adjustments for Current Reality
  const adjustCurrentWake = (delta: number) => {
    HapticService.selection();
    let total = currentWakeHour * 60 + currentWakeMin + delta;
    if (total < 0) total += 24 * 60;
    total = total % (24 * 60);
    setCurrentWakeHour(Math.floor(total / 60));
    setCurrentWakeMin(total % 60);
  };

  const adjustCurrentSleep = (delta: number) => {
    HapticService.selection();
    let total = currentSleepHour * 60 + currentSleepMin + delta;
    if (total < 0) total += 24 * 60;
    total = total % (24 * 60);
    setCurrentSleepHour(Math.floor(total / 60));
    setCurrentSleepMin(total % 60);
  };

  // Stepper adjustments for Target Stance
  const adjustTargetWake = (delta: number) => {
    HapticService.lightImpact();
    let total = targetWakeHour * 60 + targetWakeMin + delta;
    if (total < 0) total += 24 * 60;
    total = total % (24 * 60);
    setTargetWakeHour(Math.floor(total / 60));
    setTargetWakeMin(total % 60);
    setIsDincharyaGenerated(false); // trigger re-generation
  };

  const adjustTargetSleep = (delta: number) => {
    HapticService.lightImpact();
    let total = targetSleepHour * 60 + targetSleepMin + delta;
    if (total < 0) total += 24 * 60;
    total = total % (24 * 60);
    setTargetSleepHour(Math.floor(total / 60));
    setTargetSleepMin(total % 60);
    setIsDincharyaGenerated(false);
  };

  // Toggle routine item in Dincharya
  const handleToggleItem = (id: string) => {
    HapticService.selection();
    setDincharyaItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, enabled: !item.enabled } : item
      )
    );
  };

  // Remove a custom or editable routine item
  const handleRemoveItem = (id: string) => {
    HapticService.lightImpact();
    setDincharyaItems((prev) => prev.filter((it) => it.id !== id));
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

    setDincharyaItems((prev) => [...prev, newItem]);
    setIsAddModalOpen(false);
    setCustomTitle('');
    setCustomSubtitle('');
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

  // Inscribe Sovereign Dincharya and complete onboarding
  const handleInscribe = async () => {
    setIsLoading(true);
    await HapticService.resonantDecayToSilence();

    try {
      const currentReality: CurrentRealityProfile = {
        wakeTime: { hour: currentWakeHour, minute: currentWakeMin },
        sleepTime: { hour: currentSleepHour, minute: currentSleepMin },
        dailyDeepWorkHours: currentFocusHours,
      };

      const targetStance: TargetStanceProfile = {
        wakeTime: { hour: targetWakeHour, minute: targetWakeMin },
        sleepTime: { hour: targetSleepHour, minute: targetSleepMin },
        dailyDeepWorkHours: targetFocusHours,
      };

      const deltaLedger = aiZenService.computeDelta(currentReality, targetStance);
      const compound = aiZenService.generateCompoundDiagnosis(selectedLeaks);

      // 1. Save Full Onboarding Profile (DEV-100)
      await aiZenService.saveOnboardingProfile({
        selectedLeaks,
        currentReality,
        targetStance,
        deltaLedger,
        compoundDiagnosis: compound.diagnosisText,
        curatedArchetypes: compound.notificationArchetypes,
        calibratedAt: new Date().toISOString(),
      });

      // 2. Persist calibrated Dincharya items into routine service
      await routineService.saveCalibratedRoutine({
        archetype: 'builder',
        wakeHour: targetWakeHour,
        wakeMinute: targetWakeMin,
        wakeMission: 'walk',
        sleepHour: targetSleepHour,
        sleepMinute: targetSleepMin,
        customItems: dincharyaItems.filter((i) => i.isCustom),
        enabledItemIds: dincharyaItems.filter((i) => i.enabled).map((i) => i.id),
      });

      // 3. Mark Onboarding completed in AsyncStorage
      await AsyncStorage.setItem(ONBOARDING_DONE_KEY, 'true');

      // 4. Queue profile sync to Supabase outbox if user exists
      if (isSupabaseConfigured) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await syncOutbox.enqueue('profiles', {
            id: user.id,
            monk_title: 'SOVEREIGN_INITIATE',
            energy_leaks: selectedLeaks,
            reclaimed_hours_annual: deltaLedger.annualConsciousHoursReclaimed,
            updated_at: new Date().toISOString(),
          });
        }
      }
    } catch (e) {
      console.warn('[Onboarding] Error inscribing routine:', e);
    } finally {
      setIsLoading(false);
      onComplete();
    }
  };

  // Compute live Delta Ledger & Compound Diagnosis
  const currentReality: CurrentRealityProfile = {
    wakeTime: { hour: currentWakeHour, minute: currentWakeMin },
    sleepTime: { hour: currentSleepHour, minute: currentSleepMin },
    dailyDeepWorkHours: currentFocusHours,
  };

  const targetStance: TargetStanceProfile = {
    wakeTime: { hour: targetWakeHour, minute: targetWakeMin },
    sleepTime: { hour: targetSleepHour, minute: targetSleepMin },
    dailyDeepWorkHours: targetFocusHours,
  };

  const delta = aiZenService.computeDelta(currentReality, targetStance);
  const compound = aiZenService.generateCompoundDiagnosis(selectedLeaks);

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
            ? 'CONDUITS'
            : currentStep === 2
            ? 'DIAL OF TRUTH'
            : currentStep === 3
            ? '24-HOUR ARC'
            : 'THE THREE SEALS'}
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ==================== STEP 1: MULTI-SELECT LEAKS & COMPOUND BODHIDHARMA MIRROR ==================== */}
        {currentStep === 1 && (
          <View>
            <View style={styles.header}>
              <Text style={styles.eyebrow}>CONDUITS</Text>
              <Text style={styles.title}>Where does your life leak?</Text>
              <Text style={styles.subtitle}>
                Tap the conduits. Face the drain. Shanivar places an unsparing mirror before you.
              </Text>
            </View>

            <View style={styles.leakGrid}>
              {ENERGY_LEAK_OPTIONS.map((leak) => {
                const isSelected = selectedLeaks.includes(leak.id);
                return (
                  <TouchableOpacity
                    key={leak.id}
                    style={[styles.leakCard, isSelected && styles.leakCardSelected]}
                    onPress={() => handleToggleLeak(leak.id)}
                    activeOpacity={0.85}
                  >
                    <View style={styles.leakTopRow}>
                      <Text style={styles.leakIcon}>{leak.icon}</Text>
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.leakLabel, isSelected && styles.leakLabelSelected]}>
                          {leak.label}
                        </Text>
                      </View>
                      <View style={[styles.checkCircle, isSelected && styles.checkCircleSelected]}>
                        <Text style={[styles.checkMark, isSelected && styles.checkMarkSelected]}>
                          {isSelected ? '✓' : ''}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.leakTagline}>{leak.tagline}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Live Compound Bodhidharma Zen Mirror Card */}
            <View style={styles.zenMirrorCard}>
              <View style={styles.zenMirrorBadgeRow}>
                <Text style={styles.zenMirrorBadge}>COMPOUND BODHIDHARMA SYNTHESIS</Text>
                <Text style={styles.zenMirrorFocus}>{compound.priorityFocus}</Text>
              </View>
              <Text style={styles.zenMirrorText}>
                "{compound.diagnosisText}"
              </Text>
            </View>
          </View>
        )}

        {/* ==================== STEP 2: THE DIAL OF TRUTH & DELTA BRIDGE ==================== */}
        {currentStep === 2 && (
          <View>
            <View style={styles.header}>
              <Text style={styles.eyebrow}>DIAL OF TRUTH</Text>
              <Text style={styles.title}>Where You Stand. Where You Plant Your Flag.</Text>
              <Text style={styles.subtitle}>
                We measure the territory surrendered to reclaim it.
              </Text>
            </View>

            {/* Section A: The Unconscious Drift (Current Reality) */}
            <View style={styles.realityBox}>
              <View style={styles.realityHeader}>
                <Text style={styles.realityTag}>CURRENT REALITY • THE DRIFT</Text>
                <Text style={styles.realityTitle}>When Does Your Day Actually Collapse?</Text>
              </View>

              <View style={styles.clockDuoRow}>
                {/* Current Wake */}
                <View style={styles.clockHalfCard}>
                  <Text style={styles.clockMiniTag}>EYES ACTUALLY OPEN</Text>
                  <Text style={styles.clockMiniTime}>
                    {routineService.formatTimeDisplay(currentWakeHour, currentWakeMin)}
                  </Text>
                  <View style={styles.microStepperRow}>
                    <TouchableOpacity
                      style={styles.microBtn}
                      onPress={() => adjustCurrentWake(-15)}
                    >
                      <Text style={styles.microBtnText}>- 15m</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.microBtn}
                      onPress={() => adjustCurrentWake(15)}
                    >
                      <Text style={styles.microBtnText}>+ 15m</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Current Bedtime */}
                <View style={styles.clockHalfCard}>
                  <Text style={styles.clockMiniTag}>PHONE FINALLY DOWN</Text>
                  <Text style={styles.clockMiniTime}>
                    {routineService.formatTimeDisplay(currentSleepHour, currentSleepMin)}
                  </Text>
                  <View style={styles.microStepperRow}>
                    <TouchableOpacity
                      style={styles.microBtn}
                      onPress={() => adjustCurrentSleep(-15)}
                    >
                      <Text style={styles.microBtnText}>- 15m</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.microBtn}
                      onPress={() => adjustCurrentSleep(15)}
                    >
                      <Text style={styles.microBtnText}>+ 15m</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>

            {/* Section B: The Sovereign Target */}
            <View style={styles.targetBox}>
              <View style={styles.targetHeader}>
                <Text style={styles.targetTag}>THE SOVEREIGN TARGET • THE STANCE</Text>
                <Text style={styles.targetTitle}>Where Will You Plant Your Flag?</Text>
              </View>

              <View style={styles.clockDuoRow}>
                {/* Target Wake */}
                <View style={[styles.clockHalfCard, styles.targetClockCard]}>
                  <Text style={[styles.clockMiniTag, { color: '#FFB800' }]}>DAWN IGNITION</Text>
                  <Text style={[styles.clockMiniTime, { color: '#FFB800' }]}>
                    {routineService.formatTimeDisplay(targetWakeHour, targetWakeMin)}
                  </Text>
                  <View style={styles.microStepperRow}>
                    <TouchableOpacity
                      style={[styles.microBtn, styles.targetMicroBtn]}
                      onPress={() => adjustTargetWake(-15)}
                    >
                      <Text style={[styles.microBtnText, { color: '#FFB800' }]}>- 15m</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.microBtn, styles.targetMicroBtn]}
                      onPress={() => adjustTargetWake(15)}
                    >
                      <Text style={[styles.microBtnText, { color: '#FFB800' }]}>+ 15m</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Target Sleep */}
                <View style={[styles.clockHalfCard, styles.targetClockCard]}>
                  <Text style={[styles.clockMiniTag, { color: '#FFB800' }]}>DIGITAL BLACKOUT</Text>
                  <Text style={[styles.clockMiniTime, { color: '#FFB800' }]}>
                    {routineService.formatTimeDisplay(targetSleepHour, targetSleepMin)}
                  </Text>
                  <View style={styles.microStepperRow}>
                    <TouchableOpacity
                      style={[styles.microBtn, styles.targetMicroBtn]}
                      onPress={() => adjustTargetSleep(-15)}
                    >
                      <Text style={[styles.microBtnText, { color: '#FFB800' }]}>- 15m</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.microBtn, styles.targetMicroBtn]}
                      onPress={() => adjustTargetSleep(15)}
                    >
                      <Text style={[styles.microBtnText, { color: '#FFB800' }]}>+ 15m</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>

            {/* Section C: The Delta Bridge (The Ledger of Stolen Life) */}
            <View style={styles.ledgerCard}>
              <View style={styles.ledgerHeader}>
                <Text style={styles.ledgerBadge}>THE DELTA BRIDGE • LEDGER OF STOLEN LIFE</Text>
                <Text style={styles.ledgerHeading}>The Cost of Unconscious Drift</Text>
              </View>

              <View style={styles.ledgerRow}>
                <Text style={styles.ledgerLabel}>Morning Daylight Lost to Inertia:</Text>
                <Text style={styles.ledgerValue}>{delta.lostMorningHours} hrs / day</Text>
              </View>
              <View style={styles.ledgerRow}>
                <Text style={styles.ledgerLabel}>Twilight Surrendered to Blue Light:</Text>
                <Text style={styles.ledgerValue}>{delta.lostNightHours} hrs / night</Text>
              </View>
              <View style={[styles.ledgerRow, styles.ledgerRowTotal]}>
                <Text style={styles.ledgerLabelTotal}>Total Sovereign Territory Lost:</Text>
                <Text style={styles.ledgerValueTotal}>{delta.totalDailySurrenderedHours} HOURS / DAY</Text>
              </View>

              <View style={styles.ledgerCallout}>
                <Text style={styles.ledgerCalloutText}>
                  In one year, you surrender{' '}
                  <Text style={{ color: '#E84545', fontWeight: '800' }}>
                    {delta.annualWakingDaysLost} FULL WAKING DAYS
                  </Text>{' '}
                  to the machine. By planting your flag, you reclaim{' '}
                  <Text style={{ color: '#39D98A', fontWeight: '800' }}>
                    +{delta.annualConsciousHoursReclaimed} hours
                  </Text>{' '}
                  of conscious creation.
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* ==================== STEP 3: THE 24/7 LIVING DINCHARYA (RIVER STONES) ==================== */}
        {currentStep === 3 && (
          <View>
            <View style={styles.header}>
              <Text style={styles.eyebrow}>24-HOUR ARC</Text>
              <Text style={styles.title}>Your 24-Hour Arc</Text>
              <Text style={styles.subtitle}>
                Three immovable iron anchors. Three living stones. Tap to sculpt.
              </Text>
            </View>

            {/* Add Custom Anchor Button */}
            <TouchableOpacity
              style={styles.addCustomBtn}
              onPress={() => {
                HapticService.selection();
                setIsAddModalOpen(true);
              }}
              activeOpacity={0.85}
            >
              <Text style={styles.addCustomBtnText}>+ Inscribe Custom Routine Stone</Text>
            </TouchableOpacity>

            {/* Dincharya River Stones Timeline */}
            <View style={styles.stonesList}>
              {dincharyaItems.map((item) => {
                const isCore = item.tag === 'CORE ANCHOR';
                return (
                  <View
                    key={item.id}
                    style={[styles.stoneCard, isCore && styles.stoneCardCore, !item.enabled && styles.stoneCardDisabled]}
                  >
                    <View style={styles.stoneTop}>
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.stoneTitle, isCore && { color: '#FFB800' }]}>
                          {item.title}
                        </Text>
                        <Text style={styles.stoneSub}>{item.subtitle}</Text>
                        <Text style={[styles.stoneTag, isCore && { color: '#FFB800' }]}>{item.tag}</Text>
                      </View>
                      <View style={styles.stoneRight}>
                        <Text style={[styles.stoneTime, isCore && { color: '#FFB800' }]}>
                          {item.timeDisplay}
                        </Text>
                        {!isCore ? (
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
                            <Switch
                              value={item.enabled}
                              onValueChange={() => handleToggleItem(item.id)}
                              trackColor={{ false: '#222', true: '#FFB800' }}
                              thumbColor="#FFF"
                            />
                            {item.isCustom && (
                              <TouchableOpacity onPress={() => handleRemoveItem(item.id)}>
                                <Text style={{ fontSize: 13, color: '#888' }}>🗑️</Text>
                              </TouchableOpacity>
                            )}
                          </View>
                        ) : (
                          <Text style={styles.stoneFixedPill}>IRON ANCHOR</Text>
                        )}
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* ==================== STEP 4: THE THREE SEALS OF ARMOR & RESONANT DECAY ==================== */}
        {currentStep === 4 && (
          <View>
            <View style={styles.header}>
              <Text style={styles.eyebrow}>ARMOR</Text>
              <Text style={styles.title}>The Three Seals</Text>
              <Text style={styles.subtitle}>
                Mechanical armor. Strike and arm.
              </Text>
            </View>

            {/* Interactive Resonant Decay Test Card */}
            <View style={styles.decayCard}>
              <View style={styles.decayHeader}>
                <Text style={styles.decayTitle}>01 • The Bowl of Silence</Text>
                <Text style={styles.decayDesc}>
                  Harmonic acoustic decay to absolute zero.
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
                    ? '🔔 STRIKE THE BELL (216 HZ)'
                    : decayPhase === 'striking'
                    ? '⚡ STRIKE (216 HZ)...'
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

            {/* Seal 2: The Shield of Focus */}
            <View style={styles.permCard}>
              <View style={styles.permHeader}>
                <View style={styles.permIconBox}>
                  <Text style={styles.permIcon}>🛡️</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.permTitle}>02 • The Shield of Focus</Text>
                  <Text style={styles.permSub}>
                    Authority to silence phone gates
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
                  {notifPermissionGranted ? '✓ ARMED' : 'ARM'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Seal 3: 20 Paces on Earth */}
            <View style={styles.permCard}>
              <View style={styles.permHeader}>
                <View style={styles.permIconBox}>
                  <Text style={styles.permIcon}>🚶</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.permTitle}>03 • 20 Paces on Earth</Text>
                  <Text style={styles.permSub}>
                    Ambulatory motion gate
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
                  {motionPermissionGranted ? '✓ ARMED' : 'ARM'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Seal 4: The Horn of Dawn */}
            <View style={styles.permCard}>
              <View style={styles.permHeader}>
                <View style={styles.permIconBox}>
                  <Text style={styles.permIcon}>🔔</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.permTitle}>04 • The Horn of Dawn</Text>
                  <Text style={styles.permSub}>
                    Monastic high-priority audio
                  </Text>
                </View>
              </View>
              <View style={styles.permStatusPill}>
                <Text style={styles.permStatusText}>✓ ARMED</Text>
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
                    ? 'CROSS THE DIAL OF TRUTH →'
                    : currentStep === 2
                    ? 'INSPECT 24/7 DINCHARYA →'
                    : 'ARM THE THREE SEALS →'}
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.nextBtn, styles.lockInBtn]}
                onPress={handleInscribe}
                activeOpacity={0.85}
                disabled={isLoading}
              >
                <Text style={styles.lockInBtnText}>
                  {isLoading ? 'INSCRIBING COVENANT...' : 'INSCRIBE SOVEREIGN RHYTHM →'}
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
              <Text style={styles.modalTitle}>INSCRIBE CUSTOM ROUTINE STONE</Text>
              <TouchableOpacity onPress={() => setIsAddModalOpen(false)}>
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.inputLabel}>ROUTINE NAME</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. Strength Training, Analog Reading, Family Table"
                placeholderTextColor="#666"
                value={customTitle}
                onChangeText={setCustomTitle}
              />

              <Text style={styles.inputLabel}>SUBTITLE / INTENTION</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. Iron & Mobility • Screen-Free Sanctuary"
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
                <Text style={styles.modalAddBtnText}>INSERT INTO DINCHARYA →</Text>
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
    fontSize: 9,
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

  // Step 1: Multi-Select Leaks
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
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkCircleSelected: {
    borderColor: '#FFB800',
    backgroundColor: '#FFB80022',
  },
  checkMark: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFB800',
  },
  checkMarkSelected: {
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
    borderColor: '#FFB80066',
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

  // Step 2: The Dial of Truth (Current vs Target)
  realityBox: {
    backgroundColor: '#0F120F',
    borderWidth: 1,
    borderColor: '#222822',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
  },
  realityHeader: {
    marginBottom: 12,
  },
  realityTag: {
    fontSize: 9,
    fontWeight: '800',
    color: '#8E958A',
    letterSpacing: 1.5,
    marginBottom: 2,
  },
  realityTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#CCC',
  },
  targetBox: {
    backgroundColor: '#161914',
    borderWidth: 1.5,
    borderColor: '#FFB800',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  targetHeader: {
    marginBottom: 12,
  },
  targetTag: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFB800',
    letterSpacing: 1.5,
    marginBottom: 2,
  },
  targetTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFF',
  },
  clockDuoRow: {
    flexDirection: 'row',
    gap: 12,
  },
  clockHalfCard: {
    flex: 1,
    backgroundColor: '#141814',
    borderWidth: 1,
    borderColor: '#242D24',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  targetClockCard: {
    backgroundColor: '#1A1E16',
    borderColor: '#FFB80055',
  },
  clockMiniTag: {
    fontSize: 8,
    fontWeight: '800',
    color: '#71796D',
    letterSpacing: 1,
    marginBottom: 4,
  },
  clockMiniTime: {
    fontSize: 20,
    fontWeight: '800',
    color: '#E0E2DC',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  microStepperRow: {
    flexDirection: 'row',
    gap: 6,
  },
  microBtn: {
    backgroundColor: '#1C221C',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  targetMicroBtn: {
    backgroundColor: '#26281B',
  },
  microBtnText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#AAA',
  },

  // Delta Bridge (Ledger of Stolen Life)
  ledgerCard: {
    backgroundColor: '#120F0F',
    borderWidth: 1.5,
    borderColor: '#E8454555',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  ledgerHeader: {
    marginBottom: 12,
  },
  ledgerBadge: {
    fontSize: 9,
    fontWeight: '800',
    color: '#E84545',
    letterSpacing: 1.5,
    marginBottom: 2,
  },
  ledgerHeading: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFF',
  },
  ledgerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  ledgerRowTotal: {
    borderTopWidth: 1,
    borderTopColor: '#331B1B',
    marginTop: 6,
    paddingTop: 8,
  },
  ledgerLabel: {
    fontSize: 11,
    color: '#A09898',
  },
  ledgerValue: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFB800',
  },
  ledgerLabelTotal: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFF',
  },
  ledgerValueTotal: {
    fontSize: 12,
    fontWeight: '800',
    color: '#E84545',
  },
  ledgerCallout: {
    backgroundColor: '#1E1212',
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
  },
  ledgerCalloutText: {
    fontSize: 11,
    color: '#E0D0D0',
    lineHeight: 16,
  },

  // Step 3: Dincharya River Stones
  addCustomBtn: {
    backgroundColor: '#161C16',
    borderWidth: 1,
    borderColor: '#2D382D',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    marginBottom: 14,
  },
  addCustomBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#CCCCCC',
  },
  stonesList: {
    gap: 10,
    marginBottom: 16,
  },
  stoneCard: {
    backgroundColor: '#111411',
    borderWidth: 1,
    borderColor: '#202620',
    borderRadius: 14,
    padding: 12,
  },
  stoneCardCore: {
    borderWidth: 1.5,
    borderColor: '#FFB80066',
    backgroundColor: '#161914',
  },
  stoneCardDisabled: {
    opacity: 0.45,
  },
  stoneTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  stoneTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 2,
  },
  stoneSub: {
    fontSize: 10,
    color: '#8E958A',
    marginBottom: 4,
  },
  stoneTag: {
    fontSize: 8,
    fontWeight: '800',
    color: '#71796D',
    letterSpacing: 1,
  },
  stoneRight: {
    alignItems: 'flex-end',
  },
  stoneTime: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFF',
  },
  stoneFixedPill: {
    fontSize: 8,
    fontWeight: '800',
    color: '#FFB800',
    backgroundColor: '#262418',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
    marginTop: 6,
  },

  // Step 4: Hardware as Spirit & Three Seals of Armor
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
