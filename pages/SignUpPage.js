import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableWithoutFeedback,
  Image,
  Alert,
} from "react-native";
import { loginPageStyles } from "./LoginPage";
import { landingPageStyles } from "./LandingPage";
import { supabase } from "../lib/supabase";
import * as NavigationBar from 'expo-navigation-bar';
import InputField from "../components/InputField";
import Toast from "react-native-toast-message";

const SignUpPage = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [phoneNumber , setPhoneNumber] = useState("");

  const signUpFieldsArray = [
    {
      title: "Username",
      value: username,
      setValue: setUsername,
      iconName: "user"
    },
    {
      title: "Email",
      value: email,
      setValue: setEmail,
      iconName: "envelope"
    },
    {
      title: "Password",
      value: password,
      setValue: setPassword,
      iconName: "lock"
    },
    {
      title: "Phone Number",
      value: phoneNumber,
      setValue: setPhoneNumber,
      iconName: "phone"
    },
  ]

  const setFunc = () => {
    setEmail(email.trim());
    setPassword(password.trim());
    setUsername(username.trim());
  };

  const setFieldsToEmpty = () => {
    setEmail("");
    setPassword("");
    setUsername("");
    setPhoneNumber("");
  };

  useEffect(()=>{
    NavigationBar.setBackgroundColorAsync('#FFFFFF');
  },[])

  async function signUpWithEmail() {
    if (!email || !password || !username || !phoneNumber) {
      Toast.show({
        type: "error",
        text1: "Please fill all the fields",
      })
    } else {
      setFunc();
      const { data: error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data:{
            username: username,
            phoneNumber: phoneNumber
          }
        }
      });

      if (error) {
        console.warn("The error is: ",error)
        Alert.alert("Not created");
      } else {
        Alert.alert("Account created !!");
        navigation.navigate("Login");
      }
      setFieldsToEmpty();

      // if (!session)
      //   Alert.alert("Please check your inbox for email verification!");
    }
    // setLoading(true)

    // setLoading(false)
  }

  const [passwordIsVisible, setPasswordIsVisible] = useState(false);
  const imgPath = passwordIsVisible
    ? require("../assets/icons/unlock.png")
    : require("../assets/icons/lock.png");
  return (
    <View style={loginPageStyles.container}>
      <View style={loginPageStyles.buttonBox}>
        <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
          <Image
            source={require("../assets/icons/left-arrow.png")}
            style={{ height: 25, width: 25 }}
          />
        </TouchableWithoutFeedback>
      </View>
      <View style={{ marginTop: 100 }}>
        <Text style={{ fontSize: 35, fontWeight: "bold", color: "#000" }}>
          Create an account,
        </Text>
        <Text style={{ fontSize: 35, fontWeight: "bold", color: "#000" }}>
          Join the Link Up Community!
        </Text>
      </View>

      <View style={{ width: "100%", display: "flex", gap: 15 }}>
        <Text style={{ fontSize: 16, marginBottom: 15 }}>
          Please sign up to continue
        </Text>

        {
          signUpFieldsArray.map((element,index) => {
            return <InputField element={element} key={index}/>
          })
        }
        <TouchableWithoutFeedback onPress={() => signUpWithEmail()}>
          <View style={[landingPageStyles.button]}>
            <Text style={landingPageStyles.btnText}>Sign Up</Text>
          </View>
        </TouchableWithoutFeedback>

        <Text
          onPress={() => {
            navigation.navigate("Login");
          }}
          style={{ textAlign: "center", fontSize: 17 }}
        >
          Already have an account?{" "}
          <Text style={{ fontWeight: "700", color: "#33BC54" }}>Login</Text>
        </Text>
      </View>
      <Toast text1Style={{ fontSize: 17 }} />
    </View>
  );
};

export default SignUpPage;
