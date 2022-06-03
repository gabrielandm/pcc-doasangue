import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, SafeAreaView, Image } from 'react-native';
import { ProgressBar } from 'react-native-paper';

import { colors } from '../style/colors';
import { config } from '../config/config';
import CampaignThingy from '../components/CampaignThingy';
import ProfileThingy from '../components/ProfileThingy';
import AchievementThingy from '../components/AchievementThingy';

export default function HomeScreen({ navigation, route }) {
  /* Variables and functions */
  const [data, setData] = useState(route.params.data);
  const options = { year: '2-digit', month: '2-digit', day: '2-digit' };
  let dateObtained = false
  if (data.date_obtained != undefined) {
    dateObtained = new Date(data.date_obtained);
  }

  function setColors(style, inputType) {
    switch (data.level) {
      case 0:
        if (inputType == 'image') {
          return {
            ...style,
            borderColor: colors.gray,
          };
        } else if (inputType == 'chipLike') {
          return {
            ...style,
            backgroundColor: colors.lightGray,
          };
        } else if (inputType == 'progressBar') {
          return colors.red;
        }
      case 1:
        if (inputType == 'image') {
          return {
            ...style,
            borderColor: colors.red1,
          };
        } else if (inputType == 'chipLike') {
          return {
            ...style,
            backgroundColor: colors.red1,
          };
        } else if (inputType == 'progressBar') {
          return colors.red;
        }
      case 2:
        if (inputType == 'image') {
          return {
            ...style,
            borderColor: colors.red2,
          };
        } else if (inputType == 'chipLike') {
          return {
            ...style,
            backgroundColor: colors.red2,
          };
        } else if (inputType == 'progressBar') {
          return colors.red;
        }
      default:
        if (inputType == 'image') {
          return {
            ...style,
            borderColor: colors.red,
          };
        } else if (inputType == 'chipLike') {
          return {
            ...style,
            backgroundColor: colors.red,
          };
        } else if (inputType == 'progressBar') {
          return colors.red;
        }
    }
  }

  return (
    <SafeAreaView style={styles.screen} >
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          <Text style={styles.achievementTitle}>{data.base_name}</Text>
          <Image source={require('../images/no-level-bw.png')} style={setColors(styles.achievementIcon, 'image')} />
          <Text style={setColors(styles.chipLike, 'chipLike')}>Nível {data.level}</Text>
          <Text style={styles.achievementDescription}>{data.description}</Text>

          <View style={styles.progressContainer}>
            <Text style={styles.progressLabel}>{data.level_description}</Text>
            <ProgressBar style={styles.progressBar} progress={data.current_progress / data.progress_required} color={setColors(null, 'progressBar')} />
            <Text style={styles.progressLabel}>{data.current_progress} / {data.progress_required}</Text>
          </View>

          {dateObtained !== false &&
            <View style={styles.extraInfoContainer} >
              <Text style={styles.extraInfoTitle}>Último nível obtido em:</Text>
              <Text style={styles.extraInfoLabel}>{dateObtained.toLocaleDateString("pt-BR", options)}</Text>
            </View>
          }
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scrollView: {
    paddingTop: 15,
    paddingBottom: 30,
  },
  container: {
    // flex: 15,
    // paddingTop: StatusBar.currentHeight,
    alignItems: 'center',
  },
  bottom: {
    flexBasis: 50,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  rowWrap: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  achievementTitle: {
    fontSize: 23,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
  },
  achievementIcon: {
    margin: 3,
    width: 225,
    height: 225,
    borderRadius: 225 / 2,
    borderColor: colors.gray,
    borderWidth: 2,
    resizeMode: 'cover',
  },
  chipLike: {
    marginTop: 6,
    fontSize: 18,
    height: 30,
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft: 8,
    paddingRight: 8,
    borderRadius: 8,
    backgroundColor: colors.lightGray,
    // marginBottom: 33,
  },
  achievementDescription: {
    fontSize: 16,
    textAlign: 'center',
    paddingLeft: 30,
    paddingRight: 30,
    marginTop: 10,
    marginBottom: 10,
  },
  progressBar: {
    height: 8,
    width: 233,
    borderRadius: 8,
  },
  progressContainer: {
    backgroundColor: colors.extraLightGray,
    paddingTop: 10,
    paddingBottom: 7,
    paddingLeft: 30,
    paddingRight: 30,
    borderRadius: 10,
  },
  progressLabel: {
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 3,
  },
  extraInfoTitle: {
    marginTop: 6,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  extraInfoLabel: {
    fontSize: 16,
    textAlign: 'center',
  },
});
