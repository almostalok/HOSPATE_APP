import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  RefreshControl
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { fetchMedications, markMedicationTaken } from '../../store/medicationsSlice';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { PrimaryButton } from '../../components/PrimaryButton';
import {
  Pill,
  CheckCircle,
  Clock,
  Check,
  TrendingUp,
  Plus,
  Calendar,
  AlertCircle
} from 'lucide-react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const MedicationsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch<AppDispatch>();
  const { medications, todayLogs, adherenceRate, isLoading } = useSelector(
    (state: RootState) => state.medications
  );

  useEffect(() => {
    dispatch(fetchMedications());
  }, []);

  const handleToggleTaken = (logId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'TAKEN' ? 'MISSED' : 'TAKEN';
    dispatch(markMedicationTaken({ id: logId, status: nextStatus }));
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 14) + 4 }]}>
        <View>
          <Text style={styles.headerTitle}>Medications</Text>
          <Text style={styles.headerSubtitle}>Active schedules & adherence tracking</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={() => dispatch(fetchMedications())}
            tintColor={colors.primary}
          />
        }
      >
        {/* Adherence Hero Card */}
        <View style={styles.adherenceCard}>
          <View style={styles.adherenceLeft}>
            <Text style={styles.adherenceScore}>{Math.round(adherenceRate * 100)}%</Text>
            <View style={styles.adherenceMeta}>
              <Text style={styles.adherenceTitle}>7-Day Adherence</Text>
              <Text style={styles.adherenceSubtitle}>Excellent consistency</Text>
            </View>
          </View>
          <View style={styles.adherencePill}>
            <TrendingUp size={12} color={colors.successText} />
            <Text style={styles.adherencePillText}>Optimal</Text>
          </View>
        </View>

        {/* Section 1: Today's Schedule */}
        <Text style={styles.sectionHeader}>TODAY'S SCHEDULE (AUG 30)</Text>

        {todayLogs.map((log) => {
          const isTaken = log.status === 'TAKEN';
          return (
            <View key={log.id} style={styles.logCard}>
              <View style={styles.logLeft}>
                <View
                  style={[
                    styles.logIconBox,
                    isTaken ? styles.logIconTaken : styles.logIconPending
                  ]}
                >
                  {isTaken ? (
                    <Check size={18} color={colors.successText} />
                  ) : (
                    <Clock size={18} color={colors.warningText} />
                  )}
                </View>

                <View style={styles.logDetails}>
                  <Text style={styles.logName}>{log.medicationName}</Text>
                  <Text style={styles.logDosage}>
                    {log.dosage} • {log.scheduledTime}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => handleToggleTaken(log.id, log.status)}
                style={[
                  styles.takeBtn,
                  isTaken ? styles.takeBtnTaken : styles.takeBtnPending
                ]}
              >
                <Text
                  style={[
                    styles.takeBtnText,
                    isTaken ? styles.takeTextTaken : styles.takeTextPending
                  ]}
                >
                  {isTaken ? 'Taken' : 'Mark Taken'}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}

        {/* Section 2: Active Prescriptions */}
        <Text style={[styles.sectionHeader, { marginTop: spacing.lg }]}>
          ACTIVE PRESCRIPTIONS ({medications.length})
        </Text>

        {medications.map((med) => (
          <View key={med.id} style={styles.medCard}>
            <View style={styles.medTop}>
              <View style={styles.medIconBox}>
                <Pill size={18} color={colors.dimensionMedication} />
              </View>
              <View style={styles.medMain}>
                <Text style={styles.medName}>{med.name}</Text>
                <Text style={styles.medGeneric}>{med.genericName}</Text>
              </View>
              <View style={styles.adherenceBadge}>
                <Text style={styles.adherenceBadgeText}>
                  {Math.round(med.adherenceRate * 100)}%
                </Text>
              </View>
            </View>

            <View style={styles.medMetaRow}>
              <View style={styles.metaCol}>
                <Text style={styles.metaLabel}>DOSAGE</Text>
                <Text style={styles.metaVal}>{med.dosage}</Text>
              </View>
              <View style={styles.metaCol}>
                <Text style={styles.metaLabel}>FREQUENCY</Text>
                <Text style={styles.metaVal}>{med.frequency}</Text>
              </View>
              <View style={styles.metaCol}>
                <Text style={styles.metaLabel}>PRESCRIBED BY</Text>
                <Text style={styles.metaVal}>{med.prescribedBy || 'Physician'}</Text>
              </View>
            </View>

            {med.instructions ? (
              <Text style={styles.instructionsText}>
                Instructions: {med.instructions}
              </Text>
            ) : null}
          </View>
        ))}

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
    paddingTop: spacing.md,
    paddingBottom: spacing.sm
  },
  headerTitle: {
    ...typography.h1,
    fontSize: 24,
    color: colors.textPrimary
  },
  headerSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2
  },
  scroll: {
    padding: spacing.lg
  },
  adherenceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg
  },
  adherenceLeft: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  adherenceScore: {
    ...typography.heroScore,
    fontSize: 40,
    color: colors.textPrimary,
    marginRight: spacing.md
  },
  adherenceMeta: {
    justifyContent: 'center'
  },
  adherenceTitle: {
    ...typography.bodySemibold,
    color: colors.textPrimary
  },
  adherenceSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2
  },
  adherencePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.successGlow,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.pill
  },
  adherencePillText: {
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
  logCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.xs + 2,
    borderWidth: 1,
    borderColor: colors.border
  },
  logLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  logIconBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md
  },
  logIconTaken: {
    backgroundColor: colors.successGlow
  },
  logIconPending: {
    backgroundColor: colors.warningGlow
  },
  logDetails: {
    flex: 1
  },
  logName: {
    ...typography.bodySemibold,
    color: colors.textPrimary
  },
  logDosage: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2
  },
  takeBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: borderRadius.pill,
    borderWidth: 1
  },
  takeBtnPending: {
    backgroundColor: 'rgba(14, 165, 233, 0.12)',
    borderColor: colors.primary
  },
  takeBtnTaken: {
    backgroundColor: colors.successGlow,
    borderColor: 'rgba(16, 185, 129, 0.4)'
  },
  takeBtnText: {
    ...typography.captionSemibold,
    fontSize: 11
  },
  takeTextPending: {
    color: colors.primary
  },
  takeTextTaken: {
    color: colors.successText
  },
  medCard: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border
  },
  medTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm
  },
  medIconBox: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.md,
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md
  },
  medMain: {
    flex: 1
  },
  medName: {
    ...typography.bodySemibold,
    color: colors.textPrimary
  },
  medGeneric: {
    ...typography.caption,
    color: colors.textMuted
  },
  adherenceBadge: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm
  },
  adherenceBadgeText: {
    ...typography.captionSemibold,
    color: colors.successText,
    fontSize: 11
  },
  medMetaRow: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    marginBottom: spacing.xs
  },
  metaCol: {
    flex: 1
  },
  metaLabel: {
    ...typography.label,
    fontSize: 8,
    color: colors.textMuted
  },
  metaVal: {
    ...typography.captionSemibold,
    color: colors.textSecondary,
    marginTop: 2
  },
  instructionsText: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 4,
    fontStyle: 'italic'
  }
});
