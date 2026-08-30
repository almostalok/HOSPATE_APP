import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing, borderRadius } from '../theme/spacing';
import { HealthInsight } from '@hospate/types';
import { StatusBadge } from './StatusBadge';
import { AlertCircle, AlertTriangle, CheckCircle, Sparkles, ChevronRight } from 'lucide-react-native';

interface InsightCardProps {
  insight: HealthInsight;
  onUnderstandPress?: (insight: HealthInsight) => void;
}

export const InsightCard: React.FC<InsightCardProps> = ({ insight, onUnderstandPress }) => {
  const isDanger = insight.severity === 'DANGER';
  const isWarning = insight.severity === 'WARNING';

  let borderColor = 'rgba(148, 163, 184, 0.2)';
  let accentIcon = <CheckCircle size={16} color={colors.successText} />;

  if (isDanger) {
    borderColor = 'rgba(239, 68, 68, 0.4)';
    accentIcon = <AlertCircle size={16} color={colors.dangerText} />;
  } else if (isWarning) {
    borderColor = 'rgba(245, 158, 11, 0.4)';
    accentIcon = <AlertTriangle size={16} color={colors.warningText} />;
  }

  return (
    <View style={[styles.card, { borderColor }]}>
      <View style={styles.topRow}>
        <View style={styles.headerLeft}>
          {accentIcon}
          <Text style={styles.title} numberOfLines={1}>{insight.title}</Text>
        </View>
        <StatusBadge status={insight.severity} />
      </View>

      <View style={styles.parameterRow}>
        <View style={styles.paramBox}>
          <Text style={styles.paramLabel}>Measured Value</Text>
          <Text style={styles.paramValue}>
            {insight.measuredValue} <Text style={styles.paramUnit}>{insight.unit}</Text>
          </Text>
        </View>

        {insight.referenceRange ? (
          <View style={styles.refBox}>
            <Text style={styles.paramLabel}>Reference Target</Text>
            <Text style={styles.refValue}>{insight.referenceRange}</Text>
          </View>
        ) : null}
      </View>

      <Text style={styles.interpretation} numberOfLines={2}>
        {insight.interpretation}
      </Text>

      <View style={styles.footerRow}>
        <Text style={styles.sourceText} numberOfLines={1}>
          Source: {insight.sourceDocumentTitle}
        </Text>

        {onUnderstandPress && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => onUnderstandPress(insight)}
            style={styles.actionBtn}
          >
            <Sparkles size={12} color={colors.primary} />
            <Text style={styles.actionText}>Understand this</Text>
            <ChevronRight size={14} color={colors.primary} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginHorizontal: spacing.lg,
    marginVertical: spacing.xs + 2,
    borderWidth: 1
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs + 2
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: spacing.sm
  },
  title: {
    ...typography.bodySemibold,
    color: colors.textPrimary,
    marginLeft: spacing.xs + 2,
    flex: 1
  },
  parameterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    marginVertical: spacing.xs
  },
  paramBox: {
    flex: 1
  },
  paramLabel: {
    ...typography.caption,
    fontSize: 10,
    color: colors.textMuted
  },
  paramValue: {
    ...typography.h3,
    fontSize: 16,
    color: colors.textPrimary
  },
  paramUnit: {
    ...typography.caption,
    fontSize: 11,
    color: colors.textSecondary
  },
  refBox: {
    flex: 1,
    borderLeftWidth: 1,
    borderLeftColor: colors.border,
    paddingLeft: spacing.sm
  },
  refValue: {
    ...typography.captionSemibold,
    color: colors.textSecondary
  },
  interpretation: {
    ...typography.body,
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    lineHeight: 18
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
    paddingTop: spacing.xs + 2,
    borderTopWidth: 1,
    borderTopColor: 'rgba(51, 65, 85, 0.4)'
  },
  sourceText: {
    ...typography.caption,
    fontSize: 10,
    color: colors.textMuted,
    flex: 1,
    marginRight: spacing.xs
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(14, 165, 233, 0.12)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.pill
  },
  actionText: {
    ...typography.captionSemibold,
    fontSize: 11,
    color: colors.primary,
    marginHorizontal: 3
  }
});
