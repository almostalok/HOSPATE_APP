import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import {
  confirmReportAsync,
  updateStagingParameter
} from '../../store/recordsSlice';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { StatusBadge } from '../../components/StatusBadge';
import { PrimaryButton } from '../../components/PrimaryButton';
import { AcademicDebugModal } from '../../components/AcademicDebugModal';
import {
  ArrowLeft,
  CheckCircle,
  Terminal,
  Edit2,
  FileText,
  FileCheck,
  ShieldAlert
} from 'lucide-react-native';

export const ExtractionReviewScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { stagingExtraction } = useSelector((state: RootState) => state.records);
  const [debugModalVisible, setDebugModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!stagingExtraction) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <Text style={styles.errorText}>No extracted report in staging.</Text>
        <PrimaryButton
          title="Go Back"
          onPress={() => navigation.navigate('MedicalRecords')}
          style={{ marginTop: spacing.md }}
        />
      </SafeAreaView>
    );
  }

  const parameters = stagingExtraction.extractedParameters || [];

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      await dispatch(
        confirmReportAsync({
          title: stagingExtraction.title,
          type: stagingExtraction.type,
          parameters: stagingExtraction.extractedParameters,
          rawText: stagingExtraction.rawText,
          source: 'OCR Ingestion Pipeline'
        })
      ).unwrap();

      navigation.replace('AIAnalysisResult');
    } catch (e: any) {
      Alert.alert('Confirmation Error', e.message || 'Failed to save parameters');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ArrowLeft size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>EXTRACTION REVIEW</Text>
        <TouchableOpacity
          style={styles.auditBtn}
          onPress={() => setDebugModalVisible(true)}
        >
          <Terminal size={14} color={colors.textSecondary} />
          <Text style={styles.auditBtnText}>Audit</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Banner */}
        <View style={styles.banner}>
          <Text style={styles.bannerCount}>WE FOUND {parameters.length} PARAMETERS</Text>
          <Text style={styles.bannerSubtitle}>
            Review the extracted values and reference ranges. You can verify or edit values before saving to your health profile.
          </Text>
        </View>

        {/* Parameters List */}
        {parameters.map((p, idx) => (
          <View key={p.id || idx} style={styles.paramCard}>
            <View style={styles.paramTop}>
              <View style={styles.paramNameCol}>
                <Text style={styles.paramName}>{p.parameter}</Text>
                <Text style={styles.paramCategory}>{p.category || 'Biomarker'}</Text>
              </View>
              <StatusBadge status={p.status} />
            </View>

            <View style={styles.paramMid}>
              <View style={styles.valueBox}>
                <Text style={styles.boxLabel}>EXTRACTED VALUE</Text>
                <Text style={styles.paramValueText}>
                  {p.value} <Text style={styles.unitText}>{p.unit}</Text>
                </Text>
              </View>

              <View style={styles.refBox}>
                <Text style={styles.boxLabel}>REFERENCE RANGE</Text>
                <Text style={styles.refText}>{p.referenceText}</Text>
              </View>

              <View style={styles.confBox}>
                <Text style={styles.boxLabel}>CONFIDENCE</Text>
                <Text style={styles.confText}>{Math.round(p.confidence * 100)}%</Text>
              </View>
            </View>

            {p.clinicalNote ? (
              <View style={styles.noteBox}>
                <Text style={styles.noteText}>{p.clinicalNote}</Text>
              </View>
            ) : null}
          </View>
        ))}

        {/* Bottom Actions */}
        <View style={styles.actionSection}>
          <PrimaryButton
            title="Confirm & Save Health Records"
            onPress={handleConfirm}
            loading={isSubmitting}
            size="lg"
            icon={<FileCheck size={18} color="#FFFFFF" />}
            style={styles.confirmBtn}
          />

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setDebugModalVisible(true)}
            style={styles.inspectBtn}
          >
            <Terminal size={14} color={colors.textSecondary} />
            <Text style={styles.inspectText}>
              Inspect Pipeline Telemetry & Extraction Audit
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Academic Debug Inspector Modal */}
      <AcademicDebugModal
        visible={debugModalVisible}
        onClose={() => setDebugModalVisible(false)}
        auditData={stagingExtraction.debugAudit}
      />
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
    justifyContent: 'center',
    padding: spacing.xl
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
    fontSize: 12,
    color: colors.textPrimary,
    letterSpacing: 1
  },
  auditBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(6, 182, 212, 0.12)',
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.pill,
    borderWidth: 1,
    borderColor: 'rgba(6, 182, 212, 0.3)'
  },
  auditBtnText: {
    ...typography.captionSemibold,
    color: colors.accent,
    fontSize: 11,
    marginLeft: 4
  },
  scroll: {
    padding: spacing.lg
  },
  banner: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(14, 165, 233, 0.25)',
    marginBottom: spacing.lg
  },
  bannerCount: {
    ...typography.label,
    fontSize: 13,
    color: colors.primary,
    fontWeight: '800'
  },
  bannerSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 4,
    lineHeight: 18
  },
  paramCard: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border
  },
  paramTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm
  },
  paramNameCol: {
    flex: 1,
    marginRight: spacing.sm
  },
  paramName: {
    ...typography.bodySemibold,
    color: colors.textPrimary,
    fontSize: 15
  },
  paramCategory: {
    ...typography.caption,
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 1
  },
  paramMid: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    marginBottom: spacing.xs
  },
  valueBox: {
    flex: 1.2
  },
  refBox: {
    flex: 1.5,
    borderLeftWidth: 1,
    borderLeftColor: colors.border,
    paddingLeft: spacing.sm
  },
  confBox: {
    flex: 0.9,
    borderLeftWidth: 1,
    borderLeftColor: colors.border,
    paddingLeft: spacing.sm,
    alignItems: 'flex-end'
  },
  boxLabel: {
    ...typography.label,
    fontSize: 8,
    color: colors.textMuted,
    marginBottom: 2
  },
  paramValueText: {
    ...typography.h3,
    fontSize: 15,
    color: colors.textPrimary
  },
  unitText: {
    ...typography.caption,
    fontSize: 11,
    color: colors.textSecondary
  },
  refText: {
    ...typography.captionSemibold,
    fontSize: 11,
    color: colors.textSecondary
  },
  confText: {
    ...typography.captionSemibold,
    fontSize: 11,
    color: colors.successText
  },
  noteBox: {
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    borderRadius: borderRadius.sm,
    padding: spacing.xs + 2,
    marginTop: spacing.xs
  },
  noteText: {
    ...typography.caption,
    fontSize: 11,
    color: colors.textSecondary
  },
  actionSection: {
    marginTop: spacing.lg
  },
  confirmBtn: {
    marginBottom: spacing.sm
  },
  inspectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md
  },
  inspectText: {
    ...typography.captionSemibold,
    color: colors.accent,
    marginLeft: 6
  },
  errorText: {
    ...typography.bodySemibold,
    color: colors.dangerText
  }
});
