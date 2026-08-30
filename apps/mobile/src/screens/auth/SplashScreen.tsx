import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Platform, TouchableOpacity } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { HeartPulse } from 'lucide-react-native';

export const SplashScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.9);

  useEffect(() => {
    const isWeb = Platform.OS === 'web';
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: !isWeb
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        useNativeDriver: !isWeb
      })
    ]).start();

    const timer = setTimeout(() => {
      navigation.replace('Welcome');
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  const handleSkip = () => {
    navigation.replace('Welcome');
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={handleSkip}
      style={styles.container}
    >
      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        <View style={styles.iconCircle}>
          <HeartPulse size={44} color="#FFFFFF" />
        </View>

        <Text style={styles.title}>HOSPATE</Text>
        <Text style={styles.subtitle}>AI HEALTH BUDDY</Text>

        <View style={styles.taglineBox}>
          <Text style={styles.tagline}>"Your health, connected."</Text>
        </View>
      </Animated.View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Personal Health Intelligence Platform</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl
  },
  content: {
    alignItems: 'center'
  },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 8
  },
  title: {
    ...typography.display,
    color: colors.textPrimary,
    letterSpacing: 2,
    fontWeight: '900'
  },
  subtitle: {
    ...typography.label,
    fontSize: 13,
    color: colors.primary,
    letterSpacing: 3,
    marginTop: 4
  },
  taglineBox: {
    marginTop: spacing.xl,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs + 2,
    backgroundColor: colors.surfaceElevated,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border
  },
  tagline: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    fontStyle: 'italic'
  },
  footer: {
    position: 'absolute',
    bottom: spacing.xxl
  },
  footerText: {
    ...typography.caption,
    fontSize: 11,
    color: colors.textMuted,
    letterSpacing: 0.5
  }
});
