import React from "react";
import { View, Text , Image } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
const CommentDisplay = ({ element }) => {
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
          height: 45,
          width: 45,
          borderRadius: 24,
          borderWidth: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderColor: "#d3d3d3",
          overflow: "hidden"
        }}
      >
        {element.profileImg === "NULL" ? (
          <Icon name="user" size={30} color={"#000"} />
        ) : (
          <Image source={{uri: element.profileImg}} style={{height: "100%", width: "100%"}}/>
        )}
      </View>
      <View style={{ display: "flex" , width: "82%"}}>
        <Text style={{ fontSize: 19, fontWeight: "bold" }}>
          {element.userDisplayName === "NULL"
            ? "Anonymous"
            : element.userDisplayName}
        </Text>
        <Text style={{ fontSize: 17,width: "100%"}}>
          {element?.content}
        </Text>
      </View>
    </View>
  );
};

export default CommentDisplay;
