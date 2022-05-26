import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Button, Snackbar } from 'react-native-paper';

import SmallTextInput from '../components/SmallTextInput';

import { colors } from '../style/colors';

export default function PasswordSendEmail({ navigation, route }) {
  const [nameMain, setNameMain] = useState(route.params.name);
  const [nameWrong, setNameWrong] = useState('');
  const [invalidUserMessage, setInvalidUserMessage] = useState('');
  
  // Snackbar stuff
  const [visible, setVisible] = React.useState(false);
  const onToggleSnackBar = () => setVisible(!visible);
  const onDismissSnackBar = () => setVisible(false);

  user = {
    email: 'email@mousse.com',
    pass: 'pass123',
  }

  function validateRegistration() {
    let valid = true;
    const errorMessages = [];

    // Email validation using regex
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailRegex.test(nameMain)) {
      setNameWrong(true);
      valid = false;
      errorMessages.push('E-mail inválido');
    } else {
      setNameWrong(false);
    }

    return {
      'valid': valid,
      'errorMessages': errorMessages
    };
  }

  function sendEmail() {
    // Check email availability and password validation
    const validateRegistrationValues = validateRegistration();
    const valid = validateRegistrationValues.valid;
    const errorMessages = validateRegistrationValues.errorMessages;
    if (!valid) {
      setInvalidUserMessage(errorMessages.join('\n'));
      onToggleSnackBar();
      return;
    }
    // Send email
    
    // After sending email, go to login screen
    route.params.updateCheckedReason(false);
    navigation.navigate('LoginScreen', {
      reason: 'passChangeRequest',
    });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Insira seu e-mail!</Text>
      <Text style={styles.subHeader}>Uma mensagem será enviada ao seu e-mail com os passos para trocar de senha.</Text>

      <SmallTextInput label={'Usuário'} value={nameMain} isPassword={false} updateVar={(text) => setNameMain(text)} style={styles.textInput} invalidInput={nameWrong} />

      <View style={styles.secView}>
        <Button mode="text" color={colors.lightRed} onPress={() => sendEmail()} style={styles.buttonBig}>Enviar e-mail</Button>
      </View>

      <Snackbar
        visible={visible}
        onDismiss={onDismissSnackBar}
        duration={2500}
      >
        {invalidUserMessage}
      </Snackbar>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    justifyContent: 'center',
  },
  secView: {
    alignItems: 'center',
    // justifyContent: 'center',
    textAlign: 'center',
    marginTop: 50,
  },
  buttonBig: {
    marginTop: 10,
    width: 300,
  },
  buttonSmall: {
    marginTop: 10,
    width: 100,
  },
  header: {
    textAlign: 'center',
    fontSize: 28,
    fontWeight: 'bold',
  },
  subHeader: {
    textAlign: 'center',
    fontSize: 18,
    marginBottom: 50,
    width: '75%',
    marginLeft: 'auto',
    marginRight: 'auto',
    // fontWeight: 'bold',
  },
  textInput: {
    width: 300,
    alignSelf: 'center',
  }
});
