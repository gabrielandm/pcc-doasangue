import React, { useState } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { Button, Chip, IconButton } from 'react-native-paper';

import { colors } from '../style/colors';

export default function ProfileThingy(props) {
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
            <Image style={styles.profImg} source={require('../images/cat-prof.jpg')} />
          </View>
          <View style={styles.column}>
            <View style={styles.rowCenter}>
              <Text style={styles.infoHeader}>Nome:</Text>
              <Text style={styles.infoText}>Mousse de Chocolate</Text>
            </View>
            <View style={styles.rowCenter}>
              <Text style={styles.infoHeader}>Tipo sanguineo:</Text>
              <Text style={styles.infoText}>O+</Text>
            </View>
            <View style={styles.rowCenter}>
              <Text style={styles.infoHeader}>Dias para poder doar:</Text>
              <Text style={styles.infoText}>33 dias</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Other info */}
      <View style={styles.outerBox}>
        <View style={styles.rowHeader}>
          <Text style={styles.title}>Outras informações:</Text>
          <IconButton icon="square-edit-outline" size={textSize} onPress={() => openEditPage('EditOtherInfoScreen')} />
        </View>
        <View style={styles.row}>
          <View style={styles.column}>
            <View style={styles.rowCenter}>
              <Text style={styles.infoHeader}>Última doação:</Text>
              <Text style={styles.infoText}>12/06/2022</Text>
            </View>
            <View style={styles.rowCenter}>
              <Text style={styles.infoHeader}>Genêro:</Text>
              <Text style={styles.infoText}>Feminino</Text>
            </View>
            <View style={styles.rowCenter}>
              <Text style={styles.infoHeader}>Data de nscimento:</Text>
              <Text style={styles.infoText}>12/06/2000</Text>
            </View>
            <View style={styles.rowCenter}>
              <Text style={styles.infoHeader}>Idade:</Text>
              <Text style={styles.infoText}>33 anos</Text>
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
              <Text style={styles.infoText}>3</Text>
            </View>
            <View style={styles.rowCenter}>
              <Text style={styles.infoHeader}>Postos diferentes:</Text>
              <Text style={styles.infoText}>3</Text>
            </View>
            <View style={styles.rowCenter}>
              <Text style={styles.infoHeader}>Volume total doado:</Text>
              <Text style={styles.infoText}>3.000 ml</Text>
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
