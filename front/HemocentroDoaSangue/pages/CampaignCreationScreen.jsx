import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, SafeAreaView, Dimensions, Linking } from 'react-native';
import { Button, Chip } from 'react-native-paper';
import SmallTextInput from '../components/SmallTextInput';
import DateTimePicker from '@react-native-community/datetimepicker';

import { colors } from '../style/colors';
import { statesList, bloodTypesList } from '../config/data';
import { config } from '../config/config';

export default function CampaignScreen({ navigation, route }) {
  /* open - close time */
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
  const timeOptions = { hour: '2-digit', minute: '2-digit' };
  // Text and Number data
  const [name, setName] = useState(null)
  const [city, setCity] = useState(null)
  const [address, setAddress] = useState(null)
  const [phone, setPhone] = useState(null)
  const [observation, setObservation] = useState(null)

  // State dropdown list data
  const [state, setState] = useState(null);
  const [stateItems, setStateItems] = useState(statesList);

  /* Blood stuff */
  // BloodType dropdown list data
  const [bloodTypes, setBloodTypes] = useState(new Array(bloodTypesList.length).fill(false));
  const [bloodTypeItems, setBloodTypeItems] = useState(bloodTypesList);

  function bloodSelected(index) {
    /* Selects after onPress of a chip, but it only works if the code is like this \'-'/ 
      setMyArray( arr => [...arr, `${arr.length}`]);
    */
    const newBloodTypes = bloodTypes;
    newBloodTypes[index] = !newBloodTypes[index];
    if (newBloodTypes.length == bloodTypesList.length) {
      newBloodTypes.push(3);
    } else {
      newBloodTypes.pop();
    }
    setBloodTypes(newBloodTypes);
  }

  /* Date stuff */
  // Start Date
  const [mode, setMode] = useState('date');
  const [startDate, setStartDate] = useState(new Date());
  const [showStartDate, setShowStartDate] = useState(false);

  // End Date
  const [endDate, setEndDate] = useState(new Date());
  const [showEndDate, setShowEndDate] = useState(false);

  // Open time
  const [openTime, setOpenTime] = useState(new Date('2005-01-01T08:00:00.000-03:00'));
  const [showOpenTime, setShowOpenTime] = useState(false);

  // Close time  
  const [closeTime, setCloseTime] = useState(new Date('2005-01-01T16:00:00.000-03:00'));
  const [showCloseTime, setShowCloseTime] = useState(false);

  function onChange(event, selectedDate, updateDate, updateShow) {
    updateShow(false);
    if (selectedDate !== undefined) {
      updateDate(new Date(selectedDate));
    }
  };
  function showMode(currentMode, updatePickerShow) {
    updatePickerShow(true);
    setMode(currentMode);
  };
  function showDatepicker(updatePickerShow) {
    showMode('date', updatePickerShow);
  };
  function showTimepicker(updatePickerShow) {
    showMode('time', updatePickerShow);
  };

  async function createCampaign() {
    const selectedBloodTypes = []
    for (var i in bloodTypes) {
      if (bloodTypes[i] == true) {
        selectedBloodTypes.push(bloodTypeItems[i]['value']);
      }
    }
    const campaignData = {
      cnpj: route.params == undefined ? '000' : route.params.data.cnpj,
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
      country: 'BR',
      state: state,
      city: city,
      address: address,
      phone: phone,
      observation: observation,
      banner_color: colors.red,
      banner_link: null,
      open_time: `${openTime.getHours() < 10 ? '0' + openTime.getHours() : openTime.getHours()}:${openTime.getMinutes() < 10 ? '0' + openTime.getMinutes() : openTime.getMinutes()}`,
      close_time: `${closeTime.getHours() < 10 ? '0' + closeTime.getHours() : closeTime.getHours()}:${closeTime.getMinutes() < 10 ? '0' + closeTime.getMinutes() : closeTime.getMinutes()}`,
      name: name,
      blood_types: selectedBloodTypes,
    }

    // POST request to Campaign collection and check if request was successful
    try {
      const response = await fetch(config.campaign,
        {
          method: 'POST',
          body: JSON.stringify(campaignData),
        }
      )
      if (response.status == 201) {
        navigation.navigate('HomeScreen', {
          created: true,
          name: route.params.data.cnpj,
        });
      } else {
        throw new Error('Error creating campaign');
      }
    } catch (e) {
      console.log(e);
    }
  }


  return (
    <SafeAreaView style={styles.screen} >
      <ScrollView style={styles.screen}>
        <View style={styles.columnCenter}>
          {/* Basic info inputs */}
          <View style={styles.row}>
            <Text style={styles.boxTitle}>Informações gerais</Text>
          </View>
          <View style={styles.rowCenter}>
            <SmallTextInput label={'Nome'} isPassword={false} updateVar={(text) => setName(text)} style={styles.textInput} invalidInput={false} />
          </View>
          <View style={styles.rowCenter}>
            <SmallTextInput label={'Estado'} isPassword={false} updateVar={(text) => setState(text)} style={styles.textInput} invalidInput={false} />
          </View>
          <View style={styles.rowCenter}>
            <SmallTextInput label={'Cidade'} isPassword={false} updateVar={(text) => setCity(text)} style={styles.textInput} invalidInput={false} />
          </View>
          <View style={styles.rowCenter}>
            <SmallTextInput label={'Endereço'} isPassword={false} updateVar={(text) => setAddress(text)} style={styles.textInput} invalidInput={false} />
          </View>
          <View style={styles.rowCenter}>
            <SmallTextInput label={'Telefone'} isPassword={false} updateVar={(text) => setPhone(text)} style={styles.textInput} invalidInput={false} />
          </View>

          <View style={styles.rowCenter}>
            <SmallTextInput label={'Observações'} isPassword={false} updateVar={(text) => setObservation(text)} style={styles.textInput} invalidInput={false} multiline={true} />
          </View>

          {/* Blood info inputs */}
          <View style={styles.row}>
            <Text style={styles.boxTitle}>Tipos sanguineos em falta</Text>
          </View>
          <View style={styles.rowCenter}>
            {bloodTypeItems.map((bloodTypeItem, index) =>
              <Chip key={index} style={styles.chip} selected={bloodTypes[index]} onPress={() => bloodSelected(index)}>{bloodTypeItem.label}</Chip>)}
          </View>

          {/* Date inputs */}
          <View style={styles.row}>
            <Text style={styles.boxTitle}>Período da campanha</Text>
          </View>
          {/* Starting date */}
          <View style={styles.row}>
            <Text style={styles.text}>Início</Text>
            <Button onPress={() => showDatepicker(setShowStartDate)} color={colors.blue} icon="calendar" >
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
                timeZoneOffsetInMinutes={-180}
              />
            )}
          </View>
          {/* Ending date */}
          <View style={styles.row}>
            <Text style={styles.text}>Término</Text>
            <Button onPress={() => showDatepicker(setShowEndDate)} color={colors.blue} icon="calendar" >
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
                timeZoneOffsetInMinutes={-180}
              />
            )}
          </View>

          {/* Date inputs */}
          <View style={styles.row}>
            <Text style={styles.boxTitle}>Horários de functionamento</Text>
          </View>
          {/* Starting date */}
          <View style={styles.row}>
            <Text style={styles.text}>Início</Text>
            <Button onPress={() => showTimepicker(setShowOpenTime)} color={colors.blue} icon="clock-outline" >
              {`${openTime.getHours() < 10 ? '0' + openTime.getHours() : openTime.getHours()}:${openTime.getMinutes() < 10 ? '0' + openTime.getMinutes() : openTime.getMinutes()}`}
            </Button>
            {/* Date Picker */}
            {showOpenTime && (
              <DateTimePicker
                testID="openTime"
                value={openTime}
                mode={mode}
                is24Hour={true}
                onChange={(e, value) => onChange(e, value, setOpenTime, setShowOpenTime)}
                timeZoneOffsetInMinutes={-180}
              />
            )}
          </View>
          {/* Ending date */}
          <View style={styles.row}>
            <Text style={styles.text}>Término</Text>
            <Button onPress={() => showTimepicker(setShowCloseTime)} color={colors.blue} icon="clock-outline" >
              {`${closeTime.getHours() < 10 ? '0' + closeTime.getHours() : closeTime.getHours()}:${closeTime.getMinutes() < 10 ? '0' + closeTime.getMinutes() : closeTime.getMinutes()}`}
            </Button>
            {/* Date Picker */}
            {showCloseTime && (
              <DateTimePicker
                testID="closeTime"
                value={closeTime}
                mode={mode}
                is24Hour={true}
                onChange={(e, value) => onChange(e, value, setCloseTime, setShowCloseTime)}
                timeZoneOffsetInMinutes={-180}
              />
            )}
          </View>

          {/* Submit button */}
          <View style={styles.row}>
            <Button onPress={() => createCampaign()} mode="outlined" color={colors.blue} icon="check" >
              Salvar
            </Button>
          </View>
        </View>
      </ScrollView>
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
    padding: 10,
    borderWidth: 1,
  },
  row: {
    flexDirection: 'row',
    paddingTop: 0,
    paddingBottom: 6,
    flexWrap: 'wrap',
    // borderWidth: 1,
  },
  rowCenter: {
    marginTop: 6,
    width: Dimensions.get('window').width * 0.9,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  // title: {
  //   fontSize: 20,
  //   fontWeight: 'bold',
  //   marginTop: 20,
  //   marginBottom: 3,
  // },
  boxTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.red,
    marginTop: 12,
  },
  textInput: {
    width: (Dimensions.get('window').width * 0.8),
    // height: 50,
  },
  chip: {
    marginTop: 5,
    marginLeft: 5,
    height: 33,
  },
  text: {
    fontSize: 16,
    width: Dimensions.get('window').width * 0.33,
    marginTop: 2,
    marginRight: 10,
    lineHeight: 20,
    alignSelf: 'center',
  },
});
