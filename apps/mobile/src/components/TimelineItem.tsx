import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing, borderRadius } from '../theme/spacing';
import { TimelineEvent } from '@hospate/types';
import { FileText, Pill, Stethoscope, AlertTriangle, ChevronRight } from 'lucide-react-native';

interface TimelineItemProps {
  event: TimelineEvent;
  isLast?: boolean;
  onPress?: (event: TimelineEvent) => void;
}

export const TimelineItem: React.FC<TimelineItemProps> = ({ event, isLast = false, onPress }) => {
  let icon = <FileText size={16} color={colors.primary} />;
  let dotColor = colors.primary;

  if (event.type === 'PRESCRIPTION') {
    icon = <Pill size={16} color={colors.dimensionMedication} />;
    dotColor = colors.dimensionMedication;
  } else if (event.type === 'CONSULTATION') {
    icon = <Stethoscope size={16} color={colors.accent} />;
    dotColor = colors.accent;
  }

  if (event.severity === 'WARNING' || event.severity === 'DANGER') {
    dotColor = colors.warning;
  }

  return (
    <View style={styles.container}>
      {/* Left Timeline Spine */}
      <View style={styles.spineColumn}>
        <View style={[styles.dot, { borderColor: dotColor, backgroundColor: colors.background }]}>
          <View style={[styles.innerDot, { backgroundColor: dotColor }]} />
        </View>
        {!isLast && <View style={styles.verticalLine} />}
      </View>

      {/* Right Content */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => onPress && onPress(event)}
        disabled={!onPress}
        style={styles.card}
      >
        <View style={styles.dateRow}>
          <Text style={styles.dateText}>{event.formattedDate}</Text>
          {event.severity === 'WARNING' && (
            <View style={styles.alertPill}>
              <AlertTriangle size={11} color={colors.warningText} />
              <Text style={styles.alertText}>Attention</Text>
            </View>
          )}
        </View>

        <Text style={styles.title}>{event.title}</Text>
        <Text style={styles.subtitle}>{event.subtitle}</Text>

        {event.insights && event.insights.length > 0 && (
          <View style={styles.insightsRow}>
            {event.insights.map((ins, idx) => (
              <View key={idx} style={styles.insightTag}>
                <Text style={styles.insightTagText}>{ins}</Text>
              </View>
            ))}
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xs
  },
  spineColumn: {
    alignItems: 'center',
    width: 28,
    marginRight: spacing.sm
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    zIndex: 2
  },
  innerDot: {
    width: 6,
    height: 6,
    borderRadius: 3
  },
  verticalLine: {
    width: 2,
    flex: 1,
    backgroundColor: colors.border,
    marginTop: 2
  },
  card: {
    flex: 1,
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4
  },
  dateText: {
    ...typography.label,
    fontSize: 10,
    color: colors.primary
  },
  alertPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.warningGlow,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: borderRadius.pill
  },
  alertText: {
    ...typography.captionSemibold,
    fontSize: 9,
    color: colors.warningText,
    marginLeft: 3
  },
  title: {
    ...typography.bodySemibold,
    color: colors.textPrimary,
    marginTop: 2
  },
  subtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
    lineHeight: 16
  },
  insightsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.xs + 2
  },
  insightTag: {
    backgroundColor: colors.surface,
    borderColor: 'rgba(245, 158, 11, 0.25)',
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.sm,
    marginRight: spacing.xs,
    marginTop: 4
  },
  insightTagText: {
    ...typography.caption,
    fontSize: 10,
    color: colors.warningText
  }
});
