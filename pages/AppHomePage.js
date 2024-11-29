import React, { useEffect } from "react";
import {
  Text,
  View,
  Image,
  TouchableWithoutFeedback,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "../lib/supabase";
import { useDispatch } from "react-redux";
import { setUserDetails } from "../features/profileSlice";
import * as NavigationBar from 'expo-navigation-bar';
import { getPublicImageUrl } from "../ImageAddFunction";
import Icon from 'react-native-vector-icons/FontAwesome';
import CustomNavigationTab from "../components/CustomNavigationTab";


const AppHomePage = ({ navigation }) => {

  const dispatch = useDispatch();
  const restoreSession = async () => {
    try {
      const sessionData = await AsyncStorage.getItem("userSession");
      if (sessionData) {
        const session = JSON.parse(sessionData);

        // Extract access and refresh tokens
        const { access_token, refresh_token } = session;

        if (access_token && refresh_token) {
          // Set the session with access and refresh tokens
          const { data, error } = await supabase.auth.setSession({
            access_token: access_token,
            refresh_token: refresh_token,
          });

          if (error) {
            console.error("Error restoring session:", error.message);
          }
        } else {
          console.warn("Missing access or refresh token in session.");
        }
      }
    } catch (error) {
      console.error("Error restoring session:", error);
    }
  };

  useEffect(() => {
    NavigationBar.setBackgroundColorAsync('#FFFFFF');
    restoreSession();
    const getData = async (id) => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .limit(1);
      if (error) {
        console.log("Error: ", error);
      }
      dispatch(setUserDetails(data[0]));
    };
    getData(23456);
  }, []);
  return (
    <SafeAreaView style={{ flex: 1,backgroundColor: "#fff",paddingVertical: 5,zIndex: -10}}>
      <View
        style={{
          paddingTop: 20,
          paddingHorizontal: 20, 
          height: 60,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text style={{ fontSize: 30, fontWeight: 700 }}>LinkUp</Text>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 15,
            alignItems: "center",
          }}
        >
          <Icon name="heart-o" size={28} color="#000"/>

          <TouchableWithoutFeedback>
            <Icon name="paper-plane-o" size={28} color="#000"/>
          </TouchableWithoutFeedback>

          {/* <TouchableWithoutFeedback
            onPress={() => navigation?.navigate("Profile")}
          >
            <View style={styles.profileBox}>
              <Image
                source={require("../assets/icons/avatar.png")}
                style={{ height: 22, width: 22 }}
              />
            </View>
          </TouchableWithoutFeedback> */}
        </View>
      </View>
      <CustomNavigationTab navigation={navigation}/>
    </SafeAreaView>
  );
};

export default AppHomePage;

const styles = StyleSheet.create({
  profileBox: {
    height: 34,
    width: 34,
    borderwidth: 1,
    borderColor: "#d2d2d2",
    display: "flex",
    backgroundColor: "#d3d3d3",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
  },
});
