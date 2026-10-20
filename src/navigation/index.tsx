import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { COLORS } from '../theme/colors';
import { TYPOGRAPHY } from '../theme/typography';
import { RoutineHome } from '../screens/routine/RoutineHome';
import { AlarmMission } from '../screens/routine/AlarmMission';
import { MonkBlocks } from '../screens/routine/MonkBlocks';
import { FocusSession } from '../screens/routine/FocusSession';
import { EveningReview } from '../screens/routine/EveningReview';
import { SadhnaHome } from '../screens/sadhna/SadhnaHome';
import { SpineJourney } from '../screens/sadhna/SpineJourney';
import { BreathingSession } from '../screens/sadhna/BreathingSession';
import { AttentionGame } from '../screens/sadhna/AttentionGame';
import { SpineSection } from '../screens/sadhna/SpineSection';
import { ManovigyanHome } from '../screens/manovigyan/ManovigyanHome';
import { InquirySession } from '../screens/manovigyan/InquirySession';
import { SelfMirrorReport } from '../screens/manovigyan/SelfMirrorReport';
import { SovereignCockpit } from '../screens/dashboard/SovereignCockpit';
import { SpineSection as SpineSectionType, InquiryCategory } from '../types';

export type MainTab = 'COCKPIT' | 'ROUTINE' | 'SADHNA' | 'MANOVIGYAN';

export const RootNavigator = () => {
  const [activeTab, setActiveTab] = useState<MainTab>('COCKPIT');
  const [currentSubScreen, setCurrentSubScreen] = useState<string | null>(null);
  const [selectedSection, setSelectedSection] = useState<SpineSectionType | null>(null);
  const [breathingSectionId, setBreathingSectionId] = useState<number>(1);
  const [inquiryCategory, setInquiryCategory] = useState<InquiryCategory | undefined>(undefined);
  const [inquiryDilemmaId, setInquiryDilemmaId] = useState<string | undefined>(undefined);

  const handleCockpitNavigate = (tab: string, screen?: string, params?: any) => {
    setActiveTab(tab as MainTab);
    if (screen) {
      if (params?.sectionId) {
        setBreathingSectionId(params.sectionId);
      }
      if (params?.category) {
        setInquiryCategory(params.category);
      }
      if (params?.dilemmaId) {
        setInquiryDilemmaId(params.dilemmaId);
      }
      setCurrentSubScreen(screen);
    } else {
      setCurrentSubScreen(null);
    }
  };

  const handleNavigateRoutine = (screen: string) => {
    setCurrentSubScreen(screen);
  };

  const handleNavigateSadhna = (screen: string, params?: any) => {
    if (params?.sectionId) {
      setBreathingSectionId(params.sectionId);
    }
    setCurrentSubScreen(screen);
  };

  const handleNavigateManovigyan = (screen: string, params?: any) => {
    if (params?.category) {
      setInquiryCategory(params.category);
    } else {
      setInquiryCategory(undefined);
    }
    if (params?.dilemmaId) {
      setInquiryDilemmaId(params.dilemmaId);
    } else {
      setInquiryDilemmaId(undefined);
    }
    setCurrentSubScreen(screen);
  };

  const handleBack = () => {
    setCurrentSubScreen(null);
    setSelectedSection(null);
  };

  const renderContent = () => {
    if (currentSubScreen === 'AlarmMission') {
      return <AlarmMission onBack={handleBack} />;
    }
    if (currentSubScreen === 'MonkBlocks') {
      return <MonkBlocks onBack={handleBack} />;
    }
    if (currentSubScreen === 'FocusSession') {
      return <FocusSession onBack={handleBack} />;
    }
    if (currentSubScreen === 'EveningReview') {
      return <EveningReview onBack={handleBack} />;
    }
    if (currentSubScreen === 'SpineJourney') {
      return (
        <SpineJourney
          onBack={handleBack}
          onSelectSection={(sec) => {
            setSelectedSection(sec);
            setCurrentSubScreen('SpineSection');
          }}
        />
      );
    }
    if (currentSubScreen === 'BreathingSession') {
      return <BreathingSession sectionId={breathingSectionId} onBack={handleBack} />;
    }
    if (currentSubScreen === 'AttentionGame') {
      return <AttentionGame onBack={handleBack} />;
    }
    if (currentSubScreen === 'SpineSection' && selectedSection) {
      return (
        <SpineSection
          section={selectedSection}
          onBack={handleBack}
          onBeginBreath={(id) => {
            setBreathingSectionId(id);
            setCurrentSubScreen('BreathingSession');
          }}
          onBeginAttention={() => setCurrentSubScreen('AttentionGame')}
        />
      );
    }
    if (currentSubScreen === 'InquirySession') {
      return (
        <InquirySession
          category={inquiryCategory}
          dilemmaId={inquiryDilemmaId}
          onBack={handleBack}
          onFinish={() => setCurrentSubScreen('SelfMirrorReport')}
        />
      );
    }
    if (currentSubScreen === 'SelfMirrorReport') {
      return <SelfMirrorReport onBack={handleBack} />;
    }

    if (activeTab === 'COCKPIT') {
      return <SovereignCockpit onNavigate={handleCockpitNavigate} />;
    }

    if (activeTab === 'ROUTINE') {
      return <RoutineHome onNavigate={handleNavigateRoutine} />;
    }

    if (activeTab === 'SADHNA') {
      return <SadhnaHome onNavigate={handleNavigateSadhna} />;
    }

    return <ManovigyanHome onNavigate={handleNavigateManovigyan} />;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>{renderContent()}</View>

      {/* Main 4-Tab Switcher */}
      {!currentSubScreen && (
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'COCKPIT' && styles.tabButtonActiveCockpit]}
            onPress={() => setActiveTab('COCKPIT')}
            activeOpacity={0.8}
          >
            <Text style={styles.tabIcon}>🔆</Text>
            <Text
              style={[
                styles.tabLabel,
                activeTab === 'COCKPIT' && { color: COLORS.PRIMARY, fontWeight: '700' },
              ]}
            >
              COCKPIT
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'ROUTINE' && styles.tabButtonActiveRoutine]}
            onPress={() => setActiveTab('ROUTINE')}
            activeOpacity={0.8}
          >
            <Text style={styles.tabIcon}>🔥</Text>
            <Text
              style={[
                styles.tabLabel,
                activeTab === 'ROUTINE' && { color: COLORS.ROUTINE_RED, fontWeight: '700' },
              ]}
            >
              ROUTINE
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'SADHNA' && styles.tabButtonActiveSadhna]}
            onPress={() => setActiveTab('SADHNA')}
            activeOpacity={0.8}
          >
            <Text style={styles.tabIcon}>🪷</Text>
            <Text
              style={[
                styles.tabLabel,
                activeTab === 'SADHNA' && { color: COLORS.SADHNA_VIOLET, fontWeight: '700' },
              ]}
            >
              SADHNA
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === 'MANOVIGYAN' && styles.tabButtonActiveManovigyan,
            ]}
            onPress={() => setActiveTab('MANOVIGYAN')}
            activeOpacity={0.8}
          >
            <Text style={styles.tabIcon}>👁️</Text>
            <Text
              style={[
                styles.tabLabel,
                activeTab === 'MANOVIGYAN' && {
                  color: COLORS.MANOVIGYAN_CYAN,
                  fontWeight: '700',
                },
              ]}
            >
              MANOVI.
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  container: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    height: 70,
    backgroundColor: COLORS.CARD,
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER_SUBTLE,
    paddingBottom: 8,
    paddingTop: 8,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    marginHorizontal: 4,
  },
  tabButtonActiveCockpit: {
    backgroundColor: 'rgba(201, 146, 42, 0.1)',
  },
  tabButtonActiveRoutine: {
    backgroundColor: 'rgba(232, 69, 69, 0.08)',
  },
  tabButtonActiveSadhna: {
    backgroundColor: 'rgba(108, 99, 255, 0.08)',
  },
  tabButtonActiveManovigyan: {
    backgroundColor: 'rgba(0, 210, 211, 0.08)',
  },
  tabIcon: {
    fontSize: 18,
    marginBottom: 2,
  },
  tabLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.TEXT_MUTED,
    letterSpacing: 0.5,
    fontSize: 9,
  },
});
