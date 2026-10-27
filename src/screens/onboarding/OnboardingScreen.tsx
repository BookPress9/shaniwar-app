import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../../theme/colors';
import { TYPOGRAPHY } from '../../theme/typography';
import { HapticService } from '../../services/haptics';
import {
  routineService,
  DincharyaArchetype,
  ARCHETYPES,
} from '../../services/routineService';
import { syncOutbox } from '../../services/syncOutbox';
import { isSupabaseConfigured, supabase } from '../../services/supabase';

const ONBOARDING_DONE_KEY = '@hybrid_monk_onboarded_v1';

interface Props {
  onComplete: () => void;
}

export const hasCompletedOnboarding = async (): Promise<boolean> => {
  try {
    const val = await AsyncStorage.getItem(ONBOARDING_DONE_KEY);
    return val === 'true';
  } catch {
    return false;
  }
};

export const OnboardingScreen: React.FC<Props> = ({ onComplete }) => {
  const [selectedArch, setSelectedArch] = useState<DincharyaArchetype>('builder');
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectArchetype = (arch: DincharyaArchetype) => {
    HapticService.selection();
    setSelectedArch(arch);
  };

  const handleLockIn = async () => {
    setIsLoading(true);
    HapticService.heavyImpact();

    try {
      // 1. Calibrate and persist the selected archetype routine
      await routineService.applyArchetype(selectedArch);

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
      console.warn('[Onboarding] Error applying archetype:', e);
    } finally {
      setIsLoading(false);
      onComplete();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#070807" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Header */}
        <View style={styles.header}>
          <Text style={styles.eyebrow}>THE SOVEREIGN RETURN</Text>
          <Text style={styles.title}>The world is loud.</Text>
          <Text style={styles.titleEm}>Be here.</Text>
          <Text style={styles.subtitle}>
            Ancient monks left the world behind to find themselves. We are the modern monks—living in
            the world, mastering the world, staying anchored.
          </Text>
        </View>

        {/* Archetype Selection Section */}
        <View style={styles.archetypeSection}>
          <Text style={styles.sectionLabel}>SELECT YOUR DAILY ARCHETYPE</Text>

          <View style={styles.archetypeGrid}>
            {ARCHETYPES.map((arch) => {
              const isSelected = selectedArch === arch.id;
              const defaultWakeTime =
                arch.id === 'builder'
                  ? '05:45 AM'
                  : arch.id === 'student'
                  ? '06:30 AM'
                  : arch.id === 'parent'
                  ? '06:00 AM'
                  : '06:45 AM';

              return (
                <TouchableOpacity
                  key={arch.id}
                  style={[
                    styles.archCard,
                    isSelected && styles.archCardSelected,
                  ]}
                  onPress={() => handleSelectArchetype(arch.id)}
                  activeOpacity={0.85}
                >
                  <View style={styles.archIconContainer}>
                    <Text style={styles.archIcon}>{arch.icon}</Text>
                  </View>
                  <View style={styles.archContent}>
                    <View style={styles.archTopRow}>
                      <Text
                        style={[
                          styles.archName,
                          isSelected && styles.archNameSelected,
                        ]}
                      >
                        {arch.name}
                      </Text>
                      <Text
                        style={[
                          styles.archTime,
                          isSelected && styles.archTimeSelected,
                        ]}
                      >
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

        {/* Bottom CTA */}
        <View style={styles.bottomSection}>
          <TouchableOpacity
            style={styles.lockInBtn}
            onPress={handleLockIn}
            activeOpacity={0.85}
            disabled={isLoading}
          >
            <Text style={styles.lockInBtnText}>
              {isLoading ? 'CALIBRATING ARC...' : 'LOCK IN SOVEREIGN DINCHARYA →'}
            </Text>
          </TouchableOpacity>
          <Text style={styles.footnote}>
            No account required. Fully local-first, privacy-guaranteed & offline ready.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#070807',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
    justifyContent: 'space-between',
    minHeight: '100%',
  },
  header: {
    marginBottom: 24,
  },
  eyebrow: {
    ...TYPOGRAPHY.caption,
    color: '#FFB800',
    letterSpacing: 2.5,
    fontSize: 10,
    fontWeight: '800',
    marginBottom: 8,
  },
  title: {
    fontSize: 34,
    fontWeight: '300',
    color: '#F4F4EC',
    lineHeight: 40,
  },
  titleEm: {
    fontSize: 34,
    fontWeight: '700',
    color: '#FFB800',
    lineHeight: 42,
    marginBottom: 12,
  },
  subtitle: {
    ...TYPOGRAPHY.body,
    fontSize: 13,
    lineHeight: 20,
    color: '#9CA395',
  },
  archetypeSection: {
    marginBottom: 28,
  },
  sectionLabel: {
    ...TYPOGRAPHY.caption,
    fontSize: 10,
    fontWeight: '800',
    color: '#B49860',
    letterSpacing: 1.5,
    marginBottom: 14,
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
    shadowColor: '#FFB800',
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 3,
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
  bottomSection: {
    paddingTop: 12,
  },
  lockInBtn: {
    backgroundColor: '#FFB800',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FFB800',
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 5,
  },
  lockInBtnText: {
    ...TYPOGRAPHY.body,
    color: '#070807',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  footnote: {
    ...TYPOGRAPHY.caption,
    color: '#555C50',
    fontSize: 10,
    textAlign: 'center',
    marginTop: 10,
  },
});
