import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing, borderRadius } from '../theme/spacing';
import { MedicalRecord } from '@hospate/types';
import { FileText, Pill, Activity, ChevronRight, CheckCircle2 } from 'lucide-react-native';

interface RecordCardProps {
  record: MedicalRecord;
  onPress: (record: MedicalRecord) => void;
}

export const RecordCard: React.FC<RecordCardProps> = ({ record, onPress }) => {
  let icon = <FileText size={20} color={colors.primary} />;
  let typeLabel = 'LAB REPORT';
  let badgeColor = colors.primary;

  if (record.type === 'PRESCRIPTION') {
    icon = <Pill size={20} color={colors.dimensionMedication} />;
    typeLabel = 'PRESCRIPTION';
    badgeColor = colors.dimensionMedication;
  } else if (record.type === 'SCAN') {
    icon = <Activity size={20} color={colors.accent} />;
    typeLabel = 'SCAN / IMAGING';
    badgeColor = colors.accent;
  }

  const formattedDate = new Date(record.uploadedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onPress(record)}
      style={styles.card}
    >
      <View style={styles.iconContainer}>
        {icon}
      </View>

      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={[styles.typeLabel, { color: badgeColor }]}>{typeLabel}</Text>
          <Text style={styles.dateText}>{formattedDate}</Text>
        </View>

        <Text style={styles.title} numberOfLines={1}>{record.title}</Text>
        {record.subtitle ? (
          <Text style={styles.subtitle} numberOfLines={1}>{record.subtitle}</Text>
        ) : null}

        <View style={styles.badgeRow}>
          {record.parametersCount > 0 && (
            <View style={styles.statBadge}>
              <Text style={styles.statText}>{record.parametersCount} parameters</Text>
            </View>
          )}

          {record.insightsCount > 0 ? (
            <View style={[styles.statBadge, styles.insightBadge]}>
              <Text style={styles.insightText}>{record.insightsCount} insights</Text>
            </View>
          ) : (
            <View style={styles.statusVerified}>
              <CheckCircle2 size={12} color={colors.successText} />
              <Text style={styles.verifiedText}>Analyzed</Text>
            </View>
          )}
        </View>
      </View>

      <ChevronRight size={18} color={colors.textMuted} style={styles.chevron} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginHorizontal: spacing.lg,
    marginVertical: spacing.xs + 2,
    borderWidth: 1,
    borderColor: colors.border
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md
  },
  content: {
    flex: 1
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2
  },
  typeLabel: {
    ...typography.label,
    fontSize: 9
  },
  dateText: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 11
  },
  title: {
    ...typography.bodySemibold,
    color: colors.textPrimary,
    marginTop: 1
  },
  subtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 1
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs + 2
  },
  statBadge: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    marginRight: spacing.xs + 2
  },
  statText: {
    ...typography.caption,
    fontSize: 10,
    color: colors.textSecondary
  },
  insightBadge: {
    backgroundColor: colors.warningGlow
  },
  insightText: {
    ...typography.captionSemibold,
    fontSize: 10,
    color: colors.warningText
  },
  statusVerified: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.successGlow,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm
  },
  verifiedText: {
    ...typography.caption,
    fontSize: 10,
    color: colors.successText,
    marginLeft: 3
  },
  chevron: {
    marginLeft: spacing.xs
  }
});
