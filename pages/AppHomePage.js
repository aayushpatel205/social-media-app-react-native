import React, { useEffect, useRef, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
// import ScrollView from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "../lib/supabase";
import { useDispatch, useSelector } from "react-redux";
import { setUserDetails } from "../features/profileSlice";
import * as NavigationBar from "expo-navigation-bar";
import Icon from "react-native-vector-icons/FontAwesome";
import CustomNavigationTab from "../components/CustomNavigationTab";
import Post from "../components/Post";
import CommentsSection from "../components/CommentsSection";

const AppHomePage = ({ navigation }) => {
  const [dataReceived, setDataReceived] = useState([]);
  const [likesTableData, setLikesTableData] = useState([]);
  const [commentPostId, setCommentPostId] = useState(null);
  const dispatch = useDispatch();
  const profileData = useSelector((state) => state?.profileReducer);
  const userId = profileData?.sessionData?.session.user.id;
  const commentsSectionRef = useRef();

  useEffect(() => {
    if (commentPostId != null) {
      console.log("Comment post id: ", commentPostId);
      commentsSectionRef.current.show();
    }
  }, [commentPostId]);
  const getLikesTableData = async () => {
    const { data, error } = await supabase
      .from("likes")
      .select("post_id")
      .eq("user_id", userId);
    if (error) {
      console.log("Error occured while getting likes table data: ", error);
    } else {
      setLikesTableData(data);
    }
  };

  const postIds = likesTableData?.map((item) => item.post_id);
  console.log("postIds:", postIds);

  const getData = async (id) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .limit(1);
    if (error) {
      console.log("Error: ", error);
    }
    dispatch(setUserDetails(data[0]));
  };

  const getData2 = async () => {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false }); // Replace with the actual userId

    console.log("The image urls of posts data is: ", data.length);
    setDataReceived(data);

    if (error) {
      console.error("Error fetching media_url:", error);
    } else {
      console.log("Fetched media_url:", data);
    }
  };

  const restoreSession = async () => {
    try {
      const sessionData = await AsyncStorage.getItem("userSession");
      if (sessionData) {
        const session = JSON.parse(sessionData);

        // Extract access and refresh tokens
        const { access_token, refresh_token } = session;

        if (access_token && refresh_token) {
          // Set the session with access and refresh tokens
          const { data, error } = await supabase.auth.setSession({
            access_token: access_token,
            refresh_token: refresh_token,
          });

          if (error) {
            console.error("Error restoring session:", error.message);
          }
        } else {
          console.warn("Missing access or refresh token in session.");
        }
      }
    } catch (error) {
      console.error("Error restoring session:", error);
    }
  };

  useEffect(() => {
    NavigationBar.setBackgroundColorAsync("#FFFFFF");
    restoreSession();
    getData(23456);
    getData2();
    getLikesTableData();
  }, []);

  return (
    <View style={styles.container}>
      <View
        style={{
          paddingHorizontal: 20,
          paddingBottom: 10,
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 30, fontWeight: "bold" }}>LinkUp</Text>
        <View style={{ display: "flex", flexDirection: "row", gap: 10 }}>
          <Icon name="heart-o" size={28} color="#000" />
          <Icon name="paper-plane-o" size={28} color="#000" />
        </View>
      </View>
      {dataReceived?.length > 0 ? (
        <ScrollView
          style={{ height: "92%", width: "100%" }}
          showsVerticalScrollIndicator={false}
        >
          {dataReceived.map((element, id) => {
            return (
              <View>
                <Post
                  element={element}
                  postIds={postIds}
                  id={id}
                  setCommentPostId={setCommentPostId}
                />
              </View>
            );
          })}
        </ScrollView>
      ) : (
        <ActivityIndicator color={"#33bc54"} size={50} />
      )}

      <CustomNavigationTab />
      <CommentsSection
        ref={commentsSectionRef}
        setCommentPostId={setCommentPostId}
        element={dataReceived[commentPostId]}
      />
    </View>
  );
};

export default AppHomePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 60,
    // zIndex: -10,
    // marginBottom: 60
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  profileBox: {
    height: 34,
    width: 34,
    borderwidth: 1,
    borderColor: "#d2d2d2",
    display: "flex",
    backgroundColor: "#d3d3d3",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
  },
});
