import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  BackHandler,
  Alert
} from "react-native";
import { supabase } from "../lib/supabase";
import { useDispatch, useSelector } from "react-redux";
import { setUserDetails } from "../features/profileSlice";
import Icon from "react-native-vector-icons/FontAwesome";
import CustomNavigationTab from "../components/CustomNavigationTab";
import Post from "../components/Post";
import CommentsSection from "../components/CommentsSection";
import Toast from "react-native-toast-message";
import { useFocusEffect } from '@react-navigation/native';

const AppHomePage = ({ navigation, route }) => {
  const [dataReceived, setDataReceived] = useState([]);
  const [likesTableData, setLikesTableData] = useState([]);
  const [savedPostsData, setSavedPostsData] = useState([]);
  const [commentPostId, setCommentPostId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false); // New state for refreshing
  const dispatch = useDispatch();
  const profileData = useSelector((state) => state?.profileReducer);
  const userId = profileData?.sessionData?.session.user.id;
  const { username, phoneNumber } =
    profileData?.sessionData?.session.user.user_metadata;
  const commentsSectionRef = useRef();

  useEffect(() => {
    if (commentPostId != null) {
      commentsSectionRef.current.show();
    }
  }, [commentPostId]);

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.warn("Error occurred while logging out!");
    }
    Alert.alert("Logout Successful", "You have been logged out successfully.", [
      { text: "OK", onPress: () => BackHandler.exitApp() }
    ]);
  };

  const getLikesTableData = async () => {
    const { data, error } = await supabase
      .from("likes")
      .select("post_id")
      .eq("user_id", userId);
    if (error) {
      console.log("Error occurred while getting likes table data:", error);
    } else {
      setLikesTableData(data);
    }
  };

  const getSavedPostsData = async () => {
    const { data, error } = await supabase
      .from("saved-posts")
      .select('*')
      .eq('user_id', userId);
    if (error) {
      console.log("Error occurred while getting saved posts data:", error);
    } else {
      setSavedPostsData(data);
    }
  };

  const getData = async (id) => {
    const { data: profileData, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id);

    if (error) {
      console.error("Error fetching profile data:", error);
    }

    if (profileData?.length > 0) {
      dispatch(
        setUserDetails({
          userDisplayName: profileData[0]?.userDisplayName,
          userBio: profileData[0]?.userBio,
          userNumber: profileData[0]?.userNumber,
          userAddress: profileData[0]?.userAddress,
        })
      );
    } else {
      dispatch(
        setUserDetails({
          userDisplayName: username,
          userBio: null,
          userNumber: phoneNumber,
          userAddress: null,
        })
      );
    }
  };

  const getData2 = async (userId) => {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .neq("user_id", userId)
      .order("created_at", { ascending: false });
    setDataReceived(data);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      await getData(userId);
      await getData2(userId);
      await getLikesTableData();
      await getSavedPostsData();
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchData(); // Re-fetch data on pull-to-refresh
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  return (
    <View style={styles.container}>
      <View
        style={{
          paddingLeft: 20,
          paddingRight: 10,
          paddingBottom: 10,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 30, fontWeight: "bold" }}>LinkUp</Text>
        <View style={{ flexDirection: "row", gap: 15 }}>
          <Icon
            name="bookmark-o"
            size={30}
            color="#000"
            onPress={() =>
              navigation.navigate("SavedPosts")
            }
          />
          <Icon name="sign-out" size={30} color="#000" onPress={() => signOut()} />
        </View>
      </View>
      {!loading ? (
        <ScrollView
          style={{ height: "92%", width: "100%" }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {dataReceived.map((element, id) => (
            <View key={id}>
              <Post
                profileData={profileData}
                element={element}
                postIds={likesTableData.map((item) => item.post_id)}
                id={id}
                setCommentPostId={setCommentPostId}
                dataReceived={dataReceived}
                setDataReceived={setDataReceived}
                savedPostsIds={savedPostsData.map((item) => item.post_id)}
              />
            </View>
          ))}
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
      <Toast />
    </View>
  );
};

export default AppHomePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 60,
    paddingTop: 50,
  },
});
