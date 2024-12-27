import React from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import { Provider } from "react-redux";
import { store } from "./app/store";
import RenderPage from "./pages/RenderPage";
import SavedPosts from "./pages/SavedPosts";

const Stack = createNativeStackNavigator();
const App = () => {
  return (
    <Provider store={store}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Landing" component={LandingPage} />
          <Stack.Screen name="Login" component={LoginPage} />
          <Stack.Screen name="SignUp" component={SignUpPage} />
          <Stack.Screen name="RenderPage" component={RenderPage} />
          <Stack.Screen name="SavedPosts" component={SavedPosts}/>
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default App;
