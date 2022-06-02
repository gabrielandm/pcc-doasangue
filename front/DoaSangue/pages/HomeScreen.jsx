import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, SafeAreaView, StatusBar, ActivityIndicator } from 'react-native';
import { BottomNavigation, Snackbar } from 'react-native-paper';

import { colors } from '../style/colors';
import { config } from '../config/config';
import CampaignThingy from '../components/CampaignThingy';
import ProfileThingy from '../components/ProfileThingy';
import AchievementThingy from '../components/AchievementThingy';

const m_campaigns = [
	{
		"name": "Camapnha Doa Mais",
		"cnpj": '34.876.876/0001-00',
		"start_date": '2022-06-12T15:33:33.000000-03:00',
		"end_date": '2023-06-12T15:33:33.000-03:00',
		"open_time": "3:33",
		"close_time": "15:33",
		"country": 'BR',
		"state": 'PE',
		"city": 'Xvs',
		"address": 'R. do Alfinetes, 33',
		"coordinates": {
			"latitude": -7.033889,
			"longitude": -39.408889,
		},
		"phone": '(33) 3333-3333',
		"creation_date": '2022-12-06 15:33:33.000-03:00',
		"num_doners": 12,
		"campaign_rating": 5,
		"observation": 'Estamos recebendo qualquer tipo de sangue, porém os mais importantes são os que foram listados abaixo.',
		"blood_types": ['A+', 'AB+', 'O'],
		"header_color": '#F0D',
		"banner_link": 'www.mousse.com',
	},
	{
		"name": "Camapnha Doa Mais 33",
		"cnpj": '34.876.876/0001-00',
		"start_date": '2022-06-12T15:33:33.000-03:00',
		"end_date": '2023-06-12T15:33:33.000-03:00',
		"open_time": "3:33",
		"close_time": "15:33",
		"country": 'BR',
		"state": 'PE',
		"city": 'Xvs',
		"address": 'R. do Alfinetes, 33',
		"coordinates": {
			"latitude": -8.05,
			"longitude": -34.05
		},
		"phone": '(33) 3333-3333',
		"creation_date": '2022-12-06 15:33:33.000-03:00',
		"num_doners": 12,
		"campaign_rating": 5,
		"observation": 'Estamos recebendo qualquer tipo de sangue, porém os mais importantes são os que foram listados abaixo.',
		"blood_types": ['A+', 'AB+', 'O'],
		"header_color": '#F0D',
		"banner_link": 'www.mousse.com'
	},
]

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

	async function getCampaigns() {
		let query = ''
		for (const key in filters) {
			query += `${key}=${filters[key]}&`
		}
		if (query === '') {
			query = 'no_filter=true';
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
				const response = await fetch(`${config.user}?type=data&email=${filter.name}`)
				if (response.status === 200) {
					const json = await response.json();
					// console.log(json)
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
				'email': 'mousseuwu', 'pass': '12345678', 'validates': 1, 'entry_date': new Date(), 'name': 'Mousse Hardcoded', 'last_name': 'de Chocolate', 'phone': '+5519998049566', 'blood_type': 'O+', 'last_donation': new Date(), 'city': 'Mistério 2', 'state': 'PE', 'country': 'BR', 'gender': 0, 'birth_date': new Date(), 'profile_link': null, '_id': '333',
			})
		}
		console.log(profileData)
	}

	/* When page loads */
	useEffect(() => {
		// getProfileData(route.params);
		// getCampaigns();
	}, []);

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
				<View style={styles.row}>
					<AchievementThingy />
					<AchievementThingy />
					<AchievementThingy />
				</View>
				<View style={styles.row}>
					<AchievementThingy />
					<AchievementThingy />
				</View>
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
		{ key: 'achievements', title: 'Conquistas', icon: 'trophy' },
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
	row: {
		flexDirection: 'row',
		justifyContent: 'space-around',
	},
});
