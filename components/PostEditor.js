import { useRef, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  Image,
  Alert,
} from "react-native";
import {
  actions,
  RichEditor,
  RichToolbar,
} from "react-native-pell-rich-editor";
import { landingPageStyles } from "../pages/LandingPage";
import * as ImagePicker from "expo-image-picker";
import { addImage, addToPostsTable } from "../ImageAddFunction";
import { useSelector, useDispatch } from "react-redux";
import Toast from "react-native-toast-message";
import { changeNavigation } from "../features/navigationSlice";

const PostEditor = () => {
  const dispatch = useDispatch();
  const richText = useRef();
  // const profileData = useSelector((state) => state?.profileReducer);
  const { userDisplayName, profileImg, sessionData } = useSelector(
    (state) => state?.profileReducer
  );
  const user_id = sessionData?.session.user.id;
  const [captionText, setCaptionText] = useState();
  const [postUrl, setPostUrl] = useState();

  const uploadPostImage = async () => {
    const urlToUpload = await addImage(
      sessionData,
      "posts-images",
      dispatch,
      null,
      postUrl
    );
    await addToPostsTable(
      user_id,
      urlToUpload,
      captionText,
      userDisplayName,
      profileImg
    );
  };

  const submitContentHandle = () => {
    const replaceHTML = descHTML.replace(/<(.|\n)*?>/g, "").trim();
    const replaceWhiteSpace = replaceHTML.replace(/&nbsp;/g, "").trim();

    if (replaceWhiteSpace.length <= 0) {
      setShowDescError(true);
    } else {
      // send data to your server!
    }
  };

  const addPostImg = async () => {
    let _image = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true, // Enables base64 encoding
    });
    return _image;
  };

  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <View
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: 250,
              borderColor: "#b9e6c1",
              borderWidth: 2,
              width: "100%",
              marginBottom: 20,
              borderRadius: 15,
            }}
          >
            {postUrl ? (
              <Image
                source={{ uri: postUrl }}
                style={{ height: "100%", width: "100%", borderRadius: 16 }}
              />
            ) : (
              <Text style={{ color: "#d3d3d3", fontSize: 25 }}>
                Upload a post image
              </Text>
            )}
            {postUrl && (
              <TouchableWithoutFeedback
                onPress={() => {
                  setPostUrl("");
                }}
              >
                <View
                  style={{ position: "absolute", top: 10, right: 55, zIndex: 10 }}
                >
                  <Image
                    source={require("../assets/icons/bin.png")}
                    style={{ height: 35, width: 35 }}
                  />
                </View>
              </TouchableWithoutFeedback>
            )}
            <TouchableWithoutFeedback
              onPress={async () => {
                const postImgUrl = await addPostImg();
                console.warn(postImgUrl?.assets[0].uri);
                setPostUrl(postImgUrl?.assets[0].uri);
                // dispatch(setIsChangedToTrue());
              }}
            >
              <View
                style={{ position: "absolute", top: 10, right: 10, zIndex: 10 }}
              >
                <Image
                  source={require("../assets/icons/pen.png")}
                  style={{ height: 35, width: 35 }}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
          <View style={styles.richTextContainer}>
            <RichEditor
              onChange={(descriptionText) => {
                setCaptionText(descriptionText);
              }}
              ref={richText}
              placeholder="Write a caption for your post...."
              androidHardwareAccelerationDisabled={true}
              style={styles.richTextEditorStyle}
              initialHeight={250}
            />
            <RichToolbar
              editor={richText}
              selectedIconTint="#1b6e31"
              iconTint="#8c8c8c"
              actions={[
                actions.setBold,
                actions.setItalic,
                actions.setStrikethrough,
                actions.setUnderline,
              ]}
              style={styles.richTextToolbarStyle}
            />
          </View>

          <TouchableWithoutFeedback
            onPress={() => {
              if (postUrl) {
                uploadPostImage();
                dispatch(changeNavigation("Home"));
              } else {
                Toast.show({
                  type: "error",
                  text1: "Please select the post image !!",
                })
              }
            }}
          >
            <View style={landingPageStyles.button}>
              <Text style={landingPageStyles.btnText}>Post</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </SafeAreaView>
      <Toast text1Style={{fontSize: 16}}/>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 15,
    height: "100%",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    alignItems: "center",
  },

  richTextContainer: {
    display: "flex",
    flexDirection: "column-reverse",
    width: "100%",
    marginBottom: 10,
  },

  richTextEditorStyle: {
    overflow: "hidden",
    borderRadius: 10,
    borderTopEndRadius: 0,
    borderTopStartRadius: 0,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderColor: "#b9e6c1", // Gray border for the editor
    fontSize: 20,
    height: 240, // Set the same size for the editor
  },

  richTextToolbarStyle: {
    backgroundColor: "#b9e6c1", // Light Green background for the toolbar
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },

  errorTextStyle: {
    color: "#FF0000",
    marginBottom: 10,
  },

  saveButtonStyle: {
    height: 55,
    color: "#fff",
    backgroundColor: "#47c265",
    borderRadius: 10,
    padding: 10,
    width: "25%",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 20,
    width: "100%",
  },

  textButtonStyle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
});

export default PostEditor;
