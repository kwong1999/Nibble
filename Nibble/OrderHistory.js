import * as React from 'react';
import * as firebase from 'firebase';
import '@firebase/firestore';
import Modal from 'react-native-modal';
import { View, Text, Button, SafeAreaView, ScrollView, FlatList, StyleSheet, Dimensions, Image, TouchableOpacity, TextInput, KeyboardAvoidingView, AsyncStorage} from 'react-native';
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

export default class OrderHistory extends React.Component{
  constructor(props)
  {
    super(props);
    const { navigation, route } = props;

    this.state = {
      email: '@empty',
      orders: [],
      };
      

  }
 
  getInfo = () => {

    firestoreDB.collection("users").doc(this.state.email).collection("orders").get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        var data = doc.data();
        var restName = data.restaurant;
        var itemName = data.itemName;
        var p = data.price;
        var oldP = data.oldPrice;
        var quant = data.quantity;
        var id = data.id;
        var orderObj = {rest: restName, item: itemName, price: p, oldPrice: oldP, quantity: quant};
        var tempArray = this.state.orders;
        tempArray.push(orderObj);
        this.setState({orders: tempArray});

        });
      });

  }
  componentDidMount() {
      this.getEmail();
    }

  getEmail = async () => {
    try {
      const storageEmail = await AsyncStorage.getItem('email');
      console.log("email:" + storageEmail);
      if (storageEmail != null || storageEmail !='null') {
        // We have data!!
        this.setState({email: storageEmail});
        this.getInfo();
      }
      else
      {
      }
    } catch (error) {
      
    }
  };

  render(){
    return(
      <View style = {{flex:1}}>
      <ScrollView overScrollMode = 'always' contentContainerStyle = {{backgroundColor: '#FFFFFF', alignItems:'center'}}>
        <TouchableOpacity onPress = {() => this.props.navigation.navigate('Home')} style={{backgroundColor:'#8134FF', borderRadius: 1000, width: 60, height: 60, alignItems: 'center', justifyContent: 'center', position: 'absolute', top: 600, left: 270}}>
                <Image source={require('./Vector.png')}/>
              </TouchableOpacity>
        <Text style={{borderWidth: 10, borderColor: '#FFFFFF'}}>@{this.state.email}</Text>
        <View style={{backgroundColor: '#EDE1FF',  height: 1.5, width: 300}}>
          </View>
          <SafeAreaView style = {{marginLeft: '6%', minHeight: '14%', maxHeight: '100%', marginTop:'12%'}}>
            <FlatList
              data={this.state.orders}
              renderItem={this.renderOrders}
              keyExtractor={item => item.id}
              showsVerticalScrollIndicator={false}
            />
          </SafeAreaView>
        <Text> </Text>
        <Text> </Text>
        <Text> </Text>
      </ScrollView>
      </View>


      );
  }

  renderOrders = ({item}) => {
    
    return(
    <View>
    <Text> </Text>
    <View style={styles.container1}>
    <View style={{width: '60%'}}>
     <Text style={{fontWeight:'bold', fontSize: 18}}>{item.rest}</Text>
     <Text> </Text>
        <Text style={{ fontSize: 14}}>{item.item}    x{item.quantity}</Text>
    </View>
    <View style={{width: '20%'}}>
    <Text style={{textDecorationLine: "line-through", color: '#A8A1B3', top: 40}}>{ "$" + item.oldPrice.toFixed(2)}  ></Text>
      </View>
      <View style={{width: '20%'}}>
      <Text style = {{fontSize:13, top: 40}}>{"$"+(item.price*item.quantity).toFixed(2)}</Text>
      </View>
    </View>
    <Text> </Text>
    <View style={{backgroundColor: '#EDE1FF',  height: 1.5, width: 300}}>
      </View>
    </View>);
  };

  



}

const styles = StyleSheet.create({
  textInput: {
    fontSize: 10,
    height: 40, 
    left: 30,
    width: '80%',
    borderBottomWidth: 2,
    borderBottomColor: '#8235ff',
    width: .8*screenWidth,
  },
  container1: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start', // if you want to fill rows left to right
  
  },
});
