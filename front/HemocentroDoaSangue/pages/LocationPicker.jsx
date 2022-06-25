import React, { useState } from 'react';
import LocationView from "react-native-location-view";
import { View, ActivityIndicator } from "react-native";
import * as Location from 'expo-location';

import { colors } from '../../DoaSangue/style/colors';

export default function SelectLocationScreen({ navigation, route }) {
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
      {location !== null ?
      (<LocationView
        /* Adicionar uma chave de api para o Google maps
          doc: https://www.npmjs.com/package/react-native-location-view
          google: https://developers.google.com/maps/documentation/places/web-service/overview
        */
        apiKey={"MY_GOOGLE_API_KEY"}
        initialLocation={{
          latitude: location !== undefined ? location['coords']['latitude'] : 0,
          longitude: location !== undefined ? location['coords']['longitude'] : 0,
        }}
        markerColor={colors.red}
      />) :
      (<ActivityIndicator size="large" color="#0000ff" />)
    }

    </View>
  );
}
