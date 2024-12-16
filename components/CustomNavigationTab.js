import React, { useEffect } from "react";
import { Button, View, TouchableOpacity, StyleSheet, TouchableWithoutFeedback } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { changeNavigation } from "../features/navigationSlice";


const CustomNavigationTab = ({ navigation }) => {
  const dispatch = useDispatch();
  const renderPage = useSelector((state) => state.navigationReducer.value);
  return (
    <View style={styles.navbar}>
      <TouchableWithoutFeedback
        onPress={() => {
          dispatch(changeNavigation("Home"));
        }}
        style={styles.navItem}
      >
        <View style={{borderRadius: 50,height: 40,width: 70,display: "flex",justifyContent: "center",alignItems: "center",backgroundColor: renderPage === "Home" ? "#33bc54" : "#fff"
        }}>
          <FontAwesome
            name="home"
            size={24}
            color={renderPage === "Home" ? "#fff" : "#777"}
          />
        </View>
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback
        onPress={() => {
          dispatch(changeNavigation("Post"));
        }}
        style={styles.navItem}
      >
        <View style={{borderRadius: 50,height: 40,width: 70,display: "flex",justifyContent: "center",alignItems: "center",backgroundColor: renderPage === "Post" ? "#33bc54" : "#fff"
        }}>
          <FontAwesome
            name="plus-square"
            size={24}
            color={renderPage === "Post" ? "#fff" : "#777"}
          />
        </View>
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback
        onPress={() => {
          dispatch(changeNavigation("Profile"));
        }}
        style={styles.navItem}
      >
        <View style={{borderRadius: 50,height: 40,width: 70,display: "flex",justifyContent: "center",alignItems: "center",backgroundColor: renderPage === "Profile" ? "#33bc54" : "#fff"
        }}>
          <FontAwesome
            name="user"
            size={24}
            color={renderPage === "Profile" ? "#fff" : "#777"}
          />
        </View>
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback
        onPress={() => {
          dispatch(changeNavigation("EditProfile"));
        }}
        style={styles.navItem}
      >
        <View style={{borderRadius: 50,height: 40,width: 70,display: "flex",justifyContent: "center",alignItems: "center",backgroundColor: renderPage === "EditProfile" ? "#33bc54" : "#fff"
        }}>
          <FontAwesome
            name="pencil"
            size={24}
            color={renderPage === "EditProfile" ? "#fff" : "#777"}
          />
        </View>
      </TouchableWithoutFeedback>
    </View>
    // <View>
    //     <Button title='Profile' onPress={()=>{
    //         dispatch(changeNavigation("Profile"));
    //         navigation?.navigate("RenderPage");
    //     }}/>
    //     <Button title='Post' onPress={()=>{
    //         dispatch(changeNavigation("Post"));
    //         navigation?.navigate("RenderPage");
    //     }}/>
    //     <Button title='Home' onPress={()=>{
    //         dispatch(changeNavigation("Home"));
    //         navigation?.navigate("RenderPage");}}/>
    // </View>
  );
};

export default CustomNavigationTab;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: "#f8f8f8",
  },
  screenContainer: {
    // flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  screenText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  navbar: {
    display: "flex",
    justifyContent: "center",
    paddingBottom: 10,
    // borderWidth: 1,
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    flexDirection: "row",
    backgroundColor: "#fff",
    height: 55,
    // borderTopLeftRadius: 20,
    // borderTopRightRadius: 20,
    // elevation: 8,
    // shadowColor: "#000",
    // shadowOpacity: 0.1,
    // shadowRadius: 5,
    // shadowOffset: { width: 0, height: 5 },
    justifyContent: "space-around",
    alignItems: "center",
    zindex: 20
  },
  navItem: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
});
