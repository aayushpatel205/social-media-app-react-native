import React, { useState } from 'react'
import { View, TextInput } from 'react-native'
import { inputBoxStyles } from './InputField'
import Icon from "react-native-vector-icons/FontAwesome";

const PasswordField = ({ value, setValue }) => {
    const [isSecure, setIsSecure] = useState(true);
    return (
        <View style={[inputBoxStyles.inputBox, { borderColor: value ? "#33bc54" : "#d3d3d3", borderWidth: 2 }]}>
            <Icon name={isSecure ? "eye-slash" : "eye"} size={26} color="#5a5a5a" style={{ marginRight: 7 }} onPress={() => {
                setIsSecure(!isSecure)
            }} />
            <TextInput
                secureTextEntry={isSecure}
                value={value}
                onChangeText={(text) => setValue(text)}
                placeholder={`Enter your password...`}
                style={{
                    height: "100%",
                    width: "85%",
                    fontSize: 17,
                }}
            />
        </View>
    )
}

export default PasswordField