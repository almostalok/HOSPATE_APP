import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { fetchDietPlan, logWaterCup, toggleMealLogged } from '../../store/wellnessSlice';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import {
  Flame,
  Droplet,
  CheckCircle2,
  Circle,
  Plus,
  Heart,
  ChevronLeft
} from 'lucide-react-native';
import { MealCategory, MealItem } from '@hospate/types';

export const DietPlannerScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const dispatch = useDispatch<AppDispatch>();
  const { dietPlan, isLoading } = useSelector((state: RootState) => state.wellness);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    dispatch(fetchDietPlan());
  }, [dispatch]);

  const onRefresh = async () => {
    setRefreshing(true);
    await dispatch(fetchDietPlan());
    setRefreshing(false);
  };

  const handleToggleMeal = (categoryIndex: number, itemIndex: number) => {
    dispatch(toggleMealLogged({ categoryIndex, itemIndex }));
  };

  const handleAddWater = () => {
    dispatch(logWaterCup());
  };

  const caloriesRemaining = dietPlan ? Math.max(0, dietPlan.dailyCaloriesTarget - dietPlan.consumedCalories) : 0;
  const caloriePercent = dietPlan ? Math.min(100, Math.round((dietPlan.consumedCalories / dietPlan.dailyCaloriesTarget) * 100)) : 0;

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
        <Text style={styles.headerTitle}>Diet & Nutrition</Text>
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
        {isLoading && !dietPlan ? (
          <View style={styles.loaderBox}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Loading personalized nutrition plan...</Text>
          </View>
        ) : dietPlan ? (
          <>
            {/* 1. Hero Calorie Target Card */}
            <View style={styles.heroCard}>
              <View style={styles.heroHeader}>
                <View>
                  <Text style={styles.heroEyebrow}>GOAL: {dietPlan.goal.toUpperCase()}</Text>
                  <Text style={styles.heroCalories}>
                    {dietPlan.consumedCalories}
                    <Text style={styles.heroCaloriesUnit}> / {dietPlan.dailyCaloriesTarget} kcal</Text>
                  </Text>
                </View>
                <View style={styles.calorieRing}>
                  <Text style={styles.ringPercent}>{caloriePercent}%</Text>
                  <Text style={styles.ringLabel}>MET</Text>
                </View>
              </View>

              {/* Progress Bar */}
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: `${caloriePercent}%` }]} />
              </View>

              <Text style={styles.calorieRemainingText}>
                {caloriesRemaining} kcal remaining for today's active performance
              </Text>

              {/* Macronutrient Triple Meter */}
              <View style={styles.macrosRow}>
                {/* Protein */}
                <View style={styles.macroCol}>
                  <View style={styles.macroHeader}>
                    <Text style={styles.macroName}>Protein</Text>
                    <Text style={styles.macroFraction}>
                      {dietPlan.proteinConsumed}/{dietPlan.proteinTarget}g
                    </Text>
                  </View>
                  <View style={styles.macroTrack}>
                    <View
                      style={[
                        styles.macroFill,
                        {
                          backgroundColor: '#0A84FF',
                          width: `${Math.min(100, Math.round((dietPlan.proteinConsumed / dietPlan.proteinTarget) * 100))}%`
                        }
                      ]}
                    />
                  </View>
                </View>

                {/* Carbs */}
                <View style={styles.macroCol}>
                  <View style={styles.macroHeader}>
                    <Text style={styles.macroName}>Carbs</Text>
                    <Text style={styles.macroFraction}>
                      {dietPlan.carbsConsumed}/{dietPlan.carbsTarget}g
                    </Text>
                  </View>
                  <View style={styles.macroTrack}>
                    <View
                      style={[
                        styles.macroFill,
                        {
                          backgroundColor: '#30D158',
                          width: `${Math.min(100, Math.round((dietPlan.carbsConsumed / dietPlan.carbsTarget) * 100))}%`
                        }
                      ]}
                    />
                  </View>
                </View>

                {/* Fats */}
                <View style={styles.macroCol}>
                  <View style={styles.macroHeader}>
                    <Text style={styles.macroName}>Healthy Fats</Text>
                    <Text style={styles.macroFraction}>
                      {dietPlan.fatConsumed}/{dietPlan.fatTarget}g
                    </Text>
                  </View>
                  <View style={styles.macroTrack}>
                    <View
                      style={[
                        styles.macroFill,
                        {
                          backgroundColor: '#FF9F0A',
                          width: `${Math.min(100, Math.round((dietPlan.fatConsumed / dietPlan.fatTarget) * 100))}%`
                        }
                      ]}
                    />
                  </View>
                </View>
              </View>
            </View>

            {/* 2. Hydration Tracker Card */}
            <View style={styles.hydrationCard}>
              <View style={styles.hydrationLeft}>
                <View style={styles.waterIconCircle}>
                  <Droplet size={20} color="#0A84FF" />
                </View>
                <View>
                  <Text style={styles.hydrationTitle}>Hydration Intake</Text>
                  <Text style={styles.hydrationSubtitle}>
                    {dietPlan.waterConsumedLiters}L logged of {dietPlan.waterTargetLiters}L daily target
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleAddWater}
                style={styles.addWaterBtn}
              >
                <Plus size={14} color="#FFFFFF" />
                <Text style={styles.addWaterText}>+250ml</Text>
              </TouchableOpacity>
            </View>

            {/* 3. Clinical Micronutrient Highlights */}
            <View style={styles.highlightsBox}>
              <Text style={styles.highlightsTitle}>PATHOLOGY-ALIGNED NUTRITION</Text>
              {dietPlan.clinicalHighlights.map((hl: string, idx: number) => (
                <View key={idx} style={styles.highlightItem}>
                  <Heart size={14} color={colors.primary} style={{ marginTop: 2 }} />
                  <Text style={styles.highlightText}>{hl}</Text>
                </View>
              ))}
            </View>

            {/* 4. Structured Meal Schedule */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>TODAY'S MEAL SCHEDULE</Text>
            </View>

            {dietPlan.meals.map((cat: MealCategory, catIdx: number) => (
              <View key={catIdx} style={styles.mealCategoryCard}>
                <View style={styles.mealCategoryHeader}>
                  <View>
                    <Text style={styles.categoryName}>{cat.category}</Text>
                    <Text style={styles.categoryTime}>Suggested: {cat.recommendedTime}</Text>
                  </View>
                  <View style={styles.categoryCalorieBadge}>
                    <Text style={styles.categoryCalorieText}>{cat.targetCalories} kcal</Text>
                  </View>
                </View>

                {cat.items.map((item: MealItem, itemIdx: number) => (
                  <TouchableOpacity
                    key={item.id}
                    activeOpacity={0.7}
                    onPress={() => handleToggleMeal(catIdx, itemIdx)}
                    style={[
                      styles.mealItemRow,
                      itemIdx < cat.items.length - 1 && styles.itemDivider
                    ]}
                  >
                    <View style={styles.checkCol}>
                      {item.isLogged ? (
                        <CheckCircle2 size={22} color={colors.primary} />
                      ) : (
                        <Circle size={22} color={colors.border} />
                      )}
                    </View>

                    <View style={styles.itemDetails}>
                      <Text style={[styles.itemName, item.isLogged && styles.itemLoggedText]}>
                        {item.name}
                      </Text>
                      <Text style={styles.itemPortion}>{item.portion}</Text>

                      {item.micronutrientBoost && (
                        <View style={styles.boostBadge}>
                          <Text style={styles.boostText}>{item.micronutrientBoost}</Text>
                        </View>
                      )}
                    </View>

                    <View style={styles.itemCaloriesCol}>
                      <Text style={styles.itemCaloriesVal}>{item.calories}</Text>
                      <Text style={styles.itemCaloriesUnit}>kcal</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
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
    marginBottom: spacing.md
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md
  },
  heroEyebrow: {
    ...typography.label,
    color: colors.primary,
    fontSize: 11,
    letterSpacing: 0.5,
    marginBottom: 4
  },
  heroCalories: {
    ...typography.h1,
    color: colors.textPrimary,
    fontWeight: '800'
  },
  heroCaloriesUnit: {
    ...typography.body,
    color: colors.textMuted,
    fontWeight: '400'
  },
  calorieRing: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: colors.background,
    borderWidth: 3,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center'
  },
  ringPercent: {
    ...typography.captionSemibold,
    color: colors.textPrimary,
    fontWeight: '800'
  },
  ringLabel: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 9,
    fontWeight: '700'
  },
  progressBarBg: {
    height: 8,
    backgroundColor: colors.background,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: spacing.sm
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4
  },
  calorieRemainingText: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.lg
  },
  macrosRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm
  },
  macroCol: {
    flex: 1
  },
  macroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4
  },
  macroName: {
    ...typography.caption,
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '600'
  },
  macroFraction: {
    ...typography.caption,
    color: colors.textPrimary,
    fontSize: 11,
    fontWeight: '700'
  },
  macroTrack: {
    height: 6,
    backgroundColor: colors.background,
    borderRadius: 3,
    overflow: 'hidden'
  },
  macroFill: {
    height: '100%',
    borderRadius: 3
  },
  hydrationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md
  },
  hydrationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1
  },
  waterIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(10, 132, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  hydrationTitle: {
    ...typography.bodySemibold,
    color: colors.textPrimary,
    fontWeight: '700'
  },
  hydrationSubtitle: {
    ...typography.caption,
    color: colors.textSecondary
  },
  addWaterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#0A84FF',
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: borderRadius.pill
  },
  addWaterText: {
    ...typography.caption,
    color: '#FFFFFF',
    fontWeight: '700'
  },
  highlightsBox: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg
  },
  highlightsTitle: {
    ...typography.label,
    color: colors.textMuted,
    fontSize: 11,
    letterSpacing: 0.5,
    marginBottom: spacing.sm
  },
  highlightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    marginBottom: 6
  },
  highlightText: {
    ...typography.caption,
    color: colors.textSecondary,
    flex: 1,
    lineHeight: 18
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
  mealCategoryCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md
  },
  mealCategoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: spacing.sm
  },
  categoryName: {
    ...typography.bodySemibold,
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '700'
  },
  categoryTime: {
    ...typography.caption,
    color: colors.textMuted
  },
  categoryCalorieBadge: {
    backgroundColor: colors.background,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: borderRadius.pill
  },
  categoryCalorieText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '700'
  },
  mealItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm
  },
  itemDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border
  },
  checkCol: {
    marginRight: spacing.md
  },
  itemDetails: {
    flex: 1
  },
  itemName: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '600',
    marginBottom: 2
  },
  itemLoggedText: {
    color: colors.textMuted,
    textDecorationLine: 'line-through'
  },
  itemPortion: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: 4
  },
  boostBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(52, 199, 89, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4
  },
  boostText: {
    ...typography.caption,
    color: '#34C759',
    fontSize: 10,
    fontWeight: '600'
  },
  itemCaloriesCol: {
    alignItems: 'flex-end',
    marginLeft: spacing.sm
  },
  itemCaloriesVal: {
    ...typography.bodySemibold,
    color: colors.textPrimary,
    fontWeight: '700'
  },
  itemCaloriesUnit: {
    ...typography.caption,
    color: colors.textMuted
  }
});
