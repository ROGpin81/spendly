import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { CategoryStat } from '../models/CategoryStat';
import { getCategoryStats } from '../services/stats.service';


export default function StatisticsScreen() {
  const { token } = useContext(AuthContext);

  const [stats, setStats] = useState<CategoryStat[]>([]);
  const [loading, setLoading] = useState(false);

  const loadStats = async () => {
    try {
      if (!token) return;

      setLoading(true);
      const data = await getCategoryStats(token);
      setStats(data);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'No se pudieron cargar las estadísticas');
    } finally {
      setLoading(false);
    }
  };

  const getGrandTotal = () => {
    return stats.reduce((acc, item) => acc + item.total, 0);
  };

    useFocusEffect(
      useCallback(() => {
        loadStats();
    }, [token])
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Estadísticas</Text>

      {loading ? (
        <Text style={styles.info}>Cargando estadísticas...</Text>
      ) : stats.length === 0 ? (
        <Text style={styles.info}>No hay estadísticas disponibles</Text>
      ) : (
        <>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Total general</Text>
            <Text style={styles.summaryValue}>L {getGrandTotal().toFixed(2)}</Text>
          </View>

          {stats.map((item) => (
            <View key={item.category} style={styles.card}>
              <Text style={styles.cardTitle}>{item.category}</Text>
              <Text style={styles.cardValue}>L {item.total.toFixed(2)}</Text>
            </View>
          ))}
        </>
      )}
    </ScrollView>
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
  summaryCard: {
    borderWidth: 1,
    borderColor: '#cfd8dc',
    borderRadius: 10,
    padding: 18,
    marginBottom: 16,
    backgroundColor: '#f1f8ff',
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 26,
    fontWeight: 'bold',
  },
  card: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#fafafa',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  cardValue: {
    fontSize: 22,
    fontWeight: 'bold',
  },
});