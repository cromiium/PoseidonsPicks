import React from 'react';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import { AppRegistry, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// Screens
import MainScreen from './src/screens/MainScreen.js';
import MyAccountScreen from './src/screens/myAccountScreen.js';
import MyBetsScreen from './src/screens/MyBetsScreen.js';
import LoginScreen from './src/screens/LoginScreen.js';
import SignUpScreen from './src/screens/SignUpScreen.js';
import LiveScreen from './src/screens/LiveScreen.js';
import ChatScreen from './src/screens/ChatScreen.js';
import AllSportsScreen from './src/screens/AllSportsScreen.js';
import TopPicksScreen from './src/screens/TopPicksScreen.js';
import OffersScreen from './src/screens/OffersScreen.js';
import PodcastsScreen from './src/screens/PodcastsScreen.js';

import Icon from 'react-native-vector-icons/FontAwesome5';
import { Provider } from 'react-redux';
import store from './src/redux/store.js';

const appConfig = require('./app.json');
const appName = appConfig.name;


const BottomTab = createBottomTabNavigator();
const Stack = createStackNavigator();

const myTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#204d8c', // change primary color
    accent: '#cdd5e2', // change accent color
  },
};

function BottomTabNavigator() {
  return (
    <BottomTab.Navigator>
      <BottomTab.Screen
        name="Main"
        component={MainScreen}
        options={{ title: 'Main', tabBarIcon: ({ color, size }) => (<Icon name="home" color={color} size={size} />), headerShown: false }}
      />
      <BottomTab.Screen
        name="My Bets"
        component={MyBetsScreen}
        options={{ title: 'My Bets', tabBarIcon: ({ color, size }) => (<Icon name="dollar-sign" color={color} size={size} />), headerShown: false }}
      />
      <BottomTab.Screen
        name="My Account"
        component={MyAccountScreen}
        options={{ title: 'My Account', tabBarIcon: ({ color, size }) => (<Icon name="user" color={color} size={size} />), headerShown: false }}
      />
    </BottomTab.Navigator>
  );
}


export default function App() {
  return (
    <Provider store={store}>
      <PaperProvider theme={myTheme}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Chat" component={ChatScreen} options={{ headerShown: false }} />
            <Stack.Screen name="SignUpScreen" component={SignUpScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Live" component={LiveScreen} options={{ headerShown: false }} />
            <Stack.Screen name="AllSports" component={AllSportsScreen} options={{ headerShown: false }} />
            <Stack.Screen name="TopPicks" component={TopPicksScreen} options={{ headerShown: false }} />
            <Stack.Screen name="App" component={BottomTabNavigator} options={{ gestureEnabled: false, headerShown: false }} />
            <Stack.Screen name="Offers" component={OffersScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Podcasts" component={PodcastsScreen} options={{ headerShown: false }} />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </Provider>
  );
}

AppRegistry.registerComponent('PoseidonsPicks', () => App);