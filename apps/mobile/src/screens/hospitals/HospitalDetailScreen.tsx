import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { api } from '../../api/client';
import { Hospital } from '@hospate/types';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { PrimaryButton } from '../../components/PrimaryButton';
import {
  ArrowLeft,
  Building,
  MapPin,
  Star,
  Bed,
  Phone,
  ShieldCheck,
  Stethoscope,
  Clock,
  Calendar
} from 'lucide-react-native';

export const HospitalDetailScreen: React.FC<{ route: any; navigation: any }> = ({
  route,
  navigation
}) => {
  const { hospitalId } = route.params || {};
  const [hospital, setHospital] = useState<Hospital | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHosp = async () => {
      try {
        if (hospitalId) {
          const res = await api.getHospitalById(hospitalId);
          setHospital(res || null);
        }
      } catch (e) {
        console.warn(e);
      } finally {
        setLoading(false);
      }
    };
    loadHosp();
  }, [hospitalId]);

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  if (!hospital) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <Text style={styles.errorText}>Hospital information unavailable</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ArrowLeft size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>HOSPITAL DETAILS</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Main Hospital Info Card */}
        <View style={styles.mainCard}>
          <View style={styles.iconCircle}>
            <Building size={28} color={colors.primary} />
          </View>

          <Text style={styles.hospTitle}>{hospital.name}</Text>
          <View style={styles.locationRow}>
            <MapPin size={14} color={colors.textMuted} />
            <Text style={styles.locationText}>{hospital.address}, {hospital.city}</Text>
          </View>

          <View style={styles.metaBadgeRow}>
            <View style={styles.ratingBadge}>
              <Star size={14} color={colors.warningText} />
              <Text style={styles.ratingText}>{hospital.rating} Rating ({hospital.reviewCount}+ verified reviews)</Text>
            </View>
          </View>

          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>DISTANCE</Text>
              <Text style={styles.statVal}>{hospital.distanceKm} km</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>AVAILABLE BEDS</Text>
              <Text style={[styles.statVal, { color: colors.successText }]}>{hospital.availableBeds} free</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>EMERGENCY</Text>
              <Text style={[styles.statVal, { color: colors.dangerText }]}>24x7 Ready</Text>
            </View>
          </View>
        </View>

        {/* Specialities */}
        <Text style={styles.sectionHeader}>DEPARTMENTS & SPECIALITIES</Text>
        <View style={styles.specWrap}>
          {hospital.specialities.map((s, idx) => (
            <View key={idx} style={styles.specChip}>
              <Text style={styles.specText}>{s}</Text>
            </View>
          ))}
        </View>

        {/* Available Doctors */}
        {hospital.doctors && hospital.doctors.length > 0 && (
          <>
            <Text style={[styles.sectionHeader, { marginTop: spacing.lg }]}>
              AVAILABLE PHYSICIANS ({hospital.doctors.length})
            </Text>

            {hospital.doctors.map((doc) => (
              <View key={doc.id} style={styles.doctorCard}>
                <View style={styles.doctorIcon}>
                  <Stethoscope size={20} color={colors.primary} />
                </View>
                <View style={styles.doctorInfo}>
                  <Text style={styles.doctorName}>{doc.name}</Text>
                  <Text style={styles.doctorSpec}>{doc.speciality} • {doc.experienceYears} yrs exp</Text>
                  <View style={styles.slotRow}>
                    <Clock size={12} color={colors.successText} />
                    <Text style={styles.slotText}>Next available: {doc.availableSlot}</Text>
                  </View>
                </View>
              </View>
            ))}
          </>
        )}

        {/* Insurance Accepted */}
        <View style={styles.insuranceCard}>
          <ShieldCheck size={16} color={colors.primary} />
          <Text style={styles.insuranceTitle}>Cashless Insurance Accepted</Text>
          <Text style={styles.insuranceList}>
            {hospital.insuranceAccepted?.join(' • ') || 'All major insurance TPAs accepted'}
          </Text>
        </View>

        {/* Actions */}
        <PrimaryButton
          title="Book Consultation"
          onPress={() => navigation.navigate('Appointments')}
          size="lg"
          icon={<Calendar size={18} color="#FFFFFF" />}
          style={{ marginTop: spacing.md }}
        />

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
  center: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerTitle: {
    ...typography.label,
    fontSize: 12,
    color: colors.textPrimary,
    letterSpacing: 1
  },
  scroll: {
    padding: spacing.lg
  },
  mainCard: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primaryGlow,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm
  },
  hospTitle: {
    ...typography.h2,
    color: colors.textPrimary,
    textAlign: 'center'
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4
  },
  locationText: {
    ...typography.caption,
    color: colors.textSecondary,
    marginLeft: 4,
    textAlign: 'center'
  },
  metaBadgeRow: {
    marginTop: spacing.sm
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    borderRadius: borderRadius.pill
  },
  ratingText: {
    ...typography.captionSemibold,
    color: colors.textSecondary,
    marginLeft: 4,
    fontSize: 11
  },
  statsGrid: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    marginTop: spacing.md
  },
  statBox: {
    flex: 1,
    alignItems: 'center'
  },
  statLabel: {
    ...typography.label,
    fontSize: 8,
    color: colors.textMuted
  },
  statVal: {
    ...typography.captionSemibold,
    fontSize: 12,
    color: colors.textPrimary,
    marginTop: 2
  },
  sectionHeader: {
    ...typography.label,
    fontSize: 11,
    color: colors.textMuted,
    letterSpacing: 1,
    marginBottom: spacing.sm
  },
  specWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.sm
  },
  specChip: {
    backgroundColor: colors.surfaceElevated,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: borderRadius.sm,
    marginRight: spacing.xs + 2,
    marginBottom: spacing.xs + 2,
    borderWidth: 1,
    borderColor: colors.border
  },
  specText: {
    ...typography.captionSemibold,
    color: colors.textSecondary,
    fontSize: 11
  },
  doctorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border
  },
  doctorIcon: {
    width: 42,
    height: 42,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primaryGlow,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md
  },
  doctorInfo: {
    flex: 1
  },
  doctorName: {
    ...typography.bodySemibold,
    color: colors.textPrimary
  },
  doctorSpec: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 1
  },
  slotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4
  },
  slotText: {
    ...typography.captionSemibold,
    fontSize: 10,
    color: colors.successText,
    marginLeft: 4
  },
  insuranceCard: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: spacing.md,
    marginBottom: spacing.sm
  },
  insuranceTitle: {
    ...typography.bodySemibold,
    color: colors.textPrimary,
    marginTop: 4
  },
  insuranceList: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2
  },
  errorText: {
    ...typography.bodySemibold,
    color: colors.dangerText
  }
});
