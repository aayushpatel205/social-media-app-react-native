import React from "react";
import { View , TextInput, StyleSheet } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';


const InputField = ({element}) => {
  const value = element.value;
  const setValue = element.setValue;

  return (
      <View style={[inputBoxStyles.inputBox , {borderColor: value ? "#33bc54" : "#d3d3d3",borderWidth: 2}]}>
          <Icon name={element.iconName} size={26} color="#5a5a5a" style={{marginRight: 7}}/>
          <TextInput
            value={value}
            onChangeText={(text) => setValue(text)}
            placeholder={`Enter your ${element.title}...`}
            style={{
              height: "100%",
              width: "85%",
              fontSize: 17,
            }}
          />
        </View>
  );
};

export const inputBoxStyles = StyleSheet.create({
  inputBox: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    height: 60,
    width: "100%",
    borderColor: "#d3d3d3",
    borderWidth: 1,
    borderRadius: 17,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
})

export default InputField;
