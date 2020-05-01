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
      firstName: "First Name",
      lastName: "Last Name",
      phoneNumber: "Phone Number",
      email: "Email",
      password: "Password",
      confirm: "Confirm Password",
      firstStyle: styles.activeBorder,
      secondStyle: styles.inactiveBorder,
      securePass: false,
      secureCon: false,
      // firstStyle: {width: 327, borderRadius: 22, top: 20, borderWidth:3, borderColor: '#8134FF', alignItems: 'center'}
    };
    this.first = React.createRef();
    this.last = React.createRef();
    this.phone = React.createRef();
    this.setFirstActive = this.setFirstActive.bind(this);
    this.setSecondActive = this.setSecondActive.bind(this);
    this.signUpConfirm = this.signUpConfirm.bind(this);
    this.clearFirst = this.clearFirst.bind(this);
    this.clearLast = this.clearLast.bind(this);
    this.clearEmail = this.clearEmail.bind(this);
    this.clearPhone = this.clearPhone.bind(this);
    this.clearPassword = this.clearPassword.bind(this);
    this.clearConfirm = this.clearConfirm.bind(this);
    this.resetFirst = this.resetFirst.bind(this);
    this.resetLast = this.resetLast.bind(this);
    this.resetPhone = this.resetPhone.bind(this);
    this.resetEmail = this.resetEmail.bind(this);
    this.resetPassword = this.resetPassword.bind(this);
    this.resetConfirm = this.resetConfirm.bind(this);


     console.disableYellowBox = true;

  }
  render(){
    var firstStyle = styles.inactiveBorder;
    return(
      <KeyboardAvoidingView keyboardVerticalOffset = {80} behavior={Platform.OS == "ios" ? "padding" : "height"} style = {{flex: 1, height: 5000}}>
      <ScrollView overScrollMode = 'always' contentContainerStyle = {{backgroundColor: '#FFFFFF', alignItems:'center'}}>
        <View style={styles.viewContainer}>
          <View style={{flexDirection:'row'}}>
            <Text style = {{opacity: 0.7}}>Already have an account? </Text>
            <TouchableOpacity onPress={()=>{this.props.navigation.navigate('Login')}}><Text style = {{color:'#8134FF', fontWeight:'bold'}}>Log in</Text></TouchableOpacity>
          </View>
          <TouchableOpacity activeOpacity = {1} onPress= {this.setFirstActive} style = {[this.state.firstStyle, {marginTop: 20}]}>
            <TextInput clearButtonMode="while-editing" style = {[styles.textInput, {marginTop: 20}]} onChangeText={text => this.firstName(text)} value = {this.state.firstName} onFocus = {this.clearFirst} onBlur={this.resetFirst}/>
            <TextInput clearButtonMode="while-editing" style = {[styles.textInput, {marginTop: 25}]} onChangeText={text => this.lastName(text)}  value = {this.state.lastName} onFocus={this.clearLast} onBlur={this.resetLast}/>
            <TextInput clearButtonMode="while-editing" style = {[styles.textInput, {marginTop: 25, marginBottom: 35}]} onChangeText={text => this.phoneNumber(text)} value = {this.state.phoneNumber} onFocus={this.clearPhone} onBlur={this.resetPhone}/>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity = {1} onPress= {this.setSecondActive} style = {[this.state.secondStyle, {marginTop: 50}]}>
            <TextInput clearButtonMode="while-editing" autoCapitalize = "none" style = {[styles.textInput, {marginTop: 20}]} onChangeText={text => this.email(text)} value = {this.state.email} onFocus={this.clearEmail} onBlur={this.resetEmail}/>
            <TextInput clearButtonMode="while-editing"  secureTextEntry={this.state.securePass} style = {[styles.textInput, {marginTop: 25}]} onFocus ={() => {this.setState({securePass: true});}} onChangeText={text => this.password(text)}  value = {this.state.password} onFocus={this.clearPassword} onBlur={this.resetPassword}/>
            <TextInput clearButtonMode="while-editing" secureTextEntry={this.state.secureCon} style = {[styles.textInput, {marginTop: 25, marginBottom: 35}]} onFocus ={() => {this.setState({secureCon: true});}} onChangeText={text => this.confirm(text)} value = {this.state.confirm} onFocus={this.clearConfirm} onBlur={this.resetConfirm}/>
          </TouchableOpacity>
          <TouchableOpacity onPress = {this.signUpConfirm} style = {[styles.button]}><Text style = {{color:'#FFFFFF', fontSize: 18, fontWeight: 'bold'}}>Sign up</Text></TouchableOpacity>
          </View>
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
    var RandomNumber = Math.floor(Math.random() * 100) + 1 ;
    firestoreDB.collection('users').doc(this.state.email).get()
    .then((docSnapshot) => {
    if (!docSnapshot.exists) {
      firestoreDB.collection("users").doc(this.state.email).set({
      name: name,
      password: this.state.password,
      phoneNumber: this.state.phoneNumber,
      month: Smonth,
      year: Syear,
      payment: 'null',
      rewards: RandomNumber
    });
    this.storeData(name, this.state.phoneNumber, this.state.email, Smonth, Syear);

    this.props.navigation.navigate('Home', {email: this.state.email});
    }
    else
    {
      alert('This email already has an account');
    }
  });


  }

  storeData = async (name, phoneNumber, email, month, year) => {

    try {

      AsyncStorage.setItem('email', email);
      AsyncStorage.setItem('rewards', '0');


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

  clearFirst(){
    this.setState({firstName: ""});
  }
  clearLast(){
    this.setState({lastName: ""});
  }
  clearPhone(){
    this.setState({phoneNumber: ""});
  }
  clearEmail(){
    if(this.state.email == "Email")
      this.setState({email: ""});
  }
  clearPassword(){
    this.setState({password: "", securePass: true});
  }
  clearConfirm(){
    this.setState({confirm: "", secureCon: true});
  }

  resetFirst(){
    if(this.state.firstName == "")
      this.setState({firstName: "First Name"});
  }
  resetLast(){
    if(this.state.lastName == "")
      this.setState({lastName: "Last Name"});
  }
  resetEmail(){
    if(this.state.email == "")
      this.setState({email: "Email"});
  }
  resetPhone(){
    if(this.state.phoneNumber == "")
      this.setState({phoneNumber: "Phone Number"});
  }
  resetPassword(){
    if(this.state.password == "")
      this.setState({password: "Password", securePass:false});
  }
  resetConfirm(){
    if(this.state.confirm == "")
      this.setState({confirm: "Confirm", secureCon: false});
  }

}

const styles = StyleSheet.create({
  button: {
    marginTop: 30,
    marginBottom: 20,
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
  viewContainer:{
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    justifyContent: 'center',
    flex: 1,
    top: 30
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
