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

export interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'ai';
  size?: 'sm' | 'md' | 'lg' | 'small' | 'medium' | 'large';
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
  size = 'md',
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
      case 'ai':
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

  const isSmall = size === 'sm' || size === 'small';
  const isLarge = size === 'lg' || size === 'large';

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        isSmall && styles.buttonSmall,
        isLarge && styles.buttonLarge,
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
          <Text
            style={[
              styles.text,
              isSmall && styles.textSmall,
              { color: btnStyle.textColor },
              textStyle
            ]}
          >
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
  buttonSmall: {
    height: 38,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md
  },
  buttonLarge: {
    height: 54,
    borderRadius: borderRadius.lg
  },
  text: {
    ...typography.headline,
    fontSize: 16,
    fontWeight: '600'
  },
  textSmall: {
    fontSize: 14
  },
  disabled: {
    opacity: 0.45
  }
});
