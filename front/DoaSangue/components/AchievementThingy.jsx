import React, { useState, useEffect } from 'react';
import { StyleSheet, Pressable, View, Text, Image } from 'react-native';
import { ProgressBar } from 'react-native-paper';

import { colors } from '../style/colors';

export default function CampaignThingy(props) {
  const data = props.data;

  function navigateToAchievement() {
    props.navigation.navigate('AchievementScreen',
      {
        data: data
      },
    );
  };

  function setLevelColor() {
    const style = {
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
    };
    switch (data.level) {
      case 0:
        style.backgroundColor = colors.lightGray;
        break;
      case 1: case 2: case 3:
        style.backgroundColor = colors.lightRed;
        style.color = colors.white
        break;
      default:
        style.backgroundColor = colors.red;
        style.color = colors.white;
        break;
    }
    return style;
  }

  return (
    <Pressable onPress={() => props.navigateTo('AchievementsScreen', props.data)} style={styles.outerBox}>
      <Image source={require('../images/no-level-bw.png')} style={styles.achievementIcon} />
      <Text style={styles.title}>{data.base_name}</Text>
      <ProgressBar style={styles.progressBar} progress={0.33} color={colors.lightRed} />
      <Text style={setLevelColor()}>Nível {data.level}</Text>
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
    width: '33%',
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
    borderRadius: 75 / 2,
    borderColor: colors.gray,
    borderWidth: 1,
  },
  progressBar: {
    height: 6,
    width: 75,
  },
});
