import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, SafeAreaView, Dimensions, Linking } from 'react-native';
import { Button, Chip, Avatar, TextInput } from 'react-native-paper';
import MapView, { Marker } from 'react-native-maps';
import SmallTextInput from '../components/SmallTextInput';
import DatePicker from 'react-native-date-picker';

import { colors } from '../style/colors';

export default function CampaignScreen({ navigation, route }) {
  const [number, setNumber] = useState(null);
  const [date, setDate] = useState(new Date())

  return (
    <SafeAreaView style={styles.screen} >
      <View style={styles.row}>
        <Text style={styles.text}>Telefone</Text>
        <SmallTextInput label={'Telefone'} isPassword={false} updateVar={(text) => setNumber(text)} style={styles.textInput} invalidInput={true} />
      </View>
      <View style={styles.row}>
        <Text style={styles.text}>Data de Início</Text>
        <SmallTextInput label={'Data inicial'} isPassword={false} updateVar={(text) => setNumber(text)} style={styles.textInput} invalidInput={true} />
      </View>
      <View style={styles.row}>
        <Text style={styles.text}>Data de Término</Text>
        <SmallTextInput label={'Data de Término'} isPassword={false} updateVar={(text) => setNumber(text)} style={styles.textInput} invalidInput={true} keyboardType={'numeric'} />
        <DatePicker date={date} onDateChange={setDate} />
      </View>
      <View style={styles.row}>
        <Text style={styles.text}></Text>
        <SmallTextInput label={'Telefone'} isPassword={false} updateVar={(text) => setNumber(text)} style={styles.textInput} invalidInput={true} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.white,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  column: {
    flexDirection: 'column',
    flexWrap: 'wrap',
  },
  columnCenter: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  row: {
    flexDirection: 'row',
    paddingLeft: 20,
    flexWrap: 'wrap',
  },
  rowCenter: {
    width: Dimensions.get('window').width * 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 3,
  },
  textInput: {
    width: (Dimensions.get('window').width * 0.65),
    marginRight: 20,
  },
  map: {
    borderWidth: 1,
    margin: 'auto',
    marginTop: 10,
    width: Dimensions.get('window').width * 0.9,
    height: 333,
  },
  chip: {
    marginTop: 5,
    marginLeft: 5,
  },
  dataText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 3,
  },
  text: {
    fontSize: 17,
    width: Dimensions.get('window').width * 0.2,
    marginTop: 2,
    marginRight: 10,
    lineHeight: 20,
    alignSelf: 'center',
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});
