import * as React from 'react';
import { View, Text, Button, SafeAreaView, FlatList, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

//Menu class
export default class Menu extends React.Component{
  constructor(props) {
      super(props);
  }
  
  render(){
    return(
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text>Home</Text>
        </View>
      );
  }
}
const styles = StyleSheet.create({
});
