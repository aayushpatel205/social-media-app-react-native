import React, { useEffect } from "react";
import AppHomePage from "./AppHomePage";
import { useSelector } from "react-redux";
import { View, Text } from "react-native";
import ProfilePage from "./ProfilePage";
import CreatePost from "./CreatePost";
import CustomNavigationTab from "../components/CustomNavigationTab";
import EditProfilePage from "./EditProfilePage";

const RenderPage = ({ navigation }) => {
  const renderPage = useSelector((state) => state.navigationReducer.value);

  if (renderPage === "Home") {
    return (
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <AppHomePage navigation={navigation} />
      </View>
    );
  } else if (renderPage === "Profile") {
    return (
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <ProfilePage navigation={navigation} />
        <CustomNavigationTab />
      </View>
    );
  } else if (renderPage === "Post") {
    return (
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <CreatePost navigation={navigation} />
        <CustomNavigationTab />
      </View>
    );
  } else if(renderPage === "EditProfile") {
    return (
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <EditProfilePage navigation={navigation} />
        <CustomNavigationTab />
      </View>
    );
  }
};

export default RenderPage;
