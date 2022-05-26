import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Button, Snackbar } from 'react-native-paper';

import SmallTextInput from '../components/SmallTextInput';

import { colors } from '../style/colors';

export default function RegistrationScreen({ navigation }) {
  const [nameMain, setNameMain] = useState('');
  const [passMain, setPassMain] = useState('');
  const [nameWrong, setNameWrong] = useState(false);
  const [passWrong, setPassWrong] = useState(false);
  const [invalidUserMessage, setInvalidUserMessage] = useState('');

  const [visible, setVisible] = React.useState(false);
  const onToggleSnackBar = () => setVisible(!visible);
  const onDismissSnackBar = () => setVisible(false);

  async function createAccount() {
    // Check email availability and password validation
    const validateRegistrationValues = {
      valid: true,
      errorMessages: ['Não foi possível registrar a conta'],
    }
    setInvalidUserMessage('');
    let createUserResult = {
      created: undefined,
      message: undefined,
      code: undefined,
    }

    // Email validation
    if (nameMain != user.email) {
      setNameWrong(false);
    } else {
      setNameWrong(true);
      validateRegistrationValues.valid = false;
      validateRegistrationValues.errorMessages.push('- Email já cadastrado');
    }

    // Password validation
    if (passMain.length >= 8) {
      setPassWrong(false);
    } else {
      setPassWrong(true);
      validateRegistrationValues.valid = false;
      validateRegistrationValues.errorMessages.push('- Senha deve ter no mínimo 8 caracteres');
    }

    if (validateRegistrationValues.valid) {
      try {
        var response = await fetch(
          `https://doasangue.azurewebsites.net/api/user?email=${nameMain}&type=check`,
          {
            method: 'GET',
          }
        );
        var json = await response.json();

        if (json.exist === false) {
          var response = await fetch(
            `https://doasangue.azurewebsites.net/api/user`,
            {
              method: 'POST',
              body: JSON.stringify({
                "email": nameMain,
                "pass": passMain,
              }),
            });
          console.log(response);
          createUserResult = {
            created: true,
            message: 'Usuário criado com sucesso!',
            code: 201,
          };
        } else {
          createUserResult = {
            created: false,
            message: '- Usuário já existe',
            code: 400,
          };
        }
      } catch (error) {
        createUserResult = {
          created: false,
          message: '- Erro ao criar usuário, tente novamente mais tarde',
          code: 500,
        };
      }
      if (createUserResult.code === 201) {
        navigation.navigate('LoginScreen',
          {
            reason: 'userCreated',
          });
      } else {
        if (createUserResult.code === 400) {
          setNameWrong(true);
        }
        validateRegistrationValues.errorMessages.push(createUserResult.message);
        validateRegistrationValues.valid = false;
      }
    }
    if (!validateRegistrationValues.valid) {
      setInvalidUserMessage(validateRegistrationValues.errorMessages.join('\n'));
      onToggleSnackBar();
      return;
    } 
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Crie sua conta!</Text>

      <SmallTextInput label={'Usuário'} isPassword={false} updateVar={(text) => setNameMain(text)} style={styles.textInput} invalidInput={nameWrong} />
      <SmallTextInput label={'Senha'} isPassword={true} updateVar={(text) => setPassMain(text)} style={styles.textInput} invalidInput={passWrong} />

      <View style={styles.secView}>
        <Button mode="text" color={colors.lightRed} onPress={() => createAccount()} style={styles.buttonBig}>Criar conta</Button>

        <Button mode="text" color={colors.lightRed} onPress={() => navigation.navigate('LoginScreen')} style={styles.buttonBig}>Já possuo uma conta</Button>
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
    // fontWeight: 'bold',
  },
  textInput: {
    width: 300,
    alignSelf: 'center',
  }
});
