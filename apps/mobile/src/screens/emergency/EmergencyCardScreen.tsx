import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Share
} from 'react-native';
import { api } from '../../api/client';
import { EmergencyCard } from '@hospate/types';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { PrimaryButton } from '../../components/PrimaryButton';
import {
  ArrowLeft,
  ShieldAlert,
  Phone,
  QrCode,
  Heart,
  AlertTriangle,
  Pill,
  Share2,
  Lock
} from 'lucide-react-native';

export const EmergencyCardScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [card, setCard] = useState<EmergencyCard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCard = async () => {
      try {
        const res = await api.getEmergencyCard();
        setCard(res);
      } catch (e) {
        console.warn(e);
      } finally {
        setLoading(false);
      }
    };
    fetchCard();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={colors.danger} />
      </SafeAreaView>
    );
  }

  const handleShare = async () => {
    if (!card) return;
    try {
      await Share.share({
        message: `HOSPATE EMERGENCY HEALTH CARD\nPatient: ${card.fullName} (${card.bloodGroup})\nAllergies: ${card.allergies.join(', ')}\nEmergency Contact: ${card.primaryEmergencyContact.name} (${card.primaryEmergencyContact.phone})\nSecure Verification: ${card.qrPayload}`
      });
    } catch (e) {
      console.warn(e);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ArrowLeft size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>EMERGENCY HEALTH CARD</Text>
        <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
          <Share2 size={18} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Main Emergency Badge Card */}
        <View style={styles.emergencyCard}>
          <View style={styles.cardHeader}>
            <View style={styles.cardBrand}>
              <ShieldAlert size={20} color={colors.dangerText} />
              <Text style={styles.cardBrandText}>HOSPATE EMERGENCY</Text>
            </View>
            <View style={styles.idBadge}>
              <Text style={styles.idText}>ID: {card?.cardId || 'HOSP-EMG-8921'}</Text>
            </View>
          </View>

          {/* Patient Core Info */}
          <View style={styles.patientRow}>
            <View style={styles.nameCol}>
              <Text style={styles.patientName}>{card?.fullName || 'Alex Morgan'}</Text>
              <Text style={styles.patientMeta}>
                Age: {card?.age || 28} Y • Male • DOB: {card?.dob || '1998-04-15'}
              </Text>
            </View>

            <View style={styles.bloodBadge}>
              <Text style={styles.bloodLabel}>BLOOD</Text>
              <Text style={styles.bloodValue}>{card?.bloodGroup || 'A+'}</Text>
            </View>
          </View>

          {/* Critical Allergies */}
          <View style={styles.alertSection}>
            <View style={styles.sectionTitleRow}>
              <AlertTriangle size={14} color={colors.dangerText} />
              <Text style={styles.alertTitle}>CRITICAL ALLERGIES</Text>
            </View>
            <View style={styles.tagsWrap}>
              {card?.allergies.map((all, idx) => (
                <View key={idx} style={styles.allergyTag}>
                  <Text style={styles.allergyTagText}>{all}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Chronic Conditions */}
          <View style={styles.conditionSection}>
            <Text style={styles.sectionLabel}>CHRONIC CONDITIONS</Text>
            <Text style={styles.conditionText}>
              {card?.chronicConditions.join(', ') || 'Mild Dyslipidemia (Managed)'}
            </Text>
          </View>

          {/* Active Medications */}
          <View style={styles.medSection}>
            <Text style={styles.sectionLabel}>ACTIVE MEDICATIONS</Text>
            <Text style={styles.medText}>
              {card?.activeMedications.join(' • ') || 'Metformin 500mg BD • Vitamin D3 60K weekly'}
            </Text>
          </View>

          {/* Emergency Contacts */}
          <View style={styles.contactSection}>
            <Text style={styles.sectionLabel}>PRIMARY EMERGENCY CONTACT</Text>
            <View style={styles.contactBox}>
              <View>
                <Text style={styles.contactName}>{card?.primaryEmergencyContact.name} (Spouse)</Text>
                <Text style={styles.contactPhone}>{card?.primaryEmergencyContact.phone}</Text>
              </View>
              <TouchableOpacity activeOpacity={0.8} style={styles.callBtn}>
                <Phone size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Secure Emergency QR Code Simulation */}
          <View style={styles.qrSection}>
            <View style={styles.qrBox}>
              <QrCode size={110} color="#090D16" />
            </View>
            <View style={styles.qrMeta}>
              <View style={styles.secureTag}>
                <Lock size={12} color={colors.primary} />
                <Text style={styles.secureText}>Tokenized Medical Access</Text>
              </View>
              <Text style={styles.qrDesc}>
                Emergency responders can scan this encrypted QR code to instantly access vital health records without unlocking device.
              </Text>
            </View>
          </View>
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
  center: {
    alignItems: 'center',
    justifyContent: 'center'
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
    color: colors.dangerText,
    letterSpacing: 1
  },
  shareBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center'
  },
  scroll: {
    padding: spacing.lg
  },
  emergencyCard: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    borderWidth: 2,
    borderColor: 'rgba(239, 68, 68, 0.4)',
    shadowColor: colors.danger,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },
  cardBrand: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  cardBrandText: {
    ...typography.label,
    fontSize: 11,
    color: colors.dangerText,
    marginLeft: 6
  },
  idBadge: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm
  },
  idText: {
    ...typography.caption,
    fontSize: 10,
    color: colors.textSecondary
  },
  patientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: spacing.md
  },
  nameCol: {
    flex: 1
  },
  patientName: {
    ...typography.h1,
    fontSize: 22,
    color: colors.textPrimary
  },
  patientMeta: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2
  },
  bloodBadge: {
    width: 58,
    height: 58,
    borderRadius: borderRadius.md,
    backgroundColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center'
  },
  bloodLabel: {
    ...typography.label,
    fontSize: 8,
    color: 'rgba(255, 255, 255, 0.8)'
  },
  bloodValue: {
    ...typography.h1,
    fontSize: 22,
    color: '#FFFFFF'
  },
  alertSection: {
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.25)'
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6
  },
  alertTitle: {
    ...typography.label,
    fontSize: 10,
    color: colors.dangerText,
    marginLeft: 6
  },
  tagsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  allergyTag: {
    backgroundColor: colors.danger,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 3,
    borderRadius: borderRadius.sm,
    marginRight: spacing.xs,
    marginTop: 2
  },
  allergyTagText: {
    ...typography.captionSemibold,
    color: '#FFFFFF',
    fontSize: 11
  },
  sectionLabel: {
    ...typography.label,
    fontSize: 9,
    color: colors.textMuted,
    marginBottom: 2
  },
  conditionSection: {
    marginBottom: spacing.md
  },
  conditionText: {
    ...typography.bodySemibold,
    color: colors.textPrimary,
    fontSize: 13
  },
  medSection: {
    marginBottom: spacing.md
  },
  medText: {
    ...typography.bodySemibold,
    color: colors.textPrimary,
    fontSize: 13
  },
  contactSection: {
    marginBottom: spacing.lg
  },
  contactBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginTop: 4
  },
  contactName: {
    ...typography.bodySemibold,
    color: colors.textPrimary
  },
  contactPhone: {
    ...typography.caption,
    color: colors.primary,
    marginTop: 1
  },
  callBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center'
  },
  qrSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border
  },
  qrBox: {
    backgroundColor: '#FFFFFF',
    padding: spacing.xs + 2,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md
  },
  qrMeta: {
    flex: 1
  },
  secureTag: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4
  },
  secureText: {
    ...typography.captionSemibold,
    fontSize: 11,
    color: colors.primary,
    marginLeft: 4
  },
  qrDesc: {
    ...typography.caption,
    color: colors.textSecondary,
    fontSize: 10,
    lineHeight: 14
  }
});
