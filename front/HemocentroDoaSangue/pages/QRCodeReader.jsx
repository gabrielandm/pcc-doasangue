import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
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
  const [statusInfo, setStatusInfo] = useState('');

  // Function to read the QR data and validate it
  function validateQRCode() {
    try {
      if (typeof qrData !== typeof {}) {
        setError('QR Code inválido');
        return('QR Code inválido');
      }
      if (qrData.campaignId !== campaignId) {
        setError('QR Code inválido\n\nCampanha incorreta\n\nVerifique se você ou o doador estão na campanha correta');
        return('Invalid QR code - wrong campaign id');
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
      doner_id: qrData.userId,
      corp_cnpj: cnpj,
      campaign_id: campaignId,
      donation_date: new Date(),
    }
      try {
      const response = await fetch(config.donation,
        {
          method: 'POST',
          body: JSON.stringify(data),
        }
      )
      if (response.status == 201) {
        setError('A doação foi salva com sucesso!');
        // navigation.navigate({
        //   name: 'HomeScreen',
        //   params: {
        //     created: true,
        //     name: route.params.data.cnpj,
        //     message: 'Campanha registrada com sucesso'
        //   },
        //   merge: true
        // });
        setStatusInfo("REGISTER ACHIEVEMENT");
        console.log('201')
      } else if (response.status == 400) {
        setError('QR Code inválido, verifique:\n\n - Se você ou o doador estão na mesma campanha correta.\n - Se o passo anterior não der certo, tente novamente.');
        setValidated(false);
        console.log('400 - Error registering donation');
      } else {
        setError('Um erro selvagem apareceu!');
        setValidated(false);
        console.log('500 - Error registering donation');
      }
    } catch (e) {
      console.log(e);
    }
  }

  async function registerAchievement() {
    const data = {
      type: "achievement",
      userId: qrData.userId,
      achievementId: '63737809cafa9d2bd737a15b',
      increment: 1,
    }
      try {
      const response = await fetch(config.user,
        {
          method: 'POST',
          body: JSON.stringify(data),
        }
      )
      if (response.status == 200) {
        setError('Conquista atualizada com sucesso');
        // navigation.navigate({
        //   name: 'HomeScreen',
        //   params: {
        //     created: true,
        //     name: route.params.data.cnpj,
        //     message: 'Campanha registrada com sucesso'
        //   },
        //   merge: true
        // });
        console.log('200')
      } else if (response.status == 400) {
        setError('QR Code inválido, verifique:\n\n - Se você ou o doador estão na mesma campanha correta.\n - Se o passo anterior não der certo, tente novamente.');
        setValidated(false);
        console.log('400 - Error registering donation');
      } else {
        setError('Um erro selvagem apareceu!');
        setValidated(false);
        console.log('500 - Error registering donation');
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

  // Status based conditions
  useEffect(() => {
    if (statusInfo === 'REGISTER ACHIEVEMENT') {
      registerAchievement();
    }
  }, [statusInfo]);

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
