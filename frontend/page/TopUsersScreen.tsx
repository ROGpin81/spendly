import React, { useCallback, useContext, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  FlatList,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import { getAdminTopUsers } from '../services/admin.service';
import { AdminTopUser } from '../models/AdminTopUser';

export default function TopUsersScreen() {
  const { token, user } = useContext(AuthContext);

  const [topUsers, setTopUsers] = useState<AdminTopUser[]>([]);
  const [loading, setLoading] = useState(false);

  const loadTopUsers = async () => {
    try {
      if (!token) return;

      setLoading(true);
      const data = await getAdminTopUsers(token);
      setTopUsers(data);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'No se pudo cargar el Top 10');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (user?.role === 'ADMIN') {
        loadTopUsers();
      }
    }, [token, user])
  );

  if (user?.role !== 'ADMIN') {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.title}>Top 10 de usuarios</Text>
        <Text style={styles.info}>
          No tienes permisos para acceder a esta pantalla.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Top 10 de usuarios</Text>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" />
          <Text style={styles.info}>Cargando ranking...</Text>
        </View>
      ) : topUsers.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.info}>No hay datos para mostrar.</Text>
        </View>
      ) : (
        <FlatList
          data={topUsers}
          keyExtractor={(item) => String(item.user_id)}
          renderItem={({ item, index }) => (
            <View style={styles.card}>
              <Text style={styles.position}>#{index + 1}</Text>
              <Text style={styles.name}>
                {item.full_name || item.username || 'Usuario'}
              </Text>
              <Text style={styles.detail}>Username: {item.username || 'N/D'}</Text>
              <Text style={styles.detail}>Total gastado: L {item.total_spent}</Text>
              <Text style={styles.detail}>
                Cantidad de movimientos: {item.movements_count}
              </Text>
            </View>
          )}
        />
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
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  position: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 6,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  detail: {
    fontSize: 15,
    marginBottom: 4,
    color: '#444',
  },
});