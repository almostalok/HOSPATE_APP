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
  Heart,
  Activity,
  Apple,
  Footprints,
  Pill,
  CheckCircle,
  AlertTriangle,
  Info,
  ArrowUpRight
} from 'lucide-react-native';

export const HealthScoreScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { score } = useSelector((state: RootState) => state.health);

  useEffect(() => {
    dispatch(fetchHealthScore());
  }, []);

  const totalScore = score?.score || 80;
  const status = score?.status || 'GOOD';
  const delta = score?.changeDelta || 4;
  const dims = score?.dimensions || {
    cardiovascular: 73,
    metabolic: 82,
    nutrition: 70,
    lifestyle: 88,
    medicationAdherence: 92
  };

  const positives = score?.positiveFactors || [
    'Consistent medication adherence (94%)',
    'Normal oxygen-carrying Hemoglobin baseline (14.2 g/dL)',
    'Stable fasting glycemic profile (88 mg/dL)'
  ];

  const negatives = score?.negativeFactors || [
    'Vitamin D3 levels below recommended reference range (18 ng/mL)',
    'LDL cholesterol slightly elevated above optimal threshold (142 mg/dL)'
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Apple Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ArrowLeft size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Health Score</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Score Hero Card */}
        <View style={styles.scoreHero}>
          <Text style={styles.scoreLabel}>COMPOSITE HEALTH SCORE</Text>
          <Text style={styles.scoreValue}>{totalScore}</Text>

          <View style={styles.statusRow}>
            <View style={styles.statusPill}>
              <Text style={styles.statusText}>{status}</Text>
            </View>
            <View style={styles.trendRow}>
              <ArrowUpRight size={14} color={colors.success} />
              <Text style={styles.trendText}>+{delta} pts this week</Text>
            </View>
          </View>
        </View>

        {/* 5 Core Dimensions */}
        <Text style={styles.sectionHeader}>HEALTH DIMENSIONS</Text>

        <View style={styles.dimensionCard}>
          <View style={styles.dimRow}>
            <View style={[styles.dimIcon, { backgroundColor: colors.dimensionCardio }]}>
              <Heart size={18} color="#FFFFFF" />
            </View>
            <View style={styles.dimInfo}>
              <View style={styles.dimTitleRow}>
                <Text style={styles.dimTitle}>Cardiovascular</Text>
                <Text style={styles.dimScore}>{dims.cardiovascular}%</Text>
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
            <View style={[styles.dimIcon, { backgroundColor: colors.dimensionMetabolic }]}>
              <Activity size={18} color="#FFFFFF" />
            </View>
            <View style={styles.dimInfo}>
              <View style={styles.dimTitleRow}>
                <Text style={styles.dimTitle}>Metabolic & Glycemic</Text>
                <Text style={styles.dimScore}>{dims.metabolic}%</Text>
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
            <View style={[styles.dimIcon, { backgroundColor: colors.dimensionNutrition }]}>
              <Apple size={18} color="#FFFFFF" />
            </View>
            <View style={styles.dimInfo}>
              <View style={styles.dimTitleRow}>
                <Text style={styles.dimTitle}>Nutrition & Micronutrients</Text>
                <Text style={styles.dimScore}>{dims.nutrition}%</Text>
              </View>
              <View style={styles.barTrack}>
                <View style={[styles.barFill, { width: `${dims.nutrition}%`, backgroundColor: colors.dimensionNutrition }]} />
              </View>
              <Text style={styles.dimDetail}>Vitamin D3 (18 ng/mL [Low]), Vitamin B12 (420 pg/mL)</Text>
            </View>
          </View>
        </View>

        <View style={styles.dimensionCard}>
          <View style={styles.dimRow}>
            <View style={[styles.dimIcon, { backgroundColor: colors.dimensionLifestyle }]}>
              <Footprints size={18} color="#FFFFFF" />
            </View>
            <View style={styles.dimInfo}>
              <View style={styles.dimTitleRow}>
                <Text style={styles.dimTitle}>Lifestyle & Activity</Text>
                <Text style={styles.dimScore}>{dims.lifestyle}%</Text>
              </View>
              <View style={styles.barTrack}>
                <View style={[styles.barFill, { width: `${dims.lifestyle}%`, backgroundColor: colors.dimensionLifestyle }]} />
              </View>
              <Text style={styles.dimDetail}>Moderate aerobic baseline • Consistent sleep</Text>
            </View>
          </View>
        </View>

        <View style={styles.dimensionCard}>
          <View style={styles.dimRow}>
            <View style={[styles.dimIcon, { backgroundColor: colors.dimensionMedication }]}>
              <Pill size={18} color="#FFFFFF" />
            </View>
            <View style={styles.dimInfo}>
              <View style={styles.dimTitleRow}>
                <Text style={styles.dimTitle}>Medication Adherence</Text>
                <Text style={styles.dimScore}>{dims.medicationAdherence}%</Text>
              </View>
              <View style={styles.barTrack}>
                <View style={[styles.barFill, { width: `${dims.medicationAdherence}%`, backgroundColor: colors.dimensionMedication }]} />
              </View>
              <Text style={styles.dimDetail}>94% 7-day adherence rate on active prescriptions</Text>
            </View>
          </View>
        </View>

        {/* Factors List */}
        <Text style={[styles.sectionHeader, { marginTop: spacing.lg }]}>FACTORS & HIGHLIGHTS</Text>

        <View style={styles.factorsCard}>
          {positives.map((pos, idx) => (
            <View key={idx} style={styles.factorItem}>
              <CheckCircle size={16} color={colors.success} />
              <Text style={styles.positiveText}>{pos}</Text>
            </View>
          ))}

          {negatives.map((neg, idx) => (
            <View key={idx} style={[styles.factorItem, { borderTopWidth: 1, borderTopColor: colors.border }]}>
              <AlertTriangle size={16} color={colors.warning} />
              <Text style={styles.negativeText}>{neg}</Text>
            </View>
          ))}
        </View>

        {/* Formula summary */}
        <View style={styles.algorithmNote}>
          <Info size={16} color={colors.primary} />
          <Text style={styles.algorithmText}>
            Weighted scoring: 25% Cardiovascular • 20% Metabolic • 20% Nutrition • 20% Lifestyle • 15% Medication Adherence.
          </Text>
        </View>

        {/* Disclaimer */}
        <Text style={styles.disclaimer}>
          Hospate Health Score is a personal tracking index synthesized from laboratory findings and daily logs. It is not a clinical diagnosis.
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
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerTitle: {
    ...typography.headline,
    color: colors.textPrimary,
    fontSize: 16
  },
  scroll: {
    padding: spacing.lg
  },
  scoreHero: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg
  },
  scoreLabel: {
    ...typography.label,
    fontSize: 11,
    color: colors.textMuted,
    letterSpacing: 0.5,
    marginBottom: spacing.xs
  },
  scoreValue: {
    ...typography.heroScore,
    fontSize: 60,
    color: colors.textPrimary,
    fontWeight: '700'
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm
  },
  statusPill: {
    backgroundColor: 'rgba(48, 209, 88, 0.14)',
    paddingHorizontal: spacing.md,
    paddingVertical: 3,
    borderRadius: borderRadius.pill,
    marginRight: spacing.sm
  },
  statusText: {
    ...typography.captionSemibold,
    color: colors.success,
    fontSize: 12
  },
  trendRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  trendText: {
    ...typography.caption,
    color: colors.success,
    marginLeft: 3,
    fontSize: 12
  },
  sectionHeader: {
    ...typography.label,
    fontSize: 11,
    color: colors.textSecondary,
    letterSpacing: 0.5,
    marginBottom: spacing.sm
  },
  dimensionCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.xs + 2,
    borderWidth: 1,
    borderColor: colors.border
  },
  dimRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  dimIcon: {
    width: 36,
    height: 36,
    borderRadius: 9,
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
    color: colors.textPrimary,
    fontSize: 15
  },
  dimScore: {
    ...typography.captionSemibold,
    color: colors.primary,
    fontSize: 13
  },
  barTrack: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 2,
    overflow: 'hidden',
    marginVertical: 4
  },
  barFill: {
    height: '100%',
    borderRadius: 2
  },
  dimDetail: {
    ...typography.caption,
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2
  },
  factorsCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md
  },
  factorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm
  },
  positiveText: {
    ...typography.body,
    fontSize: 14,
    color: colors.textPrimary,
    marginLeft: spacing.sm,
    flex: 1
  },
  negativeText: {
    ...typography.body,
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
    flex: 1
  },
  algorithmNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md
  },
  algorithmText: {
    ...typography.caption,
    fontSize: 12,
    color: colors.textMuted,
    marginLeft: spacing.sm,
    flex: 1,
    lineHeight: 17
  },
  disclaimer: {
    ...typography.caption,
    fontSize: 11,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.xxl
  }
});
