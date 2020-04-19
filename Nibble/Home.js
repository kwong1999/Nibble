import * as React from 'react';
import * as firebase from 'firebase';
import '@firebase/firestore';
import Modal from 'react-native-modal';
import { View, Text, Button, SafeAreaView, FlatList, StyleSheet, Dimensions, Image, TouchableOpacity} from 'react-native';
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
      this.state = {openModal: false};
      this._getLocationAsync();
      this.state = {distance: ''};
      //this.storeRestaurant();
      this.state = {places: []};
      this.state = {modalRest: "", modalImage: null, modalAddress: "", modalWatching: "", modalTime: "", modalDeals: null};
      this.state = {ITEMS: []};
      this.state = {TIMES: []};
    }

  initTimes = () => {
    var hours = new Date().getHours();

    var thours = hours+1;
    var tarray = this.state.TIMES;
    var liveT = {id: '0', time: 'LIVE', restaurants:[]};
    tarray.push(liveT);

    for(var i=1; i < 25; i++)
    {
      var t = thours + ':00';
      console.log(t);
      var time1 = {id: i.toString(), time: t, restaurants:[]};
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
  distance(lat1, lon1)
  {
    var lat2 = this.state.lat;
    var lon2 = this.state.lon;
    if ((lat1 == lat2) && (lon1 == lon2)) {
      this.setState({distance: 0});
    }
    else {
      var radlat1 = Math.PI * lat1/180;
      var radlat2 = Math.PI * lat2/180;
      var theta = lon1-lon2;
      var radtheta = Math.PI * theta/180;
      var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      if (dist > 1) {
        dist = 1;
      }
      dist = Math.acos(dist);
      dist = dist * 180/Math.PI;
      dist = dist * 60 * 1.1515;
      var fixed = dist.toFixed(1);
      this.setState({distance: fixed});
    }

  }



  getTimes = () => {
      var hours = new Date().getHours();
      firestoreDB.collection("restaurants").get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        var data = doc.data();
        var t = data.time;
        var rHours= t.substr(0, t.indexOf(':'));
        if(rHours == hours)
        {
          t = 'LIVE';
        }
        console.log(data);
        var found =0;
          for(var i =0; i < this.state.TIMES.length; i++)
          {
            if(t.localeCompare(this.state.TIMES[i].time) ==0)
            {
              this.distance(data.lat, data.lon);
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
              var a10 = data.address;
              var a11 = t;
              var rest = {name: a1, id: a2, description: a3, image: a4, lat: a5, lon:a6, tag0: a7, tag1: a8, watchers: a9, address: a10, time: a11, dist: this.state.distance};
              tempArray[i].restaurants.push(rest);
              this.setState({TIMES: tempArray});

              found = 1;
            }
          }

        });
      });
    }


  getItems(restName) {
      var tempArray = [];
      firestoreDB.collection("restaurants").doc(restName).collection("deals").get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        var data = doc.data();
        var a1 = data.name;
        var a2 = data.id;
        var a3 = data.description;
        var a4 = data.image;
        var a5 = "$"+data.newPrice.toFixed(2);
        var a6 = "$"+data.originalPrice.toFixed(2);
        var item = {name: a1, id: a2, description: a3, image: a4, newPrice: a5, originalPrice: a6};
        tempArray.push(item);
        console.log(item);
        this.setState({ITEMS: tempArray});


        });
      });
    }


    componentDidMount() {
      this.initTimes();
      this.getTimes();
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
        <Modal
          isVisible = {this.state.openModal}
          onSwipeComplete={this.turnModalOff}
          onBackdropPress={this.turnModalOff}
          swipeDirection={['down']}
          backdropColor ={"black"}
          swipeThreshold={50}
          backdropOpacity = {0.5}
          >
            <View style={styles.modalCard}>
              <Image source = {{uri: this.state.modalImage}}
                style = {styles.modalImage}
              />
              <View style = {{flex: 1,flexDirection: 'row'}}>
                <View style = {{flex: 4}}>
                  <Text style={{fontSize: 32, fontWeight: "bold", marginLeft: "4%", marginTop: "3%"}}>{this.state.modalRest}</Text>
                  <Text style={{fontSize: 13, marginLeft: "4%", marginTop: "2%"}}>{this.state.modalAddress}  •  {this.state.modalDist} miles</Text>
                  <View style = {{flexDirection: "row"}}>
                    <Image source = {require('./watchIcon.png')}
                      style = {{marginLeft: "4%", marginTop: "2.5%"}}
                    />
                    <Text style={{fontSize: 13, marginLeft: "1.2%", marginTop: "2%"}}>{this.state.modalWatching}</Text>
                  </View>
                </View>
                <View style = {{flex:1}}>
                  <Text style={{fontSize: 18, fontWeight: "bold", marginLeft: "4%", marginTop: "22%"}}>{this.state.modalTime}</Text>
                </View>
              </View>
              <SafeAreaView style = {{flex: 5.5}}>
                <FlatList style = {{flex: 1}}
                  data={this.state.ITEMS}
                  renderItem={this.renderDeals}
                  keyExtractor={timeSlot => timeSlot.id}
                  showsVerticalScrollIndicator={false}
                />
              </SafeAreaView>

            </View>
        </Modal>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text>{address}</Text>
        </View>
        <SafeAreaView style = {{flex: 20}}>
          <FlatList style = {{flex: 1}}
            data={timeR}
            renderItem={this.renderTimes}
            keyExtractor={timeSlot => timeSlot.id}
            showsVerticalScrollIndicator={false}
          />
        </SafeAreaView>

      </View>
      );
  }

  renderTimes = ({item}) => {
    var hours = new Date().getHours();
    var min = new Date().getMinutes();
    var rHours= item.time.substr(0, item.time.indexOf(':'));
    var int = parseInt(rHours, 10);
    var h =0;
    var m =0;
    if(int > hours)
    {
      if(min ==0)
      {
        h = int - hours;
        m = 0;
      }
      else
      {
        h = int - hours - 1;
        m = 60 - min;
      }
    }
    else
    {
      if(min ==0)
      {
        h = (24 - hours + int);
        m =0;
      }
      else
      {
        h = (24 - hours + int - 1);
        m = 60-min;
      }
    }



    var liveString = "live in " + h + " hr(s), " + m + " min";
    if(item.time == 'LIVE')
    {
      liveString = "";
    }
    return (
      <View>
      <View style={styles.container1}>
      <View style={styles.item5}>
        <Text style={styles.timeHeader}>{item.time}</Text>
        </View>
        <View style={styles.item6}>
        <Text style= {styles.watch}>{liveString}</Text>
        </View>
        </View>
        <SafeAreaView>
          <FlatList style = {{flex: 1}}
            data={item.restaurants}
            renderItem={this.renderRestaurants}
            keyExtractor={timeSlot => timeSlot.id}
            showsVerticalScrollIndicator={false}
          />
        </SafeAreaView>
        <Text>{"\n"}</Text>
      </View>);
  };

  renderRestaurants = ({item}) => {
    var wString = item.watchers + " biters watching";

    return(
      // <View>
      // <TouchableOpacity onPress={() => this.refs.modal1.open()} style = {styles.box}>
      //   <Text style = {styles.restaurantName}>{restaurant}</Text>
      //   <Text>{itemName}</Text>
      // </TouchableOpacity>
      // </View>
      <View>
        <TouchableOpacity style = {styles.box} onPress={() => this.turnModalOn(item.name, item.image, item.address, item.watchers, item.time, item.dist)}>
          <View style={styles.container1}>
            <View style={styles.item1}>
              <Text style = {styles.restaurantName}>{item.name}</Text>
              <View style={styles.tagContainer}>
                  <View style={styles.item2}>
                    <Text style={{color: '#330382'}}>{item.tag0}</Text>
                  </View>
                  <View style={styles.item4}></View>
                  <View style={styles.item2}>
                    <Text style={{color: '#330382'}}>{item.tag1}</Text>
                  </View>
                  <View style={styles.item4}></View>
              </View>
            </View>
            <View style={styles.item3}>
              <Image source = {{uri:item.image}}
                style = {{ width: 117, height: 117, borderRadius: 12 }}
              />
            </View>
          </View>
          <Text style={styles.watch}>{wString}</Text>
        </TouchableOpacity>
      </View>);

  };

  renderDeals = ({item}) => {
    return(
      <View>
        <TouchableOpacity style = {styles.dealBox}>
          <View>
            <View style={{width: '70%'}}>
              <Text style = {styles.restaurantName}>{item.name}</Text>
              <View style={styles.dealDesc}>
                <Text style={{fontSize: 12}}>{item.description}</Text>
              </View>
              <View style={styles.dealPrice}>
                <Text style={{textDecorationLine: "line-through"}}>{item.originalPrice}  > </Text>
                <Text>{item.newPrice}</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  turnModalOn = (name, image, address, watchers, time, dist) =>{
    if (name == "Dulce Cafe")
      name = "Dulce"

    this.getItems(name);

    this.setState({openModal:true, modalRest: name, modalImage: image, modalAddress: address, modalWatching: watchers, modalTime: time, modalDist: dist});
  }

  turnModalOff = () =>{
    this.setState({openModal:false});
  }
}

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
    fontSize: 10,
    fontStyle: 'italic',
  },
  container: {
    flex: 1,
  },
  box: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    width: 0.9 * screenWidth,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#EDE1FF'
  },
  liveBox:{
    backgroundColor: '#E8E8E8',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    width: 0.9 * screenWidth,
    borderRadius: 12,
    borderWidth: 5,
    borderColor: '#8134FF'
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
  tagContainer:{
    flex: 1,
    marginTop: 15,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start'
  },
  item1: {
    width: '62%' // is 50% of container width
  },
  item2: {
    width: '40%',
    backgroundColor: '#F4EDFF',
    borderRadius: 4,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center'
     // is 50% of container width
  },
  item3: {
    width: '32%', // is 50% of container width
  },
  item4: {
    width: '5%' // is 50% of container width
  },
  item5: {
    width: '60%' // is 50% of container width
  },
  item6: {
    width: '35%', // is 50% of container width
    paddingTop: 6,
    justifyContent: 'center'
  },
  modal:{
    flex: 1,
    height: '50%'
  },
  modalCard:{
    marginLeft: -0.05*screenWidth,
    height: '100%',
    width: screenWidth,
    marginTop: 0.2 * screenHeight,
    backgroundColor: '#FFFFFF',

    borderTopLeftRadius: 50,
    borderTopRightRadius: 50
  },
  modalImage:{
    width: screenWidth,
    height: 120,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50
  },
  dealDesc:{
    marginTop: 8,
    fontSize: 2,
    flexWrap: 'wrap',
    alignItems: 'flex-start'
  },
  dealBox:{
    height: 110,
    paddingTop: 8,
    paddingLeft: 10,
    backgroundColor: '#E8E8E8',
    marginVertical: 8,
    marginHorizontal: 16,
    width: 0.9 * screenWidth,
  },
  dealPrice:{
    marginTop: 14,
    flexDirection: "row",
  }

});
