import * as React from 'react';
import * as firebase from 'firebase';
import '@firebase/firestore';

import { View, Text, Button, SafeAreaView, FlatList, StyleSheet, Dimensions } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
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

//Menu class
export default class Menu extends React.Component{
  constructor(props) {
      super(props);
      this.state = {location: null, address: ''};
      this.state = {lat: 0, lon: 0};
      this._getLocationAsync();
      //this.storeRestaurant();
      this.state = {places: []};
      this.state = {TIMES: [
          {
            id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
            time: 'LIVE',
            restaurants: []
          },
          /*{
            id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
            time: '21:00',
            restaurants: []
          },
          {
            id: '58694a0f-3da1-471f-bd96-145571e29d72',
            time: '22:00',
            restaurants: []
          },*/
        ],
      };
      this.initTimes();
      this.getTimes();
      
  }

  initTimes = () => {
    var hours = new Date().getHours(); 
    var thours = hours+1;
    var tarray = this.state.TIMES;
    for(var i=0; i < 24; i++)
    { 
      var t = thours + ':00';
      console.log(t);
      var time1 = {id: i, time: t, restaurants:[]};
      tarray.push(time1);
      //this.setState({TIMES: this.state.TIMES.concat(time1)});
      if(thours == 24)
      {
        thours = 0;
      }
      else
      {
        thours++;
      }
    }
    this.setState({TIMES: tarray});
    
  }

  getTimes = () => {
      var hours = new Date().getHours(); 
          firestoreDB.collection("restaurants").get().then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            var data = doc.data();
            var t = data.time;
            if(t == hours)
            {
              t = 'LIVE';
            }
              for(var i =0; i < this.state.TIMES.length; i++)
              {
                if(t.localeCompare(this.state.TIMES[i].time) ==0)
                {
                  var tempArray = this.state.TIMES;
                  var a1 = data.name;
                  var a2 = data.id;
                  var a3 = data.description;
                  var a4 = data.image;
                  var a5 = data.lat;
                  var a6 = data.lon;
                  var rest = {name: a1, id: a2, description: a3, image: a4, lat: a5, lon:a6 };
                  tempArray[i].restaurants.push(rest);
                  this.setState({TIMES: tempArray});
                }
              }
            });
      });
    }

    



  //firebase ADD
  /*storeRestaurant = () => {
    firestoreDB.collection("restaurants").doc("Dulce").set({
      lat: 0,
      long: 0,
      description: "We serve the finest specialty coffees & teas, along with fresh salads, sandwiches and baked goods made in-house daily!",
      image: "placeholder"
    })
  }*/

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
    const coords = latitude + ", " + longitude;
          opencage.geocode({ key, q: coords }).then(response => {
            result = response.results[0];
            this.setState({address: (result.formatted).substring(0,(result.formatted).indexOf(','))});
          });
  };

  render(){
    //Getting the location
     let text = 'Waiting..';
     if (this.state.location) {
        text = JSON.stringify(this.state.location);
      }
      const {address} = this.state;


    return( 
      <View style = {{flex:1}}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text>{address}</Text>
        </View>
        <SafeAreaView style = {{flex: 20}}>
          <FlatList style = {{flex: 1}}
            data={this.state.TIMES}
            renderItem={({ item }) => <TimeSlot time={item.time} dealsList={item.restaurants}/>}
            keyExtractor={timeSlot => timeSlot.id}
            showsVerticalScrollIndicator={false}
          />
        </SafeAreaView>
      </View>
      );
  }
}

//time slot component
function TimeSlot({ time, dealsList }) {
  return (
    <View>
      <Text style={styles.timeHeader}>{time}</Text>
      
      <SafeAreaView>
        <FlatList style = {{flex: 1}}
          data={dealsList}
          renderItem={({ item }) => <DealCard restaurant={item.name} itemName={item.description} tags={item.description}/>}
          keyExtractor={timeSlot => timeSlot.id}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
    </View>
    // <View style={styles.box}>
    //   <Text style={styles.title}>{title}</Text>
    //   <Text style={styles.item}>{menuItem}</Text>
    // </View>
  );
}

//deal component
function DealCard({restaurant, itemName, tags}){
  return(
  <View style = {styles.box}>
    <Text style = {styles.restaurantName}>{restaurant}</Text>
    <Text>{itemName}</Text>
  </View>);
}

//each of these will pass in a time and list of deals that start at this time
const TIMES = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    time: 'LIVE',
    dealsList: 'Glazed Donut'
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    time: '8:30',
    dealsList: 'Tonkatsu Ramen'
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    time: '9:00',
    dealsList: 'Flaming Hot Chicken'
  },
];

//temporary deals list, need to make a separate list for every time slot
const DEALS = [
  {
    id: '1',
    restaurant: 'Dulce',
    itemName: 'Glazed Donut',
    tags: ["pastries", "desserts"]
  },
  {
    id: '2',
    restaurant: 'Honeybird',
    itemName: 'Tonkatsu Ramen',
    tags: ["savory, japanese"]
  },
  {
    id: '3',
    restaurant: 'Cava',
    itemName: 'Salad',
    tags: ["healthy, greens"]
  },
];

const styles = StyleSheet.create({
  timeHeader: {
    marginLeft: 0.05 * screenWidth,
    fontSize: 20,
    // fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: 'bold',
  },
  restaurantName:{
    fontWeight: 'bold',
    fontSize: 18
  },
  container: {
    flex: 1,
  },
  box: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    width: 0.9 * screenWidth
  },
  title: {
    fontSize: 16
  },
  item:{
    fontSize: 12
  }
});
