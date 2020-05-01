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
       console.disableYellowBox = true;



  }

  getInfo = () => {

    firestoreDB.collection("users").doc(this.state.email).collection("orders").get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {

        var data = doc.data();
        var restName = data.restaurant;
        var itemName1 = data.itemName;
        var p = data.price;
        var oldP = data.oldPrice;
        var quant = data.quantity;
        var tempArray = this.state.orders;
        var inOrder = false;
        for(var i =0; i < tempArray.length; i++)
        {
          if(tempArray[i].rest == restName)
          {
            var itemOrdered = false;
            for(var j =0; j < tempArray[i].items.length; j++)
            {
              if(tempArray[i].items[j].itemName == itemName1)
              {
                tempArray[i].items[j].quantity = tempArray[i].items[j].quantity + quant;
                itemOrdered = true;
                break;
              }
            }
            if(!itemOrdered)
            {
              var itemObj = {itemName: itemName1, quantity: quant, id: tempArray[i].items.length};
              tempArray[i].items.push(itemObj);
            }
            tempArray[i].price = (tempArray[i].price + (p*quant));
            tempArray[i].oldPrice = (tempArray[i].oldPrice + (oldP*quant));
            inOrder = true;
            //console.log(orderObj);
            this.setState({orders: tempArray});
            break;
          }
        }
        if(!inOrder)
        {
          var itemObj = {itemName: itemName1, quantity: quant, id: 0};
          var orderObj = {rest: restName, items: [], price: (p*quant), oldPrice: (oldP*quant), id: tempArray.length};
          orderObj.items.push(itemObj);
          tempArray.push(orderObj);
          this.setState({orders: tempArray});

        }

        });
      });

  }
  componentDidMount() {
      this.getEmail();
    }

  getEmail = async () => {
    try {
      const storageEmail = await AsyncStorage.getItem('email');
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
        <TouchableOpacity onPress = {() => this.props.navigation.navigate('Home')} style={{zIndex: 999, backgroundColor:'#8134FF', borderRadius: 1000, width: 60, height: 60, alignItems: 'center', justifyContent: 'center', position: 'absolute', top: '87%', left: '78%'}}>
              <Image style = {{height: 20, width: 20, resizeMode: 'contain'}} source={require('./house.png')}/>
        </TouchableOpacity>
        <ScrollView overScrollMode = 'always' contentContainerStyle = {{backgroundColor: '#FFFFFF', alignItems:'center'}}>
          <Text style={{borderColor: '#FFFFFF', marginTop: 20}}>@{this.state.email}</Text>
          <View style={{backgroundColor: '#EDE1FF',  height: 1.5, width: 300, marginTop: 20}}></View>
            <SafeAreaView>
              <FlatList
                data={this.state.orders}
                renderItem={this.renderOrders}
                keyExtractor={item => item.id}
                showsVerticalScrollIndicator={false}
              />
            </SafeAreaView>
        </ScrollView>
      </View>


      );
  }

  renderOrders = ({item}) => {

    return(
    <View style={[styles.container1, {width: 300, marginTop: 20}]}>
      <View style={{width: '60%'}}>
        <Text style={{fontWeight:'bold', fontSize: 18}}>{item.rest}</Text>
        <Text> </Text>
        <FlatList
                  data={item.items}
                  renderItem={this.renderItem}
                  keyExtractor={item => item.id}
                  showsVerticalScrollIndicator={false}
                />
      </View>
      <View style = {{flexDirection: 'row', width: '40%', justifyContent: 'flex-end'}}>
        <Image style = {{}} source={require('./info.png')}/>
      </View>
      <View style = {{justifyContent: 'flex-end', alignItems: 'right', width: '100%', flexDirection: 'row'}}>
        <Text style={{textDecorationLine: "line-through", color: '#A8A1B3', fontSize: 12}}>{ "$" + (item.oldPrice).toFixed(2)}  ></Text>
        <Text style = {{fontSize: 12}}>{"$"+(item.price).toFixed(2)}</Text>
      </View>
      <View style={{backgroundColor: '#EDE1FF',  height: 1.5, width: 300, marginTop: 20}}></View>

    </View>
    );
  };

renderItem = ({item}) => {
  return(
  <View style ={{height: 18}}>
    <Text style={{fontSize: 12}}>{item.itemName}    x{item.quantity}</Text>
  </View>
  );
}





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
    alignItems: 'flex-start', // if you want to fill rows left to right\
  },
});
