import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

// Icons
import {
  Home,
  Calendar,
  FileText,
  Building,
  User,
  Sparkles
} from 'lucide-react-native';

// Auth Screens
import { SplashScreen } from '../screens/auth/SplashScreen';
import { WelcomeScreen } from '../screens/auth/WelcomeScreen';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { SignupScreen } from '../screens/auth/SignupScreen';
import { InitialProfileScreen } from '../screens/auth/InitialProfileScreen';

// Core Screens
import { HomeScreen } from '../screens/home/HomeScreen';
import { HealthScoreScreen } from '../screens/health/HealthScoreScreen';
import { HealthTimelineScreen } from '../screens/health/HealthTimelineScreen';
import { MedicalRecordsScreen } from '../screens/records/MedicalRecordsScreen';
import { RecordDetailScreen } from '../screens/records/RecordDetailScreen';

// Hero Upload & OCR Flow
import { UploadDocumentScreen } from '../screens/upload/UploadDocumentScreen';
import { ProcessingScreen } from '../screens/upload/ProcessingScreen';
import { ExtractionReviewScreen } from '../screens/upload/ExtractionReviewScreen';
import { AIAnalysisResultScreen } from '../screens/upload/AIAnalysisResultScreen';

// AI Health Buddy
import { AIHealthBuddyScreen } from '../screens/assistant/AIHealthBuddyScreen';

// Secondary Screens
import { MedicationsScreen } from '../screens/medications/MedicationsScreen';
import { AppointmentsScreen } from '../screens/appointments/AppointmentsScreen';
import { HospitalDiscoveryScreen } from '../screens/hospitals/HospitalDiscoveryScreen';
import { HospitalDetailScreen } from '../screens/hospitals/HospitalDetailScreen';
import { EmergencyCardScreen } from '../screens/emergency/EmergencyCardScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { SettingsScreen } from '../screens/profile/SettingsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 88 : 64,
          paddingBottom: Platform.OS === 'ios' ? 28 : 8,
          paddingTop: 8
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: {
          ...typography.label,
          fontSize: 9
        }
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          tabBarLabel: 'HOME',
          tabBarIcon: ({ color, size }) => <Home size={20} color={color} />
        }}
      />
      <Tab.Screen
        name="AppointmentsTab"
        component={AppointmentsScreen}
        options={{
          tabBarLabel: 'APPOINTMENTS',
          tabBarIcon: ({ color, size }) => <Calendar size={20} color={color} />
        }}
      />
      <Tab.Screen
        name="RecordsTab"
        component={MedicalRecordsScreen}
        options={{
          tabBarLabel: 'RECORDS',
          tabBarIcon: ({ color, size }) => <FileText size={20} color={color} />
        }}
      />
      <Tab.Screen
        name="HospitalsTab"
        component={HospitalDiscoveryScreen}
        options={{
          tabBarLabel: 'HOSPITALS',
          tabBarIcon: ({ color, size }) => <Building size={20} color={color} />
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'PROFILE',
          tabBarIcon: ({ color, size }) => <User size={20} color={color} />
        }}
      />
    </Tab.Navigator>
  );
};

export const RootNavigator: React.FC = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background }
        }}
      >
        {/* Auth Stack */}
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="InitialProfile" component={InitialProfileScreen} />

        {/* Main Tabs Container */}
        <Stack.Screen name="MainTabs" component={MainTabs} />

        {/* Health Intelligence Screens */}
        <Stack.Screen name="HealthScore" component={HealthScoreScreen} />
        <Stack.Screen name="HealthTimeline" component={HealthTimelineScreen} />
        <Stack.Screen name="MedicalRecords" component={MedicalRecordsScreen} />
        <Stack.Screen name="RecordDetail" component={RecordDetailScreen} />

        {/* Hero Ingestion & AI OCR Flow */}
        <Stack.Screen name="UploadDocument" component={UploadDocumentScreen} />
        <Stack.Screen name="Processing" component={ProcessingScreen} />
        <Stack.Screen name="ExtractionReview" component={ExtractionReviewScreen} />
        <Stack.Screen name="AIAnalysisResult" component={AIAnalysisResultScreen} />

        {/* AI Health Buddy Assistant */}
        <Stack.Screen
          name="AIHealthBuddy"
          component={AIHealthBuddyScreen}
          options={{
            animation: 'slide_from_bottom'
          }}
        />

        {/* Secondary Modules */}
        <Stack.Screen name="Medications" component={MedicationsScreen} />
        <Stack.Screen name="Appointments" component={AppointmentsScreen} />
        <Stack.Screen name="HospitalDetail" component={HospitalDetailScreen} />
        <Stack.Screen name="EmergencyCard" component={EmergencyCardScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
