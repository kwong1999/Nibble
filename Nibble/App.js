
import * as React from 'react';
import { View, Text, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, createSwitchNavigator } from '@react-navigation/stack';
import Home from './Home';
import Onboard from './Onboard';
import Signup from './Signup';

//import RestCard from './RestCard'

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Onboard">
        <Stack.Screen name="Onboard" component={Onboard} options={{headerShown:false, title: ' ', headerTintColor: '#330382', cardStyle: { backgroundColor: '#FFFFFF' }, headerRight: () => (
            <Button
              style="background: url(person.png)"
              title= "Profile">
              <img src="person.png"/>
            </Button>
          ),}}/>
        <Stack.Screen name="Signup" component={Signup} options={{headerShown:true, title: 'nibble', headerTintColor: '#330382', cardStyle: { backgroundColor: '#FFFFFF' },}}/>
        <Stack.Screen name="Home" component={Home} options={{headerLeft: null, title: 'nibble', headerTintColor: '#330382', cardStyle: { backgroundColor: '#FFFFFF' }, headerRight: () => (
            <Button
              style="background: url(person.png)"
              title= "Profile">
              <img src="person.png"/>
            </Button>
          ),}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
