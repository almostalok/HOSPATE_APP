import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle
} from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { borderRadius, spacing } from '../theme/spacing';

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  icon,
  style,
  textStyle
}) => {
  const getButtonStyles = () => {
    switch (variant) {
      case 'secondary':
        return {
          bg: colors.surfaceElevated,
          textColor: colors.textPrimary,
          border: colors.border
        };
      case 'danger':
        return {
          bg: colors.danger,
          textColor: '#FFFFFF',
          border: 'transparent'
        };
      case 'ghost':
        return {
          bg: 'transparent',
          textColor: colors.primary,
          border: 'transparent'
        };
      case 'primary':
      default:
        return {
          bg: colors.primary,
          textColor: '#FFFFFF',
          border: 'transparent'
        };
    }
  };

  const btnStyle = getButtonStyles();

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        {
          backgroundColor: btnStyle.bg,
          borderColor: btnStyle.border
        },
        disabled && styles.disabled,
        style
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={btnStyle.textColor} />
      ) : (
        <>
          {icon ? <span style={{ marginRight: 6 }}>{icon}</span> : null}
          <Text style={[styles.text, { color: btnStyle.textColor }, textStyle]}>
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 50,
    borderRadius: borderRadius.md + 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    borderWidth: 1
  },
  text: {
    ...typography.headline,
    fontSize: 16,
    fontWeight: '600'
  },
  disabled: {
    opacity: 0.45
  }
});
