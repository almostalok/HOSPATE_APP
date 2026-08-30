import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing, borderRadius } from '../theme/spacing';
import { HospateLogo } from './HospateLogo';
import { ShieldAlert, Terminal } from 'lucide-react-native';

interface HospateHeaderProps {
  title?: string;
  subtitle?: string;
  showEmergency?: boolean;
  showDebug?: boolean;
  onEmergencyPress?: () => void;
  onDebugPress?: () => void;
  navigation?: any;
}

export const HospateHeader: React.FC<HospateHeaderProps> = ({
  title,
  subtitle,
  showEmergency = true,
  showDebug = true,
  onEmergencyPress,
  onDebugPress,
  navigation
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 16) + 6 }]}>
      <View style={styles.leftCol}>
        <View style={styles.brandRow}>
          <HospateLogo size={28} />
          <Text style={styles.brandName}>{title || 'Hospate'}</Text>
        </View>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>

      <View style={styles.actionsRow}>
        {showDebug && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onDebugPress}
            style={styles.debugBtn}
          >
            <Terminal size={13} color={colors.textSecondary} />
            <Text style={styles.debugText}>Audit</Text>
          </TouchableOpacity>
        )}

        {showEmergency && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onEmergencyPress || (() => navigation?.navigate('EmergencyCard'))}
            style={styles.sosBtn}
          >
            <ShieldAlert size={13} color="#FFFFFF" />
            <Text style={styles.sosText}>SOS</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm + 2,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },
  leftCol: {
    flex: 1
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  brandName: {
    ...typography.h2,
    color: colors.textPrimary,
    marginLeft: spacing.sm,
    fontWeight: '700'
  },
  subtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm
  },
  debugBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 5,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border
  },
  debugText: {
    ...typography.captionSemibold,
    color: colors.textSecondary,
    marginLeft: 4,
    fontSize: 11
  },
  sosBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm + 4,
    paddingVertical: 5,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.danger
  },
  sosText: {
    ...typography.captionSemibold,
    color: '#FFFFFF',
    marginLeft: 3,
    fontSize: 11,
    fontWeight: '700'
  }
});
