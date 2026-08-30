import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing, borderRadius } from '../theme/spacing';
import { HealthScore } from '@hospate/types';
import { ArrowUpRight, TrendingUp, Sparkles, ChevronRight } from 'lucide-react-native';

interface HealthScoreCardProps {
  scoreData?: HealthScore | null;
  onPress?: () => void;
}

export const HealthScoreCard: React.FC<HealthScoreCardProps> = ({ scoreData, onPress }) => {
  const score = scoreData?.score || 82;
  const status = scoreData?.status || 'GOOD';
  const delta = scoreData?.changeDelta || 4;

  const dims = scoreData?.dimensions || {
    cardiovascular: 86,
    metabolic: 79,
    nutrition: 74,
    lifestyle: 88,
    medicationAdherence: 91
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={styles.card}
    >
      <View style={styles.headerRow}>
        <View style={styles.badgeRow}>
          <Sparkles size={14} color={colors.primary} />
          <Text style={styles.headerLabel}>AI HEALTH SCORE</Text>
        </View>
        <View style={styles.trendPill}>
          <TrendingUp size={12} color={colors.successText} />
          <Text style={styles.trendText}>+{delta} pts this month</Text>
        </View>
      </View>

      <View style={styles.scoreRow}>
        <View style={styles.scoreLeft}>
          <Text style={styles.heroScore}>{score}</Text>
          <View style={styles.scoreMeta}>
            <View style={styles.statusPill}>
              <Text style={styles.statusText}>{status}</Text>
            </View>
            <Text style={styles.scaleText}>out of 100</Text>
          </View>
        </View>

        <View style={styles.viewDetailRow}>
          <Text style={styles.viewDetailText}>Details</Text>
          <ChevronRight size={16} color={colors.primary} />
        </View>
      </View>

      {/* Mini Dimension Bars Preview */}
      <View style={styles.dimensionsPreview}>
        <View style={styles.dimensionCol}>
          <Text style={styles.dimLabel}>Cardio</Text>
          <View style={styles.barTrack}>
            <View style={[styles.barFill, { width: `${dims.cardiovascular}%`, backgroundColor: colors.dimensionCardio }]} />
          </View>
          <Text style={styles.dimVal}>{dims.cardiovascular}</Text>
        </View>

        <View style={styles.dimensionCol}>
          <Text style={styles.dimLabel}>Metabolic</Text>
          <View style={styles.barTrack}>
            <View style={[styles.barFill, { width: `${dims.metabolic}%`, backgroundColor: colors.dimensionMetabolic }]} />
          </View>
          <Text style={styles.dimVal}>{dims.metabolic}</Text>
        </View>

        <View style={styles.dimensionCol}>
          <Text style={styles.dimLabel}>Nutrition</Text>
          <View style={styles.barTrack}>
            <View style={[styles.barFill, { width: `${dims.nutrition}%`, backgroundColor: colors.dimensionNutrition }]} />
          </View>
          <Text style={styles.dimVal}>{dims.nutrition}</Text>
        </View>

        <View style={styles.dimensionCol}>
          <Text style={styles.dimLabel}>Lifestyle</Text>
          <View style={styles.barTrack}>
            <View style={[styles.barFill, { width: `${dims.lifestyle}%`, backgroundColor: colors.dimensionLifestyle }]} />
          </View>
          <Text style={styles.dimVal}>{dims.lifestyle}</Text>
        </View>

        <View style={styles.dimensionCol}>
          <Text style={styles.dimLabel}>Meds</Text>
          <View style={styles.barTrack}>
            <View style={[styles.barFill, { width: `${dims.medicationAdherence}%`, backgroundColor: colors.dimensionMedication }]} />
          </View>
          <Text style={styles.dimVal}>{dims.medicationAdherence}</Text>
        </View>
      </View>

      <View style={styles.footerNote}>
        <Text style={styles.disclaimerText}>
          Experimental health awareness indicator • Not a clinical diagnosis
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginHorizontal: spacing.lg,
    marginVertical: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(14, 165, 233, 0.25)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  headerLabel: {
    ...typography.label,
    fontSize: 11,
    color: colors.primary,
    marginLeft: 6
  },
  trendPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.successGlow,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.pill
  },
  trendText: {
    ...typography.captionSemibold,
    fontSize: 11,
    color: colors.successText,
    marginLeft: 4
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: spacing.xs
  },
  scoreLeft: {
    flexDirection: 'row',
    alignItems: 'baseline'
  },
  heroScore: {
    ...typography.heroScore,
    fontSize: 56,
    color: colors.textPrimary,
    marginRight: spacing.md
  },
  scoreMeta: {
    justifyContent: 'center'
  },
  statusPill: {
    backgroundColor: colors.successGlow,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    alignSelf: 'flex-start'
  },
  statusText: {
    ...typography.label,
    fontSize: 11,
    color: colors.successText
  },
  scaleText: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 3
  },
  viewDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(14, 165, 233, 0.1)',
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs + 2,
    borderRadius: borderRadius.md
  },
  viewDetailText: {
    ...typography.captionSemibold,
    color: colors.primary,
    marginRight: 2
  },
  dimensionsPreview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border
  },
  dimensionCol: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 2
  },
  dimLabel: {
    ...typography.caption,
    fontSize: 10,
    color: colors.textSecondary,
    marginBottom: 4
  },
  barTrack: {
    width: '100%',
    height: 4,
    backgroundColor: colors.surface,
    borderRadius: 2,
    overflow: 'hidden'
  },
  barFill: {
    height: '100%',
    borderRadius: 2
  },
  dimVal: {
    ...typography.captionSemibold,
    fontSize: 10,
    color: colors.textPrimary,
    marginTop: 4
  },
  footerNote: {
    marginTop: spacing.sm,
    alignItems: 'center'
  },
  disclaimerText: {
    ...typography.caption,
    fontSize: 10,
    color: colors.textMuted,
    textAlign: 'center'
  }
});
