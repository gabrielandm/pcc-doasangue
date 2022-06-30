import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, ScrollView, SafeAreaView, Dimensions, Linking } from 'react-native';
import { Button, Chip, Checkbox } from 'react-native-paper';
import SmallTextInput from '../components/SmallTextInput';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';

import { colors } from '../style/colors';
import { statesList, bloodTypesList } from '../config/data';
import { config } from '../config/config';

export default function CreateCampaignScreen({ navigation, route }) {
  /* Basic variables */
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
  const timeOptions = { hour: '2-digit', minute: '2-digit' };
  // Text and Number data
  const [name, setName] = useState('')
  const [country, setCountry] = useState('')
  const [city, setCity] = useState('')
  const [address, setAddress] = useState('')
  const [phone, setPhone] = useState('')
  const [observation, setObservation] = useState('')
  const [changed, setChanged] = useState(false)

  // State data
  const [state, setState] = useState('');
  const [stateItems, setStateItems] = useState(statesList);

  /* Input validation control */
  const [nameErrorMessage, setNameErrorMessage] = useState([]);
  const [nameIsValid, setNameIsValid] = useState(true);
  const [observationErrorMessage, setObservationErrorMessage] = useState([]);
  const [observationIsValid, setObservationIsValid] = useState(true);
  const [phoneErrorMessage, setPhoneErrorMessage] = useState([]);
  const [phoneIsValid, setPhoneIsValid] = useState(true);
  const [stateErrorMessage, setStateErrorMessage] = useState([]);
  const [stateIsValid, setStateIsValid] = useState(true);
  const [cityErrorMessage, setCityErrorMessage] = useState([]);
  const [cityIsValid, setCityIsValid] = useState(true);
  const [addressErrorMessage, setAddressErrorMessage] = useState([]);
  const [addressIsValid, setAddressIsValid] = useState(true);
  const [countryErrorMessage, setCountryErrorMessage] = useState([]);
  const [countryIsValid, setCountryIsValid] = useState(true);

  /* Blood stuff */
  // BloodType dropdown list data
  const [bloodTypes, setBloodTypes] = useState(new Array(bloodTypesList.length).fill(false));
  const [bloodTypeItems, setBloodTypeItems] = useState(bloodTypesList);

  // Function to control the blood types selection
  function bloodSelected(index) {
    /* Selects after onPress of a chip, but it only works if the code is like this \'-'/ 
      setMyArray( arr => [...arr]);
    */
    const newBloodTypes = bloodTypes;
    newBloodTypes[index] = !newBloodTypes[index];
    // setBloodTypes(newBloodTypes);
    setBloodTypes(newBloodTypes => [...newBloodTypes]);
    // console.log(bloodTypes)
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

  // Image variables
  const [image, setImage] = useState(null); // Image that will be selected
  const [deleteImage, setDeleteImage] = useState(false); // If true, image will be deleted
  const [imageBase64, setImageBase64] = useState(null); // Image in base64 format

  /* Data stuff */
  // Function to set values to text variables
  function onTextInputChange(text, setFunction) {
    setFunction(text);
    setChanged(true);
    // validateUserInputs();
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

  // Data validation and manipulation
  // Function to validate all data inputs
  function validateUserInputs() {
    const selectedBloodTypes = []
    for (var i in bloodTypes) {
      if (bloodTypes[i] == true) {
        selectedBloodTypes.push(bloodTypeItems[i]['value']);
      }
    }

    let status = {
      validated: true,
      message: [],
      data: {
        cnpj: route.params == undefined ? '000' : route.params.data.cnpj,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        country: country.replace(/\s+/g, ' ').trim(),
        state: state.replace(/\s+/g, ' ').trim(),
        city: city.replace(/\s+/g, ' ').trim(),
        address: address,
        phone: phone.replace(/\s+/g, ' ').trim(),
        observation: observation,
        banner_color: colors.red,
        banner_link: null,
        open_time: `${openTime.getHours() < 10 ? '0' + openTime.getHours() : openTime.getHours()}:${openTime.getMinutes() < 10 ? '0' + openTime.getMinutes() : openTime.getMinutes()}`,
        close_time: `${closeTime.getHours() < 10 ? '0' + closeTime.getHours() : closeTime.getHours()}:${closeTime.getMinutes() < 10 ? '0' + closeTime.getMinutes() : closeTime.getMinutes()}`,
        name: name.replace(/\s+/g, ' ').trim(),
        blood_types: selectedBloodTypes,
        // Image variables
        // Sends null if user wants to ignore the selected image
        image: deleteImage === true ? null : imageBase64,
        image_type: image.split('.')[image.split('.').length - 1],
      }
    };

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
    /* OBSERVATION */
    setObservationIsValid(true);
    let tempObservationErrorMessages = [];
    setObservationErrorMessage([]);
    // Check if has only letters or brazilian letters on data.name
    if (!/^[a-zA-ZÀ-ÿ ]+$/.test(status.data.name)) {
      status.message.push('O nome deve conter apenas letras.');
      status.validated = false;
      setObservationIsValid(false);
      tempObservationErrorMessages.push('O nome deve conter apenas letras.');
    }
    setObservationErrorMessage(tempObservationErrorMessages);
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
          // console.log(state.value)
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

  // Function to save the campaign to MongoDB
  async function createCampaign() {
    // Validate user inputs before POST
    const status = validateUserInputs();
    if (status.validated) {
      // POST request to Campaign collection and check if request was successful
      try {
        const response = await fetch(config.campaign,
          {
            method: 'POST',
            body: JSON.stringify(status.data),
          }
        )
        if (response.status == 201) {
          navigation.navigate({
            name: 'HomeScreen',
            params: {
              created: true,
              name: route.params.data.cnpj,
              message: 'Campanha criada com sucesso!'
            },
            merge: true
          });
        } else {
          throw new Error('Error creating campaign');
        }
      } catch (e) {
        console.log(e);
      }
    }
  }

  // Every time data is changed
  useEffect(() => {
    if (changed) {
      validateUserInputs();
      setChanged(false);
    }
  }, [changed])

  return (
    <SafeAreaView style={styles.screen} >
      <ScrollView style={styles.screen}>
        <View style={styles.columnCenter}>
          {/* Image imput */}
          <View style={styles.columnCenter}>
            <View style={styles.rowCenter}>
              <View style={styles.column}>
                {image == null ?
                  <Image source={require('../images/hospital.jpg')} style={styles.profImg} /> :
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
                  <Text style={styles.text}>Ignorar imagem</Text>
                </View>
              </View>
            </View>
          </View>
          {/* Basic info inputs */}
          <View style={styles.row}>
            <Text style={styles.boxTitle}>Informações gerais</Text>
          </View>
          {/* Name input */}
          <View style={styles.rowCenter}>
            <SmallTextInput
              label="Nome"
              value={name}
              updateVar={(text) => onTextInputChange(text, setName)}
              mode="outlined"
              activeOutlineColor={colors.blue}
              outlineColor={colors.gray}
              invalidInput={!nameIsValid}
              errorText={nameErrorMessage}
              style={styles.textInput}
            />
          </View>
          {/* Country input */}
          <View style={styles.rowCenter}>
            <SmallTextInput
              label="País"
              value={country}
              updateVar={(text) => onTextInputChange(text, setCountry)}
              mode="outlined"
              activeOutlineColor={colors.blue}
              outlineColor={colors.gray}
              invalidInput={!countryIsValid}
              errorText={countryErrorMessage}
              style={styles.textInput}
            />
          </View>
          {/* State input */}
          <View style={styles.rowCenter}>
            <SmallTextInput
              label="Estado"
              value={state}
              updateVar={(text) => onTextInputChange(text, setState)}
              mode="outlined"
              activeOutlineColor={colors.blue}
              outlineColor={colors.gray}
              invalidInput={!stateIsValid}
              errorText={stateErrorMessage}
              style={styles.textInput}
            />
          </View>
          {/* City input */}
          <View style={styles.rowCenter}>
            <SmallTextInput
              label="Cidade"
              value={city}
              updateVar={(text) => onTextInputChange(text, setCity)}
              mode="outlined"
              activeOutlineColor={colors.blue}
              outlineColor={colors.gray}
              invalidInput={!cityIsValid}
              errorText={cityErrorMessage}
              style={styles.textInput}
            />
          </View>
          {/* Address input */}
          <View style={styles.rowCenter}>
            <SmallTextInput
              label="Endereço"
              value={address}
              updateVar={(text) => onTextInputChange(text, setAddress)}
              mode="outlined"
              activeOutlineColor={colors.blue}
              outlineColor={colors.gray}
              invalidInput={!addressIsValid}
              errorText={addressErrorMessage}
              style={styles.textInput}
            />
          </View>
          {/* Phone input */}
          <View style={styles.rowCenter}>
            <SmallTextInput
              label="Telefone"
              value={phone}
              updateVar={(text) => onTextInputChange(text, setPhone)}
              mode="outlined"
              activeOutlineColor={colors.blue}
              outlineColor={colors.gray}
              invalidInput={!phoneIsValid}
              errorText={phoneErrorMessage}
              style={styles.textInput}
              mask={[' (', /\d/, /\d/, ') ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
            />
          </View>
          {/* Observation input */}
          <View style={styles.rowCenter}>
            <SmallTextInput
              label="Observações"
              value={observation}
              updateVar={(text) => onTextInputChange(text, setObservation)}
              mode="outlined"
              activeOutlineColor={colors.blue}
              outlineColor={colors.gray}
              multiline={true}
              invalidInput={!observationIsValid}
              errorText={observationErrorMessage}
              style={styles.textInput}
            />
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
          <View style={{ ...styles.row, height: 100 }}>
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
    // borderWidth: 1,
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
  profImg: {
    width: 75,
    height: 75,
    borderRadius: 75 / 2,
    borderWidth: 1,
    borderColor: colors.red,
  },
});
