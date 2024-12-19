import React from "react";
import { View, Text, Image } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useSelector } from "react-redux";
const CommentDisplay = ({ element }) => {
  const profileData = useSelector((state) => state?.profileReducer);
  const userId = profileData?.sessionData?.session?.user?.id;
  return (
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
          <Image
            source={{ uri: profileData?.profileImg }}
            style={{ width: 40, height: 40, borderRadius: 24 }}
          />
        ) : element?.profileImg ? (
          <Image
            source={{ uri: element.profileImg }}
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
        <Text style={{ fontSize: 17, width: "100%" }}>
          {element?.content}
        </Text>
      </View>
    </View>
  );
};

export default CommentDisplay;
