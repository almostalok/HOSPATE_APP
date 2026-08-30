import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { logout } from '../../store/authSlice';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { LiveHealthAvatar } from '../../components/LiveHealthAvatar';
import {
  Heart,
  ShieldAlert,
  Settings,
  ChevronRight,
  LogOut,
  FileSpreadsheet,
  UserCheck
} from 'lucide-react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const ProfileScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch<AppDispatch>();
  const { user, profile } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out of Hospate?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: () => {
          dispatch(logout());
          navigation.replace('Welcome');
        }
      }
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Apple Header */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 36) + 8, paddingBottom: spacing.sm + 2 }]}>
        <Text style={styles.headerTitle}>Patient Profile</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Live Physiological Health Avatar */}
        <LiveHealthAvatar
          score={80}
          userName={user?.fullName || 'Alex Morgan'}
          onPress={() => navigation.navigate('HealthScore')}
        />

        {/* User Card */}
        <View style={styles.userCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.fullName?.split(' ').map(n => n[0]).join('') || 'AM'}
            </Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.fullName || 'Alex Morgan'}</Text>
            <Text style={styles.userEmail}>{user?.email || 'demo@hospate.app'}</Text>
            <View style={styles.roleBadge}>
              <UserCheck size={11} color={colors.primary} />
              <Text style={styles.roleText}>VERIFIED PATIENT</Text>
            </View>
          </View>
        </View>

        {/* Health Metrics Strip */}
        <View style={styles.metricsStrip}>
          <View style={styles.stripItem}>
            <Text style={styles.stripLabel}>BLOOD</Text>
            <Text style={[styles.stripVal, { color: colors.danger }]}>{profile?.bloodGroup || 'A+'}</Text>
          </View>
          <View style={styles.stripDivider} />
          <View style={styles.stripItem}>
            <Text style={styles.stripLabel}>AGE</Text>
            <Text style={styles.stripVal}>{profile?.age || 28} Y</Text>
          </View>
          <View style={styles.stripDivider} />
          <View style={styles.stripItem}>
            <Text style={styles.stripLabel}>HEIGHT</Text>
            <Text style={styles.stripVal}>{profile?.heightCm || 178} cm</Text>
          </View>
          <View style={styles.stripDivider} />
          <View style={styles.stripItem}>
            <Text style={styles.stripLabel}>WEIGHT</Text>
            <Text style={styles.stripVal}>{profile?.weightKg || 74} kg</Text>
          </View>
        </View>

        {/* Section 1: Health Vault */}
        <Text style={styles.sectionHeader}>HEALTH VAULT & RECORDS</Text>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.navigate('EmergencyCard')}
          style={styles.menuItem}
        >
          <View style={[styles.menuIcon, { backgroundColor: 'rgba(255, 69, 58, 0.14)' }]}>
            <ShieldAlert size={18} color={colors.danger} />
          </View>
          <View style={styles.menuTextCol}>
            <Text style={styles.menuTitle}>Emergency Health Card</Text>
            <Text style={styles.menuSubtitle}>Allergies, SOS contacts & QR access</Text>
          </View>
          <ChevronRight size={16} color={colors.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.navigate('HealthScore')}
          style={styles.menuItem}
        >
          <View style={[styles.menuIcon, { backgroundColor: 'rgba(10, 132, 255, 0.14)' }]}>
            <Heart size={18} color={colors.primary} />
          </View>
          <View style={styles.menuTextCol}>
            <Text style={styles.menuTitle}>Health Score & Dimensions</Text>
            <Text style={styles.menuSubtitle}>Composite rating & metabolic tracking</Text>
          </View>
          <ChevronRight size={16} color={colors.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.navigate('HealthTimeline')}
          style={styles.menuItem}
        >
          <View style={[styles.menuIcon, { backgroundColor: 'rgba(100, 210, 255, 0.14)' }]}>
            <FileSpreadsheet size={18} color={colors.accent} />
          </View>
          <View style={styles.menuTextCol}>
            <Text style={styles.menuTitle}>Clinical Health Timeline</Text>
            <Text style={styles.menuSubtitle}>Chronological lab reports & doctor visits</Text>
          </View>
          <ChevronRight size={16} color={colors.textMuted} />
        </TouchableOpacity>

        {/* Section 2: Settings & System */}
        <Text style={[styles.sectionHeader, { marginTop: spacing.lg }]}>
          SYSTEM & SECURITY
        </Text>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.navigate('Settings')}
          style={styles.menuItem}
        >
          <View style={[styles.menuIcon, { backgroundColor: colors.surfaceElevated }]}>
            <Settings size={18} color={colors.textSecondary} />
          </View>
          <View style={styles.menuTextCol}>
            <Text style={styles.menuTitle}>Settings & Privacy</Text>
            <Text style={styles.menuSubtitle}>Notifications, FHIR export & encryption</Text>
          </View>
          <ChevronRight size={16} color={colors.textMuted} />
        </TouchableOpacity>

        {/* Sign out */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleLogout}
          style={[styles.menuItem, styles.logoutItem]}
        >
          <View style={[styles.menuIcon, { backgroundColor: 'rgba(255, 69, 58, 0.12)' }]}>
            <LogOut size={18} color={colors.danger} />
          </View>
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xs
  },
  headerTitle: {
    ...typography.h1,
    fontSize: 26,
    color: colors.textPrimary,
    fontWeight: '700'
  },
  scroll: {
    padding: spacing.lg
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.brandNavy,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md
  },
  avatarText: {
    ...typography.h3,
    color: '#FFFFFF',
    fontWeight: '700'
  },
  userInfo: {
    flex: 1
  },
  userName: {
    ...typography.headline,
    fontSize: 17,
    color: colors.textPrimary
  },
  userEmail: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(10, 132, 255, 0.12)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.pill,
    alignSelf: 'flex-start',
    marginTop: 6
  },
  roleText: {
    ...typography.captionSemibold,
    fontSize: 10,
    color: colors.primary,
    marginLeft: 3
  },
  metricsStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border
  },
  stripItem: {
    alignItems: 'center',
    flex: 1
  },
  stripLabel: {
    ...typography.label,
    fontSize: 10,
    color: colors.textMuted,
    marginBottom: 2
  },
  stripVal: {
    ...typography.bodySemibold,
    fontSize: 14,
    color: colors.textPrimary
  },
  stripDivider: {
    width: 1,
    height: 24,
    backgroundColor: colors.border
  },
  sectionHeader: {
    ...typography.label,
    fontSize: 11,
    color: colors.textSecondary,
    letterSpacing: 0.5,
    marginBottom: spacing.sm
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.xs + 2,
    borderWidth: 1,
    borderColor: colors.border
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md
  },
  menuTextCol: {
    flex: 1,
    marginRight: spacing.sm
  },
  menuTitle: {
    ...typography.bodySemibold,
    color: colors.textPrimary,
    fontSize: 15
  },
  menuSubtitle: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2
  },
  logoutItem: {
    marginTop: spacing.md,
    borderColor: 'rgba(255, 69, 58, 0.25)'
  },
  logoutText: {
    ...typography.bodySemibold,
    color: colors.danger,
    fontSize: 15
  }
});
