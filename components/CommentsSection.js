import React, { forwardRef, useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from "react-native";
import ActionSheet from "react-native-actions-sheet";
import Icon from "react-native-vector-icons/FontAwesome";
import { useSelector } from "react-redux";
import { supabase } from "../lib/supabase";
import CommentDisplay from "./CommentDisplay";
import * as NavigationBar from "expo-navigation-bar";

const CommentsSection = forwardRef((props, ref) => {
  const inputRef = useRef(null);
  const [commentsData, setCommentsData] = useState(null);
  const [commentText, setCommentText] = useState();
  const profileData = useSelector((state) => state?.profileReducer);
  const userId = profileData?.sessionData?.session.user.id;
  const { setCommentPostId, element } = props;
  console.log("the element here is: ", element);
  console.log("the user here is: ", profileData);

  const getCommentsData = async () => {
    const { data, error } = await supabase
      .from("comments")
      .select("*")
      .eq("post_id", element?.post_id);
    console.warn("The commentsData: ", data);
    setCommentsData(data);
  };

  const addToCommentsTable = async () => {
    const { data, error } = await supabase.from("comments").insert({
      post_id: element?.post_id,
      user_id: userId,
      content: commentText,
      userDisplayName: profileData?.userDisplayName,
      profileImg: profileData?.profileImg,
    });
    if (error) {
      console.warn("Could not fill data in comments table !!");
    }
  };
  return (
    <ActionSheet
      ref={ref}
      onClose={() => {
        setCommentPostId(null);
      }}
      onOpen={() => {
        getCommentsData();
        NavigationBar?.setBackgroundColorAsync("#FFFFFF");
      }}
    >
      <KeyboardAvoidingView
        style={{ height: 700 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={160}
      >
        <Text
          style={{
            fontSize: 22,
            fontWeight: "bold",
            paddingHorizontal: 20,
            paddingVertical: 15,
          }}
        >
          Comments
        </Text>
        <View style={{ height: 2, backgroundColor: "#d3d3d3" }}></View>

        <ScrollView
          contentContainerStyle={{ paddingBottom: 20, paddingTop: 10 }}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ paddingHorizontal: 15 }}>
            {commentsData === null ? (
              <ActivityIndicator color={"#33bc54"} size={35} />
            ) : commentsData?.length === 0 ? (
              <Text style={{fontSize: 22,fontWeight: "bold"}}>Please start a comment !</Text>
            ) : (
              commentsData.map((element, index) => (
                <CommentDisplay key={index} element={element} />
              ))
            )}
          </View>
        </ScrollView>

        <View
          style={{
            height: 60,
            width: "100%",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <TextInput
            style={{
              height: 60,
              width: "80%",
              borderWidth: 1,
              borderColor: "#d3d3d3",
              paddingHorizontal: 15,
              fontSize: 18, // Adds shadow on Android
            }}
            value={commentText}
            onChangeText={(text) => setCommentText(text)}
          />
          <TouchableWithoutFeedback
            onPress={() => {
              if (commentText !== undefined) {
                addToCommentsTable();
                setCommentText("");
              } else {
                console.warn("Please enter a comment to send !!");
              }
            }}
          >
            <View
              style={{
                width: "20%",
                height: 60,
                backgroundColor: "#33bc54",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Icon name="paper-plane" size={30} color={"#fff"} />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </KeyboardAvoidingView>
    </ActionSheet>
  );
});

export default CommentsSection;
