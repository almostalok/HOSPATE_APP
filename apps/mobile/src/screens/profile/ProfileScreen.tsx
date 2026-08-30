import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { logout } from '../../store/authSlice';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import {
  User,
  Heart,
  ShieldAlert,
  Settings,
  Lock,
  ChevronRight,
  LogOut,
  Sparkles,
  Smartphone,
  FileSpreadsheet,
  Share2
} from 'lucide-react-native';

export const ProfileScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
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
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Patient Profile</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
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
              <Text style={styles.roleText}>VERIFIED PATIENT</Text>
            </View>
          </View>
        </View>

        {/* Health Metrics Strip */}
        <View style={styles.metricsStrip}>
          <View style={styles.stripItem}>
            <Text style={styles.stripLabel}>BLOOD</Text>
            <Text style={[styles.stripVal, { color: colors.dangerText }]}>{profile?.bloodGroup || 'A+'}</Text>
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
          activeOpacity={0.8}
          onPress={() => navigation.navigate('EmergencyCard')}
          style={styles.menuItem}
        >
          <View style={[styles.menuIcon, { backgroundColor: colors.dangerGlow }]}>
            <ShieldAlert size={18} color={colors.dangerText} />
          </View>
          <View style={styles.menuTextCol}>
            <Text style={styles.menuTitle}>Emergency Health Card</Text>
            <Text style={styles.menuSubtitle}>Allergies, SOS contacts & QR access</Text>
          </View>
          <ChevronRight size={18} color={colors.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate('HealthScore')}
          style={styles.menuItem}
        >
          <View style={[styles.menuIcon, { backgroundColor: colors.primaryGlow }]}>
            <Heart size={18} color={colors.primary} />
          </View>
          <View style={styles.menuTextCol}>
            <Text style={styles.menuTitle}>AI Health Score Analytics</Text>
            <Text style={styles.menuSubtitle}>82 Good • 5 dimension tracking</Text>
          </View>
          <ChevronRight size={18} color={colors.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate('HealthTimeline')}
          style={styles.menuItem}
        >
          <View style={[styles.menuIcon, { backgroundColor: 'rgba(6, 182, 212, 0.15)' }]}>
            <FileSpreadsheet size={18} color={colors.accent} />
          </View>
          <View style={styles.menuTextCol}>
            <Text style={styles.menuTitle}>Digital Health Timeline</Text>
            <Text style={styles.menuSubtitle}>Chronological investigations & reports</Text>
          </View>
          <ChevronRight size={18} color={colors.textMuted} />
        </TouchableOpacity>

        {/* Section 2: Settings & Integrations */}
        <Text style={[styles.sectionHeader, { marginTop: spacing.lg }]}>
          SYSTEM & PRIVACY
        </Text>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate('Settings')}
          style={styles.menuItem}
        >
          <View style={styles.menuIcon}>
            <Settings size={18} color={colors.textSecondary} />
          </View>
          <View style={styles.menuTextCol}>
            <Text style={styles.menuTitle}>Settings & Security</Text>
            <Text style={styles.menuSubtitle}>Notifications, FHIR export & encryption</Text>
          </View>
          <ChevronRight size={18} color={colors.textMuted} />
        </TouchableOpacity>

        {/* Sign out */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleLogout}
          style={[styles.menuItem, styles.logoutItem]}
        >
          <View style={[styles.menuIcon, { backgroundColor: 'rgba(239, 68, 68, 0.1)' }]}>
            <LogOut size={18} color={colors.dangerText} />
          </View>
          <Text style={styles.logoutText}>Sign Out of Hospate</Text>
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
    paddingBottom: spacing.sm
  },
  headerTitle: {
    ...typography.h1,
    fontSize: 24,
    color: colors.textPrimary
  },
  scroll: {
    padding: spacing.lg
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md
  },
  avatarText: {
    ...typography.h2,
    color: '#FFFFFF'
  },
  userInfo: {
    flex: 1
  },
  userName: {
    ...typography.h2,
    fontSize: 20,
    color: colors.textPrimary
  },
  userEmail: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2
  },
  roleBadge: {
    backgroundColor: 'rgba(14, 165, 233, 0.12)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.pill,
    alignSelf: 'flex-start',
    marginTop: 6
  },
  roleText: {
    ...typography.label,
    fontSize: 9,
    color: colors.primary
  },
  metricsStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border
  },
  stripItem: {
    flex: 1,
    alignItems: 'center'
  },
  stripLabel: {
    ...typography.label,
    fontSize: 8,
    color: colors.textMuted
  },
  stripVal: {
    ...typography.captionSemibold,
    color: colors.textPrimary,
    marginTop: 2
  },
  stripDivider: {
    width: 1,
    height: 24,
    backgroundColor: colors.border
  },
  sectionHeader: {
    ...typography.label,
    fontSize: 11,
    color: colors.textMuted,
    letterSpacing: 1,
    marginBottom: spacing.sm
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.xs + 2,
    borderWidth: 1,
    borderColor: colors.border
  },
  menuIcon: {
    width: 38,
    height: 38,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md
  },
  menuTextCol: {
    flex: 1
  },
  menuTitle: {
    ...typography.bodySemibold,
    color: colors.textPrimary
  },
  menuSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 1
  },
  logoutItem: {
    marginTop: spacing.md,
    borderColor: 'rgba(239, 68, 68, 0.2)'
  },
  logoutText: {
    ...typography.bodySemibold,
    color: colors.dangerText,
    flex: 1
  }
});
