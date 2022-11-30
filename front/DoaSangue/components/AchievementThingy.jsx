import React, { useState, useEffect } from 'react';
import { StyleSheet, Pressable, View, Text, Image } from 'react-native';
import { ProgressBar } from 'react-native-paper';

import { colors } from '../style/colors';

export default function CampaignThingy(props) {
  const [level, setLevel] = useState(0)
  const [name, setName] = useState(0)
  const [progress, setProgress] = useState(0)
  const [badgeLink, setBadgeLink] = useState('')

  const [loaded, setLoaded] = useState(false)
  const [achievementDataT, setAchievementDataT] = useState(null)
  const achievementData = props.achievementData;
  const profileData = props.profileData;

  useEffect(() => {
    console.log("profileData")
    console.log(profileData)
    console.log("achievementData")
    console.log(achievementData)
    // Get achievement ID
    let currentAchievementId = achievementData['_id'];
    let currentProgress = 0
    let currentLevel = 0
    let currentName = ''
    let goalProgress = 1
    let badgeLink = ''
    // Get Achievement Progress
    for (var i = 0; i < profileData['achievements'].length; i++) {
      if(profileData['achievements'][i]['id'] == currentAchievementId) {
        currentProgress = profileData['achievements'][i]['progress']
      }
    }
    for (var i = 0; i < achievementData['levels'].length; i++) {
      if (currentProgress >= achievementData['levels'][i]['progress'] || i == 0) {
        // setLevel(achievementData['levels'][i]['level_name'])
        setName(`${achievementData.name} ${achievementData['levels'][i]['level_name']}`)
        // setLevel(i + 1)
        currentName = `${achievementData.name} ${achievementData['levels'][i]['level_name']}`
        currentLevel = i + 1
        setLevel(currentLevel)
        setBadgeLink(achievementData['levels'][i]['img_url'])
        badgeLink = achievementData['levels'][i]['img_url']
      }
      if (i == currentLevel || achievementData['levels'].length == currentLevel) {
        goalProgress = achievementData['levels'][i]['progress']
        setProgress(currentProgress / goalProgress)
      }
    }
    console.log(badgeLink)
    setAchievementDataT({
      level: currentLevel,
      name: currentName,
      description: achievementData['description'],
      current_progress: currentProgress,
      progress_required: goalProgress,
      badgeLink: badgeLink,
    })
  }, [])

  useEffect(() => {
    if (achievementDataT !== null) {
      setLoaded(true)
    }
  }, [achievementDataT])

  function navigateToAchievement() {
    props.navigation.navigate('AchievementScreen',
      {
        achievementDataT
      },
    );
  };

  function setLevelColor() {
    const style = {
      marginTop: 3,
      fontSize: 12,
      height: 20,
      width: 53,
      textAlign: 'center',
      paddingTop: 3,
      paddingBottom: 3,
      paddingLeft: 5,
      paddingRight: 5,
      borderRadius: 5,
      backgroundColor: colors.lightGray,
      marginBottom: 33,
    };
    switch (level) {
      case 1:
        style.backgroundColor = colors.lightGray;
        style.color = colors.white;
        break;
      case 2:
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
    <View>
      {loaded ?
        <Pressable onPress={() => props.navigateTo('AchievementsScreen', achievementDataT)} style={styles.outerBox}>
          <Image source={{ uri: badgeLink }} style={styles.achievementIcon} />
          <Text style={styles.title}>{name}</Text>
          <ProgressBar style={styles.progressBar} progress={progress} color={colors.lightRed} />
          <Text style={setLevelColor()}>Nível {level}</Text>
        </Pressable> :
        null
      }
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    // fontWeight: 'bold',
    // fontSize: 15,
    width: 75,
    textAlign: 'center',
  },
  outerBox: {
    alignItems: 'center',
    // width: '33%',
  },
  chipLike: {
    marginTop: 3,
    fontSize: 12,
    textAlign: 'center',
    height: 20,
    width: 75,
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
    width: 293 / 7,
    height: 550 / 7,
    padding: 10,
    // borderRadius: 75 / 2,
    // borderColor: colors.gray,
    // borderWidth: 1,
    // transform: [{ scale: 0.55 }],

  },
  progressBar: {
    height: 6,
    width: 75,
  },
});
