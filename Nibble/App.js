
import * as React from 'react';
import { View, Text, Button, Image, TouchableOpacity, AsyncStorage } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, createSwitchNavigator } from '@react-navigation/stack';
import { CommonActions } from '@react-navigation/native';

import Home from './Home';
import Onboard from './Onboard';
import Signup from './Signup';
import Profile from './Profile';
import OrderHistory from './OrderHistory';
import Login from './Login';
import Feed from './Feed'
//import RestCard from './RestCard'

const Stack = createStackNavigator();

function App() {
  var nav = AsyncStorage.getItem('email');
  console.log(nav);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Onboard">
        <Stack.Screen name="Onboard" component={Onboard} options={({navigation}) => ({headerShown:false, title: ' ', headerTintColor: '#330382', cardStyle: { backgroundColor: '#FFFFFF' }, headerRight: () => (
            <TouchableOpacity
              title= "Profile">
              <Image source={require("./person.png")}/>
            </TouchableOpacity>
          ),})}/>
        <Stack.Screen name="Login" component={Login} options={{headerShown:true, title: 'nibble', headerTintColor: '#330382', headerLeft: null, cardStyle: { backgroundColor: '#FFFFFF' },}}/>
        <Stack.Screen name="Signup" component={Signup} options={{headerShown:true, title: 'nibble', headerTintColor: '#330382', headerLeft: null, cardStyle: { backgroundColor: '#FFFFFF' },}}/>
        <Stack.Screen name="OrderHistory" component={OrderHistory} options={{headerShown:true, title: 'Order History', headerTintColor: '#330382', headerLeft: null, cardStyle: { backgroundColor: '#FFFFFF' },}}/>
        <Stack.Screen name="Profile" component={Profile} options={{headerLeft: null, headerShown:true, title: 'nibble', headerTintColor: '#330382', cardStyle: { backgroundColor: '#FFFFFF' },}}/>
        <Stack.Screen name="Feed" component={Feed} options={{headerLeft: null, headerShown:true, title: 'nibble', headerTintColor: '#330382', cardStyle: { backgroundColor: '#FFFFFF' },}}/>
        <Stack.Screen name="Home" component={Home} options={({navigation}) =>({gestureEnabled: false, headerLeft: () => (
            <TouchableOpacity style ={{left: 20, width: 18, height: 18}}
              title= "Profile" onPress ={async()=>{console.log("hello"); const storageEmail = await AsyncStorage.getItem('email'); console.log("profile:", storageEmail); var nav = (storageEmail=='null') ? 'Signup' : 'Feed'; navigation.navigate(nav);}}>
              <Image source={require("./feed.png")}/>
            </TouchableOpacity>
          ), title: 'nibble', headerTintColor: '#330382', swipeEnabled: false, cardStyle: { backgroundColor: '#FFFFFF' }, headerRight: () => (
            <TouchableOpacity style ={{left: -15, width: 20, height: 20}}
              title= "Profile" onPress ={async()=>{console.log("hello"); const storageEmail = await AsyncStorage.getItem('email'); console.log("profile:", storageEmail); var nav = (storageEmail=='null') ? 'Signup' : 'Profile'; navigation.navigate(nav);}}>
              <Image source={require("./person.png")}/>
            </TouchableOpacity>
          ),})}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}


export default App;
