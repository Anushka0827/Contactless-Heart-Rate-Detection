import React, { useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Animated, Dimensions, StatusBar, SafeAreaView,
} from 'react-native';
import { colors } from '../theme/colors';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 800, useNativeDriver: true }),
    ]).start();

    // Pulse loop
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.12, duration: 700, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.gradientStart} />
      <View style={styles.bg}>
        {/* Decorative blobs */}
        <View style={styles.blobGreen} />
        <View style={styles.blobPurple} />

        <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>

          {/* Logo / Pulse Icon */}
          <View style={styles.logoWrap}>
            <Animated.View style={[styles.pulseBg, { transform: [{ scale: pulseAnim }] }]} />
            <View style={styles.logoCircle}>
              <Text style={styles.logoEmoji}>+</Text>
            </View>
          </View>

          {/* Brand */}
          <Text style={styles.brand}>PulseGuard</Text>
          <Text style={styles.tagline}>Your personal heart health companion</Text>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Measure buttons */}
          <Text style={styles.sectionLabel}>CHOOSE METHOD</Text>

          <TouchableOpacity
            style={[styles.card, styles.cardGreen]}
            onPress={() => navigation.navigate('Finger')}
            activeOpacity={0.85}
          >
            <View style={styles.cardIcon}>
              <View style={styles.iconCircleGreen}>
                <Text style={styles.iconText}>F</Text>
              </View>
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle}>Finger Scan</Text>
              <Text style={styles.cardDesc}>Cover the flashlight with your fingertip</Text>
            </View>
            <Text style={styles.cardArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.card, styles.cardPurple]}
            onPress={() => navigation.navigate('Camera')}
            activeOpacity={0.85}
          >
            <View style={styles.cardIcon}>
              <View style={styles.iconCirclePurple}>
                <Text style={styles.iconText}>C</Text>
              </View>
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle}>Face Scan</Text>
              <Text style={styles.cardDesc}>Contactless detection via front camera</Text>
            </View>
            <Text style={styles.cardArrow}>›</Text>
          </TouchableOpacity>

          {/* Recent results pill */}
          <TouchableOpacity
            style={styles.recentBtn}
            onPress={() => navigation.navigate('Results', { bpm: null, fromHome: true })}
            activeOpacity={0.8}
          >
            <Text style={styles.recentBtnText}>View Last Result</Text>
          </TouchableOpacity>

        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.gradientStart },
  bg: {
    flex: 1,
    backgroundColor: colors.gradientStart,
    overflow: 'hidden',
  },
  blobGreen: {
    position: 'absolute', top: -80, right: -80,
    width: 260, height: 260, borderRadius: 130,
    backgroundColor: colors.greenLight,
    opacity: 0.45,
  },
  blobPurple: {
    position: 'absolute', bottom: 100, left: -100,
    width: 300, height: 300, borderRadius: 150,
    backgroundColor: colors.purpleLight,
    opacity: 0.3,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    alignItems: 'center',
  },

  // Logo
  logoWrap: { marginBottom: 20, alignItems: 'center', justifyContent: 'center' },
  pulseBg: {
    position: 'absolute',
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: colors.greenGlow,
  },
  logoCircle: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: colors.white,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: colors.green,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 10,
    borderWidth: 2,
    borderColor: colors.greenLight,
  },
  logoEmoji: { fontSize: 34, color: colors.green, fontWeight: '700' },

  // Brand
  brand: {
    fontSize: 34,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  tagline: {
    fontSize: 14,
    color: colors.textSecondary,
    letterSpacing: 0.2,
    marginBottom: 28,
  },

  divider: {
    width: width * 0.5,
    height: 1.5,
    backgroundColor: colors.border,
    marginBottom: 28,
    borderRadius: 2,
  },

  sectionLabel: {
    alignSelf: 'flex-start',
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 1.5,
    marginBottom: 12,
  },

  // Cards
  card: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1.5,
  },
  cardGreen: { borderColor: colors.borderGreen },
  cardPurple: { borderColor: colors.border },
  cardIcon: { marginRight: 14 },
  iconCircleGreen: {
    width: 46, height: 46, borderRadius: 23,
    backgroundColor: colors.greenLight,
    alignItems: 'center', justifyContent: 'center',
  },
  iconCirclePurple: {
    width: 46, height: 46, borderRadius: 23,
    backgroundColor: colors.purpleLight,
    alignItems: 'center', justifyContent: 'center',
  },
  iconText: { fontSize: 18, fontWeight: '700', color: colors.textPrimary },
  cardBody: { flex: 1 },
  cardTitle: { fontSize: 17, fontWeight: '700', color: colors.textPrimary, marginBottom: 3 },
  cardDesc: { fontSize: 13, color: colors.textSecondary, lineHeight: 18 },
  cardArrow: { fontSize: 26, color: colors.textMuted, fontWeight: '300' },

  // Recent
  recentBtn: {
    marginTop: 10,
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 50,
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.border,
    shadowColor: colors.purple,
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  recentBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.purple,
    letterSpacing: 0.3,
  },
});