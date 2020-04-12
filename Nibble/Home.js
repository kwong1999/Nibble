import * as React from 'react';
import * as firebase from 'firebase';
import '@firebase/firestore';

import { View, Text, Button, SafeAreaView, FlatList, StyleSheet, Dimensions, Image } from 'react-native';
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
      this.state = {TIMES: []};
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
        var found =0;
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
              var a7 = data.tag0;
              var a8 = data.tag1;
              var a9 = data.watchers;
              var rest = {name: a1, id: a2, description: a3, image: a4, lat: a5, lon:a6, tag0: a7, tag1: a8, watchers: a9};
              tempArray[i].restaurants.push(rest);
              this.setState({TIMES: tempArray});
              found =1;
            }
          }
          
        });
      });
    }


  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        location: 'Permission to access location was denied',
      });
    }

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
      let timeR = this.state.TIMES.filter(item => item.restaurants.length > 0);

    return( 
      <View style = {{flex:1}}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text>{address}</Text>
        </View>
        <SafeAreaView style = {{flex: 20}}>
          <FlatList style = {{flex: 1}}
            data={timeR}
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
  var hours = new Date().getHours(); 
  var min = new Date().getMinutes();
  var rHours= time.substr(0, time.indexOf(':')); 
  var integer = parseInt(rHours, 10);
  var h = Math.abs(hours - rHours-1);
  var m = 60-min;
  var liveString = "live in " + h + " h, " + m + " minutes";
  return (
    <View>
    <View style={styles.container1}>
    <View style={styles.item5}>
      <Text style={styles.timeHeader}>{time}</Text>
      </View>
      <View style={styles.item6}>
      <Text style= {styles.watch}>{liveString}</Text>
      </View>
      </View>
      <SafeAreaView>
        <FlatList style = {{flex: 1}}
          data={dealsList}
          renderItem={({ item }) => <DealCard restaurant={item.name} itemImage={item.image} tag0={item.tag0} tag1={item.tag1} watch={item.watchers}/>}
          keyExtractor={timeSlot => timeSlot.id}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
      <Text>{"\n"}</Text>
    </View>
    // <View style={styles.box}>
    //   <Text style={styles.title}>{title}</Text>
    //   <Text style={styles.item}>{menuItem}</Text>
    // </View>
  );
}

//deal component
function DealCard({restaurant, itemImage, tag0, tag1, watch}){
  var wString = watch + " biters watching";
  return(
  <View style = {styles.box}>
    <View style={styles.container1}>
      <View style={styles.item1}>
        <Text style = {styles.restaurantName}>{restaurant}</Text>
        <Text>{"\n"}</Text>
        <View style={styles.container1}> 
          <View style={styles.item2}>
              <Text>{tag0}</Text>
            </View>
            <View style={styles.item4}>
            </View>
           <View style={styles.item2}>
              <Text>{tag1}</Text>
            </View>
            <View style={styles.item4}>
            </View>
        </View>
      </View>
      <View style={styles.item3}>
        <Image source = {{uri:itemImage}}
        style = {{ width: 120, height: 120 }}
        />
      </View>
    </View>
    <Text style={styles.watch}>{wString}</Text>
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
    restaurant: 'Dulce',
    itemName: 'Glazed Donut',
    tags: ["pastries", "desserts"]
  },
  {
    restaurant: 'Honeybird',
    itemName: 'Tonkatsu Ramen',
    tags: ["savory, japanese"]
  },
  {
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
  watch:{
    fontSize: 12
  },
  container: {
    flex: 1,
  },
  box: {
    backgroundColor: '#E8E8E8',
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
  },
  container1: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start' // if you want to fill rows left to right
  },
  item1: {
    width: '65%' // is 50% of container width
  },
  item2: {
    width: '40%',
    backgroundColor: '#FFFFFF',
    height: 25,
    justifyContent: 'center', 
    alignItems: 'center' 
     // is 50% of container width
  },
  item3: {
    width: '35%' // is 50% of container width
  },
  item4: {
    width: '10%' // is 50% of container width
  },
  item5: {
    width: '65%' // is 50% of container width
  },
  item6: {
    width: '35%' // is 50% of container width
  }
});
