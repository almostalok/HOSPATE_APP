import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Platform } from 'react-native';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store/store';
import { demoLoginAsync } from '../../store/authSlice';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { PrimaryButton } from '../../components/PrimaryButton';
import { HospateLogo } from '../../components/HospateLogo';
import { Activity, Shield, FileText, Heart } from 'lucide-react-native';

export const WelcomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleDemoLogin = async () => {
    try {
      await dispatch(demoLoginAsync()).unwrap();
      navigation.replace('MainTabs');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Brand Header */}
        <View style={styles.brandRow}>
          <HospateLogo size={34} />
          <Text style={styles.brandName}>Hospate</Text>
        </View>

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Text style={styles.headline}>
            Your health records,{'\n'}
            <Text style={{ color: colors.primary }}>organized & clear.</Text>
          </Text>

          <Text style={styles.subheadline}>
            Understand your lab reports, track key vital parameters, and explore health trends with structured clinical intelligence.
          </Text>
        </View>

        {/* Apple HIG Feature Inset Group */}
        <View style={styles.featuresList}>
          <View style={styles.featureItem}>
            <View style={[styles.featureIcon, { backgroundColor: colors.primary }]}>
              <FileText size={18} color="#FFFFFF" />
            </View>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Lab Report Digitization</Text>
              <Text style={styles.featureDesc}>Extract and organize biomarkers into clear reference ranges</Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <View style={[styles.featureIcon, { backgroundColor: colors.success }]}>
              <Activity size={18} color="#FFFFFF" />
            </View>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Personal Health Score</Text>
              <Text style={styles.featureDesc}>Holistic tracking across cardiovascular, metabolic and lifestyle metrics</Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <View style={[styles.featureIcon, { backgroundColor: colors.brandNavy }]}>
              <Heart size={18} color="#FFFFFF" />
            </View>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Health Intelligence Buddy</Text>
              <Text style={styles.featureDesc}>Clear explanations grounded strictly in your personal records</Text>
            </View>
          </View>
        </View>

        {/* Action Section */}
        <View style={styles.buttonSection}>
          <PrimaryButton
            title="Fast Demo Access (Alex Morgan)"
            onPress={handleDemoLogin}
            variant="primary"
            style={styles.demoBtn}
          />

          <PrimaryButton
            title="Sign In with Email"
            onPress={() => navigation.navigate('Login')}
            variant="secondary"
            style={styles.mainBtn}
          />

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.navigate('Signup')}
            style={styles.loginLink}
          >
            <Text style={styles.loginLinkText}>
              Don't have an account? <Text style={{ color: colors.primary }}>Create Patient Profile</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: Platform.OS === 'ios' ? spacing.md : spacing.xl,
    paddingBottom: spacing.lg,
    justifyContent: 'space-between'
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  brandName: {
    ...typography.h2,
    fontWeight: '700',
    color: colors.textPrimary,
    marginLeft: spacing.sm + 2
  },
  heroSection: {
    marginTop: spacing.md
  },
  headline: {
    ...typography.display,
    color: colors.textPrimary,
    fontSize: 30,
    lineHeight: 36
  },
  subheadline: {
    ...typography.callout,
    color: colors.textSecondary,
    marginTop: spacing.sm + 2,
    lineHeight: 22
  },
  featuresList: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm + 2
  },
  featureIcon: {
    width: 36,
    height: 36,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md
  },
  featureText: {
    flex: 1
  },
  featureTitle: {
    ...typography.bodySemibold,
    color: colors.textPrimary,
    fontSize: 15
  },
  featureDesc: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
    lineHeight: 16
  },
  buttonSection: {
    marginTop: spacing.sm
  },
  demoBtn: {
    marginBottom: spacing.sm
  },
  mainBtn: {
    marginBottom: spacing.xs
  },
  loginLink: {
    alignItems: 'center',
    paddingVertical: spacing.sm
  },
  loginLinkText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontSize: 13
  }
});
