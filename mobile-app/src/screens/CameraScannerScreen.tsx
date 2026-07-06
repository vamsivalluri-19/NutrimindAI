import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView } from 'react-native';
import { Camera } from 'expo-camera';

export default function CameraScannerScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scannedResult, setScannedResult] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const capturePhoto = () => {
    // Simulated snap capture and AI scanned values
    setScannedResult({
      foodName: 'AI Detected: Grilled Salmon Bowl',
      calories: 520,
      protein: 38,
      carbs: 45,
      fat: 18,
    });
  };

  if (hasPermission === null) {
    return (
      <View style={styles.center}>
        <Text style={styles.text}>Requesting camera permission...</Text>
      </View>
    );
  }
  if (hasPermission === false) {
    return (
      <View style={styles.center}>
        <Text style={styles.text}>No access to camera. Enable in settings.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {scannedResult ? (
        <View style={styles.resultContainer}>
          <Text style={styles.title}>Scanned Meal Analysis</Text>
          <View style={styles.card}>
            <Text style={styles.foodTitle}>{scannedResult.foodName}</Text>
            <View style={styles.macroRow}>
              <Text style={styles.macro}>Calories: {scannedResult.calories} kcal</Text>
              <Text style={styles.macro}>Protein: {scannedResult.protein}g</Text>
              <Text style={styles.macro}>Carbs: {scannedResult.carbs}g</Text>
              <Text style={styles.macro}>Fat: {scannedResult.fat}g</Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => setScannedResult(null)} style={styles.resetButton}>
            <Text style={styles.resetButtonText}>Scan Another Meal</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.cameraContainer}>
          <View style={styles.viewfinder} />
          <TouchableOpacity onPress={capturePhoto} style={styles.captureButton}>
            <View style={styles.captureButtonInner} />
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0F172A',
  },
  text: {
    color: '#F8FAFC',
  },
  cameraContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#020617',
    position: 'relative',
  },
  viewfinder: {
    position: 'absolute',
    top: '25%',
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: '#16A34A',
    borderRadius: 24,
    borderStyle: 'dashed',
  },
  captureButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 4,
    borderColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  captureButtonInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#16A34A',
  },
  resultContainer: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#F8FAFC',
    textAlign: 'center',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#1E293B',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  foodTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#16A34A',
    marginBottom: 12,
  },
  macroRow: {
    gap: 8,
  },
  macro: {
    color: '#F8FAFC',
    fontSize: 14,
  },
  resetButton: {
    backgroundColor: '#16A34A',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  resetButtonText: {
    color: '#F8FAFC',
    fontWeight: 'bold',
  },
});
