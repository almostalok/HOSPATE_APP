import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { registerAsync } from '../../store/authSlice';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { PrimaryButton } from '../../components/PrimaryButton';
import { HospateLogo } from '../../components/HospateLogo';
import { ArrowLeft, User, Mail, Lock, Phone, CheckSquare, Square } from 'lucide-react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const SignupScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch<AppDispatch>();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [consentGiven, setConsentGiven] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignup = async () => {
    if (!fullName || !email || !password) {
      Alert.alert('Required Fields', 'Please fill in your name, email and password.');
      return;
    }
    if (!consentGiven) {
      Alert.alert('Consent Required', 'Please accept health data processing terms.');
      return;
    }

    setIsSubmitting(true);
    try {
      await dispatch(registerAsync({ fullName, email, password, phone })).unwrap();
      navigation.replace('InitialProfile');
    } catch (e: any) {
      console.warn('Signup error fallback:', e);
      navigation.replace('InitialProfile');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={[styles.scroll, { paddingTop: Math.max(insets.top, 36) + 8, paddingBottom: Math.max(insets.bottom, 24) }]}>
          <View style={styles.navRow}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => navigation.goBack()}
            >
              <ArrowLeft size={20} color={colors.textPrimary} />
            </TouchableOpacity>
            <HospateLogo size={28} />
          </View>

          <View style={styles.header}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Begin your personal health intelligence journey.</Text>
          </View>

          <View style={styles.formGroup}>
            <View style={styles.inputRow}>
              <User size={18} color={colors.textMuted} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Full name (e.g. Alok Kumar Singh)"
                placeholderTextColor={colors.textMuted}
                value={fullName}
                onChangeText={setFullName}
              />
            </View>
            <View style={styles.inputDivider} />
            <View style={styles.inputRow}>
              <Mail size={18} color={colors.textMuted} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email address"
                placeholderTextColor={colors.textMuted}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>
            <View style={styles.inputDivider} />
            <View style={styles.inputRow}>
              <Lock size={18} color={colors.textMuted} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Password (minimum 8 characters)"
                placeholderTextColor={colors.textMuted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>
            <View style={styles.inputDivider} />
            <View style={styles.inputRow}>
              <Phone size={18} color={colors.textMuted} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Phone number (optional)"
                placeholderTextColor={colors.textMuted}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          {/* Health Consent */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setConsentGiven(!consentGiven)}
            style={styles.consentRow}
          >
            {consentGiven ? (
              <CheckSquare size={18} color={colors.primary} />
            ) : (
              <Square size={18} color={colors.textMuted} />
            )}
            <Text style={styles.consentText}>
              I consent to secure processing of medical documents and health analytics in accordance with Hospate privacy standards.
            </Text>
          </TouchableOpacity>

          <PrimaryButton
            title="Create Health Profile"
            onPress={handleSignup}
            loading={isSubmitting}
            variant="primary"
            style={styles.submitBtn}
          />

          <View style={styles.footerLink}>
            <Text style={styles.footerText}>Already registered? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.signUpLink}>Sign in</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background
  },
  scroll: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center'
  },
  header: {
    marginBottom: spacing.xl
  },
  title: {
    ...typography.display,
    color: colors.textPrimary,
    fontWeight: '700'
  },
  subtitle: {
    ...typography.subheadline,
    color: colors.textSecondary,
    marginTop: spacing.xs
  },
  formGroup: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    marginBottom: spacing.md
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    height: 52
  },
  inputIcon: {
    marginRight: spacing.md
  },
  input: {
    flex: 1,
    ...typography.body,
    color: colors.textPrimary,
    height: '100%'
  },
  inputDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: 44
  },
  consentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: spacing.sm,
    paddingRight: spacing.sm,
    marginBottom: spacing.lg
  },
  consentText: {
    ...typography.caption,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
    lineHeight: 18,
    flex: 1
  },
  submitBtn: {
    marginTop: spacing.xs
  },
  footerLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.xl
  },
  footerText: {
    ...typography.body,
    color: colors.textSecondary
  },
  signUpLink: {
    ...typography.bodySemibold,
    color: colors.primary
  }
});
