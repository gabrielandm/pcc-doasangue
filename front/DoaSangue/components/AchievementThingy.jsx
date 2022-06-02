import React, { useState } from 'react';
import { StyleSheet, Pressable, View, Text, Image } from 'react-native';
import { ProgressBar } from 'react-native-paper';

import { colors } from '../style/colors';

export default function CampaignThingy(props) {
  const data = props.data;

  return (
    <Pressable onPress={() => {console.log('mousse')}} style={styles.outerBox}>
      <Image source={require('../images/no-level-bw.png')} style={styles.achievementIcon}/>
      <Text style={styles.title}>Mousse Mousse</Text>
      <ProgressBar style={styles.progressBar} progress={0.33} color={colors.lightRed} />
      <Text style={styles.chipLike}>Nível 0</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  title: {
    // fontWeight: 'bold',
    // fontSize: 15,
  },
  outerBox: {
    alignItems: 'center',
  },
  chipLike: {
    marginTop: 3,
    fontSize: 12,
    height: 20,
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft: 5,
    paddingRight: 5,
    borderRadius: 5,
    backgroundColor: colors.lightGray,
    marginBottom: 33,
  },
  achievementIcon: {
    margin: 3,
    width: 75,
    height: 75,
    borderRadius: 75/2,
    borderColor: colors.gray,
    borderWidth: 1,
  },
  progressBar: {
    height: 6,
    width: 75,
  },
});
