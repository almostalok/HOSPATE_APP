import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { HospateLogo } from '../components/HospateLogo';

// Icons
import {
  Activity,
  FileText,
  Pill,
  User,
  Calendar,
  Building
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

import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs: React.FC = () => {
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(insets.bottom, 16);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#121214',
          borderTopColor: colors.border,
          borderTopWidth: 0.5,
          height: 60 + bottomPadding,
          paddingBottom: bottomPadding,
          paddingTop: 8
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '500',
          marginTop: 3
        }
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Summary',
          tabBarIcon: ({ color }) => <Activity size={22} color={color} />
        }}
      />
      <Tab.Screen
        name="RecordsTab"
        component={MedicalRecordsScreen}
        options={{
          tabBarLabel: 'Records',
          tabBarIcon: ({ color }) => <FileText size={22} color={color} />
        }}
      />
      <Tab.Screen
        name="BuddyTab"
        component={AIHealthBuddyScreen}
        options={{
          tabBarLabel: 'Buddy',
          tabBarIcon: ({ color, focused }) => (
            <HospateLogo size={22} color={focused ? colors.primary : colors.textMuted} />
          )
        }}
      />
      <Tab.Screen
        name="MedicationsTab"
        component={MedicationsScreen}
        options={{
          tabBarLabel: 'Medications',
          tabBarIcon: ({ color }) => <Pill size={22} color={color} />
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => <User size={22} color={color} />
        }}
      />
    </Tab.Navigator>
  );
};

export const RootNavigator: React.FC = () => {
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
        <Stack.Screen name="HospitalDiscovery" component={HospitalDiscoveryScreen} />
        <Stack.Screen name="HospitalDetail" component={HospitalDetailScreen} />
        <Stack.Screen name="EmergencyCard" component={EmergencyCardScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
