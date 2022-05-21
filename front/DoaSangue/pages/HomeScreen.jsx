import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, SafeAreaView, StatusBar, ActivityIndicator } from 'react-native';
import { BottomNavigation } from 'react-native-paper';

import { colors } from '../style/colors';
import { config } from '../config/config';
import CampaignThingy from '../components/CampaignThingy';
import ProfileThingy from '../components/ProfileThingy';

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
			const json = await response.json();
			setCampaignData(json);
		} catch (error) {
			console.log(error);
		}
	}

	/* When page loads */
	useEffect(() => {
		getCampaigns();
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
		</SafeAreaView>;

	const AchievementView = () =>
		<SafeAreaView style={styles.screen} >
			<ScrollView style={styles.scrollView}>
				<Text>Achievements</Text>
			</ScrollView>
		</SafeAreaView>;

	const ProfileView = () =>
		<SafeAreaView style={styles.screen} >
			<ScrollView style={styles.scrollView}>
				<ProfileThingy data={undefined} />
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
});
