import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';

export default function HomeScreen() {
  const [waterAmount, setWaterAmount] = useState(1250);
  const [stepsCount, setStepsCount] = useState(6450);

  const incrementWater = (amount: number) => {
    setWaterAmount(waterAmount + amount);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        
        {/* Welcome */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>Hello, Champ! 👋</Text>
          <Text style={styles.welcomeSubtext}>Track your stats for today:</Text>
        </View>

        {/* Caloric stats card */}
        <View style={styles.glassCard}>
          <Text style={styles.cardHeader}>Calorie Tracker</Text>
          <View style={styles.ringContainer}>
            <View style={styles.ringInterior}>
              <Text style={styles.largeMetric}>1,450</Text>
              <Text style={styles.metricLabel}>/ 2,000 kcal</Text>
            </View>
          </View>
        </View>

        {/* Water logger */}
        <View style={styles.glassCard}>
          <Text style={styles.cardHeader}>Water hydration</Text>
          <View style={styles.waterInfo}>
            <Text style={styles.waterText}>{waterAmount} ml <Text style={styles.lightText}>/ 3000 ml</Text></Text>
          </View>
          <View style={styles.row}>
            <TouchableOpacity onPress={() => incrementWater(250)} style={styles.badgeButton}>
              <Text style={styles.badgeText}>+250ml</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => incrementWater(500)} style={styles.badgeButton}>
              <Text style={styles.badgeText}>+500ml</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Steps tracker */}
        <View style={styles.glassCard}>
          <Text style={styles.cardHeader}>Daily Steps</Text>
          <Text style={styles.largeMetric}>{stepsCount}</Text>
          <Text style={styles.lightText}>Goal: 10,000 steps</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  scroll: {
    padding: 16,
    gap: 16,
  },
  welcomeSection: {
    marginBottom: 8,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F8FAFC',
  },
  welcomeSubtext: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
  },
  glassCard: {
    backgroundColor: '#1E293B',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  cardHeader: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  ringContainer: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  ringInterior: {
    alignItems: 'center',
  },
  largeMetric: {
    fontSize: 32,
    fontWeight: '900',
    color: '#F8FAFC',
  },
  metricLabel: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
  },
  waterInfo: {
    marginBottom: 16,
  },
  waterText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3B82F6',
  },
  lightText: {
    color: '#64748B',
    fontSize: 14,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  badgeButton: {
    flex: 1,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  badgeText: {
    color: '#3B82F6',
    fontWeight: 'bold',
    fontSize: 12,
  },
});
