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
import { ArrowLeft, Sparkles, Mail, Lock } from 'lucide-react-native';

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
          {/* Back button */}
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <ArrowLeft size={22} color={colors.textPrimary} />
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={styles.title}>Welcome back</Text>
            <Text style={styles.subtitle}>Sign in to your Hospate health profile.</Text>
          </View>

          {/* Quick Demo Fill Card */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleFastDemo}
            style={styles.demoCard}
          >
            <View style={styles.demoHeader}>
              <Sparkles size={16} color={colors.accentPurple} />
              <Text style={styles.demoTitle}>QUICK DEMO ACCESS</Text>
            </View>
            <Text style={styles.demoDesc}>
              Tap here to instantly log into Alex Morgan's populated health profile.
            </Text>
          </TouchableOpacity>

          {/* Form */}
          <View style={styles.form}>
            <Text style={styles.inputLabel}>EMAIL OR PHONE</Text>
            <View style={styles.inputContainer}>
              <Mail size={18} color={colors.textMuted} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="demo@hospate.app"
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
                placeholder="••••••••"
                placeholderTextColor={colors.textMuted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            {error && (
              <Text style={styles.errorText}>{error}</Text>
            )}

            <PrimaryButton
              title="Sign In"
              onPress={handleLogin}
              loading={isLoading}
              size="lg"
              style={styles.submitBtn}
            />

            <View style={styles.footerLink}>
              <Text style={styles.footerText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                <Text style={styles.signUpLink}>Create Account</Text>
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
  demoCard: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    marginBottom: spacing.xl
  },
  demoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4
  },
  demoTitle: {
    ...typography.label,
    fontSize: 10,
    color: colors.accentPurple,
    marginLeft: 6
  },
  demoDesc: {
    ...typography.caption,
    color: colors.textSecondary,
    lineHeight: 16
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
  errorText: {
    ...typography.caption,
    color: colors.dangerText,
    marginTop: spacing.sm
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
