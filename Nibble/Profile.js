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

export default class Profile extends React.Component{
  constructor(props)
  {
    super(props);

    this.state = {
      name: 'Name',
      phoneNumber: 'Phone Number',
      month: 'January',
      year: 2020,
      email: '@usc',
      address: '',
      lat: 0,
      lon: 0,
      location: null,
      image: 'nibble.png',
      };
      //this.getInfo = this.getInfo.bind(this);
      this._getLocationAsync();
   
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
  
    let currentComponent = this;
    var docRef = firestoreDB.collection('users').doc(this.state.email);

    docRef.get().then(function(doc) {
        if (doc.exists) {
            var temp = doc.data().name;
            currentComponent.setState({name: temp});
            temp = doc.data().phoneNumber;
            currentComponent.setState({phoneNumber: temp});
            temp = doc.data().month;
            currentComponent.setState({month: temp});
            temp = doc.data().year;
            currentComponent.setState({year: temp});

        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });

  }
  componentDidMount() {
      this.getInfo();
    }

  render(){
    return(
      <View style = {{flex:1}}>
      <Text>{'\n\n\n'}</Text>
          <View style={styles.container1}>
            <View style={{width: '10%'}}>
            </View>
            <View style={{width: '30%'}}> 
              <Image source={require('./nibble.png')} style = {{ width: 117, height: 117, borderRadius: 100 }}/>
            </View>
            <View style={{width: '10%'}}>
            </View>
            <View style={{width: '50%'}}> 
              <Text style={{marginTop: 30, fontWeight: 'bold', fontSize: 25}}> {this.state.name} </Text>
              <Text style={{fontStyle: 'italic', fontSize: 12}}> joined {this.state.month}, {this.state.year} </Text>            
              </View>
          </View>
          <View style={{backgroundColor: '#D3D3D3', position: 'absolute', top: 220, left: 30, height: 1, width: 300}}>
          </View>
          <View style={{backgroundColor: '#D3D3D3', position: 'absolute', top: 275, left: 30, height: 1, width: 300}}>
          </View>
          <View style={{backgroundColor: '#D3D3D3', position: 'absolute', top: 325, left: 30, height: 1, width: 300}}>
          </View>
          <View style={[styles.container1, {position: 'absolute', top: 240}]}>
          <View style={{width: '10%'}}>
            </View>
            <View style={{width: '30%'}}>
            <Text>Email </Text>
            <Text>{'\n'}</Text>
            <Text>Phone Number </Text>
            <Text>{'\n'}</Text>
            <Text>Current Location </Text>
            </View>
            <View style={{width: '20%'}}>
            </View>
            <View style={{width: '30%'}}>
            <Text style={{fontWeight: 'bold'}}>{this.state.email} </Text>
            <Text>{'\n'}</Text>
            <Text style={{fontWeight: 'bold'}}>{this.state.phoneNumber} </Text>
            <Text>{'\n'}</Text>
            <Text style={{fontWeight: 'bold'}}>{this.state.address} </Text>
            </View>
            <View style={{width: '10%'}}>
            </View>
          </View>
      </View>
         
     
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
  },
  container1: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start', // if you want to fill rows left to right
    height: '10%'
  },
});
