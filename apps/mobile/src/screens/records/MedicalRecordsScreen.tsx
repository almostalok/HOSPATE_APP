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
import { Search, Plus, FileQuestion } from 'lucide-react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

const FILTER_TABS = [
  { key: 'ALL', label: 'All' },
  { key: 'LAB_REPORT', label: 'Lab Reports' },
  { key: 'PRESCRIPTION', label: 'Prescriptions' },
  { key: 'SCAN', label: 'Scans & Echo' },
  { key: 'BILL', label: 'Bills & Invoices' },
  { key: 'VACCINATION', label: 'Vaccines' }
];

export const MedicalRecordsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
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
      {/* Apple Header */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 36) + 8, paddingBottom: spacing.sm + 2 }]}>
        <View>
          <Text style={styles.headerTitle}>Medical Records</Text>
          <Text style={styles.headerSubtitle}>Personal health archive</Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate('UploadDocument')}
          style={styles.uploadBtn}
        >
          <Plus size={16} color="#FFFFFF" />
          <Text style={styles.uploadBtnText}>Upload</Text>
        </TouchableOpacity>
      </View>

      {/* Apple Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={16} color={colors.textMuted} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search reports, biomarkers, clinics..."
            placeholderTextColor={colors.textMuted}
            value={searchText}
            onChangeText={setSearchText}
            onSubmitEditing={handleSearchSubmit}
            returnKeyType="search"
          />
        </View>
      </View>

      {/* Apple Segmented Control */}
      <View style={styles.filterRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {FILTER_TABS.map(tab => {
            const isSelected = filterType === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                activeOpacity={0.7}
                onPress={() => handleSelectFilter(tab.key)}
                style={[styles.filterChip, isSelected && styles.filterChipActive]}
              >
                <Text style={[styles.filterText, isSelected && styles.filterTextActive]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
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
            <FileQuestion size={44} color={colors.textMuted} />
            <Text style={styles.emptyTitle}>No medical records found</Text>
            <Text style={styles.emptySubtitle}>
              Upload a lab report or prescription to start tracking your biomarkers over time.
            </Text>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.navigate('UploadDocument')}
              style={styles.emptyUploadBtn}
            >
              <Plus size={16} color="#FFFFFF" />
              <Text style={styles.emptyUploadText}>Upload First Document</Text>
            </TouchableOpacity>
          </View>
        ) : (
          records.map((rec) => (
            <RecordCard
              key={rec.id}
              record={rec}
              onPress={() => handleRecordPress(rec)}
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
    paddingBottom: spacing.xs
  },
  headerTitle: {
    ...typography.h1,
    fontSize: 26,
    color: colors.textPrimary,
    fontWeight: '700'
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
    paddingVertical: 7,
    borderRadius: borderRadius.pill
  },
  uploadBtnText: {
    ...typography.captionSemibold,
    color: '#FFFFFF',
    marginLeft: 4,
    fontSize: 13
  },
  searchContainer: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.sm,
    marginBottom: spacing.xs
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
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
    paddingVertical: 10
  },
  filterRow: {
    paddingVertical: spacing.xs + 2,
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },
  filterScroll: {
    paddingHorizontal: spacing.lg
  },
  filterChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.surface,
    marginRight: spacing.xs + 2,
    borderWidth: 1,
    borderColor: colors.border
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary
  },
  filterText: {
    ...typography.captionSemibold,
    color: colors.textSecondary,
    fontSize: 12
  },
  filterTextActive: {
    color: '#FFFFFF'
  },
  scroll: {
    padding: spacing.lg,
    paddingTop: spacing.sm
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
    marginLeft: spacing.xs
  }
});
