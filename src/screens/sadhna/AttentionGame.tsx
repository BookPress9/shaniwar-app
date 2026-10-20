import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../../theme/colors';
import { TYPOGRAPHY } from '../../theme/typography';

export const AttentionGame = ({ onBack }: { onBack?: () => void }) => {
  const [dotColor, setDotColor] = useState<string>(COLORS.TEXT_MUTED);
  const [isRed, setIsRed] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState('Maintain continuous gaze on the central point.');

  useEffect(() => {
    const interval = setInterval(() => {
      const willTurnRed = Math.random() < 0.35;
      if (willTurnRed) {
        setIsRed(true);
        setDotColor(COLORS.ROUTINE_RED);
      } else {
        setIsRed(false);
        setDotColor(COLORS.TEXT_MUTED);
      }
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  const handleTap = () => {
    if (isRed) {
      const newScore = score + 10;
      const newStreak = streak + 1;
      setScore(newScore);
      setStreak(newStreak);
      setFeedback(`🎯 Perfect Catch! Streak: ${newStreak}`);
      setIsRed(false);
      setDotColor(COLORS.SUCCESS);
    } else {
      setStreak(0);
      setFeedback('⚠️ False Trigger! Mind wandered before the red shift.');
      setDotColor(COLORS.BORDER_SUBTLE);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.tag}>NEURO-ATTENTION GAME</Text>
      </View>

      <Text style={styles.title}>The Dot Protocol</Text>
      <Text style={styles.subtitle}>
        Train sustained vigil. Tap the target ONLY when it shifts from charcoal to crimson.
      </Text>

      {/* Score Header */}
      <View style={styles.scoreRow}>
        <View style={styles.scoreBadge}>
          <Text style={styles.scoreNumber}>{score}</Text>
          <Text style={styles.scoreLabel}>ACCURACY PTS</Text>
        </View>
        <View style={styles.scoreBadge}>
          <Text style={styles.scoreNumber}>{streak}</Text>
          <Text style={styles.scoreLabel}>CURRENT STREAK</Text>
        </View>
      </View>

      {/* Game Visual Arena */}
      <View style={styles.arena}>
        <TouchableOpacity
          style={[styles.dot, { backgroundColor: dotColor }]}
          onPress={handleTap}
          activeOpacity={0.7}
        />
        <Text style={styles.feedbackText}>{feedback}</Text>
      </View>

      {/* Action Footer */}
      <TouchableOpacity style={styles.tapAreaButton} onPress={handleTap} activeOpacity={0.8}>
        <Text style={styles.tapAreaText}>TAP TO CATCH TARGET</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
    padding: 20,
    justifyContent: 'space-between',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  backText: {
    ...TYPOGRAPHY.body,
    color: COLORS.PRIMARY,
  },
  tag: {
    ...TYPOGRAPHY.caption,
    color: COLORS.PRIMARY,
    letterSpacing: 1.5,
  },
  title: {
    ...TYPOGRAPHY.h1,
    color: COLORS.TEXT_PRIMARY,
    marginTop: 14,
  },
  subtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.TEXT_MUTED,
    marginTop: 2,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 14,
  },
  scoreBadge: {
    alignItems: 'center',
    backgroundColor: COLORS.CARD,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.BORDER_SUBTLE,
  },
  scoreNumber: {
    ...TYPOGRAPHY.h2,
    color: COLORS.PRIMARY,
  },
  scoreLabel: {
    ...TYPOGRAPHY.caption,
    fontSize: 10,
    color: COLORS.TEXT_MUTED,
  },
  arena: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginVertical: 20,
  },
  feedbackText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    marginTop: 14,
    minHeight: 30,
  },
  tapAreaButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  tapAreaText: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.BACKGROUND,
    letterSpacing: 1,
  },
});
