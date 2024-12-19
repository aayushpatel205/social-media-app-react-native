import React, { useEffect, useState } from "react";
import CustomNavigationTab from "../components/CustomNavigationTab";
import {
  View,
  TouchableWithoutFeedback,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  _Image,
  KeyboardAvoidingView,
  ScrollView,
  Keyboard,
} from "react-native";
import { loginPageStyles } from "./LoginPage";
import { profilePageStyles } from "./ProfilePage";
import InputField from "../components/InputField";
import { supabase } from "../lib/supabase";
import { useDispatch, useSelector } from "react-redux";
import { setUserDetails } from "../features/profileSlice";
import { landingPageStyles } from "./LandingPage";
import { addImage } from "../ImageAddFunction";
import { setProfileImgLink } from "../features/profileSlice";
import Toast from "react-native-toast-message";
import Icon from "react-native-vector-icons/FontAwesome";

const EditProfilePage = ({ navigation }) => {
  const sessionData = useSelector((state) => state.profileReducer?.sessionData);
  const data = useSelector((state) => state.profileReducer);
  const dispatch = useDispatch();
  const [userNumber, setUserNumber] = useState(data?.userNumber);
  const [userBio, setUserBio] = useState(data?.userBio);
  const [userAddress, setUserAddress] = useState(data?.userAddress);
  const [userDisplayName, setUserDisplayName] = useState(data?.userDisplayName);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);


  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardVisible(true);
    });

    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardVisible(false);
    });
    console.log("data: ", data?.userBio);
    console.log("data 2: ",data?.userAddress)

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  // Function to pick an image and upload it as ArrayBuffer
  // Function to pick an image, compress it, and upload it as ArrayBuffer

  // Function to pick an image, compress it, and upload it as ArrayBuffer
  //
  // addImage();

  const titleArray = [
    {
      title: "Display Name",
      value: userDisplayName,
      setValue: setUserDisplayName,
      iconName: "user",
    },
    {
      title: "Number",
      value: userNumber,
      setValue: setUserNumber,
      iconName: "phone",
    },
    {
      title: "Bio",
      value: userBio,
      setValue: setUserBio,
      iconName: "id-card",
    },
    {
      title: "Address",
      value: userAddress,
      setValue: setUserAddress,
      iconName: "map-marker",
    },
  ];
  return (
    <>
      <ScrollView
        style={{
          flexGrow: 1,
          backgroundColor: "#fff",
          flexDirection: "column",
          display: "flex",
          paddingBottom: 100,
        }}
      >
        <Text
          style={{
            alignSelf: "center",
            fontSize: 32,
            fontWeight: 700,
            color: "#000",
            paddingTop: 20,
          }}
        >
          Edit Profile
        </Text>

        <View style={profilePageStyles.profileBox}>
          {data.profileImg ? (
            <Image
              source={{ uri: data?.profileImg }}
              resizeMode="cover"
              style={{ height: 100, width: 100, borderRadius: 50 }}
            />
          ) : (
            <Icon name="user" size={65} color="#666" />
          )}
          <TouchableWithoutFeedback
            onPress={() => {
              addImage(
                sessionData,
                "profile images",
                dispatch,
                setProfileImgLink,
                null
              );
            }}
          >
            <View style={{ position: "absolute", bottom: -18 }}>
              <Image
                source={require("../assets/icons/pen.png")}
                style={{ height: 27, width: 27 }}
              />
              {/* <Icon name="trash" size={30} color={"red"}/> */}
            </View>
          </TouchableWithoutFeedback>
        </View>

        <TouchableOpacity
          onPress={async () => {
            if (data?.profileImg === null) {
              Toast.show({
                type: "success",
                text1: "Profile Picture Already Removed",
              });
            } else {
              const fileName = sessionData?.session.user.id;
              dispatch(setProfileImgLink(null));
              const { data, error } = await supabase.storage
                .from("profile images")
                .remove([`${fileName}.jpg`]);
              Toast.show({
                type: "success",
                text1: "Profile Picture Removed Successfully",
              });

              if (error) {
                Toast.show({
                  type: "error",
                  text1:
                    "Couldn't remove profile picture, please try again later",
                });
              }
            }
          }}
          activeOpacity={0.7}
          style={{
            height: 40,
            width: "50%",
            alignSelf: "center",
            marginTop: 30,
          }}
        >
          <View
            style={{
              alignSelf: "center",
              backgroundColor: "#ff4f4b",
              padding: 10,
              borderRadius: 10,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              height: 40,
              borderColor: "#000",
              width: "100%",

            }}
          >
            <Text style={{ color: "#fff", fontSize: 15, fontWeight: 600 }}>
              Remove Profile Picture
            </Text>
            <Icon name="trash" size={22} color={"#fff"} />
          </View>
        </TouchableOpacity>

        {data ? (
          <View>
            <View
              style={{
                paddingHorizontal: 20,
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 20,
                marginTop: 25,
              }}
            >
              {titleArray?.map((element, key) => {
                return <InputField element={element} key={key} />;
              })}
            </View>

            <TouchableOpacity
              style={{ paddingHorizontal: 20 }}
              // style={editProfilePageStyles.button}
              onPress={async () => {
                const email = sessionData?.session.user.email;
                const { data, error } = await supabase
                  .from("profiles")
                  .update({
                    userAddress,
                    userDisplayName,
                    userNumber,
                    userBio,
                    email,
                  })
                  .eq("id", sessionData?.session.user.id);
                dispatch(
                  setUserDetails({
                    userNumber,
                    userBio,
                    userAddress,
                    userDisplayName,
                  })
                );
                Toast.show({
                  type: "success",
                  text1: "Profile Updated",
                });
              }}
            >
              <View style={landingPageStyles.button}>
                <Text style={landingPageStyles.btnText}>Update Profile</Text>
              </View>
            </TouchableOpacity>
          </View>
        ) : (
          <ActivityIndicator
            size={"large"}
            color={"#33bc54"}
            style={{ marginTop: 50 }}
          />
        )}
      </ScrollView>
      <Toast text1Style={{ fontSize: 15 }} />
      {isKeyboardVisible ? <></> : <CustomNavigationTab />}
    </>
  );
};

export const editProfilePageStyles = StyleSheet.create({
  button: {
    height: 42,
    width: "40%",
    backgroundColor: "#33bc54",
    alignSelf: "center",
    marginTop: 25,
    borderRadius: 10,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default EditProfilePage;
