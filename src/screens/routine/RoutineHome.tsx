import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { COLORS } from '../../theme/colors';
import { TYPOGRAPHY } from '../../theme/typography';
import {
  routineService,
  RoutineTimelineItem,
  DincharyaArchetype,
  ARCHETYPES,
} from '../../services/routineService';
import { HapticService } from '../../services/haptics';
import { CustomizeRoutineModal } from './CustomizeRoutineModal';
import { InstagramWrapperModal } from './InstagramWrapperModal';

interface Props {
  onNavigate?: (screen: string, params?: any) => void;
}

export const RoutineHome = ({ onNavigate }: Props) => {
  const [items, setItems] = useState<RoutineTimelineItem[]>([]);
  const [activeItem, setActiveItem] = useState<RoutineTimelineItem | null>(null);
  const [currentArchetype, setCurrentArchetype] = useState<DincharyaArchetype>('builder');
  const [currentTimeStr, setCurrentTimeStr] = useState<string>('');
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);
  const [isWrapperModalOpen, setIsWrapperModalOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const activeMonks = 1428;

  useEffect(() => {
    loadData();

    // Clock updater
    const updateTime = () => {
      const now = new Date();
      const h = now.getHours();
      const m = now.getMinutes().toString().padStart(2, '0');
      const period = h >= 12 ? 'PM' : 'AM';
      const h12 = h % 12 === 0 ? 12 : h % 12;
      setCurrentTimeStr(`${h12}:${m} ${period}`);
      setActiveItem(routineService.getCurrentActiveItem());
    };

    updateTime();
    const interval = setInterval(updateTime, 10000); // Check every 10s
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    const routine = await routineService.getRoutine();
    const arch = await routineService.getArchetype();
    setItems(routine);
    setCurrentArchetype(arch);
    setActiveItem(routineService.getCurrentActiveItem());
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleToggleBell = async (id: string) => {
    HapticService.selection();
    await routineService.toggleNotification(id);
    await loadData();
  };

  const handleAction = (item: RoutineTimelineItem) => {
    HapticService.heavyImpact();
    if (item.id === 'wake_alarm') {
      onNavigate?.('AlarmMission');
    } else if (item.id === 'protection_window') {
      onNavigate?.('FocusSession');
    } else if (item.id === 'dawn_breath') {
      onNavigate?.('HybridPracticeZap', { practiceType: 'kundalini_breath' });
    } else if (item.id === 'midday_stop') {
      onNavigate?.('HybridPracticeZap', { practiceType: 'osho_stop' });
    } else if (item.id === 'evening_transition') {
      onNavigate?.('EveningReview');
    } else {
      HapticService.lightImpact();
    }
  };

  const activeArchMeta = ARCHETYPES.find((a) => a.id === currentArchetype) || ARCHETYPES[0];

  return (
    <View style={styles.container}>
      {/* Sticky Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>SHANIWAR • BY THE HYBRID MONK</Text>
          <Text style={styles.title}>DINCHARYA • दिनचर्या</Text>
        </View>
        <View style={styles.headerRightActions}>
          <TouchableOpacity
            style={styles.passBtn}
            onPress={() => {
              HapticService.selection();
              onNavigate?.('PaywallScreen');
            }}
            activeOpacity={0.8}
          >
            <Text style={styles.passBtnText}>👑 Pass</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.customizeBtn}
            onPress={() => {
              HapticService.lightImpact();
              setIsCustomizeOpen(true);
            }}
            activeOpacity={0.8}
          >
            <Text style={styles.customizeBtnText}>⚙️ Calibrate</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#FFB800" />
        }
      >
        {/* Real-time Status Bar */}
        <View style={styles.statusBar}>
          <View style={styles.statusLeft}>
            <View style={styles.pulseDot} />
            <Text style={styles.timeLabel}>LIVE CLOCK: {currentTimeStr}</Text>
          </View>
          <View style={styles.ambientPill}>
            <Text style={styles.ambientText}>{activeMonks.toLocaleString()} Monks Locked In</Text>
          </View>
        </View>

        {/* Modern Monk Manifesto Card */}
        <TouchableOpacity
          style={styles.manifestoCard}
          onPress={() => {
            HapticService.lightImpact();
            setIsCustomizeOpen(true);
          }}
          activeOpacity={0.85}
        >
          <View style={styles.manifestoTop}>
            <Text style={styles.manifestoIcon}>{activeArchMeta.icon}</Text>
            <View style={{ flex: 1 }}>
              <View style={styles.archetypeBadge}>
                <Text style={styles.archetypeBadgeText}>ACTIVE PATH: {activeArchMeta.name.toUpperCase()}</Text>
              </View>
              <Text style={styles.manifestoQuote}>
                “Ancient monks left the world behind. We are the modern monks—living in the world, mastering the world, staying anchored in presence.”
              </Text>
            </View>
          </View>
          <Text style={styles.manifestoHint}>Tap to switch life archetype (Student, Builder, Parent, Householder) →</Text>
        </TouchableOpacity>

        {activeItem && (
          <View style={styles.activeBanner}>
            <Text style={styles.activeBannerTag}>NOW ACTIVE</Text>
            <Text style={styles.activeBannerTitle}>{activeItem.title}</Text>
            <TouchableOpacity
              style={styles.activeBannerBtn}
              onPress={() => handleAction(activeItem)}
              activeOpacity={0.85}
            >
              <Text style={styles.activeBannerBtnText}>ENTER ACTIVE PHASE →</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Timeline Progression Arc */}
        <View style={styles.timelineContainer}>
          {/* Continuous Vertical Track */}
          <View style={styles.timelineTrack} />

          {items
            .filter((item) => item.enabled)
            .map((item, index) => {
              const isCurrent = activeItem?.id === item.id;
              const isMonkPath = item.isHybridMonkPath;

              return (
                <View key={item.id} style={styles.timelineRow}>
                  {/* Timeline Node */}
                  <View style={[styles.node, isCurrent && styles.nodeActive, isMonkPath && styles.nodeMonk]}>
                    <Text style={styles.nodeIcon}>
                      {item.type === 'alarm'
                        ? '🔥'
                        : item.type === 'protection'
                        ? '🛡️'
                        : item.practiceType === 'osho_stop'
                        ? '🛑'
                        : item.type === 'practice'
                        ? '⚡'
                        : '🌙'}
                    </Text>
                  </View>

                  {/* Timeline Card */}
                  <View
                    style={[
                      styles.card,
                      isCurrent && styles.cardActive,
                      isMonkPath && styles.cardMonk,
                    ]}
                  >
                    {/* Card Header */}
                    <View style={styles.cardHeader}>
                      <View style={styles.tagWrapper}>
                        <Text
                          style={[
                            styles.cardTag,
                            isMonkPath && { color: '#FFB800' },
                            item.type === 'protection' && { color: '#6C63FF' },
                          ]}
                        >
                          {item.tag}
                        </Text>
                        <Text style={styles.cardTime}>{item.timeDisplay}</Text>
                      </View>

                      {/* Notification Bell */}
                      <TouchableOpacity
                        onPress={() => handleToggleBell(item.id)}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      >
                        <Text style={[styles.bellIcon, !item.notificationEnabled && styles.bellMuted]}>
                          {item.notificationEnabled ? '🔔' : '🔕'}
                        </Text>
                      </TouchableOpacity>
                    </View>

                    {/* Card Title & Subtitle */}
                    <Text style={styles.cardTitle}>{item.title}</Text>
                    <Text style={styles.cardSubtitle}>{item.subtitle}</Text>

                    {/* Primary Direct Action */}
                    <TouchableOpacity
                      style={[
                        styles.ctaBtn,
                        item.type === 'alarm' && styles.ctaAlarm,
                        item.type === 'protection' && styles.ctaProtection,
                        isMonkPath && styles.ctaMonk,
                      ]}
                      onPress={() => handleAction(item)}
                      activeOpacity={0.85}
                    >
                      <Text
                        style={[
                          styles.ctaBtnText,
                          isMonkPath && { color: '#000' },
                          item.type === 'alarm' && { color: '#FFF' },
                        ]}
                      >
                        {item.type === 'alarm'
                          ? 'TEST WAKE MISSION 🔥'
                          : item.type === 'protection'
                          ? 'ENTER MONK SHIELD 🛡️'
                          : item.practiceType === 'osho_stop'
                          ? 'TRIGGER OSHO STOP 🛑'
                          : item.type === 'practice'
                          ? 'IGNITE BREATH ⚡'
                          : 'COMPLETE REVIEW 🌙'}
                      </Text>
                    </TouchableOpacity>

                    {item.type === 'protection' && (
                      <TouchableOpacity
                        style={styles.wrapperTriggerBtn}
                        onPress={() => {
                          HapticService.lightImpact();
                          setIsWrapperModalOpen(true);
                        }}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.wrapperTriggerText}>
                          📱 Wrap iPhone Instagram Blocker →
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              );
            })}
        </View>
      </ScrollView>

      {/* Routine Customization Modal */}
      <CustomizeRoutineModal
        visible={isCustomizeOpen}
        onClose={() => setIsCustomizeOpen(false)}
        onSaved={loadData}
      />

      {/* iOS Instagram Blocker Wrapper Modal */}
      <InstagramWrapperModal
        visible={isWrapperModalOpen}
        onClose={() => setIsWrapperModalOpen(false)}
        onTestIntercept={() => onNavigate?.('InstagramShieldIntercept')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1A',
    backgroundColor: '#0A0A0A',
  },
  eyebrow: {
    ...TYPOGRAPHY.caption,
    color: '#FFB800',
    letterSpacing: 2,
    fontSize: 10,
    fontWeight: '800',
  },
  title: {
    ...TYPOGRAPHY.h2,
    color: '#FFF',
    letterSpacing: 1,
    fontSize: 22,
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  passBtn: {
    backgroundColor: 'rgba(255, 184, 0, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FFB800',
  },
  passBtnText: {
    ...TYPOGRAPHY.caption,
    color: '#FFB800',
    fontWeight: '800',
    fontSize: 11,
  },
  customizeBtn: {
    backgroundColor: '#181818',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  customizeBtnText: {
    ...TYPOGRAPHY.caption,
    color: '#EDEDED',
    fontWeight: '700',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 60,
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pulseDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#39D98A',
    marginRight: 6,
  },
  timeLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.TEXT_MUTED,
    fontWeight: '700',
    fontSize: 11,
  },
  ambientPill: {
    backgroundColor: 'rgba(57, 217, 138, 0.08)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(57, 217, 138, 0.2)',
  },
  ambientText: {
    ...TYPOGRAPHY.caption,
    color: '#39D98A',
    fontSize: 10,
    fontWeight: '600',
  },
  manifestoCard: {
    backgroundColor: '#121212',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#262626',
    marginBottom: 20,
  },
  manifestoTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 8,
  },
  manifestoIcon: {
    fontSize: 28,
  },
  archetypeBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 184, 0, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 184, 0, 0.3)',
    marginBottom: 6,
  },
  archetypeBadgeText: {
    ...TYPOGRAPHY.caption,
    color: '#FFB800',
    fontWeight: '800',
    fontSize: 9,
    letterSpacing: 1.2,
  },
  manifestoQuote: {
    ...TYPOGRAPHY.caption,
    color: '#D4D4D4',
    fontStyle: 'italic',
    lineHeight: 17,
    fontSize: 12,
  },
  manifestoHint: {
    ...TYPOGRAPHY.caption,
    color: COLORS.TEXT_MUTED,
    fontSize: 10,
    marginTop: 4,
    textAlign: 'right',
  },
  activeBanner: {
    backgroundColor: '#17140B',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FFB800',
    marginBottom: 20,
  },
  activeBannerTag: {
    ...TYPOGRAPHY.caption,
    color: '#FFB800',
    fontWeight: '800',
    letterSpacing: 2,
    fontSize: 10,
    marginBottom: 4,
  },
  activeBannerTitle: {
    ...TYPOGRAPHY.body,
    fontWeight: '800',
    color: '#FFF',
    fontSize: 16,
    marginBottom: 12,
  },
  activeBannerBtn: {
    backgroundColor: '#FFB800',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  activeBannerBtnText: {
    color: '#000',
    fontWeight: '800',
    fontSize: 13,
    letterSpacing: 1,
  },
  timelineContainer: {
    position: 'relative',
    paddingLeft: 24,
  },
  timelineTrack: {
    position: 'absolute',
    left: 11,
    top: 15,
    bottom: 20,
    width: 2,
    backgroundColor: '#202020',
  },
  timelineRow: {
    flexDirection: 'row',
    marginBottom: 20,
    position: 'relative',
  },
  node: {
    position: 'absolute',
    left: -24,
    top: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#161616',
    borderWidth: 1.5,
    borderColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  nodeActive: {
    borderColor: '#FFB800',
    backgroundColor: 'rgba(255, 184, 0, 0.2)',
    shadowColor: '#FFB800',
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 4,
  },
  nodeMonk: {
    borderColor: '#FFB800',
  },
  nodeIcon: {
    fontSize: 10,
  },
  card: {
    flex: 1,
    backgroundColor: '#131313',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#222',
  },
  cardActive: {
    borderColor: '#FFB800',
    backgroundColor: '#16140E',
  },
  cardMonk: {
    borderLeftWidth: 3,
    borderLeftColor: '#FFB800',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  tagWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTag: {
    ...TYPOGRAPHY.caption,
    color: COLORS.ROUTINE_RED,
    fontWeight: '800',
    fontSize: 9,
    letterSpacing: 1.5,
  },
  cardTime: {
    ...TYPOGRAPHY.caption,
    color: COLORS.TEXT_MUTED,
    fontSize: 11,
    fontVariant: ['tabular-nums'],
  },
  bellIcon: {
    fontSize: 14,
  },
  bellMuted: {
    opacity: 0.35,
  },
  cardTitle: {
    ...TYPOGRAPHY.body,
    fontWeight: '700',
    color: '#FFF',
    fontSize: 15,
    marginBottom: 4,
  },
  cardSubtitle: {
    ...TYPOGRAPHY.caption,
    color: COLORS.TEXT_MUTED,
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 14,
  },
  ctaBtn: {
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#202020',
  },
  ctaAlarm: {
    backgroundColor: '#E84545',
  },
  ctaProtection: {
    backgroundColor: '#4A42C9',
  },
  ctaMonk: {
    backgroundColor: '#FFB800',
  },
  ctaBtnText: {
    fontWeight: '800',
    fontSize: 12,
    letterSpacing: 1,
    color: '#FFF',
  },
  wrapperTriggerBtn: {
    marginTop: 8,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: 'rgba(255, 184, 0, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 184, 0, 0.25)',
  },
  wrapperTriggerText: {
    ...TYPOGRAPHY.caption,
    color: '#FFB800',
    fontWeight: '700',
    fontSize: 11,
  },
});
