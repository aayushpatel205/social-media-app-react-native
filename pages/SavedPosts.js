import React, { useEffect, useState, useRef } from 'react';
import { ScrollView, View, Text, RefreshControl, ActivityIndicator, TouchableWithoutFeedback } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Post from '../components/Post';
import { supabase } from '../lib/supabase';
import CommentsSection from '../components/CommentsSection';
import { useNavigationState } from '@react-navigation/native';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { loginPageStyles } from './LoginPage';

const SavedPosts = ({ route, navigation }) => {
    const currentRoute = useNavigationState((state) => state.routes[state.index].name);
    const { myData } = route?.params;
    const dispatch = useDispatch();
    const [userSavedPosts, setUserSavedPosts] = useState([]);
    const [commentPostId, setCommentPostId] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);  // Loading state to show loader
    const profileData = useSelector((state) => state?.profileReducer);
    const userId = profileData?.sessionData?.session.user.id;
    const commentsSectionRef = useRef();

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


    const onRefresh = async () => {
        setRefreshing(true);
        await getSavedPosts();
        setRefreshing(false);
    };

    useEffect(() => {
        getSavedPosts();
    }, []);

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
                        <ActivityIndicator size="large" color="#000" />
                    </View>
                ) : userSavedPosts?.length > 0 ? (
                    <>
                        <ScrollView
                            style={{ flex: 1, backgroundColor: '#fff', marginTop: 30 }}
                            showsVerticalScrollIndicator={false}
                            refreshControl={
                                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
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
                                        alignSelf: "center"
                                    }}
                                >
                                    Saved Posts
                                </Text>
                                <View style={[loginPageStyles.buttonBox, {top: 22}]}>
                                    <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
                                        <MaterialCommunityIcons name="chevron-left" size={45} color="#000" />
                                    </TouchableWithoutFeedback>
                                </View>
                                {userSavedPosts?.map((element, index) => (
                                    <Post
                                        element={element}
                                        postIds={myData?.postIds}
                                        id={index}
                                        setCommentPostId={setCommentPostId}
                                        dataReceived={myData?.dataReceived}
                                        setDataReceived={myData?.setDataReceived}
                                        savedPostsIds={userSavedPosts.map((item) => item.post_id)}
                                        currentRoute={currentRoute}
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
                        <Text style={{ fontSize: 22, color: '#999' }}>No saved posts found.</Text>
                    </View>
                )
            }
        </>
    );
};

export default SavedPosts;
