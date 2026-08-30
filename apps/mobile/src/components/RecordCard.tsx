import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MedicalRecord } from '@hospate/types';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing, borderRadius } from '../theme/spacing';
import { StatusBadge } from './StatusBadge';
import { FileText, Pill, Stethoscope, ChevronRight, Activity } from 'lucide-react-native';

interface RecordCardProps {
  record: MedicalRecord;
  onPress: () => void;
}

export const RecordCard: React.FC<RecordCardProps> = ({ record, onPress }) => {
  const getIcon = () => {
    switch (record.type) {
      case 'PRESCRIPTION':
        return {
          icon: <Pill size={18} color="#FFFFFF" />,
          bg: colors.dimensionMedication
        };
      case 'CONSULTATION':
        return {
          icon: <Stethoscope size={18} color="#FFFFFF" />,
          bg: colors.primary
        };
      case 'LAB_REPORT':
      default:
        return {
          icon: <Activity size={18} color="#FFFFFF" />,
          bg: colors.accent
        };
    }
  };

  const iconConfig = getIcon();

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={styles.card}
    >
      <View style={[styles.iconBox, { backgroundColor: iconConfig.bg }]}>
        {iconConfig.icon}
      </View>

      <View style={styles.contentCol}>
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={1}>
            {record.title}
          </Text>
        </View>

        <Text style={styles.subtitle}>
          {record.source || 'Pathology Report'} • {record.uploadedAt ? new Date(record.uploadedAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recent'}
        </Text>

        <View style={styles.badgesRow}>
          {record.parametersCount ? (
            <Text style={styles.metricCount}>
              {record.parametersCount} Biomarkers Analyzed
            </Text>
          ) : null}
        </View>
      </View>

      <View style={styles.rightCol}>
        <StatusBadge status={record.status} />
        <ChevronRight size={16} color={colors.textMuted} style={styles.chevron} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.xs + 2,
    borderWidth: 1,
    borderColor: colors.border
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md
  },
  contentCol: {
    flex: 1,
    marginRight: spacing.sm
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  title: {
    ...typography.bodySemibold,
    color: colors.textPrimary,
    fontSize: 16
  },
  subtitle: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2
  },
  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4
  },
  metricCount: {
    ...typography.caption,
    fontSize: 12,
    color: colors.textSecondary
  },
  rightCol: {
    alignItems: 'flex-end',
    justifyContent: 'center'
  },
  chevron: {
    marginTop: 6
  }
});
