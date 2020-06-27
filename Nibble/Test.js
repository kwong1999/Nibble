import * as React from 'react';
import * as firebase from 'firebase';
import '@firebase/firestore';
import Modal from 'react-native-modal';
import { View, Text, Button, SafeAreaView, FlatList, StyleSheet, Dimensions, Image, TouchableWithoutFeedback, TouchableOpacity, ScrollView, TextInput, Picker, KeyboardAvoidingView, AsyncStorage} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import opencage from 'opencage-api-client';
import Signup from './Signup';


export default class Menu extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      checkoutButtonOpacity: 0,
      openCheckout: false,
      dataloaded: false
    };
  }


  render() {
    return (

      <View style = {{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#8F1111'}}>

      <View style = {[styles.checkOutButton], {marginBottom: 25, marginLeft: 65}}>
        <TouchableOpacity onPress = {this.func} >
          <Text> toggle </Text>
        </TouchableOpacity>
      </View>

      <View style = {{width: '100%', marginLeft: 65, opacity: this.state.checkoutButtonOpacity}}>
        <TouchableOpacity onPress = {this.checkout} style = {[styles.checkOutButton]}>
          <Text> Hello </Text>
        </TouchableOpacity>
      </View>

      </View>
    );
  }

  func = () => {
    this.setState({checkoutButtonOpacity: 1});
  }

  checkout = () => {
    this.setState({checkoutButtonOpacity: 0});
  }
}


const styles = StyleSheet.create({

  checkOutButton:
  {
    fontSize: 20,
    bottom: '15%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#8134FF',
    height: 40,
    width: '80%',
    borderRadius: 12,
  },

});
