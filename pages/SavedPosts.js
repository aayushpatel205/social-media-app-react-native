import React, { useEffect, useState, useRef, useCallback } from 'react';
import { ScrollView, View, Text, ActivityIndicator, TouchableWithoutFeedback , RefreshControl } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Post from '../components/Post';
import { supabase } from '../lib/supabase';
import CommentsSection from '../components/CommentsSection';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { loginPageStyles } from './LoginPage';
import { useFocusEffect } from '@react-navigation/native';
import { setUserDetails } from '../features/profileSlice';

const SavedPosts = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const [userSavedPosts, setUserSavedPosts] = useState([]);
  const [dataReceived, setDataReceived] = useState([]);
  const [likesTableData, setLikesTableData] = useState([]);
  const [commentPostId, setCommentPostId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);  // Loading state to show loader
  const profileData = useSelector((state) => state?.profileReducer);
  const userId = profileData?.sessionData?.session.user.id;
  const commentsSectionRef = useRef();

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

  const getSavedPosts = async () => {
    try {
      setLoading(true);  // Start loading when fetching data
      const { data, error } = await supabase
        .from('saved-posts')
        .select('*')
        .eq('user_id', userId);
      if (error) {
        console.error(error);
      } else {
        setUserSavedPosts(data);
      }
    } catch (error) {
      console.error('Error fetching saved posts:', error);
    } finally {
      setLoading(false);  // End loading after data is fetched
    }
  };

  const fetchData = async () => {
    await getData(userId);
    await getData2(userId);
    await getLikesTableData();
    await getSavedPosts();
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  useEffect(() => {
    if (commentPostId != null) {
      commentsSectionRef.current?.show();
    }
  }, [commentPostId]);

  return (
    <>
      {
        loading ? (  // Display loader when loading
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "#fff" }}>
            <ActivityIndicator color={"#33bc54"} size={50} />
          </View>
        ) : userSavedPosts?.length > 0 ? (
          <>
            <ScrollView
              style={{ flex: 1, backgroundColor: '#fff', marginTop: 30 }}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={async () => {
                    setRefreshing(true);
                    await fetchData(); // Fetch data on refresh
                    setRefreshing(false);
                  }}
                />
              }
            >
              <View>
                <Text
                  style={{
                    fontSize: 32,
                    fontWeight: '700',
                    color: '#000',
                    paddingHorizontal: 20,
                    marginBottom: 17,
                    paddingTop: 20,
                    alignSelf: "center",
                  }}
                >
                  Saved Posts
                </Text>
                <View style={[loginPageStyles.buttonBox, { top: 22 }]}>
                  <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
                    <MaterialCommunityIcons name="chevron-left" size={45} color="#000" />
                  </TouchableWithoutFeedback>
                </View>
                {userSavedPosts?.map((element, index) => (
                  <Post
                    key={index}
                    profileData={profileData}
                    element={element}
                    postIds={likesTableData.map((item) => item.post_id)}
                    id={index}
                    setCommentPostId={setCommentPostId}
                    dataReceived={dataReceived}
                    setDataReceived={setDataReceived}
                    savedPostsIds={userSavedPosts.map((item) => item.post_id)}
                    currentRoute={route.name}
                  />
                ))}
              </View>
              <CommentsSection
                ref={commentsSectionRef}
                setCommentPostId={setCommentPostId}
                element={userSavedPosts[commentPostId]}
              />
            </ScrollView>
          </>

        ) : (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "#fff" }}>
            <View style={loginPageStyles.buttonBox}>
              <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
                <MaterialCommunityIcons name="chevron-left" size={45} color="#000" />
              </TouchableWithoutFeedback>
            </View>
            <Text style={{ fontSize: 25, color: '#999' }}>No saved posts found.</Text>
          </View>
        )
      }
    </>
  );
};

export default SavedPosts;
