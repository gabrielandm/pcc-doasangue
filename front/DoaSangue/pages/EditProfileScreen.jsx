import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, Button, ScrollView, SafeAreaView, Dimensions } from 'react-native';
import { IconButton, Chip, RadioButton } from 'react-native-paper';

import SmallTextInput from '../components/SmallTextInput';
import { colors } from '../style/colors';
import { bloodTypesList } from '../config/data';

export default function ProfileThingy({ navigation, route }) {
  const [data, setData] = useState(JSON.parse(route.params.data.data));
  const [loaded, setLoaded] = useState(false);
  const [bloodTypes, setBloodTypes] = useState(new Array(bloodTypesList.length).fill(false));
  const [bloodTypeItems, setBloodTypeItems] = useState(bloodTypesList);
  const options = { year: '2-digit', month: '2-digit', day: '2-digit' };

  /* Date stuff */
  const [date, setDate] = useState(new Date())
  const [open, setOpen] = useState(false)


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
      birth_date: new Date(data.birth_date),
      last_donation: new Date(data.last_donation),
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
                {/* Last donation input */}
                

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
