import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  RefreshControl
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { fetchHealthOverview } from '../../store/healthSlice';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { TimelineItem } from '../../components/TimelineItem';
import { ArrowLeft, Clock, Filter, Plus } from 'lucide-react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TIMELINE_FILTERS = ['ALL', 'LAB', 'PRESCRIPTION', 'CONSULTATION'];

export const HealthTimelineScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch<AppDispatch>();
  const { timeline, isLoading } = useSelector((state: RootState) => state.health);
  const [activeFilter, setActiveFilter] = useState('ALL');

  useEffect(() => {
    dispatch(fetchHealthOverview());
  }, []);

  const filteredEvents = timeline.filter(event => {
    if (activeFilter === 'ALL') return true;
    return event.type === activeFilter;
  });

  const handleEventPress = (event: any) => {
    if (event.recordId) {
      navigation.navigate('RecordDetail', { recordId: event.recordId });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 14) + 4 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ArrowLeft size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Health Timeline</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => navigation.navigate('UploadDocument')}
        >
          <Plus size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {TIMELINE_FILTERS.map(f => (
            <TouchableOpacity
              key={f}
              activeOpacity={0.8}
              onPress={() => setActiveFilter(f)}
              style={[styles.filterChip, activeFilter === f && styles.filterChipActive]}
            >
              <Text style={[styles.filterText, activeFilter === f && styles.filterTextActive]}>
                {f}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Timeline List */}
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={() => dispatch(fetchHealthOverview())} tintColor={colors.primary} />
        }
      >
        <View style={styles.timelineIntro}>
          <Clock size={16} color={colors.primary} />
          <Text style={styles.introText}>
            Continuous chronological record of your health investigations, prescriptions, and AI analysis events.
          </Text>
        </View>

        {filteredEvents.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No events in this view</Text>
            <Text style={styles.emptySubtitle}>Upload a medical report to add to your health timeline.</Text>
          </View>
        ) : (
          filteredEvents.map((event, idx) => (
            <TimelineItem
              key={event.id}
              event={event}
              isLast={idx === filteredEvents.length - 1}
              onPress={handleEventPress}
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
    fontSize: 13,
    color: colors.textPrimary,
    letterSpacing: 1
  },
  addBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(14, 165, 233, 0.15)',
    alignItems: 'center',
    justifyContent: 'center'
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
    paddingTop: spacing.md
  },
  timelineIntro: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border
  },
  introText: {
    ...typography.caption,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
    flex: 1,
    lineHeight: 16
  },
  emptyState: {
    padding: spacing.xxl,
    alignItems: 'center'
  },
  emptyTitle: {
    ...typography.bodySemibold,
    color: colors.textPrimary
  },
  emptySubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 4,
    textAlign: 'center'
  }
});
