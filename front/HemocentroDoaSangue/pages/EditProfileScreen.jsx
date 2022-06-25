import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, ScrollView, SafeAreaView, Dimensions } from 'react-native';
import { IconButton, Chip, RadioButton, Button, Checkbox } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';

import SmallTextInput from '../components/SmallTextInput';
import { config } from '../config/config';
import { colors } from '../style/colors';
import { statesList, bloodTypesList } from '../config/data';

export default function ProfileThingy({ navigation, route }) {
  /* Data */
  const [data, setData] = useState(JSON.parse(route.params.data.data));
  const oldData = JSON.parse(route.params.data.data)
  const [loaded, setLoaded] = useState(false);
  const options = { year: '2-digit', month: '2-digit', day: '2-digit' };

  const [profileLink, setProfileLink] = useState(null);
  const [image, setImage] = useState(null); // Image that will be selected
  const [deleteImage, setDeleteImage] = useState(false); // If true, image will be deleted
  const [imageBase64, setImageBase64] = useState(null); // Image in base64 format

  /* Input validation control */
  const [nameErrorMessage, setNameErrorMessage] = useState([]);
  const [nameIsValid, setNameIsValid] = useState(true);
  const [phoneErrorMessage, setPhoneErrorMessage] = useState([]);
  const [phoneIsValid, setPhoneIsValid] = useState(true);
  const [stateErrorMessage, setStateErrorMessage] = useState([]);
  const [stateIsValid, setStateIsValid] = useState(true);

  /* Date stuff */
  // Last donation date
  const [mode, setMode] = useState('date');
  const [showLastDonation, setShowLastDonation] = useState(false);
  function onChangeDateCheckbox(key) {
    if (data[key] == null) {
      setData({ ...data, [key]: new Date() });
    } else {
      setData({ ...data, [key]: null });
    }
  }

  // Function to handle image changes
  async function pickImage() {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.3,
      base64: true,
    });

    if (!result.cancelled) {
      setImage(result.uri);
      setImageBase64(result.base64);
    }
  };

  // Function to validate all data inputs
  function validateUserInputs() {
    let status = {
      validated: true,
      message: [],
      data: {
        ...data,
        name: data.name.replace(/\s+/g, ' ').trim(),
        phone: data.phone.replace(/\s+/g, ' ').trim(),
        country: data.country.replace(/\s+/g, ' ').trim(),
        state: data.state.replace(/\s+/g, ' ').trim(),
        city: data.city.replace(/\s+/g, ' ').trim(),
      }
    };

    /* GENERAL */
    // Check if any changes were made
    if (JSON.stringify(status.data) === oldData) {
      status.validated = false;
      status.message = ['Nenhuma alteração foi realizada.'];
      return status;
    }
    /* NAME */
    setNameIsValid(true);
    let tempNameErrorMessages = [];
    setNameErrorMessage([]);
    // Check if field is correctly filled
    if (status.data.name.length < 3) {
      status.message.push('O nome deve conter pelo menos 3 letras.');
      status.validated = false;
      setNameIsValid(false);
      tempNameErrorMessages.push('O nome deve conter pelo menos 3 letras.');
    }
    // Check if has only letters or brazilian letters on data.name
    if (!/^[a-zA-ZÀ-ÿ ]+$/.test(status.data.name)) {
      status.message.push('O nome deve conter apenas letras.');
      status.validated = false;
      setNameIsValid(false);
      tempNameErrorMessages.push('O nome deve conter apenas letras.');
    }
    setNameErrorMessage(tempNameErrorMessages);
    /* PHONE */
    setPhoneIsValid(true);
    let tempPhoneErrorMessages = [];
    // Check if has 10 or 11 digits
    if (status.data.phone.length !== 10 && status.data.phone.length !== 11) {
      status.message.push('O telefone deve conter 10 ou 11 dígitos.');
      status.validated = false;
      setPhoneIsValid(false);
      tempPhoneErrorMessages.push('O telefone deve conter 10 ou 11 dígitos.');
    }
    setPhoneErrorMessage(tempPhoneErrorMessages);
    /* STATE */
    setStateIsValid(true);
    let tempStateErrorMessages = [];
    // Check if state is set
    if (status.data.state != null) {
      // Check if state exists in statesList
      var stateExists = false;
      statesList.forEach((state) => {
        if (state.value.toUpperCase() === status.data.state.toUpperCase() || state.label.toUpperCase() === status.data.state.toUpperCase()) {
          stateExists = true;
        }
      });
      if (!stateExists) {
        status.message.push('O estado informado não existe.');
        status.validated = false;
        setStateIsValid(false);
        tempStateErrorMessages.push('O estado informado não existe.');
      }
    }
    setStateErrorMessage(tempStateErrorMessages);
    /* END */
    // Return status
    return status
  }

  // Function to handle text changes
  function onTextInputChange(text, key) {
    setData({ ...data, [key]: text });
    validateUserInputs();
  }

  // Function to send an API request to save the user data
  async function saveData() {
    const status = validateUserInputs();
    const data = {
      ...status.data,
      delete_image: deleteImage,
      image: imageBase64,
      // image_type: image.split('.')[image.split('.').length - 1],
    };
    // Removing unnecessary data
    delete data._id;

    console.log(data)
    if (status.validated) {
      try {
        const response = await fetch(config.corp,
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
              name: data.cnpj
            },
            merge: true,
          });
        } else {
          // Make an error appear for the user
          console.log(response.status);
          try {
            const json = await response.json();
            console.log(json)
          } catch (e) {
            console.log(e)
          }
        }
      } catch (e) {
        // Make an error appear for the user
        console.log(e);
      }
    }
  }

  useEffect(() => {
    setData({
      ...data,
    });
    setProfileLink(typeof data.profile_link == 'string' ? { uri: data.profile_link } : { uri: 'https://doasanguefiles.blob.core.windows.net/doasangueblob/default-profile-pic.png' })
    setLoaded(true);
  }, [])

  useEffect(() => {
    validateUserInputs();
  }, [data])

  return (
    <View style={styles.container}>
      {/* <Text>Mousse</Text> */}
      {loaded ?
        <SafeAreaView style={styles.screen}>
          <ScrollView style={styles.screen}>
            {/* Image imput */}
            <View style={styles.columnCenter}>
              <View style={styles.columnCenter}>
                <View style={styles.rowCenter}>
                  <View style={styles.column}>
                    {image == null ?
                      <Image source={profileLink} style={styles.profImg} /> :
                      <Image source={{ uri: image }} style={styles.profImg} />
                    }
                  </View>

                  <View style={styles.column}>
                    <View style={styles.row}>
                      <Button onPress={pickImage} color={colors.red}>ALterar imagem</Button>
                    </View>
                    <View style={styles.row}>
                      <Checkbox
                        status={deleteImage == true ? 'checked' : 'unchecked'}
                        onPress={() => setDeleteImage(!deleteImage)}
                        color={colors.red}
                      />
                      <Text style={styles.text}>Remover imagem</Text>
                    </View>
                  </View>
                </View>
              </View>

              <View style={styles.row}>

                <Text style={styles.boxTitle}>Informações gerais</Text>
              </View>
              <View style={styles.rowCenter}>
                {/* Name input */}
                <SmallTextInput
                  label="Nome"
                  value={data.name}
                  updateVar={(text) => onTextInputChange(text, 'name')}
                  mode="outlined"
                  activeOutlineColor={colors.blue}
                  outlineColor={colors.gray}
                  invalidInput={!nameIsValid}
                  errorText={nameErrorMessage}
                  style={styles.textInput}
                />
                {/* Phone number input */}
                <SmallTextInput
                  label="Telefone"
                  value={data.phone}
                  updateVar={(text) => onTextInputChange(text, 'phone')}
                  mode="outlined"
                  activeOutlineColor={colors.blue}
                  outlineColor={colors.gray}
                  invalidInput={!phoneIsValid}
                  errorText={phoneErrorMessage}
                  style={styles.textInput}
                  mask={[' (', /\d/, /\d/, ') ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                />

                <View style={styles.row}>
                  <Text style={styles.boxTitle}>Localização</Text>
                </View>
                <View style={styles.rowCenter}>
                  {/* State input */}
                  <SmallTextInput
                    label="Estado"
                    value={data.state}
                    updateVar={(text) => onTextInputChange(text, 'state')}
                    mode="outlined"
                    activeOutlineColor={colors.blue}
                    outlineColor={colors.gray}
                    invalidInput={!stateIsValid}
                    errorText={stateErrorMessage}
                    style={styles.textInput}
                  />
                  {/* City input */}
                  <SmallTextInput
                    label="Cidade"
                    value={data.city}
                    updateVar={(text) => onTextInputChange(text, 'city')}
                    mode="outlined"
                    activeOutlineColor={colors.blue}
                    outlineColor={colors.gray}
                    style={styles.textInput}
                  />
                  {/* Address input */}
                  <SmallTextInput
                    label="Cidade"
                    value={data.address}
                    updateVar={(text) => onTextInputChange(text, 'address')}
                    mode="outlined"
                    activeOutlineColor={colors.blue}
                    outlineColor={colors.gray}
                    style={styles.textInput}
                  />
                  {/* Map input */}
                  <View style={styles.row}>
                    <Text style={styles.blockText}>
                      Caso deseje, clique no botão e escolha o local do estabelecimento.
                    </Text>
                  </View>
                  <View style={styles.row}>
                    <Button icon="map" color={colors.blue} style={styles.button} onPress={() => console.log('mousse')}>
                      Abrir mapa
                    </Button>
                  </View>
                </View>

                <View style={styles.end}></View>
              </View>

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
    bottom: 70,
    right: 20,
    // Shadow
    shadowColor: colors.black,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 8,
  },
  end: {
    height: 300,
  },
  profImg: {
    width: 75,
    height: 75,
    borderRadius: 75 / 2,
    borderWidth: 1,
    borderColor: colors.red,
  },
  button: {
    // borderWidth: 1,
    // borderColor: colors.black,
  }
});
