import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, SafeAreaView, Dimensions, Linking, TouchableOpacity } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Button, Chip, IconButton } from 'react-native-paper';
import MapView, { Marker } from 'react-native-maps';
import QRCode from 'react-native-qrcode-svg';

import { colors } from '../style/colors';

export default function CampaignScreen({ navigation, route }) {
  const [data, setData] = useState(JSON.parse(route.params.data.data));
  const [loaded, setLoaded] = useState(false);
  const [qrGenerated, setQrGenerated] = useState(false);
  const [qrCodeData, setQrCodeData] = useState('');
  const options = { year: '2-digit', month: '2-digit', day: '2-digit' };
  const mapsURL = `http://www.google.com/maps/place/${data.coordinates.latitude},${data.coordinates.longitude}`

  useEffect(() => {
    setData({
      ...data,
      start_date: new Date(data.start_date),
      end_date: new Date(data.end_date),
      observation: `\t${data.observation.replace('\t', '').replace("\n", "\n\t")}`,
    })
    setLoaded(true);
    console.log(route.params.data.location)
  }, [])

  function VisitMaps(url) {
    Linking.openURL(url)
  }

  function copyToClipboard() {
    Clipboard.setString(data.address);
  }

  function generateQR() {
    const objectData = {
      'campaignId': data._id,
      'userId': route.params.data.userId,
    }
    setQrCodeData(JSON.stringify(objectData));
    setQrGenerated(true);
  }

  return (
    <SafeAreaView style={styles.screen} >
      <ScrollView style={styles.screen} >
        {loaded ?
          <View style={styles.column} >
            <View style={styles.row} >
              <View style={styles.column} >
                <Text style={styles.title}>{data.name}</Text>

                <Text style={styles.dataText}>Duração da campanha</Text>
                <Text style={styles.text}>{data.start_date.toLocaleDateString("pt-BR", options)} - {data.end_date.toLocaleDateString("pt-BR", options)}</Text>
                <Text style={styles.dataText}>Horário de funcionamento</Text>
                <Text style={styles.text}>{data.open_time} - {data.close_time}</Text>
              </View>
            </View>

            <View style={styles.rowCenter} >
              <View style={styles.columnCenter} >

                <MapView style={styles.map}
                  initialRegion={{
                    latitude: (data.coordinates.latitude + route.params.data.location['coords']['latitude']) / 2,
                    longitude: (data.coordinates.longitude + route.params.data.location['coords']['longitude']) / 2,
                    latitudeDelta: Math.abs(data.coordinates.latitude - route.params.data.location['coords']['latitude'])*1.33,
                    longitudeDelta: Math.abs(data.coordinates.longitude - route.params.data.location['coords']['longitude'])*1.33,
                  }}
                >
                  <Marker
                    key={0}
                    coordinate={data.coordinates}
                    title={data.name}
                    description={data.address}
                    pinColor={colors.red}
                  />
                  {route.params.data.location !== null ?
                    <Marker
                      key={1}
                      coordinate={{
                        latitude: route.params.data.location['coords']['latitude'],
                        longitude: route.params.data.location['coords']['longitude']}}
                      title={'Você está aqui'}
                      description={'Endereço atual'}
                      pinColor={colors.blue}
                    />
                    : null}
                </MapView>
                <View style={styles.rowCenter} >
                  <Text style={styles.dataText}>Endereço: </Text>
                  <Text style={{ textAlign: 'center', color: colors.gray }}>{data.address}</Text>
                  <IconButton style={styles.iconButton} icon="content-copy" size={16} onPress={() => copyToClipboard()} />
                </View>
                {route.params.data.distance !== null ?
                  <View style={styles.rowCenter} >
                    <Text style={styles.dataText}>Distância: </Text>
                    <Text style={{ textAlign: 'center', color: colors.gray }}>{route.params.data.distance} Km</Text>
                  </View> : null
                }
                <Button mode="text" icon="google-maps" color={colors.lightRed} onPress={() => VisitMaps(mapsURL)} >Abrir no Google Maps</Button>
              </View>
            </View>

            <View style={styles.row} >
              <View style={styles.column} >
                <Text style={styles.dataText}>Observações</Text>
                <Text style={styles.text}>{data.observation}</Text>
              </View>
            </View>

            <View style={styles.rowCenter}>
              <Text style={styles.dataText}>Tipos sanguineos:</Text>
              {data.blood_types.map((blood_type, index) => <Chip key={`bloodType${index}`} style={styles.chip}>{blood_type}</Chip>)}
            </View>

            <View style={styles.column}>
              <Text style={styles.textCenter}>Para registrar sua doação, aperte o botão e mostre para o responsável da campanha atual.</Text>
              <View style={styles.rowCenter} >
                <Button
                  icon='qrcode'
                  mode='outlined'
                  color={colors.blue}
                  onPress={() => generateQR()}
                >Gerar QR Code</Button>
              </View>
            </View>

            {qrGenerated ?
              (<View style={styles.rowCenterQR} >
                <QRCode
                  value={qrCodeData}
                  size={250}
                  color={colors.red}
                  backgroundColor={colors.white}
                />
              </View>) : null
            }

            <View style={styles.lasRow}>
            </View>

          </View> : null
        }
      </ScrollView >
    </SafeAreaView >
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.white,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  column: {
    flexDirection: 'column',
  },
  columnCenter: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  row: {
    flexDirection: 'row',
    paddingLeft: 20,
    flexWrap: 'wrap',
  },
  rowCenter: {
    width: Dimensions.get('window').width * 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  rowCenterQR: {
    width: Dimensions.get('window').width * 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 33,
    marginBottom: 33,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 3,
  },
  map: {
    borderWidth: 1,
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
  textCenter: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 3,
    marginLeft: 45,
    marginRight: 45,

  },
  iconButton: {
    margin: 0,
  },
  lasRow: {
    marginBottom: 20,
    height: 133,
  },
});
