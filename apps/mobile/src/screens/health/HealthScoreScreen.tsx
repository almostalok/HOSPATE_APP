import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { fetchHealthScore } from '../../store/healthSlice';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import {
  ArrowLeft,
  Sparkles,
  TrendingUp,
  Heart,
  Activity,
  Apple,
  Footprints,
  Pill,
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-react-native';

export const HealthScoreScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { score } = useSelector((state: RootState) => state.health);

  useEffect(() => {
    dispatch(fetchHealthScore());
  }, []);

  const totalScore = score?.score || 82;
  const status = score?.status || 'GOOD';
  const delta = score?.changeDelta || 4;
  const dims = score?.dimensions || {
    cardiovascular: 86,
    metabolic: 79,
    nutrition: 74,
    lifestyle: 88,
    medicationAdherence: 91
  };

  const positives = score?.positiveFactors || [
    'Consistent medication adherence (92%)',
    'Normal oxygen-carrying Hemoglobin baseline',
    'Stable fasting glycemic profile (88 mg/dL)'
  ];

  const negatives = score?.negativeFactors || [
    'Vitamin D levels below recommended reference range (18 ng/mL)',
    'LDL cholesterol slightly elevated above optimal threshold (142 mg/dL)'
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ArrowLeft size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>AI HEALTH SCORE</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Score Hero Card */}
        <View style={styles.scoreHero}>
          <View style={styles.scoreBadge}>
            <Sparkles size={14} color={colors.primary} />
            <Text style={styles.scoreBadgeText}>COMPOSITE HEALTH RATING</Text>
          </View>

          <Text style={styles.scoreValue}>{totalScore}</Text>
          <View style={styles.statusRow}>
            <View style={styles.statusPill}>
              <Text style={styles.statusText}>{status}</Text>
            </View>
            <View style={styles.trendPill}>
              <TrendingUp size={12} color={colors.successText} />
              <Text style={styles.trendText}>+{delta} pts vs last month</Text>
            </View>
          </View>
        </View>

        {/* 5 Core Dimensions */}
        <Text style={styles.sectionHeader}>HEALTH DIMENSIONS</Text>

        <View style={styles.dimensionCard}>
          <View style={styles.dimRow}>
            <View style={[styles.dimIcon, { backgroundColor: 'rgba(239, 68, 68, 0.15)' }]}>
              <Heart size={18} color={colors.dimensionCardio} />
            </View>
            <View style={styles.dimInfo}>
              <View style={styles.dimTitleRow}>
                <Text style={styles.dimTitle}>Cardiovascular</Text>
                <Text style={styles.dimScore}>{dims.cardiovascular} / 100</Text>
              </View>
              <View style={styles.barTrack}>
                <View style={[styles.barFill, { width: `${dims.cardiovascular}%`, backgroundColor: colors.dimensionCardio }]} />
              </View>
              <Text style={styles.dimDetail}>Total Chol (215), LDL (142), HDL (48)</Text>
            </View>
          </View>
        </View>

        <View style={styles.dimensionCard}>
          <View style={styles.dimRow}>
            <View style={[styles.dimIcon, { backgroundColor: 'rgba(245, 158, 11, 0.15)' }]}>
              <Activity size={18} color={colors.dimensionMetabolic} />
            </View>
            <View style={styles.dimInfo}>
              <View style={styles.dimTitleRow}>
                <Text style={styles.dimTitle}>Metabolic & Glycemic</Text>
                <Text style={styles.dimScore}>{dims.metabolic} / 100</Text>
              </View>
              <View style={styles.barTrack}>
                <View style={[styles.barFill, { width: `${dims.metabolic}%`, backgroundColor: colors.dimensionMetabolic }]} />
              </View>
              <Text style={styles.dimDetail}>Fasting Glucose (88 mg/dL), HbA1c (5.4%)</Text>
            </View>
          </View>
        </View>

        <View style={styles.dimensionCard}>
          <View style={styles.dimRow}>
            <View style={[styles.dimIcon, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
              <Apple size={18} color={colors.dimensionNutrition} />
            </View>
            <View style={styles.dimInfo}>
              <View style={styles.dimTitleRow}>
                <Text style={styles.dimTitle}>Nutrition & Micronutrients</Text>
                <Text style={styles.dimScore}>{dims.nutrition} / 100</Text>
              </View>
              <View style={styles.barTrack}>
                <View style={[styles.barFill, { width: `${dims.nutrition}%`, backgroundColor: colors.dimensionNutrition }]} />
              </View>
              <Text style={styles.dimDetail}>Vitamin D (18 ng/mL [Low]), Vitamin B12 (420)</Text>
            </View>
          </View>
        </View>

        <View style={styles.dimensionCard}>
          <View style={styles.dimRow}>
            <View style={[styles.dimIcon, { backgroundColor: 'rgba(6, 182, 212, 0.15)' }]}>
              <Footprints size={18} color={colors.dimensionLifestyle} />
            </View>
            <View style={styles.dimInfo}>
              <View style={styles.dimTitleRow}>
                <Text style={styles.dimTitle}>Lifestyle & Physical Activity</Text>
                <Text style={styles.dimScore}>{dims.lifestyle} / 100</Text>
              </View>
              <View style={styles.barTrack}>
                <View style={[styles.barFill, { width: `${dims.lifestyle}%`, backgroundColor: colors.dimensionLifestyle }]} />
              </View>
              <Text style={styles.dimDetail}>Active physical baseline • Regular sleep</Text>
            </View>
          </View>
        </View>

        <View style={styles.dimensionCard}>
          <View style={styles.dimRow}>
            <View style={[styles.dimIcon, { backgroundColor: 'rgba(139, 92, 246, 0.15)' }]}>
              <Pill size={18} color={colors.dimensionMedication} />
            </View>
            <View style={styles.dimInfo}>
              <View style={styles.dimTitleRow}>
                <Text style={styles.dimTitle}>Medication Adherence</Text>
                <Text style={styles.dimScore}>{dims.medicationAdherence} / 100</Text>
              </View>
              <View style={styles.barTrack}>
                <View style={[styles.barFill, { width: `${dims.medicationAdherence}%`, backgroundColor: colors.dimensionMedication }]} />
              </View>
              <Text style={styles.dimDetail}>92% 7-day adherence rate on active doses</Text>
            </View>
          </View>
        </View>

        {/* What Changed? */}
        <Text style={[styles.sectionHeader, { marginTop: spacing.lg }]}>WHAT CHANGED?</Text>

        <View style={styles.factorsCard}>
          {positives.map((pos, idx) => (
            <View key={idx} style={styles.factorItem}>
              <CheckCircle size={16} color={colors.successText} />
              <Text style={styles.positiveText}>{pos}</Text>
            </View>
          ))}

          {negatives.map((neg, idx) => (
            <View key={idx} style={styles.factorItem}>
              <AlertTriangle size={16} color={colors.warningText} />
              <Text style={styles.negativeText}>{neg}</Text>
            </View>
          ))}
        </View>

        {/* Scoring Engine Formula Note */}
        <View style={styles.algorithmNote}>
          <Info size={16} color={colors.primary} />
          <Text style={styles.algorithmText}>
            Scoring Engine Formula: 25% Cardiovascular Biomarkers • 20% Metabolic Profile • 20% Nutrition • 20% Lifestyle • 15% Medication Adherence.
          </Text>
        </View>

        {/* Disclaimer */}
        <Text style={styles.disclaimer}>
          Hospate AI Health Score is an experimental health awareness indicator synthesized from available personal data. It does not constitute clinical diagnosis or medical judgment.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerTitle: {
    ...typography.label,
    fontSize: 13,
    color: colors.textPrimary,
    letterSpacing: 1
  },
  scroll: {
    padding: spacing.lg
  },
  scoreHero: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(14, 165, 233, 0.3)',
    marginBottom: spacing.lg
  },
  scoreBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm
  },
  scoreBadgeText: {
    ...typography.label,
    fontSize: 11,
    color: colors.primary,
    marginLeft: 6
  },
  scoreValue: {
    ...typography.heroScore,
    fontSize: 64,
    color: colors.textPrimary
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm
  },
  statusPill: {
    backgroundColor: colors.successGlow,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: 3,
    borderRadius: borderRadius.sm,
    marginRight: spacing.sm
  },
  statusText: {
    ...typography.label,
    color: colors.successText
  },
  trendPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.pill
  },
  trendText: {
    ...typography.captionSemibold,
    color: colors.successText,
    marginLeft: 4
  },
  sectionHeader: {
    ...typography.label,
    fontSize: 11,
    color: colors.textMuted,
    letterSpacing: 1,
    marginBottom: spacing.sm
  },
  dimensionCard: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border
  },
  dimRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  dimIcon: {
    width: 38,
    height: 38,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md
  },
  dimInfo: {
    flex: 1
  },
  dimTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4
  },
  dimTitle: {
    ...typography.bodySemibold,
    color: colors.textPrimary
  },
  dimScore: {
    ...typography.captionSemibold,
    color: colors.primary
  },
  barTrack: {
    width: '100%',
    height: 5,
    backgroundColor: colors.surface,
    borderRadius: 2.5,
    overflow: 'hidden',
    marginVertical: 4
  },
  barFill: {
    height: '100%',
    borderRadius: 2.5
  },
  dimDetail: {
    ...typography.caption,
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2
  },
  factorsCard: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md
  },
  factorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs + 2
  },
  positiveText: {
    ...typography.body,
    fontSize: 13,
    color: colors.textPrimary,
    marginLeft: spacing.sm,
    flex: 1
  },
  negativeText: {
    ...typography.body,
    fontSize: 13,
    color: colors.warningText,
    marginLeft: spacing.sm,
    flex: 1
  },
  algorithmNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(14, 165, 233, 0.08)',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(14, 165, 233, 0.2)',
    marginBottom: spacing.md
  },
  algorithmText: {
    ...typography.caption,
    fontSize: 11,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
    flex: 1,
    lineHeight: 16
  },
  disclaimer: {
    ...typography.caption,
    fontSize: 10,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.xxl
  }
});
