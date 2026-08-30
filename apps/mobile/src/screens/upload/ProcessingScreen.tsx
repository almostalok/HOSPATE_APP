import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store/store';
import { uploadReportAsync } from '../../store/recordsSlice';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { ProcessingStep, StepState } from '../../components/ProcessingStep';
import { HospateLogo } from '../../components/HospateLogo';

const STAGES = [
  { id: 1, title: 'Document uploaded & verified', desc: 'Validating report structure' },
  { id: 2, title: 'Optical Character Recognition (OCR)', desc: 'Extracting text and tabular biomarker cells' },
  { id: 3, title: 'Parameter Parsing & NER', desc: 'Extracting biomarker names, numeric values & units' },
  { id: 4, title: 'Reference Range Harmonization', desc: 'Classifying standard vs out-of-range clinical flags' },
  { id: 5, title: 'Health Score Re-indexing', desc: 'Synthesizing updated dimension scores' }
];

export const ProcessingScreen: React.FC<{ route: any; navigation: any }> = ({
  route,
  navigation
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { preset = 'cbc_lipid', documentType = 'LAB_REPORT' } = route.params || {};

  const [currentStage, setCurrentStage] = useState(1);

  useEffect(() => {
    let timer1: any, timer2: any, timer3: any, timer4: any, timer5: any;

    const runPipeline = async () => {
      timer1 = setTimeout(() => setCurrentStage(2), 400);

      const apiPromise = dispatch(
        uploadReportAsync({
          preset,
          documentType
        })
      ).unwrap();

      timer2 = setTimeout(() => setCurrentStage(3), 900);
      timer3 = setTimeout(() => setCurrentStage(4), 1400);
      timer4 = setTimeout(() => setCurrentStage(5), 1900);

      await apiPromise;

      timer5 = setTimeout(() => {
        navigation.replace('ExtractionReview');
      }, 2400);
    };

    runPipeline().catch(err => {
      console.error(err);
      navigation.goBack();
    });

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
    };
  }, []);

  const getStepState = (stepNumber: number): StepState => {
    if (currentStage > stepNumber) return 'COMPLETED';
    if (currentStage === stepNumber) return 'ACTIVE';
    return 'PENDING';
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <HospateLogo size={52} showBackground={true} />

        <Text style={styles.title}>Processing Document</Text>
        <Text style={styles.subtitle}>
          Extracting clinical biomarkers and matching against laboratory reference intervals.
        </Text>

        {/* 5-Step Progress Steps */}
        <View style={styles.stepsList}>
          {STAGES.map(s => (
            <ProcessingStep
              key={s.id}
              stepNumber={s.id}
              title={s.title}
              subtitle={s.desc}
              state={getStepState(s.id)}
            />
          ))}
        </View>

        <View style={styles.footer}>
          <ActivityIndicator size="small" color={colors.primary} />
          <Text style={styles.footerText}>
            Step {Math.min(currentStage, 5)} of 5
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background
  },
  content: {
    flex: 1,
    padding: spacing.xl,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
    marginTop: spacing.lg,
    fontWeight: '700'
  },
  subtitle: {
    ...typography.subheadline,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xs,
    marginBottom: spacing.xl,
    lineHeight: 20,
    maxWidth: '90%'
  },
  stepsList: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xl
  },
  footerText: {
    ...typography.captionSemibold,
    fontSize: 13,
    color: colors.textSecondary,
    marginLeft: 8
  }
});
