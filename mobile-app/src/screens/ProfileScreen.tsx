import React, { useState } from 'react';
import { StyleSheet, Text, View, Switch, TouchableOpacity, SafeAreaView } from 'react-native';

export default function ProfileScreen() {
  const [biometricsEnabled, setBiometricsEnabled] = useState(false);
  const [pushEnabled, setPushEnabled] = useState(true);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        
        {/* Info */}
        <View style={styles.avatarSection}>
          <Text style={styles.avatar}>🥗</Text>
          <Text style={styles.name}>John Doe</Text>
          <Text style={styles.email}>john@nutrimind.ai</Text>
        </View>

        {/* Goals detail grid */}
        <View style={styles.goalsCard}>
          <View style={styles.gridItem}>
            <Text style={styles.gridLabel}>Weight Goal</Text>
            <Text style={styles.gridVal}>Lose Weight</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.gridLabel}>Height</Text>
            <Text style={styles.gridVal}>175 cm</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.gridLabel}>Weight</Text>
            <Text style={styles.gridVal}>70 kg</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.gridLabel}>Diet</Text>
            <Text style={styles.gridVal}>Vegetarian</Text>
          </View>
        </View>

        {/* Settings options */}
        <View style={styles.settingsGroup}>
          <View style={styles.settingRow}>
            <Text style={styles.settingText}>Biometric Login</Text>
            <Switch
              value={biometricsEnabled}
              onValueChange={setBiometricsEnabled}
              trackColor={{ false: '#334155', true: '#16A34A' }}
            />
          </View>

          <View style={styles.settingRow}>
            <Text style={styles.settingText}>Push Notifications</Text>
            <Switch
              value={pushEnabled}
              onValueChange={setPushEnabled}
              trackColor={{ false: '#334155', true: '#16A34A' }}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.logoutButton}>
          <Text style={styles.logoutText}>Log Out Account</Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  content: {
    padding: 24,
    gap: 24,
  },
  avatarSection: {
    alignItems: 'center',
    marginVertical: 12,
  },
  avatar: {
    fontSize: 56,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F8FAFC',
    marginTop: 12,
  },
  email: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
  },
  goalsCard: {
    backgroundColor: '#1E293B',
    borderRadius: 24,
    padding: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  gridItem: {
    width: '50%',
    padding: 12,
  },
  gridLabel: {
    color: '#64748B',
    fontSize: 10,
    textTransform: 'uppercase',
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  gridVal: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
  settingsGroup: {
    backgroundColor: '#1E293B',
    borderRadius: 24,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  settingText: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '500',
  },
  logoutButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.15)',
    marginTop: 12,
  },
  logoutText: {
    color: '#EF4444',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
