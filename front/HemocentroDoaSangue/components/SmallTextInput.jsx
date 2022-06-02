import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { TextInput, HelperText } from 'react-native-paper';
import { Provider as PaperProvider } from "react-native-paper";

import { colors } from '../style/colors';

export default function SmallTextInput(props) {
	/* Props documentation
		-> label: string - label of the input (like a placeholder)
		-> value: string - value of the input
		-> updateVar: function - function to update the value of the input
		-> multiline: boolean - if the input is multiline
		-> invalidInput: boolean - if the input is invalid (will make input set a style of error, all red)
		-> isPassword: boolean - if the input is a password (will make the input show a * instead of the value)
		-> style: object - style of the input
		-> hasErrorText: boolean - if the input has an error text (will make the input show an error text if is invalid, it renders the HelperText)
		-> errorFunction: function - function to update the error status of the input
		-> errorText: string - text of the error text (will be able to appear if hasErrorText is true)
	*/
	return (
		<View >
			<TextInput
				label={props.label}
				value={props.value}
				onChangeText={text => props.updateVar(text)}
				multiline={props.multiline ? true : false}
				error={props.invalidInput ? true : false}
				secureTextEntry={props.isPassword}
				mode='outlined'
				activeOutlineColor={colors.blue}
				outlineColor={colors.gray}
				style={props.style}
			/>
			{(props.hasErrorText !== undefined && props.hasErrorText === true) ??
				<View>
					<HelperText type="error" visible={() => props.errorFunction(props.value)}>
						{props.errorText}
					</HelperText>
				</View>
			}
		</View>
	);
}
