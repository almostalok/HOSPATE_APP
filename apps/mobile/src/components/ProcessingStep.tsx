import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing, borderRadius } from '../theme/spacing';
import { CheckCircle2, Circle } from 'lucide-react-native';

export type StepState = 'COMPLETED' | 'ACTIVE' | 'PENDING';

interface ProcessingStepProps {
  stepNumber: number;
  title: string;
  subtitle?: string;
  state: StepState;
}

export const ProcessingStep: React.FC<ProcessingStepProps> = ({
  stepNumber,
  title,
  subtitle,
  state
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconCol}>
        {state === 'COMPLETED' ? (
          <View style={styles.completedBadge}>
            <CheckCircle2 size={18} color={colors.successText} />
          </View>
        ) : state === 'ACTIVE' ? (
          <View style={styles.activeBadge}>
            <ActivityIndicator size="small" color={colors.primary} />
          </View>
        ) : (
          <View style={styles.pendingBadge}>
            <Circle size={16} color={colors.textMuted} />
          </View>
        )}
      </View>

      <View style={styles.textCol}>
        <Text
          style={[
            styles.title,
            state === 'ACTIVE' && styles.titleActive,
            state === 'COMPLETED' && styles.titleCompleted,
            state === 'PENDING' && styles.titlePending
          ]}
        >
          {title}
        </Text>
        {subtitle ? (
          <Text style={styles.subtitle}>{subtitle}</Text>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border
  },
  iconCol: {
    width: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
    marginTop: 2
  },
  completedBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.successGlow,
    alignItems: 'center',
    justifyContent: 'center'
  },
  activeBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primaryGlow,
    alignItems: 'center',
    justifyContent: 'center'
  },
  pendingBadge: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center'
  },
  textCol: {
    flex: 1
  },
  title: {
    ...typography.bodySemibold,
    color: colors.textPrimary
  },
  titleActive: {
    color: colors.primary
  },
  titleCompleted: {
    color: colors.textPrimary
  },
  titlePending: {
    color: colors.textMuted
  },
  subtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2
  }
});
