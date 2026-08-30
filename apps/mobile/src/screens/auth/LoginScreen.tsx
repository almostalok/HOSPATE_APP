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
import { loginAsync, demoLoginAsync } from '../../store/authSlice';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { PrimaryButton } from '../../components/PrimaryButton';
import { HospateLogo } from '../../components/HospateLogo';
import { ArrowLeft, Mail, Lock, UserCheck } from 'lucide-react-native';

export const LoginScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);

  const [email, setEmail] = useState('demo@hospate.app');
  const [password, setPassword] = useState('Hospate123!');

  const handleLogin = async () => {
    try {
      await dispatch(loginAsync({ email, password })).unwrap();
      navigation.replace('MainTabs');
    } catch (e: any) {
      Alert.alert('Login Failed', e.message || 'Invalid credentials');
    }
  };

  const handleFastDemo = async () => {
    try {
      await dispatch(demoLoginAsync()).unwrap();
      navigation.replace('MainTabs');
    } catch (e: any) {
      Alert.alert('Demo Login Failed', e.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scroll}>
          {/* Header Row */}
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
            <Text style={styles.title}>Sign In</Text>
            <Text style={styles.subtitle}>Access your Hospate health profile and medical history.</Text>
          </View>

          {/* Quick Demo Access Card */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleFastDemo}
            style={styles.demoCard}
          >
            <View style={styles.demoHeader}>
              <UserCheck size={16} color={colors.primary} />
              <Text style={styles.demoTitle}>QUICK DEMO ACCESS</Text>
            </View>
            <Text style={styles.demoDesc}>
              Instant 1-tap sign in with pre-populated patient profile (Alex Morgan).
            </Text>
          </TouchableOpacity>

          {/* Apple Form Group */}
          <View style={styles.formGroup}>
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
                placeholder="Password"
                placeholderTextColor={colors.textMuted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>
          </View>

          {error && <Text style={styles.errorText}>{error}</Text>}

          <PrimaryButton
            title="Sign In"
            onPress={handleLogin}
            loading={isLoading}
            variant="primary"
            style={styles.submitBtn}
          />

          <View style={styles.footerLink}>
            <Text style={styles.footerText}>New to Hospate? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <Text style={styles.signUpLink}>Create Patient Profile</Text>
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
  demoCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.xl
  },
  demoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4
  },
  demoTitle: {
    ...typography.label,
    fontSize: 11,
    color: colors.primary,
    marginLeft: 6
  },
  demoDesc: {
    ...typography.caption,
    color: colors.textSecondary,
    lineHeight: 18
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
  errorText: {
    ...typography.caption,
    color: colors.danger,
    marginTop: spacing.xs,
    marginBottom: spacing.sm
  },
  submitBtn: {
    marginTop: spacing.md
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
