import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Platform, TouchableOpacity } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { HospateLogo } from '../../components/HospateLogo';

export const SplashScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.95);

  useEffect(() => {
    const isWeb = Platform.OS === 'web';
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: !isWeb
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 7,
        useNativeDriver: !isWeb
      })
    ]).start();

    const timer = setTimeout(() => {
      navigation.replace('Welcome');
    }, 1100);

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
        <HospateLogo size={80} showBackground={true} />

        <Text style={styles.title}>Hospate</Text>
        <Text style={styles.subtitle}>Health Intelligence</Text>
      </Animated.View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Secure Personal Health Records</Text>
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
  title: {
    ...typography.display,
    color: colors.textPrimary,
    marginTop: spacing.xl,
    fontWeight: '700'
  },
  subtitle: {
    ...typography.subheadline,
    color: colors.textSecondary,
    marginTop: 4,
    fontSize: 16
  },
  footer: {
    position: 'absolute',
    bottom: spacing.xxl
  },
  footerText: {
    ...typography.caption,
    fontSize: 12,
    color: colors.textMuted
  }
});
