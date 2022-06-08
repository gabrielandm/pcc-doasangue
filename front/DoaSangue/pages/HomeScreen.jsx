import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, SafeAreaView, StatusBar, ActivityIndicator } from 'react-native';
import { BottomNavigation, Snackbar } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';

import { colors } from '../style/colors';
import { config } from '../config/config';
import CampaignThingy from '../components/CampaignThingy';
import ProfileThingy from '../components/ProfileThingy';
import AchievementThingy from '../components/AchievementThingy';

import { m_achievements } from '../config/mousse';

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
			console.log(JSON.stringify(response))
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
				const response = await fetch(`${config.user}?type=data&email=${filter.email}`)
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
				'email': 'mousseuwu', 'pass': '12345678', 'validated': 1, 'entry_date': new Date(), 'name': 'Mousse Hardcoded', 'last_name': 'de Chocolate', 'phone': '19998049566', 'blood_type': 'O+', 'last_donation': new Date(), 'city': 'Mistério', 'state': 'PE', 'country': 'BR', 'gender': 0, 'birth_date': new Date(), 'profile_link': null, '_id': '628f7c80d18a1daa0050a6d1',
			})
		}
		// console.log(profileData)
	}

	/* When page loads */
	useEffect(() => {
		getProfileData(route.params, true); // !!!Remember to set debug to false!!!
		getCampaigns();
	}, []);
	/* When page is focused */
	useFocusEffect(React.useCallback(() => {
		if (route.params !== undefined) {
			if (route.params.message !== undefined) {
				console.log(route.params.message);
				setSnackbarText(route.params.message);
				setVisible(true);
				if (route.params.message === 'Dados atualizados com sucesso!') {
					getProfileData(route.params, true);
					// getProfileData(route.params);
					navigation.setParams({...route.params, message: undefined});
				}
			}
		}
	}, [route]));

	/* Views */
	// Definir variável q vai ser uma bool e salva se os dados já foram coletados e só coletar se ainda não foram :)
	const CampaignsView = () =>
		<SafeAreaView style={styles.screen} >
			<ScrollView style={styles.scrollView}>
				{campaignData !== null ? campaignData.map(
					(campaign, index) => <CampaignThingy
						key={index}
						data={campaign}
						userId={profileData._id}
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

	function renderAchievements() {
		return m_achievements.map((achievement, index) =>
			<AchievementThingy key={index} navigateTo={(pageName, props) => navigateTo(pageName, props)} data={achievement} />);
	}

	const AchievementView = () =>
		<SafeAreaView style={styles.screen} >
			<ScrollView style={styles.scrollView}>
				<View style={styles.rowWrap}>
					{renderAchievements()}
				</View>
			</ScrollView>
		</SafeAreaView>;

	const ProfileView = () =>
		<SafeAreaView style={styles.screen} >
			<ScrollView style={styles.scrollView}>
				<ProfileThingy
					data={profileData}
					updateData={setProfileData}
					navigateTo={(pageName, props) => navigateTo(pageName, props)}
				/>
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
	rowWrap: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		flexWrap: 'wrap',
	},
});
