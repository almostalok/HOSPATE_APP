import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing, borderRadius } from '../theme/spacing';
import { ShieldAlert, Cpu, Sparkles } from 'lucide-react-native';

interface HospateHeaderProps {
  userName?: string;
  onOpenEmergency?: () => void;
  onOpenAcademicDebug?: () => void;
  onOpenAssistant?: () => void;
}

export const HospateHeader: React.FC<HospateHeaderProps> = ({
  userName = 'Alex',
  onOpenEmergency,
  onOpenAcademicDebug,
  onOpenAssistant
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.brandRow}>
          <View style={styles.logoBadge}>
            <Sparkles size={14} color="#FFFFFF" />
          </View>
          <Text style={styles.brandText}>HOSPATE</Text>
          <View style={styles.versionPill}>
            <Text style={styles.versionText}>AI MVP</Text>
          </View>
        </View>

        <View style={styles.actionsRow}>
          {/* Academic Viva Audit Pipeline Inspector Button */}
          {onOpenAcademicDebug && (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onOpenAcademicDebug}
              style={styles.debugButton}
            >
              <Cpu size={15} color={colors.accent} />
              <Text style={styles.debugText}>Audit</Text>
            </TouchableOpacity>
          )}

          {/* Emergency Card Quick Action */}
          {onOpenEmergency && (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onOpenEmergency}
              style={styles.emergencyButton}
            >
              <ShieldAlert size={15} color={colors.dangerText} />
              <Text style={styles.emergencyText}>SOS</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.greetingRow}>
        <Text style={styles.greetingText}>Good morning, {userName} 👋</Text>
        <Text style={styles.subtitleText}>Here's your personal health snapshot.</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  logoBadge: {
    width: 26,
    height: 26,
    borderRadius: 7,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.xs + 2
  },
  brandText: {
    ...typography.h3,
    fontSize: 16,
    letterSpacing: 1.2,
    fontWeight: '800',
    color: colors.textPrimary
  },
  versionPill: {
    backgroundColor: 'rgba(14, 165, 233, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: borderRadius.pill,
    marginLeft: spacing.xs + 2
  },
  versionText: {
    ...typography.label,
    fontSize: 8,
    color: colors.primary
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  debugButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(6, 182, 212, 0.12)',
    borderColor: 'rgba(6, 182, 212, 0.3)',
    borderWidth: 1,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.pill,
    marginRight: spacing.sm
  },
  debugText: {
    ...typography.captionSemibold,
    fontSize: 11,
    color: colors.accent,
    marginLeft: 3
  },
  emergencyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dangerGlow,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    borderWidth: 1,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.pill
  },
  emergencyText: {
    ...typography.label,
    fontSize: 10,
    color: colors.dangerText,
    marginLeft: 3
  },
  greetingRow: {
    marginTop: spacing.xs
  },
  greetingText: {
    ...typography.h1,
    fontSize: 24,
    color: colors.textPrimary
  },
  subtitleText: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: 2
  }
});
