import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store/store';
import { demoLoginAsync } from '../../store/authSlice';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { PrimaryButton } from '../../components/PrimaryButton';
import { Sparkles, Shield, Activity, FileCheck } from 'lucide-react-native';

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
        {/* Brand Badge */}
        <View style={styles.brandRow}>
          <View style={styles.logoBadge}>
            <Sparkles size={16} color="#FFFFFF" />
          </View>
          <Text style={styles.brandName}>HOSPATE</Text>
        </View>

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Text style={styles.headline}>
            Your health.{'\n'}
            <Text style={{ color: colors.primary }}>Finally in one place.</Text>
          </Text>

          <Text style={styles.subheadline}>
            Understand your lab reports, track your vital biomarkers and get clinically grounded insights from your medical data.
          </Text>
        </View>

        {/* Feature Highlights */}
        <View style={styles.featuresList}>
          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <FileCheck size={18} color={colors.primary} />
            </View>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Instant Report Ingestion</Text>
              <Text style={styles.featureDesc}>Automatic OCR & NLP parameter extraction</Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Activity size={18} color={colors.accent} />
            </View>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Continuous AI Health Score</Text>
              <Text style={styles.featureDesc}>Holistic tracking across 5 health dimensions</Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Shield size={18} color={colors.accentPurple} />
            </View>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>AI Health Buddy</Text>
              <Text style={styles.featureDesc}>Personalized answers grounded in your data</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonSection}>
          <PrimaryButton
            title="Fast Demo Access (Alex Morgan)"
            onPress={handleDemoLogin}
            variant="ai"
            size="lg"
            icon={<Sparkles size={18} color="#FFFFFF" />}
            style={styles.demoBtn}
          />

          <PrimaryButton
            title="Get Started"
            onPress={() => navigation.navigate('Signup')}
            size="lg"
            style={styles.mainBtn}
          />

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.navigate('Login')}
            style={styles.loginLink}
          >
            <Text style={styles.loginLinkText}>
              I already have an account • <Text style={{ color: colors.primary }}>Sign in</Text>
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
    paddingVertical: spacing.lg,
    justifyContent: 'space-between'
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm
  },
  logoBadge: {
    width: 32,
    height: 32,
    borderRadius: 9,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm
  },
  brandName: {
    ...typography.h3,
    letterSpacing: 1.5,
    fontWeight: '800',
    color: colors.textPrimary
  },
  heroSection: {
    marginTop: spacing.md
  },
  headline: {
    ...typography.display,
    color: colors.textPrimary,
    fontSize: 32,
    lineHeight: 38
  },
  subheadline: {
    ...typography.bodyLarge,
    color: colors.textSecondary,
    marginTop: spacing.md,
    lineHeight: 24
  },
  featuresList: {
    marginVertical: spacing.md
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md
  },
  featureIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md
  },
  featureText: {
    flex: 1
  },
  featureTitle: {
    ...typography.bodySemibold,
    color: colors.textPrimary
  },
  featureDesc: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 1
  },
  buttonSection: {
    marginTop: spacing.sm
  },
  demoBtn: {
    marginBottom: spacing.sm
  },
  mainBtn: {
    marginBottom: spacing.sm
  },
  loginLink: {
    alignItems: 'center',
    paddingVertical: spacing.sm
  },
  loginLinkText: {
    ...typography.bodyMedium,
    color: colors.textSecondary
  }
});
