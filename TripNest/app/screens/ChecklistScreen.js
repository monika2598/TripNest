// app/screens/ChecklistScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  TextInput,
  Button,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { auth, db } from '../../firebase/config';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';

export default function ChecklistScreen({ route }) {
  const { tripId } = route.params;
  const [item, setItem] = useState('');
  const [items, setItems] = useState([]);

  const user = auth.currentUser;
  const checklistRef = collection(db, 'users', user.uid, 'trips', tripId, 'checklist');

  const loadChecklist = async () => {
    const snapshot = await getDocs(checklistRef);
    const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setItems(list);
  };

  const addItem = async () => {
    if (!item) return;
    await addDoc(checklistRef, { name: item });
    setItem('');
    loadChecklist();
  };

  const deleteItem = async (id) => {
    await deleteDoc(doc(db, 'users', user.uid, 'trips', tripId, 'checklist', id));
    loadChecklist();
  };

  useEffect(() => {
    loadChecklist();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Trip Checklist</Text>

      <TextInput
        placeholder="Add an item"
        value={item}
        onChangeText={setItem}
        style={styles.input}
      />
      <Button title="Add" onPress={addItem} />

      <FlatList
        data={items}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.item} onPress={() => deleteItem(item.id)}>
            <Text>{item.name}</Text>
            <Text style={styles.delete}>❌</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f9f9f9' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    fontSize: 16,
  },
  item: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  delete: { color: '#ff4444', fontSize: 18 },
});
