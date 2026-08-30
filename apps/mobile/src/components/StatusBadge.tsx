import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ParameterStatus, Severity } from '@hospate/types';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { borderRadius, spacing } from '../theme/spacing';

export interface StatusBadgeProps {
  status?: ParameterStatus | Severity | string;
  size?: 'small' | 'medium' | 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status = 'NORMAL', size = 'small' }) => {
  const norm = String(status).toUpperCase();

  const getStyle = () => {
    switch (norm) {
      case 'NORMAL':
      case 'EXCELLENT':
      case 'GOOD':
      case 'COMPLETED':
      case 'TAKEN':
        return {
          bg: 'rgba(48, 209, 88, 0.12)',
          color: colors.success,
          label: norm === 'NORMAL' ? 'Normal' : norm
        };
      case 'LOW':
      case 'HIGH':
      case 'WARNING':
      case 'FAIR':
      case 'NEEDS_REVIEW':
      case 'PENDING':
        return {
          bg: 'rgba(255, 159, 10, 0.12)',
          color: colors.warning,
          label: norm === 'WARNING' ? 'Attention' : norm === 'HIGH' ? 'High' : norm === 'LOW' ? 'Low' : norm
        };
      case 'CRITICAL_HIGH':
      case 'CRITICAL_LOW':
      case 'DANGER':
      case 'NEEDS_ATTENTION':
      case 'MISSED':
      case 'FAILED':
      case 'ABNORMAL':
        return {
          bg: 'rgba(255, 69, 58, 0.12)',
          color: colors.danger,
          label: norm === 'DANGER' || norm === 'ABNORMAL' ? 'Abnormal' : norm
        };
      default:
        return {
          bg: 'rgba(255, 255, 255, 0.08)',
          color: colors.textSecondary,
          label: norm
        };
    }
  };

  const styleConfig = getStyle();
  const isMedium = size === 'medium' || size === 'md';

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: styleConfig.bg },
        isMedium && styles.badgeMedium
      ]}
    >
      <Text
        style={[
          styles.text,
          { color: styleConfig.color },
          isMedium && styles.textMedium
        ]}
      >
        {styleConfig.label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.pill,
    alignSelf: 'flex-start',
    justifyContent: 'center',
    alignItems: 'center'
  },
  badgeMedium: {
    paddingHorizontal: spacing.md,
    paddingVertical: 4
  },
  text: {
    ...typography.captionSemibold,
    fontSize: 11,
    fontWeight: '600'
  },
  textMedium: {
    fontSize: 12
  }
});
