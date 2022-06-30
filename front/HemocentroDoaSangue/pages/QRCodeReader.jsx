import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Button, Chip, IconButton } from 'react-native-paper';
import { BarCodeScanner } from 'expo-barcode-scanner';

import { colors } from '../style/colors';
import { config } from '../config/config';

export default function QRCodeReader({ navigation, route }) {
  // Route params
  const [cnpj, setCnpj] = useState(route.params.cnpj)
  const [campaignId, setCampaignId] = useState(route.params.campaignId)

  // Necessary variables
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [qrData, setQRData] = useState('Nenhum QR encontrado')
  const [validated, setValidated] = useState(false)
  const [error, setError] = useState(null);

  // Function to read the QR data and validate it
  function validateQRCode() {
    try {
      if (typeof qrData !== typeof {}) {
        setError('QR Code inválido');
        throw new Error('Invalid QR code - Invalid data')
      }
      if (qrData.campaignId !== campaignId) {
        setError('QR Code inválido\nCampanha incorreta\nVerifique se você ou o doador estão na campanha correta');
        throw new Error('Invalid QR code - wrong campaign id')
      }
      setValidated(true)
    } catch (e) {
      console.log(e)
    }
  }

  // Function to register the donation
  async function registerDonation() {
    // Validate user inputs before POST
    const data = {
      user_id: qrData.userId,
      corp_cnpj: cnpj,
      campaign_code: campaignId,
      donation_date: new Date(),
    }
    try {
      const response = await fetch(config.campaign,
        {
          method: 'POST',
          body: JSON.stringify(data),
        }
      )
      if (response.status == 201) {
        navigation.navigate({
          name: 'HomeScreen',
          params: {
            created: true,
            name: route.params.data.cnpj,
            message: 'Campanha registrada com sucesso'
          },
          merge: true
        });
      } else if (response.status == 400) {
        setError('Doação já foi registrada');
        setValidated(false);
        throw new Error('Donation already made');
      } else {
        setError('Um erro selvagem apareceu!');
        setValidated(false);
        throw new Error('Error registering donation');
      }
    } catch (e) {
      console.log(e);
    }
  }

  // Function that asks for camera permission
  function askForCameraPermission() {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })()
  }

  // Request Camera Permission
  useEffect(() => {
    askForCameraPermission();
  }, []);

  // What happens when we scan the bar code
  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    try {
      setQRData(JSON.parse(data));
    } catch (e) {
      setError('QR Code inválido');
      setValidated(false);
    }
    validateQRCode();
    // console.log('Type: ' + type + '\nData: ' + data)
  };

  // Check permissions and return the screens
  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text>Solicitando permissão para acessar a camera...</Text>
      </View>)
  }
  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={{ margin: 10 }}>{'Acesso a camera negado :('}</Text>
        <Button onPress={() => askForCameraPermission()} icon="camera">Acessar camera</Button>
      </View>)
  }

  // Return the View
  return (
    <View style={styles.container}>
      <View style={styles.barcodebox}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={{ height: 400, width: 400 }} />
      </View>
      <Text style={styles.maintext}>{validated ? 'QR Code lido com sucesso!' : (scanned ? error : 'Leia o QR Code')}</Text>

      {validated ?
        <Button onPress={() => registerDonation()} icon="pencil-plus">Registrar doação</Button> :
        (scanned ?
          <Button onPress={() => setScanned(false)} icon="qrcode-scan" >Ler QR Code novamente</Button> :
          null
        )
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  maintext: {
    fontSize: 16,
    margin: 20,
  },
  barcodebox: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 300,
    width: 300,
    overflow: 'hidden',
    borderRadius: 30,
    backgroundColor: 'tomato'
  }
});
