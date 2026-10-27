import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Animated,
  ScrollView,
} from 'react-native';
import { COLORS } from '../../theme/colors';
import { TYPOGRAPHY } from '../../theme/typography';
import {
  naamJapaService,
  NaamJapaConfig,
  PRESET_NAAMS,
} from '../../services/naamJapaService';
import { HapticService } from '../../services/haptics';

interface Props {
  visible: boolean;
  onClose: () => void;
  onUpdated: () => void;
}

export const NaamJapaModal = ({ visible, onClose, onUpdated }: Props) => {
  const [config, setConfig] = useState<NaamJapaConfig>({
    naam: 'OM NAMAH SHIVAYA',
    japaCount: 0,
    totalMalaRounds: 0,
    isPulseEnabled: true,
    selectedVisual: 'golden_flame',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [customNaam, setCustomNaam] = useState('');

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      naamJapaService.getConfig().then((cfg) => {
        setConfig(cfg);
        setCustomNaam(cfg.naam);
      });

      // Sacred rhythmic breathing animation (4-sec expansion & contraction)
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.18,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1.0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Slow sacred rotation
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 24000,
          useNativeDriver: true,
        })
      ).start();
    }
  }, [visible]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const handleChant = async () => {
    const { count, completedMala } = await naamJapaService.incrementJapa();
    setConfig((prev) => ({
      ...prev,
      japaCount: count,
      totalMalaRounds: completedMala ? prev.totalMalaRounds + 1 : prev.totalMalaRounds,
    }));
  };

  const handleSaveCustomNaam = async () => {
    if (customNaam.trim()) {
      HapticService.heavyImpact();
      const updated = await naamJapaService.setNaam(customNaam);
      setConfig(updated);
      setIsEditing(false);
      onUpdated();
    }
  };

  const handleSelectPreset = async (presetName: string) => {
    HapticService.selection();
    setCustomNaam(presetName);
    const updated = await naamJapaService.setNaam(presetName);
    setConfig(updated);
    setIsEditing(false);
    onUpdated();
  };

  const currentDevanagari =
    PRESET_NAAMS.find((p) => p.name === config.naam)?.devanagari || config.naam;

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.overlay}>
        {/* Top Controls */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeText}>✕ Close</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              HapticService.lightImpact();
              setIsEditing(!isEditing);
            }}
            style={styles.editBtn}
          >
            <Text style={styles.editText}>{isEditing ? 'Done' : '✏️ Change Naam'}</Text>
          </TouchableOpacity>
        </View>

        {isEditing ? (
          <ScrollView contentContainerStyle={styles.editContainer}>
            <Text style={styles.editTitle}>ENTER YOUR SACRED NAAM</Text>
            <Text style={styles.editSub}>
              Whatever you believe in. This is the anchor that pulls you out of unconscious drift.
            </Text>

            <TextInput
              style={styles.input}
              value={customNaam}
              onChangeText={setCustomNaam}
              placeholder="e.g. RAM, WAHEGURU, ALLAH, JESUS, SO HUM"
              placeholderTextColor="#666"
              autoCapitalize="characters"
            />

            <TouchableOpacity style={styles.saveNaamBtn} onPress={handleSaveCustomNaam}>
              <Text style={styles.saveNaamText}>SET AS SACRED ANCHOR ✨</Text>
            </TouchableOpacity>

            <Text style={styles.presetHeading}>OR CHOOSE A UNIVERSAL PRESET:</Text>
            <View style={styles.presetGrid}>
              {PRESET_NAAMS.map((p) => (
                <TouchableOpacity
                  key={p.name}
                  style={[styles.presetChip, config.naam === p.name && styles.presetChipActive]}
                  onPress={() => handleSelectPreset(p.name)}
                >
                  <Text style={styles.presetDeva}>{p.devanagari}</Text>
                  <Text style={styles.presetName}>{p.name}</Text>
                  <Text style={styles.presetTrad}>{p.trad}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        ) : (
          <View style={styles.sanctuaryContainer}>
            {/* Philosophical Reminder */}
            <View style={styles.teachingBanner}>
              <Text style={styles.teachingTitle}>THE SACRED HAPTIC ANCHOR</Text>
              <Text style={styles.teachingText}>
                When this phone vibrates in your hand, do not react with stress. It is the bell of
                consciousness. Drown back into the Naam.
              </Text>
            </View>

            {/* Sacred Animated Visual (Mandala / Flame GIF Simulation) */}
            <TouchableOpacity
              style={styles.interactiveArea}
              onPress={handleChant}
              activeOpacity={0.9}
            >
              <Animated.View
                style={[
                  styles.auraRing,
                  {
                    transform: [{ scale: pulseAnim }, { rotate: spin }],
                  },
                ]}
              >
                <View style={styles.orbInner} />
                <View style={styles.orbRay1} />
                <View style={styles.orbRay2} />
              </Animated.View>

              {/* Luminous Core */}
              <View style={styles.coreCard}>
                <Text style={styles.devanagariDisplay}>{currentDevanagari}</Text>
                <Text style={styles.naamDisplay}>{config.naam}</Text>
                <Text style={styles.chantPrompt}>TAP TO JAPA • FEEL THE HEARTBEAT</Text>
              </View>
            </TouchableOpacity>

            {/* Mala & Count Tracker */}
            <View style={styles.counterRow}>
              <View style={styles.counterBox}>
                <Text style={styles.counterNumber}>{config.japaCount}</Text>
                <Text style={styles.counterLabel}>CHANTS TODAY</Text>
              </View>
              <View style={styles.counterBox}>
                <Text style={[styles.counterNumber, { color: '#39D98A' }]}>
                  {config.totalMalaRounds}
                </Text>
                <Text style={styles.counterLabel}>MALA ROUNDS (108)</Text>
              </View>
            </View>

            {/* Tactile Rhythm Note */}
            <TouchableOpacity style={styles.vibeTestBtn} onPress={() => HapticService.naamJapaPulse()}>
              <Text style={styles.vibeTestText}>📳 Test Sacred Heartbeat Pulse</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#070707',
    padding: 20,
    justifyContent: 'space-between',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 10,
  },
  closeBtn: {
    padding: 8,
  },
  closeText: {
    ...TYPOGRAPHY.body,
    color: COLORS.TEXT_MUTED,
  },
  editBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: '#181818',
    borderWidth: 1,
    borderColor: '#303030',
  },
  editText: {
    ...TYPOGRAPHY.caption,
    color: '#FFB800',
    fontWeight: '700',
  },
  sanctuaryContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 20,
  },
  teachingBanner: {
    backgroundColor: '#141414',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#262626',
    maxWidth: 340,
  },
  teachingTitle: {
    ...TYPOGRAPHY.caption,
    color: '#FFB800',
    letterSpacing: 2,
    fontSize: 9,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 4,
  },
  teachingText: {
    ...TYPOGRAPHY.caption,
    color: '#D4D4D4',
    textAlign: 'center',
    fontSize: 11,
    lineHeight: 16,
  },
  interactiveArea: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 280,
    height: 280,
  },
  auraRing: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    borderWidth: 2,
    borderColor: 'rgba(255, 184, 0, 0.3)',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbInner: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(255, 184, 0, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 184, 0, 0.15)',
  },
  orbRay1: {
    position: 'absolute',
    width: 250,
    height: 2,
    backgroundColor: 'rgba(255, 184, 0, 0.15)',
  },
  orbRay2: {
    position: 'absolute',
    height: 250,
    width: 2,
    backgroundColor: 'rgba(255, 184, 0, 0.15)',
  },
  coreCard: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#111',
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#FFB800',
    shadowColor: '#FFB800',
    shadowOpacity: 0.3,
    shadowRadius: 18,
    elevation: 8,
    width: 220,
  },
  devanagariDisplay: {
    fontSize: 26,
    color: '#FFB800',
    fontWeight: '700',
    marginBottom: 4,
    textAlign: 'center',
  },
  naamDisplay: {
    ...TYPOGRAPHY.h3,
    color: '#FFF',
    letterSpacing: 2,
    fontWeight: '800',
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 8,
  },
  chantPrompt: {
    ...TYPOGRAPHY.caption,
    color: COLORS.TEXT_MUTED,
    fontSize: 9,
    letterSpacing: 1,
    fontWeight: '700',
    textAlign: 'center',
  },
  counterRow: {
    flexDirection: 'row',
    gap: 16,
  },
  counterBox: {
    backgroundColor: '#141414',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#242424',
    alignItems: 'center',
  },
  counterNumber: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFB800',
    fontVariant: ['tabular-nums'],
  },
  counterLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.TEXT_MUTED,
    fontSize: 9,
    letterSpacing: 1,
    marginTop: 2,
  },
  vibeTestBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: '#141414',
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  vibeTestText: {
    ...TYPOGRAPHY.caption,
    color: '#D4D4D4',
    fontWeight: '600',
    fontSize: 11,
  },
  editContainer: {
    paddingVertical: 20,
  },
  editTitle: {
    ...TYPOGRAPHY.h3,
    color: '#FFF',
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  editSub: {
    ...TYPOGRAPHY.caption,
    color: COLORS.TEXT_MUTED,
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#161616',
    borderWidth: 1,
    borderColor: '#FFB800',
    borderRadius: 14,
    padding: 16,
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 2,
    textAlign: 'center',
    marginBottom: 16,
  },
  saveNaamBtn: {
    backgroundColor: '#FFB800',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  saveNaamText: {
    color: '#000',
    fontWeight: '800',
    fontSize: 14,
    letterSpacing: 1,
  },
  presetHeading: {
    ...TYPOGRAPHY.caption,
    color: COLORS.TEXT_MUTED,
    letterSpacing: 1.5,
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 12,
  },
  presetGrid: {
    gap: 10,
  },
  presetChip: {
    backgroundColor: '#161616',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#262626',
  },
  presetChipActive: {
    borderColor: '#FFB800',
    backgroundColor: 'rgba(255, 184, 0, 0.08)',
  },
  presetDeva: {
    fontSize: 18,
    color: '#FFB800',
    fontWeight: '700',
    marginBottom: 2,
  },
  presetName: {
    ...TYPOGRAPHY.body,
    fontWeight: '700',
    color: '#FFF',
    fontSize: 13,
  },
  presetTrad: {
    ...TYPOGRAPHY.caption,
    color: COLORS.TEXT_MUTED,
    fontSize: 11,
    marginTop: 2,
  },
});
