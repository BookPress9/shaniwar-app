import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, Easing } from 'react-native';
import { COLORS } from '../../theme/colors';
import { TYPOGRAPHY } from '../../theme/typography';
import { blockScheduler } from '../../features/focus/BlockScheduler';
import { spineJourney } from '../../features/spine/SpineJourney';
import { selfInquiryEngine } from '../../features/manovigyan/SelfInquiryEngine';

export const SovereignCockpit = ({
  onNavigate,
}: {
  onNavigate?: (tab: string, screen?: string, params?: any) => void;
}) => {
  const blocks = blockScheduler.getBlocks();
  const armedBlocksCount = blocks.filter((b) => b.isActive).length;
  const unlockedVertebrae = spineJourney.getUnlockedCount();
  const radar = selfInquiryEngine.getRadarProfile();
  const ledger = selfInquiryEngine.getDeconstructionLedger();
  const shedMasksCount = ledger.filter((i) => i.nature === 'conditioned_armor').length;

  // Finch Avatar & Habitica RPG Stats
  const [monkLevel, setMonkLevel] = useState(4);
  const [monkXP, setMonkXP] = useState(1420);
  const maxXP = 2000;
  const [pranaEnergy, setPranaEnergy] = useState(88); // HP/Vitality bar
  const [activeMood, setActiveMood] = useState<'sovereign' | 'restless' | 'focused' | 'drained'>('focused');

  // Liven Biometric Nervous System Regulation Gauge
  const [vagalTonePercent, setVagalTonePercent] = useState(82); // Ventral Vagal (calm focus)
  const sympatheticPercent = 100 - vagalTonePercent; // Fight/Flight

  // Not Boring Visceral Medals
  const [unlockedMedals, setUnlockedMedals] = useState([
    { id: 'm1', name: 'DAWN CONQUEROR', icon: '⚡', desc: '05:30 Walk Alarm cleared 7x', tier: 'Gold' },
    { id: 'm2', name: 'SUSHUMNA AWAKENING', icon: '🪷', desc: 'First 5 Spine Vertebrae Illuminated', tier: 'Silver' },
    { id: 'm3', name: 'MASK SHEDDER', icon: '🎭', desc: 'Disidentified 4 false personas', tier: 'Bronze' },
  ]);
  const [selectedMedal, setSelectedMedal] = useState<string | null>(null);

  // Intellect Bite-Sized Cognitive Reframe Deck
  const [currentReframeIndex, setCurrentReframeIndex] = useState(0);
  const reframes = [
    {
      distortion: 'Catastrophic Projection',
      trigger: 'When a project deadline is delayed.',
      reframe: 'The mind confuses inconvenience with mortal danger. Breathe into the belly; reality is manageable.',
    },
    {
      distortion: 'Impostor Masking',
      trigger: 'Feeling like you borrowed your success.',
      reframe: 'Competence is not the absence of doubt. It is action taken in communion with doubt.',
    },
    {
      distortion: 'Compulsive Harmonizing',
      trigger: 'Craving immediate consensus in a disagreement.',
      reframe: 'Tension is not your enemy. People-pleasing is your childhood fear dressed up as diplomacy.',
    },
  ];

  // Reflectly Conversational Reflection Prompt
  const [reflectionAnswered, setReflectionAnswered] = useState(false);

  // Pulse animation for the living energy avatar (Finch + Liven DNA)
  const pulseAnim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.07,
          duration: 2200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1.0,
          duration: 2200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseAnim]);

  const handleTuneVagus = () => {
    setVagalTonePercent((prev) => Math.min(98, prev + 6));
    setPranaEnergy((prev) => Math.min(100, prev + 5));
    setMonkXP((prev) => prev + 40);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* 1. CIRCADIAN CLOCK & MONASTERY PRESENCE (Fabulous + Flipd DNA) */}
      <View style={styles.circadianBar}>
        <View style={styles.circadianPill}>
          <Text style={styles.sunIcon}>☀️</Text>
          <View>
            <Text style={styles.circadianLabel}>MIDDAY COMMAND PHASE</Text>
            <Text style={styles.circadianTime}>Solar Focus Peak (12:00 – 16:00)</Text>
          </View>
        </View>

        <View style={styles.presencePill}>
          <View style={styles.pulseDot} />
          <Text style={styles.presenceText}>1,428 Monks Live</Text>
        </View>
      </View>

      {/* 2. FINCH COMPANION AVATAR & HABITICA RPG HUD (Finch + Habitica DNA) */}
      <View style={styles.avatarCard}>
        <View style={styles.avatarTopRow}>
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>LVL {monkLevel} SADHAK</Text>
          </View>
          <Text style={styles.xpText}>XP: {monkXP} / {maxXP}</Text>
        </View>

        {/* XP Progress Bar */}
        <View style={styles.progressBarTrack}>
          <View style={[styles.progressBarFill, { width: `${(monkXP / maxXP) * 100}%` }]} />
        </View>

        {/* Interactive Monk Avatar (Finch Attachment Engine) */}
        <View style={styles.avatarCenter}>
          <Animated.View style={[styles.avatarAura, { transform: [{ scale: pulseAnim }] }]}>
            <Text style={styles.avatarEmoji}>🧘‍♂️</Text>
            <View style={styles.pranaOrbPill}>
              <Text style={styles.pranaOrbText}>PRANA: {pranaEnergy}%</Text>
            </View>
          </Animated.View>
          <Text style={styles.avatarGreeting}>
            "Master, your morning walk was disciplined. The spine is receptive today."
          </Text>
        </View>

        {/* Equipped Spiritual Inventory Items (Habitica DNA) */}
        <View style={styles.inventoryRow}>
          <View style={styles.invItem}>
            <Text style={styles.invEmoji}>📿</Text>
            <Text style={styles.invLabel}>Bodhi Mala</Text>
          </View>
          <View style={styles.invItem}>
            <Text style={styles.invEmoji}>🔔</Text>
            <Text style={styles.invLabel}>Vajra Bell</Text>
          </View>
          <View style={styles.invItem}>
            <Text style={styles.invEmoji}>🪵</Text>
            <Text style={styles.invLabel}>Cedar Mat</Text>
          </View>
          <View style={styles.invItem}>
            <Text style={styles.invEmoji}>🍵</Text>
            <Text style={styles.invLabel}>Ceremonial Tea</Text>
          </View>
        </View>
      </View>

      {/* 3. LIVEN BIOMETRIC NERVOUS SYSTEM METER (Liven DNA) */}
      <View style={styles.livenCard}>
        <View style={styles.livenHeader}>
          <Text style={styles.livenTag}>NERVOUS SYSTEM BIOMETRIC REGULATION (LIVEN DNA)</Text>
          <TouchableOpacity onPress={handleTuneVagus}>
            <Text style={styles.tuneLink}>+ Quick Regulate</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.vagalGaugeContainer}>
          <View style={styles.vagalLabelRow}>
            <Text style={styles.vagalToneText}>
              🟢 Ventral Vagal (Rest & Focus): <Text style={styles.boldWhite}>{vagalTonePercent}%</Text>
            </Text>
            <Text style={styles.sympatheticText}>
              🔴 Sympathetic (Stress): <Text style={styles.boldWhite}>{sympatheticPercent}%</Text>
            </Text>
          </View>

          <View style={styles.dualGaugeTrack}>
            <View style={[styles.gaugeVagal, { width: `${vagalTonePercent}%` }]} />
            <View style={[styles.gaugeSympathetic, { width: `${sympatheticPercent}%` }]} />
          </View>
          <Text style={styles.gaugeAnnotation}>
            HRV Resonance is optimal. Heart-rate variability entrained with 0.1Hz coherence cadence.
          </Text>
        </View>
      </View>

      {/* 4. THE TRINITY SYNERGY METRICS */}
      <Text style={styles.sectionHeader}>TRINITY STATUS GAUGES</Text>
      <View style={styles.trinityRow}>
        <TouchableOpacity
          style={[styles.trinityCard, { borderColor: COLORS.ROUTINE_RED }]}
          onPress={() => onNavigate?.('ROUTINE')}
          activeOpacity={0.8}
        >
          <Text style={styles.trinityIcon}>🔥</Text>
          <Text style={styles.trinityName}>ROUTINE</Text>
          <Text style={[styles.trinityMetric, { color: COLORS.ROUTINE_RED }]}>
            {armedBlocksCount}/{blocks.length}
          </Text>
          <Text style={styles.trinityStatus}>Blocks Guarded</Text>
          <View style={styles.miniPill}>
            <Text style={[styles.miniPillText, { color: COLORS.ROUTINE_RED }]}>ARMED ✓</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.trinityCard, { borderColor: COLORS.SADHNA_VIOLET }]}
          onPress={() => onNavigate?.('SADHNA')}
          activeOpacity={0.8}
        >
          <Text style={styles.trinityIcon}>🪷</Text>
          <Text style={styles.trinityName}>SADHNA</Text>
          <Text style={[styles.trinityMetric, { color: COLORS.SADHNA_VIOLET }]}>
            {unlockedVertebrae}/33
          </Text>
          <Text style={styles.trinityStatus}>Spine Stations</Text>
          <View style={styles.miniPill}>
            <Text style={[styles.miniPillText, { color: COLORS.SADHNA_VIOLET }]}>94% MATCH</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.trinityCard, { borderColor: COLORS.MANOVIGYAN_CYAN }]}
          onPress={() => onNavigate?.('MANOVIGYAN')}
          activeOpacity={0.8}
        >
          <Text style={styles.trinityIcon}>👁️</Text>
          <Text style={styles.trinityName}>MANOVI.</Text>
          <Text style={[styles.trinityMetric, { color: COLORS.MANOVIGYAN_CYAN }]}>
            {radar.authenticity}%
          </Text>
          <Text style={styles.trinityStatus}>Authentic Core</Text>
          <View style={styles.miniPill}>
            <Text style={[styles.miniPillText, { color: COLORS.MANOVIGYAN_CYAN }]}>{shedMasksCount} SHED</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* 5. HEADSPACE LINEAR PROGRESSION TREE (Headspace DNA) */}
      <View style={styles.roadmapCard}>
        <View style={styles.roadmapHeader}>
          <Text style={styles.roadmapTag}>LINEAR JOURNEY TREE (HEADSPACE DNA)</Text>
          <Text style={styles.roadmapChapter}>Chapter I: The Root Axis</Text>
        </View>

        {/* Winding Visual Path */}
        <View style={styles.pathTree}>
          <View style={styles.nodeWrapper}>
            <View style={[styles.nodeCircle, styles.nodePassed]}>
              <Text style={styles.nodeEmoji}>✓</Text>
            </View>
            <Text style={styles.nodeLabel}>V1: Witness</Text>
          </View>

          <View style={styles.pathConnectorPassed} />

          <View style={styles.nodeWrapper}>
            <View style={[styles.nodeCircle, styles.nodeActive]}>
              <Text style={styles.nodeEmoji}>⚡</Text>
            </View>
            <Text style={[styles.nodeLabel, { color: COLORS.PRIMARY, fontWeight: '700' }]}>
              V2: Box (Current)
            </Text>
          </View>

          <View style={styles.pathConnectorLocked} />

          <View style={styles.nodeWrapper}>
            <View style={[styles.nodeCircle, styles.nodeLocked]}>
              <Text style={styles.nodeEmoji}>🔒</Text>
            </View>
            <Text style={styles.nodeLabel}>V3: Anchor</Text>
          </View>

          <View style={styles.pathConnectorLocked} />

          <View style={styles.nodeWrapper}>
            <View style={[styles.nodeCircle, styles.nodeGatekeeper]}>
              <Text style={styles.nodeEmoji}>👑</Text>
            </View>
            <Text style={styles.nodeLabel}>V11: Gate</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.pathLaunchButton}
          onPress={() => onNavigate?.('SADHNA', 'SpineJourney')}
          activeOpacity={0.8}
        >
          <Text style={styles.pathLaunchText}>CONTINUE SPINAL ASCENSION →</Text>
        </TouchableOpacity>
      </View>

      {/* 6. NOT BORING HABITS VISCERAL MEDALS (Not Boring DNA) */}
      <View style={styles.medalsCard}>
        <Text style={styles.medalsTag}>VISCERAL TACTILE MEDALS (NOT BORING DNA)</Text>
        <Text style={styles.medalsSub}>Heavyweight achievements forged through physical proof</Text>

        <View style={styles.medalsGrid}>
          {unlockedMedals.map((m) => (
            <TouchableOpacity
              key={m.id}
              style={[styles.medalItem, selectedMedal === m.id && styles.medalItemSelected]}
              onPress={() => setSelectedMedal(selectedMedal === m.id ? null : m.id)}
              activeOpacity={0.8}
            >
              <Text style={styles.medalIcon}>{m.icon}</Text>
              <Text style={styles.medalName}>{m.name}</Text>
              <Text style={styles.medalTier}>{m.tier}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {selectedMedal && (
          <View style={styles.medalDetail}>
            <Text style={styles.medalDetailTitle}>
              {unlockedMedals.find((m) => m.id === selectedMedal)?.name}
            </Text>
            <Text style={styles.medalDetailDesc}>
              {unlockedMedals.find((m) => m.id === selectedMedal)?.desc}
            </Text>
          </View>
        )}
      </View>

      {/* 7. INTELLECT BITE-SIZED COGNITIVE REFRAME DECK (Intellect DNA) */}
      <View style={styles.reframeCard}>
        <View style={styles.reframeTop}>
          <Text style={styles.reframeTag}>3-MIN COGNITIVE REFRAME (INTELLECT DNA)</Text>
          <TouchableOpacity
            onPress={() => setCurrentReframeIndex((prev) => (prev + 1) % reframes.length)}
          >
            <Text style={styles.nextReframe}>Shuffle Reframe ↻</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.distortionTitle}>
          Distortion: <Text style={styles.boldPrimary}>{reframes[currentReframeIndex].distortion}</Text>
        </Text>
        <Text style={styles.triggerText}>Trigger: {reframes[currentReframeIndex].trigger}</Text>
        <View style={styles.reframeBox}>
          <Text style={styles.reframeText}>
            💡 {reframes[currentReframeIndex].reframe}
          </Text>
        </View>
      </View>

      {/* 8. REFLECTLY CONVERSATIONAL MIRROR (Reflectly DNA) */}
      <View style={styles.reflectlyCard}>
        <Text style={styles.reflectlyTag}>CONVERSATIONAL SMART MIRROR (REFLECTLY DNA)</Text>
        <Text style={styles.reflectlyPrompt}>
          "What is currently demanding your mental RAM right now?"
        </Text>

        {/* 5 Expressive Visceral Mood Touchpoints */}
        <View style={styles.moodRow}>
          {[
            { id: 'sovereign', emoji: '👑', label: 'Sovereign' },
            { id: 'focused', emoji: '🎯', label: 'Focused' },
            { id: 'restless', emoji: '🌪️', label: 'Restless' },
            { id: 'drained', emoji: '🪫', label: 'Drained' },
          ].map((m) => (
            <TouchableOpacity
              key={m.id}
              style={[styles.moodBtn, activeMood === m.id && styles.moodBtnActive]}
              onPress={() => {
                setActiveMood(m.id as any);
                setReflectionAnswered(true);
              }}
            >
              <Text style={styles.moodEmoji}>{m.emoji}</Text>
              <Text style={styles.moodLabel}>{m.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {reflectionAnswered && (
          <View style={styles.reflectlyResponse}>
            <Text style={styles.reflectlyResponseText}>
              🤖 AI Mirror: "You marked <Text style={styles.boldWhite}>{activeMood.toUpperCase()}</Text>. Notice where this sensation lives physically in the body — does your chest tighten or your shoulders elevate? Let the breath dissolve the grip."
            </Text>
          </View>
        )}
      </View>

      {/* 9. FOREST 30-DAY LIVING GROVE (Forest DNA) */}
      <View style={styles.groveCard}>
        <View style={styles.groveHeader}>
          <Text style={styles.groveTag}>30-DAY LIVING MONK GROVE (FOREST DNA)</Text>
          <Text style={styles.groveScore}>28 / 30 Cedars</Text>
        </View>
        <Text style={styles.groveSub}>
          Visualized discipline: Every completed focus block plants a permanent Cedar.
        </Text>

        <View style={styles.groveGrid}>
          {['🌲','🌲','🌲','🪵','🌲','🌲','🌲','🌲','🌲','🥀','🌲','🌲','🌲','🌲','🌲','🌲','🌲','🌲','🌲','🌲','🌲','🌲','🌲','🌲','🌲','🌲','🌲','🌲','🌲','✨'].map((emoji, idx) => (
            <View key={idx} style={styles.groveItem}>
              <Text style={styles.groveEmoji}>{emoji}</Text>
            </View>
          ))}
        </View>
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
    paddingBottom: 50,
  },
  circadianBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  circadianPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.CARD,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.BORDER_SUBTLE,
  },
  sunIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  circadianLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.PRIMARY,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1,
  },
  circadianTime: {
    ...TYPOGRAPHY.caption,
    fontSize: 10,
    color: COLORS.TEXT_MUTED,
  },
  presencePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(57, 217, 138, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(57, 217, 138, 0.3)',
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.SUCCESS,
    marginRight: 6,
  },
  presenceText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.SUCCESS,
    fontWeight: '700',
  },
  avatarCard: {
    backgroundColor: COLORS.CARD,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.PRIMARY,
    marginBottom: 20,
  },
  avatarTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  levelBadge: {
    backgroundColor: 'rgba(201, 146, 42, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  levelText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.PRIMARY,
    fontWeight: '700',
    letterSpacing: 1,
  },
  xpText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.TEXT_MUTED,
  },
  progressBarTrack: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 16,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.PRIMARY,
  },
  avatarCenter: {
    alignItems: 'center',
    marginVertical: 6,
  },
  avatarAura: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(201, 146, 42, 0.1)',
    borderWidth: 2,
    borderColor: COLORS.PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: {
    fontSize: 54,
  },
  pranaOrbPill: {
    position: 'absolute',
    bottom: -10,
    backgroundColor: COLORS.BACKGROUND,
    borderWidth: 1,
    borderColor: COLORS.PRIMARY,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  pranaOrbText: {
    ...TYPOGRAPHY.caption,
    fontSize: 9,
    color: COLORS.PRIMARY,
    fontWeight: '700',
  },
  avatarGreeting: {
    ...TYPOGRAPHY.caption,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 18,
    lineHeight: 18,
  },
  inventoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 18,
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER_SUBTLE,
    paddingTop: 12,
  },
  invItem: {
    alignItems: 'center',
  },
  invEmoji: {
    fontSize: 20,
    marginBottom: 2,
  },
  invLabel: {
    ...TYPOGRAPHY.caption,
    fontSize: 9,
    color: COLORS.TEXT_MUTED,
  },
  livenCard: {
    backgroundColor: COLORS.CARD,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.SUCCESS,
    marginBottom: 20,
  },
  livenHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  livenTag: {
    ...TYPOGRAPHY.caption,
    fontSize: 10,
    color: COLORS.SUCCESS,
    letterSpacing: 1,
    fontWeight: '700',
  },
  tuneLink: {
    ...TYPOGRAPHY.caption,
    color: COLORS.PRIMARY,
    fontWeight: '700',
  },
  vagalGaugeContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 12,
    padding: 12,
  },
  vagalLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  vagalToneText: {
    ...TYPOGRAPHY.caption,
    fontSize: 10,
    color: COLORS.SUCCESS,
  },
  sympatheticText: {
    ...TYPOGRAPHY.caption,
    fontSize: 10,
    color: COLORS.ROUTINE_RED,
  },
  boldWhite: {
    color: COLORS.TEXT_PRIMARY,
    fontWeight: '700',
  },
  dualGaugeTrack: {
    height: 12,
    flexDirection: 'row',
    borderRadius: 6,
    overflow: 'hidden',
    backgroundColor: '#333',
  },
  gaugeVagal: {
    backgroundColor: COLORS.SUCCESS,
    height: '100%',
  },
  gaugeSympathetic: {
    backgroundColor: COLORS.ROUTINE_RED,
    height: '100%',
  },
  gaugeAnnotation: {
    ...TYPOGRAPHY.caption,
    color: COLORS.TEXT_MUTED,
    fontSize: 10,
    marginTop: 8,
    fontStyle: 'italic',
  },
  sectionHeader: {
    ...TYPOGRAPHY.caption,
    color: COLORS.TEXT_MUTED,
    letterSpacing: 1.5,
    marginBottom: 10,
  },
  trinityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  trinityCard: {
    width: '31%',
    backgroundColor: COLORS.CARD,
    borderRadius: 14,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
  },
  trinityIcon: {
    fontSize: 22,
    marginBottom: 4,
  },
  trinityName: {
    ...TYPOGRAPHY.caption,
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
  },
  trinityMetric: {
    ...TYPOGRAPHY.h3,
    fontSize: 15,
    marginVertical: 2,
  },
  trinityStatus: {
    ...TYPOGRAPHY.caption,
    fontSize: 9,
    color: COLORS.TEXT_MUTED,
    textAlign: 'center',
  },
  miniPill: {
    marginTop: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
  },
  miniPillText: {
    ...TYPOGRAPHY.caption,
    fontSize: 8,
    fontWeight: '700',
  },
  roadmapCard: {
    backgroundColor: COLORS.CARD,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.SADHNA_VIOLET,
    marginBottom: 20,
  },
  roadmapHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  roadmapTag: {
    ...TYPOGRAPHY.caption,
    fontSize: 10,
    color: COLORS.SADHNA_VIOLET,
    letterSpacing: 1,
    fontWeight: '700',
  },
  roadmapChapter: {
    ...TYPOGRAPHY.caption,
    color: COLORS.TEXT_MUTED,
    fontSize: 10,
  },
  pathTree: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  nodeWrapper: {
    alignItems: 'center',
  },
  nodeCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  nodePassed: {
    backgroundColor: COLORS.SUCCESS,
  },
  nodeActive: {
    backgroundColor: COLORS.PRIMARY,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  nodeLocked: {
    backgroundColor: '#282828',
  },
  nodeGatekeeper: {
    backgroundColor: COLORS.SADHNA_VIOLET,
  },
  nodeEmoji: {
    fontSize: 16,
    color: COLORS.TEXT_PRIMARY,
  },
  nodeLabel: {
    ...TYPOGRAPHY.caption,
    fontSize: 9,
    color: COLORS.TEXT_MUTED,
  },
  pathConnectorPassed: {
    flex: 1,
    height: 3,
    backgroundColor: COLORS.SUCCESS,
    marginBottom: 16,
  },
  pathConnectorLocked: {
    flex: 1,
    height: 3,
    backgroundColor: '#333',
    marginBottom: 16,
  },
  pathLaunchButton: {
    backgroundColor: COLORS.SADHNA_VIOLET,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  pathLaunchText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.TEXT_PRIMARY,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  medalsCard: {
    backgroundColor: COLORS.CARD,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.BORDER_SUBTLE,
    marginBottom: 20,
  },
  medalsTag: {
    ...TYPOGRAPHY.caption,
    fontSize: 10,
    color: COLORS.PRIMARY,
    letterSpacing: 1,
    fontWeight: '700',
    marginBottom: 2,
  },
  medalsSub: {
    ...TYPOGRAPHY.caption,
    color: COLORS.TEXT_MUTED,
    marginBottom: 12,
  },
  medalsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  medalItem: {
    width: '31%',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.BORDER_SUBTLE,
  },
  medalItemSelected: {
    borderColor: COLORS.PRIMARY,
    backgroundColor: 'rgba(201, 146, 42, 0.1)',
  },
  medalIcon: {
    fontSize: 26,
    marginBottom: 4,
  },
  medalName: {
    ...TYPOGRAPHY.caption,
    fontSize: 8,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
    textAlign: 'center',
  },
  medalTier: {
    ...TYPOGRAPHY.caption,
    fontSize: 8,
    color: COLORS.PRIMARY,
    marginTop: 2,
  },
  medalDetail: {
    marginTop: 12,
    padding: 10,
    backgroundColor: 'rgba(201, 146, 42, 0.08)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(201, 146, 42, 0.3)',
  },
  medalDetailTitle: {
    ...TYPOGRAPHY.caption,
    color: COLORS.PRIMARY,
    fontWeight: '700',
  },
  medalDetailDesc: {
    ...TYPOGRAPHY.caption,
    color: COLORS.TEXT_SECONDARY,
    marginTop: 2,
  },
  reframeCard: {
    backgroundColor: COLORS.CARD,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.MANOVIGYAN_CYAN,
    marginBottom: 20,
  },
  reframeTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reframeTag: {
    ...TYPOGRAPHY.caption,
    fontSize: 10,
    color: COLORS.MANOVIGYAN_CYAN,
    letterSpacing: 1,
    fontWeight: '700',
  },
  nextReframe: {
    ...TYPOGRAPHY.caption,
    color: COLORS.MANOVIGYAN_CYAN,
    fontWeight: '700',
  },
  distortionTitle: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.TEXT_PRIMARY,
  },
  boldPrimary: {
    color: COLORS.PRIMARY,
  },
  triggerText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.TEXT_MUTED,
    marginVertical: 4,
  },
  reframeBox: {
    backgroundColor: 'rgba(0, 210, 211, 0.08)',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 210, 211, 0.25)',
    marginTop: 8,
  },
  reframeText: {
    ...TYPOGRAPHY.body,
    fontSize: 13,
    color: COLORS.TEXT_PRIMARY,
    lineHeight: 18,
  },
  reflectlyCard: {
    backgroundColor: COLORS.CARD,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.BORDER_SUBTLE,
    marginBottom: 20,
  },
  reflectlyTag: {
    ...TYPOGRAPHY.caption,
    fontSize: 10,
    color: COLORS.PRIMARY,
    letterSpacing: 1,
    fontWeight: '700',
    marginBottom: 6,
  },
  reflectlyPrompt: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 12,
  },
  moodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  moodBtn: {
    width: '23%',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.BORDER_SUBTLE,
  },
  moodBtnActive: {
    borderColor: COLORS.PRIMARY,
    backgroundColor: 'rgba(201, 146, 42, 0.15)',
  },
  moodEmoji: {
    fontSize: 22,
    marginBottom: 2,
  },
  moodLabel: {
    ...TYPOGRAPHY.caption,
    fontSize: 9,
    color: COLORS.TEXT_MUTED,
  },
  reflectlyResponse: {
    marginTop: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.BORDER_SUBTLE,
  },
  reflectlyResponseText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: 18,
  },
  groveCard: {
    backgroundColor: COLORS.CARD,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.BORDER_SUBTLE,
  },
  groveHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  groveTag: {
    ...TYPOGRAPHY.caption,
    fontSize: 10,
    color: COLORS.PRIMARY,
    letterSpacing: 1,
    fontWeight: '700',
  },
  groveScore: {
    ...TYPOGRAPHY.caption,
    color: COLORS.SUCCESS,
    fontWeight: '700',
  },
  groveSub: {
    ...TYPOGRAPHY.caption,
    color: COLORS.TEXT_MUTED,
    marginBottom: 12,
  },
  groveGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 12,
    padding: 10,
  },
  groveItem: {
    width: '10%',
    alignItems: 'center',
    paddingVertical: 4,
  },
  groveEmoji: {
    fontSize: 16,
  },
});
