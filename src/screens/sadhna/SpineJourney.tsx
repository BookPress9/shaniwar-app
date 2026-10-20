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
  const unlockedCount = spineJourney.getUnlockedCount();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.tag}>HEADSPACE PROGRESSION TREE</Text>
      </View>

      <Text style={styles.title}>The 33-Vertebra Ascension</Text>
      <Text style={styles.subtitle}>
        Linear contemplative course: Complete breath proof to advance node by node from Root to Crown.
      </Text>

      {/* Chapter Overview Cards */}
      <View style={styles.chapterBadgeRow}>
        <View style={[styles.chapterPill, styles.chapterPillActive]}>
          <Text style={styles.chapterPillText}>CH. I: ROOT (V1–V11)</Text>
        </View>
        <View style={styles.chapterPill}>
          <Text style={styles.chapterPillText}>CH. II: CHANNEL</Text>
        </View>
        <View style={styles.chapterPill}>
          <Text style={styles.chapterPillText}>CH. III: CROWN</Text>
        </View>
      </View>

      {/* Winding Milestone Path Map */}
      <View style={styles.windingMap}>
        {sections.map((sec, idx) => {
          const isPassed = sec.id < unlockedCount;
          const isCurrent = sec.id === unlockedCount;
          const isGatekeeper = sec.id === 11 || sec.id === 22 || sec.id === 33;

          // Offset pattern (Headspace/Duolingo winding path)
          const offsetStyle =
            idx % 3 === 0
              ? styles.alignCenter
              : idx % 3 === 1
              ? styles.alignLeft
              : styles.alignRight;

          return (
            <View key={sec.id} style={[styles.nodeRow, offsetStyle]}>
              {idx > 0 && (
                <View
                  style={[
                    styles.pathConnector,
                    isPassed || isCurrent ? styles.connectorActive : styles.connectorLocked,
                  ]}
                />
              )}

              <TouchableOpacity
                style={[
                  styles.nodeButton,
                  isPassed && styles.nodePassed,
                  isCurrent && styles.nodeCurrent,
                  !sec.isUnlocked && styles.nodeLocked,
                  isGatekeeper && styles.nodeGatekeeper,
                ]}
                onPress={() => onSelectSection?.(sec)}
                activeOpacity={sec.isUnlocked ? 0.7 : 1}
              >
                <Text style={styles.nodeIcon}>
                  {isPassed ? '✓' : isCurrent ? '⚡' : isGatekeeper ? '👑' : '🔒'}
                </Text>
                <Text style={styles.nodeNum}>{sec.id}</Text>
              </TouchableOpacity>

              <View style={styles.nodeTextBubble}>
                <Text
                  style={[
                    styles.nodeName,
                    isCurrent && { color: COLORS.PRIMARY, fontWeight: '700' },
                    !sec.isUnlocked && { color: COLORS.TEXT_MUTED },
                  ]}
                >
                  {sec.name}
                </Text>
                <Text style={styles.nodeSub}>
                  {isPassed
                    ? `Mastered · ${sec.accuracyScore || 94}% match`
                    : isCurrent
                    ? 'Active Station · Tap to Initiate'
                    : `Locked · Requires V${sec.id - 1}`}
                </Text>
              </View>
            </View>
          );
        })}
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
    paddingBottom: 60,
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
    fontWeight: '700',
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
  chapterBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 14,
  },
  chapterPill: {
    backgroundColor: COLORS.CARD,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.BORDER_SUBTLE,
  },
  chapterPillActive: {
    borderColor: COLORS.SADHNA_VIOLET,
    backgroundColor: 'rgba(108, 99, 255, 0.1)',
  },
  chapterPillText: {
    ...TYPOGRAPHY.caption,
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
  },
  windingMap: {
    marginTop: 20,
    alignItems: 'center',
  },
  nodeRow: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 10,
  },
  alignCenter: {
    alignItems: 'center',
  },
  alignLeft: {
    alignItems: 'flex-start',
    paddingLeft: 30,
  },
  alignRight: {
    alignItems: 'flex-end',
    paddingRight: 30,
  },
  pathConnector: {
    width: 3,
    height: 24,
    marginBottom: 6,
  },
  connectorActive: {
    backgroundColor: COLORS.SUCCESS,
  },
  connectorLocked: {
    backgroundColor: '#333',
  },
  nodeButton: {
    width: 62,
    height: 62,
    borderRadius: 31,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.BORDER_SUBTLE,
  },
  nodePassed: {
    backgroundColor: COLORS.SUCCESS,
    borderColor: '#FFF',
  },
  nodeCurrent: {
    backgroundColor: COLORS.PRIMARY,
    borderColor: '#FFF',
    borderWidth: 3,
  },
  nodeLocked: {
    backgroundColor: '#1E1E1E',
  },
  nodeGatekeeper: {
    borderColor: COLORS.PRIMARY,
    backgroundColor: COLORS.SADHNA_VIOLET,
  },
  nodeIcon: {
    fontSize: 18,
    color: COLORS.TEXT_PRIMARY,
  },
  nodeNum: {
    ...TYPOGRAPHY.caption,
    fontSize: 9,
    color: COLORS.TEXT_PRIMARY,
    fontWeight: '700',
  },
  nodeTextBubble: {
    backgroundColor: COLORS.CARD,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginTop: 6,
    borderWidth: 1,
    borderColor: COLORS.BORDER_SUBTLE,
    alignItems: 'center',
  },
  nodeName: {
    ...TYPOGRAPHY.bodyBold,
    fontSize: 13,
    color: COLORS.TEXT_PRIMARY,
  },
  nodeSub: {
    ...TYPOGRAPHY.caption,
    fontSize: 10,
    color: COLORS.TEXT_MUTED,
    marginTop: 2,
  },
});
