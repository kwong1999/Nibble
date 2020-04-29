import * as React from 'react';
import * as firebase from 'firebase';
import '@firebase/firestore';
import Modal from 'react-native-modal';
import { View, Text, Button, SafeAreaView, FlatList, StyleSheet, Dimensions, Image, TouchableOpacity, AsyncStorage} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { CommonActions } from '@react-navigation/native';

import Signup from './Signup'


const firebaseConfig = {
  apiKey: "<>",
  authDomain: "<lavanibble.firebaseapp.com>",
  databaseURL: "<https://lavanibble.firebaseio.com>",
  storageBucket: "<lavanibble.appspot.com>",
  measurementId: "<G-TGJ80SB72J>",
  projectId: "lavanibble"
};

if(!firebase.apps.length){
  firebase.initializeApp(firebaseConfig);
}

const firestoreDB = firebase.firestore();

//Menu class
export default class Onboard extends React.Component{
  constructor(props){
    super(props);
    this.storeData = this.storeData.bind(this);
    this.storeData();
    console.disableYellowBox = true;

  };

  storeData = async () => {

      try {
        console.log("added null");

        AsyncStorage.setItem('email', 'null');
        AsyncStorage.setItem('profileImage', '');

      } catch (error) {
        // Error saving data
      }
    };

  render(){
    return(
      <View style = {{flex:10, backgroundColor: '#8134FF', alignItems: 'center'}}>
        <View><Image source = {require('./logo.png')} style = {{marginTop: 130}}/></View>
        <View style = {{flex: 9, top:400}}>
          <TouchableOpacity onPress = {()=>this.props.navigation.navigate('Login')} style = {[styles.button]}><Text style = {{color:'#FFFFFF', fontSize: 18, fontWeight: 'bold'}}>Log In</Text></TouchableOpacity>
          <TouchableOpacity onPress = {()=>this.props.navigation.navigate('Signup')} style = {[styles.button, {top: 20, backgroundColor: '#FFFFFF'}]}><Text style = {{color:'#8134FF', fontSize: 18, fontWeight: 'bold'}}>Sign up</Text></TouchableOpacity>
          <TouchableOpacity onPress = {()=>this.props.navigation.navigate('Home', {email: 'null'})} style = {[{marginTop: 40, alignItems: 'center',}]}><Text style = {{color:'#FFFFFF', fontSize: 14, fontWeight: 'bold'}}>Skip for now</Text></TouchableOpacity>
        </View>
      </View>
      );
  }
//() => navigation.navigate('Signup')
  navigateToScreen = (route) => {
        const navigationAction = NavigationActions.navigate({
            routeName: route
        })
        this.props.navigation.dispatch(navigationAction)
    }
};





const styles = StyleSheet.create({
  button: {
    borderWidth: 3,
    borderColor: '#FFFFFF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    width: 327,
    height: 50
  }
});
