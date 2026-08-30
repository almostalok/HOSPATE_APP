import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { HealthInsight } from '@hospate/types';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing, borderRadius } from '../theme/spacing';
import { StatusBadge } from './StatusBadge';
import { Activity, Heart, Stethoscope } from 'lucide-react-native';

interface InsightCardProps {
  insight: HealthInsight;
  onPress?: () => void;
  onUnderstandPress?: (insight: HealthInsight) => void;
}

export const InsightCard: React.FC<InsightCardProps> = ({ insight, onPress, onUnderstandPress }) => {
  const getIcon = () => {
    if (insight.severity === 'DANGER' || insight.title?.toLowerCase().includes('cholesterol') || insight.parameter?.toLowerCase().includes('ldl')) {
      return {
        icon: <Heart size={18} color="#FFFFFF" />,
        bg: colors.dimensionCardio
      };
    }
    if (insight.title?.toLowerCase().includes('vitamin') || insight.parameter?.toLowerCase().includes('vitamin')) {
      return {
        icon: <Activity size={18} color="#FFFFFF" />,
        bg: colors.dimensionNutrition
      };
    }
    return {
      icon: <Stethoscope size={18} color="#FFFFFF" />,
      bg: colors.primary
    };
  };

  const iconConfig = getIcon();

  const handlePress = () => {
    if (onUnderstandPress) {
      onUnderstandPress(insight);
    } else if (onPress) {
      onPress();
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={handlePress}
      style={styles.card}
    >
      {/* Top row: Icon, Title, Status */}
      <View style={styles.topRow}>
        <View style={[styles.iconBox, { backgroundColor: iconConfig.bg }]}>
          {iconConfig.icon}
        </View>

        <View style={styles.titleCol}>
          <Text style={styles.title} numberOfLines={2}>
            {insight.title}
          </Text>
          <Text style={styles.sourceText}>
            {insight.sourceDocumentTitle || 'Lab Pathology'} • {insight.sourceDate || 'Recent'}
          </Text>
        </View>

        <StatusBadge status={insight.severity} />
      </View>

      {/* Interpretation / Summary */}
      <Text style={styles.summaryText}>
        {insight.interpretation}
      </Text>

      {/* Recommendation */}
      {insight.recommendation ? (
        <View style={styles.actionBox}>
          <Text style={styles.actionLabel}>RECOMMENDED FOCUS</Text>
          <Text style={styles.actionText}>{insight.recommendation}</Text>
        </View>
      ) : null}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md
  },
  titleCol: {
    flex: 1,
    marginRight: spacing.sm
  },
  title: {
    ...typography.headline,
    color: colors.textPrimary,
    fontSize: 16
  },
  sourceText: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2
  },
  summaryText: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 21,
    marginTop: 4,
    marginBottom: spacing.sm
  },
  actionBox: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginTop: spacing.xs
  },
  actionLabel: {
    ...typography.label,
    fontSize: 10,
    color: colors.textMuted,
    letterSpacing: 0.5,
    marginBottom: 2
  },
  actionText: {
    ...typography.caption,
    color: colors.textPrimary,
    lineHeight: 18
  }
});
