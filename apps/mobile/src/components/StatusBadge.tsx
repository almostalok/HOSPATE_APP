import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { borderRadius, spacing } from '../theme/spacing';
import { ParameterStatus, Severity } from '@hospate/types';

interface StatusBadgeProps {
  status?: ParameterStatus | Severity | string;
  label?: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status = 'NORMAL', label, size = 'md' }) => {
  const normStatus = String(status).toUpperCase();

  let bg = colors.successGlow;
  let text = colors.successText;
  let displayLabel = label || 'NORMAL';

  if (normStatus === 'HIGH' || normStatus === 'WARNING') {
    bg = colors.warningGlow;
    text = colors.warningText;
    displayLabel = label || 'ELEVATED';
  } else if (normStatus === 'LOW') {
    bg = colors.warningGlow;
    text = colors.warningText;
    displayLabel = label || 'LOW';
  } else if (normStatus === 'CRITICAL_HIGH' || normStatus === 'CRITICAL_LOW' || normStatus === 'DANGER') {
    bg = colors.dangerGlow;
    text = colors.dangerText;
    displayLabel = label || 'CRITICAL';
  } else if (normStatus === 'NEEDS_REVIEW') {
    bg = 'rgba(148, 163, 184, 0.15)';
    text = colors.textSecondary;
    displayLabel = label || 'REVIEW';
  } else if (normStatus === 'NORMAL') {
    bg = colors.successGlow;
    text = colors.successText;
    displayLabel = label || 'NORMAL';
  }

  const isSmall = size === 'sm';

  return (
    <View style={[styles.badge, { backgroundColor: bg }, isSmall && styles.badgeSm]}>
      <View style={[styles.dot, { backgroundColor: text }]} />
      <Text style={[styles.text, { color: text }, isSmall && styles.textSm]}>
        {displayLabel}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.pill,
    alignSelf: 'flex-start'
  },
  badgeSm: {
    paddingHorizontal: spacing.xs + 2,
    paddingVertical: 2
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: spacing.xs + 1
  },
  text: {
    ...typography.label,
    fontSize: 10
  },
  textSm: {
    fontSize: 9
  }
});
