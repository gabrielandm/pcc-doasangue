import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, SafeAreaView, Dimensions, Linking, TouchableOpacity } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Button, Chip, IconButton } from 'react-native-paper';
import MapView, { Marker } from 'react-native-maps';

import { colors } from '../style/colors';

export default function CampaignScreen({ navigation, route }) {
  const [data, setData] = useState(JSON.parse(route.params.data));
  const [loaded, setLoaded] = useState(false);
  const options = { year: '2-digit', month: '2-digit', day: '2-digit' };
  const [mapsURL, setMapsURL] = useState(null)

  // Run when page loads
  useEffect(() => {
    setData({
      ...data,
      start_date: new Date(data.start_date),
      end_date: new Date(data.end_date),
      observation: `\t${data.observation.replace('\t', '').replace("\n", "\n\t")}`,
    })
    setMapsURL(`http://www.google.com/maps/place/${data.coordinates.latitude},${data.coordinates.longitude}`)
    setLoaded(true);
  }, [])

  // Function to go to the corresponding report page
  function goReportScreen() {
    navigation.navigate({
      name: 'CampaignReportScreen',
      params: {
        data: JSON.stringify(data)
      },
    });
  }

  // Function to go to the edit campaign page
  function goEditCampaign() {
    navigation.navigate({
      name: 'EditCampaignScreen',
      params: {
        data: JSON.stringify(data)
      },
    });
  }

  // Function to go to the QR Reader screen
  function goReadQRCode() {
    navigation.navigate({
      name: 'QRCodeReader',
      params: {
        cnpj: data.cnpj,
        campaignId: data._id,
      },
    });
  }

  // Function to go to Google Maps URL
  function VisitMaps(url) {
    Linking.openURL(url)
  }

  // Function to copy address
  function copyToClipboard() {
    Clipboard.setString(data.address);
  }

  return (
    <SafeAreaView style={styles.screen} >
      <ScrollView style={styles.screen} >
        {loaded === true ?
          <View style={styles.column} >
            <View style={styles.row} >
              {/* Name, Duration, working time */}
              <View style={styles.column} >
                <Text style={styles.title}>{data.name}</Text>

                <Text style={styles.dataText}>Duração da campanha</Text>
                <Text style={styles.text}>{data.start_date.toLocaleDateString("pt-BR", options)} - {data.end_date.toLocaleDateString("pt-BR", options)}</Text>

                <Text style={styles.dataText}>Horário de funcionamento</Text>
                <Text style={styles.text}>{data.open_time} - {data.close_time}</Text>
              </View>
            </View>
            {/* Map */}
            <View style={styles.rowCenter} >
              <View style={styles.columnCenter} >

                <MapView style={styles.map}
                  initialRegion={{
                    latitude: data.coordinates.latitude,
                    longitude: data.coordinates.longitude,
                    latitudeDelta: 0.04,
                    longitudeDelta: 0.04,
                  }}
                >
                  <Marker
                    key={0}
                    coordinate={data.coordinates}
                    title={data.name}
                    description={data.address}
                  />
                </MapView>
                <View style={styles.rowCenter} >
                  <Text style={styles.dataText}>Endereço: </Text>
                  <Text style={{ textAlign: 'center', color: colors.gray }}>{data.address}</Text>
                  <IconButton style={styles.iconButton} icon="content-copy" size={16} onPress={() => copyToClipboard()} />
                </View>
                <Button mode="text" icon="google-maps" color={colors.lightRed} onPress={() => VisitMaps(mapsURL)} >Abrir no Google Maps</Button>
              </View>
            </View>
            {/* Observation */}
            <View style={styles.row} >
              <View style={styles.column} >
                <Text style={styles.dataText}>Observações</Text>
                <Text style={styles.text}>{data.observation}</Text>
              </View>
            </View>
            {/* Blood type */}
            <View style={styles.rowCenter}>
              <Text style={styles.dataText}>Tipos sanguineos:</Text>
              {data.blood_types.map((blood_type, index) => <Chip key={index} style={styles.chip}>{blood_type}</Chip>)}
            </View>

            {/* Report screen */}
            <View style={{ ...styles.rowCenter, height: 50 }}>
              <Button onPress={() => goReportScreen()} mode="outlined" color={colors.red} icon="chart-line" >
                Relatório
              </Button>
            </View>
            {/* QRCode Reader button */}
            <View style={{ ...styles.rowCenter, height: 50 }}>
              <Button onPress={() => goReadQRCode()} mode="outlined" color={colors.blue} icon="qrcode" >
                Ler QR Code
              </Button>
            </View>
            {/* Delete button */}
            <View style={{ ...styles.rowCenter, height: 50 }}>
              <Button onPress={() => goEditCampaign()} mode="outlined" color={colors.red} icon="pencil" >
                Editar
              </Button>
            </View>

            <View style={styles.lastRow}></View>

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
  lastRow: {
    height: 100,
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
  iconButton: {
    margin: 0,
  },
});
