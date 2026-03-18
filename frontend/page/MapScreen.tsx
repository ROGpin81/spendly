import React, { useCallback, useContext, useState } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';
import { AuthContext } from '../context/AuthContext';
import { MapExpense } from '../models/MapExpense';
import { getMapExpenses } from '../services/map.service';

export default function MapScreen() {
  const { token } = useContext(AuthContext);

  const [expenses, setExpenses] = useState<MapExpense[]>([]);
  const [loading, setLoading] = useState(false);

  const loadMapExpenses = async () => {
    try {
      if (!token) return;

      setLoading(true);
      const data = await getMapExpenses(token);
      setExpenses(data);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'No se pudieron cargar los gastos geolocalizados');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadMapExpenses();
    }, [token])
  );

  const initialRegion = expenses.length > 0
    ? {
        latitude: expenses[0].location_lat,
        longitude: expenses[0].location_lng,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }
    : {
        latitude: 14.072275,
        longitude: -87.192136,
        latitudeDelta: 0.2,
        longitudeDelta: 0.2,
      };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mapa de gastos</Text>

      {loading ? (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" />
          <Text style={styles.info}>Cargando mapa...</Text>
        </View>
      ) : expenses.length === 0 ? (
        <View style={styles.centerContent}>
          <Text style={styles.info}>No hay gastos geolocalizados para mostrar</Text>
        </View>
      ) : (
        <>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryText}>
              Gastos geolocalizados: {expenses.length}
            </Text>
          </View>

          <MapView style={styles.map} initialRegion={initialRegion}>
            {expenses.map((expense) => (
              <Marker
                key={expense.id}
                coordinate={{
                  latitude: expense.location_lat,
                  longitude: expense.location_lng,
                }}
                title={expense.category?.name || 'Gasto'}
                description={`L ${expense.amount} - ${expense.note || 'Sin nota'}`}
              />
            ))}
          </MapView>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  info: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 12,
  },
  summaryBox: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  summaryText: {
    fontSize: 16,
    fontWeight: '600',
  },
  map: {
    flex: 1,
  },
});