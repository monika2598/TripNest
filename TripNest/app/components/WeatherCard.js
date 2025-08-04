// app/components/WeatherCard.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

export default function WeatherCard({ city }) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_KEY = 'c2e9af76b1c49f98954ecd23bbc94510'; 

  const fetchWeather = async () => {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      const data = await res.json();
      setWeather(data);
    } catch (err) {
      console.error('Weather error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (city) fetchWeather();
  }, [city]);

  if (loading) return <ActivityIndicator size="small" color="#4e91fc" />;

  if (!weather || weather.cod !== 200)
    return <Text style={styles.error}>No weather data for {city}</Text>;

  return (
    <View style={styles.card}>
      <Text style={styles.city}>{weather.name}</Text>
      <Text style={styles.temp}>{weather.main.temp.toFixed(1)}°C</Text>
      <Text style={styles.desc}>{weather.weather[0].description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#4e91fc',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  city: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  temp: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '600',
    marginVertical: 4,
  },
  desc: {
    color: '#fff',
    fontSize: 16,
    textTransform: 'capitalize',
  },
  error: {
    color: '#888',
    fontSize: 14,
    marginTop: 10,
  },
});
