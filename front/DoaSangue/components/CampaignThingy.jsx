import React, { useState } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { Button, Chip } from 'react-native-paper';

import { colors } from '../style/colors';

export default function CampaignThingy(props) {
  const data = props.data;
  data.start_date = new Date(data.start_date);
  data.end_date = new Date(data.end_date);
  const banner_link = typeof data.banner_link == 'string' ?	 { uri: data.banner_link } : require('../images/hospital.jpg')
  const options = { year: '2-digit', month: '2-digit', day: '2-digit' };

  function navigateTo() {
    props.navigateTo('CampaignScreen', {data: JSON.stringify(data)});
  }

  return (
    <View style={styles.outerBox}>
      <View style={styles.row}>
        <View style={styles.textBox}>
          <Image
            style={styles.campaignImg}
            // source={require('../images/hospital.jpg')}
            source={banner_link}
          />
        </View>

        <View style={styles.textBox}>
          <Text style={styles.campaignHeader}>{data.name}</Text>
          <Text style={styles.campaignText}>{data.start_date.toLocaleDateString("pt-BR", options)} - {data.end_date.toLocaleDateString("pt-BR", options)} ({data.open_time} - {data.close_time})</Text>
        </View>
      </View>

      <View style={styles.row}>
        <Text style={styles.campaignText}>Tipos sanguineos:</Text>
        {data.blood_types.map((blood_type, index) => <Chip key={index} style={styles.chip}>{blood_type}</Chip>)}
      </View>

      {/* Code to calculate the distance */}
      <Text style={styles.campaignText}>A 3Km de você</Text>

      <View style={styles.rowInverse}>
        <Button mode="text" icon="arrow-right" contentStyle={{flexDirection: 'row-reverse'}} color={colors.lightRed} onPress={() => navigateTo()}>Detalhes</Button>
        <Button mode="text" icon="star" color={colors.lightBlue} disabled={true}>{data.campaign_rating}</Button>
      </View>
    </View>
  );
}

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
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 3,
    elevation: 6,
  },
  campaignImg: {
    // borderWidth: 1,
    borderRadius: 50,
    flex: 1,
    width: 50,
    height: 50,
    flexBasis: 50,
    // flexGrow: 0,
    resizeMode: 'stretch',
  },
  campaignHeader: {
    marginLeft: 10,
    fontSize: 20,
    fontWeight: 'bold',
  },
  campaignText: {
    fontSize: 16,
    marginTop: 5,
    marginLeft: 10,
  },
  campaignObs: {
    fontSize: 16,
    marginTop: 10,
  },
  textBox: {
    justifyContent: 'flex-start',
    flexDirection: 'column',
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  rowInverse: {
    flexDirection: 'row-reverse',
    // justifyContent: 'space-between',
  },
  chip: {
    marginLeft: 3,
    marginTop: 3,
  },
});
