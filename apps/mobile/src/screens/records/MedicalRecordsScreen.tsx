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
import { fetchRecords, setFilterType, setSearchQuery } from '../../store/recordsSlice';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { RecordCard } from '../../components/RecordCard';
import { Search, Upload, Filter, Plus, FileQuestion } from 'lucide-react-native';

const FILTER_TABS = [
  { key: 'ALL', label: 'All Records' },
  { key: 'LAB_REPORT', label: 'Lab Reports' },
  { key: 'PRESCRIPTION', label: 'Prescriptions' },
  { key: 'SCAN', label: 'Scans & Imaging' }
];

export const MedicalRecordsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { records, filterType, searchQuery, isLoading } = useSelector(
    (state: RootState) => state.records
  );

  const [searchText, setSearchText] = useState(searchQuery);

  const loadRecords = () => {
    dispatch(fetchRecords({ filterType, search: searchText }));
  };

  useEffect(() => {
    loadRecords();
  }, [filterType]);

  const handleSearchSubmit = () => {
    dispatch(setSearchQuery(searchText));
    dispatch(fetchRecords({ filterType, search: searchText }));
  };

  const handleSelectFilter = (key: string) => {
    dispatch(setFilterType(key));
  };

  const handleRecordPress = (record: any) => {
    navigation.navigate('RecordDetail', { recordId: record.id });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Medical Records</Text>
          <Text style={styles.headerSubtitle}>Centralized FHIR-aligned health vault</Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate('UploadDocument')}
          style={styles.uploadBtn}
        >
          <Plus size={18} color="#FFFFFF" />
          <Text style={styles.uploadBtnText}>Upload</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={18} color={colors.textMuted} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search reports, parameters, clinics..."
            placeholderTextColor={colors.textMuted}
            value={searchText}
            onChangeText={setSearchText}
            onSubmitEditing={handleSearchSubmit}
            returnKeyType="search"
          />
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {FILTER_TABS.map(tab => (
            <TouchableOpacity
              key={tab.key}
              activeOpacity={0.8}
              onPress={() => handleSelectFilter(tab.key)}
              style={[styles.filterChip, filterType === tab.key && styles.filterChipActive]}
            >
              <Text style={[styles.filterText, filterType === tab.key && styles.filterTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Records Feed */}
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={loadRecords} tintColor={colors.primary} />
        }
      >
        {records.length === 0 ? (
          <View style={styles.emptyState}>
            <FileQuestion size={48} color={colors.textMuted} />
            <Text style={styles.emptyTitle}>Your health story starts here.</Text>
            <Text style={styles.emptySubtitle}>
              Upload your first medical report and Hospate will begin building your continuous health timeline.
            </Text>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.navigate('UploadDocument')}
              style={styles.emptyUploadBtn}
            >
              <Upload size={16} color="#FFFFFF" />
              <Text style={styles.emptyUploadText}>Upload Report</Text>
            </TouchableOpacity>
          </View>
        ) : (
          records.map((rec) => (
            <RecordCard
              key={rec.id}
              record={rec}
              onPress={handleRecordPress}
            />
          ))
        )}

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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  uploadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: borderRadius.pill
  },
  uploadBtnText: {
    ...typography.bodySemibold,
    color: '#FFFFFF',
    marginLeft: 4,
    fontSize: 13
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
    paddingTop: spacing.xs + 2
  },
  emptyState: {
    padding: spacing.xxl,
    alignItems: 'center',
    marginTop: spacing.xl
  },
  emptyTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginTop: spacing.md
  },
  emptySubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xs,
    lineHeight: 20
  },
  emptyUploadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    marginTop: spacing.lg
  },
  emptyUploadText: {
    ...typography.bodySemibold,
    color: '#FFFFFF',
    marginLeft: spacing.xs + 2
  }
});
