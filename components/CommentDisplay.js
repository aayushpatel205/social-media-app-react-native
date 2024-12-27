import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useSelector } from "react-redux";
import { Menu, MenuItem } from "react-native-material-menu";
import { supabase } from "../lib/supabase";

const CommentDisplay = ({ element, commentsData, setCommentsData }) => {
  const [visible, setVisible] = useState(false);
  const profileData = useSelector((state) => state?.profileReducer);
  const userId = profileData?.sessionData?.session?.user?.id;

  const deleteComment = async () => {
    const { error } = await supabase
      .from('comments')
      .delete()
      .match({ post_id: element.post_id, user_id: element.user_id , id: element.id});

    if (error) {
      console.error("Error deleting comment:", error);
    }
  }



  return (
    <>
      <View style={{ display: "flex", flexDirection: "row", justifyContent: "between" }}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 10,
            marginVertical: 10,
          }}
        >
          <View
            style={{
              height: 40,
              width: 40,
              borderRadius: 24,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderColor: "#d3d3d3",
              overflow: "hidden"
            }}
          >
            {element.user_id === userId ? (
              profileData.profileImg !== "NULL" && !profileData.profileImg ? (
                <Icon name="user" size={34} color="#666" />
              ) : (
                <Image
                  source={{ uri: profileData?.profileImg }}
                  style={{ width: 40, height: 40, borderRadius: 24 }}
                />
              )
            ) : element.profileImg ? (
              <Image
                source={{ uri: element?.profileImg }}
                style={{ width: 40, height: 40, borderRadius: 20 }}
              />
            ) : (
              <Icon name="user" size={32} color="#666" />
            )}
          </View>
          <View style={{ display: "flex", width: "82%" }}>
            <Text style={{ fontSize: 19, fontWeight: "bold" }}>
              {element.userDisplayName === "NULL"
                ? "Anonymous"
                : element.userDisplayName}
            </Text>
            <Text style={{ fontSize: 17, width: "90%" }}>
              {element?.content}
            </Text>
          </View>
        </View>
        {
          (element.user_id === userId) && (
            <Menu
              style={{ width: 155 }}
              visible={visible}
              onRequestClose={() => setVisible(false)}
              anchor={
                <TouchableOpacity onPress={() => setVisible(true)}>
                  <Icon name="ellipsis-h" size={22} style={{ marginTop: 12, color: "#d4d4d4" }} />
                </TouchableOpacity>
              }
            >
              <MenuItem
                textStyle={{ fontSize: 16, color: "red" }}
                onPress={() => {
                  setCommentsData(commentsData.filter((item) => item.id !== element.id));
                  deleteComment();
                  setVisible(false);
                }}
              >
                Delete Comment
              </MenuItem>
            </Menu>
          )
        }
      </View>
    </>
  );
};

export default CommentDisplay;
