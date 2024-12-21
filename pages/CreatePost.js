import React, { useEffect } from "react";
import {
  Text,
  View,
} from "react-native";
import PostEditor from "../components/PostEditor";
import * as NavigationBar from "expo-navigation-bar";

const CreatePost = () => {
  useEffect(() => {
    NavigationBar.setBackgroundColorAsync("#FFFFFF");
  }, []);
  return (
    <View style={{ flex: 1, backgroundColor: "#fff", display: "flex", marginTop: 20}}>

      <Text
        style={{
          alignSelf: "center",
          fontSize: 32,
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
