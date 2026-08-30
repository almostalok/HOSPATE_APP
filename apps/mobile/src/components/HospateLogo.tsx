import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Rect, G } from 'react-native-svg';

interface HospateLogoProps {
  size?: number;
  color?: string;
  backgroundColor?: string;
  showBackground?: boolean;
}

export const HospateLogo: React.FC<HospateLogoProps> = ({
  size = 56,
  color = '#FFFFFF',
  backgroundColor = '#002046',
  showBackground = false
}) => {
  return (
    <View
      style={[
        styles.container,
        showBackground && {
          backgroundColor,
          width: size * 1.25,
          height: size * 1.25,
          borderRadius: size * 0.32,
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 8
        }
      ]}
    >
      <Svg width={size} height={size} viewBox="0 0 100 100" fill="none">
        <G>
          {/* Main Infinity Heart Loop */}
          <Path
            d="M 50 62 
               L 26 38 
               C 17 29 17 15 28 8 
               C 39 1 50 12 59 22 
               L 74 38 
               C 83 48 83 62 72 69 
               C 61 76 50 65 41 55 
               L 26 38"
            fill="none"
            stroke={color}
            strokeWidth="9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M 50 62 
               L 74 38 
               C 83 29 83 15 72 8 
               C 61 1 50 12 41 22 
               L 26 38 
               C 17 48 17 62 28 69 
               C 39 76 50 65 59 55"
            fill="none"
            stroke={color}
            strokeWidth="9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Medical Cross (+) at Bottom Center */}
          <Rect x="44.5" y="70" width="11" height="26" rx="3" fill={color} />
          <Rect x="37" y="77.5" width="26" height="11" rx="3" fill={color} />
        </G>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center'
  }
});
