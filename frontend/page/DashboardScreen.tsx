import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { MonthlySummary } from '../models/MonthlySummary';
import { getMonthlySummary } from '../services/report.service';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

export default function DashboardScreen() {
  const { token } = useContext(AuthContext);

  const [summary, setSummary] = useState<MonthlySummary | null>(null);
  const [loading, setLoading] = useState(false);

  const loadSummary = async () => {
    try {
      if (!token) return;

      setLoading(true);
      const data = await getMonthlySummary(token);
      setSummary(data);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'No se pudo cargar el resumen mensual');
    } finally {
      setLoading(false);
    }
  };

    useFocusEffect(
      useCallback(() => {
        loadSummary();
      }, [token])
    );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>

      {loading ? (
        <Text style={styles.info}>Cargando resumen...</Text>
      ) : !summary ? (
        <Text style={styles.info}>No hay información disponible</Text>
      ) : (
        <>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Mes actual</Text>
            <Text style={styles.cardValue}>{summary.month}</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Ingresos</Text>
            <Text style={styles.cardValue}>L {summary.total_income.toFixed(2)}</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Gastos</Text>
            <Text style={styles.cardValue}>L {summary.total_expense.toFixed(2)}</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Balance</Text>
            <Text style={styles.cardValue}>L {summary.balance.toFixed(2)}</Text>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  info: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  card: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 18,
    marginBottom: 14,
    backgroundColor: '#f8f9fa',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  cardValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});