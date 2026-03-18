import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  Alert,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import * as Location from 'expo-location';
import { AuthContext } from '../context/AuthContext';
import { Movement } from '../models/Movement';
import { Category } from '../models/Category';
import {
  getMovements,
  createMovement,
  updateMovement,
  deleteMovement,
} from '../services/movement.service';
import { getCategories } from '../services/category.service';

export default function MovementsScreen() {
  const { token } = useContext(AuthContext);

  const [movements, setMovements] = useState<Movement[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [type, setType] = useState<'INGRESO' | 'GASTO'>('GASTO');
  const [amount, setAmount] = useState('');
  const [movementDate, setMovementDate] = useState('');
  const [note, setNote] = useState('');
  const [locationLat, setLocationLat] = useState<number | null>(null);
  const [locationLng, setLocationLng] = useState<number | null>(null);

  const [loading, setLoading] = useState(false);
  const [capturingLocation, setCapturingLocation] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const today = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const loadData = async () => {
    try {
      if (!token) return;

      setLoading(true);

      const [movementsData, categoriesData] = await Promise.all([
        getMovements(token),
        getCategories(token),
      ]);

      setMovements(movementsData);
      setCategories(categoriesData);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'No se pudieron cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCategoryId(null);
    setType('GASTO');
    setAmount('');
    setMovementDate(today());
    setNote('');
    setLocationLat(null);
    setLocationLng(null);
    setEditingId(null);
    setIsEditing(false);
  };

  const handleCaptureLocation = async () => {
    try {
      setCapturingLocation(true);

      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          'Permiso requerido',
          'Debes permitir el acceso a la ubicación para usar esta función.'
        );
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const lat = currentLocation.coords.latitude;
      const lng = currentLocation.coords.longitude;

      setLocationLat(lat);
      setLocationLng(lng);

      Alert.alert('Éxito', 'Ubicación capturada correctamente');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'No se pudo obtener la ubicación');
    } finally {
      setCapturingLocation(false);
    }
  };

  const handleClearLocation = () => {
    setLocationLat(null);
    setLocationLng(null);
  };

  const handleCreateMovement = async () => {
    try {
      if (!token) return;

      if (!categoryId) {
        Alert.alert('Validación', 'Seleccione una categoría');
        return;
      }

      if (!amount.trim()) {
        Alert.alert('Validación', 'Ingrese el monto');
        return;
      }

      if (!movementDate.trim()) {
        Alert.alert('Validación', 'Ingrese la fecha');
        return;
      }

      await createMovement(token, {
        category_id: categoryId,
        type,
        amount: Number(amount),
        movement_date: movementDate,
        note,
        location_lat: locationLat,
        location_lng: locationLng,
      });

      resetForm();
      await loadData();
      Alert.alert('Éxito', 'Movimiento creado correctamente');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'No se pudo crear el movimiento');
    }
  };

  const handleStartEdit = (movement: Movement) => {
    setEditingId(movement.id);
    setIsEditing(true);
    setCategoryId(movement.category_id);
    setType(movement.type);
    setAmount(String(movement.amount));
    setMovementDate(movement.movement_date);
    setNote(movement.note || '');
    setLocationLat(movement.location_lat ?? null);
    setLocationLng(movement.location_lng ?? null);
  };

  const handleUpdateMovement = async () => {
    try {
      if (!token || editingId === null) return;

      if (!categoryId) {
        Alert.alert('Validación', 'Seleccione una categoría');
        return;
      }

      if (!amount.trim()) {
        Alert.alert('Validación', 'Ingrese el monto');
        return;
      }

      if (!movementDate.trim()) {
        Alert.alert('Validación', 'Ingrese la fecha');
        return;
      }

      await updateMovement(token, editingId, {
        category_id: categoryId,
        type,
        amount: Number(amount),
        movement_date: movementDate,
        note,
        location_lat: locationLat,
        location_lng: locationLng,
      });

      resetForm();
      await loadData();
      Alert.alert('Éxito', 'Movimiento actualizado correctamente');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'No se pudo actualizar el movimiento');
    }
  };

  const handleDeleteMovement = async (id: number) => {
    try {
      if (!token) return;

      await deleteMovement(token, id);
      await loadData();
      Alert.alert('Éxito', 'Movimiento eliminado correctamente');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'No se pudo eliminar el movimiento');
    }
  };

  const getCategoryName = (id: number) => {
    const category = categories.find((c) => c.id === id);
    return category ? category.name : `Categoría ${id}`;
  };

  useEffect(() => {
    setMovementDate(today());
    loadData();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Movimientos</Text>

      <Text style={styles.label}>Tipo</Text>
      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.typeButton, type === 'GASTO' && styles.typeButtonActive]}
          onPress={() => setType('GASTO')}
        >
          <Text style={styles.typeText}>GASTO</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.typeButton, type === 'INGRESO' && styles.typeButtonActive]}
          onPress={() => setType('INGRESO')}
        >
          <Text style={styles.typeText}>INGRESO</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Categoría</Text>
      <View style={styles.categoriesContainer}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryChip,
              categoryId === category.id && styles.categoryChipActive,
            ]}
            onPress={() => setCategoryId(category.id)}
          >
            <Text
              style={[
                styles.categoryChipText,
                categoryId === category.id && styles.categoryChipTextActive,
              ]}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Monto</Text>
      <TextInput
        style={styles.input}
        placeholder="Ejemplo: 250.50"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />

      <Text style={styles.label}>Fecha</Text>
      <TextInput
        style={styles.input}
        placeholder="YYYY-MM-DD"
        value={movementDate}
        onChangeText={setMovementDate}
      />

      <Text style={styles.label}>Nota</Text>
      <TextInput
        style={styles.input}
        placeholder="Descripción opcional"
        value={note}
        onChangeText={setNote}
      />

      <Text style={styles.label}>Ubicación actual</Text>
      <Button
        title={capturingLocation ? 'Obteniendo ubicación...' : 'Agregar ubicación actual'}
        onPress={handleCaptureLocation}
        disabled={capturingLocation}
      />

      <View style={styles.smallSpace} />

      <Button title="Quitar ubicación" onPress={handleClearLocation} />

      {locationLat !== null && locationLng !== null ? (
        <View style={styles.locationBox}>
          <Text style={styles.locationText}>Latitud: {locationLat.toFixed(6)}</Text>
          <Text style={styles.locationText}>Longitud: {locationLng.toFixed(6)}</Text>
        </View>
      ) : (
        <Text style={styles.locationInfo}>No se ha capturado ubicación</Text>
      )}

      <View style={styles.smallSpace} />

      {isEditing ? (
        <>
          <Button title="Actualizar movimiento" onPress={handleUpdateMovement} />
          <View style={styles.smallSpace} />
          <Button title="Cancelar edición" onPress={resetForm} />
        </>
      ) : (
        <Button title="Agregar movimiento" onPress={handleCreateMovement} />
      )}

      <View style={styles.separator} />

      {loading ? (
        <Text style={styles.info}>Cargando movimientos...</Text>
      ) : movements.length === 0 ? (
        <Text style={styles.info}>No hay movimientos registrados</Text>
      ) : (
        movements.map((movement) => (
          <View key={movement.id} style={styles.card}>
            <Text style={styles.cardTitle}>
              {movement.type} - L {movement.amount}
            </Text>

            <Text style={styles.cardText}>
              Categoría: {getCategoryName(movement.category_id)}
            </Text>

            <Text style={styles.cardText}>
              Fecha: {movement.movement_date}
            </Text>

            {movement.note ? (
              <Text style={styles.cardText}>Nota: {movement.note}</Text>
            ) : null}

            {movement.location_lat !== null && movement.location_lat !== undefined &&
            movement.location_lng !== null && movement.location_lng !== undefined ? (
              <>
                <Text style={styles.cardText}>
                  Lat: {Number(movement.location_lat).toFixed(6)}
                </Text>
                <Text style={styles.cardText}>
                  Lng: {Number(movement.location_lng).toFixed(6)}
                </Text>
              </>
            ) : (
              <Text style={styles.cardText}>Sin ubicación</Text>
            )}

            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => handleStartEdit(movement)}
              >
                <Text style={styles.actionText}>Editar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteMovement(movement.id)}
              >
                <Text style={styles.actionText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
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
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  typeButton: {
    flex: 1,
    backgroundColor: '#d9d9d9',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  typeButtonActive: {
    backgroundColor: '#4a90e2',
  },
  typeText: {
    fontWeight: 'bold',
    color: '#fff',
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  categoryChip: {
    backgroundColor: '#efefef',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  categoryChipActive: {
    backgroundColor: '#4a90e2',
  },
  categoryChipText: {
    fontWeight: '600',
    color: '#222',
  },
  categoryChipTextActive: {
    color: '#fff',
  },
  locationBox: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#cfd8dc',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#f7fbff',
  },
  locationText: {
    fontSize: 14,
    marginBottom: 4,
  },
  locationInfo: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
  },
  separator: {
    height: 24,
  },
  smallSpace: {
    height: 10,
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
    padding: 14,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  cardText: {
    fontSize: 15,
    marginBottom: 4,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  editButton: {
    backgroundColor: '#f0ad4e',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  deleteButton: {
    backgroundColor: '#d9534f',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  actionText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});