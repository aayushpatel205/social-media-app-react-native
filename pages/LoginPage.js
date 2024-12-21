import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Alert,
  StatusBar,
} from "react-native";
import { landingPageStyles } from "./LandingPage";
import { supabase } from "../lib/supabase";
import * as NavigationBar from "expo-navigation-bar";
import InputField from "../components/InputField";
import { useDispatch } from "react-redux";
import { setSessionData, setProfileImgLink } from "../features/profileSlice";
import { getPublicImageUrl } from "../ImageAddFunction";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import PasswordField from "../components/PasswordField";

const LoginPage = ({ navigation }) => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    NavigationBar.setBackgroundColorAsync("#FFFFFF");
  }, []);

  async function checkFileExists(bucketName, fileName) {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .list("", { search: fileName });

    if (error) {
      console.error("Error listing files:", error);
      return false;
    }

    const fileExists = data.some((file) => file.name === fileName);
    return fileExists;
  }

  const setFieldsToEmpty = () => {
    setEmail("");
    setPassword("");
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
        (async () => {
          const bucketName = "profile images";
          const fileName = `${sessionData?.session.user.id}.jpg`;

          const exists = await checkFileExists(bucketName, fileName);
          dispatch(setProfileImgLink(exists ? getPublicImageUrl("profile images", sessionData) : null));
        })();
        dispatch(setSessionData(sessionData));
        navigation.navigate("RenderPage");
      }
      setFieldsToEmpty();
    }
  }

  return (
    <View style={loginPageStyles.container}>
      <StatusBar backgroundColor="#fff" />
      <View style={loginPageStyles.buttonBox}>
        <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="chevron-left" size={45} color="#000" />
        </TouchableWithoutFeedback>
      </View>
      <View style={{ marginTop: 120 }}>
        <Text style={{ fontSize: 35, fontWeight: "bold", color: "#000" }}>
          Hey,
        </Text>
        <Text style={{ fontSize: 35, fontWeight: "bold", color: "#000" }}>
          Welcome Back
        </Text>
      </View>

      <View style={{ width: "100%", display: "flex", gap: 15 }}>
        <Text style={{ fontSize: 16, marginBottom: 15 }}>
          Please login to continue
        </Text>

        <InputField
        title="Email"
        value={email}
        setValue={setEmail}
        iconName={"envelope"}
        />

        {/* Password Field */}
        <PasswordField
          value={password}
          setValue={setPassword}
        />
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
    top: 50,
    left: 20,
  },
});

export default LoginPage;
