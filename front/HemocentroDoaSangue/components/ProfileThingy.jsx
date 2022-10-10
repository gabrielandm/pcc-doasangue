import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, ActivityIndicator } from 'react-native';
import { Button, Chip, IconButton } from 'react-native-paper';

import { colors } from '../style/colors';
import { subLevels } from '../config/config';

export default function ProfileThingy(props) {
  const [data, setData] = useState(props.data);
  const [loaded, setLoaded] = useState(false);
  const [subValidDate, setSubValidDate] = useState('')
  const options = { year: '2-digit', month: '2-digit', day: '2-digit' };
  const [profileLink, setProfileLink] = useState(null)

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

  function openEditPage(screenName) {
    props.navigateTo(screenName,
      {
        data: JSON.stringify(data),
      }
    );
  }

  /* When page loads */
  useEffect(() => {
    // console.log(data)
    setData({
      ...data,
      subscription_end: new Date(data.subscription_end),
    });
    try {
      // Setting subscription expiration date
      setSubValidDate(calcDate(new Date(data.subscription_end), new Date()));
    } catch (e) {
      console.log(data.subscription_end);
      console.warn(e);
      setSubValidDate('sem validade');
    }
    // Setting image
    setProfileLink(typeof data.profile_link == 'string' ? { uri: data.profile_link } : { uri: 'https://doasanguefiles.blob.core.windows.net/doasangueblob/default-profile-pic.png' });
    setLoaded(true);
  }, [])

  return (
    <View>
      {loaded === true ?
        <View style={styles.column}>
          {/* Basic info */}
          <View style={styles.outerBox}>
            <View style={styles.rowHeader}>
              <Text style={styles.title}>Informações básicas:</Text>
              <IconButton icon="square-edit-outline" size={textSize} onPress={() => openEditPage('EditProfileScreen')} />
            </View>
            <View style={styles.row}>
              {/* Profile image */}
              <View style={styles.column}>
                <Image style={styles.profImg}
                  source={profileLink}
                />
              </View>
              {/* Name */}
              <View style={styles.column}>
                <View style={styles.rowCenter}>
                  <Text style={styles.infoHeader}>Nome:</Text>
                  <Text style={styles.infoText}>{data.name}</Text>
                </View>
                {/* Address */}
                <View style={styles.rowCenter}>
                  <Text style={styles.infoHeader}>Endereço:</Text>
                  <Text style={styles.infoText}>{data.address}</Text>
                </View>
                {/* City */}
                <View style={styles.rowCenter}>
                  <Text style={styles.infoHeader}>Cidade:</Text>
                  <Text style={styles.infoText}>{data.city}</Text>
                </View>
                {/* State */}
                <View style={styles.rowCenter}>
                  <Text style={styles.infoHeader}>Estado:</Text>
                  <Text style={styles.infoText}>{data.state}</Text>
                </View>
                {/* Country */}
                <View style={styles.rowCenter}>
                  <Text style={styles.infoHeader}>País:</Text>
                  <Text style={styles.infoText}>{data.country}</Text>
                </View>
                {/* Phone */}
                <View style={styles.rowCenter}>
                  <Text style={styles.infoHeader}>Telefone:</Text>
                  <Text style={styles.infoText}>{data.phone}</Text>
                </View>
                {/* Subscription remaining */}
                <View style={styles.rowCenter}>
                  <Text style={styles.infoHeader}>Inscrição válida por:</Text>
                  <Text style={styles.infoText}>{subValidDate}</Text>
                </View>
                {/* Subscription level */}
                <View style={styles.rowCenter}>
                  <Text style={styles.infoHeader}>Nível:</Text>
                  <Text style={styles.infoText}>{subLevels[data.subscription_type]}</Text>
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
                  <Text style={styles.infoHeader}>Total de doações:</Text>
                  <Text style={styles.infoText}>300</Text>
                </View>
                <View style={styles.rowCenter}>
                  <Text style={styles.infoHeader}>Campanhas ativas:</Text>
                  <Text style={styles.infoText}>6</Text>
                </View>
                <View style={styles.rowCenter}>
                  <Text style={styles.infoHeader}>Volume total recebido:</Text>
                  <Text style={styles.infoText}>12.000 ml</Text>
                </View>
              </View>
            </View>
          </View>
        </View >
        : <ActivityIndicator size="large" color="#0000ff" />}
    </View>)
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
