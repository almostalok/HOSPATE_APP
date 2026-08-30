import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  RefreshControl,
  Alert
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { fetchAppointments, bookAppointmentAsync } from '../../store/appointmentsSlice';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { PrimaryButton } from '../../components/PrimaryButton';
import {
  Stethoscope,
  Calendar,
  Clock,
  MapPin,
  Plus,
  X,
  CheckCircle,
  Video
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const AppointmentsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch<AppDispatch>();
  const { appointments, isLoading } = useSelector((state: RootState) => state.appointments);

  const [modalVisible, setModalVisible] = useState(false);
  const [doctorName, setDoctorName] = useState('Dr. Sarah Sharma');
  const [doctorSpeciality, setDoctorSpeciality] = useState('Cardiology & Internal Medicine');
  const [hospitalName, setHospitalName] = useState('Apollo Health City');
  const [hospitalAddress, setHospitalAddress] = useState('Jubilee Hills, Hyderabad');
  const [date, setDate] = useState('2026-09-12');
  const [time, setTime] = useState('11:00 AM');

  useEffect(() => {
    dispatch(fetchAppointments());
  }, []);

  const handleBook = async () => {
    try {
      await dispatch(
        bookAppointmentAsync({
          doctorName,
          doctorSpeciality,
          hospitalName,
          hospitalAddress,
          date,
          time,
          status: 'UPCOMING',
          type: 'IN_PERSON'
        })
      ).unwrap();

      setModalVisible(false);
      Alert.alert('Appointment Confirmed', `Scheduled with ${doctorName} on ${date} at ${time}`);
    } catch (e: any) {
      Alert.alert('Booking Error', e.message);
    }
  };

  const upcoming = appointments.filter(a => a.status === 'UPCOMING');
  const past = appointments.filter(a => a.status === 'COMPLETED' || a.status === 'CANCELLED');

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 14) + 4 }]}>
        <View>
          <Text style={styles.headerTitle}>Appointments</Text>
          <Text style={styles.headerSubtitle}>Doctor consultations & clinical follow-ups</Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setModalVisible(true)}
          style={styles.bookBtn}
        >
          <Plus size={18} color="#FFFFFF" />
          <Text style={styles.bookBtnText}>Book</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={() => dispatch(fetchAppointments())}
            tintColor={colors.primary}
          />
        }
      >
        {/* Upcoming Section */}
        <Text style={styles.sectionHeader}>UPCOMING CONSULTATIONS ({upcoming.length})</Text>

        {upcoming.map((appt) => (
          <View key={appt.id} style={styles.apptCard}>
            <View style={styles.apptTop}>
              <View style={styles.doctorIcon}>
                <Stethoscope size={20} color={colors.primary} />
              </View>
              <View style={styles.doctorInfo}>
                <Text style={styles.doctorName}>{appt.doctorName}</Text>
                <Text style={styles.doctorSpec}>{appt.doctorSpeciality}</Text>
              </View>
              <View style={styles.statusPillUpcoming}>
                <Text style={styles.statusTextUpcoming}>Upcoming</Text>
              </View>
            </View>

            <View style={styles.detailsBox}>
              <View style={styles.detailItem}>
                <Calendar size={14} color={colors.accent} />
                <Text style={styles.detailText}>{appt.date}</Text>
              </View>
              <View style={styles.detailItem}>
                <Clock size={14} color={colors.accent} />
                <Text style={styles.detailText}>{appt.time}</Text>
              </View>
            </View>

            <View style={styles.locationRow}>
              <MapPin size={14} color={colors.textMuted} />
              <Text style={styles.locationText}>
                {appt.hospitalName} • {appt.hospitalAddress}
              </Text>
            </View>

            {appt.notes ? (
              <Text style={styles.notesText}>Note: {appt.notes}</Text>
            ) : null}
          </View>
        ))}

        {/* Past Consultations */}
        {past.length > 0 && (
          <>
            <Text style={[styles.sectionHeader, { marginTop: spacing.lg }]}>
              PAST VISITS ({past.length})
            </Text>

            {past.map((appt) => (
              <View key={appt.id} style={[styles.apptCard, styles.pastCard]}>
                <View style={styles.apptTop}>
                  <View style={[styles.doctorIcon, { backgroundColor: colors.surface }]}>
                    <Stethoscope size={18} color={colors.textMuted} />
                  </View>
                  <View style={styles.doctorInfo}>
                    <Text style={styles.doctorName}>{appt.doctorName}</Text>
                    <Text style={styles.doctorSpec}>{appt.doctorSpeciality}</Text>
                  </View>
                  <View style={styles.statusPillPast}>
                    <Text style={styles.statusTextPast}>Completed</Text>
                  </View>
                </View>

                <View style={styles.locationRow}>
                  <Text style={styles.locationText}>
                    {appt.hospitalName} • {appt.date}
                  </Text>
                </View>
              </View>
            ))}
          </>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Book Appointment Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Book Consultation</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X size={20} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>DOCTOR NAME</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={doctorName}
                onChangeText={setDoctorName}
                placeholder="Dr. Sarah Sharma"
                placeholderTextColor={colors.textMuted}
              />
            </View>

            <Text style={[styles.inputLabel, { marginTop: spacing.sm }]}>SPECIALITY</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={doctorSpeciality}
                onChangeText={setDoctorSpeciality}
                placeholder="Cardiology / General Medicine"
                placeholderTextColor={colors.textMuted}
              />
            </View>

            <Text style={[styles.inputLabel, { marginTop: spacing.sm }]}>HOSPITAL / CLINIC</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={hospitalName}
                onChangeText={setHospitalName}
                placeholder="Apollo Health City"
                placeholderTextColor={colors.textMuted}
              />
            </View>

            <View style={styles.twoCol}>
              <View style={{ flex: 1, marginRight: spacing.sm }}>
                <Text style={[styles.inputLabel, { marginTop: spacing.sm }]}>DATE</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    value={date}
                    onChangeText={setDate}
                    placeholder="2026-09-12"
                    placeholderTextColor={colors.textMuted}
                  />
                </View>
              </View>

              <View style={{ flex: 1 }}>
                <Text style={[styles.inputLabel, { marginTop: spacing.sm }]}>TIME</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    value={time}
                    onChangeText={setTime}
                    placeholder="11:00 AM"
                    placeholderTextColor={colors.textMuted}
                  />
                </View>
              </View>
            </View>

            <PrimaryButton
              title="Confirm Appointment"
              onPress={handleBook}
              size="lg"
              style={{ marginTop: spacing.xl }}
            />
          </View>
        </View>
      </Modal>
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
    paddingTop: spacing.md,
    paddingBottom: spacing.sm
  },
  headerTitle: {
    ...typography.h1,
    fontSize: 24,
    color: colors.textPrimary
  },
  headerSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2
  },
  bookBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: borderRadius.pill
  },
  bookBtnText: {
    ...typography.bodySemibold,
    color: '#FFFFFF',
    marginLeft: 4,
    fontSize: 13
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
  apptCard: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border
  },
  pastCard: {
    opacity: 0.8
  },
  apptTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm
  },
  doctorIcon: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primaryGlow,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md
  },
  doctorInfo: {
    flex: 1
  },
  doctorName: {
    ...typography.bodySemibold,
    color: colors.textPrimary
  },
  doctorSpec: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 1
  },
  statusPillUpcoming: {
    backgroundColor: colors.primaryGlow,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.pill
  },
  statusTextUpcoming: {
    ...typography.label,
    fontSize: 9,
    color: colors.primary
  },
  statusPillPast: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.pill
  },
  statusTextPast: {
    ...typography.label,
    fontSize: 9,
    color: colors.textMuted
  },
  detailsBox: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    marginBottom: spacing.xs
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.lg
  },
  detailText: {
    ...typography.captionSemibold,
    color: colors.textPrimary,
    marginLeft: 6
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4
  },
  locationText: {
    ...typography.caption,
    color: colors.textSecondary,
    marginLeft: 4
  },
  notesText: {
    ...typography.caption,
    color: colors.textMuted,
    fontStyle: 'italic',
    marginTop: 6
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end'
  },
  modalContent: {
    backgroundColor: colors.surfaceElevated,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg
  },
  modalTitle: {
    ...typography.h2,
    color: colors.textPrimary
  },
  inputLabel: {
    ...typography.label,
    fontSize: 10,
    color: colors.textMuted,
    marginBottom: spacing.xs
  },
  inputContainer: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md
  },
  input: {
    ...typography.body,
    color: colors.textPrimary,
    paddingVertical: spacing.sm + 2
  },
  twoCol: {
    flexDirection: 'row'
  }
});
