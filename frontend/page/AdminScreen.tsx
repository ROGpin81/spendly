import React, { useCallback, useContext, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import { getAdminSummary } from '../services/admin.service';
import { AdminSummary } from '../models/AdminSummary';

export default function AdminScreen() {
  const { token, user } = useContext(AuthContext);
  const navigation = useNavigation<any>();

  const [summary, setSummary] = useState<AdminSummary | null>(null);
  const [loading, setLoading] = useState(false);

  const loadSummary = async () => {
    try {
      if (!token) return;

      setLoading(true);
      const data = await getAdminSummary(token);
      setSummary(data);
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.message || 'No se pudo cargar el panel administrativo'
      );
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (user?.role === 'ADMIN') {
        loadSummary();
      }
    }, [token, user])
  );

  if (user?.role !== 'ADMIN') {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.title}>Panel Administrativo</Text>
        <Text style={styles.info}>
          No tienes permisos para acceder a esta pantalla.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Panel Administrativo</Text>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" />
          <Text style={styles.info}>Cargando resumen...</Text>
        </View>
      ) : !summary ? (
        <View style={styles.centerContainer}>
          <Text style={styles.info}>No se pudo cargar la información.</Text>
        </View>
      ) : (
        <>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Usuarios registrados</Text>
            <Text style={styles.cardValue}>{summary.total_users}</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardLabel}>Total de movimientos</Text>
            <Text style={styles.cardValue}>{summary.total_movements}</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardLabel}>Total global de gastos</Text>
            <Text style={styles.cardValue}>L {summary.total_expenses}</Text>
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('TopUsers')}
          >
            <Text style={styles.buttonText}>Ver Top 10 de usuarios</Text>
          </TouchableOpacity>
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  info: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 12,
    color: '#555',
  },
  card: {
    backgroundColor: '#f5f7fb',
    borderRadius: 12,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#dde3ea',
  },
  cardLabel: {
    fontSize: 16,
    color: '#555',
    marginBottom: 8,
  },
  cardValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f3b5b',
  },
  button: {
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});