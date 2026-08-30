import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store/store';
import { uploadReportAsync } from '../../store/recordsSlice';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { ProcessingStep, StepState } from '../../components/ProcessingStep';
import { Cpu, Sparkles } from 'lucide-react-native';

const STAGES = [
  { id: 1, title: 'Document uploaded & validated', desc: 'Pre-processing file for OCR engine' },
  { id: 2, title: 'Reading document (OCR)', desc: 'Extracting high-resolution text lines' },
  { id: 3, title: 'Extracting parameters (NLP / NER)', desc: 'Matching medical biomarkers & units' },
  { id: 4, title: 'Understanding findings', desc: 'Harmonizing against clinical reference ranges' },
  { id: 5, title: 'Building health insights', desc: 'Generating deterministic health analysis' }
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
      // Stage 1
      timer1 = setTimeout(() => setCurrentStage(2), 500);

      // Trigger backend API processing
      const apiPromise = dispatch(
        uploadReportAsync({
          preset,
          documentType
        })
      ).unwrap();

      // Stage 2
      timer2 = setTimeout(() => setCurrentStage(3), 1100);
      // Stage 3
      timer3 = setTimeout(() => setCurrentStage(4), 1700);
      // Stage 4
      timer4 = setTimeout(() => setCurrentStage(5), 2300);

      const result = await apiPromise;

      // On completion
      timer5 = setTimeout(() => {
        navigation.replace('ExtractionReview');
      }, 2900);
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
        {/* Animated Processing Icon */}
        <View style={styles.iconCircle}>
          <Cpu size={36} color={colors.primary} />
        </View>

        <Text style={styles.title}>HOSPATE AI PROCESSING</Text>
        <Text style={styles.subtitle}>
          Executing OCR, NLP Named Entity Recognition, and Reference Range matching.
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
          <Sparkles size={14} color={colors.accentPurple} />
          <Text style={styles.footerText}>
            Step {Math.min(currentStage, 5)} of 5 • Real-time pipeline execution
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
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primaryGlow,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(14, 165, 233, 0.3)'
  },
  title: {
    ...typography.label,
    fontSize: 13,
    color: colors.primary,
    letterSpacing: 2,
    marginBottom: spacing.xs
  },
  subtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: 18,
    maxWidth: '90%'
  },
  stepsList: {
    width: '100%',
    marginVertical: spacing.md
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xl
  },
  footerText: {
    ...typography.captionSemibold,
    fontSize: 11,
    color: colors.textSecondary,
    marginLeft: 6
  }
});
