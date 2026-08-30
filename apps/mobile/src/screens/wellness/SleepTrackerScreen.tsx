import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  Dimensions
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { fetchSleepData } from '../../store/wellnessSlice';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import {
  Moon,
  Heart,
  Activity,
  Zap,
  ChevronLeft,
  TrendingUp
} from 'lucide-react-native';
import { SleepStage } from '@hospate/types';

const { width } = Dimensions.get('window');

export const SleepTrackerScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const dispatch = useDispatch<AppDispatch>();
  const { sleepData, isLoading } = useSelector((state: RootState) => state.wellness);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    dispatch(fetchSleepData());
  }, [dispatch]);

  const onRefresh = async () => {
    setRefreshing(true);
    await dispatch(fetchSleepData());
    setRefreshing(false);
  };

  const hours = sleepData ? Math.floor(sleepData.totalDurationHours) : 0;
  const minutes = sleepData ? Math.round((sleepData.totalDurationHours - hours) * 60) : 0;

  return (
    <SafeAreaView style={styles.container}>
      {/* Apple Clean Nav Header */}
      <View style={[styles.navHeader, { paddingTop: Math.max(insets.top, 36) + 4 }]}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <ChevronLeft size={22} color={colors.primary} />
          <Text style={styles.backBtnText}>Summary</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sleep & Recovery</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.contentContainer,
          { paddingBottom: Math.max(insets.bottom, 24) + 24 }
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
      >
        {isLoading && !sleepData ? (
          <View style={styles.loaderBox}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Analyzing circadian sleep telemetry...</Text>
          </View>
        ) : sleepData ? (
          <>
            {/* 1. Hero Sleep Score Card */}
            <View style={styles.heroCard}>
              <View style={styles.heroHeader}>
                <View>
                  <Text style={styles.heroEyebrow}>LAST NIGHT'S RECOVERY</Text>
                  <Text style={styles.heroDuration}>
                    {hours}h {minutes}m
                  </Text>
                  <Text style={styles.heroTimes}>
                    In Bed: {sleepData.bedTime} → Woke up: {sleepData.wakeTime}
                  </Text>
                </View>
                <View style={styles.scoreBadge}>
                  <Text style={styles.scoreNumber}>{sleepData.qualityScore}</Text>
                  <Text style={styles.scoreLabel}>OPTIMAL</Text>
                </View>
              </View>

              {/* Multi-stage hypnogram bar */}
              <View style={styles.hypnoBarContainer}>
                {sleepData.stages.map((st: SleepStage, idx: number) => (
                  <View
                    key={idx}
                    style={[
                      styles.hypnoSegment,
                      {
                        backgroundColor: st.color,
                        flex: st.percentage
                      }
                    ]}
                  />
                ))}
              </View>

              {/* Stage breakdown legend */}
              <View style={styles.stagesRow}>
                {sleepData.stages.map((st: SleepStage, idx: number) => (
                  <View key={idx} style={styles.stageCol}>
                    <View style={styles.stageLegend}>
                      <View style={[styles.stageDot, { backgroundColor: st.color }]} />
                      <Text style={styles.stageName}>{st.stage}</Text>
                    </View>
                    <Text style={styles.stageTime}>
                      {Math.floor(st.durationMinutes / 60)}h {st.durationMinutes % 60}m
                    </Text>
                    <Text style={styles.stagePct}>{st.percentage}%</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* 2. Biometric Vitals during Sleep */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>NOCTURNAL BIOMETRICS</Text>
            </View>

            <View style={styles.vitalsGrid}>
              {/* Resting HR */}
              <View style={styles.vitalCard}>
                <View style={styles.vitalIconCircle}>
                  <Heart size={18} color="#FF453A" />
                </View>
                <Text style={styles.vitalLabel}>Resting Heart Rate</Text>
                <Text style={styles.vitalVal}>
                  {sleepData.restingHeartRateBpm} <Text style={styles.vitalUnit}>BPM</Text>
                </Text>
                <Text style={styles.vitalSub}>Low & restorative baseline</Text>
              </View>

              {/* HRV */}
              <View style={styles.vitalCard}>
                <View style={[styles.vitalIconCircle, { backgroundColor: 'rgba(94, 92, 230, 0.12)' }]}>
                  <Activity size={18} color="#5E5CE6" />
                </View>
                <Text style={styles.vitalLabel}>Heart Rate Variability</Text>
                <Text style={styles.vitalVal}>
                  {sleepData.heartRateVariabilityMs} <Text style={styles.vitalUnit}>ms</Text>
                </Text>
                <Text style={styles.vitalSub}>High autonomic recovery</Text>
              </View>

              {/* Respiratory Rate */}
              <View style={styles.vitalCard}>
                <View style={[styles.vitalIconCircle, { backgroundColor: 'rgba(10, 132, 255, 0.12)' }]}>
                  <Zap size={18} color="#0A84FF" />
                </View>
                <Text style={styles.vitalLabel}>Respiratory Rate</Text>
                <Text style={styles.vitalVal}>
                  {sleepData.respiratoryRateBreathsPerMin} <Text style={styles.vitalUnit}>rpm</Text>
                </Text>
                <Text style={styles.vitalSub}>Stable breathing rhythm</Text>
              </View>

              {/* Weekly Average */}
              <View style={styles.vitalCard}>
                <View style={[styles.vitalIconCircle, { backgroundColor: 'rgba(52, 199, 89, 0.12)' }]}>
                  <TrendingUp size={18} color="#34C759" />
                </View>
                <Text style={styles.vitalLabel}>7-Day Sleep Avg</Text>
                <Text style={styles.vitalVal}>
                  {sleepData.weeklyAverages.avgHours} <Text style={styles.vitalUnit}>hours</Text>
                </Text>
                <Text style={styles.vitalSub}>Consistency score: 87/100</Text>
              </View>
            </View>

            {/* 3. Sleep Hygiene Insights */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>HEALTH BUDDY SLEEP INSIGHTS</Text>
            </View>

            <View style={styles.insightsCard}>
              {sleepData.insights.map((ins: string, idx: number) => (
                <View key={idx} style={[styles.insightRow, idx < sleepData.insights.length - 1 && styles.insightDivider]}>
                  <Moon size={16} color={colors.primary} style={{ marginTop: 2 }} />
                  <Text style={styles.insightText}>{ins}</Text>
                </View>
              ))}
            </View>
          </>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background
  },
  navHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2
  },
  backBtnText: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '500'
  },
  headerTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    fontWeight: '700'
  },
  scrollView: {
    flex: 1
  },
  contentContainer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md
  },
  loaderBox: {
    paddingVertical: 60,
    alignItems: 'center',
    justifyContent: 'center'
  },
  loadingText: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.md
  },
  heroCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg
  },
  heroEyebrow: {
    ...typography.label,
    color: colors.primary,
    fontSize: 11,
    letterSpacing: 0.5,
    marginBottom: 4
  },
  heroDuration: {
    ...typography.h1,
    color: colors.textPrimary,
    fontWeight: '800',
    marginBottom: 2
  },
  heroTimes: {
    ...typography.caption,
    color: colors.textSecondary
  },
  scoreBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.background,
    borderWidth: 3,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center'
  },
  scoreNumber: {
    ...typography.h2,
    color: colors.textPrimary,
    fontWeight: '800'
  },
  scoreLabel: {
    ...typography.caption,
    color: colors.primary,
    fontSize: 8,
    fontWeight: '800'
  },
  hypnoBarContainer: {
    flexDirection: 'row',
    height: 16,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: spacing.lg
  },
  hypnoSegment: {
    height: '100%'
  },
  stagesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  stageCol: {
    alignItems: 'center'
  },
  stageLegend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2
  },
  stageDot: {
    width: 8,
    height: 8,
    borderRadius: 4
  },
  stageName: {
    ...typography.caption,
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '600'
  },
  stageTime: {
    ...typography.caption,
    color: colors.textPrimary,
    fontWeight: '700'
  },
  stagePct: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 11
  },
  sectionHeader: {
    marginBottom: spacing.sm
  },
  sectionTitle: {
    ...typography.label,
    color: colors.textMuted,
    fontSize: 11,
    letterSpacing: 0.5
  },
  vitalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: spacing.sm,
    marginBottom: spacing.lg
  },
  vitalCard: {
    width: '48.5%',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border
  },
  vitalIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 69, 58, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm
  },
  vitalLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: 2
  },
  vitalVal: {
    ...typography.bodySemibold,
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 2
  },
  vitalUnit: {
    ...typography.caption,
    color: colors.textMuted,
    fontWeight: '400'
  },
  vitalSub: {
    ...typography.caption,
    color: colors.primary,
    fontSize: 11,
    fontWeight: '600'
  },
  insightsCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border
  },
  insightRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    paddingVertical: spacing.sm
  },
  insightDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border
  },
  insightText: {
    ...typography.caption,
    color: colors.textSecondary,
    flex: 1,
    lineHeight: 18
  }
});
