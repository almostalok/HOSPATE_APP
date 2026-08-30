import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { StatusBadge } from '../../components/StatusBadge';
import { PrimaryButton } from '../../components/PrimaryButton';
import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Sparkles,
  TrendingUp,
  Clock,
  ArrowRight,
  ShieldCheck
} from 'lucide-react-native';

export const AIAnalysisResultScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { selectedRecord } = useSelector((state: RootState) => state.records);
  const { score } = useSelector((state: RootState) => state.health);

  const parameters = selectedRecord?.extractedParameters || [];
  const insights = selectedRecord?.insights || [];

  const abnormalParams = parameters.filter(p => p.status !== 'NORMAL');
  const normalParams = parameters.filter(p => p.status === 'NORMAL');

  const handleAskBuddy = () => {
    navigation.navigate('AIHealthBuddy', {
      initialPrompt: `Can you explain the notable findings in my new "${selectedRecord?.title || 'Report'}"?`
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <ShieldCheck size={20} color={colors.successText} />
          <Text style={styles.headerTitle}>ANALYSIS COMPLETE</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Success Banner */}
        <View style={styles.heroBanner}>
          <View style={styles.successIconCircle}>
            <CheckCircle2 size={32} color={colors.successText} />
          </View>
          <Text style={styles.heroTitle}>Your report is ready.</Text>
          <Text style={styles.heroSubtitle}>
            Hospate AI analyzed {parameters.length} parameters and identified {abnormalParams.length} notable findings.
          </Text>
        </View>

        {/* Health Score Impact Card */}
        <View style={styles.scoreImpactCard}>
          <View style={styles.scoreImpactLeft}>
            <Sparkles size={16} color={colors.primary} />
            <View style={{ marginLeft: spacing.sm }}>
              <Text style={styles.scoreImpactTitle}>Health Score Synchronized</Text>
              <Text style={styles.scoreImpactSubtitle}>Updated to {score?.score || 82} / 100 ({score?.status || 'GOOD'})</Text>
            </View>
          </View>
          <View style={styles.scoreDeltaPill}>
            <TrendingUp size={12} color={colors.successText} />
            <Text style={styles.scoreDeltaText}>+4 pts</Text>
          </View>
        </View>

        {/* Section 1: Notable Findings Requiring Attention */}
        {abnormalParams.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>NOTABLE FINDINGS ({abnormalParams.length})</Text>

            {abnormalParams.map((p, idx) => {
              const isDanger = p.status === 'CRITICAL_HIGH' || p.status === 'CRITICAL_LOW';
              return (
                <View
                  key={p.id || idx}
                  style={[styles.findingCard, isDanger ? styles.dangerBorder : styles.warningBorder]}
                >
                  <View style={styles.findingTop}>
                    <View style={styles.findingLeft}>
                      {isDanger ? (
                        <AlertCircle size={16} color={colors.dangerText} />
                      ) : (
                        <AlertTriangle size={16} color={colors.warningText} />
                      )}
                      <Text style={styles.paramName}>{p.parameter}</Text>
                    </View>
                    <StatusBadge status={p.status} />
                  </View>

                  <View style={styles.valueRow}>
                    <Text style={styles.valText}>
                      {p.value} <Text style={styles.unitText}>{p.unit}</Text>
                    </Text>
                    <Text style={styles.refText}>Ref Target: {p.referenceText}</Text>
                  </View>

                  <Text style={styles.clinicalDesc}>
                    {p.clinicalNote || 'Above or below established clinical reference threshold.'}
                  </Text>
                </View>
              );
            })}
          </View>
        )}

        {/* Section 2: Normal Parameters */}
        {normalParams.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>NORMAL PARAMETERS ({normalParams.length})</Text>
            <View style={styles.normalGrid}>
              {normalParams.map((p, idx) => (
                <View key={p.id || idx} style={styles.normalChip}>
                  <CheckCircle2 size={12} color={colors.successText} />
                  <Text style={styles.normalName}>{p.parameter}</Text>
                  <Text style={styles.normalVal}>{p.value} {p.unit}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Doctor Talking Points Note */}
        <View style={styles.doctorNote}>
          <Text style={styles.doctorNoteTitle}>DOCTOR TALKING POINTS PREPARED</Text>
          <Text style={styles.doctorNoteDesc}>
            These findings have been formatted with non-diagnostic language ready for clinical review during your consultation.
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionSection}>
          <PrimaryButton
            title="Ask AI Health Buddy to Explain"
            onPress={handleAskBuddy}
            variant="ai"
            size="lg"
            icon={<Sparkles size={18} color="#FFFFFF" />}
            style={styles.buddyBtn}
          />

          <PrimaryButton
            title="View in Health Timeline"
            onPress={() => navigation.navigate('HealthTimeline')}
            variant="secondary"
            size="md"
            icon={<Clock size={16} color={colors.textPrimary} />}
            style={styles.timelineBtn}
          />

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.navigate('HomeTab')}
            style={styles.homeLink}
          >
            <Text style={styles.homeLinkText}>Return to Home Dashboard</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
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
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  headerTitle: {
    ...typography.label,
    fontSize: 12,
    color: colors.successText,
    marginLeft: spacing.xs + 2,
    letterSpacing: 1
  },
  scroll: {
    padding: spacing.lg
  },
  heroBanner: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    marginBottom: spacing.md
  },
  successIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.successGlow,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md
  },
  heroTitle: {
    ...typography.h1,
    fontSize: 24,
    color: colors.textPrimary
  },
  heroSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xs,
    lineHeight: 20
  },
  scoreImpactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg
  },
  scoreImpactLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  scoreImpactTitle: {
    ...typography.bodySemibold,
    color: colors.textPrimary
  },
  scoreImpactSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 1
  },
  scoreDeltaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.successGlow,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.pill
  },
  scoreDeltaText: {
    ...typography.captionSemibold,
    color: colors.successText,
    marginLeft: 3
  },
  section: {
    marginBottom: spacing.lg
  },
  sectionTitle: {
    ...typography.label,
    fontSize: 11,
    color: colors.textMuted,
    letterSpacing: 1,
    marginBottom: spacing.sm
  },
  findingCard: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1
  },
  warningBorder: {
    borderColor: 'rgba(245, 158, 11, 0.35)'
  },
  dangerBorder: {
    borderColor: 'rgba(239, 68, 68, 0.4)'
  },
  findingTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs + 2
  },
  findingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: spacing.sm
  },
  paramName: {
    ...typography.bodySemibold,
    color: colors.textPrimary,
    marginLeft: spacing.xs + 2
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    marginVertical: spacing.xs
  },
  valText: {
    ...typography.h3,
    fontSize: 16,
    color: colors.textPrimary
  },
  unitText: {
    ...typography.caption,
    color: colors.textSecondary
  },
  refText: {
    ...typography.caption,
    color: colors.textMuted
  },
  clinicalDesc: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    lineHeight: 16
  },
  normalGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  normalChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceElevated,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs + 2,
    borderRadius: borderRadius.md,
    marginRight: spacing.xs + 2,
    marginBottom: spacing.xs + 2,
    borderWidth: 1,
    borderColor: colors.border
  },
  normalName: {
    ...typography.captionSemibold,
    color: colors.textPrimary,
    marginLeft: 4,
    marginRight: 6
  },
  normalVal: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 10
  },
  doctorNote: {
    backgroundColor: 'rgba(14, 165, 233, 0.08)',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(14, 165, 233, 0.25)',
    marginBottom: spacing.lg
  },
  doctorNoteTitle: {
    ...typography.label,
    fontSize: 9,
    color: colors.primary,
    marginBottom: 4
  },
  doctorNoteDesc: {
    ...typography.caption,
    color: colors.textSecondary,
    lineHeight: 16
  },
  actionSection: {
    marginTop: spacing.xs
  },
  buddyBtn: {
    marginBottom: spacing.sm
  },
  timelineBtn: {
    marginBottom: spacing.md
  },
  homeLink: {
    alignItems: 'center',
    paddingVertical: spacing.sm
  },
  homeLinkText: {
    ...typography.bodyMedium,
    color: colors.textSecondary
  }
});
