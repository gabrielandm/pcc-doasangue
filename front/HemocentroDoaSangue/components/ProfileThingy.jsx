import React, { useState } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { Button, Chip, IconButton } from 'react-native-paper';

import { colors } from '../style/colors';

export default function ProfileThingy(props) {
  const data = props.data;
  data.birth_date = new Date(data.birth_date);
  data.last_donation = new Date(data.last_donation);
  const userAge = Math.abs(new Date(new Date() - data.birth_date).getUTCFullYear()) - 1970
  const daysFromDonate = Math.ceil((new Date() - data.last_donation) / (1000 * 60 * 60 * 24));
  const daysToDonate = data.gender == 0 ? 90 - daysFromDonate : 60 - daysFromDonate;
  const options = { year: '2-digit', month: '2-digit', day: '2-digit' };
  const profile_link = typeof data.profile_link == 'string' ?	 {uri: data.profile_link} : {uri: 'https://doasanguefiles.blob.core.windows.net/doasangueblob/default-profile-pic.png'}
  
  function openEditPage(screenName) {
    console.log(screenName);
    // props.navigateTo(screenName, props.data);
  }

  return (
    <View style={styles.column}>
      {/* Basic info */}
      <View style={styles.outerBox}>
        <View style={styles.rowHeader}>
          <Text style={styles.title}>Informações básicas:</Text>
          <IconButton icon="square-edit-outline" size={textSize} onPress={() => openEditPage('EditBasicInfoScreen')} />
        </View>
        <View style={styles.row}>
          <View style={styles.column}>
            <Image style={styles.profImg}
              // source={{ uri: 'https://doasanguefiles.blob.core.windows.net/doasangueblob/doner-333.jpg' }}
              source={profile_link}
            />
          </View>
          <View style={styles.column}>
            <View style={styles.rowCenter}>
              <Text style={styles.infoHeader}>Nome:</Text>
              <Text style={styles.infoText}>{data.name}</Text>
            </View>
            <View style={styles.rowCenter}>
              <Text style={styles.infoHeader}>Endereço:</Text>
              <Text style={styles.infoText}>{data.address}</Text>
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
