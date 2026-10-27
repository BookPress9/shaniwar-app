import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../../theme/colors';
import { TYPOGRAPHY } from '../../theme/typography';

const { width } = Dimensions.get('window');
const ONBOARDING_DONE_KEY = '@hybrid_monk_onboarded_v1';

interface OnboardingScreenProps {
  onComplete: () => void;
}

type Step = 0 | 1 | 2 | 3;

const STEPS = [
  {
    id: 0,
    label: 'STOP.',
    headline: 'Most apps want your attention.',
    body: 'This one trains it.',
    sub: 'Shaniwar by The Hybrid Monk is a daily discipline engine.\nRooted in Dincharya: wake awake, protect focus, stay anchored.',
    cta: 'Continue',
  },
  {
    id: 1,
    label: 'DINCHARYA',
    headline: 'The Sovereign Arc of your Day.',
    body: 'A wake alarm that requires you to move.\nProtection windows that guard your presence.\nConsciousness injected directly into your rhythm.',
    sub: 'Ancient monks left the world. We are modern monks—mastering the world while staying anchored.',
    cta: 'Continue',
  },
  {
    id: 2,
    label: 'SADHNA',
    headline: 'Ascend the 33 vertebrae.',
    body: 'Ancient breath practices. Genuine attention training.\nNo scores. No streaks. Just the practice.',
    sub: 'Each session is its own complete thing.',
    cta: 'Continue',
  },
  {
    id: 3,
    label: 'MANOVIGYAN',
    headline: 'Know what you are not.',
    body: 'Self-inquiry, not self-help.\nNotice the patterns. Name the drift.',
    sub: 'The mirror shows nothing it did not find in you.',
    cta: 'Enter the monastery',
  },
];

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const [step, setStep] = useState<Step>(0);
  const [sankalp, setSankalp] = useState('');
  const [showSankalp, setShowSankalp] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  const transitionTo = (nextStep: number) => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 0, duration: 180, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: -30, duration: 180, useNativeDriver: true }),
    ]).start(() => {
      setStep(nextStep as Step);
      slideAnim.setValue(30);
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 240, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 240, useNativeDriver: true }),
      ]).start();
    });
  };

  const handleContinue = () => {
    if (step < 3) {
      transitionTo(step + 1);
    } else if (!showSankalp) {
      // On last step: offer optional Sankalp before entering
      setShowSankalp(true);
    } else {
      handleFinish();
    }
  };

  const handleFinish = async () => {
    try {
      if (sankalp.trim()) {
        await AsyncStorage.setItem('@hybrid_monk_sankalp', sankalp.trim().slice(0, 120));
      }
      await AsyncStorage.setItem(ONBOARDING_DONE_KEY, 'true');
    } catch {
      // Non-blocking
    }
    onComplete();
  };

  const current = STEPS[step];
  const progress = (step + 1) / STEPS.length;

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Progress bar */}
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      </View>

      <Animated.View
        style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
      >
        {/* Step label */}
        <Text style={[styles.stepLabel, { color: stepColor(step) }]}>{current.label}</Text>

        {/* Headline */}
        <Text style={styles.headline}>{current.headline}</Text>

        {/* Body */}
        <Text style={styles.body}>{current.body}</Text>

        {/* Sub */}
        <Text style={styles.sub}>{current.sub}</Text>

        {/* Sankalp input — last step only */}
        {showSankalp && step === 3 && (
          <View style={styles.sankalpContainer}>
            <Text style={styles.sankalpLabel}>Where do you want to reach?</Text>
            <Text style={styles.sankalpHint}>One line. Your words. Stays on this device.</Text>
            <TextInput
              style={styles.sankalpInput}
              value={sankalp}
              onChangeText={(t) => setSankalp(t.slice(0, 120))}
              placeholder="your intention..."
              placeholderTextColor={COLORS.TEXT_MUTED}
              maxLength={120}
              returnKeyType="done"
              onSubmitEditing={handleFinish}
              autoFocus
            />
            <TouchableOpacity onPress={handleFinish} style={styles.skipSankalp}>
              <Text style={styles.skipLabel}>Skip, just enter</Text>
            </TouchableOpacity>
          </View>
        )}
      </Animated.View>

      {/* CTA */}
      {!showSankalp && (
        <TouchableOpacity style={styles.cta} onPress={handleContinue} activeOpacity={0.85}>
          <Text style={styles.ctaText}>{current.cta}</Text>
        </TouchableOpacity>
      )}

      {showSankalp && !step && null}

      {showSankalp && (
        <TouchableOpacity style={styles.cta} onPress={handleFinish} activeOpacity={0.85}>
          <Text style={styles.ctaText}>Enter the monastery</Text>
        </TouchableOpacity>
      )}

      {/* Step dots */}
      <View style={styles.dots}>
        {STEPS.map((_, i) => (
          <View
            key={i}
            style={[styles.dot, i === step && { backgroundColor: stepColor(step), width: 20 }]}
          />
        ))}
      </View>
    </KeyboardAvoidingView>
  );
};

function stepColor(step: Step): string {
  switch (step) {
    case 0: return COLORS.PRIMARY;
    case 1: return COLORS.ROUTINE_RED;
    case 2: return COLORS.SADHNA_VIOLET;
    case 3: return COLORS.MANOVIGYAN_CYAN;
    default: return COLORS.PRIMARY;
  }
}

export async function hasCompletedOnboarding(): Promise<boolean> {
  try {
    const v = await AsyncStorage.getItem(ONBOARDING_DONE_KEY);
    return v === 'true';
  } catch {
    return false;
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
    paddingHorizontal: 28,
    paddingTop: 60,
    paddingBottom: 40,
    justifyContent: 'space-between',
  },
  progressTrack: {
    height: 2,
    backgroundColor: COLORS.BORDER_SUBTLE,
    borderRadius: 1,
    marginBottom: 48,
  },
  progressFill: {
    height: 2,
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  stepLabel: {
    ...TYPOGRAPHY.caption,
    letterSpacing: 3,
    fontSize: 11,
    marginBottom: 20,
  },
  headline: {
    ...TYPOGRAPHY.h1,
    color: COLORS.TEXT_PRIMARY,
    fontSize: 28,
    lineHeight: 36,
    marginBottom: 20,
  },
  body: {
    ...TYPOGRAPHY.body,
    color: COLORS.TEXT_SECONDARY,
    fontSize: 16,
    lineHeight: 26,
    marginBottom: 24,
  },
  sub: {
    ...TYPOGRAPHY.body,
    color: COLORS.TEXT_MUTED,
    fontSize: 13,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  sankalpContainer: {
    marginTop: 36,
  },
  sankalpLabel: {
    ...TYPOGRAPHY.h3,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 6,
  },
  sankalpHint: {
    ...TYPOGRAPHY.caption,
    color: COLORS.TEXT_MUTED,
    marginBottom: 14,
  },
  sankalpInput: {
    backgroundColor: COLORS.CARD,
    borderWidth: 1,
    borderColor: COLORS.BORDER_SUBTLE,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: COLORS.TEXT_PRIMARY,
    fontSize: 15,
    marginBottom: 12,
  },
  skipSankalp: {
    alignSelf: 'flex-start',
  },
  skipLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.TEXT_MUTED,
    textDecorationLine: 'underline',
  },
  cta: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 32,
  },
  ctaText: {
    ...TYPOGRAPHY.h3,
    color: '#0D0D0D',
    fontSize: 15,
    letterSpacing: 0.5,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginTop: 20,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.BORDER_SUBTLE,
  },
});
