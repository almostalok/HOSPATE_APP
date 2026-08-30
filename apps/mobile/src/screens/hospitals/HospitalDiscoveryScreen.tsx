import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  RefreshControl
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { fetchHospitals, setSelectedHospital } from '../../store/hospitalsSlice';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { Hospital } from '@hospate/types';
import {
  Search,
  Building,
  MapPin,
  Star,
  Bed,
  ShieldCheck,
  Phone,
  ChevronRight,
  ShieldAlert
} from 'lucide-react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SPECIALITY_FILTERS = [
  'All',
  'Cardiology',
  'Internal Medicine',
  'Endocrinology',
  'Emergency 24x7',
  'Diagnostics'
];

export const HospitalDiscoveryScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch<AppDispatch>();
  const { hospitals, isLoading } = useSelector((state: RootState) => state.hospitals);

  const [search, setSearch] = useState('');
  const [selectedSpec, setSelectedSpec] = useState('All');

  const loadData = () => {
    dispatch(fetchHospitals({ search, speciality: selectedSpec }));
  };

  useEffect(() => {
    loadData();
  }, [selectedSpec]);

  const handleHospitalPress = (hospital: Hospital) => {
    dispatch(setSelectedHospital(hospital));
    navigation.navigate('HospitalDetail', { hospitalId: hospital.id });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 14) + 4 }]}>
        <Text style={styles.headerTitle}>Hospital Discovery</Text>
        <Text style={styles.headerSubtitle}>Verified healthcare facilities & bed availability</Text>
      </View>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={18} color={colors.textMuted} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search hospitals, clinics, cities..."
            placeholderTextColor={colors.textMuted}
            value={search}
            onChangeText={setSearch}
            onSubmitEditing={loadData}
            returnKeyType="search"
          />
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {SPECIALITY_FILTERS.map(spec => (
            <TouchableOpacity
              key={spec}
              activeOpacity={0.8}
              onPress={() => setSelectedSpec(spec)}
              style={[styles.filterChip, selectedSpec === spec && styles.filterChipActive]}
            >
              <Text style={[styles.filterText, selectedSpec === spec && styles.filterTextActive]}>
                {spec}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Hospital List */}
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={loadData} tintColor={colors.primary} />
        }
      >
        {hospitals.map((hosp) => (
          <TouchableOpacity
            key={hosp.id}
            activeOpacity={0.8}
            onPress={() => handleHospitalPress(hosp)}
            style={styles.card}
          >
            <View style={styles.topRow}>
              <View style={styles.iconBox}>
                <Building size={22} color={colors.primary} />
              </View>
              <View style={styles.infoMain}>
                <Text style={styles.hospName}>{hosp.name}</Text>
                <View style={styles.locationRow}>
                  <MapPin size={12} color={colors.textMuted} />
                  <Text style={styles.locationText}>{hosp.address}</Text>
                </View>
              </View>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statBadge}>
                <Star size={12} color={colors.warningText} />
                <Text style={styles.statText}>{hosp.rating} ({hosp.reviewCount})</Text>
              </View>

              <View style={styles.statBadge}>
                <MapPin size={12} color={colors.accent} />
                <Text style={styles.statText}>{hosp.distanceKm} km away</Text>
              </View>

              <View style={[styles.statBadge, styles.bedBadge]}>
                <Bed size={12} color={colors.successText} />
                <Text style={styles.bedText}>{hosp.availableBeds} beds free</Text>
              </View>

              {hosp.emergencyAvailable && (
                <View style={[styles.statBadge, styles.emergencyBadge]}>
                  <ShieldAlert size={12} color={colors.dangerText} />
                  <Text style={styles.emergencyText}>24x7 SOS</Text>
                </View>
              )}
            </View>

            <View style={styles.specsRow}>
              {hosp.specialities.slice(0, 3).map((s, idx) => (
                <View key={idx} style={styles.specChip}>
                  <Text style={styles.specChipText}>{s}</Text>
                </View>
              ))}
              {hosp.specialities.length > 3 && (
                <Text style={styles.moreSpecsText}>+{hosp.specialities.length - 3} more</Text>
              )}
            </View>
          </TouchableOpacity>
        ))}

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
  headerSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2
  },
  searchContainer: {
    paddingHorizontal: spacing.lg,
    marginVertical: spacing.xs + 2
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border
  },
  searchIcon: {
    marginRight: spacing.sm
  },
  searchInput: {
    flex: 1,
    ...typography.body,
    color: colors.textPrimary,
    paddingVertical: spacing.sm + 2
  },
  filterRow: {
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface
  },
  filterScroll: {
    paddingHorizontal: spacing.lg
  },
  filterChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.surfaceElevated,
    marginRight: spacing.xs + 2,
    borderWidth: 1,
    borderColor: colors.border
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary
  },
  filterText: {
    ...typography.label,
    fontSize: 10,
    color: colors.textSecondary
  },
  filterTextActive: {
    color: '#FFFFFF'
  },
  scroll: {
    padding: spacing.lg
  },
  card: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primaryGlow,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md
  },
  infoMain: {
    flex: 1
  },
  hospName: {
    ...typography.bodySemibold,
    color: colors.textPrimary,
    fontSize: 15
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2
  },
  locationText: {
    ...typography.caption,
    color: colors.textSecondary,
    marginLeft: 3,
    fontSize: 11
  },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: spacing.xs
  },
  statBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.sm,
    marginRight: spacing.xs + 2,
    marginBottom: 4
  },
  statText: {
    ...typography.caption,
    fontSize: 11,
    color: colors.textSecondary,
    marginLeft: 4
  },
  bedBadge: {
    backgroundColor: colors.successGlow
  },
  bedText: {
    ...typography.captionSemibold,
    fontSize: 11,
    color: colors.successText,
    marginLeft: 4
  },
  emergencyBadge: {
    backgroundColor: colors.dangerGlow
  },
  emergencyText: {
    ...typography.label,
    fontSize: 9,
    color: colors.dangerText,
    marginLeft: 4
  },
  specsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: spacing.xs + 2,
    paddingTop: spacing.xs + 2,
    borderTopWidth: 1,
    borderTopColor: colors.border
  },
  specChip: {
    backgroundColor: 'rgba(14, 165, 233, 0.08)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    marginRight: spacing.xs
  },
  specChipText: {
    ...typography.caption,
    fontSize: 10,
    color: colors.primary
  },
  moreSpecsText: {
    ...typography.caption,
    fontSize: 10,
    color: colors.textMuted
  }
});
