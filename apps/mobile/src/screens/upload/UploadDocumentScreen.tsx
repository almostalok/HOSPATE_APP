import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert
} from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import {
  ArrowLeft,
  FileText,
  Pill,
  Activity,
  Camera,
  UploadCloud,
  Sparkles,
  FileCheck2
} from 'lucide-react-native';

const DOC_TYPES = [
  { id: 'LAB_REPORT', title: 'Lab Report', desc: 'Blood test, lipid profile, metabolic panel', icon: FileText },
  { id: 'PRESCRIPTION', title: 'Prescription', desc: 'Doctor clinic slip, dosage schedule', icon: Pill },
  { id: 'SCAN', title: 'Scan / Imaging', desc: 'X-Ray, Ultrasound, MRI report', icon: Activity }
];

const DEMO_PRESETS = [
  {
    id: 'cbc_lipid',
    title: 'Comprehensive CBC & Lipid Panel',
    source: 'Apollo Diagnostics Laboratory',
    paramsCount: 10,
    tags: ['Hemoglobin', 'LDL', 'Total Chol', 'Glucose', 'Platelets']
  },
  {
    id: 'vitamin_panel',
    title: 'Micronutrient & Vitamin Panel',
    source: 'Max Labs Central',
    paramsCount: 3,
    tags: ['Vitamin D (25-OH)', 'Vitamin B12', 'Hemoglobin']
  },
  {
    id: 'metabolic_panel',
    title: 'Comprehensive Metabolic Panel (CMP)',
    source: 'Metropolis Healthcare',
    paramsCount: 5,
    tags: ['Fasting Glucose', 'HbA1c', 'Creatinine', 'SGPT/ALT', 'TSH']
  }
];

export const UploadDocumentScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [selectedType, setSelectedType] = useState('LAB_REPORT');

  const handleStartProcessing = (presetId?: string) => {
    navigation.navigate('Processing', {
      documentType: selectedType,
      preset: presetId || 'cbc_lipid'
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ArrowLeft size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>UPLOAD HEALTH DOCUMENT</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Step 1: Select Document Type */}
        <Text style={styles.sectionHeader}>SELECT DOCUMENT CATEGORY</Text>

        <View style={styles.typeSelector}>
          {DOC_TYPES.map(dt => {
            const Icon = dt.icon;
            const isSelected = selectedType === dt.id;
            return (
              <TouchableOpacity
                key={dt.id}
                activeOpacity={0.8}
                onPress={() => setSelectedType(dt.id)}
                style={[styles.typeCard, isSelected && styles.typeCardActive]}
              >
                <View style={[styles.typeIconBox, isSelected && styles.typeIconBoxActive]}>
                  <Icon size={20} color={isSelected ? '#FFFFFF' : colors.primary} />
                </View>
                <View style={styles.typeInfo}>
                  <Text style={[styles.typeTitle, isSelected && styles.typeTitleActive]}>
                    {dt.title}
                  </Text>
                  <Text style={styles.typeDesc}>{dt.desc}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Step 2: Upload Action Area */}
        <Text style={[styles.sectionHeader, { marginTop: spacing.lg }]}>CHOOSE UPLOAD METHOD</Text>

        <View style={styles.uploadOptionsRow}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => handleStartProcessing('cbc_lipid')}
            style={styles.uploadTile}
          >
            <View style={styles.tileIconCircle}>
              <Camera size={22} color={colors.primary} />
            </View>
            <Text style={styles.tileTitle}>Scan Camera</Text>
            <Text style={styles.tileDesc}>Capture document photo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => handleStartProcessing('cbc_lipid')}
            style={styles.uploadTile}
          >
            <View style={[styles.tileIconCircle, { backgroundColor: 'rgba(6, 182, 212, 0.15)' }]}>
              <UploadCloud size={22} color={colors.accent} />
            </View>
            <Text style={styles.tileTitle}>Browse PDF / Image</Text>
            <Text style={styles.tileDesc}>Import from files</Text>
          </TouchableOpacity>
        </View>

        {/* Step 3: Fast Demo Pathology Reports */}
        <View style={styles.demoSectionHeader}>
          <View style={styles.demoTitleRow}>
            <Sparkles size={16} color={colors.accentPurple} />
            <Text style={styles.demoHeaderTitle}>DEMO SAMPLE REPORTS (VIVA PRESETS)</Text>
          </View>
          <Text style={styles.demoHeaderDesc}>
            Select a realistic medical report to test live OCR parameter extraction & analysis.
          </Text>
        </View>

        {DEMO_PRESETS.map(preset => (
          <TouchableOpacity
            key={preset.id}
            activeOpacity={0.8}
            onPress={() => handleStartProcessing(preset.id)}
            style={styles.presetCard}
          >
            <View style={styles.presetTop}>
              <View style={styles.presetIcon}>
                <FileCheck2 size={18} color={colors.primary} />
              </View>
              <View style={styles.presetInfo}>
                <Text style={styles.presetTitle}>{preset.title}</Text>
                <Text style={styles.presetSource}>{preset.source} • {preset.paramsCount} parameters</Text>
              </View>
            </View>

            <View style={styles.tagRow}>
              {preset.tags.map((tag, idx) => (
                <View key={idx} style={styles.paramTag}>
                  <Text style={styles.paramTagText}>{tag}</Text>
                </View>
              ))}
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
  sectionHeader: {
    ...typography.label,
    fontSize: 11,
    color: colors.textMuted,
    letterSpacing: 1,
    marginBottom: spacing.sm
  },
  typeSelector: {
    marginBottom: spacing.xs
  },
  typeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.xs + 2,
    borderWidth: 1,
    borderColor: colors.border
  },
  typeCardActive: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(14, 165, 233, 0.08)'
  },
  typeIconBox: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md
  },
  typeIconBoxActive: {
    backgroundColor: colors.primary
  },
  typeInfo: {
    flex: 1
  },
  typeTitle: {
    ...typography.bodySemibold,
    color: colors.textPrimary
  },
  typeTitleActive: {
    color: colors.primary
  },
  typeDesc: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2
  },
  uploadOptionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg
  },
  uploadTile: {
    width: '48%',
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border
  },
  tileIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primaryGlow,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm
  },
  tileTitle: {
    ...typography.bodySemibold,
    color: colors.textPrimary,
    textAlign: 'center'
  },
  tileDesc: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 2
  },
  demoSectionHeader: {
    backgroundColor: 'rgba(139, 92, 246, 0.08)',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.25)'
  },
  demoTitleRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  demoHeaderTitle: {
    ...typography.label,
    fontSize: 11,
    color: colors.accentPurple,
    marginLeft: 6
  },
  demoHeaderDesc: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 4,
    lineHeight: 16
  },
  presetCard: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border
  },
  presetTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm
  },
  presetIcon: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md
  },
  presetInfo: {
    flex: 1
  },
  presetTitle: {
    ...typography.bodySemibold,
    color: colors.textPrimary
  },
  presetSource: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 1
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  paramTag: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.sm,
    marginRight: spacing.xs,
    marginTop: 2
  },
  paramTagText: {
    ...typography.caption,
    fontSize: 10,
    color: colors.textSecondary
  }
});
