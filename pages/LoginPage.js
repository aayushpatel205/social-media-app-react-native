import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  Alert,
  StatusBar,
} from "react-native";
import { landingPageStyles } from "./LandingPage";
import { supabase } from "../lib/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as NavigationBar from "expo-navigation-bar";
import InputField from "../components/InputField";
import { useDispatch } from "react-redux";
import { setSessionData , setProfileImgLink } from "../features/profileSlice";
import { getPublicImageUrl } from "../ImageAddFunction";

const LoginPage = ({ navigation }) => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const loginFieldsArray = [
    {
      title: "Email",
      value: email,
      setValue: setEmail,
      iconName: "envelope",
    },
    {
      title: "Password",
      value: password,
      setValue: setPassword,
      iconName: "lock",
    },
  ];

  useEffect(() => {
    NavigationBar.setBackgroundColorAsync("#FFFFFF");
  }, []);

  const setFieldsToEmpty = () => {
    setEmail("");
    setPassword("");
  };

  const storeSession = async (session) => {
    try {
      await AsyncStorage.setItem("userSession", JSON.stringify(session));
    } catch (error) {
      console.error("Error storing session:", error);
    }
  };

  async function signInWithEmail() {
    if (!email || !password) {
      Alert.alert("Please enter both email and password !");
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        Alert.alert(error.message);
      } else {
        const { data: sessionData, error: sessionError } =
          await supabase.auth.getSession();
        await storeSession(sessionData.session);
        const publicUrl = getPublicImageUrl("profile images", sessionData);
        dispatch(setSessionData(sessionData));
        dispatch(setProfileImgLink(publicUrl));
        console.warn("Session stored successfully !!");
        navigation.navigate("RenderPage");
      }
      setFieldsToEmpty();
    }
    // setLoading(true);
  }

  return (
    <View style={loginPageStyles.container}>
      <StatusBar backgroundColor="#fff" />
      <View style={loginPageStyles.buttonBox}>
        <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
          <Image
            source={require("../assets/icons/left-arrow.png")}
            style={{ height: 25, width: 25 }}
          />
        </TouchableWithoutFeedback>
      </View>
      <View style={{ marginTop: 110 }}>
        <Text style={{ fontSize: 35, fontWeight: "bold", color: "#000" }}>
          Hey,
        </Text>
        <Text style={{ fontSize: 35, fontWeight: "bold", color: "#000" }}>
          Welcome Back
        </Text>
      </View>

      {/* <Button title="click" onPress={() => setModalVisible(true)}/> */}

      <View style={{ width: "100%", display: "flex", gap: 15 }}>
        <Text style={{ fontSize: 16, marginBottom: 15 }}>
          Please login to continue
        </Text>

        {loginFieldsArray.map((element, index) => {
          return <InputField element={element} key={index} />;
        })}
        <Text
          style={{
            textAlign: "right",
            fontSize: 15,
            fontWeight: "600",
            marginBottom: -20,
          }}
        >
          Forgot Password?
        </Text>
        <TouchableWithoutFeedback onPress={() => signInWithEmail()}>
          <View style={landingPageStyles.button}>
            <Text style={landingPageStyles.btnText}>Login</Text>
          </View>
        </TouchableWithoutFeedback>

        <Text
          onPress={() => {
            navigation.navigate("SignUp");
          }}
          style={{ textAlign: "center", fontSize: 17 }}
        >
          Don't have an account?{" "}
          <Text style={{ fontWeight: "700", color: "#33BC54" }}>Sign Up</Text>
        </Text>
      </View>
    </View>
  );
};

export const loginPageStyles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    gap: 15,
  },
  buttonBox: {
    backgroundColor: "#d3d3d3",
    height: 45,
    width: 45,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 20,
    left: 20,
  },
});

export default LoginPage;
