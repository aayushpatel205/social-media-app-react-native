import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity, Alert } from "react-native";
import RenderFormattedText from "./RenderFormattedText";
import Icon from "react-native-vector-icons/FontAwesome";
import { useSelector, useDispatch } from "react-redux";
import { supabase } from "../lib/supabase";
import { Menu, MenuItem, MenuDivider } from 'react-native-material-menu';
import { setSavedPosts } from "../features/savedPostSlice";
import Toast from "react-native-toast-message";

const formatTimestampToMonthDay = (timestamp) => {
  const date = new Date(timestamp);
  const options = { month: "long", day: "numeric" };
  return date.toLocaleDateString("en-US", options);
};

const Post = ({ element, postIds, setCommentPostId, id, dataReceived, setDataReceived, savedPostsIds, currentRoute }) => {
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
  const [isSavedPost, setIsSavedPost] = useState(false);
  const dispatch = useDispatch();


  const deleteFromSavedPostsTable = async (post_id, user_id) => {
    const { data, error } = await supabase
      .from("saved-posts")
      .delete()
      .match({ post_id: post_id, user_id: user_id });

    if (error) {
      console.error("Error deleting row:", error);
    }
  }
  const addToSavedPostsTable = async () => {
    const savedPostData = {
      content: element?.content,
      media_url: element?.media_url,
      post_id: element?.post_id,
      user_id: userId,
      profileImg: element?.profileImg,
      userDisplayName: element?.userDisplayName
    }
    const { data: postData, error: fetchError } = await supabase
      .from('saved-posts')
      .insert([savedPostData]);

    if (fetchError) {
      Toast.show({
        type: "error",
        text1: fetchError.message,
      })
    } else {
      Alert.alert("Post saved successfully !!");
    }
  }
  const deletePostAndImage = async () => {
    try {
      // Step 1: Delete the post from the 'posts' table
      const { data, error: postError } = await supabase
        .from('posts')
        .delete()
        .eq('post_id', element?.post_id);

      if (postError) {
        console.error('Error deleting post:', postError);
        return; // Exit if post deletion fails
      } else {
        console.warn("Post is deleted successfully !!");
      }

      // Step 2: Delete the image from the 'posts-images' bucket
      const imageName = element.media_url.split('/').pop().split('?')[0];
      console.log("ImageName is: ", imageName);
      const { error: imageError } = await supabase
        .storage
        .from('posts-images')
        .remove([imageName]);

      if (imageError) {
        console.error('Error deleting image:', imageError.message);
      } else {
        console.log('Image deleted successfully');
      }
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Unexpected error occured",
      })
    }
  }


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
    setIsSavedPost(savedPostsIds?.includes(element.post_id));
  }, [savedPostsIds, element.post_id]);

  useEffect(() => {
    getNoOfLikes();
    getNoOfComments();
  }, []);

  // if (!element?.media_url || !noOfLikes || !noOfComments) {
  //   return null; // Conditionally render nothing if requirements are not met
  // }

  return (
    <>
      <View style={styles.postContainer}>
        <View
          style={{
            marginBottom: 8,
            marginTop: 5,
            marginHorizontal: 5,
            display: "flex",
            flexDirection: "row",
            gap: 13,
            alignItems: "center",
          }}
        >
          {element.user_id === userId ? (
            profileData.profileImg != "NULL" ? (
              <Icon name="user" size={35} color="#666" />
            ) : (
              <Image
                source={{ uri: profileData?.profileImg }}
                style={{ width: 40, height: 40, borderRadius: 24 }}
              />
            )

          ) : element?.profileImg != "NULL" ? (
            <Image
              source={{ uri: element.profileImg }}
              style={{ width: 40, height: 40, borderRadius: 20 }}
            />
          ) : (
            <Icon name="user" size={35} color="#666" />
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
            {currentRoute === "SavedPosts" ? null : (
              element?.user_id === userId ? (
                <Menu
                  style={{ width: 150 }}
                  visible={visible}
                  onRequestClose={() => setVisible(false)}
                  anchor={
                    <TouchableOpacity onPress={() => setVisible(true)}>
                      <Icon name="ellipsis-h" size={27} />
                    </TouchableOpacity>
                  }
                >
                  <MenuItem
                    textStyle={{ fontSize: 16, color: "red" }}
                    onPress={async () => {
                      await deletePostAndImage();
                      setDataReceived(dataReceived.filter((item) => item.post_id !== element.post_id));
                      setVisible(false);
                      Toast.show({
                        type: "success",
                        text1: "Post Deleted",
                      });
                    }}
                  >
                    Delete Post
                  </MenuItem>
                </Menu>
              ) : null
            )}

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


          {
            currentRoute === "SavedPosts" ? (
              <Icon
                name={`${isSavedPost ? "bookmark" : "bookmark-o"}`}
                color={"#383838"}
                size={27}
                style={styles.iconSpacing}
                onPress={() => {
                  if (isSavedPost) {
                    setIsSavedPost(false);
                    deleteFromSavedPostsTable(element?.post_id, userId);
                  } else {
                    setIsSavedPost(true);
                    addToSavedPostsTable();
                  }
                }}
              />
            ) : (
              element?.user_id !== userId && (
                <Icon
                  name={`${isSavedPost ? "bookmark" : "bookmark-o"}`}
                  color={"#383838"}
                  size={27}
                  style={styles.iconSpacing}
                  onPress={() => {
                    if (isSavedPost) {
                      setIsSavedPost(false);
                      deleteFromSavedPostsTable(element?.post_id, userId);
                    } else {
                      setIsSavedPost(true);
                      addToSavedPostsTable();
                    }
                  }}
                />
              )
            )
          }


        </View>

      </View>
      {/* <Toast text1Style={{ fontSize: 17 }} /> */}
    </>
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
    justifyContent: 'space-between',
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
