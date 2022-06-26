import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { TextInput, HelperText } from 'react-native-paper';
import { Provider as PaperProvider } from "react-native-paper";
import MaskInput from 'react-native-mask-input';

import { colors } from '../style/colors';

export default function SmallTextInput(props) {
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
					multiline={!props.multiline !== undefined ? props.multiline : false}
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
					multiline={!props.multiline !== undefined ? props.multiline : false}
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
