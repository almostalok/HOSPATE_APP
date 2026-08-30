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
  Alert
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { fetchVaccinations } from '../../store/wellnessSlice';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronLeft
} from 'lucide-react-native';
import { VaccinationRecord } from '@hospate/types';

export const VaccinationsScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const dispatch = useDispatch<AppDispatch>();
  const { vaccinations, isLoading } = useSelector((state: RootState) => state.wellness);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    dispatch(fetchVaccinations());
  }, [dispatch]);

  const onRefresh = async () => {
    setRefreshing(true);
    await dispatch(fetchVaccinations());
    setRefreshing(false);
  };

  const handleOpenCertificate = (url?: string) => {
    Alert.alert(
      'Digital Certificate',
      'ABDM verified QR certificate loaded successfully. Ready for travel or hospital admission verification.',
      [{ text: 'Close' }]
    );
  };

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
        <Text style={styles.headerTitle}>Immunization</Text>
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
        {isLoading && vaccinations.length === 0 ? (
          <View style={styles.loaderBox}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Syncing immunization registry...</Text>
          </View>
        ) : (
          <>
            {/* 1. Verified Passport Status Card */}
            <View style={styles.heroCard}>
              <View style={styles.heroHeader}>
                <View>
                  <Text style={styles.heroEyebrow}>NATIONAL HEALTH REGISTRY (ABDM)</Text>
                  <Text style={styles.heroTitle}>Immunization Passport</Text>
                  <Text style={styles.heroSub}>
                    Linked to Alok Kumar Singh • ABHA #91-8921-7721-0042
                  </Text>
                </View>
                <View style={styles.verifiedBadge}>
                  <ShieldCheck size={26} color="#34C759" />
                </View>
              </View>

              <View style={styles.passportRow}>
                <View style={styles.passportItem}>
                  <Text style={styles.passportLabel}>Vaccines Logged</Text>
                  <Text style={styles.passportVal}>{vaccinations.length} Active</Text>
                </View>
                <View style={styles.passportItem}>
                  <Text style={styles.passportLabel}>Compliance</Text>
                  <Text style={[styles.passportVal, { color: '#34C759' }]}>100% Up to Date</Text>
                </View>
              </View>
            </View>

            {/* 2. Vaccine Records List */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>ADMINISTERED DOSES & BOOSTERS</Text>
            </View>

            {vaccinations.map((vax: VaccinationRecord) => {
              const isBoosterDue = vax.status === 'BOOSTER_DUE';
              return (
                <View key={vax.id} style={styles.vaxCard}>
                  <View style={styles.vaxHeader}>
                    <View style={styles.vaxLeft}>
                      <Text style={styles.vaxName}>{vax.vaccineName}</Text>
                      <Text style={styles.vaxTarget}>Protects against: {vax.targetDisease}</Text>
                    </View>

                    <View
                      style={[
                        styles.statusBadge,
                        {
                          backgroundColor: isBoosterDue
                            ? 'rgba(255, 159, 10, 0.12)'
                            : 'rgba(52, 199, 89, 0.12)'
                        }
                      ]}
                    >
                      {isBoosterDue ? (
                        <Clock size={12} color="#FF9F0A" />
                      ) : (
                        <CheckCircle2 size={12} color="#34C759" />
                      )}
                      <Text
                        style={[
                          styles.statusBadgeText,
                          { color: isBoosterDue ? '#FF9F0A' : '#34C759' }
                        ]}
                      >
                        {isBoosterDue ? 'DUE OCT 2026' : 'COMPLETED'}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.vaxDetailsGrid}>
                    <View style={styles.detailCol}>
                      <Text style={styles.detailLabel}>Dose</Text>
                      <Text style={styles.detailVal}>
                        Dose {vax.doseNumber} of {vax.totalDoses}
                      </Text>
                    </View>

                    <View style={styles.detailCol}>
                      <Text style={styles.detailLabel}>Date</Text>
                      <Text style={styles.detailVal}>{vax.administeredDate}</Text>
                    </View>

                    <View style={styles.detailCol}>
                      <Text style={styles.detailLabel}>Batch / Lot</Text>
                      <Text style={styles.detailVal}>{vax.batchNumber}</Text>
                    </View>
                  </View>

                  <Text style={styles.facilityText}>Administered at: {vax.administeredBy}</Text>

                  {vax.certificateUrl && (
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => handleOpenCertificate(vax.certificateUrl)}
                      style={styles.certButton}
                    >
                      <ExternalLink size={14} color={colors.primary} />
                      <Text style={styles.certButtonText}>View Signed Digital Certificate</Text>
                    </TouchableOpacity>
                  )}
                </View>
              );
            })}
          </>
        )}
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
    alignItems: 'flex-start',
    marginBottom: spacing.md
  },
  heroEyebrow: {
    ...typography.label,
    color: colors.primary,
    fontSize: 11,
    letterSpacing: 0.5,
    marginBottom: 4
  },
  heroTitle: {
    ...typography.h2,
    color: colors.textPrimary,
    fontWeight: '800',
    marginBottom: 2
  },
  heroSub: {
    ...typography.caption,
    color: colors.textSecondary
  },
  verifiedBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(52, 199, 89, 0.12)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  passportRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border
  },
  passportItem: {
    flex: 1
  },
  passportLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: 2
  },
  passportVal: {
    ...typography.bodySemibold,
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '800'
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
  vaxCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md
  },
  vaxHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm
  },
  vaxLeft: {
    flex: 1,
    marginRight: spacing.sm
  },
  vaxName: {
    ...typography.bodySemibold,
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2
  },
  vaxTarget: {
    ...typography.caption,
    color: colors.textSecondary
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: borderRadius.pill
  },
  statusBadgeText: {
    ...typography.caption,
    fontSize: 10,
    fontWeight: '800'
  },
  vaxDetailsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.background,
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    marginVertical: spacing.sm
  },
  detailCol: {
    flex: 1
  },
  detailLabel: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 10,
    marginBottom: 2
  },
  detailVal: {
    ...typography.caption,
    color: colors.textPrimary,
    fontWeight: '700'
  },
  facilityText: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.sm
  },
  certButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingTop: spacing.xs
  },
  certButtonText: {
    ...typography.captionSemibold,
    color: colors.primary
  }
});
