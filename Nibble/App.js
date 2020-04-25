
import * as React from 'react';
import { View, Text, Button, Image, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, createSwitchNavigator } from '@react-navigation/stack';
import { CommonActions } from '@react-navigation/native';

import Home from './Home';
import Onboard from './Onboard';
import Signup from './Signup';
import Profile from './Profile';

//import RestCard from './RestCard'

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Onboard">
        <Stack.Screen name="Onboard" component={Onboard} options={({navigation}) => ({headerShown:false, title: ' ', headerTintColor: '#330382', cardStyle: { backgroundColor: '#FFFFFF' }, headerRight: () => (
            <TouchableOpacity
              title= "Profile">
              <Image source={require("./person.png")}/>
            </TouchableOpacity>
          ),})}/>
        <Stack.Screen name="Signup" component={Signup} options={{headerShown:true, title: 'nibble', headerTintColor: '#330382', cardStyle: { backgroundColor: '#FFFFFF' },}}/>
        <Stack.Screen name="Profile" component={Profile} options={{headerLeft: null, headerShown:true, title: 'nibble', headerTintColor: '#330382', cardStyle: { backgroundColor: '#FFFFFF' },}}/>
        <Stack.Screen name="Home" component={Home} options={({navigation}) =>({headerLeft: null, title: 'nibble', headerTintColor: '#330382', cardStyle: { backgroundColor: '#FFFFFF' }, headerRight: () => (
            <TouchableOpacity style ={{left: -15, width: 20, height: 20}}
              title= "Profile" onPress ={()=>navigation.navigate('Profile')}>
              <Image source={require("./person.png")}/>
            </TouchableOpacity>
          ),})}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
