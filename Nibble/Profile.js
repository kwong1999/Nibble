import * as React from 'react';
import * as firebase from 'firebase';
import '@firebase/firestore';
import Modal from 'react-native-modal';
import { View, Text, Button, SafeAreaView, ScrollView, FlatList, StyleSheet, Dimensions, Image, TouchableOpacity, TextInput, KeyboardAvoidingView} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import opencage from 'opencage-api-client';

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
export default class Profile extends React.Component{
  constructor(props)
  {
    super(props);

    this.state = {
      name: "Name",
      phoneNumber: "Phone Number",
      month: "January",
      year: 2020,
      email: "@usc",
      address: "",
      lat: 0,
      lon: 0,
      location: null,
      };
      //this.getInfo = this.getInfo.bind(this);
      //this._getLocationAsync();
   
  }
  _getLocationAsync = async () => {
    // let { status } = await Permissions.askAsync(Permissions.LOCATION);
    // if (status !== 'granted') {
    //   this.setState({
    //     location: 'Permission to access location was denied',
    //   });
    // }

    let location = await Location.getCurrentPositionAsync({});
    const key = '5c3d93713edb442c825f89b7bc7d3aa4';
    const { latitude , longitude } = location.coords;
    this.setState({ location: {latitude, longitude}});
    this.setState({lat: latitude});
    this.setState({lon: longitude});
    const coords = latitude + ", " + longitude;
          opencage.geocode({ key, q: coords }).then(response => {
            result = response.results[0];
            this.setState({address: (result.formatted).substring(0,(result.formatted).indexOf(','))});
          });
  };

  getInfo = () => {
    
    var n, p, m, y;
    firestoreDB.collection("users").doc("@usc").get().then(function(doc) {
      const data = doc.data();
      console.log(data);
      n = data.name;
      p = data.phoneNumber;
      m = data.month;
      y = data.year;
      console.log(n);
      this.setState({name: n});
      
      console.log(n);
     
      
    });

      
      

  }
  componentDidMount() {
      this.getInfo();
    }

  render(){
    return(
          <Text style = {[styles.textInput, {marginTop: 20}]}> {this.state.name} </Text>
     
      );
  }

 

}

const styles = StyleSheet.create({
  textInput: {
    fontSize: 14,
    height: 40,
    width: '80%',
    paddingLeft: 5,
    borderBottomWidth: 2,
    borderBottomColor: '#6200f5'
  }
});
