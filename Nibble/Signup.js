import * as React from 'react';
import * as firebase from 'firebase';
import '@firebase/firestore';
import Modal from 'react-native-modal';
import { View, Text, Button, SafeAreaView, ScrollView, FlatList, StyleSheet, Dimensions, Image, TouchableOpacity, TextInput, KeyboardAvoidingView, AsyncStorage} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

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
  constructor(props)
  {
    super(props);

    this.state = {
      firstName: "First Name",
      lastName: "Last Name",
      phoneNumber: "Phone Number",
      email: "Email",
      password: "Password",
      confirm: "Confirm Password",
      firstStyle: styles.activeBorder,
      secondStyle: styles.inactiveBorder
      // firstStyle: {width: 327, borderRadius: 22, top: 20, borderWidth:3, borderColor: '#8134FF', alignItems: 'center'}
    };
    this.first = React.createRef();
    this.last = React.createRef();
    this.phone = React.createRef();
    this.setFirstActive = this.setFirstActive.bind(this);
    this.setSecondActive = this.setSecondActive.bind(this);
    this.signUpConfirm = this.signUpConfirm.bind(this);
  }
  render(){
    var firstStyle = styles.inactiveBorder;
    return(
      <KeyboardAvoidingView keyboardVerticalOffset = {80} behavior={Platform.OS == "ios" ? "padding" : "height"} style = {{flex: 1, height: 5000}}>
      <ScrollView overScrollMode = 'always' contentContainerStyle = {{backgroundColor: '#FFFFFF', alignItems:'center'}}>
        <View><Image source = {require('./signupPic.png')} style = {{left: '15%', marginTop: 40}}/></View>
        <TouchableOpacity activeOpacity = {1} onPress= {this.setFirstActive} style = {this.state.firstStyle}>
          <TextInput clearButtonMode="while-editing" style = {[styles.textInput, {marginTop: 20}]} onChangeText={text => this.firstName(text)} value = {this.state.firstName}/>
          <TextInput clearButtonMode="while-editing" style = {[styles.textInput, {marginTop: 25}]} onChangeText={text => this.lastName(text)}  value = {this.state.lastName}/>
          <TextInput clearButtonMode="while-editing" style = {[styles.textInput, {marginTop: 25, marginBottom: 35}]} onChangeText={text => this.phoneNumber(text)} value = {this.state.phoneNumber}/>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity = {1} onPress= {this.setSecondActive} style = {[this.state.secondStyle, {marginTop: 50}]}>
          <TextInput clearButtonMode="while-editing" style = {[styles.textInput, {marginTop: 20}]} onChangeText={text => this.email(text)} value = {this.state.email}/>
          <TextInput clearButtonMode="while-editing" style = {[styles.textInput, {marginTop: 25}]} onChangeText={text => this.password(text)}  value = {this.state.password}/>
          <TextInput clearButtonMode="while-editing" style = {[styles.textInput, {marginTop: 25, marginBottom: 35}]} onChangeText={text => this.confirm(text)} value = {this.state.confirm}/>
        </TouchableOpacity>
        <TouchableOpacity onPress = {this.signUpConfirm} style = {[styles.button]}><Text style = {{color:'#FFFFFF', fontSize: 18, fontWeight: 'bold'}}>Sign up</Text></TouchableOpacity>

        <Text> </Text>
        <Text> </Text>
        <Text> </Text>
        <Text> </Text>
        <Text> </Text>
        <Text> </Text>
        <Text> </Text>
        <Text> </Text>
      </ScrollView>

      </KeyboardAvoidingView>
      // <SafeAreaView>
      //   <FlatList
      //     data={null}
      //     renderItem={this.renderView}
      //   />
      // </SafeAreaView>
      );
  }

  signUpConfirm(){
    var name = this.state.firstName + ' ' + this.state.lastName;
    var Smonth = new Date().getMonth() + 1;
    var Syear = new Date().getFullYear();
    firestoreDB.collection("users").doc(this.state.email).set({
      name: name,
      password: this.state.password,
      phoneNumber: this.state.phoneNumber,
      month: Smonth,
      year: Syear,
    });
    this.storeData(name, this.state.phoneNumber, this.state.email, Smonth, Syear);

    this.props.navigation.navigate('Home', {email: this.state.email});

  }

  storeData = async (name, phoneNumber, email, month, year) => {
    console.log("added!");

    try {
      console.log("added!");

      AsyncStorage.setItem('email', email);

      // await AsyncStorage.setItem('name', name);
      // await AsyncStorage.setItem('phoneNumber', phoneNumber);
      // await AsyncStorage.setItem('month', month);
      // await AsyncStorage.setItem('year', year);
      console.log("added!");

    } catch (error) {
      // Error saving data
    }
  };

  setFirstActive(){
    this.setState({firstStyle: styles.activeBorder, secondStyle: styles.inactiveBorder});
  }

  setSecondActive(){
    this.setState({firstStyle: styles.inactiveBorder, secondStyle: styles.activeBorder});
  }


  firstName(text){
    this.setState({firstName: text});
  }
  lastName(text){
    this.setState({lastName: text});
  }
  phoneNumber(text){
    this.setState({phoneNumber: text})
  }

  email(text){
    this.setState({firstStyle: styles.inactiveBorder, secondStyle: styles.activeBorder});
    this.setState({email: text});
  }
  password(text){
    this.setState({firstStyle: styles.inactiveBorder, secondStyle: styles.activeBorder});
    this.setState({password: text});
  }
  confirm(text){
    this.setState({firstStyle: styles.inactiveBorder, secondStyle: styles.activeBorder});
    this.setState({confirm: text});
  }


}

const styles = StyleSheet.create({
  button: {
    top: 70,
    borderWidth: 3,
    backgroundColor: '#8134FF',
    borderColor: '#FFFFFF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    width: 327,
    height: 50
  },
  activeBorder: {
    width: 327, borderRadius: 22, top: 20, borderWidth:6, borderColor: '#8134FF', alignItems: 'center'
  },

  inactiveBorder:{
    width: 327, borderRadius: 22, top: 20, borderWidth:6, borderColor: '#c39aff', alignItems: 'center'
  },
  textInput: {
    fontSize: 14,
    height: 40,
    width: '80%',
    paddingLeft: 5,
    borderBottomWidth: 2,
    borderBottomColor: '#6200f5'
  }
});
