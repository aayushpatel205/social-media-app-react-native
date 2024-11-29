import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import AppHomePage from "./pages/AppHomePage";
import ProfilePage from "./pages/ProfilePage";
import EditProfilePage from "./pages/EditProfilePage";
import { Provider } from "react-redux";
import { store } from "./app/store";
import CreatePost from "./pages/CreatePost";
import RenderPage from "./pages/RenderPage";

const Stack = createNativeStackNavigator();
const App = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Landing" component={LandingPage} />
          <Stack.Screen name="Login" component={LoginPage} />
          <Stack.Screen name="SignUp" component={SignUpPage} />
          <Stack.Screen name="NewPage" component={AppHomePage} />
          <Stack.Screen name="Profile" component={ProfilePage} />
          <Stack.Screen name="Edit Profile" component={EditProfilePage} />
          <Stack.Screen name="Create Post" component={CreatePost} />
          <Stack.Screen name="RenderPage" component={RenderPage} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default App;
