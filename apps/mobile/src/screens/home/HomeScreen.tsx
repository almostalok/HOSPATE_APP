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
import { HospateHeader } from '../../components/HospateHeader';
import { HealthScoreCard } from '../../components/HealthScoreCard';
import { InsightCard } from '../../components/InsightCard';
import { AcademicDebugModal } from '../../components/AcademicDebugModal';
import { StatusBadge } from '../../components/StatusBadge';
import {
  Sparkles,
  Upload,
  Calendar,
  Pill,
  ChevronRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  Stethoscope
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

  const handleUnderstandInsight = (insight: any) => {
    navigation.navigate('AIHealthBuddy', { initialPrompt: `Why is my ${insight.parameter} ${insight.severity === 'DANGER' ? 'abnormal' : 'outside range'}?` });
  };

  return (
    <SafeAreaView style={styles.container}>
      <HospateHeader
        userName={user?.fullName?.split(' ')[0] || 'Alex'}
        onOpenEmergency={() => navigation.navigate('EmergencyCard')}
        onOpenAcademicDebug={() => setDebugModalVisible(true)}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        refreshControl={
          <RefreshControl refreshing={refreshing || isLoading} onRefresh={onRefresh} tintColor={colors.primary} />
        }
      >
        {/* 1. Hero AI Health Score */}
        <HealthScoreCard
          scoreData={score}
          onPress={() => navigation.navigate('HealthScore')}
        />

        {/* 2. Hero Action: Upload New Health Document */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate('UploadDocument')}
          style={styles.uploadBanner}
        >
          <View style={styles.uploadIconCircle}>
            <Upload size={20} color="#FFFFFF" />
          </View>
          <View style={styles.uploadTextContainer}>
            <Text style={styles.uploadTitle}>Upload Medical Report</Text>
            <Text style={styles.uploadSubtitle}>
              OCR extraction, reference ranges & instant health score update
            </Text>
          </View>
          <ChevronRight size={20} color={colors.primary} />
        </TouchableOpacity>

        {/* 3. Health At a Glance (Biomarker Quick Grid) */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>HEALTH AT A GLANCE</Text>
          <TouchableOpacity onPress={() => navigation.navigate('MedicalRecords')}>
            <Text style={styles.sectionLink}>View all</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.metricGrid}>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Hemoglobin</Text>
            <Text style={styles.metricValue}>14.2 <Text style={styles.metricUnit}>g/dL</Text></Text>
            <StatusBadge status="NORMAL" size="sm" />
          </View>

          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Fasting Glucose</Text>
            <Text style={styles.metricValue}>88 <Text style={styles.metricUnit}>mg/dL</Text></Text>
            <StatusBadge status="NORMAL" size="sm" />
          </View>

          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Vitamin D</Text>
            <Text style={styles.metricValue}>18 <Text style={styles.metricUnit}>ng/mL</Text></Text>
            <StatusBadge status="LOW" size="sm" />
          </View>

          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>LDL Cholesterol</Text>
            <Text style={styles.metricValue}>142 <Text style={styles.metricUnit}>mg/dL</Text></Text>
            <StatusBadge status="HIGH" size="sm" />
          </View>
        </View>

        {/* 4. Actionable Health Insights */}
        {insights.length > 0 && (
          <>
            <View style={[styles.sectionHeader, { marginTop: spacing.lg }]}>
              <Text style={styles.sectionTitle}>CRITICAL HEALTH INSIGHTS</Text>
              <Text style={styles.insightCount}>{insights.length} active</Text>
            </View>

            {insights.slice(0, 2).map((ins) => (
              <InsightCard
                key={ins.id}
                insight={ins}
                onUnderstandPress={handleUnderstandInsight}
              />
            ))}
          </>
        )}

        {/* 5. Today's Plan (Meds & Appointments) */}
        <View style={[styles.sectionHeader, { marginTop: spacing.lg }]}>
          <Text style={styles.sectionTitle}>TODAY'S SCHEDULE</Text>
        </View>

        <View style={styles.todayCard}>
          {/* Medication schedule item */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Medications')}
            style={styles.todayItem}
          >
            <View style={[styles.itemIcon, { backgroundColor: 'rgba(139, 92, 246, 0.15)' }]}>
              <Pill size={18} color={colors.dimensionMedication} />
            </View>
            <View style={styles.itemContent}>
              <Text style={styles.itemTitle}>Metformin • 500 mg</Text>
              <Text style={styles.itemMeta}>Scheduled: 08:00 PM • After dinner</Text>
            </View>
            <View style={styles.statusPillPending}>
              <Clock size={12} color={colors.warningText} />
              <Text style={styles.pendingText}>Pending</Text>
            </View>
          </TouchableOpacity>

          {/* Upcoming appointment */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Appointments')}
            style={[styles.todayItem, { borderTopWidth: 1, borderTopColor: colors.border, marginTop: spacing.xs, paddingTop: spacing.sm }]}
          >
            <View style={[styles.itemIcon, { backgroundColor: 'rgba(6, 182, 212, 0.15)' }]}>
              <Stethoscope size={18} color={colors.accent} />
            </View>
            <View style={styles.itemContent}>
              <Text style={styles.itemTitle}>Dr. Sarah Sharma</Text>
              <Text style={styles.itemMeta}>Cardiology & Internal • Sept 5 at 10:30 AM</Text>
            </View>
            <ChevronRight size={16} color={colors.textMuted} />
          </TouchableOpacity>
        </View>

        <View style={{ height: 90 }} />
      </ScrollView>

      {/* Floating AI Health Buddy Action Button */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => navigation.navigate('AIHealthBuddy')}
        style={styles.floatingAIButton}
      >
        <Sparkles size={20} color="#FFFFFF" />
        <Text style={styles.floatingAIText}>AI Health Buddy</Text>
      </TouchableOpacity>

      {/* Academic Debug Viva Modal */}
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
    paddingBottom: spacing.xxl
  },
  uploadBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(14, 165, 233, 0.12)',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginHorizontal: spacing.lg,
    marginVertical: spacing.xs + 2,
    borderWidth: 1,
    borderColor: 'rgba(14, 165, 233, 0.3)'
  },
  uploadIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md
  },
  uploadTextContainer: {
    flex: 1
  },
  uploadTitle: {
    ...typography.bodySemibold,
    color: colors.textPrimary
  },
  uploadSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    marginTop: spacing.md,
    marginBottom: spacing.xs + 2
  },
  sectionTitle: {
    ...typography.label,
    fontSize: 11,
    color: colors.textMuted,
    letterSpacing: 1
  },
  sectionLink: {
    ...typography.captionSemibold,
    color: colors.primary
  },
  insightCount: {
    ...typography.caption,
    color: colors.warningText
  },
  metricGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.lg - 4,
    marginTop: spacing.xs
  },
  metricCard: {
    width: '47%',
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    margin: 4,
    borderWidth: 1,
    borderColor: colors.border
  },
  metricLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: 4
  },
  metricValue: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: 6
  },
  metricUnit: {
    ...typography.caption,
    color: colors.textMuted
  },
  todayCard: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginHorizontal: spacing.lg,
    marginTop: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border
  },
  todayItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs
  },
  itemIcon: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md
  },
  itemContent: {
    flex: 1
  },
  itemTitle: {
    ...typography.bodySemibold,
    color: colors.textPrimary
  },
  itemMeta: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2
  },
  statusPillPending: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.warningGlow,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.pill
  },
  pendingText: {
    ...typography.captionSemibold,
    fontSize: 10,
    color: colors.warningText,
    marginLeft: 3
  },
  floatingAIButton: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accentPurple,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.pill,
    shadowColor: colors.accentPurple,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)'
  },
  floatingAIText: {
    ...typography.bodySemibold,
    color: '#FFFFFF',
    marginLeft: spacing.xs + 2
  }
});
