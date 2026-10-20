import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal, ActivityIndicator } from 'react-native';
import { COLORS } from '../../theme/colors';
import { TYPOGRAPHY } from '../../theme/typography';
import { supabase, isSupabaseConfigured } from '../../services/supabase';

export const AuthModal = ({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleAuth = async () => {
    if (!email.trim() || !password.trim()) {
      setStatusMessage('Please enter email and password.');
      return;
    }

    setLoading(true);
    setStatusMessage(null);

    try {
      if (isSupabaseConfigured) {
        if (isSignUp) {
          const { error } = await supabase.auth.signUp({ email, password });
          if (error) throw error;
          setStatusMessage('Confirmation email sent. Check your inbox!');
        } else {
          const { error } = await supabase.auth.signInWithPassword({ email, password });
          if (error) throw error;
          setStatusMessage('Authenticated successfully!');
          setTimeout(onClose, 800);
        }
      } else {
        // Local mode fallback
        setStatusMessage('Signed in locally (Local Guest Mode). Data stored on device.');
        setTimeout(onClose, 1000);
      }
    } catch (err: any) {
      setStatusMessage(err.message || 'Authentication error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>{isSignUp ? 'JOIN THE MONASTERY' : 'MONK AUTHENTICATION'}</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.subtitle}>
            {isSupabaseConfigured
              ? '☁️ Supabase Cloud Sync Active · Encrypted Database'
              : '💾 Local-First Mode · All progress saved on your device'}
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Monk Email"
            placeholderTextColor={COLORS.TEXT_MUTED}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <TextInput
            style={styles.input}
            placeholder="Secret Passcode"
            placeholderTextColor={COLORS.TEXT_MUTED}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          {statusMessage && <Text style={styles.statusText}>{statusMessage}</Text>}

          <TouchableOpacity style={styles.primaryButton} onPress={handleAuth} disabled={loading}>
            {loading ? (
              <ActivityIndicator color={COLORS.BACKGROUND} />
            ) : (
              <Text style={styles.primaryButtonText}>
                {isSignUp ? 'CREATE MONK ACCOUNT' : 'SECURE SIGN IN'}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.switchButton}
            onPress={() => setIsSignUp(!isSignUp)}
          >
            <Text style={styles.switchText}>
              {isSignUp ? 'Already a member? Sign In →' : 'New practitioner? Create Account →'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.guestButton} onPress={onClose}>
            <Text style={styles.guestText}>Continue as Sovereign Guest (Offline) →</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: COLORS.CARD,
    borderRadius: 20,
    padding: 24,
    width: '100%',
    borderWidth: 1,
    borderColor: COLORS.PRIMARY,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    ...TYPOGRAPHY.h3,
    color: COLORS.TEXT_PRIMARY,
    letterSpacing: 1,
  },
  closeText: {
    ...TYPOGRAPHY.h3,
    color: COLORS.TEXT_MUTED,
  },
  subtitle: {
    ...TYPOGRAPHY.caption,
    color: COLORS.PRIMARY,
    marginVertical: 10,
  },
  input: {
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: 10,
    padding: 14,
    color: COLORS.TEXT_PRIMARY,
    borderWidth: 1,
    borderColor: COLORS.BORDER_SUBTLE,
    marginBottom: 12,
    fontSize: 14,
  },
  statusText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.SUCCESS,
    textAlign: 'center',
    marginBottom: 10,
  },
  primaryButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 6,
  },
  primaryButtonText: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.BACKGROUND,
    letterSpacing: 0.5,
  },
  switchButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  switchText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.TEXT_MUTED,
  },
  guestButton: {
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER_SUBTLE,
    paddingTop: 12,
    alignItems: 'center',
    marginTop: 6,
  },
  guestText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.MANOVIGYAN_CYAN,
    fontWeight: '700',
  },
});
