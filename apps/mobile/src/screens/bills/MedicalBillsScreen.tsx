import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  Alert
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { fetchMedicalBills } from '../../store/billsSlice';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import {
  Building2,
  ChevronLeft,
  Download,
  CheckCircle2
} from 'lucide-react-native';
import { MedicalBill, BillItem } from '@hospate/types';

export const MedicalBillsScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const dispatch = useDispatch<AppDispatch>();
  const { bills, isLoading } = useSelector((state: RootState) => state.bills);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedBillId, setExpandedBillId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchMedicalBills());
  }, [dispatch]);

  const onRefresh = async () => {
    setRefreshing(true);
    await dispatch(fetchMedicalBills());
    setRefreshing(false);
  };

  const totalBilled = bills.reduce((acc: number, b: MedicalBill) => acc + b.totalAmount, 0);
  const totalInsurance = bills.reduce((acc: number, b: MedicalBill) => acc + b.insuranceClaimedAmount, 0);
  const totalPatientPaid = bills.reduce((acc: number, b: MedicalBill) => acc + b.patientPaidAmount, 0);

  const toggleExpand = (id: string) => {
    setExpandedBillId(prev => (prev === id ? null : id));
  };

  const handleDownloadReceipt = (invoiceNumber: string) => {
    Alert.alert(
      'Receipt Downloaded',
      `Official GST invoice & ABDM claim receipt for ${invoiceNumber} saved to device.`,
      [{ text: 'OK' }]
    );
  };

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
        <Text style={styles.headerTitle}>Bills & Claims</Text>
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
        {isLoading && bills.length === 0 ? (
          <View style={styles.loaderBox}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Fetching medical bills & claim records...</Text>
          </View>
        ) : (
          <>
            {/* 1. Hero Insurance & Expense Breakdown Card */}
            <View style={styles.heroCard}>
              <Text style={styles.heroEyebrow}>2026 ANNUAL HEALTHCARE EXPENSES</Text>
              <Text style={styles.heroAmount}>
                ₹{totalBilled.toLocaleString('en-IN')}
              </Text>

              <View style={styles.statsRow}>
                {/* Insurance covered */}
                <View style={styles.statCol}>
                  <Text style={styles.statLabel}>Insurance Paid</Text>
                  <Text style={[styles.statValue, { color: '#34C759' }]}>
                    ₹{totalInsurance.toLocaleString('en-IN')}
                  </Text>
                  <Text style={styles.statSub}>82% Coverage</Text>
                </View>

                {/* Patient Paid */}
                <View style={styles.statCol}>
                  <Text style={styles.statLabel}>Out-of-Pocket</Text>
                  <Text style={[styles.statValue, { color: colors.textPrimary }]}>
                    ₹{totalPatientPaid.toLocaleString('en-IN')}
                  </Text>
                  <Text style={styles.statSub}>Direct Co-pay</Text>
                </View>

                {/* Status */}
                <View style={styles.statCol}>
                  <Text style={styles.statLabel}>Insurance Policy</Text>
                  <Text style={[styles.statValue, { color: colors.primary, fontSize: 13 }]}>
                    Star Health
                  </Text>
                  <Text style={styles.statSub}>Cashless Active</Text>
                </View>
              </View>
            </View>

            {/* 2. Invoices List */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>ITEMIZED HOSPITAL INVOICES</Text>
            </View>

            {bills.map((bill: MedicalBill) => {
              const isExpanded = expandedBillId === bill.id;
              return (
                <View key={bill.id} style={styles.billCard}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => toggleExpand(bill.id)}
                    style={styles.billHeader}
                  >
                    <View style={styles.billIconCircle}>
                      <Building2 size={20} color={colors.primary} />
                    </View>

                    <View style={styles.billHeaderInfo}>
                      <Text style={styles.hospitalName}>{bill.hospitalName}</Text>
                      <Text style={styles.invoiceMeta}>
                        Invoice #{bill.invoiceNumber} • {bill.date}
                      </Text>
                      <Text style={styles.claimMeta}>
                        Claim: {bill.claimId} ({bill.insuranceProvider})
                      </Text>
                    </View>

                    <View style={styles.billAmountBox}>
                      <Text style={styles.billAmountVal}>₹{bill.totalAmount.toLocaleString('en-IN')}</Text>
                      <View style={styles.paidBadge}>
                        <CheckCircle2 size={10} color="#34C759" />
                        <Text style={styles.paidBadgeText}>SETTLED</Text>
                      </View>
                    </View>
                  </TouchableOpacity>

                  {/* Expanded Itemized Line Items */}
                  {isExpanded && (
                    <View style={styles.expandedContent}>
                      <View style={styles.lineItemsHeader}>
                        <Text style={styles.lineItemsTitle}>LINE ITEMS BREAKDOWN</Text>
                      </View>

                      {bill.items.map((item: BillItem) => (
                        <View key={item.id} style={styles.itemRow}>
                          <View style={styles.itemLeft}>
                            <Text style={styles.itemDesc}>{item.description}</Text>
                            <Text style={styles.itemCategory}>{item.category}</Text>
                          </View>
                          <View style={styles.itemAmounts}>
                            <Text style={styles.itemTotal}>₹{item.amount}</Text>
                            <Text style={styles.itemIns}>Ins: ₹{item.coveredByInsurance}</Text>
                          </View>
                        </View>
                      ))}

                      {/* Receipt Action Button */}
                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => handleDownloadReceipt(bill.invoiceNumber)}
                        style={styles.receiptBtn}
                      >
                        <Download size={16} color={colors.primary} />
                        <Text style={styles.receiptBtnText}>Download Tax Invoice & Claim Copy</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              );
            })}
          </>
        )}
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
    marginBottom: spacing.lg
  },
  heroEyebrow: {
    ...typography.label,
    color: colors.textMuted,
    fontSize: 11,
    letterSpacing: 0.5,
    marginBottom: 4
  },
  heroAmount: {
    ...typography.h1,
    color: colors.textPrimary,
    fontWeight: '800',
    marginBottom: spacing.md
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border
  },
  statCol: {
    flex: 1
  },
  statLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: 2
  },
  statValue: {
    ...typography.bodySemibold,
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 2
  },
  statSub: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 11
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
  billCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
    overflow: 'hidden'
  },
  billHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md
  },
  billIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(10, 132, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md
  },
  billHeaderInfo: {
    flex: 1
  },
  hospitalName: {
    ...typography.bodySemibold,
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2
  },
  invoiceMeta: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: 2
  },
  claimMeta: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 11
  },
  billAmountBox: {
    alignItems: 'flex-end',
    marginLeft: spacing.sm
  },
  billAmountVal: {
    ...typography.bodySemibold,
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 4
  },
  paidBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(52, 199, 89, 0.12)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4
  },
  paidBadgeText: {
    ...typography.caption,
    color: '#34C759',
    fontSize: 9,
    fontWeight: '800'
  },
  expandedContent: {
    padding: spacing.md,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border
  },
  lineItemsHeader: {
    marginBottom: spacing.sm
  },
  lineItemsTitle: {
    ...typography.label,
    color: colors.textMuted,
    fontSize: 11,
    letterSpacing: 0.5
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border
  },
  itemLeft: {
    flex: 1,
    marginRight: spacing.md
  },
  itemDesc: {
    ...typography.caption,
    color: colors.textPrimary,
    fontWeight: '600',
    marginBottom: 2
  },
  itemCategory: {
    ...typography.caption,
    color: colors.textSecondary,
    fontSize: 11
  },
  itemAmounts: {
    alignItems: 'flex-end'
  },
  itemTotal: {
    ...typography.caption,
    color: colors.textPrimary,
    fontWeight: '700'
  },
  itemIns: {
    ...typography.caption,
    color: '#34C759',
    fontSize: 11
  },
  receiptBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 10,
    borderRadius: borderRadius.md,
    marginTop: spacing.md
  },
  receiptBtnText: {
    ...typography.captionSemibold,
    color: colors.primary
  }
});
