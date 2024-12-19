import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import RenderFormattedText from "./RenderFormattedText";
import Icon from "react-native-vector-icons/FontAwesome";
import { useSelector } from "react-redux";
import { supabase } from "../lib/supabase";
import { Menu, MenuItem, MenuDivider } from 'react-native-material-menu';

const formatTimestampToMonthDay = (timestamp) => {
  const date = new Date(timestamp);
  const options = { month: "long", day: "numeric" };
  return date.toLocaleDateString("en-US", options);
};

const Post = ({ element, postIds, setCommentPostId, id }) => {
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [isLikedPost, setIsLikedPost] = useState(false);
  const [noOfLikes, setNoOfLikes] = useState();
  const [noOfComments, setNoOfComments] = useState();
  const profileData = useSelector((state) => state?.profileReducer);
  const userId = profileData?.sessionData?.session?.user?.id;
  const formattedDate = formatTimestampToMonthDay(element?.created_at);
  const [visible, setVisible] = useState(false);

  const hideMenu = () => setVisible(false);
  const showMenu = () => setVisible(true);

  const getNoOfLikes = async () => {
    const { data, error } = await supabase
      .from("likes")
      .select("user_id")
      .eq("post_id", element?.post_id);
    if (error) {
      console.error("Error fetching data:", error);
    }
    setNoOfLikes(data?.length || 0);
  };

  const getNoOfComments = async () => {
    const { data, error } = await supabase
      .from("comments")
      .select("user_id")
      .eq("post_id", element?.post_id);
    if (error) {
      console.error("Error fetching data:", error);
    }
    setNoOfComments(data?.length || 0);
  };

  const deleteLike = async (post_id, userId) => {
    const { data, error } = await supabase
      .from("likes")
      .delete()
      .match({ post_id: post_id, user_id: userId });

    if (error) {
      console.error("Error deleting row:", error);
    }
  };

  const addToLikesTable = async () => {
    const { data, error } = await supabase.from("likes").insert({
      post_id: element?.post_id,
      user_id: userId,
    });
    if (error) {
      console.warn("Could not fill data in likes table !!");
    }
  };

  useEffect(() => {
    if (element?.media_url) {
      Image.getSize(
        element?.media_url,
        (width, height) => {
          const screenWidth = Dimensions.get("window").width - 50; // Account for margins
          const aspectRatio = height / width;
          setImageDimensions({
            width: screenWidth,
            height: screenWidth * aspectRatio,
          });
        },
        () => {
          console.error("Failed to load image dimensions.");
        }
      );
    }
  }, [element?.media_url]);

  useEffect(() => {
    setIsLikedPost(postIds?.includes(element.post_id));
  }, [postIds, element.post_id]);

  useEffect(() => {
    getNoOfLikes();
    getNoOfComments();
  }, []);

  if (!element?.media_url || noOfLikes == null || noOfComments == null) {
    return null; // Conditionally render nothing if requirements are not met
  }

  return (
    <View style={styles.postContainer}>
      <View
        style={{
          marginBottom: 8,
          marginTop: 5,
          marginHorizontal: 5,
          display: "flex",
          flexDirection: "row",
          gap: 10,
          alignItems: "center",
        }}
      >
        {element.user_id === userId ? (
          <Image
            source={{ uri: profileData?.profileImg }}
            style={{ width: 40, height: 40, borderRadius: 20 }}
          />
        ) : element?.profileImg ? (
          <Image
            source={{ uri: element.profileImg }}
            style={{ width: 40, height: 40, borderRadius: 20 }}
          />
        ) : (
          <Icon name="user" size={32} color="#000" />
        )}

        <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", width: "85%" }}>
          <View>
            <Text style={{ fontSize: 16, color: "#555555" }}>
              {element.userDisplayName != "NULL"
                ? element.userDisplayName
                : "Anonymous"}
            </Text>
            <Text style={{ color: "#555555" }}>{formattedDate}</Text>
          </View>
          <Menu
            style={{ width: 150, }}
            visible={visible}
            onRequestClose={hideMenu}
            anchor={<TouchableOpacity onPress={showMenu}>
              <Icon name="ellipsis-h" size={27} />
            </TouchableOpacity>}
          // style={{position: "absolute", bottom: 50, right: 50}}
          >
            <MenuItem textStyle={{fontSize: 15}} onPress={hideMenu}>
            Save Post
            </MenuItem>
            <MenuDivider />
            <MenuItem onPress={hideMenu} textStyle={{fontSize: 15,color: "red"}}>Delete Post</MenuItem>
          </Menu>
        </View>
      </View>
      {element?.media_url && (
        <Image
          source={{ uri: element?.media_url }}
          style={[
            styles.postImage,
            { width: imageDimensions.width, height: imageDimensions.height },
          ]}
        />
      )}

      <View>
        <RenderFormattedText htmlContent={element?.content} />
      </View>

      <View style={styles.actionsContainer}>
        <View style={styles.leftActions}>
          <View style={styles.actionGroup}>
            <Icon
              name={`${isLikedPost ? "heart" : "heart-o"}`}
              size={27}
              color={`${isLikedPost ? "red" : "#000"}`}
              onPress={() => {
                if (isLikedPost) {
                  setIsLikedPost(false);
                  deleteLike(element?.post_id, userId);
                  setNoOfLikes(noOfLikes - 1);
                } else {
                  addToLikesTable();
                  setIsLikedPost(true);
                  setNoOfLikes(noOfLikes + 1);
                }
              }}
            />
            <Text style={styles.actionText}>{noOfLikes}</Text>
          </View>

          <View style={styles.actionGroup}>
            <Icon
              name="comment-o"
              size={27}
              onPress={() => {
                setCommentPostId(id);
              }}
            />
            <Text style={styles.actionText}>{noOfComments}</Text>
          </View>
        </View>

        {/* <Icon name="bookmark-o" size={27} style={styles.iconSpacing} /> */}
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  postContainer: {
    backgroundColor: "#fff",
    marginVertical: 10,
    marginHorizontal: 15,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#d7d8d8",
  },
  postImage: {
    borderRadius: 10,
    marginVertical: 10,
    resizeMode: "contain",
  },
  actionsContainer: {
    marginTop: 10,
    marginBottom: 5,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  leftActions: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
  },
  actionGroup: {
    display: "flex",
    flexDirection: "row",
    gap: 5,
  },
  actionText: {
    fontSize: 18,
  },
  iconSpacing: {
    marginLeft: 5,
  },
});

export default Post;
