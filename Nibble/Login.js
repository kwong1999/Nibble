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
export default class Signup extends React.Component{
  constructor(props)
  {
    super(props);

    this.state = {
      email: 'Email',
      password: 'Password',
      firstStyle: styles.inactiveBorder,
      secondStyle: styles.activeBorder,
      secure: false,
    };

    this.setFirstActive = this.setFirstActive.bind(this);
    this.setSecondActive = this.setSecondActive.bind(this);
    this.loginConfirm = this.loginConfirm.bind(this);

    this.clearEmail = this.clearEmail.bind(this);
    this.clearPassword = this.clearPassword.bind(this);

    this.resetEmail = this.resetEmail.bind(this);
    this.resetPassword = this.resetPassword.bind(this);


  }
  render(){
    var firstStyle = styles.inactiveBorder;
    return(
      <KeyboardAvoidingView keyboardVerticalOffset = {80} behavior={Platform.OS == "ios" ? "padding" : "height"} style = {{flex: 1, height: 5000}}>
      <ScrollView overScrollMode = 'always' contentContainerStyle = {{backgroundColor: '#FFFFFF', alignItems:'center'}}>
        <View><Image source = {require('./signupPic.png')} style = {{left: '15%', marginTop: 40}}/></View>
        <View style={{flexDirection:'row'}}>
          <Text style = {{opacity: 0.7}}>Don't have an account? </Text>
          <TouchableOpacity onPress={()=>{this.props.navigation.navigate('Signup')}}><Text style = {{color:'#8134FF', fontWeight:'bold'}}>Sign up</Text></TouchableOpacity>
        </View>
        <TouchableOpacity activeOpacity = {1} onPress= {this.setFirstActive} style = {this.state.firstStyle}>
          <TextInput clearButtonMode="while-editing" autoCapitalize='none' onFocus = {()=>{this.setFirstActive();  this.clearEmail();}} style = {[styles.textInput, {marginTop: 20}]} onChangeText={text => this.email(text)} value = {this.state.email} onBlur={this.resetEmail}/>
          <TextInput clearButtonMode="while-editing" secureTextEntry={this.state.secure} onFocus = {() => {this.setFirstActive(); this.setState({secure: true}); this.clearPassword();}} style = {[styles.textInput, {marginTop: 25}]} onChangeText={text => this.password(text)}  value = {this.state.password} onBlur ={this.resetPassword}/>
          <Text> </Text>
          <Text> </Text>
        </TouchableOpacity>
        <TouchableOpacity style = {{marginTop: 20}}><Text style = {{color: '#8134FF', fontSize: 13, opacity: 0.8, fontWeight:'bold'}}>Forgot Password</Text></TouchableOpacity>
        <TouchableOpacity onPress = {this.loginConfirm} style = {[styles.button]}><Text style = {{color:'#FFFFFF', fontSize: 18, fontWeight: 'bold'}}>Log in</Text></TouchableOpacity>
      </ScrollView>

      </KeyboardAvoidingView>
    );
  }

  loginConfirm(){
    var email = this.state.email;
    firestoreDB.collection("users").doc(email).get().then(doc => {
        if(!doc.exists) {
          console.log('No such user');
          alert('Please enter a valid username');
        }
        else{
          if (doc.data().password == this.state.password)
          {
            this.storeData(email);
            this.props.navigation.navigate('Home', {email: this.state.email});
          }
          else{
            console.log('incorrect password');
            console.log(doc.data().password);
             alert('Wrong password');
          }
        }
      })
  }


  storeData = async (email) => {
    console.log("added!1");

    try {
      console.log("added!2");

      AsyncStorage.setItem('email', email);
      console.log("added!3");

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

  resetEmail(){
    if(this.state.email == "")
      this.setState({email: "Email"});
  }

  clearEmail(){
    if(this.state.email == "Email")
      this.setState({email: ""});
  }

  resetPassword(){
    if(this.state.password == "")
      this.setState({password: "Password", secure:false});
  }

  clearPassword(){
    if(this.state.password == "Password")
      this.setState({password: "", secure: true});
  }
}

const styles = StyleSheet.create({
  button: {
    top: 140,
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
    width: 327, borderRadius: 22, top: 20, borderWidth:4, borderColor: '#8134FF', alignItems: 'center', marginBottom: 20
  },

  inactiveBorder:{
    width: 327, borderRadius: 22, top: 20, borderWidth:4, borderColor: '#c39aff', alignItems: 'center', marginBottom: 20
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
