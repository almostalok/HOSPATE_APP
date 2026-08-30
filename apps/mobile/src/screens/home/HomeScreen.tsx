import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Platform
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { fetchHealthOverview } from '../../store/healthSlice';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { LiveHealthAvatar } from '../../components/LiveHealthAvatar';
import { HospateHeader } from '../../components/HospateHeader';
import { HealthScoreCard } from '../../components/HealthScoreCard';
import { InsightCard } from '../../components/InsightCard';
import { AcademicDebugModal } from '../../components/AcademicDebugModal';
import { StatusBadge } from '../../components/StatusBadge';
import { HospateLogo } from '../../components/HospateLogo';
import {
  Upload,
  Calendar,
  Pill,
  ChevronRight,
  Clock,
  Stethoscope,
  Activity,
  Heart,
  Moon,
  Receipt,
  ShieldCheck,
  Droplet,
  Flame
} from 'lucide-react-native';

export const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { score, insights, isLoading } = useSelector((state: RootState) => state.health);
  const { stagingExtraction } = useSelector((state: RootState) => state.records);

  const [refreshing, setRefreshing] = useState(false);
  const [debugModalVisible, setDebugModalVisible] = useState(false);

  const loadData = async () => {
    try {
      await dispatch(fetchHealthOverview()).unwrap();
    } catch (e) {
      console.warn(e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <HospateHeader
        navigation={navigation}
        onDebugPress={() => setDebugModalVisible(true)}
        onEmergencyPress={() => navigation.navigate('EmergencyCard')}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        refreshControl={
          <RefreshControl refreshing={refreshing || isLoading} onRefresh={onRefresh} tintColor={colors.primary} />
        }
      >
        {/* 1. Live Physiological Health Avatar */}
        <LiveHealthAvatar
          score={score?.score ?? 80}
          userName={user?.fullName?.split(' ')[0] || 'Alok'}
          onPress={() => navigation.navigate('HealthScore')}
        />

        {/* 2. Hero Health Score Summary */}
        <HealthScoreCard
          scoreData={score}
          onPress={() => navigation.navigate('HealthScore')}
        />

        {/* 2. Apple-Style Action Card: Upload Report */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate('UploadDocument')}
          style={styles.uploadBanner}
        >
          <View style={styles.uploadIconBox}>
            <Upload size={18} color="#FFFFFF" />
          </View>
          <View style={styles.uploadTextContainer}>
            <Text style={styles.uploadTitle}>Upload Lab Report</Text>
            <Text style={styles.uploadSubtitle}>
              Scan report, extract biomarkers & update your health metrics
            </Text>
          </View>
          <ChevronRight size={18} color={colors.textMuted} />
        </TouchableOpacity>

        {/* 3. Biomarkers At a Glance (Apple Health Metrics Grid) */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>KEY BIOMARKERS</Text>
          <TouchableOpacity onPress={() => navigation.navigate('MedicalRecords')}>
            <Text style={styles.sectionLink}>See all</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.metricGrid}>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Hemoglobin</Text>
            <Text style={styles.metricValue}>15.1 <Text style={styles.metricUnit}>g/dL</Text></Text>
            <StatusBadge status="NORMAL" />
          </View>

          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Fasting Glucose</Text>
            <Text style={styles.metricValue}>86 <Text style={styles.metricUnit}>mg/dL</Text></Text>
            <StatusBadge status="NORMAL" />
          </View>

          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Vitamin D3</Text>
            <Text style={styles.metricValue}>24 <Text style={styles.metricUnit}>ng/mL</Text></Text>
            <StatusBadge status="LOW" />
          </View>

          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>LDL Cholesterol</Text>
            <Text style={styles.metricValue}>96 <Text style={styles.metricUnit}>mg/dL</Text></Text>
            <StatusBadge status="NORMAL" />
          </View>
        </View>

        {/* 4. Actionable Health Highlights */}
        {insights.length > 0 && (
          <>
            <View style={[styles.sectionHeader, { marginTop: spacing.lg }]}>
              <Text style={styles.sectionTitle}>CLINICAL HIGHLIGHTS</Text>
              <Text style={styles.insightCount}>{insights.length} alerts</Text>
            </View>

            {insights.slice(0, 2).map((ins) => (
              <InsightCard
                key={ins.id}
                insight={ins}
                onPress={() => navigation.navigate('AIHealthBuddy', {
                  initialPrompt: `Explain what my ${ins.title} finding means and what to ask my doctor.`
                })}
              />
            ))}
          </>
        )}

        {/* 5. Today's Health Schedule */}
        <View style={[styles.sectionHeader, { marginTop: spacing.lg }]}>
          <Text style={styles.sectionTitle}>TODAY'S SCHEDULE</Text>
        </View>

        <View style={styles.todayCard}>
          {/* Medication row */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.navigate('Medications')}
            style={styles.todayItem}
          >
            <View style={[styles.itemIcon, { backgroundColor: colors.dimensionMedication }]}>
              <Pill size={18} color="#FFFFFF" />
            </View>
            <View style={styles.itemContent}>
              <Text style={styles.itemTitle}>Omega-3 Triple Strength • 1000 mg</Text>
              <Text style={styles.itemMeta}>Scheduled: 08:30 AM • Taken after breakfast</Text>
            </View>
            <StatusBadge status="NORMAL" />
          </TouchableOpacity>

          {/* Upcoming appointment */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.navigate('Appointments')}
            style={[styles.todayItem, styles.todayDivider]}
          >
            <View style={[styles.itemIcon, { backgroundColor: colors.primary }]}>
              <Stethoscope size={18} color="#FFFFFF" />
            </View>
            <View style={styles.itemContent}>
              <Text style={styles.itemTitle}>Dr. Sarah Sharma</Text>
              <Text style={styles.itemMeta}>Cardiology & Internal • Sept 12 at 11:00 AM</Text>
            </View>
            <ChevronRight size={16} color={colors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* 6. Health Buddy Lifestyle & Wellness Hub */}
        <View style={[styles.sectionHeader, { marginTop: spacing.lg }]}>
          <Text style={styles.sectionTitle}>HEALTH BUDDY WELLNESS & CLAIMS</Text>
        </View>

        <View style={styles.wellnessGrid}>
          {/* Diet & Nutrition */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('DietPlanner')}
            style={styles.wellnessCard}
          >
            <View style={[styles.wellnessIconCircle, { backgroundColor: 'rgba(52, 199, 89, 0.12)' }]}>
              <Flame size={20} color="#34C759" />
            </View>
            <Text style={styles.wellnessCardTitle}>Diet & Nutrition</Text>
            <Text style={styles.wellnessCardVal}>1,980 / 2,650 <Text style={styles.wellnessCardUnit}>kcal</Text></Text>
            <Text style={styles.wellnessCardSub}>Protein 124g • Water 2.8L</Text>
          </TouchableOpacity>

          {/* Sleep & Circadian */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('SleepTracker')}
            style={styles.wellnessCard}
          >
            <View style={[styles.wellnessIconCircle, { backgroundColor: 'rgba(94, 92, 230, 0.12)' }]}>
              <Moon size={20} color="#5E5CE6" />
            </View>
            <Text style={styles.wellnessCardTitle}>Sleep & Recovery</Text>
            <Text style={styles.wellnessCardVal}>7h 45m <Text style={styles.wellnessCardUnit}>• 89 Score</Text></Text>
            <Text style={styles.wellnessCardSub}>Resting HR 56 BPM</Text>
          </TouchableOpacity>

          {/* Medical Bills & Claims */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('MedicalBills')}
            style={styles.wellnessCard}
          >
            <View style={[styles.wellnessIconCircle, { backgroundColor: 'rgba(10, 132, 255, 0.12)' }]}>
              <Receipt size={20} color="#0A84FF" />
            </View>
            <Text style={styles.wellnessCardTitle}>Bills & Claims</Text>
            <Text style={styles.wellnessCardVal}>₹6,500 <Text style={styles.wellnessCardUnit}>Settled</Text></Text>
            <Text style={styles.wellnessCardSub}>Star Health 82% Cashless</Text>
          </TouchableOpacity>

          {/* Immunization Passport */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Vaccinations')}
            style={styles.wellnessCard}
          >
            <View style={[styles.wellnessIconCircle, { backgroundColor: 'rgba(255, 159, 10, 0.12)' }]}>
              <ShieldCheck size={20} color="#FF9F0A" />
            </View>
            <Text style={styles.wellnessCardTitle}>Immunization</Text>
            <Text style={styles.wellnessCardVal}>3 Vaccines <Text style={styles.wellnessCardUnit}>Active</Text></Text>
            <Text style={styles.wellnessCardSub}>ABDM Digital Passport</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>

      {/* Academic Debug Modal */}
      <AcademicDebugModal
        visible={debugModalVisible}
        onClose={() => setDebugModalVisible(false)}
        auditData={stagingExtraction?.debugAudit}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background
  },
  scroll: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl
  },
  uploadBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border
  },
  uploadIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md
  },
  uploadTextContainer: {
    flex: 1,
    marginRight: spacing.sm
  },
  uploadTitle: {
    ...typography.bodySemibold,
    color: colors.textPrimary,
    fontSize: 15
  },
  uploadSubtitle: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs + 2,
    marginTop: spacing.sm
  },
  sectionTitle: {
    ...typography.label,
    fontSize: 12,
    color: colors.textSecondary,
    letterSpacing: 0.5
  },
  sectionLink: {
    ...typography.captionSemibold,
    color: colors.primary,
    fontSize: 13
  },
  insightCount: {
    ...typography.caption,
    color: colors.warningText,
    fontSize: 12
  },
  metricGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: spacing.xs
  },
  metricCard: {
    width: '48.5%',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border
  },
  metricLabel: {
    ...typography.caption,
    color: colors.textMuted,
    marginBottom: 4
  },
  metricValue: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: 6,
    fontWeight: '700'
  },
  metricUnit: {
    ...typography.caption,
    color: colors.textMuted,
    fontWeight: '400'
  },
  todayCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border
  },
  todayItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs
  },
  todayDivider: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: spacing.xs,
    paddingTop: spacing.sm
  },
  itemIcon: {
    width: 36,
    height: 36,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md
  },
  itemContent: {
    flex: 1,
    marginRight: spacing.sm
  },
  itemTitle: {
    ...typography.bodySemibold,
    color: colors.textPrimary,
    fontSize: 15
  },
  itemMeta: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2
  },
  floatingButton: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.pill,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6
  },
  floatingText: {
    ...typography.headline,
    color: '#FFFFFF',
    fontSize: 15,
    marginLeft: 8,
    fontWeight: '600'
  },
  wellnessGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: spacing.sm
  },
  wellnessCard: {
    width: '48.5%',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border
  },
  wellnessIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs
  },
  wellnessCardTitle: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '600',
    marginBottom: 2
  },
  wellnessCardVal: {
    ...typography.bodySemibold,
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2
  },
  wellnessCardUnit: {
    ...typography.caption,
    color: colors.textMuted,
    fontWeight: '400'
  },
  wellnessCardSub: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 11
  }
});
