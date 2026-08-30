import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { HealthScore } from '@hospate/types';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing, borderRadius } from '../theme/spacing';
import { ChevronRight, ArrowUpRight, ArrowDownRight } from 'lucide-react-native';

interface HealthScoreCardProps {
  scoreData?: HealthScore | null;
  onPress?: () => void;
}

export const HealthScoreCard: React.FC<HealthScoreCardProps> = ({ scoreData, onPress }) => {
  const score = scoreData?.score ?? 80;
  const status = scoreData?.status ?? 'GOOD';
  const delta = scoreData?.changeDelta ?? 4;
  const dims = scoreData?.dimensions ?? {
    cardiovascular: 73,
    metabolic: 82,
    nutrition: 70,
    lifestyle: 88,
    medicationAdherence: 92
  };

  const getStatusColor = () => {
    switch (status) {
      case 'EXCELLENT':
      case 'GOOD':
        return colors.success;
      case 'FAIR':
        return colors.warning;
      case 'NEEDS_ATTENTION':
      default:
        return colors.danger;
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={styles.card}
    >
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.cardLabel}>HEALTH SCORE</Text>
        <ChevronRight size={16} color={colors.textMuted} />
      </View>

      {/* Main Score Row */}
      <View style={styles.scoreRow}>
        <View style={styles.scoreLeft}>
          <Text style={styles.scoreNumber}>{score}</Text>
          <Text style={styles.scoreMax}>/100</Text>
        </View>

        <View style={styles.badgeCol}>
          <View style={[styles.statusBadge, { backgroundColor: 'rgba(48, 209, 88, 0.14)' }]}>
            <Text style={[styles.statusText, { color: getStatusColor() }]}>
              {status}
            </Text>
          </View>

          {delta !== undefined && delta !== 0 && (
            <View style={styles.trendRow}>
              {delta > 0 ? (
                <ArrowUpRight size={13} color={colors.success} />
              ) : (
                <ArrowDownRight size={13} color={colors.danger} />
              )}
              <Text style={[styles.trendText, { color: delta > 0 ? colors.success : colors.danger }]}>
                {delta > 0 ? `+${delta}` : delta} pts this week
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* 5-Dimension Mini Bars */}
      <View style={styles.dimensionsGrid}>
        <View style={styles.dimItem}>
          <View style={styles.dimLabelRow}>
            <Text style={styles.dimName}>Cardio</Text>
            <Text style={styles.dimVal}>{dims.cardiovascular}%</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${dims.cardiovascular}%`, backgroundColor: colors.dimensionCardio }]} />
          </View>
        </View>

        <View style={styles.dimItem}>
          <View style={styles.dimLabelRow}>
            <Text style={styles.dimName}>Metabolic</Text>
            <Text style={styles.dimVal}>{dims.metabolic}%</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${dims.metabolic}%`, backgroundColor: colors.dimensionMetabolic }]} />
          </View>
        </View>

        <View style={styles.dimItem}>
          <View style={styles.dimLabelRow}>
            <Text style={styles.dimName}>Nutrition</Text>
            <Text style={styles.dimVal}>{dims.nutrition}%</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${dims.nutrition}%`, backgroundColor: colors.dimensionNutrition }]} />
          </View>
        </View>

        <View style={styles.dimItem}>
          <View style={styles.dimLabelRow}>
            <Text style={styles.dimName}>Lifestyle</Text>
            <Text style={styles.dimVal}>{dims.lifestyle}%</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${dims.lifestyle}%`, backgroundColor: colors.dimensionLifestyle }]} />
          </View>
        </View>

        <View style={styles.dimItem}>
          <View style={styles.dimLabelRow}>
            <Text style={styles.dimName}>Meds</Text>
            <Text style={styles.dimVal}>{dims.medicationAdherence}%</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${dims.medicationAdherence}%`, backgroundColor: colors.dimensionMedication }]} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm
  },
  cardLabel: {
    ...typography.label,
    fontSize: 12,
    color: colors.textSecondary,
    letterSpacing: 0.5
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: spacing.lg
  },
  scoreLeft: {
    flexDirection: 'row',
    alignItems: 'baseline'
  },
  scoreNumber: {
    ...typography.heroScore,
    color: colors.textPrimary,
    fontWeight: '700'
  },
  scoreMax: {
    ...typography.body,
    color: colors.textMuted,
    marginLeft: 4
  },
  badgeCol: {
    alignItems: 'flex-end'
  },
  statusBadge: {
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 3,
    borderRadius: borderRadius.pill,
    marginBottom: 4
  },
  statusText: {
    ...typography.captionSemibold,
    fontSize: 11
  },
  trendRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  trendText: {
    ...typography.caption,
    fontSize: 11,
    marginLeft: 2
  },
  dimensionsGrid: {
    gap: spacing.sm + 2,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md
  },
  dimItem: {},
  dimLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4
  },
  dimName: {
    ...typography.caption,
    color: colors.textSecondary
  },
  dimVal: {
    ...typography.captionSemibold,
    color: colors.textPrimary
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    borderRadius: 2
  }
});
