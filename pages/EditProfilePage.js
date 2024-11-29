import React, { useEffect, useState } from "react";
import { decode as atob } from "base64-arraybuffer";
import {
  View,
  TouchableWithoutFeedback,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  _Image
} from "react-native";
import { loginPageStyles } from "./LoginPage";
import { profilePageStyles } from "./ProfilePage";
import InputField from "../components/InputField";
import { supabase } from "../lib/supabase";
import { useDispatch , useSelector } from "react-redux";
import { setUserDetails } from "../features/profileSlice";
import * as ImagePicker from 'expo-image-picker';
import * as NavigationBar from 'expo-navigation-bar';
import { landingPageStyles } from "./LandingPage";
import * as FileSystem from 'expo-file-system';
import { addImage } from "../ImageAddFunction";
import { setProfileImgLink } from "../features/profileSlice";
import { setIsChangedToTrue , setIsChangedToFalse } from "../features/isProfileChangedSlice";
// import { Image as ImageCompressor } from "react-native-compressor";

const EditProfilePage = ({ navigation }) => {
  const sessionData = useSelector((state) => state.profileReducer?.sessionData);
  const data = useSelector((state) => state.profileReducer);
  const dispatch = useDispatch();
  const [imgPath , setImgPath] = useState();
  const [uploadUrl , setUploadUrl] = useState();
  const [userNumber, setUserNumber] = useState(data?.userNumber);
  const [userBio, setUserBio] = useState(data?.userBio);
  const [userAddress, setUserAddress] = useState(data?.userAddress);
  const [userDisplayName, setUserDisplayName] = useState(data?.userDisplayName);


  useEffect(()=>{
    const getPublicImageUrl = async(storageName, sessionData) =>{
      const fileName = `${sessionData?.session.user.id}.jpg`;
    
      const { data, error } = await supabase
        .storage
        .from(storageName)
        .getPublicUrl(fileName);
    
      if (error) {
        console.error('Error fetching public URL:', error);
        return null;
      }
    }
    // Example usage
  },[]);

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
      iconName: "user"
    },
    {
      title: "Number",
      value: userNumber,
      setValue: setUserNumber,
      iconName: "phone"
    },
    {
      title: "Bio",
      value: userBio,
      setValue: setUserBio,
      iconName: "id-card"
    },
    {
      title: "Address",
      value: userAddress,
      setValue: setUserAddress,
      iconName: "map-marker"
    },
  ];
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#fff",
        flexDirection: "column",
        display: "flex",
      }}
    >
      <View style={loginPageStyles.buttonBox}>
        <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
          <Image
            source={require("../assets/icons/left-arrow.png")}
            style={{ height: 25, width: 25 }}
          />
        </TouchableWithoutFeedback>
      </View>

      <Text
        style={{
          alignSelf: "center",
          fontSize: 28,
          fontWeight: 700,
          color: "#000",
          paddingTop: 20,
        }}
      >
        Edit Profile
      </Text>

      <View style={profilePageStyles.profileBox}>
        <Image
          source={{uri: data?.profileImg}}
          resizeMode="cover"
          // source={{ uri: data?.profileImg }}
          style={{ height: 100, width: 100 ,borderRadius: 50}}
        />
        <TouchableWithoutFeedback onPress={()=>{
          addImage(sessionData,"profile images",dispatch,setProfileImgLink);
          dispatch(setIsChangedToTrue());
          // dispatch(setIsChangedToTrue());
          }}>
          <View style={{ position: "absolute", bottom: -18 }}>
            <Image
              source={require("../assets/icons/pen.png")}
              style={{ height: 27, width: 27 }}
            />
          </View>
        </TouchableWithoutFeedback>
      </View>

      {
        data ? <View>
        <View
          style={{
            paddingHorizontal: 20,
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 20,
            marginTop: 50,
          }}
        >
          {titleArray?.map((element, key) => {
            return <InputField element={element} key={key} />;
          })}
        </View>

        <TouchableOpacity
          style={{paddingHorizontal: 20}}
          // style={editProfilePageStyles.button}
          onPress={async () => {
            if (userDisplayName && userNumber) {
              const email = sessionData?.session.user.email;
              // await uploadImage(imgPath);
              const { data, error } = await supabase
                .from("profiles")
                .update({
                  userAddress,
                  userDisplayName,
                  userNumber,
                  userBio,
                  email
                })
                .eq("id", 23456);
                dispatch(setUserDetails({
                  userNumber,
                  userBio,
                  userAddress,
                  userDisplayName,
                }));
              alert("Successfully updated !!");
            } else {
              if (!userDisplayName || !userNumber) {
                alert("Please fill both name and phone number!!");
              } else {
                // const id = sessionData?.session.user.id;
                const id = 23456;
                const { data, error } = await supabase.from("profiles").insert({
                  userAddress,
                  userDisplayName,
                  userNumber,
                  userBio,
                  id,
                  profileImg: imgPath
                });
                if (error) {
                  alert("Cannot fill data !!");
                }
              }
            }
          }}
        >
          <View style={landingPageStyles.button}>
            <Text style={landingPageStyles.btnText}>
              Update Profile
            </Text>
          </View>
        </TouchableOpacity>
      </View> : <ActivityIndicator size={"large"} color={"#33bc54"} style={{marginTop: 50}}/>
      }
    </View>
  //   <TouchableWithoutFeedback onPress={() => signInWithEmail()}>
  //   <View style={landingPageStyles.button}>
  //     <Text style={landingPageStyles.btnText}>Login</Text>
  //   </View>
  // </TouchableWithoutFeedback>
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
