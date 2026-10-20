import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { COLORS } from '../../theme/colors';
import { TYPOGRAPHY } from '../../theme/typography';
import { spineJourney } from '../../features/spine/SpineJourney';
import { SpineSection } from '../../types';

export const SpineJourney = ({
  onBack,
  onSelectSection,
}: {
  onBack?: () => void;
  onSelectSection?: (section: SpineSection) => void;
}) => {
  const sections = spineJourney.getSections();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.tag}>33-VERTEBRA AXIS</Text>
      </View>

      <Text style={styles.title}>The Living Spine Map</Text>
      <Text style={styles.subtitle}>
        Ascend through 33 progressive stations of attention depth. Each vertebra requires sensory breath proof to unlock.
      </Text>

      {/* Vertical Spine Column */}
      <View style={styles.spineColumn}>
        <View style={styles.centralAxisLine} />

        {sections.map((sec) => (
          <TouchableOpacity
            key={sec.id}
            style={[
              styles.vertebraRow,
              sec.isUnlocked ? styles.rowUnlocked : styles.rowLocked,
            ]}
            onPress={() => onSelectSection?.(sec)}
            activeOpacity={sec.isUnlocked ? 0.7 : 1}
          >
            <View
              style={[
                styles.nodeCircle,
                sec.isUnlocked ? styles.nodeUnlocked : styles.nodeLocked,
              ]}
            >
              <Text style={styles.nodeNumber}>{sec.id}</Text>
            </View>

            <View style={styles.nodeDetails}>
              <View style={styles.titleRow}>
                <Text style={[styles.nodeName, !sec.isUnlocked && styles.lockedText]}>
                  {sec.name}
                </Text>
                <Text style={styles.chapterBadge}>{sec.chapter.toUpperCase()}</Text>
              </View>
              <Text style={styles.nodeSub} numberOfLines={1}>
                {sec.isUnlocked ? sec.description : '🔒 Locked — Complete previous vertebra'}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
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
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 16,
  },
  backText: {
    ...TYPOGRAPHY.body,
    color: COLORS.PRIMARY,
  },
  tag: {
    ...TYPOGRAPHY.caption,
    color: COLORS.SADHNA_VIOLET,
    letterSpacing: 1.5,
  },
  title: {
    ...TYPOGRAPHY.h1,
    color: COLORS.TEXT_PRIMARY,
  },
  subtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.TEXT_MUTED,
    marginVertical: 8,
  },
  spineColumn: {
    marginTop: 20,
    position: 'relative',
  },
  centralAxisLine: {
    position: 'absolute',
    left: 20,
    top: 10,
    bottom: 10,
    width: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  vertebraRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    backgroundColor: COLORS.CARD,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.BORDER_SUBTLE,
  },
  rowUnlocked: {
    borderColor: 'rgba(108, 99, 255, 0.4)',
  },
  rowLocked: {
    opacity: 0.5,
  },
  nodeCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  nodeUnlocked: {
    backgroundColor: COLORS.SADHNA_VIOLET,
  },
  nodeLocked: {
    backgroundColor: '#282828',
  },
  nodeNumber: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.TEXT_PRIMARY,
  },
  nodeDetails: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nodeName: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.TEXT_PRIMARY,
  },
  lockedText: {
    color: COLORS.TEXT_MUTED,
  },
  chapterBadge: {
    ...TYPOGRAPHY.caption,
    fontSize: 10,
    color: COLORS.PRIMARY,
    fontWeight: '700',
  },
  nodeSub: {
    ...TYPOGRAPHY.caption,
    color: COLORS.TEXT_MUTED,
    marginTop: 2,
  },
});
