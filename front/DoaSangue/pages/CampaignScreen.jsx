import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, SafeAreaView, Dimensions, Linking } from 'react-native';
import { Button, Chip, Avatar } from 'react-native-paper';
import MapView, { Marker } from 'react-native-maps';

import { colors } from '../style/colors';

export default function CampaignScreen({ navigation, route }) {
  const data = route.params.data
  // data.observation.replaceAll("\n", "\n\t")
  const options = { year: '2-digit', month: '2-digit', day: '2-digit' };
  const mapsURL = `http://www.google.com/maps/place/${data.coordinates.latitude},${data.coordinates.longitude}`

  function VisitMaps(url) {
    Linking.openURL(url)
  }

  return (
    <SafeAreaView style={styles.screen} >
      <ScrollView style={styles.screen} >

        <View style={styles.column} >
          <View style={styles.row} >
            <View style={styles.column} >
              <Text style={styles.title}>{data.name}</Text>
            </View>
            <View style={styles.column} >
              
              <Text style={styles.dataText}>Duração da campanha</Text>
              <Text style={styles.text}>{data.start_date.toLocaleDateString("pt-BR", options)} - {data.end_date.toLocaleDateString("pt-BR", options)}</Text>
              <Text style={styles.dataText}>Horário de funcionamento</Text>
              <Text style={styles.text}>({data.open_time} - {data.close_time})</Text>
            </View>
          </View>

          <View style={styles.rowCenter} >
            <View style={styles.column} >
              <MapView style={styles.map}
                initialRegion={{
                  latitude: data.coordinates.latitude,
                  longitude: data.coordinates.longitude,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}
              >
                <Marker
                  key={0}
                  coordinate={data.coordinates}
                  title={data.name}
                  description={data.address}
                />
              </MapView>
              <Button mode="text" icon="google-maps" color={colors.lightRed} onPress={() => VisitMaps(mapsURL)} >Abrir no Google Maps</Button>
            </View>
          </View>

          <View style={styles.row} >
            <Text style={styles.text}>{data.observation}</Text>
          </View>

          <View style={styles.rowCenter}>
            <Text style={styles.dataText}>Tipos sanguineos:</Text>
            {data.blood_types.map((blood_type, index) => <Chip key={index} style={styles.chip}>{blood_type}</Chip>)}
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.white,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    // justifyContent: 'center',
  },
  column: {
    flexDirection: 'column',
    flexWrap: 'wrap',
  },
  row: {
    flexDirection: 'row',
    paddingLeft: 20,
    flexWrap: 'wrap',
  },
  rowCenter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 3,
  },
  map: {
    margin: 'auto',
    marginTop: 10,
    width: Dimensions.get('window').width * 0.9,
    height: 333,
  },
  chip: {
    marginTop: 5,
    marginLeft: 5,
  },
  dataText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 3,
  },
  text: {
    fontSize: 14,
    marginTop: 2,
    lineHeight: 20,
  },
});
