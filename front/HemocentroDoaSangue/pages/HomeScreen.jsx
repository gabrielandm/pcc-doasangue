import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, SafeAreaView, StatusBar, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { BottomNavigation, Snackbar, Button } from 'react-native-paper';

import { colors } from '../style/colors';
import { config } from '../config/config';
import CampaignThingy from '../components/CampaignThingy';
import ProfileThingy from '../components/ProfileThingy';

export default function HomeScreen({ navigation, route }) {
	/* Variables and functions */
	const [filters, setFilters] = useState(null);
	const [campaignData, setCampaignData] = useState(null);
	const [profileData, setProfileData] = useState(null);

	/* Snackbar */
	const [visible, setVisible] = React.useState(false);
	const [snackbarText, setSnackbarText] = useState('');
	const onToggleSnackBar = () => setVisible(!visible);
	const onDismissSnackBar = () => setVisible(false);

	function navigateTo(pageName, props) {
		navigation.navigate(pageName, { data: props });
	}

	async function getCampaigns(params, filters) {
		let query = `cnpj=${params.name}&`
		for (const key in filters) {
			query += `${key}=${filters[key]}&`
		}
		if (query === '') {
			query = 'no_filter=true';
		} else {
			query += `no_filter=false`;
		}
		try {
			const response = await fetch(`${config.campaign}?${query}`)
			if (response.status === 200) {
				const json = await response.json();
				setCampaignData(json);
			} else if (response.status !== 200) {
				console.log('Error: ', response.status);
				setSnackbarText('Não foi possível carregar os dados, tente mais tarde.');
				setVisible(true);
			}
		} catch (error) {
			console.log(error);
		}
	}

	async function getProfileData(filter = null, debug = false) {
		if (filter != undefined || !debug) {
			// Get data from MongoDB
			try {
				const response = await fetch(`${config.corp}?type=data&cnpj=${filter.name}`)
				if (response.status === 200) {
					const json = await response.json();
					setProfileData(json['data']);
				} else if (response.status !== 200) {
					console.log('Error: ', response.status);
					setSnackbarText('Não foi possível carregar os dados, tente mais tarde.');
					setVisible(true);
				}
			} catch (error) {
				console.log(error);
			}
		}
		if (debug) {
			// Only for debug
			// Create default user
			setProfileData({
				'cnpj': '000', 'pass': '12345678', 'entry_date': new Date(), 'name': 'Hemocentro Unicamp', 'phone': '+5519998049566', 'city': 'Campinas 2', 'state': 'SP', 'country': 'BR', 'birth_date': new Date(), 'profile_link': null, '_id': '333',
			})
		}
	}

	/* When page loads */
	useEffect(() => {
		console.log('mousse useEffect')
		route.params.created = false;
		getProfileData(route.params);
		getCampaigns(route.params);
	}, []);
	/* When page is focused */
	useFocusEffect(React.useCallback(() => {
		if (route.params.created === true) {
			console.log('mousse useFocusEffect')
			// getProfileData(route.params);
			getCampaigns(route.params);
		}
	}, []));

	/* Views */
	// Definir variável q vai ser uma bool e salva se os dados já foram coletados e só coletar se ainda não foram :)
	const CampaignsView = () =>
		<SafeAreaView style={styles.screen} >
			<ScrollView style={styles.scrollView}>
				{campaignData !== null ? campaignData.map(
					(campaign, index) => <CampaignThingy
						key={index}
						data={campaign}
						navigateTo={(pageName, props) => navigateTo(pageName, props)}
					/>) : <ActivityIndicator size="large" color="#0000ff" />
				}
			</ScrollView>
			<Button style={styles.buttonStyle} onPress={() => navigateTo('CampaignCreationScreen', { cnpj: profileData.cnpj })}>
				<Text style={styles.buttonTextStyle}>+</Text>
			</Button>
			<Snackbar
				visible={visible}
				onDismiss={onDismissSnackBar}
				duration={3000}
			>
				{snackbarText}
			</Snackbar>
		</SafeAreaView>;

	const AchievementView = () =>
		<SafeAreaView style={styles.screen} >
			<ScrollView style={styles.scrollView}>
				<Text>Dashboard</Text>
			</ScrollView>
		</SafeAreaView>;

	const ProfileView = () =>
		<SafeAreaView style={styles.screen} >
			<ScrollView style={styles.scrollView}>
				<ProfileThingy data={profileData} />
			</ScrollView>
		</SafeAreaView>;

	/* View controller */
	const [index, setIndex] = React.useState(0);
	const [routes] = React.useState([
		{ key: 'campaigns', title: 'Campanhas', icon: 'account-heart' },
		{ key: 'achievements', title: 'Relatório', icon: 'chart-donut' },
		{ key: 'profile', title: 'Perfil', icon: 'account-circle' },
	]);
	const renderScene = BottomNavigation.SceneMap({
		campaigns: CampaignsView,
		achievements: AchievementView,
		profile: ProfileView,
	});

	/* Main View */
	return (
		<View style={styles.screen} >
			<BottomNavigation
				navigationState={{ index, routes }}
				onIndexChange={setIndex}
				renderScene={renderScene}
				barStyle={{ backgroundColor: colors.red }}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	screen: {
		flex: 1,
	},
	scrollView: {
		paddingTop: 15,
		paddingBottom: 30,
	},
	container: {
		flex: 15,
		paddingTop: StatusBar.currentHeight,
	},
	bottom: {
		flexBasis: 50,
	},
	buttonStyle: {
		backgroundColor: colors.lightRed,
		width: 60,
		height: 60,
		borderRadius: 60 / 2,
		justifyContent: 'center',
		alignItems: 'center',
		position: 'absolute',
		bottom: 15,
		right: 20,
		// Shadow
    shadowColor: colors.black,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 8,
	},
	buttonTextStyle: {
		color: colors.white,
		fontSize: 26,
		marginTop: 0,
		marginBottom: 10,
		borderWidth: 2,
		borderColor: colors.white,
	},
});
