import { StackActions } from '@react-navigation/native';
import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Button, Snackbar } from 'react-native-paper';

import SmallTextInput from '../components/SmallTextInput';

import { colors } from '../style/colors';

export default function LoginScreen({ navigation, route }) {
	const [nameMain, setNameMain] = useState('');
	const [passMain, setPassMain] = useState('');
	const [passWrong, setPassWrong] = useState(false);
	const [snackbarText, setSnackbarText] = useState('');
	const [checkedReaseon, setCheckedReaseon] = useState(route.params.checkedReaseon);

	// Snackbar stuff
	const [visible, setVisible] = React.useState(false);
	const onToggleSnackBar = () => setVisible(!visible);
	const onDismissSnackBar = () => setVisible(false);

	user = {
		email: 'email@mousse.com',
		pass: 'pass123',
	}

	function reasonCheck() {
		setCheckedReaseon(true)
		console.log(route.params)
		if (route.params != undefined) {
			if (route.params.reason == 'passChangeRequest') {
				setSnackbarText('Verifique seu e-mail, troque a senha e tente novamente');
				setVisible(true);
			}
			else if (route.params.reason == 'userCreated') {
				setSnackbarText('Conta criada com sucesso, tente fazer o log-in :)');
				setVisible(true);
			}
		}
		return null;
	}

	async function validateUser() {
		// email and password validation
		try {
		var response = await fetch(`https://doasangue.azurewebsites.net/api/user?email=${nameMain}&pass=${passMain}&type=login`)
		var json = await response.json();
		console.log(json);
		} catch (error) {
			console.log(error);
			return null;
		}
		// If value exists
		if (json.status === 'success') {
			navigation.dispatch(
				StackActions.replace('HomeScreen', {
					name: `${nameMain}`,
				})
			)
		} else if (json.status === 'fail') {
			setSnackbarText(json.message);
			setVisible(true);
			setPassWrong(true);
		}
		// Else Doesn't exist
		else if (json.exist == false) {
			setSnackbarText('Usuário não existe');
			setVisible(true);
			setNameWrong(true);
		} else {
			setSnackbarText('Erro desconhecido O_O');
			setVisible(true);
		}
	}

	return (
		<View style={styles.container}>
			{!checkedReaseon ? reasonCheck() : null}
			<Text style={styles.header}>Bem vindo(a)!</Text>
			<Text style={styles.subHeader}>Entre na sua conta</Text>

			<SmallTextInput label={'Usuário'} isPassword={false} updateVar={(text) => setNameMain(text)} style={styles.textInput} invalidInput={passWrong} />
			<SmallTextInput label={'Senha'} isPassword={true} updateVar={(text) => setPassMain(text)} style={styles.textInput} invalidInput={passWrong} />

			<View style={styles.secView}>
				{!passWrong ? null : <Text>Email ou senha incorretos</Text>}

				<Button mode="text" color={colors.lightRed} onPress={() => navigation.navigate('PasswordSendEmail', { name: nameMain, updateCheckedReason: () => setCheckedReaseon() })} style={styles.buttonBig}>Esqueci a senha</Button>

				<Button mode="text" color={colors.lightRed} onPress={() => navigation.navigate('RegistrationScreen')} style={styles.buttonBig}>Registrar</Button>

				<Button mode="contained" color={colors.red} onPress={() => validateUser()} style={styles.buttonSmall}>Log in</Button>
			</View>

			<Snackbar
				visible={visible}
				onDismiss={onDismissSnackBar}
				duration={2500}
			>
				{snackbarText}
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
		width: 175,
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
