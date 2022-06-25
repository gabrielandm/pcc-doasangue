import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { TextInput, HelperText } from 'react-native-paper';
import { Provider as PaperProvider } from "react-native-paper";
import MaskInput from 'react-native-mask-input';

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
		-> errorText: string - text of the error text (will be able to appear if hasErrorText is true)
	*/
	return (
		<View >
			{props.mask !== undefined ? (
				<TextInput
					label={props.label}
					render={props =>
						<MaskInput
							value={props.globalProps.value}
							mask={props.globalProps.mask}
							onChangeText={(masked, unmasked) => {
								props.globalProps.updateVar(unmasked);
							}}
							placeholderFillCharacter={'0'}
							style={!props.globalProps.style !== undefined ? props.style : {}}
						/>
					}
					value={props.value != '' ? props.value : ' '}
					secureTextEntry={props.isPassword !== undefined ? props.isPassword : false}
					mode={props.mode !== undefined ? props.mode : 'outlined'}
					activeOutlineColor={props.invalidInput !== undefined ? !props.invalidInput ? colors.blue : colors.lightRed : colors.blue}
					outlineColor={!props.invalidInput ? colors.gray : colors.red}
					style={!props.style !== undefined ? props.style : {}}
					// All props from the main component
					globalProps={props}
				/>) :
				(<TextInput
					label={props.label}
					value={props.value}
					onChangeText={text => props.updateVar(text)}
					secureTextEntry={props.isPassword !== undefined ? props.isPassword : false}
					mode={props.mode !== undefined ? props.mode : 'outlined'}
					activeOutlineColor={props.invalidInput !== undefined ? !props.invalidInput ? colors.blue : colors.lightRed : colors.blue}
					outlineColor={!props.invalidInput ? colors.gray : colors.red}
					style={!props.style !== undefined ? props.style : {}}
				/>
				)}
			{props.errorText !== undefined ? (props.errorText.length > 0 ?
				<View>
					<HelperText type="error" visible={true}>
						{props.errorText.join('\n')}
					</HelperText>
				</View> : null)
				: null}

		</View>
	);
}
