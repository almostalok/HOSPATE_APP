import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { api } from '../../api/client';
import { MedicalRecord, LabParameter } from '@hospate/types';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { StatusBadge } from '../../components/StatusBadge';
import { PrimaryButton } from '../../components/PrimaryButton';
import {
  ArrowLeft,
  FileText,
  Sparkles,
  Calendar,
  Building,
  CheckCircle,
  AlertTriangle,
  FileCheck
} from 'lucide-react-native';

export const RecordDetailScreen: React.FC<{ route: any; navigation: any }> = ({
  route,
  navigation
}) => {
  const { recordId } = route.params || {};
  const [record, setRecord] = useState<MedicalRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        if (recordId) {
          const res = await api.getRecordById(recordId);
          setRecord(res.record || (res as any) || null);
        }
      } catch (e) {
        console.warn(e);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [recordId]);

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  if (!record) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <Text style={styles.errorText}>Record not found</Text>
      </SafeAreaView>
    );
  }

  const parameters = record.extractedParameters || [];
  const insights = record.insights || [];

  const handleAskBuddy = () => {
    navigation.navigate('AIHealthBuddy', {
      initialPrompt: `Can you explain the results of my "${record.title}" report?`
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ArrowLeft size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>RECORD DETAILS</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Record Overview Card */}
        <View style={styles.overviewCard}>
          <View style={styles.topRow}>
            <View style={styles.typeBadge}>
              <Text style={styles.typeText}>{record.type.replace('_', ' ')}</Text>
            </View>
            <Text style={styles.dateText}>
              {new Date(record.uploadedAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </Text>
          </View>

          <Text style={styles.title}>{record.title}</Text>
          {record.subtitle ? <Text style={styles.subtitle}>{record.subtitle}</Text> : null}

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Building size={14} color={colors.textMuted} />
              <Text style={styles.metaText}>{record.source || 'Pathology Lab'}</Text>
            </View>
            <View style={styles.metaItem}>
              <FileCheck size={14} color={colors.successText} />
              <Text style={styles.metaText}>Verified by Hospate OCR</Text>
            </View>
          </View>
        </View>

        {/* AI Health Buddy Action Banner */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleAskBuddy}
          style={styles.buddyBanner}
        >
          <Sparkles size={18} color="#FFFFFF" />
          <View style={styles.buddyTextCol}>
            <Text style={styles.buddyTitle}>Explain this report with AI Health Buddy</Text>
            <Text style={styles.buddySubtitle}>Get grounded, plain-language insights on these findings</Text>
          </View>
        </TouchableOpacity>

        {/* Parameters Section */}
        {parameters.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>EXTRACTED PARAMETERS ({parameters.length})</Text>
            </View>

            <View style={styles.paramTable}>
              {parameters.map((param, idx) => (
                <View
                  key={param.id || idx}
                  style={[styles.paramRow, idx !== parameters.length - 1 && styles.paramRowBorder]}
                >
                  <View style={styles.paramMain}>
                    <Text style={styles.paramName}>{param.parameter}</Text>
                    <Text style={styles.paramRef}>
                      Ref: {param.referenceText || `${param.referenceLow} - ${param.referenceHigh} ${param.unit}`}
                    </Text>
                  </View>

                  <View style={styles.paramResult}>
                    <Text style={styles.paramVal}>
                      {param.value} <Text style={styles.paramUnitText}>{param.unit}</Text>
                    </Text>
                    <StatusBadge status={param.status} size="sm" />
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Generated Insights */}
        {insights.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>ANALYSIS & RECOMMENDATIONS</Text>
            {insights.map((ins) => (
              <View key={ins.id} style={styles.insightBox}>
                <View style={styles.insightHeader}>
                  <AlertTriangle size={16} color={colors.warningText} />
                  <Text style={styles.insightTitle}>{ins.title}</Text>
                </View>
                <Text style={styles.insightBody}>{ins.interpretation}</Text>
                {ins.recommendation ? (
                  <View style={styles.recBox}>
                    <Text style={styles.recLabel}>ACTIONABLE GUIDANCE:</Text>
                    <Text style={styles.recText}>{ins.recommendation}</Text>
                  </View>
                ) : null}
              </View>
            ))}
          </View>
        )}

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
  center: {
    alignItems: 'center',
    justifyContent: 'center'
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
  overviewCard: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs
  },
  typeBadge: {
    backgroundColor: colors.primaryGlow,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.sm
  },
  typeText: {
    ...typography.label,
    fontSize: 10,
    color: colors.primary
  },
  dateText: {
    ...typography.caption,
    color: colors.textMuted
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
    marginTop: spacing.xs
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: 2
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.lg
  },
  metaText: {
    ...typography.caption,
    color: colors.textSecondary,
    marginLeft: 4
  },
  buddyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accentPurple,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg
  },
  buddyTextCol: {
    marginLeft: spacing.md,
    flex: 1
  },
  buddyTitle: {
    ...typography.bodySemibold,
    color: '#FFFFFF'
  },
  buddySubtitle: {
    ...typography.caption,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 1
  },
  section: {
    marginBottom: spacing.lg
  },
  sectionHeader: {
    marginBottom: spacing.xs + 2
  },
  sectionTitle: {
    ...typography.label,
    fontSize: 11,
    color: colors.textMuted,
    letterSpacing: 1,
    marginBottom: spacing.xs
  },
  paramTable: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border
  },
  paramRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md
  },
  paramRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },
  paramMain: {
    flex: 1,
    marginRight: spacing.md
  },
  paramName: {
    ...typography.bodySemibold,
    color: colors.textPrimary
  },
  paramRef: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2
  },
  paramResult: {
    alignItems: 'flex-end'
  },
  paramVal: {
    ...typography.h3,
    fontSize: 15,
    color: colors.textPrimary,
    marginBottom: 2
  },
  paramUnitText: {
    ...typography.caption,
    color: colors.textSecondary
  },
  insightBox: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    marginBottom: spacing.sm
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs
  },
  insightTitle: {
    ...typography.bodySemibold,
    color: colors.textPrimary,
    marginLeft: spacing.xs + 2
  },
  insightBody: {
    ...typography.body,
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18
  },
  recBox: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.sm,
    padding: spacing.sm,
    marginTop: spacing.sm
  },
  recLabel: {
    ...typography.label,
    fontSize: 9,
    color: colors.primary,
    marginBottom: 2
  },
  recText: {
    ...typography.caption,
    color: colors.textSecondary,
    lineHeight: 16
  },
  errorText: {
    ...typography.bodySemibold,
    color: colors.dangerText
  }
});
