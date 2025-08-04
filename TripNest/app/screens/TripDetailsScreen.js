// app/screens/TripDetailsScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { auth, db } from '../../firebase/config';
import { doc, updateDoc } from 'firebase/firestore';
import WeatherCard from '../components/WeatherCard';

export default function TripDetailsScreen({ route, navigation }) {
  const { trip } = route.params;
  const [destination, setDestination] = useState(trip.destination);
  const [startDate, setStartDate] = useState(trip.startDate);
  const [endDate, setEndDate] = useState(trip.endDate);
  const [notes, setNotes] = useState(trip.notes);

  const handleUpdate = async () => {
    const user = auth.currentUser;
    const tripRef = doc(db, 'users', user.uid, 'trips', trip.id);
    try {
      await updateDoc(tripRef, {
        destination,
        startDate,
        endDate,
        notes,
      });
      navigation.goBack();
    } catch (err) {
      alert('Error updating trip: ' + err.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Destination</Text>
      <TextInput
        value={destination}
        onChangeText={setDestination}
        placeholder="Enter city or place"
        style={styles.input}
      />

      <Text style={styles.label}>Start Date</Text>
      <TextInput
        value={startDate}
        onChangeText={setStartDate}
        placeholder="YYYY-MM-DD"
        style={styles.input}
      />

      <Text style={styles.label}>End Date</Text>
      <TextInput
        value={endDate}
        onChangeText={setEndDate}
        placeholder="YYYY-MM-DD"
        style={styles.input}
      />

      <Text style={styles.label}>Notes</Text>
      <TextInput
        value={notes}
        onChangeText={setNotes}
        multiline
        numberOfLines={4}
        placeholder="Extra details about your trip"
        style={styles.textArea}
      />

      <Button title="Update Trip" onPress={handleUpdate} />

      <View style={{ marginVertical: 20 }}>
        <Button
          title="Open Checklist"
          onPress={() => navigation.navigate('Checklist', { tripId: trip.id })}
        />
      </View>

      {destination && (
        <View style={{ marginTop: 20 }}>
          <Text style={styles.weatherTitle}>Weather in {destination}</Text>
          <WeatherCard city={destination} />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    height: 100,
    backgroundColor: '#fff',
    textAlignVertical: 'top',
  },
  weatherTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});
