// app/screens/HomeScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Button,
  StyleSheet,
  Alert,
} from 'react-native';
import { auth, db } from '../../firebase/config';
import { signOut } from 'firebase/auth';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { useIsFocused } from '@react-navigation/native';

export default function HomeScreen({ navigation }) {
  const [trips, setTrips] = useState([]);
  const isFocused = useIsFocused();

  const fetchTrips = async () => {
    const user = auth.currentUser;
    const tripsRef = collection(db, 'users', user.uid, 'trips');
    const querySnapshot = await getDocs(tripsRef);
    const tripsList = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setTrips(tripsList);
  };

  const deleteTrip = async (tripId) => {
    Alert.alert('Delete Trip', 'Are you sure you want to delete this trip?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        onPress: async () => {
          const user = auth.currentUser;
          await deleteDoc(doc(db, 'users', user.uid, 'trips', tripId));
          fetchTrips();
        },
      },
    ]);
  };

  useEffect(() => {
    if (isFocused) fetchTrips();
  }, [isFocused]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Trips</Text>

      <FlatList
        data={trips}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('TripDetails', { trip: item })}
          >
            <Text style={styles.title}>{item.destination}</Text>
            <Text style={styles.dates}>{item.startDate} - {item.endDate}</Text>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => deleteTrip(item.id)}
            >
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddTrip')}>
        <Text style={styles.addButtonText}>+ Add New Trip</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => signOut(auth)}>
        <Text style={styles.logout}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9', padding: 20 },
  header: { fontSize: 28, fontWeight: 'bold', marginBottom: 20 },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  title: { fontSize: 18, fontWeight: '600', marginBottom: 4 },
  dates: { color: '#555', marginBottom: 8 },
  deleteButton: { alignSelf: 'flex-end' },
  deleteText: { color: '#ff4444', fontSize: 14 },
  addButton: {
    backgroundColor: '#4e91fc',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  logout: {
    textAlign: 'center',
    marginTop: 16,
    color: '#999',
    fontSize: 14,
  },
});
