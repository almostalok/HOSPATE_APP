import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store/store';
import { updateProfileAsync } from '../../store/authSlice';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { PrimaryButton } from '../../components/PrimaryButton';
import { BloodGroup, Gender } from '@hospate/types';
import { Heart, Activity, Droplet } from 'lucide-react-native';

const BLOOD_GROUPS: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const GENDERS: Gender[] = ['male', 'female', 'other'];

export const InitialProfileScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const dispatch = useDispatch<AppDispatch>();

  const [selectedGender, setSelectedGender] = useState<Gender>('male');
  const [selectedBlood, setSelectedBlood] = useState<BloodGroup>('A+');
  const [height, setHeight] = useState('178');
  const [weight, setWeight] = useState('74');
  const [allergies, setAllergies] = useState('Penicillin');
  const [conditions, setConditions] = useState('Mild Dyslipidemia');

  const handleSave = async () => {
    const h = parseFloat(height) || 175;
    const w = parseFloat(weight) || 70;
    const bmi = Number((w / ((h / 100) * (h / 100))).toFixed(1));

    await dispatch(
      updateProfileAsync({
        gender: selectedGender,
        bloodGroup: selectedBlood,
        heightCm: h,
        weightKg: w,
        bmi,
        allergies: allergies.split(',').map(s => s.trim()).filter(Boolean),
        chronicConditions: conditions.split(',').map(s => s.trim()).filter(Boolean)
      })
    );

    navigation.replace('MainTabs');
  };

  const handleSkip = () => {
    navigation.replace('MainTabs');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.title}>Basic Health Baseline</Text>
          <Text style={styles.subtitle}>
            Help Hospate personalize your AI Health Score & parameter reference ranges.
          </Text>
        </View>

        {/* Gender Selection */}
        <Text style={styles.sectionLabel}>GENDER</Text>
        <View style={styles.chipRow}>
          {GENDERS.map(g => (
            <TouchableOpacity
              key={g}
              activeOpacity={0.8}
              onPress={() => setSelectedGender(g)}
              style={[styles.chip, selectedGender === g && styles.chipActive]}
            >
              <Text style={[styles.chipText, selectedGender === g && styles.chipTextActive]}>
                {g.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Blood Group */}
        <Text style={[styles.sectionLabel, { marginTop: spacing.md }]}>BLOOD GROUP</Text>
        <View style={styles.chipRowWrap}>
          {BLOOD_GROUPS.map(b => (
            <TouchableOpacity
              key={b}
              activeOpacity={0.8}
              onPress={() => setSelectedBlood(b)}
              style={[styles.bloodChip, selectedBlood === b && styles.bloodChipActive]}
            >
              <Text style={[styles.chipText, selectedBlood === b && styles.chipTextActive]}>
                {b}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Height & Weight */}
        <View style={styles.rowTwo}>
          <View style={styles.halfCol}>
            <Text style={styles.sectionLabel}>HEIGHT (CM)</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={height}
                onChangeText={setHeight}
                keyboardType="numeric"
                placeholder="175"
                placeholderTextColor={colors.textMuted}
              />
            </View>
          </View>

          <View style={styles.halfCol}>
            <Text style={styles.sectionLabel}>WEIGHT (KG)</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={weight}
                onChangeText={setWeight}
                keyboardType="numeric"
                placeholder="70"
                placeholderTextColor={colors.textMuted}
              />
            </View>
          </View>
        </View>

        {/* Allergies */}
        <Text style={[styles.sectionLabel, { marginTop: spacing.md }]}>KNOWN ALLERGIES</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={allergies}
            onChangeText={setAllergies}
            placeholder="e.g. Penicillin, Peanuts (comma separated)"
            placeholderTextColor={colors.textMuted}
          />
        </View>

        {/* Chronic Conditions */}
        <Text style={[styles.sectionLabel, { marginTop: spacing.md }]}>EXISTING CONDITIONS (IF ANY)</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={conditions}
            onChangeText={setConditions}
            placeholder="e.g. Hypertension, Asthma"
            placeholderTextColor={colors.textMuted}
          />
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <PrimaryButton
            title="Complete Setup"
            onPress={handleSave}
            size="lg"
            style={styles.saveBtn}
          />

          <TouchableOpacity activeOpacity={0.7} onPress={handleSkip} style={styles.skipBtn}>
            <Text style={styles.skipText}>Set up later in Profile</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background
  },
  scroll: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg
  },
  header: {
    marginBottom: spacing.xl
  },
  title: {
    ...typography.h1,
    color: colors.textPrimary
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    lineHeight: 20
  },
  sectionLabel: {
    ...typography.label,
    fontSize: 11,
    color: colors.textMuted,
    marginBottom: spacing.xs
  },
  chipRow: {
    flexDirection: 'row',
    marginBottom: spacing.sm
  },
  chip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.md,
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary
  },
  chipText: {
    ...typography.captionSemibold,
    color: colors.textSecondary
  },
  chipTextActive: {
    color: '#FFFFFF'
  },
  chipRowWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.sm
  },
  bloodChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.md,
    marginRight: spacing.xs + 2,
    marginBottom: spacing.xs + 2,
    borderWidth: 1,
    borderColor: colors.border
  },
  bloodChipActive: {
    backgroundColor: colors.danger,
    borderColor: colors.danger
  },
  rowTwo: {
    flexDirection: 'row',
    marginTop: spacing.sm
  },
  halfCol: {
    flex: 1,
    marginRight: spacing.sm
  },
  inputContainer: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md
  },
  input: {
    ...typography.body,
    color: colors.textPrimary,
    paddingVertical: spacing.md
  },
  actions: {
    marginTop: spacing.xxl,
    marginBottom: spacing.xl
  },
  saveBtn: {
    marginBottom: spacing.md
  },
  skipBtn: {
    alignItems: 'center',
    paddingVertical: spacing.sm
  },
  skipText: {
    ...typography.bodyMedium,
    color: colors.textMuted
  }
});
