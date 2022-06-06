import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, ScrollView, SafeAreaView, Dimensions } from 'react-native';
import { IconButton, Chip, RadioButton, Button, Checkbox } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';

import SmallTextInput from '../components/SmallTextInput';
import { config } from '../config/config';
import { colors } from '../style/colors';
import { statesList, bloodTypesList } from '../config/data';

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
      updateData({
        ...data,
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

  function bloodSelected(index, willSetData = true) {
    const newBloodTypes = new Array(bloodTypes.length).fill(false);
    if (index !== -1) {
      newBloodTypes[index] = !newBloodTypes[index];
      if (newBloodTypes.length == bloodTypesList.length) {
        newBloodTypes.push(3);
      } else {
        newBloodTypes.pop();
      }
      if (willSetData) {
        setData({ ...data, blood_type: bloodTypesList[index].value })
      }
    } else if (index === -1) {
      if (newBloodTypes.length == bloodTypesList.length) {
        newBloodTypes.push(3);
      } else {
        newBloodTypes.pop();
      }
      if (willSetData) {
        setData({ ...data, blood_type: null })
      }
    }
    setBloodTypes(newBloodTypes);
  }

  async function saveData() {
    try {
      const response = await fetch(config.user,
        {
          method: 'PUT',
          body: JSON.stringify(data),
        }
      )
      // var status = 200
      if (response.status === 200) {
        // Go back to HomeScreen screen
        navigation.navigate({
          name: 'HomeScreen',
          params: {
            message: 'Dados atualizados com sucesso!',
            name: data.email
          },
          merge: true,
        });
      } else {
        // Make an error appear for the user
        console.log(response.status);
      }
    } catch (e) {
      // Make an error appear for the user
      console.log(e);
    }
  }

  useEffect(() => {
    setData({
      ...data,
      birth_date: new Date(data.birth_date !== undefined ? data.birth_date : new Date()),
      last_donation: new Date(data.last_donation !== undefined ? data.last_donation : new Date()),
    });
    if (data.blood_type !== null) {
      for (var i in bloodTypeItems) {
        if (data.blood_type === bloodTypeItems[i].value) {
          bloodSelected(i, false);
        }
      }
    }
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
                    color={colors.blue}
                  />
                  <Text>Feimino</Text>
                  <RadioButton
                    value="Masculino"
                    status={data.gender === 1 ? 'checked' : 'unchecked'}
                    onPress={() => setData({ ...data, gender: 1 })}
                    color={colors.blue}
                  />
                  <Text>Masculino</Text>
                </View>

              </View>

              <View style={styles.row}>
                <Text style={styles.boxTitle}>Escolha seu tipo sanguíneo</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.blockText}>O seu tipo sanguineo é importante para que possamops recomendar campanhas que precisam de seu tipo sanguíneo, ou então para possibilitar que os hemocentros entrem em contato em casos de emergência.</Text>
              </View>
              <View style={styles.rowCenter}>
                <Checkbox
                  status={data.blood_type == null ? 'checked' : 'unchecked'}
                  onPress={() => {
                    bloodSelected(-1, true);
                  }}
                  color={colors.blue}
                />
                <Text style={styles.text}>Sem tipo sanguíneo</Text>
              </View>
              <View style={styles.rowCenter}>
                {bloodTypeItems.map((bloodTypeItem, index) =>
                  <Chip key={index} style={styles.chip} selected={bloodTypes[index]} onPress={() => bloodSelected(index, true)}>{bloodTypeItem.label}</Chip>)}
              </View>

              <View style={styles.row}>
                <Text style={styles.boxTitle}>Localização</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.blockText}>Estes dados serão utilizados para apresentar as campanhas mais próximas caso o GPS não esteja funcionando ou voê não tenha dado permição.</Text>
              </View>
              <View style={styles.rowCenter}>
                {/* State input */}
                <SmallTextInput
                  label="Estado"
                  value={data.state}
                  onChangeText={(text) => setData({ ...data, state: text })}
                  mode="outlined"
                  activeOutlineColor={colors.blue}
                  outlineColor={colors.gray}
                  style={styles.textInput}
                />
                {/* City input */}
                <SmallTextInput
                  label="Cidade"
                  value={data.city}
                  onChangeText={(text) => setData({ ...data, city: text })}
                  mode="outlined"
                  activeOutlineColor={colors.blue}
                  outlineColor={colors.gray}
                  style={styles.textInput}
                />
              </View>

              <View style={styles.end}></View>

            </View>
          </ScrollView>
          <IconButton
            icon="content-save"
            color={colors.white}
            onPress={() => saveData()}
            size={40}
            style={styles.saveButton}
          />
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
    width: Dimensions.get('window').width * 0.45,
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
  blockText: {
    fontSize: 16,
    marginLeft: 12,
    marginRight: 12,
    textAlign: 'center',
    marginTop: -6,
    marginBottom: 12,
  },
  saveButton: {
    backgroundColor: colors.red,
    position: 'absolute',
    bottom: 15,
    right: 20,
    // Shadow
    shadowColor: colors.black,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 8,
  },
  end: {
    height: 50,
  },
});
