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
import { ArrowLeft, User, Mail, Lock, Phone, CheckSquare, Square } from 'lucide-react-native';

export const SignupScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading } = useSelector((state: RootState) => state.auth);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [consentGiven, setConsentGiven] = useState(true);

  const handleSignup = async () => {
    if (!fullName || !email || !password) {
      Alert.alert('Required Fields', 'Please fill in your name, email and password.');
      return;
    }
    if (!consentGiven) {
      Alert.alert('Consent Required', 'Please accept health data processing terms.');
      return;
    }

    try {
      await dispatch(registerAsync({ fullName, email, password, phone })).unwrap();
      navigation.replace('InitialProfile');
    } catch (e: any) {
      Alert.alert('Registration Failed', e.message || 'Could not register');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scroll}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <ArrowLeft size={22} color={colors.textPrimary} />
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Begin your personal health intelligence journey.</Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.inputLabel}>FULL NAME</Text>
            <View style={styles.inputContainer}>
              <User size={18} color={colors.textMuted} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Alex Morgan"
                placeholderTextColor={colors.textMuted}
                value={fullName}
                onChangeText={setFullName}
              />
            </View>

            <Text style={[styles.inputLabel, { marginTop: spacing.md }]}>EMAIL</Text>
            <View style={styles.inputContainer}>
              <Mail size={18} color={colors.textMuted} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="alex@example.com"
                placeholderTextColor={colors.textMuted}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            <Text style={[styles.inputLabel, { marginTop: spacing.md }]}>PASSWORD</Text>
            <View style={styles.inputContainer}>
              <Lock size={18} color={colors.textMuted} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Minimum 8 characters"
                placeholderTextColor={colors.textMuted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <Text style={[styles.inputLabel, { marginTop: spacing.md }]}>PHONE (OPTIONAL)</Text>
            <View style={styles.inputContainer}>
              <Phone size={18} color={colors.textMuted} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="+1 (555) 000-0000"
                placeholderTextColor={colors.textMuted}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            </View>

            {/* Health Consent */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setConsentGiven(!consentGiven)}
              style={styles.consentRow}
            >
              {consentGiven ? (
                <CheckSquare size={20} color={colors.primary} />
              ) : (
                <Square size={20} color={colors.textMuted} />
              )}
              <Text style={styles.consentText}>
                I consent to local de-identified processing of medical documents and health analytics in accordance with Hospate privacy standards.
              </Text>
            </TouchableOpacity>

            <PrimaryButton
              title="Create Health Profile"
              onPress={handleSignup}
              loading={isLoading}
              size="lg"
              style={styles.submitBtn}
            />

            <View style={styles.footerLink}>
              <Text style={styles.footerText}>Already registered? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.signUpLink}>Sign in</Text>
              </TouchableOpacity>
            </View>
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
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg
  },
  header: {
    marginBottom: spacing.xl
  },
  title: {
    ...typography.h1,
    color: colors.textPrimary
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xs
  },
  form: {
    marginBottom: spacing.xl
  },
  inputLabel: {
    ...typography.label,
    fontSize: 11,
    color: colors.textMuted,
    marginBottom: spacing.xs
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md
  },
  inputIcon: {
    marginRight: spacing.sm
  },
  input: {
    flex: 1,
    ...typography.body,
    color: colors.textPrimary,
    paddingVertical: spacing.md
  },
  consentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: spacing.lg,
    paddingRight: spacing.sm
  },
  consentText: {
    ...typography.caption,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
    lineHeight: 16,
    flex: 1
  },
  submitBtn: {
    marginTop: spacing.xl
  },
  footerLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.lg
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
