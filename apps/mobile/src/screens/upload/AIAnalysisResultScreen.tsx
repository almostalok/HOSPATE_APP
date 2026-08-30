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
import { HospateLogo } from '../../components/HospateLogo';
import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  ArrowUpRight,
  Clock,
  ShieldCheck,
  Stethoscope
} from 'lucide-react-native';

export const AIAnalysisResultScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { selectedRecord } = useSelector((state: RootState) => state.records);
  const { score } = useSelector((state: RootState) => state.health);

  const parameters = selectedRecord?.extractedParameters || [];
  const abnormalParams = parameters.filter(p => p.status !== 'NORMAL');
  const normalParams = parameters.filter(p => p.status === 'NORMAL');

  const handleAskBuddy = () => {
    navigation.navigate('AIHealthBuddy', {
      initialPrompt: `Can you explain the notable findings in my new "${selectedRecord?.title || 'Report'}"?`
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Apple Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <ShieldCheck size={18} color={colors.success} />
          <Text style={styles.headerTitle}>Report Processed</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Success Banner */}
        <View style={styles.heroBanner}>
          <View style={styles.successIconCircle}>
            <CheckCircle2 size={28} color="#FFFFFF" />
          </View>
          <Text style={styles.heroTitle}>Biomarkers Synchronized</Text>
          <Text style={styles.heroSubtitle}>
            Hospate extracted {parameters.length} biomarkers and identified {abnormalParams.length} notable flags.
          </Text>
        </View>

        {/* Health Score Impact Card */}
        <View style={styles.scoreImpactCard}>
          <View style={styles.scoreImpactLeft}>
            <HospateLogo size={22} />
            <View style={{ marginLeft: spacing.sm }}>
              <Text style={styles.scoreImpactTitle}>Health Score Synchronized</Text>
              <Text style={styles.scoreImpactSubtitle}>Updated to {score?.score || 80} / 100 ({score?.status || 'GOOD'})</Text>
            </View>
          </View>
          <View style={styles.scoreDeltaPill}>
            <ArrowUpRight size={13} color={colors.success} />
            <Text style={styles.scoreDeltaText}>+4 pts</Text>
          </View>
        </View>

        {/* Section 1: Notable Findings */}
        {abnormalParams.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>ATTENTION REQUIRED ({abnormalParams.length})</Text>

            {abnormalParams.map((p, idx) => {
              const isDanger = p.status === 'CRITICAL_HIGH' || p.status === 'CRITICAL_LOW' || p.status === 'HIGH';
              return (
                <View
                  key={p.id || idx}
                  style={[styles.findingCard, isDanger ? styles.dangerBorder : styles.warningBorder]}
                >
                  <View style={styles.findingTop}>
                    <View style={styles.findingLeft}>
                      {isDanger ? (
                        <AlertCircle size={16} color={colors.danger} />
                      ) : (
                        <AlertTriangle size={16} color={colors.warning} />
                      )}
                      <Text style={styles.paramName}>{p.parameter}</Text>
                    </View>
                    <StatusBadge status={p.status} />
                  </View>

                  <View style={styles.valueRow}>
                    <Text style={styles.valText}>
                      {p.value} <Text style={styles.unitText}>{p.unit}</Text>
                    </Text>
                    <Text style={styles.refText}>Target Range: {p.referenceText || '< 100'}</Text>
                  </View>

                  <Text style={styles.clinicalDesc}>
                    {p.clinicalNote || 'Measured biomarker is outside standard laboratory reference threshold.'}
                  </Text>
                </View>
              );
            })}
          </View>
        )}

        {/* Section 2: Normal Parameters */}
        {normalParams.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>OPTIMAL & IN-RANGE ({normalParams.length})</Text>
            <View style={styles.normalGrid}>
              {normalParams.map((p, idx) => (
                <View key={p.id || idx} style={styles.normalChip}>
                  <CheckCircle2 size={12} color={colors.success} />
                  <Text style={styles.normalName}>{p.parameter}</Text>
                  <Text style={styles.normalVal}>{p.value} {p.unit}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Doctor Consultation Ready */}
        <View style={styles.doctorNote}>
          <Stethoscope size={16} color={colors.primary} />
          <View style={{ marginLeft: spacing.sm, flex: 1 }}>
            <Text style={styles.doctorNoteTitle}>Physician Review Ready</Text>
            <Text style={styles.doctorNoteDesc}>
              These laboratory findings are de-identified and organized for review with your treating physician.
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionSection}>
          <PrimaryButton
            title="Ask Health Buddy to Explain"
            onPress={handleAskBuddy}
            variant="primary"
            size="lg"
            icon={<HospateLogo size={18} />}
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
            onPress={() => navigation.navigate('MainTabs')}
            style={styles.homeLink}
          >
            <Text style={styles.homeLinkText}>Return to Summary</Text>
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
    ...typography.headline,
    color: colors.textPrimary,
    fontSize: 16,
    marginLeft: 6
  },
  scroll: {
    padding: spacing.lg
  },
  heroBanner: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border
  },
  successIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm
  },
  heroTitle: {
    ...typography.h2,
    color: colors.textPrimary,
    fontWeight: '700'
  },
  heroSubtitle: {
    ...typography.subheadline,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 20
  },
  scoreImpactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border
  },
  scoreImpactLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  scoreImpactTitle: {
    ...typography.bodySemibold,
    color: colors.textPrimary,
    fontSize: 15
  },
  scoreImpactSubtitle: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2
  },
  scoreDeltaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(48, 209, 88, 0.12)',
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 4,
    borderRadius: borderRadius.pill
  },
  scoreDeltaText: {
    ...typography.captionSemibold,
    color: colors.success,
    fontSize: 11,
    marginLeft: 2
  },
  section: {
    marginBottom: spacing.lg
  },
  sectionTitle: {
    ...typography.label,
    fontSize: 11,
    color: colors.textSecondary,
    letterSpacing: 0.5,
    marginBottom: spacing.sm
  },
  findingCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1
  },
  dangerBorder: {
    borderColor: 'rgba(255, 69, 58, 0.35)'
  },
  warningBorder: {
    borderColor: 'rgba(255, 159, 10, 0.35)'
  },
  findingTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs
  },
  findingLeft: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  paramName: {
    ...typography.bodySemibold,
    color: colors.textPrimary,
    fontSize: 15,
    marginLeft: 6
  },
  valueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginVertical: 4
  },
  valText: {
    ...typography.h3,
    color: colors.textPrimary,
    fontWeight: '700'
  },
  unitText: {
    ...typography.caption,
    color: colors.textMuted,
    fontWeight: '400'
  },
  refText: {
    ...typography.caption,
    color: colors.textSecondary
  },
  clinicalDesc: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 4,
    lineHeight: 16
  },
  normalGrid: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border
  },
  normalChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs + 2
  },
  normalName: {
    ...typography.body,
    fontSize: 14,
    color: colors.textPrimary,
    marginLeft: 6,
    flex: 1
  },
  normalVal: {
    ...typography.captionSemibold,
    color: colors.textSecondary,
    fontSize: 13
  },
  doctorNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border
  },
  doctorNoteTitle: {
    ...typography.bodySemibold,
    fontSize: 13,
    color: colors.textPrimary
  },
  doctorNoteDesc: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
    lineHeight: 16
  },
  actionSection: {
    marginTop: spacing.xs
  },
  buddyBtn: {
    marginBottom: spacing.sm
  },
  timelineBtn: {
    marginBottom: spacing.sm
  },
  homeLink: {
    alignItems: 'center',
    paddingVertical: spacing.sm
  },
  homeLinkText: {
    ...typography.bodySemibold,
    color: colors.primary,
    fontSize: 14
  }
});
