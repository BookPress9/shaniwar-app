import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Linking,
} from 'react-native';
import { COLORS } from '../../theme/colors';
import { TYPOGRAPHY } from '../../theme/typography';
import { HapticService } from '../../services/haptics';

interface Props {
  visible: boolean;
  onClose: () => void;
  onTestIntercept: () => void;
}

export const InstagramWrapperModal = ({ visible, onClose, onTestIntercept }: Props) => {
  const handleOpenShortcuts = async () => {
    HapticService.selection();
    const shortcutsUrl = 'shortcuts://';
    const canOpen = await Linking.canOpenURL(shortcutsUrl);
    if (canOpen) {
      await Linking.openURL(shortcutsUrl);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.eyebrow}>IOS NATIVE SHIELD</Text>
              <Text style={styles.title}>WRAP INSTAGRAM BLOCKER</Text>
              <Text style={styles.subtitle}>
                Use your iPhone’s built-in bouncer to protect your focus.
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            {/* Philosophical Why Card */}
            <View style={styles.whyCard}>
              <Text style={styles.whyTitle}>WHY WRAP INSTAGRAM WITH SHANIWAR?</Text>
              <Text style={styles.whyText}>
                When you tap Instagram unconsciously, your thumb acts without your consent. By wrapping
                your iPhone’s internal automation around Shaniwar, your phone snaps into the
                Sacred Haptic Heartbeat and pulls you back into the Naam before the algorithm traps you.
              </Text>
            </View>

            {/* 3-Step Setup Guide */}
            <View style={styles.stepContainer}>
              <View style={styles.stepRow}>
                <View style={styles.stepNumberBubble}>
                  <Text style={styles.stepNumber}>1</Text>
                </View>
                <View style={styles.stepTextContainer}>
                  <Text style={styles.stepHeading}>Open Built-in iOS Shortcuts</Text>
                  <Text style={styles.stepBody}>
                    Open the native <Text style={styles.boldWhite}>Shortcuts</Text> app on your iPhone
                    and tap the <Text style={styles.boldGold}>Automation</Text> tab at the bottom.
                  </Text>
                </View>
              </View>

              <View style={styles.stepRow}>
                <View style={styles.stepNumberBubble}>
                  <Text style={styles.stepNumber}>2</Text>
                </View>
                <View style={styles.stepTextContainer}>
                  <Text style={styles.stepHeading}>Create New App Trigger</Text>
                  <Text style={styles.stepBody}>
                    Tap <Text style={styles.boldWhite}>+ (New Automation)</Text> → Select{' '}
                    <Text style={styles.boldWhite}>App</Text> → Choose{' '}
                    <Text style={styles.boldWhite}>Instagram</Text>. Select{' '}
                    <Text style={styles.boldGold}>“Is Opened”</Text> and check{' '}
                    <Text style={styles.boldGold}>“Run Immediately”</Text> (turn off Ask Before Running).
                  </Text>
                </View>
              </View>

              <View style={styles.stepRow}>
                <View style={styles.stepNumberBubble}>
                  <Text style={styles.stepNumber}>3</Text>
                </View>
                <View style={styles.stepTextContainer}>
                  <Text style={styles.stepHeading}>Redirect to Hybrid Monk</Text>
                  <Text style={styles.stepBody}>
                    Add Action → Search <Text style={styles.boldWhite}>“Open URL”</Text> and enter:
                  </Text>
                  <View style={styles.urlBox}>
                    <Text style={styles.urlText}>shaniwar://shield</Text>
                  </View>
                  <Text style={styles.stepBodySub}>
                    (Or choose action: <Text style={styles.boldWhite}>Open App → Hybrid Monk</Text>).
                  </Text>
                </View>
              </View>
            </View>

            {/* Quick Actions */}
            <View style={styles.actionRow}>
              <TouchableOpacity
                style={styles.testBtn}
                onPress={() => {
                  HapticService.naamJapaPulse();
                  onClose();
                  onTestIntercept();
                }}
                activeOpacity={0.85}
              >
                <Text style={styles.testBtnText}>TEST SHIELD INTERCEPT NOW ⚡</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.shortcutsBtn}
                onPress={handleOpenShortcuts}
                activeOpacity={0.85}
              >
                <Text style={styles.shortcutsBtnText}>OPEN SHORTCUTS APP →</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#121212',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderColor: '#262626',
    maxHeight: '92%',
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#202020',
  },
  eyebrow: {
    ...TYPOGRAPHY.caption,
    color: '#FFB800',
    letterSpacing: 2,
    fontSize: 10,
    fontWeight: '800',
  },
  title: {
    ...TYPOGRAPHY.h3,
    color: '#EDEDED',
    letterSpacing: 1.5,
    marginTop: 2,
  },
  subtitle: {
    ...TYPOGRAPHY.caption,
    color: COLORS.TEXT_MUTED,
    marginTop: 2,
    fontSize: 11,
  },
  closeBtn: {
    padding: 8,
  },
  closeText: {
    color: COLORS.TEXT_MUTED,
    fontSize: 18,
  },
  content: {
    padding: 20,
    paddingBottom: 30,
  },
  whyCard: {
    backgroundColor: '#171717',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2A2A2A',
    marginBottom: 20,
  },
  whyTitle: {
    ...TYPOGRAPHY.caption,
    color: '#FFB800',
    fontWeight: '800',
    letterSpacing: 1.5,
    fontSize: 10,
    marginBottom: 6,
  },
  whyText: {
    ...TYPOGRAPHY.caption,
    color: '#D4D4D4',
    lineHeight: 18,
    fontSize: 12,
  },
  stepContainer: {
    gap: 16,
    marginBottom: 24,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: '#161616',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#262626',
  },
  stepNumberBubble: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 184, 0, 0.15)',
    borderWidth: 1,
    borderColor: '#FFB800',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumber: {
    color: '#FFB800',
    fontWeight: '800',
    fontSize: 13,
  },
  stepTextContainer: {
    flex: 1,
  },
  stepHeading: {
    ...TYPOGRAPHY.body,
    fontWeight: '700',
    color: '#FFF',
    fontSize: 14,
    marginBottom: 4,
  },
  stepBody: {
    ...TYPOGRAPHY.caption,
    color: COLORS.TEXT_MUTED,
    fontSize: 12,
    lineHeight: 17,
  },
  stepBodySub: {
    ...TYPOGRAPHY.caption,
    color: COLORS.TEXT_MUTED,
    fontSize: 11,
    marginTop: 6,
  },
  boldWhite: {
    color: '#FFF',
    fontWeight: '700',
  },
  boldGold: {
    color: '#FFB800',
    fontWeight: '700',
  },
  urlBox: {
    backgroundColor: '#0A0A0A',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  urlText: {
    fontFamily: 'Courier',
    color: '#39D98A',
    fontWeight: '700',
    fontSize: 12,
  },
  actionRow: {
    gap: 10,
  },
  testBtn: {
    backgroundColor: '#FFB800',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  testBtnText: {
    color: '#000',
    fontWeight: '800',
    fontSize: 14,
    letterSpacing: 1,
  },
  shortcutsBtn: {
    backgroundColor: '#1E1E1E',
    borderWidth: 1,
    borderColor: '#333',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  shortcutsBtnText: {
    color: '#EDEDED',
    fontWeight: '700',
    fontSize: 13,
  },
});
