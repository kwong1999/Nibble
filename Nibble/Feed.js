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
      rewardPoints: 10,
      STATS: [
        {number: 225, description: 'orders placed by friends'},
        {number: 25, description: 'students were craving boba'},
        {number: '18%', description: 'of students ate chinese food'}
      ],
      FEED: [
        {name: 'Katie Wong', description: 'felt like enjoying thai today at', restaurant: 'Trio', image: require('./katie.png'), time: '5m'},
        {name: 'Eric Zhan', description: 'loved some chicken at', restaurant: 'Chik-fil-a', image: require('./eric.png'), time: '12m'},
        {name: 'Chan Lee', description: 'was thirsty for some', restaurant: 'Pot of Cha', image: require('./chan.png'), time: '15m'},
        {name: 'Zade Kaylani', description: 'enjoyed a chai at', restaurant: 'Cafe Dulce', image: require('./zade.png'), time: '28m'}
      ]
      };
      //this.getInfo = this.getInfo.bind(this);

  }

  // getRewards = async () => {
  //   console.log("hello im in the feed");
  //   try {
  //     var currRewards = await AsyncStorage.getItem('rewards');
  //     currRewards = parseInt(currRewards);
  //     this.setState({rewardPoints: currRewards});
  //   } catch (error) {
  //     // Error saving data
  //   }
  // };

  render(){
    return(
        <View style = {{flex: 1, alignItems:'center'}}>
        <TouchableOpacity onPress = {() => this.props.navigation.navigate('Home')} style={{zIndex: 999, backgroundColor:'#8134FF', borderRadius: 1000, width: 60, height: 60, alignItems: 'center', justifyContent: 'center', position: 'absolute', top: '87%', left: '78%'}}>
                <Image source={require('./house.png')}/>
        </TouchableOpacity>
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
          <View style = {{marginTop: 50}}>
            <Text style = {{color: '#160039', fontSize: 14, opacity: 0.7, fontStyle: 'italic'}}>$5 off at 500 points</Text>
          </View>
          <ScrollView style = {{left: 10, marginTop: 20}}>
            <FlatList
              data={this.state.STATS}
              renderItem={this.renderStats}
              keyExtractor={(item, index) => index.toString()}
              horizontal = {true}
              showsHorizontalScrollIndicator={false}
            />
          </ScrollView>
            <FlatList
              data={this.state.FEED}
              renderItem={this.renderFeed}
              keyExtractor={(item, index) => index.toString()}
              showsVerticalScrollIndicator={false}
            />
        </View>
      );
  }

  renderStats = ({item}) => {
    return(
      <View style = {styles.statsBox}>
        <Image source={require('./statsIcon.png')}/>
        <Text style = {{fontSize: 36, fontWeight: 'bold', color: '#8336FF'}}>{item.number}</Text>
        <Text style = {{textAlign: 'center', fontSize: 14, color: '#9462E8'}}>{item.description}</Text>
      </View>
    );
  }
  renderFeed = ({item}) => {
    var imageString = item.image;
    return(
      <View style = {{width: 0.8*screenWidth}}>
        <View style={{backgroundColor: '#EDE1FF', alignSelf: 'center', height: 1.5, width: 310, marginTop: 5, marginBottom: 10}}></View>
        <View style = {{flexDirection:'row', alignItems: 'center'}}>
          <Image resizeMode = "contain" style = {{height:30, width: 30}} source ={item.image}/>
          <View style = {{marginLeft: 10, flexDirection:"row", flexWrap:"wrap",width:200,padding:10}}>
            <Text style = {{fontWeight: 'bold'}}>{item.name}
            <Text style = {{fontWeight:'normal'}}> {item.description} </Text>
            <Text style = {{fontWeight: 'bold'}}>{item.restaurant}</Text></Text>
          </View>
        </View>
        <View style = {{marginLeft: '90%'}}><Text style = {{fontSize: 12, fontStyle: 'italic', fontWeight: '200'}}>{item.time}</Text></View>
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
  },
  statsBox:{
    height: 0.2*screenHeight,
    width: 0.4*screenWidth,
    backgroundColor: '#FAF8FF',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    marginLeft: 20,
  }
});
