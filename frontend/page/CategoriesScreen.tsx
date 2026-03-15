import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  FlatList,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { Category } from '../models/Category';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../services/category.service';

export default function CategoriesScreen() {
  const { token } = useContext(AuthContext);

  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const loadCategories = async () => {
    try {
      if (!token) return;

      setLoading(true);
      const data = await getCategories(token);
      setCategories(data);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'No se pudieron cargar las categorías');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName('');
    setEditingId(null);
    setIsEditing(false);
  };

  const handleCreateCategory = async () => {
    try {
      if (!token) return;

      if (!name.trim()) {
        Alert.alert('Validación', 'Ingrese el nombre de la categoría');
        return;
      }

      await createCategory(token, name.trim());
      resetForm();
      await loadCategories();
      Alert.alert('Éxito', 'Categoría creada correctamente');
    } catch (error: any) {
      console.log('Error frontend createCategory:', error);
      Alert.alert('Error', error.message || 'No se pudo crear la categoría');
    }
  };

  const handleStartEdit = (category: Category) => {
    setName(category.name);
    setEditingId(category.id);
    setIsEditing(true);
  };

  const handleUpdateCategory = async () => {
    try {
      if (!token || editingId === null) return;

      if (!name.trim()) {
        Alert.alert('Validación', 'Ingrese el nombre de la categoría');
        return;
      }

      await updateCategory(token, editingId, name.trim());
      resetForm();
      await loadCategories();
      Alert.alert('Éxito', 'Categoría actualizada correctamente');
    } catch (error: any) {
      console.log('Error frontend updateCategory:', error);
      Alert.alert('Error', error.message || 'No se pudo actualizar la categoría');
    }
  };

  const handleDeleteCategory = async (id: number) => {
    try {
      if (!token) return;

      await deleteCategory(token, id);
      await loadCategories();
      Alert.alert('Éxito', 'Categoría eliminada correctamente');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'No se pudo eliminar la categoría');
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Categorías</Text>

      <TextInput
        style={styles.input}
        placeholder="Nueva categoría"
        value={name}
        onChangeText={setName}
      />

      {isEditing ? (
        <>
          <Button title="Actualizar categoría" onPress={handleUpdateCategory} />
          <View style={styles.smallSpace} />
          <Button title="Cancelar edición" onPress={resetForm} />
        </>
      ) : (
        <Button title="Agregar categoría" onPress={handleCreateCategory} />
      )}

      <View style={styles.separator} />

      {loading ? (
        <Text style={styles.info}>Cargando categorías...</Text>
      ) : categories.length === 0 ? (
        <Text style={styles.info}>No hay categorías disponibles</Text>
      ) : (
        <FlatList
          data={categories}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardText}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <Text style={styles.cardSubtitle}>
                  {item.owner_user_id === null ? 'Global' : 'Personal'}
                </Text>
              </View>

              {item.owner_user_id !== null && (
                <View style={styles.actions}>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => handleStartEdit(item)}
                  >
                    <Text style={styles.actionText}>Editar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteCategory(item.id)}
                  >
                    <Text style={styles.actionText}>Eliminar</Text>
                  </TouchableOpacity>
                </View>
              )}
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
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  separator: {
    height: 20,
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
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  cardText: {
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
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