import * as React from 'react';
import * as firebase from 'firebase';
import '@firebase/firestore';
import Modal from 'react-native-modal';
import { View, Text, Button, SafeAreaView, FlatList, StyleSheet, Dimensions, Image, TouchableOpacity, AsyncStorage} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { CommonActions } from '@react-navigation/native';
import * as Font from 'expo-font';
import { AppLoading } from 'expo';

import Signup from './Signup';

const fetchFonts = () => {
return Font.loadAsync({
      'Inter-Regular': require('./assets/Inter-Regular.otf')
      });
};

const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);


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
    //this.storeData();
    console.disableYellowBox = true;
    this.state = {
      dataloaded: false,
    };
   
  };

  storeData = async () => {

      try {

        AsyncStorage.setItem('email', 'null');
        AsyncStorage.setItem('profileImage', '');

      } catch (error) {
        // Error saving data
      }
    };
  render(){
    const {dataloaded} = this.state;
    if(!dataloaded)
    {
      return (
        <AppLoading
        startAsync={fetchFonts}
        onFinish={() => this.setState({dataloaded: true})} />
        );
    } 
    return(
      <View style = {{flex:10, backgroundColor: '#8134FF', alignItems: 'center'}}>
      <View><Image source = {require('./highLogo.png')} style = {{marginTop: 130, height: 100, width: 150, resizeMode: 'contain'}}/></View>
        <View style = {{ marginTop:'95%'}}>
          <TouchableOpacity onPress = {()=>this.props.navigation.navigate('Login')} style = {[styles.button]}><Text style = {{color:'#FFFFFF', fontSize: 18, fontWeight: 'bold'}}>Log In</Text></TouchableOpacity>
          <TouchableOpacity onPress = {()=>this.props.navigation.navigate('Signup')} style = {[styles.button, {top: 20, backgroundColor: '#FFFFFF'}]}><Text style = {{color:'#8134FF', fontSize: 18, fontWeight: 'bold'}}>Sign up</Text></TouchableOpacity>
          <TouchableOpacity onPress = {()=>this.props.navigation.navigate('Home', {email: 'null'})} style = {[{marginTop: 40, alignItems: 'center', fontFamily: 'Inter-Regular'}]}><Text style = {{color:'#FFFFFF', fontSize: 14, fontWeight: 'bold'}}>Skip for now</Text></TouchableOpacity>
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
    height: 50,
    fontFamily: 'Inter-Regular',
  }
});
