import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from "react-native";
import * as Location from 'expo-location';

import { colors } from '../style/colors';

export default function SelectLocationScreen(route) {
  /* Geolocation */
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
}
