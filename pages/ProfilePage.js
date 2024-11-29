import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  Image,
  TouchableOpacity,
  Button,
} from "react-native";
import { loginPageStyles } from "./LoginPage";
import { useSelector, useDispatch } from "react-redux";
import * as NavigationBar from "expo-navigation-bar";
import FeatherIcon from 'react-native-vector-icons/Feather';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { changeNavigation } from "../features/navigationSlice";

const ProfilePage = ({ navigation }) => {
  //sessionData?.session.user.id
  const dispatch = useDispatch();
  const isChanged = useSelector((state) => state?.isChangedReducer.value);
  const profileData = useSelector((state) => state?.profileReducer);
  const userId = profileData?.sessionData?.session.user.id;
  const imgPath = profileData?.profileImg
    ? {
        uri: profileData?.profileImg,
      }
    : require("../assets/icons/user.png");

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#fff",
        flexDirection: "column",
        display: "flex",
        paddingVertical: 10,
      }}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <View style={loginPageStyles.buttonBox}>
          <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
            <FeatherIcon name="chevron-left" size={38}/>
            {/* <Image
              source={require("../assets/icons/left-arrow.png")}
              style={{ height: 25, width: 25 }}
            /> */}
          </TouchableWithoutFeedback>
        </View>
        <Text
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: "#000",
            paddingTop: 20,
          }}
        >
          Profile
        </Text>

        <View
          style={{
            position: "absolute",
            right: 20,
            top: 17,
            backgroundColor: "#d3d3d3",
            height: 45,
            width: 45,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 12,
          }}
        >
          <TouchableOpacity>
              <FontAwesomeIcon name="sign-out" size={30} style={{marginLeft: 6}}/>

            {/* <Image
              source={require("../assets/icons/power-button.png")}
              style={{
                height: 32,
                width: 30,
              }}
            /> */}
          </TouchableOpacity>
        </View>
      </View>
      <View style={profilePageStyles.profileBox}>
        <Image
          source={imgPath}
          style={{ height: 100, width: 100, borderRadius: 50 }}
        />
      </View>
      <Text
        style={{
          fontSize: 30,
          fontWeight: 700,
          textAlign: "center",
          marginBottom: 2,
          marginTop: 10,
        }}
      >
        {profileData?.userDisplayName}
      </Text>
      <Text
        style={{
          fontSize: 22,
          color: "#9e9e9e",
          textAlign: "center",
          fontWeight: 700,
        }}
      >
        {profileData?.userAddress}
      </Text>

      {/* <TouchableOpacity
        onPress={() => {
          dispatch(changeNavigation("EditProfile"));
        }}
      >
        <View
          style={{
            width: "35%",
            alignSelf: "center",
            height: 32,
            marginTop: 15,
            borderRadius: 7,
            backgroundColor: "#33bc54",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: 600, color: "#fff" }}>
            Edit Profile
          </Text>
        </View>
      </TouchableOpacity> */}

      {/* <View
        style={{
          width: "50%",
          marginVertical: 10,
          alignSelf: "center",
          height: 25,
        }}
      ></View> */}

      <View style={{ padding: 20 }}>
        <View
          style={{
            display: "flex",
            gap: 10,
            flexDirection: "row",
            alignItems: "center",
            marginVertical: 12,
          }}
        >
          <FontAwesomeIcon name="envelope" size={27} color="#9e9e9e" />
          <Text style={{ fontSize: 17, color: "#9e9e9e", fontWeight: "600" }}>
            {profileData?.sessionData?.session.user.email}
          </Text>
        </View>

        <View
          style={{
            display: "flex",
            gap: 10,
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <FontAwesomeIcon name="phone" size={27} color="#9e9e9e" />
          <Text style={{ fontSize: 17, color: "#9e9e9e", fontWeight: "600" }}>
            {profileData?.userNumber}
          </Text>
        </View>

        <View
          style={{
            display: "flex",
            gap: 10,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <FontAwesomeIcon name="user" size={27} color="#9e9e9e" />
          <Text style={{ fontSize: 17, color: "#9e9e9e", fontWeight: "600" }}>
            {profileData?.userBio}
          </Text>
        </View>
      </View>
    </View>
  );
};

export const profilePageStyles = StyleSheet.create({
  profileBox: {
    width: 100,
    height: 100,
    marginTop: 25,
    alignSelf: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#d3d3d3",
    position: "relative",
  },
  inputView: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "70%",
    borderBottomWidth: 2,
    borderBottomColor: "#33bc54",
  },
  inputBox: {
    height: 40,
    padding: 7,
    fontSize: 16,
    color: "#9e9e9e",
    fontWeight: "600",
    width: "90%",
  },
});

export default ProfilePage;
