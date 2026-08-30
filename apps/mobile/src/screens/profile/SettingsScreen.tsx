import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert
} from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import {
  ArrowLeft,
  Bell,
  Lock,
  FileCode,
  Shield,
  Info,
  ChevronRight,
  Database
} from 'lucide-react-native';

export const SettingsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [medReminders, setMedReminders] = useState(true);
  const [biometrics, setBiometrics] = useState(false);
  const [fhirSync, setFhirSync] = useState(true);

  const handleExportFHIR = () => {
    Alert.alert(
      'FHIR Health Bundle Exported',
      'Your health records have been structured into standard HL7 FHIR (Fast Healthcare Interoperability Resources) JSON format for interoperable clinical sharing.'
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ArrowLeft size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>SETTINGS & SECURITY</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Section 1: Notifications */}
        <Text style={styles.sectionHeader}>NOTIFICATIONS & ALERTS</Text>

        <View style={styles.settingCard}>
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Bell size={18} color={colors.primary} />
              <View style={styles.settingTextCol}>
                <Text style={styles.settingTitle}>Medication Reminders</Text>
                <Text style={styles.settingDesc}>Scheduled notifications for morning & evening doses</Text>
              </View>
            </View>
            <Switch
              value={medReminders}
              onValueChange={setMedReminders}
              trackColor={{ false: colors.surface, true: colors.primary }}
            />
          </View>
        </View>

        {/* Section 2: FHIR Interoperability */}
        <Text style={[styles.sectionHeader, { marginTop: spacing.lg }]}>
          INTEROPERABILITY & FHIR
        </Text>

        <View style={styles.settingCard}>
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Database size={18} color={colors.accent} />
              <View style={styles.settingTextCol}>
                <Text style={styles.settingTitle}>FHIR Health Record Mapping</Text>
                <Text style={styles.settingDesc}>Continuous normalization into Observation & DiagnosticReport</Text>
              </View>
            </View>
            <Switch
              value={fhirSync}
              onValueChange={setFhirSync}
              trackColor={{ false: colors.surface, true: colors.primary }}
            />
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleExportFHIR}
            style={styles.exportBtn}
          >
            <FileCode size={16} color={colors.primary} />
            <Text style={styles.exportBtnText}>Export FHIR JSON Health Bundle</Text>
          </TouchableOpacity>
        </View>

        {/* Section 3: Privacy & Security */}
        <Text style={[styles.sectionHeader, { marginTop: spacing.lg }]}>
          PRIVACY & ENCRYPTION
        </Text>

        <View style={styles.settingCard}>
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Lock size={18} color={colors.accentPurple} />
              <View style={styles.settingTextCol}>
                <Text style={styles.settingTitle}>Biometric Lock</Text>
                <Text style={styles.settingDesc}>Require FaceID/Fingerprint on app open</Text>
              </View>
            </View>
            <Switch
              value={biometrics}
              onValueChange={setBiometrics}
              trackColor={{ false: colors.surface, true: colors.primary }}
            />
          </View>
        </View>

        {/* About Project */}
        <View style={styles.aboutCard}>
          <View style={styles.aboutHeader}>
            <Shield size={16} color={colors.primary} />
            <Text style={styles.aboutTitle}>HOSPATE – AI HEALTH BUDDY</Text>
          </View>
          <Text style={styles.aboutText}>
            B.Tech Major Project • Version 0.1 Mobile MVP{'\n'}
            AI-powered Personal Health Intelligence Platform combining OCR, NLP/NER parameter normalization, dynamic scoring, and grounded health assistance.
          </Text>
        </View>

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
  settingCard: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: spacing.md
  },
  settingTextCol: {
    marginLeft: spacing.md,
    flex: 1
  },
  settingTitle: {
    ...typography.bodySemibold,
    color: colors.textPrimary
  },
  settingDesc: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2
  },
  exportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(14, 165, 233, 0.1)',
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm,
    marginTop: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(14, 165, 233, 0.25)'
  },
  exportBtnText: {
    ...typography.captionSemibold,
    color: colors.primary,
    marginLeft: 6
  },
  aboutCard: {
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginTop: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border
  },
  aboutHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs
  },
  aboutTitle: {
    ...typography.label,
    fontSize: 10,
    color: colors.primary,
    marginLeft: 6
  },
  aboutText: {
    ...typography.caption,
    color: colors.textSecondary,
    lineHeight: 18
  }
});
