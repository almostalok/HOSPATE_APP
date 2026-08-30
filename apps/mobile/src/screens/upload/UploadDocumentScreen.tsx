import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity
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
  ChevronRight,
  FileCheck
} from 'lucide-react-native';

const DOC_TYPES = [
  { id: 'LAB_REPORT', title: 'Lab Pathology Report', desc: 'Blood panel, lipid profile, metabolic test', icon: FileText },
  { id: 'PRESCRIPTION', title: 'Doctor Prescription', desc: 'Clinical prescription & medication dosages', icon: Pill },
  { id: 'SCAN', title: 'Diagnostic Scan', desc: 'Imaging report, ECG, Ultrasound', icon: Activity }
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
    tags: ['Vitamin D3', 'Vitamin B12', 'Hemoglobin']
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
      {/* Apple Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ArrowLeft size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Upload Document</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Step 1: Select Category */}
        <Text style={styles.sectionHeader}>DOCUMENT CATEGORY</Text>

        <View style={styles.typeSelector}>
          {DOC_TYPES.map(dt => {
            const Icon = dt.icon;
            const isSelected = selectedType === dt.id;
            return (
              <TouchableOpacity
                key={dt.id}
                activeOpacity={0.7}
                onPress={() => setSelectedType(dt.id)}
                style={[styles.typeCard, isSelected && styles.typeCardActive]}
              >
                <View style={[styles.typeIconBox, { backgroundColor: isSelected ? colors.primary : colors.surfaceElevated }]}>
                  <Icon size={18} color={isSelected ? '#FFFFFF' : colors.textSecondary} />
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

        {/* Step 2: Upload Action Tiles */}
        <Text style={[styles.sectionHeader, { marginTop: spacing.lg }]}>IMPORT METHOD</Text>

        <View style={styles.uploadOptionsRow}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => handleStartProcessing('cbc_lipid')}
            style={styles.uploadTile}
          >
            <View style={styles.tileIconCircle}>
              <Camera size={20} color="#FFFFFF" />
            </View>
            <Text style={styles.tileTitle}>Scan Camera</Text>
            <Text style={styles.tileDesc}>Capture document photo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => handleStartProcessing('cbc_lipid')}
            style={styles.uploadTile}
          >
            <View style={[styles.tileIconCircle, { backgroundColor: colors.dimensionLifestyle }]}>
              <UploadCloud size={20} color="#FFFFFF" />
            </View>
            <Text style={styles.tileTitle}>Files & PDFs</Text>
            <Text style={styles.tileDesc}>Import from device files</Text>
          </TouchableOpacity>
        </View>

        {/* Step 3: Sample Pathology Reports */}
        <Text style={[styles.sectionHeader, { marginTop: spacing.lg }]}>SAMPLE CLINICAL REPORTS</Text>

        {DEMO_PRESETS.map(preset => (
          <TouchableOpacity
            key={preset.id}
            activeOpacity={0.7}
            onPress={() => handleStartProcessing(preset.id)}
            style={styles.presetCard}
          >
            <View style={styles.presetTop}>
              <View style={styles.presetIcon}>
                <FileCheck size={18} color="#FFFFFF" />
              </View>
              <View style={styles.presetInfo}>
                <Text style={styles.presetTitle}>{preset.title}</Text>
                <Text style={styles.presetSource}>{preset.source} • {preset.paramsCount} biomarkers</Text>
              </View>
              <ChevronRight size={16} color={colors.textMuted} />
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
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerTitle: {
    ...typography.headline,
    color: colors.textPrimary,
    fontSize: 16
  },
  scroll: {
    padding: spacing.lg
  },
  sectionHeader: {
    ...typography.label,
    fontSize: 11,
    color: colors.textSecondary,
    letterSpacing: 0.5,
    marginBottom: spacing.sm
  },
  typeSelector: {
    marginBottom: spacing.xs
  },
  typeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.xs + 2,
    borderWidth: 1,
    borderColor: colors.border
  },
  typeCardActive: {
    borderColor: colors.primary
  },
  typeIconBox: {
    width: 36,
    height: 36,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md
  },
  typeInfo: {
    flex: 1
  },
  typeTitle: {
    ...typography.bodySemibold,
    color: colors.textPrimary,
    fontSize: 15
  },
  typeTitleActive: {
    color: colors.primary
  },
  typeDesc: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2
  },
  uploadOptionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs
  },
  uploadTile: {
    width: '48.5%',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border
  },
  tileIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm
  },
  tileTitle: {
    ...typography.bodySemibold,
    color: colors.textPrimary,
    fontSize: 15
  },
  tileDesc: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 2
  },
  presetCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.xs + 2,
    borderWidth: 1,
    borderColor: colors.border
  },
  presetTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs + 2
  },
  presetIcon: {
    width: 36,
    height: 36,
    borderRadius: 9,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md
  },
  presetInfo: {
    flex: 1
  },
  presetTitle: {
    ...typography.bodySemibold,
    color: colors.textPrimary,
    fontSize: 15
  },
  presetSource: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4
  },
  paramTag: {
    backgroundColor: colors.surfaceElevated,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.xs,
    marginRight: spacing.xs,
    marginTop: 2
  },
  paramTagText: {
    ...typography.caption,
    fontSize: 11,
    color: colors.textSecondary
  }
});
