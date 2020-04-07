<<<<<<< HEAD
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
=======
import * as React from 'react';
import { View, Text, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Menu from './Home';
>>>>>>> 9ba454ddc934fe34ee421d1cc0801ce47d8ca21d

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Menu">
        <Stack.Screen name="Menu" component={Menu} options={{ title: 'nibble' }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
