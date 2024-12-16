import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, Dimensions } from "react-native";
import RenderFormattedText from "./RenderFormattedText";
import Icon from "react-native-vector-icons/FontAwesome";
import { useSelector } from "react-redux";
import { supabase } from "../lib/supabase";

const Post = ({ url, content, post_id, postIds}) => {
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [isLikedPost , setIsLikedPost] = useState(postIds?.includes(post_id));
  const profileData = useSelector((state) => state?.profileReducer);
  const userId = profileData?.sessionData?.session.user.id;
  console.log("isLikedPostHere:",isLikedPost);

  const deleteLike = async (post_id,userId) => {
    const { data, error } = await supabase
      .from('likes')
      .delete()
      .match({ post_id: post_id, user_id: userId });
  
    if (error) {
      console.error('Error deleting row:', error);
    } else {
      console.log('Deleted row:', data);
    }
  };

  const addToLikesTable = async () => {
    const { data, error } = await supabase.from("likes").insert({
      post_id: post_id,
      user_id: userId,
    });
    if (error) {
      console.warn("Could not fill data in likes table !!");
    } else {
      console.log("Data filled in likes table successfully !!");
    }
  };
  // Dynamically calculate image dimensions to maintain aspect ratio
  useEffect(() => {
    if (url) {
      Image.getSize(
        url,
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
  }, [url]);

  return (
    <View style={styles.postContainer}>
      {url && (
        <Image
          source={{ uri: url }}
          style={[
            styles.postImage,
            { width: imageDimensions.width, height: imageDimensions.height },
          ]}
        />
      )}

      <View>
        <RenderFormattedText htmlContent={content} />
        {/* <Text>...Read More</Text> */}
      </View>

      {/* <Text numberOfLines={2} ellipsizeMode="tail">
        <RenderFormattedText htmlContent={content} />
      </Text> */}

      <View style={styles.actionsContainer}>
        <View style={styles.leftActions}>
          <View style={styles.actionGroup}>
            <Icon
              name={`${isLikedPost ? "heart" : "heart-o"}`}
              size={27}
              color={`${isLikedPost ? "red" : "#000"}`}
              onPress={() => {
                if(isLikedPost){
                  setIsLikedPost(false);
                  deleteLike(post_id,userId);
                }
                else{
                  addToLikesTable();
                  setIsLikedPost(true);
                } 
              }}
            />
            <Text style={styles.actionText}>1</Text>
          </View>

          <View style={styles.actionGroup}>
            <Icon name="comment-o" size={27} />
            <Text style={styles.actionText}>5</Text>
          </View>

          <Icon name="bookmark-o" size={27} style={styles.iconSpacing} />
        </View>

        <Icon name="trash" size={27} color={"red"} />
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 7,
    elevation: 2,
  },
  postImage: {
    borderRadius: 10,
    marginVertical: 10,
    resizeMode: "contain", // Ensures the image fits within its bounds
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
