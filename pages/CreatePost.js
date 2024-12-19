import React, { useEffect } from "react";
import {
  Text,
  View,
  Image,
  TouchableWithoutFeedback,
} from "react-native";
import { loginPageStyles } from "./LoginPage";
import PostEditor from "../components/PostEditor";
import * as NavigationBar from "expo-navigation-bar";

const CreatePost = ({ navigation }) => {
  useEffect(() => {
    NavigationBar.setBackgroundColorAsync("#FFFFFF");
  }, []);
  return (
    <View style={{ flex: 1, backgroundColor: "#fff", display: "flex", marginTop: -10}}>
      <View style={[loginPageStyles.buttonBox,{marginBottom: 15}]}>
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
          paddingTop: 22,
          marginBottom: 5,
        }}
      >
        Create Post
      </Text>

      <PostEditor />
    </View>
  );
};

export default CreatePost;
