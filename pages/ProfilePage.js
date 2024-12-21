import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  ActivityIndicator
} from "react-native";
import { useSelector } from "react-redux";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import Icon from "react-native-vector-icons/FontAwesome";
import Post from "../components/Post";
import { supabase } from "../lib/supabase";
import CommentsSection from "../components/CommentsSection";

const ProfilePage = () => {
  const profileData = useSelector((state) => state?.profileReducer);
  const userId = profileData?.sessionData?.session.user.id;
  const [userPosts, setUserPosts] = useState([]);
  const [likesTableData, setLikesTableData] = useState([]);
  const [commentPostId, setCommentPostId] = useState(null);
  const [isFetching, setIsFetching] = useState(true); // Added loading state
  const commentsSectionRef = useRef();

  const getUserPosts = async () => {
    setIsFetching(true); // Set fetching to true before the API call
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching user posts:", error);
    } else {
      setUserPosts(data);
    }
    setIsFetching(false); // Set fetching to false after the API call is complete
  };

  const getLikesTableData = async () => {
    const { data, error } = await supabase
      .from("likes")
      .select("post_id")
      .eq("user_id", userId);

    if (error) {
      console.log("Error occured while getting likes table data: ", error);
    }
    setLikesTableData(data);
  };

  const postIds = likesTableData?.map((item) => item.post_id);

  useEffect(() => {
    getUserPosts();
    getLikesTableData();
  }, []);

  useEffect(() => {
    if (commentPostId != null) {
      commentsSectionRef.current.show();
    }
  }, [commentPostId]);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 30 }}
      style={{
        backgroundColor: "#fff",
        marginBottom: 60,
        paddingTop: 40
      }}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            fontSize: 32,
            fontWeight: 700,
            color: "#000",
            paddingTop: 20,
          }}
        >
          Profile
        </Text>
      </View>
      <View style={profilePageStyles.profileBox}>
        {profileData.profileImg ? (
          <Image
            source={{ uri: profileData?.profileImg }}
            resizeMode="cover"
            style={{ height: 100, width: 100, borderRadius: 50 }}
          />
        ) : (
          <Icon name="user" size={65} color="#666" />
        )}
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
          fontSize: 25,
          color: "#9e9e9e",
          textAlign: "center",
          fontWeight: 700,
        }}
      >
        {profileData.userAddress ? profileData.userAddress : "No Address Set"}
      </Text>

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
          <FontAwesomeIcon name="envelope" size={27} color="#999" />
          <Text style={{ fontSize: 18, color: "#999", fontWeight: 600 }}>
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
          <FontAwesomeIcon name="phone" size={27} color="#999" />
          <Text style={{ fontSize: 18, color: "#999", fontWeight: 600 }}>
            {profileData?.userNumber}
          </Text>
        </View>

        {
          profileData.userBio && (
            <View
              style={{
                display: "flex",
                gap: 10,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <FontAwesomeIcon name="user" size={27} color="#9e9e9e" />
              <Text style={{ fontSize: 18, color: "#9e9e9e", fontWeight: 600 }}>
                {profileData.userBio}
              </Text>
            </View>
          )
        }
      </View>

      <Text style={{ paddingHorizontal: 20, fontSize: 28, fontWeight: "bold", marginVertical: 10 }}>
        Your Posts
      </Text>

      {isFetching ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : userPosts.length > 0 ? (
        userPosts.map((element, id) => {
          console.warn(element);
          return (
            <View key={id}>
              <Post
                profileData={profileData}
                element={element}
                postIds={postIds}
                id={id}
                setCommentPostId={setCommentPostId}
                dataReceived={userPosts}
                setDataReceived={setUserPosts}
              />
            </View>
          );
        })
      ) : (
        <Text style={{ fontSize: 22, color: '#999', padding: 20 }}>You dont have any posts.</Text>
      )}

      <CommentsSection
        ref={commentsSectionRef}
        setCommentPostId={setCommentPostId}
        element={userPosts[commentPostId]}
      />
    </ScrollView>
  );
};

export const profilePageStyles = StyleSheet.create({
  profileBox: {
    width: 100,
    height: 100,
    marginTop: 15,
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
