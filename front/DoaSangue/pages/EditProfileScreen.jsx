import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, ScrollView, SafeAreaView, Dimensions } from 'react-native';
import { IconButton, Chip, RadioButton, Button } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';

import SmallTextInput from '../components/SmallTextInput';
import { colors } from '../style/colors';
import { bloodTypesList } from '../config/data';

/*
  - BloodType
  - Static Location
    - City
    - State
    - Country
*/

export default function ProfileThingy({ navigation, route }) {
  const [data, setData] = useState(JSON.parse(route.params.data.data));
  const [loaded, setLoaded] = useState(false);
  const [bloodTypes, setBloodTypes] = useState(new Array(bloodTypesList.length).fill(false));
  const [bloodTypeItems, setBloodTypeItems] = useState(bloodTypesList);
  const options = { year: '2-digit', month: '2-digit', day: '2-digit' };

  /* Date stuff */
  // Last donation date
  const [mode, setMode] = useState('date');
  const [showLastDonation, setShowLastDonation] = useState(false);
  // Birth date
  const [showBirthDate, setShowBirthDate] = useState(false);

  // Functions to handle datepicker
  function onChange(event, selectedDate, data, dataKey, updateData, updateShow) {
    updateShow(false);
    if (selectedDate !== undefined) {
      updateData({...data,
        [dataKey]: new Date(selectedDate)
      });
    }
  };
  function showMode(currentMode, updatePickerShow) {
    updatePickerShow(true);
    setMode(currentMode);
  };
  function showDatepicker(updatePickerShow) {
    showMode('date', updatePickerShow);
  };


  function bloodSelected(index) {
    /* Selects after onPress of a chip, but it only works if the code is like this \'-'/ 
      setMyArray( arr => [...arr, `${arr.length}`]);
    */
    const newBloodTypes = bloodTypes;

    newBloodTypes[index] = !newBloodTypes[index];
    setBloodTypes(newBloodTypes => [...newBloodTypes, `${newBloodTypes.length}`]);
  }

  useEffect(() => {
    setData({
      ...data,
      birth_date: new Date(data.birth_date !== undefined ? data.birth_date : new Date()),
      last_donation: new Date(data.last_donation !== undefined ? data.last_donation : new Date()),

    });
    setLoaded(true);
  }, [])

  return (
    <View style={styles.container}>
      {/* <Text>Mousse</Text> */}
      {loaded ?
        <SafeAreaView style={styles.screen}>
          <ScrollView style={styles.screen}>
            <View style={styles.columnCenter}>

              <View style={styles.row}>
                <Text style={styles.boxTitle}>Informações gerais</Text>
              </View>
              <View style={styles.rowCenter}>
                {/* Name input */}
                <SmallTextInput
                  label="Nome"
                  value={data.name}
                  onChangeText={(text) => setData({ ...data, name: text })}
                  mode="outlined"
                  activeOutlineColor={colors.blue}
                  outlineColor={colors.gray}
                  style={styles.textInput}
                />
                {/* Last name input */}
                <SmallTextInput
                  label="Sobrenome"
                  value={data.last_name}
                  onChangeText={(text) => setData({ ...data, last_name: text })}
                  mode="outlined"
                  activeOutlineColor={colors.blue}
                  outlineColor={colors.gray}
                  style={styles.textInput}
                />
                {/* Phone number input */}
                <SmallTextInput
                  label="Telefone"
                  value={data.phone}
                  onChangeText={(text) => setData({ ...data, phone: text })}
                  mode="outlined"
                  activeOutlineColor={colors.blue}
                  outlineColor={colors.gray}
                  style={styles.textInput}
                  mask={['+', /\d/, /\d/, ' (', /\d/, /\d/, ') ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                />
                {/* Birth date input */}
                <View style={styles.rowCenter}>
                  <Text style={styles.text}>Data de nascimento</Text>
                  <Button onPress={() => showDatepicker(setShowBirthDate)} color={colors.blue} icon="calendar" >
                    {data.birth_date.toLocaleDateString("pt-BR", options)}
                  </Button>
                  {showBirthDate && (
                    <DateTimePicker
                      testID="birthDate"
                      value={data.birth_date}
                      mode={mode}
                      is24Hour={true}
                      onChange={(e, value) => onChange(e, value, data, 'birth_date', setData, setShowLastDonation)}
                      timeZoneOffsetInMinutes={-180}
                    />
                  )}
                </View>
                {/* Last donation input */}
                <View style={styles.rowCenter}>
                  <Text style={styles.text}>Última doação</Text>
                  <Button onPress={() => showDatepicker(setShowLastDonation)} color={colors.blue} icon="calendar" >
                    {data.last_donation.toLocaleDateString("pt-BR", options)}
                  </Button>
                  {showLastDonation && (
                    <DateTimePicker
                      testID="lastDonation"
                      value={data.last_donation}
                      mode={mode}
                      is24Hour={true}
                      onChange={(e, value) => onChange(e, value, data, 'last_donation', setData, setShowLastDonation)}
                      timeZoneOffsetInMinutes={-180}
                    />
                  )}
                </View>

                <View style={styles.rowCenter}>
                  {/* Gender input */}
                  <RadioButton
                    value="Feminino"
                    status={data.gender === 0 ? 'checked' : 'unchecked'}
                    onPress={() => setData({ ...data, gender: 0 })}
                  />
                  <Text>Feimino</Text>
                  <RadioButton
                    value="Masculino"
                    status={data.gender === 1 ? 'checked' : 'unchecked'}
                    onPress={() => setData({ ...data, gender: 1 })}
                  />
                  <Text>Masculino</Text>
                </View>

              </View>
              <View style={styles.row}>
                <Text style={styles.boxTitle}>Escolha seu tipo sanguíneo</Text>
              </View>
              <View style={styles.rowCenter}>
                {bloodTypeItems.map((bloodTypeItem, index) =>
                  <Chip key={index} style={styles.chip} selected={bloodTypes[index]} onPress={() => bloodSelected(index)}>{bloodTypeItem.label}</Chip>)}
              </View>
            </View>
          </ScrollView>
        </SafeAreaView> : null
      }
    </View>
  )
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
  },
  columnCenter: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    padding: 10,
  },
  row: {
    flexDirection: 'row',
    paddingTop: 0,
    paddingBottom: 6,
    flexWrap: 'wrap',
  },
  rowCenter: {
    marginTop: 6,
    width: Dimensions.get('window').width * 0.9,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  textInput: {
    width: (Dimensions.get('window').width * 0.8),
    marginBottom: 6,
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
  boxTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.red,
    marginTop: 12,
  },
});
