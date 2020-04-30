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

export default class Profile extends React.Component{
  constructor(props)
  {
    super(props);
    const { navigation, route } = props;

    this.state = {
      name: 'Name',
      phoneNumber: 'Phone Number',
      month: 'January',
      year: 2020,
      email: '@empty',
      address: '',
      lat: 0,
      lon: 0,
      location: null,
      paymentMethod: null,
      paymentString: 'Add Payment Method',
      paymentButtonText: '+',
      addPaymentVisible: false,
      cardName: 'Name',
      cardNumber: 'Card Number',
      cardSec: 'CVV',
      image: null,
      permission: false,
      cardHeight: 0,
      cardWidth: 0,
      month: 1,
      year: 1,
      };
      //this.getInfo = this.getInfo.bind(this);
      this._getLocationAsync();
      console.disableYellowBox = true;

      this.clearCardSec = this.clearCardSec.bind(this);
      this.clearCardName = this.clearCardName.bind(this);
      this.clearCardNumber = this.clearCardNumber.bind(this);


      this.resetCardSec = this.resetCardSec.bind(this);
      this.resetCardName = this.resetCardName.bind(this);
      this.resetCardNumber = this.resetCardNumber.bind(this);

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
            temp = doc.data().paymentMethod;
            currentComponent.setState({paymentMethod: temp});

            if(temp != null && temp != 'null')
            {
            	console.log('card' + temp);
               	var tempCard = '';
	            for(var i =0; i < temp.length-4; i++)
				  {
				  	if(temp[i] != ' ')
				  	{
				  		tempCard = tempCard + '*';
				  	}
				  	else
				  	{
				  		tempCard = tempCard + temp[i];
				  	}
				  }
				  for(var i =temp.length-4; i < temp.length; i++)
				  {
				  		tempCard = tempCard + temp[i];
				  }
				  currentComponent.setState({paymentString: tempCard});
              currentComponent.setState({paymentButtonText: 'x', cardWidth: 15, cardHeight: 12});

            }
            else
            {
              currentComponent.setState({paymentString: 'Add Payment Method'});
            }


        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });

  }
  componentDidMount() {
      this.getEmail();
      this.getPermissionAsync();
    }

    getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        this.setState({permission: false});
      }
      else
      {
      	this.setState({permission: true});
      }

    }
  };

  _pickImage = async () => {
  	if(this.state.permission == false)
  	{
  		return;
  	}
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.cancelled) {
        this.setState({ image: result.uri });
        this.storeImage(result.uri);
      }

    } catch (E) {
      console.log(E);
    }
  };
  storeImage = async (image) => {

      try {
        AsyncStorage.setItem('profileImage', image);

      } catch (error) {
        // Error saving data
      }
    };

  getEmail = async () => {
    try {
      const storageEmail = await AsyncStorage.getItem('email');
      if (storageEmail != null || storageEmail !='null') {
        // We have data!!
        this.setState({email: storageEmail});
        this.getInfo();
      }
      const profileImage = await AsyncStorage.getItem('profileImage');
      this.setState({image: profileImage});
    } catch (error) {

    }
  };

  render(){
  	let {image} = this.state;
    return(
      <View style = {{flex:1}}>
      <KeyboardAvoidingView keyboardVerticalOffset = {80} behavior={Platform.OS == "ios" ? "padding" : "height"} style = {{flex: 1, height: 5000}}>
      <TouchableOpacity onPress = {() => this.props.navigation.navigate('Home')} style={{zIndex: 999, backgroundColor:'#8134FF', borderRadius: 1000, width: 60, height: 60, alignItems: 'center', justifyContent: 'center', position: 'absolute', top: '87%', left: '78%'}}>
              <Image source={require('./Vector.png')}/>
      </TouchableOpacity>
      <ScrollView overScrollMode = 'always' contentContainerStyle = {{backgroundColor: '#FFFFFF', alignItems:'center'}}>
      <View style={styles.viewContainer}>
      <Text>{'\n'}</Text>

              <View style={[styles.container1, {height: 200}]}>
                <View style={{width: '10%'}}>
                </View>
                <View style={{width: '30%'}}>
                <TouchableOpacity onPress ={this._pickImage}>
                  {(!image || image =='null') && <Image source={require('./nibble.png')} style = {{ width: 117, height: 117, borderRadius: 100 }}/>}
                	{image && (image!='null') && <Image source={{ uri: image }} style={{ width: 117, height: 117, borderRadius: 100 }} />}
                </TouchableOpacity>
                </View>
                <View style={{width: '10%'}}>
                </View>
                <View style={{width: '50%'}}>
                  <Text style={{marginTop: 30, marginRight: 20, fontWeight: 'bold', fontSize: 25}}>{this.state.name}</Text>
                  <Text style={{fontStyle: 'italic', fontSize: 12, marginTop: 5,}}> joined {this.state.month}, {this.state.year} </Text>
                  </View>
              </View>
              <View style={{flex: 1, width: 310, alignSelf: 'center', marginTop: -40}}>
                 <View style={{backgroundColor: '#EDE1FF', alignSelf: 'center', height: 1.5, width: 310,marginBottom: 20}}></View>
                 <View style = {{flexDirection: 'row', justifyContent:'space-between'}}>
                   <Text style={{fontSize: 12,}}>Email </Text>
                   <Text style={{fontWeight: 'bold', fontSize: 14, textAlign: 'right',}}>{this.state.email}</Text>
                 </View>
                 <View style={{backgroundColor: '#EDE1FF', alignSelf: 'center', height: 1.5, width: 310, marginTop: 20, marginBottom: 20}}></View>
                 <View style = {{flexDirection: 'row', justifyContent:'space-between'}}>
                   <Text style={{fontSize: 12,}}>Phone Number </Text>
                   <Text style={{fontWeight: 'bold', fontSize: 14, textAlign: 'right',}}>{this.state.phoneNumber}</Text>
                 </View>
                 <View style={{backgroundColor: '#EDE1FF', alignSelf: 'center', height: 1.5, width: 310, marginTop: 20, marginBottom: 20}}></View>
                 <View style = {{flexDirection: 'row', justifyContent:'space-between'}}>
                   <Text style={{fontSize: 12,}}>Current Location </Text>
                   <Text style={{fontWeight: 'bold', fontSize: 12, textAlign: 'right',}}>{this.state.address}</Text>
                 </View>
                 <View style={{backgroundColor: '#EDE1FF', alignSelf: 'center', height: 1.5, width: 310, marginTop: 20, marginBottom: 18}}></View>
                 <View style = {{flexDirection: 'row', justifyContent:'space-between'}}>
                   <Text style={{fontSize: 12,}}>View Order history</Text>
                   <TouchableOpacity onPress={() => this.props.navigation.navigate('OrderHistory')}>
                     <Text style = {{fontSize: 16}}>></Text>
                   </TouchableOpacity>
                 </View>
                 <View style={{backgroundColor: '#EDE1FF', alignSelf: 'center', height: 1.5, width: 310, marginTop: 18, marginBottom: 18}}></View>
                 <View style = {{flexDirection: 'row'}}>
                 <View style={{width: '95%', flexDirection: 'row'}}>
                 <Image source={require('./Union.png')} style={{height: this.state.cardHeight, width: this.state.cardWidth}}/>
                   <Text style={{fontSize: 12,}}>{this.state.paymentString}</Text>
                   </View>
                   <View style={{width: '5%'}}>
                   <TouchableOpacity onPress={this.paymentPress}>
                     <Text style= {{fontSize: 16}}> {this.state.paymentButtonText}</Text>
                   </TouchableOpacity>
                   </View>
                 </View>
                 <View style={{backgroundColor: '#EDE1FF', alignSelf: 'center', height: 1.5, width: 310, marginTop: 17}}></View>

          </View>
          {this.renderAdd()}
            <Text> </Text>
        <Text> </Text>
        <Text> </Text>
        <Text> </Text>
        </View>
      </ScrollView>

      </KeyboardAvoidingView>
      </View>


      );
  }

  renderAdd() {
        if (this.state.addPaymentVisible) {
            return (
            <View style = {{flex: 1, alignSelf: 'center', alignItems: 'center', width: '80%', top: 20}}>
              <TextInput clearButtonMode="while-editing" style = {[styles.textInput, {marginTop: 0}]} onChangeText={text => this.cardName(text)} value = {this.state.cardName} onFocus = {this.clearCardName} onBlur={this.resetCardName}></TextInput>
              <TextInput clearButtonMode="while-editing" keyboardType = {'numeric'} style = {[styles.textInput, {marginTop: 25}]} onChangeText={text => this.cardNumber(text)}  value = {this.state.cardNumber} onFocus={this.clearCardNumber} onBlur={this.resetCardNumber}></TextInput>
              <View style = {{flex: 2.8, flexDirection: 'row'}}>
              <Picker
              style={[styles.onePicker, {left: 5, width: 25}]} itemStyle={styles.onePickerItem}
		          selectedValue={this.state.month}
		          onValueChange={(itemValue) => this.setState({month: itemValue})}
		        >
		          <Picker.Item label="Jan" value="1" />
		          <Picker.Item label="Feb" value="2" />
		          <Picker.Item label="Mar" value="3" />
		          <Picker.Item label="Apr" value="4" />
		          <Picker.Item label="May" value="5" />
		          <Picker.Item label="June" value="6" />
		          <Picker.Item label="July" value="7" />
		          <Picker.Item label="Aug" value="8" />
		          <Picker.Item label="Sept" value="9" />
		          <Picker.Item label="Oct" value="10" />
		          <Picker.Item label="Nov" value="11" />
		          <Picker.Item label="Dec" value="12" />
		        </Picker>
		        <Text style={{color: '#8235ff', top: 25, fontSize: 32, left: 10}}>/</Text>
		        <Picker
              style={[styles.onePicker, {left: 15, width: 40}]} itemStyle={styles.onePickerItem}
		          selectedValue={this.state.month}
		          onValueChange={(itemValue) => this.setState({month: itemValue})}
		        >
		          <Picker.Item label="2020" value="2020" />
		          <Picker.Item label="2021" value="2021" />
		          <Picker.Item label="2022" value="2022" />
		          <Picker.Item label="2023" value="2023" />
		          <Picker.Item label="2024" value="2024" />
		          <Picker.Item label="2025" value="2025" />
		          <Picker.Item label="2026" value="2026" />
		          <Picker.Item label="2027" value="2027" />
		          <Picker.Item label="2028" value="2028" />
		          <Picker.Item label="2029" value="2029" />
		          <Picker.Item label="2030" value="2030" />
		        </Picker>
                <View style = {{flex: 0.8}}></View>
                <TextInput clearButtonMode="while-editing" style = {[styles.textInput, {flex: 1, width: '36%', marginTop: 25,}]} keyboardType = {'numeric'} onChangeText={text => this.cardSec(text)} value = {this.state.cardSec} onFocus = {this.clearCardSec} onBlur={this.resetCardSec}></TextInput>
                </View>
              <Text> </Text>
              <TouchableOpacity onPress = {this.addPay} style={{backgroundColor:'#8134FF', borderRadius: 12, width: 100, height:35, flexDirection:'row', marginBottom: 0, alignItems: 'center', justifyContent: 'center'}}>
                      <Text style={{ fontSize: 12, fontWeight: 'bold', color:'#FFFFFF'}}>ADD</Text>
                </TouchableOpacity>
              <Text> </Text>
        <Text> </Text>
        <Text> </Text>
        <Text> </Text>
            </View>
            );
        } else {
            return null;
        }
    }


  clearCardName(){
    this.setState({cardName: ""});
  }
  clearCardNumber(){
    this.setState({cardNumber: ""});
  }
  clearCardSec(){
    this.setState({cardSec: ""});
  }

  resetCardName(){
    if(this.state.cardName == "")
      this.setState({cardName: "Name"});
  }
  resetCardNumber(){
    if(this.state.cardNumber == "")
      this.setState({cardNumber: "Card Number"});
  }
  resetCardSec(){
    if(this.state.cardSec == "")
      this.setState({cardSec: "CVV"});
  }

  cardName(text){
    this.setState({cardName: text});
  }
  cardNumber(text){
    this.setState({cardNumber: text.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim()});
  }
  cardSec(text){
    this.setState({cardSec: text});
  }
  orderHistory()
  {
    this.props.navigation.navigate('OrderHistory');
  }

addPay = () => {
  this.setState({addPaymentVisible: false, paymentButtonText: 'x', paymentString: this.state.cardNumber, cardHeight: 12, cardWidth: 15});
  var tempCard = '';
            for(var i =0; i < this.state.cardNumber.length-4; i++)
			  {
			  	if(this.state.cardNumber[i] != ' ')
			  	{
			  		tempCard = tempCard + '*';
			  	}
			  	else
			  	{
			  		tempCard = tempCard + this.state.cardNumber[i];
			  	}
			  }
			  for(var i =this.state.cardNumber.length-4; i < this.state.cardNumber.length; i++)
			  {
			  		tempCard = tempCard + this.state.cardNumber[i];
			  }
			  this.setState({paymentString: "  " + tempCard});


  var pRef = firestoreDB.collection("users").doc(this.state.email);

        return pRef.update({
            paymentMethod: this.state.cardNumber

        })
        .then(function() {
            console.log("Document successfully updated!");

        })
        .catch(function(error) {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
        });

}


  paymentPress = () => {
    if(this.state.paymentButtonText == 'x')
    {
        this.setState({paymentString: 'Add Payment Method', paymentButtonText: '+', cardName: 'Name',cardNumber: 'Card Number', cardSec: 'Security', cardWidth: 0, cardHeight: 0});
        var pRef = firestoreDB.collection("users").doc(this.state.email);

        // Set the "capital" field of the city 'DC'
        return pRef.update({
            paymentMethod: 'null'
        })
        .then(function() {
            console.log("Document successfully updated!");

        })
        .catch(function(error) {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
        });


    }
    else if(this.state.paymentButtonText == '+')
    {
      this.setState({addPaymentVisible: true, paymentButtonText: '-'});

    }
    else if(this.state.paymentButtonText == '-')
    {
      this.setState({addPaymentVisible: false, paymentButtonText: '+'});

    }
  }



}

const styles = StyleSheet.create({
  textInput: {
    fontSize: 13,
    height: 40,
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
  viewContainer:{
        flexDirection:'column',
        flexWrap: 'wrap',
        flex: 1
    },
   onePicker: {
    height: 44,
    borderColor: 'white',
    borderWidth: 0,
    top: 25,
  },
  onePickerItem: {
    height: 40,
    color: 'black',
    fontSize: 15,
  },
});
