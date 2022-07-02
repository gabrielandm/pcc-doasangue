import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Button, Chip, IconButton } from 'react-native-paper';

import { colors } from '../style/colors';
import { config } from '../config/config';

export default function QRCodeReader({ navigation, route }) {

  return (
    <Text>Mousse report</Text>
  )
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.white,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  column: {
    flexDirection: 'column',
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
  rowCenterQR: {
    width: Dimensions.get('window').width * 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 33,
    marginBottom: 33,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 3,
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
    fontSize: 14,
    marginTop: 2,
    lineHeight: 20,
  },
  textCenter: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 3,
    marginLeft: 45,
    marginRight: 45,

  },
  iconButton: {
    margin: 0,
  },
});
