import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { IconButton } from 'react-native-paper';

import { config } from '../config/config';
import { colors } from '../style/colors';

export default function ProfileThingy(props) {
  const [loaded, setLoaded] = useState(false);
  const [data, setData] = useState(props.data);
  const [userAge, setUserAge] = useState(null);
  const [daysFromDonate, setDaysFromDonate] = useState(null);
  const [daysToDonate, setDaysToDonate] = useState(null);
  const [profileLink, setProfileLink] = useState(null);
  const [apiData, setApiData] = useState(null)
  const options = { year: '2-digit', month: '2-digit', day: '2-digit' };

  /* Function to calculate difference between dates*/
  function calcDate(date1, date2) {
    const diff = Math.floor(date1.getTime() - date2.getTime());
    const day = 1000 * 60 * 60 * 24;

    // Days remaining
    const days = Math.floor(diff / day);
    const days_left = Math.floor((days / 365 - Math.floor(days / 365)) * 365);

    // Months remaining
    const months = Math.floor(days / 31);
    const months_left = Math.floor((months / 12 - Math.floor(months / 12)) * 12);

    // Years remaining
    const years_left = Math.floor(months / 12);

    let message = "";
    if (days_left > 0) {
      message += days_left + " dias ";
    }
    if (months_left > 0) {
      message += months_left + " meses ";
    }
    if (years_left > 0) {
      message += years_left + " anos";
    }

    return message;
  }

  async function apiCall() {
    console.log(props.data['_id'])
    // 6277c41632b4f7308bb02d55
    const reqData = {
      idValue: props.data['_id'],
      idName: 'doner_id',
    }

    // Get API data
    try {
      const response = await fetch(`${config.donation}?idValue=${reqData.idValue}&idName=${reqData.idName}`,
        {
          method: 'GET',
        }
      )
      console.log(response.status);
      if (response.status === 200) {
        const json = await response.json();
        setApiData(json)
        console.log(JSON.stringify(json))
      } else {
        // Make an error appear for the user
        try {
          const json = await response.json();
          console.log(JSON.stringify(json))
        } catch (e) {
          console.log(JSON.stringify(e))
        }
      }
    } catch (e) {
      // Make an error appear for the user
      console.log('a');
      console.log(JSON.stringify(e));
    }
  }

  function openEditPage(screenName) {
    props.navigateTo(screenName,
      {
        data: JSON.stringify(data),
      }
    );
  }

  useEffect(() => {
    apiCall();
  }, [])

  useEffect(() => {
    if (apiData != null) {
      setData({
        ...data,
        birth_date: new Date(data.birth_date),
        last_donation: new Date(data.last_donation),
      });
      setUserAge(Math.abs(new Date(new Date() - data.birth_date).getUTCFullYear()) - 1970);
      const todayDate = new Date()
      let lastDonationTri = new Date(apiData['triData']);
      let fromTri = Math.ceil((todayDate.getTime() - lastDonationTri.getTime())/1000/60/60/24)
      let lastDonationQuadri = new Date(apiData['quadriData']);
      let fromQuadri = Math.ceil((todayDate.getTime() - lastDonationQuadri.getTime())/1000/60/60/24)
      setDaysFromDonate(Math.ceil((new Date() - data.last_donation) / (1000 * 60 * 60 * 24)));
      setDaysToDonate(data.gender == 0 ? 90 - fromQuadri : 60 - fromTri);
      setProfileLink(typeof data.profile_link == 'string' ? { uri: data.profile_link } : { uri: 'https://doasanguefiles.blob.core.windows.net/doasangueblob/default-profile-pic.png' });
      setLoaded(true);
    }
  }, [apiData])

  return (
    <View style={styles.column}>
      {/* Basic info */}
      {loaded ?
        <View>
          <View style={styles.outerBox}>
            <View style={styles.rowHeader}>
              <Text style={styles.title}>Informações básicas:</Text>
              <IconButton icon="square-edit-outline" size={textSize} onPress={() => openEditPage('EditProfileScreen')} />
            </View>
            <View style={styles.row}>
              <View style={styles.column}>
                <Image style={styles.profImg}
                  // source={{ uri: 'https://doasanguefiles.blob.core.windows.net/doasangueblob/doner-333.jpg' }}
                  source={profileLink}
                />
              </View>
              <View style={styles.column}>
                <View style={styles.rowCenter}>
                  <Text style={styles.infoHeader}>Nome:</Text>
                  <Text style={styles.infoText}>{data.name} {data.last_name}</Text>
                </View>
                <View style={styles.rowCenter}>
                  <Text style={styles.infoHeader}>Tipo sanguineo:</Text>
                  <Text style={styles.infoText}>{data.blood_type}</Text>
                </View>
                <View style={styles.rowCenter}>
                  <Text style={styles.infoHeader}>Dias para poder doar:</Text>
                  <Text style={styles.infoText}>{daysToDonate > 0 ? `${daysToDonate} dias` : 'já pode doar!'}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Other info */}
          <View style={styles.outerBox}>
            <View style={styles.rowHeader}>
              <Text style={styles.title}>Outras informações:</Text>
              <IconButton icon="square-edit-outline" size={textSize} onPress={() => openEditPage('EditProfileScreen')} />
            </View>
            <View style={styles.row}>
              <View style={styles.column}>
                <View style={styles.rowCenter}>
                  <Text style={styles.infoHeader}>Última doação:</Text>
                  <Text style={styles.infoText}>{new Date(apiData.quadriData).toLocaleDateString("pt-BR", options)}</Text>
                </View>
                <View style={styles.rowCenter}>
                  <Text style={styles.infoHeader}>Genêro:</Text>
                  <Text style={styles.infoText}>{data.gender === 0 ? 'Feminino' : 'Masculino'}</Text>
                </View>
                <View style={styles.rowCenter}>
                  <Text style={styles.infoHeader}>Data de nscimento:</Text>
                  <Text style={styles.infoText}>{data.birth_date.toLocaleDateString("pt-BR", options)}</Text>
                </View>
                <View style={styles.rowCenter}>
                  <Text style={styles.infoHeader}>Idade:</Text>
                  <Text style={styles.infoText}>{userAge}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Statistical info */}
          <View style={styles.outerBox}>
            <View style={styles.row}>
              <Text style={styles.title}>Estatísticas:</Text>
            </View>
            <View style={styles.row}>
              <View style={styles.column}>
                <View style={styles.rowCenter}>
                  <Text style={styles.infoHeader}>Doações realizadas:</Text>
                  <Text style={styles.infoText}>{apiData.overallCount}</Text>
                </View>
                {/* <View style={styles.rowCenter}>
                  <Text style={styles.infoHeader}>Postos diferentes:</Text>
                  <Text style={styles.infoText}>3</Text>
                </View> */}
                {/* <View style={styles.rowCenter}>
                  <Text style={styles.infoHeader}>Volume total doado:</Text>
                  <Text style={styles.infoText}>3.000 ml</Text>
                </View> */}
              </View>
            </View>
          </View>
        </View>
        : null}
    </View>
  )
}
const textSize = 14;
const styles = StyleSheet.create({
  outerBox: {
    // borderWidth: 1,
    padding: 10,
    backgroundColor: colors.white,
    // height: 100,
    marginTop: 6,
    marginBottom: 12,
    marginRight: 20,
    marginLeft: 20,
    flexDirection: 'column',
    // borderRadius: 10,
    // Shadow
    shadowColor: '#000000',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 3,
    elevation: 6,
  },
  profImg: {
    width: 75,
    height: 75,
    borderRadius: 75 / 2,
    borderWidth: 1,
    borderColor: colors.red,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  rowCenter: {
    flexDirection: 'row',
    // justifyContent: 'center',
    alignItems: 'center',
    // borderWidth: 1,
    marginTop: 3,
    paddingLeft: 6,
  },
  rowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rowInverse: {
    flexDirection: 'row-reverse',
    // justifyContent: 'space-between',
  },
  column: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: textSize + 3,
    fontWeight: 'bold',
  },
  infoText: {
    fontSize: textSize,
    marginLeft: 3,
  },
  infoHeader: {
    fontSize: textSize,
    fontWeight: 'bold',
  },
});
