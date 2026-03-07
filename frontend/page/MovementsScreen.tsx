import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function MovementsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Movimientos</Text>
      <Text style={styles.text}>Pantalla de movimientos</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
  },
});