// import React,{FC} from 'react'
// import { View, TouchableOpacity,StyleSheet } from 'react-native'
// import { Input, StyledProps } from 'native-base'
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// interface TextInputProps  {
//   placeholder:string
// placeholderTextColor:string
// onChangeText:() => void
// onEndEditing: () => void
// isSecure :boolean
// textValue:string
// leftIconName:string
// leftIconSize:number
// leftIconColor:string
// rightIconName:string
// rightIconSize:number
// rightIconColor:string
// leftIcon:boolean
// rightIcon:boolean
// keyboardType:string
// inputContainerStyle:StyledProps
// }

// export const TextInput: FC<TextInputProps> = (props) => {

//   return (
//       <View style={[styles.container, props.inputContainerStyle]}>
//         {leftIcon && (
//           <Icon
//             name={props.leftIconName}
//             size={props.leftIconSize}
//             color={props.leftIconColor}
//             style={styles.leftIconStyle}
//           />
//         )}
//         <Input w={{
//       base: "75%",
//       md: "25%"
//     }} InputLeftElement={<Icon name="person" />} size={5} ml="2" color="muted.400" />} placeholder="Name" />

//         <TextInput
//           editabl1`````e={editable}
//           style={[styles.textInputStyle, { color: colors.text }]}
//           placeholder={placeholder}
//           placeholderTextColor={placeholderTextColor}
//           onChangeText={onChangeText}
//           onEndEditing={onEndEditing}
//           value={textValue}
//           secureTextEntry={showPW}
//           autoCapitalize="none"
//           keyboardType={keyboardType}
//         />
//         {isSecure && rightIcon && (
//           <TouchableOpacity
//             activeOpacity={0.5}
//             onPress={() => setShowPW(!showPW)}
//           >
//             <Icon
//               name={showPW ? 'eye-off' : 'eye'}
//               size={rightIconSize}
//               color={rightIconColor}
//             />
//           </TouchableOpacity>
//         )}
//         {rightIcon && (
//           <TouchableOpacity
//             activeOpacity={0.5}
//             onPress={() => setShowPW(!showPW)}
//           >
//             <Icon
//               name={rightIconName}
//               size={rightIconSize}
//               color={rightIconColor}
//             />
//           </TouchableOpacity>
//         )}
//       </View>
//     );
// }

// const styles = StyleSheet.create({
//   container: {
//     height: 50,
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginVertical: 10,
//     paddingHorizontal: 10,
//     backgroundColor: '#fff',
//     borderRadius: 5,
//   },
//   textInputStyle: {
//     flex: 1,
//     marginLeft: 10,
//     fontSize: 16,
//   },
//   leftIconStyle: {
//     marginLeft: 5,
//   },
// });
