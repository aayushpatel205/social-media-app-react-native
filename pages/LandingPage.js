import React , {useEffect} from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  StatusBar,
} from "react-native";
import * as NavigationBar from 'expo-navigation-bar';
const LandingPage = ({ navigation }) => {
  useEffect(()=>{
    NavigationBar.setBackgroundColorAsync('#FFFFFF');
  },[])
  return (
      <View style={landingPageStyles.container}>
        <StatusBar backgroundColor={"#fff"} />
        <Image
          source={require("../assets/images/welcome.png")}
          style={landingPageStyles.welcomeImage}
        />
        <View style={{ width: "80%", gap: 15 }}>
          <Text
            style={{
              fontSize: 35,
              fontWeight: "bold",
              textAlign: "center",
              color: "#000",
            }}
          >
            Link Up!
          </Text>
          <Text style={{ textAlign: "center", fontSize: 17 }}>
            Where every thought finds a home and every image tells a story.
          </Text>
        </View>
        <View
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 5,
          }}
        >
          <TouchableWithoutFeedback
            onPress={() => {
              navigation.navigate("SignUp");
            }}
          >
            <View style={landingPageStyles.button}>
              <Text style={landingPageStyles.btnText}>Get Started</Text>
            </View>
          </TouchableWithoutFeedback>
          <Text
            onPress={() => {
              navigation.navigate("Login");
            }}
            style={{ textAlign: "center", fontSize: 17 }}
          >
            Already have an account?{" "}
            <Text style={{ fontWeight: "700", color: "#33BC54" }}>Login </Text>
            <Text onPress={()=>{navigation.navigate("Profile")}}>Profile Page </Text>
            <Text onPress={()=>{navigation.navigate("Edit Profile")}}>Edit Profile Page</Text>
            <Text onPress={()=>{navigation.navigate("Create Post")}}>Create Post</Text>
            <Text onPress={()=>{navigation.navigate("NewPage")}}>App Home Page</Text>
          </Text>
        </View>
      </View>
  );
};

export const landingPageStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 20,
  },
  welcomeImage: {
    height: 288,
    width: 265,
  },
  button: {
    height: 60,
    width: "100%",
    marginTop: 15,
    borderRadius: 15,
    backgroundColor: "#33BC54",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 600,
  },
  btnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "500",
  },
});

export default LandingPage;
