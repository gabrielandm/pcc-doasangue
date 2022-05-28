import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, SafeAreaView, Dimensions, Linking } from 'react-native';
import { Button, Chip, Avatar, TextInput } from 'react-native-paper';
import SmallTextInput from '../components/SmallTextInput';
import DateTimePicker from '@react-native-community/datetimepicker';


import { colors } from '../style/colors';

export default function CampaignScreen({ navigation, route }) {
  const options = { year: '4-digit', month: '2-digit', day: '2-digit' };
  // Text and Number data
  const cnpj = '000'
  const country = 'BR'
  const [name, setName] = useState(null)
  const [state, setState] = useState(null);
  // Start Date
  const [startDate, setStartDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [showStartDate, setShowStartDate] = useState(false);
  // End Date
  const [endDate, setEndDate] = useState(new Date());
  const [showEndDate, setShowEndDate] = useState(false);

  const onChange = (event, selectedDate, updateDate, updateShow) => {
    const currentDate = selectedDate;
    updateShow(false);
    if (currentDate !== undefined) {
      updateDate(currentDate);
    }
  };
  const showMode = (currentMode, updatePickerShow) => {
    updatePickerShow(true);
    setMode(currentMode);
  };
  const showDatepicker = (updatePickerShow) => {
    showMode('date', updatePickerShow);
  };
  const showTimepicker = () => {
    showMode('time', updatePickerShow);
  };


  return (
    <SafeAreaView style={styles.screen} >
      <View style={styles.columnCenter}>
        {/* CNPJ */}
        <View style={styles.rowCenter}>
          {/* Temp input */}
          <SmallTextInput label={'Nome'} isPassword={false} updateVar={(text) => setName(text)} style={styles.textInput} invalidInput={false} />
        </View>
        {/* Starting date */}
        <View style={styles.row}>
          <Text style={styles.text}>Início</Text>
          <Button onPress={() => showDatepicker(setShowStartDate)} color={colors.blue} >
            {startDate.toLocaleDateString("pt-BR", options)}
          </Button>
          {/* Date Picker */}
          {showStartDate && (
            <DateTimePicker
              testID="startDate"
              value={startDate}
              mode={mode}
              is24Hour={true}
              onChange={(e, value) => onChange(e, value, setStartDate, setShowStartDate)}
            />
          )}
        </View>
        {/* Ending date */}
        <View style={styles.row}>
          <Text style={styles.text}>Término</Text>
          <Button onPress={() => showDatepicker(setShowEndDate)} color={colors.blue} >
            {endDate.toLocaleDateString("pt-BR", options)}
          </Button>
          {/* Date Picker */}
          {showEndDate && (
            <DateTimePicker
              testID="endDate"
              value={endDate}
              mode={mode}
              is24Hour={true}
              onChange={(e, value) => onChange(e, value, setEndDate, setShowEndDate)}
            />
          )}
        </View>
      </View>
    </SafeAreaView >
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.white,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  column: {
    paddingTop: 10,
    flexDirection: 'column',
    flexWrap: 'wrap',
    // borderWidth: 1,
  },
  columnCenter: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    paddingLeft: 10,
  },
  row: {
    flexDirection: 'row',
    paddingLeft: 20,
    paddingTop: 6,
    flexWrap: 'wrap',
  },
  rowCenter: {
    marginTop: 12,
    width: Dimensions.get('window').width * 0.9,
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
