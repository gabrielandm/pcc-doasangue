import React, { useState } from 'react';
// import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet, Text, View, Button } from 'react-native';

import HomeScreen from './pages/HomeScreen';
import LoginScreen from './pages/LoginScreen';
import RegistrationScreen from './pages/RegistrationScreen';
import PasswordSendEmail from './pages/PasswordSendEmail';
import CampaignScreen from './pages/CampaignScreen';
import CreateCampaignScreen from './pages/CreateCampaignScreen';
import EditCampaignScreen from './pages/EditCampaignScreen';
import EditProfileScreen from './pages/EditProfileScreen';
import QRCodeReader from './pages/QRCodeReader';
import CampaignReportScreen from './pages/CampaignReportScreen'
import {colors} from './style/colors';

const Stack = createNativeStackNavigator();

function App() {
  const [nameMain, setNameMain] = useState('');
  const [passMain, setPassMain] = useState('');

  console.log(nameMain, passMain);

  return (

      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="LoginScreen"
            component={LoginScreen}
            options={{
              title: 'Log in',
              headerShown: false,
            }}
            initialParams={{ checkedReaseon: false }}
          />
          <Stack.Screen
            name="RegistrationScreen"
            component={RegistrationScreen}
            options={{
              title: 'Criar conta',
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="PasswordSendEmail"
            component={PasswordSendEmail}
            options={{
              title: 'Criar conta',
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="HomeScreen"
            component={HomeScreen}
            options={{
              title: 'DoaSangue',
              headerShown: true,
              headerStyle: {
                backgroundColor: colors.red,
              },
              headerTintColor: colors.white,
            }}
          />
          <Stack.Screen
            name="CampaignScreen"
            component={CampaignScreen}
            options={{
              title: 'DoaSangue',
              headerShown: true,
              headerStyle: {
                backgroundColor: colors.red,
              },
              headerTintColor: colors.white,
            }}
          />
          <Stack.Screen
            name="CreateCampaignScreen"
            component={CreateCampaignScreen}
            options={{
              title: 'DoaSangue',
              headerShown: true,
              headerStyle: {
                backgroundColor: colors.red,
              },
              headerTintColor: colors.white,
            }}
          />
          <Stack.Screen
            name="CampaignReportScreen"
            component={CampaignReportScreen}
            options={{
              title: 'DoaSangue',
              headerShown: true,
              headerStyle: {
                backgroundColor: colors.red,
              },
              headerTintColor: colors.white,
            }}
          />
          <Stack.Screen
            name="EditCampaignScreen"
            component={EditCampaignScreen}
            options={{
              title: 'DoaSangue',
              headerShown: true,
              headerStyle: {
                backgroundColor: colors.red,
              },
              headerTintColor: colors.white,
            }}
          />
          <Stack.Screen
            name="QRCodeReader"
            component={QRCodeReader}
            options={{
              title: 'DoaSangue',
              headerShown: true,
              headerStyle: {
                backgroundColor: colors.red,
              },
              headerTintColor: colors.white,
            }}
          />
          <Stack.Screen
            name="EditProfileScreen"
            component={EditProfileScreen}
            options={{
              title: 'DoaSangue',
              headerShown: true,
              headerStyle: {
                backgroundColor: colors.red,
              },
              headerTintColor: colors.white,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#f0d',
    paddingTop: 50,
    paddingLeft: 10,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
});

export default App;