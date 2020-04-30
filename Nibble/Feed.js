import * as React from 'react';
import * as firebase from 'firebase';
import '@firebase/firestore';
import Modal from 'react-native-modal';
import { View, Text, Button, SafeAreaView, ScrollView, FlatList, StyleSheet, Dimensions, Image, TouchableOpacity, TextInput, KeyboardAvoidingView, AsyncStorage, Picker} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import Constants from 'expo-constants';
import opencage from 'opencage-api-client';
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

export default class Feed extends React.Component{
  constructor(props)
  {
    super(props);
    const { navigation, route } = props;

    this.state = {
      rewardPoints: 10
      };
      //this.getInfo = this.getInfo.bind(this);


  }


  render(){
    return(
        <View style = {{flex: 1, alignItems:'center'}}>
          <TouchableOpacity style = {styles.rewardsBox}>
            <LinearGradient start = {[0,0]} colors={['#8134FF', '#AD7CFE']} style = {{width: '100%', height:'100%', borderRadius: 10}}>
              <View style ={{flexDirection: 'row', alignItems:'center', height: '100%', width: '100%', justifyContent:'space-between'}}>
                <Image style = {{position: 'absolute', left: 210, top: 16}} source={require("./rewardStar.png")}/>
                <Image style = {{position: 'absolute', left: 180, top: 60}} source={require("./rewardStar.png")}/>
                <Image style = {{position: 'absolute', left: 130, top: 26}} source={require("./rewardStar.png")}/>
                <Text style = {{color: '#FFFFFF', fontWeight: 'bold', fontSize: 18, left: '20%'}}>Claim{'\n'}Rewards</Text>
                <View style = {{right: '20%',height: '60%', width: '17%', borderRadius: 50, borderWidth: 4, borderColor:'#FFFFFF', justifyContent: 'center', alignItems:'center'}}>
                  <Text style = {{fontWeight: 'bold', fontSize: 14, color: '#FFFFFF'}}>{this.state.rewardPoints}</Text>
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>
          <View>
            <Text style = {{color: '#FFFFFF', fontWeight: 'bold', fontSize: 18,}}>$5 off at 500 points</Text>
          </View>

        </View>
      );
  }
}

const styles = StyleSheet.create({
  rewardsBox:{
    top:'5%',
    width: '85%',
    height: '13%',
    borderRadius: 14,
    borderColor: "#FFFFFF",
    borderWidth: 4,

    shadowColor: '#8134FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
  }
});
