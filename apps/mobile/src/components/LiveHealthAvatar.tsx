import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Platform
} from 'react-native';
import Svg, {
  Circle,
  Path,
  G,
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  Rect
} from 'react-native-svg';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing, borderRadius } from '../theme/spacing';
import { Heart, Activity, ShieldCheck, Zap, Thermometer, Wind } from 'lucide-react-native';

interface LiveHealthAvatarProps {
  score?: number;
  userName?: string;
  heartRate?: number;
  spo2?: number;
  onPress?: () => void;
}

export const LiveHealthAvatar: React.FC<LiveHealthAvatarProps> = ({
  score = 80,
  userName = 'Alex',
  heartRate = 72,
  spo2 = 98,
  onPress
}) => {
  const isWeb = Platform.OS === 'web';
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const breathAnim = useRef(new Animated.Value(0.96)).current;
  const waveAnim = useRef(new Animated.Value(0)).current;

  const [activeTab, setActiveTab] = useState<'twin' | 'vitals'>('twin');

  useEffect(() => {
    // 1. Heartbeat pulse animation (72 BPM)
    const heartPulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.08,
          duration: 180,
          useNativeDriver: !isWeb
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 220,
          useNativeDriver: !isWeb
        }),
        Animated.timing(pulseAnim, {
          toValue: 1.04,
          duration: 140,
          useNativeDriver: !isWeb
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 460,
          useNativeDriver: !isWeb
        })
      ])
    );

    // 2. Smooth respiratory breathing rhythm
    const respiratoryBreath = Animated.loop(
      Animated.sequence([
        Animated.timing(breathAnim, {
          toValue: 1.04,
          duration: 2400,
          useNativeDriver: !isWeb
        }),
        Animated.timing(breathAnim, {
          toValue: 0.96,
          duration: 2400,
          useNativeDriver: !isWeb
        })
      ])
    );

    heartPulse.start();
    respiratoryBreath.start();

    return () => {
      heartPulse.stop();
      respiratoryBreath.stop();
    };
  }, []);

  const getStatusColor = () => {
    if (score >= 75) return colors.success;
    if (score >= 50) return colors.warning;
    return colors.danger;
  };

  const statusColor = getStatusColor();

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress || (() => setActiveTab(prev => (prev === 'twin' ? 'vitals' : 'twin')))}
      style={styles.container}
    >
      {/* Top HUD Row */}
      <View style={styles.hudRow}>
        <View style={styles.liveBadge}>
          <View style={[styles.liveDot, { backgroundColor: statusColor }]} />
          <Text style={styles.liveText}>LIVE BIO-TWIN</Text>
        </View>

        <View style={styles.syncRow}>
          <ShieldCheck size={13} color={colors.primary} />
          <Text style={styles.syncText}>Records Synced</Text>
        </View>
      </View>

      {/* Main Avatar Presentation Area */}
      <View style={styles.avatarStage}>
        {/* Animated Background Aura */}
        <Animated.View
          style={[
            styles.auraCircle,
            {
              transform: [{ scale: breathAnim }],
              borderColor: 'rgba(10, 132, 255, 0.18)'
            }
          ]}
        />
        <Animated.View
          style={[
            styles.innerAura,
            {
              transform: [{ scale: pulseAnim }],
              backgroundColor: 'rgba(10, 132, 255, 0.08)'
            }
          ]}
        />

        {/* Anatomical Vector Twin Figure */}
        <View style={styles.svgWrapper}>
          <Svg width="180" height="200" viewBox="0 0 200 220" fill="none">
            <Defs>
              <LinearGradient id="bodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <Stop offset="0%" stopColor="#0A84FF" stopOpacity="0.85" />
                <Stop offset="50%" stopColor="#002B5B" stopOpacity="0.7" />
                <Stop offset="100%" stopColor="#1C1C1E" stopOpacity="0.9" />
              </LinearGradient>
              <RadialGradient id="heartGlow" cx="50%" cy="50%" r="50%">
                <Stop offset="0%" stopColor="#FF375F" stopOpacity="0.9" />
                <Stop offset="100%" stopColor="#FF375F" stopOpacity="0" />
              </RadialGradient>
              <RadialGradient id="brainGlow" cx="50%" cy="50%" r="50%">
                <Stop offset="0%" stopColor="#64D2FF" stopOpacity="0.8" />
                <Stop offset="100%" stopColor="#0A84FF" stopOpacity="0" />
              </RadialGradient>
            </Defs>

            {/* Subtle Grid Silhouette */}
            <G opacity="0.9">
              {/* Head Contour */}
              <Circle cx="100" cy="38" r="22" stroke="#64D2FF" strokeWidth="2.5" fill="url(#brainGlow)" />
              <Circle cx="100" cy="38" r="14" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeDasharray="3,3" />

              {/* Neck */}
              <Path d="M93 60 L93 72 L107 72 L107 60" stroke="#0A84FF" strokeWidth="2" />

              {/* Torso & Shoulders Contour */}
              <Path
                d="M62 82 C72 74 85 72 100 72 C115 72 128 74 138 82 L146 112 L132 165 L68 165 L54 112 Z"
                fill="url(#bodyGrad)"
                stroke="#0A84FF"
                strokeWidth="2.5"
              />

              {/* Spine / Central Nervous Line */}
              <Path d="M100 72 L100 165" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" strokeDasharray="4,4" />

              {/* Cardiovascular Heart Node (Pulsing Center) */}
              <Circle cx="106" cy="104" r="14" fill="url(#heartGlow)" />
              <Circle cx="106" cy="104" r="6" fill="#FF375F" />

              {/* Ribcage / Respiratory Arc Lines */}
              <Path d="M80 96 C88 92 100 92 100 92 C100 92 112 92 120 96" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
              <Path d="M76 110 C86 106 100 106 100 106 C100 106 114 106 124 110" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
              <Path d="M78 124 C87 120 100 120 100 120 C100 120 113 120 122 124" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />

              {/* Arms Outlines */}
              <Path d="M54 112 L38 160 L44 185" stroke="#0A84FF" strokeWidth="2" strokeLinecap="round" />
              <Path d="M146 112 L162 160 L156 185" stroke="#0A84FF" strokeWidth="2" strokeLinecap="round" />

              {/* Pelvis Base */}
              <Path d="M68 165 L84 212" stroke="#0A84FF" strokeWidth="2.5" strokeLinecap="round" />
              <Path d="M132 165 L116 212" stroke="#0A84FF" strokeWidth="2.5" strokeLinecap="round" />
            </G>
          </Svg>
        </View>

        {/* Live Vitals HUD Floating Cards */}
        <View style={styles.vitalsLeft}>
          <View style={styles.vitalCard}>
            <View style={styles.vitalIconRow}>
              <Heart size={14} color="#FF375F" />
              <Text style={styles.vitalVal}>{heartRate}</Text>
            </View>
            <Text style={styles.vitalUnit}>BPM PULSE</Text>
          </View>

          <View style={[styles.vitalCard, { marginTop: spacing.xs }]}>
            <View style={styles.vitalIconRow}>
              <Wind size={14} color="#64D2FF" />
              <Text style={styles.vitalVal}>{spo2}%</Text>
            </View>
            <Text style={styles.vitalUnit}>SpO2 OXYGEN</Text>
          </View>
        </View>

        <View style={styles.vitalsRight}>
          <View style={styles.vitalCard}>
            <View style={styles.vitalIconRow}>
              <Activity size={14} color={statusColor} />
              <Text style={[styles.vitalVal, { color: statusColor }]}>{score}</Text>
            </View>
            <Text style={styles.vitalUnit}>BIO-SCORE</Text>
          </View>

          <View style={[styles.vitalCard, { marginTop: spacing.xs }]}>
            <View style={styles.vitalIconRow}>
              <Thermometer size={14} color="#FF9F0A" />
              <Text style={styles.vitalVal}>98.6°</Text>
            </View>
            <Text style={styles.vitalUnit}>TEMP °F</Text>
          </View>
        </View>
      </View>

      {/* Bottom Summary Bar */}
      <View style={styles.bottomBar}>
        <Text style={styles.patientName}>{userName}'s Digital Twin</Text>
        <Text style={styles.tapTip}>Tap to toggle vitals telemetry</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden'
  },
  hudRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 3,
    borderRadius: borderRadius.pill
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6
  },
  liveText: {
    ...typography.captionSemibold,
    fontSize: 10,
    color: colors.textSecondary,
    letterSpacing: 0.5
  },
  syncRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  syncText: {
    ...typography.caption,
    fontSize: 11,
    color: colors.textMuted,
    marginLeft: 4
  },
  avatarStage: {
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
  auraCircle: {
    position: 'absolute',
    width: 170,
    height: 170,
    borderRadius: 85,
    borderWidth: 1.5,
    backgroundColor: 'rgba(0, 43, 91, 0.25)'
  },
  innerAura: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60
  },
  svgWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2
  },
  vitalsLeft: {
    position: 'absolute',
    left: spacing.xs,
    top: spacing.md,
    zIndex: 3
  },
  vitalsRight: {
    position: 'absolute',
    right: spacing.xs,
    top: spacing.md,
    zIndex: 3
  },
  vitalCard: {
    backgroundColor: 'rgba(28, 28, 30, 0.88)',
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: colors.border,
    minWidth: 78
  },
  vitalIconRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  vitalVal: {
    ...typography.bodySemibold,
    color: colors.textPrimary,
    fontSize: 13,
    marginLeft: 5
  },
  vitalUnit: {
    ...typography.caption,
    fontSize: 9,
    color: colors.textMuted,
    marginTop: 1,
    letterSpacing: 0.3
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
    marginTop: spacing.xs
  },
  patientName: {
    ...typography.bodySemibold,
    fontSize: 13,
    color: colors.textPrimary
  },
  tapTip: {
    ...typography.caption,
    fontSize: 11,
    color: colors.textMuted
  }
});
