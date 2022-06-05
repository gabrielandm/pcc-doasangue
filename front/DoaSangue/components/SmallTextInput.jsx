import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { TextInput } from 'react-native-paper';
import { Provider as PaperProvider } from "react-native-paper";

import {colors} from '../style/colors';

export default function SmallTextInput(props) {
	return (
		<View >
			<TextInput
				label={props.label}
				value={props.value}
				onChangeText={text =>props.updateVar(text)}
				// style={styles.input}
				secureTextEntry={props.isPassword !== undefined ? props.isPassword : false}
				mode={props.mode !== undefined ? props.mode : 'outlined'}
				activeOutlineColor={props.invalidInput !== undefined ? !props.invalidInput ? colors.blue : colors.lightRed : colors.blue}
				outlineColor={!props.invalidInput ? colors.gray : colors.red}
				style={!props.style !== undefined ? props.style : {}}
			/>
		</View>
	);
}
