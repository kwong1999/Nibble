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
import * as Font from 'expo-font';
import { AppLoading } from 'expo';

const fetchFonts = () => {
return Font.loadAsync({
      'Inter-Regular': require('./assets/Inter-Regular.otf'),
      'Inter-Bold': require('./assets/Inter-Bold.otf'),
      'Inter-Italic': require('./assets/Inter-Italic.otf'),


      });
};
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
  static navigationOptions = {
    title:'nibble',
    gesturesEnabled: false,
    drawerLockMode: 'locked-open',
  };
  constructor(props) {
      super(props);
      const { navigation, route } = props;
      const email = route.params.email;
      this.state = {
        location: null,
        address: '',
        lat: 0,
        lon: 0,
        itemPressed: '',
        openModal: false,
        distance: '',
        places: [],
        modalRest: "",
        modalImage: null,
        modalAddress: "",
        modalWatching: "",
        modalTime: "",
        modalDeals: null,
        ITEMS: [],
        TIMES: [],
        order: [],
        currentOrderQuantity: 1,
        username: email,
        checkoutButtonOpacity: 0,
        openCheckout: false,
        orderTotal: 0,
        totalSavings: 0,
        placeOrderText: '',
        placeOrderColor: '#8134FF',
        liveBarLength: 0.0,
        openOrder: false,
        orderNumb: 0,
        params: '',
        refresh: false,
        checkoutOpacity: 1,
        openNotLive: false,
        paymentOpacity: 1,
        openPayment: false,
        cardName: 'Name',
        cardNumber: 'Card Number',
        cardExp: 'Expiration',
        cardSec: 'CVV',
        lastFour: '',
        month: '',
        year: '',
        dataloaded: false,
      };

      this._getLocationAsync();
      this.updatePayment();

      this.renderDeals = this.renderDeals.bind(this);
      this.initTimes = this.initTimes.bind(this);
      this.distance = this.distance.bind(this);
      this.getTimes = this.getTimes.bind(this);

      this.getItems = this.getItems.bind(this);
      this.renderTimes = this.renderTimes.bind(this);
      this._getLocationAsync = this._getLocationAsync.bind(this);
      this.renderRestaurants = this.renderRestaurants.bind(this);
      this.addItem = this.addItem.bind(this);
      this.renderOrder = this.renderOrder.bind(this);
      this.renderQuantity = this.renderQuantity.bind(this);

      this.clearCardSec = this.clearCardSec.bind(this);
      this.clearCardName = this.clearCardName.bind(this);
      this.clearCardNumber = this.clearCardNumber.bind(this);

      this.resetCardSec = this.resetCardSec.bind(this);
      this.resetCardName = this.resetCardName.bind(this);
      this.resetCardNumber = this.resetCardNumber.bind(this);

      this.addItem = this.addItem.bind(this);
      console.disableYellowBox = true;

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
        var found =0;
          for(var i =0; i < this.state.TIMES.length; i++)
          {
            if(t.localeCompare(this.state.TIMES[i].time) ==0)
            {
              this.distance(data.lat, data.lon);
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
      if(restName == "CAVA")
        restName = "Cava"
      firestoreDB.collection("restaurants").doc(restName).collection("deals").get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        var data = doc.data();
        var a1 = data.name;
        var a2 = data.id;
        var a3 = data.description;
        var a5 = "$"+data.newPrice.toFixed(2);
        var a6 = "$"+data.originalPrice.toFixed(2);
        var item = {name: a1, id: a2, description: a3, newPrice: a5, originalPrice: a6};
        tempArray.push(item);
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
    const { status, permissions } = await Permissions.askAsync(Permissions.LOCATION);
    if (status != 'granted') {
      return;
    }
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
  	const {dataloaded} = this.state;
    if(!dataloaded)
    {
      console.log("data wasnt loaded for home");

      return (
        <AppLoading
        startAsync={fetchFonts}
        onFinish={() => this.setState({dataloaded: true})} />
        );
    }
    //Getting the location
     let text = 'Waiting..';
     if (this.state.location) {
        text = JSON.stringify(this.state.location);
      }
      const {address} = this.state;
      let timeR = this.state.TIMES.filter(item => item.restaurants.length > 0);
      var modalTimeStyle = styles.modalTime;
      var convertedTime ='';
      if(this.state.modalTime.localeCompare('LIVE') ==0)
      {
        modalTimeStyle = styles.modalTimeLive;
      }
    else
    {
    	var rHours= this.state.modalTime.substr(0, this.state.modalTime.indexOf(':'));
    	var int = parseInt(rHours, 10);
		    if(int == 12)
		    {
		    	convertedTime = '12:00 PM';
		    }
		    else if(int > 12)
		    {
		    	convertedTime = (int-12).toString() + ':00 PM';
		    }
		    else if(int == 0)
		    {
		    	convertedTime = '12:00 AM';
		    }
		    else
		    {
		    	convertedTime = int.toString() + ':00 AM';
		    }

      }
      var hours = new Date().getHours();
      var min = new Date().getMinutes();
      hours = hours + 1;
      var convertedHours = '';
      if(hours == 12)
	    {
	    	convertedHours = '12:00 PM';
	    }
	    else if(hours > 12)
	    {
	    	convertedHours = (hours-12).toString() + ':00 PM';
	    }
	    else if(hours == 0)
	    {
	    	convertedHours = '12:00 AM';
	    }
	    else
	    {
	    	convertedHours = hours.toString() + ':00 AM';
	    }



    return(
      <View style = {{flex:1}}>
      <Modal
        isVisible = {this.state.openNotLive}
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
          <View style = {{flex: 1, flexDirection: 'row'}}>
            <View style = {{width: '75%'}}>
              <Text style={{fontSize: 32, fontWeight: "bold", marginLeft: "5%", marginTop: "3%", fontFamily: 'Inter-Bold'}}>{this.state.modalRest}</Text>
              <Text style={{fontSize: 13, marginLeft: "6%", marginTop: "2%", fontFamily: 'Inter-Regular'}}>{this.state.modalAddress}  •  {this.state.modalDist} miles</Text>
              <View style = {{flexDirection: "row"}}>
                <Image source = {require('./watchIcon.png')}
                  style = {{marginLeft: "5.5%", marginTop: "2.5%"}}
                />
                <Text style={{fontSize: 13, marginLeft: "1.2%", marginTop: "2%", fontFamily: 'Inter-Regular'}}>{this.state.modalWatching}</Text>
              </View>
            </View>
            <View style = {{flex: 1, flexDirection: 'row', marginTop: '5%', flexWrap: 'wrap',}}>
              <View><Text style = {{color:'#FF3434', fontSize: 18, fontWeight: 'bold', fontFamily: 'Inter-Bold'}}>NOT LIVE</Text></View>
              <View><Text style = {{fontStyle: 'italic', fontSize: 11, fontFamily: 'Inter-Italic'}}>    live at {convertedTime}</Text></View>
            </View>
          </View>
          <View style = {{flex: 0.5, height: 25, flexDirection: 'row', top: '14%', flexWrap: 'wrap', marginLeft: "5%"}}>
            <View><Text style = {{fontSize: 13, fontFamily: 'Inter-Regular'}}>what to expect!</Text></View>
          </View>
          <SafeAreaView style = {{flex:6.5, top: 40}}>
            <FlatList contentContainerStyle = {{flex: 1, flexDirection: 'row', flexWrap:'wrap', marginLeft: '5%'}}
              data={this.state.ITEMS}
              renderItem={this.renderNotLiveDeals}
              keyExtractor={(item, index) => index.toString()}
              showsVerticalScrollIndicator={false}
            />
          </SafeAreaView>
          <View style = {{flex: 2.5, alignItems:'center'}}><Text>come back at {convertedTime} for tonight’s nibbles </Text>
          <Image source = {require('./happyface.png')}
            style = {{marginTop: "2.5%"}}
          />
          </View>
        </View>
      </Modal>
        <Modal
          isVisible = {this.state.openModal}
          onSwipeComplete={this.turnModalOff}
          onBackdropPress={this.turnModalOff}
          swipeDirection={['down']}
          backdropColor ={"black"}
          swipeThreshold={50}
          backdropOpacity = {0.5}
          propagateSwipe = {true}
          useNativeDriver={false}
          >
            <View style={styles.modalCard}>
              <Image source = {{uri: this.state.modalImage}}
                style = {styles.modalImage}
              />
              <View style = {{flexDirection: 'row'}}>
                <View style = {{flex: 4}}>
                  <Text style={{fontSize: 32, fontWeight: "bold", marginLeft: "5%", marginTop: "3%", fontFamily: 'Inter-Bold'}}>{this.state.modalRest}</Text>
                  <Text style={{fontSize: 13, marginLeft: "5%", marginTop: "2%", fontFamily: 'Inter-Regular'}}>{this.state.modalAddress}  •  {this.state.modalDist} miles</Text>
                  <View style = {{flexDirection: "row"}}>
                    <Image source = {require('./watchIcon.png')}
                      style = {{marginLeft: "5%", marginTop: "2.5%"}}
                    />
                    <Text style={{fontSize: 13, marginLeft: "1.2%", marginTop: "2%", fontFamily: 'Inter-Regular'}}>{this.state.modalWatching}</Text>
                  </View>
                </View>
                <View style = {{flex:1}}>
                  <Text style={modalTimeStyle}>{this.state.modalTime}</Text>
                </View>
              </View>
              <ScrollView style = {{top: 10}}>
                  <SafeAreaView>
                      <FlatList style = {{flex: 1}}
                        data={this.state.ITEMS}
                        renderItem={this.renderDeals}
                        keyExtractor={(item, index) => index.toString()}
                        showsVerticalScrollIndicator={false}
                      />
                  </SafeAreaView>
                  <Text style ={{fontSize:24}}>{'\n'}</Text>
              </ScrollView>
              <Modal
                isVisible = {this.state.openCheckout}
                onBackdropPress={this.turnModalOff}
                backdropColor ={"black"}
                backdropOpacity = {0.5}
              >
                <View style = {[styles.checkoutModal, {opacity: this.state.checkoutOpacity}]}>
                  <Text style = {{color: '#8134FF', marginTop: '6%', fontWeight:'bold', fontSize: 16}}>{this.state.modalRest}</Text>
                  <View style = {{backgroundColor: '#EDE1FF', height: 26, width: '100%', alignItems: 'center', justifyContent:'center', marginTop: 10, flexDirection: 'row'}}>
                    <Text style = {{color: '#330382', fontSize: 12, fontFamily: 'Inter-Regular'}}>Savings</Text>
                    <Text style = {{color: '#330382', fontSize: 12, fontWeight: 'bold', fontFamily: 'Inter-Bold'}}>       {"$" + this.state.totalSavings.toFixed(2)}</Text>
                  </View>
                  <SafeAreaView style = {{marginLeft: '6%', minHeight: '12%', maxHeight: '20%', marginTop:'12%'}}>
                    <FlatList
                      data={this.state.order}
                      renderItem={this.renderOrder}
                      keyExtractor={(item, index) => index.toString()}
                      showsVerticalScrollIndicator={false}
                    />
                  </SafeAreaView>
                  <View style = {{backgroundColor: '#EDE1FF', height: 2, width: '80%'}}></View>
                  <View style = {styles.tax}>
                    <Text style = {{width: '55%', fontSize: 12, fontFamily: 'Inter-Regular'}}>Tax</Text>
                    <Text style = {{fontSize: 12, fontFamily: 'Inter-Regular'}}>{"$" + (this.state.orderTotal*0.08).toFixed(2)}</Text>
                    <Text>{'\n\n'}</Text>
                  </View>
                  <View style ={{flexDirection: 'row', alignSelf: 'left', left: '15%',}}>
                    <Image source = {require('./card.png')}
                    />
                  <Text style = {{fontSize: 14, top: -3, fontWeight: '600', fontFamily: 'Inter-Bold'}}>   {this.state.lastFour}</Text>
                  </View>
                  <TouchableOpacity onPress = {this.checkPayment} style={{backgroundColor:this.state.placeOrderColor, top: 15, borderRadius: 12, width: 260, height:35, flexDirection:'row', marginBottom: 20, alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={{ fontSize: 12, fontWeight: 'bold', color:'#FFFFFF', fontFamily: 'Inter-Bold'}}>{this.state.placeOrderText}</Text>
                  </TouchableOpacity>
                  <Text>{'\n'}</Text>
                </View>
                <Modal
                  isVisible = {this.state.openPayment}
                  onBackdropPress={this.turnModalOff}
                  backdropColor ={"black"}
                  backdropOpacity = {0.5}
                >
                  <View style = {[styles.paymentModal, {opacity: this.state.paymentOpacity}]}>
                    <Text style = {{color: '#8134FF', marginTop: '6%', fontWeight:'bold', fontSize: 16, fontFamily: 'Inter-Bold'}}>Add Payment Method</Text>
                    <View style = {{marginTop: '10%'}}>
                      <TextInput clearButtonMode="while-editing" style = {[styles.textInput, {marginTop: 0, color: '#000000'}]} onChangeText={text => this.cardName(text)} value = {this.state.cardName} onFocus = {this.clearCardName} onBlur = {this.resetCardName}></TextInput>
                      <TextInput clearButtonMode="while-editing" style = {[styles.textInput, {marginTop: 25, color: '#000000'}]} onChangeText={text => this.cardNumber(text)}  value = {this.state.cardNumber} onFocus={this.clearCardNumber} onBlur = {this.resetCardNumber}></TextInput>
                      <View style = {{flex: 2.8, flexDirection: 'row'}}>
                      <Picker
                      style={[styles.onePicker, {left: 5, width: 35}]} itemStyle={styles.onePickerItem}
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
                        style={[styles.onePicker, {left: 15, width: 50}]} itemStyle={styles.onePickerItem}
                        selectedValue={this.state.year}
                        onValueChange={(itemValue) => this.setState({year: itemValue})}
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
                        <TextInput clearButtonMode="while-editing" style = {[styles.textInput, {flex: 1, width: '36%', marginTop: 25, color: '#000000'}]} onChangeText={text => this.cardSec(text)} value = {this.state.cardSec} onFocus = {this.clearCardSec} onBlur = {this.resetCardSec}></TextInput>
                      </View>
                    </View>
                    <TouchableOpacity onPress = {this.addPayment} style={{position: 'absolute', top: '80%', backgroundColor:'#8134FF', borderRadius: 12, width: 98, height:37, alignItems: 'center', justifyContent: 'center'}}>
                      <Text style={{ fontSize: 12, fontWeight: 'bold', color:'#FFFFFF', fontFamily: 'Inter-Bold'}}>Add</Text>
                    </TouchableOpacity>
                  </View>
                </Modal>
                <Modal
                    isVisible = {this.state.openOrder}
                    onBackdropPress={this.turnModalOff}
                    backdropColor ={"black"}
                    backdropOpacity = {0.5}
                  >
                    <View style = {styles.orderModal}>
                      <View style= {styles.container1}>
                      <View style={{width:'70%'}}>
                        <Text style = {{color: '#8134FF', marginTop: '6%', fontWeight:'bold', fontSize: 16, fontFamily: 'Inter-Bold'}}>    {this.state.modalRest}</Text>
                      </View>
                      <View style={{width:'30%'}}>
                        <Text style = {{color: '#000000', marginTop: '20%', fontSize: 10, fontFamily:'Inter-Regular'}}>    Order#{this.state.orderNumb}</Text>
                      </View>
                      </View>
                      <View style = {{backgroundColor: '#FFFCE6', height: 26, width: '100%', alignItems: 'center', justifyContent:'center', marginTop: 10, flexDirection: 'row'}}>
                        <Text style = {{color: '#62580E', fontSize: 12, fontFamily: 'Inter-Regular'}}>       Pick up before {convertedHours}</Text>
                      </View>
                      <SafeAreaView style = {{marginLeft: '6%', minHeight: '14%', maxHeight: '30%', marginTop:'12%'}}>
                        <FlatList
                          data={this.state.order}
                          renderItem={this.renderOrderFinal}
                          keyExtractor={(item, index) => index.toString()}
                          showsVerticalScrollIndicator={false}
                        />
                      </SafeAreaView>
                      <Text>{'\n'}</Text>
                      <View style={{alignItems: 'center'}}>
                      <TouchableOpacity onPress = {this.turnModalOff} style={{backgroundColor:'#8134FF', borderRadius: 12, width: 260, height:35, flexDirection:'row', marginBottom: 20, alignItems: 'center', justifyContent: 'center'}}>
                        <Text style={{ fontSize: 12, fontWeight: 'bold', color:'#FFFFFF', fontFamily: 'Inter-Bold'}}>Return Home</Text>
                      </TouchableOpacity>
                      </View>
                       <Text>{'\n'}</Text>
                      </View>
                  </Modal>
              </Modal>
              <View style = {{opacity: this.state.checkoutButtonOpacity, bottom: '15%', justifyContent: 'center', alignItems: 'center', height: 40, width: '100%', borderRadius: 12,}}>
                <TouchableOpacity onPress = {this.checkout} style = {[styles.checkOutButton]}>
                  <Text style={{color:'#FFFFFF', fontWeight: 'bold', fontFamily: 'Inter-Bold'}}>Check Out</Text>
                </TouchableOpacity>
              </View>
            </View>
        </Modal>
        <View style={styles.container1}>
        <View style={styles.sideSpace}></View>
        <View style={styles.sidebar}></View>
        <View style={styles.mainMenu}>
	        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
	          <Text style={{fontSize: 12, fontFamily: 'Inter-Regular'}}>{address}</Text>
	        </View>
        <View style = {{flex: 20}}>
          <FlatList style = {{flex: 1}}
            data={timeR}
            renderItem={this.renderTimes}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
          />
        </View>
        </View>
        </View>
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

    var timeStyle = styles.timeHeader;
    if(item.time == 'LIVE')
    {
      timeStyle = styles.timeHeaderLive;
    }

    var liveString = "live in " + h + " hr(s), " + m + " min";
    var length = 10;
    var convertedTime = '';
    if(item.time == 'LIVE')
    {
      liveString = "";
      length = ((min/60)*(210*item.restaurants.length));
      convertedTime = 'LIVE';
    }
    else{

    if(int == 12)
    {
    	convertedTime = '12:00 PM';
    }
    else if(int > 12)
    {
    	convertedTime = (int-12).toString() + ':00 PM';
    }
    else if(int == 0)
    {
    	convertedTime = '12:00 AM';
    }
    else
    {
    	convertedTime = int.toString() + ':00 AM';
    }
}

    return (
      <View>
       		<View style={[styles.container1, {marginBottom: 20}]}>
       		<View style={[styles.sideBox, {height: length}]}></View>
       		<View style={styles.mainMenu}>
	      	<View style={styles.container1}>
		      	<View style={styles.timeBox}>
		        	<Text style={[timeStyle, {fontWeight: '700'}]}>{convertedTime}</Text>
		        </View>
		        <View style={[styles.lBox, {alignItems:'flex-end'}]}>
		        	<Text style= {styles.watch}>{liveString}</Text>
		        </View>
        	</View>
	        <SafeAreaView>
	          <FlatList style = {{flex: 1}}
	            data={item.restaurants}
	            renderItem={this.renderRestaurants}
              keyExtractor={(item, index) => index.toString()}
	            showsVerticalScrollIndicator={false}
	          />
	        </SafeAreaView>
	        </View>
        </View>
      </View>);
  };
  //get rid of yello

  renderRestaurants = ({item}) => {
    var wString = item.watchers + " biters watching";
    var sBox = styles.box;
    var live = false;

    if(item.time.localeCompare('LIVE') == 0)
    {
      sBox = styles.liveBox;
      live = true;
    }

    return(
      // <View>
      // <TouchableOpacity onPress={() => this.refs.modal1.open()} style = {styles.box}>
      //   <Text style = {styles.restaurantName}>{restaurant}</Text>
      //   <Text>{itemName}</Text>
      // </TouchableOpacity>
      // </View>
      <View>
        <TouchableOpacity style = {sBox} onPress={() => this.turnModalOn(item.name, item.image, item.address, item.watchers, item.time, item.dist, live)}>
          <View style={styles.container1}>
            <View style={styles.restTitle}>
              <Text style = {styles.restaurantName}>{item.name}</Text>
              <View style={styles.tagContainer}>
                  <View style={styles.tagBox}>
                    <Text style={{color: '#330382'}}>{item.tag0}</Text>
                  </View>
                  <View style={styles.spacer1}></View>
                  <View style={styles.tagBox}>
                    <Text style={{color: '#330382'}}>{item.tag1}</Text>
                  </View>
                  <View style={styles.spacer1}></View>
              </View>
              <Text style={styles.watch}>{wString}</Text>
            </View>
            <View style={styles.imageBox}>
              <Image source = {{uri:item.image}}
                style = {{ width: 117, height: 117, borderRadius: 12 }}
              />
            </View>
          </View>
        </TouchableOpacity>
      </View>);

  };
//ugh
  renderDeals = ({item}) => {
    var itemInArray = [item.name];
    var sBox = styles.dealBoxNotPressed;
    let {itemPressed} = this.state;
    var itemName = item.name;
    var shown = false;
    var visibility = 0;
    var isOrdered = false;
    if(itemPressed.localeCompare(itemName) == 0)
    {
      sBox = styles.dealBoxPressed;
    }
    for(var i=0; i < this.state.order.length; i++)
    {
      if(itemName == this.state.order[i].name)
      {
        visibility = 100;
        sBox = styles.dealBoxOrdered;
        isOrdered = true;
      }
    }
    if(isOrdered && itemPressed.localeCompare(itemName) == 0)
    {
    	sBox = styles.dealBoxOrderedPressed;
    }
    if(this.state.currentOrderQuantity == 0)
    {
    	sBox = styles.dealBoxNotPressed;
    }

    return(
      <View>
        <TouchableOpacity activeOpacity = {1} style = {sBox} onPress={() => this.pressItem(itemName)}>
          <View>
            <View style = {{flexDirection: 'row'}}>
              <Text style = {[styles.restaurantName, {flex:8}]}>{item.name}</Text>
              <View style ={{opacity: visibility, borderRadius:24, backgroundColor: '#8134FF', position: 'absolute', left: '88%', width: 22, height: 22, alignItems: 'center', justifyContent:'center'}}>
                <FlatList data={itemInArray} extraData={this.state.refresh} renderItem={this.renderQuantity} keyExtractor={(item, index) => index.toString()}/>
              </View>
            </View>
            <View style={{width: 0.55*screenWidth}}>
              <View style={[styles.dealDesc, {}]}>
                <Text style={{fontSize: 12}}>{item.description}</Text>
              </View>
              <View style={styles.dealPrice}>
                <Text style={{textDecorationLine: "line-through", fontFamily: 'Inter-Regular'}}>{item.originalPrice}  > </Text>
                <Text style={{fontFamily: 'Inter-Regular'}}>{item.newPrice}</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
        {(isOrdered) &&
        <View style={styles.quantityBox}>
          <View style={styles.container1}>
              <View style={styles.emptySideQuantity}>
              </View>
              <TouchableOpacity style={{width: '20%'}} onPress={() => this.removeItem(this.state.itemPressed)}>
                <Text style={styles.removeText}>Remove</Text>
              </TouchableOpacity>
          </View>
        </View>}
        {(!isOrdered) &&
        <View style={styles.quantityBox}>
          <View style={styles.container1}>
              <View style={styles.emptySideQuantity}>
              </View>
              <TouchableOpacity style={styles.signMinus} onPress={() => this.setState({currentOrderQuantity: (this.state.currentOrderQuantity > 0) ? (this.state.currentOrderQuantity - 1) : 0})}>
                <Text style={styles.signText}>-</Text>
              </TouchableOpacity>
              <View style={styles.quantityNumberBox}>
                <Text style={styles.quantityNumberText}> {this.state.currentOrderQuantity} </Text>
                <TouchableOpacity onPress={() => {this.addItem(item.name, this.state.modalRest, this.state.currentOrderQuantity, item.newPrice, item.originalPrice);}}>
                    <Text style={{fontSize: 11, fontWeight: 'bold', color: '#FFFFFF', marginTop: 60, fontFamily: 'Inter-Bold'}}>ADD   </Text>
                </TouchableOpacity>
              </View>
               <TouchableOpacity style={styles.signPlus} onPress={() => this.setState({currentOrderQuantity: this.state.currentOrderQuantity +1})}>
                <Text style={styles.signText}>+</Text>
              </TouchableOpacity>
          </View>
        </View>}

      </View>
    );
  };

  renderNotLiveDeals = ({item}) => {
    var itemInArray = [item.name];
    let {itemPressed} = this.state;
    var itemName = item.name;
    var shown = false;
    var visibility = 0;
    return(
      <View style={{flexDirection:'row'}}>
        <TouchableOpacity activeOpacity = {1} style = {styles.notLiveDealBox} onPress={() => this.setState({itemPressed: itemName, currentOrderQuantity: 1})}>
          <View>
            <View style = {{flexDirection: 'row'}}>
              <Text style = {[styles.restaurantName, {flex:8, fontSize:16}]}>{item.name}</Text>
            </View>
            <View style={{width: '90%'}}>
              <View style={styles.dealDesc}>
                <Text style={{fontSize: 12, fontFamily: 'Inter-Regular'}}>{item.description}</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  renderQuantity = ({item}) => {
    var number = 0;
    for(var i = 0; i < this.state.order.length; i++)
    {

      if(this.state.order[i].name == item)
      {
        number = this.state.order[i].quantity;
      }
    }
    return(<View><Text style = {{fontSize: 12, color: '#FFFFFF', fontFamily:'Inter-Regular'}}>{number}</Text></View>);
  }

//sad
  renderOrder = ({item}) => {
    var totalCost = this.state.orderTotal + (item.price*item.quantity);
    return(
    <View style = {styles.orderItem}>
      <View style = {{width: '55%', flexDirection: 'row'}}>
        <Text style={{fontWeight:'bold', fontFamily: 'Inter-Bold'}}>{item.name}</Text>
        <Text style={{fontSize: 12, paddingTop:1.5, fontFamily: 'Inter-Regular'}}>   x{item.quantity}</Text>
      </View>
      <Text style = {{marginLeft:'20%', fontSize:13, fontFamily: 'Inter-Regular'}}>{"$"+(item.price*item.quantity).toFixed(2)}</Text>
    </View>);
  };
  renderOrderFinal = ({item}) => {
    var totalCost = this.state.orderTotal + (item.price*item.quantity);
    return(
    <View style = {styles.orderItem}>
      <View style = {{width: '55%', flexDirection: 'row'}}>
        <Text style={{fontWeight:'bold', fontFamily: 'Inter-Bold'}}>{item.name}</Text>
        <Text style={{fontSize: 12, paddingTop:1.5, fontFamily: 'Inter-Regular'}}>   x{item.quantity}</Text>
      </View>
    </View>);
  };

  addItem = (name, restName, quantity, price, oldPrice) =>{
    if(this.state.username.localeCompare('null') == 0)
    {
      this.goToSignup();
    }
    price = price.substring(1, price.length);
    var priceNumber = parseFloat(price, 10);

    oldPrice = oldPrice.substring(1, oldPrice.length);
    var oldPriceNumber = parseFloat(oldPrice, 10);

    var item = {name: name, restName: restName, quantity: quantity, price: priceNumber, oldPrice: oldPriceNumber};

    var totalCost = this.state.orderTotal + (priceNumber*quantity);
    var totalSavings = this.state.totalSavings + (oldPriceNumber - priceNumber) * quantity;
    //redundancy check total cost is not correct in this case though
    for(var i=0; i< this.state.order.length; i++)
    {
      if(this.state.order[i].name == name)
      {
        this.state.order[i].quantity = quantity;
        return;
      }
    }

    this.state.order.push(item);

    if(this.state.order.length>0)
    {
      this.setState({checkoutButtonOpacity: 100});
    }
    var placeOrderText = "Place Order\t\t\t\t" + "$" + (totalCost*1.08).toFixed(2);
    this.setState((state) => {return {orderTotal: totalCost, totalSavings: totalSavings, placeOrderText: placeOrderText, itemPressed:'', refresh: !this.state.refresh}});

  };

  removeItem = (item) => {
  	var index = -1;
  	for(var i=0; i< this.state.order.length; i++)
    {
      if(this.state.order[i].name == item)
      {
        index =i;
        break;
      }
    }
    if(index != -1)
    {
    	var tempArray = this.state.order;
    	tempArray.splice(i, 1);
    	this.setState({order: tempArray});
    	 if(this.state.order.length==0)
	    {
	      this.setState({checkoutButtonOpacity: 0});
	    }
	    this.setState({itemPressed: 'null', currentOrderQuantity: 0});
    }
  }

  pressItem = (item) => {
  	if(this.state.itemPressed == item)
  	{
  		this.setState({itemPressed: 'null', currentOrderQuantity: 0});
  	}
  	else
  	{
  		this.setState({itemPressed: item, currentOrderQuantity: 1});
  	}
  }

  addPayment = () =>{
    this.setState({openPayment: false,});
    var pRef = firestoreDB.collection("users").doc(this.state.username);

          pRef.update({
              payment: this.state.cardNumber

          })
          .then(function() {
              console.log("Document successfully updated!");

          })
          .catch(function(error) {
              // The document probably doesn't exist.
              console.error("Error updating document: ", error);
          });
          this.setState({openPayment: false});


  }
  checkout = () => {
  	this.setState({openCheckout: true});
  }
  updatePayment = () => {
    firestoreDB.collection("users").doc(this.state.username).get().then(doc => {
        if(!doc.exists) {
          this.setState({lastFour: ""});
        }
        else{
          if (doc.data().payment != "null")
          {
            var length = doc.data().payment.length;
            var lastDigits = doc.data().payment.substring(length-4, length);
            this.setState({lastFour: lastDigits});
          }
          else{
            this.setState({lastFour: ""});
          }
        }
      });
  }

  checkPayment = () =>{
    firestoreDB.collection("users").doc(this.state.username).get().then(doc => {
        if(!doc.exists) {
        }
        else{
          if (doc.data().payment != "null")
          {
            var length = doc.data().payment.length;
            var lastDigits = doc.data().payment.substring(length-4, length);
            this.setState({lastFour: lastDigits});
            this.purchase();
          }
          else{
            this.setState({openPayment: true});
            return;
          }
        }
      });
  }
  purchase = () => {
  	this.setState({placeOrderColor: '#5ED634', placeOrderText:'\u2705\tSuccess'});
    var totalPrice = 0;
    //this.updateRewards();
    setTimeout(() => {this.setState({checkoutOpacity: 0, openOrder: true,})}, 1000);
  	for(var i=0; i < this.state.order.length; i++)
  	{
  	  	firestoreDB.collection("restaurants").doc(this.state.order[i].restName).collection("orders").add({
  		   	itemName: this.state.order[i].name,
  	  		quantity: this.state.order[i].quantity,
  	  		fulfilled: false,
  	  		username: this.state.username,
          price: this.state.order[i].price,
          oldPrice: this.state.order[i].oldPrice,

  		  });
  	    firestoreDB.collection("users").doc(this.state.username).collection("orders").add({
  		   	itemName: this.state.order[i].name,
  	  		quantity: this.state.order[i].quantity,
  	  		fulfilled: false,
  	  		restaurant: this.state.order[i].restName,
          price: this.state.order[i].price,
          oldPrice: this.state.order[i].oldPrice,
  		  });
  	}
   // this.updateRewards();
  }

  /*updateRewards = async () => {

    var currRewards = await AsyncStorage.getItem('rewards');

    currRewards = parseInt(currRewards);
    currRewards = currRewards + (Math.floor(this.state.orderTotal/10) * 10);

    try {
      await AsyncStorage.setItem('rewards', currRewards.toString());

    } catch (error) {
      // Error saving data
    }
  };*/



  turnModalOn = (name, image, address, watchers, time, dist, live) =>{
    this.getItems(name);
    var sz =0;
    firestoreDB.collection("restaurants").doc(name).collection("orders").get().then(snap => {
   		sz = snap.size +1;// will return the collection size
   		this.setState({orderNumb: sz});
	   });
    if(live){
      this.setState({openModal:true,});
    }
    else
    {
      this.setState({openNotLive:true});
    }
    this.setState({modalRest: name, modalImage: image, modalAddress: address, modalWatching: watchers, modalTime: time, modalDist: dist, openCheckout: false, checkoutButtonOpacity: 0, placeOrderColor: '#8134FF', totalSavings: 0, orderTotal: 0});
    this.setState({order: []});
  }

  turnModalOff = () =>{
    this.setState({openModal:false, openNotLive: false, checkoutOpacity: 1});
    this.setState({openOrder: false});
  }
  goToSignup()
  {
    this.setState({openModal:false, openCheckout: false});
    this.props.navigation.navigate('Signup');
  }

  cardName(text){
    this.setState({cardName: text});
  }
  cardNumber(text){
	this.setState({cardNumber: text.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim()});
  }
  cardExp(text){
    this.setState({cardExp: text});
  }
  cardSec(text){
    this.setState({cardSec: text});
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

}

const styles = StyleSheet.create({
  timeHeader: {
    marginLeft: 0.05 * screenWidth,
    fontSize: 18,
    // fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontFamily: 'Inter-Bold'
  },
  timeHeaderLive: {
    marginLeft: 0.05 * screenWidth,
    fontSize: 18,
    // fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: 'bold',
    color: '#8134FF',
    fontFamily: 'Inter-Bold'
  },
  restaurantName:{
    fontWeight: 'bold',
    fontFamily: 'Inter-Bold',
    fontSize: 18
  },
  watch:{
    fontSize: 10.5,
    fontWeight: '200',
    fontStyle: 'italic',
    fontFamily: 'Inter-Italic'
  },
  container: {
    flex: 1,
  },
  box: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 16,
    width: 0.9 * screenWidth,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#EDE1FF',
    shadowColor: '#b189ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: .2,
    shadowRadius: 8,
    elevation: 1
  },
  liveBox:{
    backgroundColor: '#FFFFFF',
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 16,
    width: 0.9 * screenWidth,
    borderRadius: 12,
    borderWidth: 5,
    borderColor: '#8134FF'
  },
  title: {
    fontSize: 16,
    fontFamily: 'Inter-Regular'
  },
  item:{
    fontSize: 12,
    fontFamily: 'Inter-Regular'
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
  restTitle: {
    width: '62%' // is 50% of container width
  },
  tagBox: {
    width: '40%',
    backgroundColor: '#F4EDFF',
    borderRadius: 4,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center'
     // is 50% of container width
  },
  imageBox: {
    width: '32%', // is 50% of container width
  },
  spacer1: {
    width: '5%' // is 50% of container width
  },
  timeBox: {
    width: '60%', // is 50% of container width
    flexDirection: 'row'
  },
  lBox: {
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
    alignItems: 'flex-start',
    fontFamily: 'Inter-Regular'
  },
  dealBoxNotPressed:{
    height: 110,
    paddingTop: 8,
    paddingLeft: 10,
    backgroundColor: '#FFFFFF',
    marginVertical: 8,
    marginHorizontal: 16,
    width: 0.9 * screenWidth,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    borderColor: '#EDE1FF',
    borderWidth: 2,
    zIndex: 1,
    shadowColor: '#b189ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: .2,
    shadowRadius: 8,
  },
  dealBoxOrdered:{
    height: 110,
    paddingTop: 8,
    paddingLeft: 10,
    backgroundColor: '#FFFFFF',
    marginVertical: 8,
    marginHorizontal: 16,
    width: 0.9 * screenWidth,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    borderColor: '#8134FF',
    borderWidth: 4,
    zIndex: 1,
  },
dealBoxOrderedPressed:{
    height: 110,
    paddingTop: 8,
    paddingLeft: 10,
    backgroundColor: '#FFFFFF',
    marginVertical: 8,
    marginHorizontal: 16,
    width: 0.6 * screenWidth,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    borderColor: '#8134FF',
    borderWidth: 4,
    zIndex: 1,

  },
  quantityBox:
  {
    height: 110,
    paddingTop: 8,
    paddingLeft: 10,
    backgroundColor: '#8134FF',
    marginVertical: 8,
    marginHorizontal: 16,
    width: 0.9 * screenWidth,
    position: 'absolute',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    top: 0,
    left: 0,

  },

  dealBoxPressed:{
    height: 110,
    paddingTop: 8,
    paddingLeft: 10,
    backgroundColor: '#FFFFFF',
    marginVertical: 8,
    marginHorizontal: 16,
    width: 0.6 * screenWidth,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    borderColor: '#EDE1FF',
    borderWidth: 2,
    zIndex: 1,
    shadowColor: '#b189ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: .2,
    shadowRadius: 8,
  },
  dealPrice:{
    marginTop: 14,
    flexDirection: "row",
  },
  modalTime:
  {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: "4%",
    marginTop: "22%",
    fontFamily: 'Inter-Bold'
  },
  modalTimeLive:
  {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: "4%",
    marginTop: "22%",
    color: '#8134FF',
    fontFamily: 'Inter-Bold'
  },
  emptySideQuantity:
  {
    width: '73%'
  },
  signMinus:
  {
    width: '7%',

  },
  signPlus:
  {
    width: '10%',

  },
  quantityNumberBox:
  {
    width: '10%',

  },
  quantityNumberText:
  {
    color: '#FFFFFF',
    fontSize: 20,
    top: 35,
    fontWeight: "bold",
    fontFamily: 'Inter-Bold'

  },
  signText:
  {
    color: '#FFFFFF',
    fontSize: 18,
    top: 35,
    fontFamily: 'Inter-Regular'
  },
  removeText:
  {
    color: '#FFFFFF',
    fontSize: 15,
    top: 35,
    fontWeight: 'bold',
    fontFamily: 'Inter-Bold'
  },
  addText:
  {
    fontSize: 11,
    color: '#FFFFFF',
    marginTop: 60,
    fontWeight: "bold",
    fontFamily: 'Inter-Bold'

  },
  checkOutButton:
  {
    fontSize: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#8134FF',
    height: 40,
    width: '80%',
    borderRadius: 12,
    fontFamily: 'Inter-Regular'
  },
  checkoutModal:
  {
    //flex: 1,
    position: 'absolute',
    //width: '85%',
    //marginLeft:'7%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    flexGrow: 1,
    marginLeft: -0.05*screenWidth,
    height: '60%',
    width: screenWidth,
    top: '55%',

    borderTopLeftRadius: 50,
    borderTopRightRadius: 50
  },
  orderModal:
  {
    flex: 1,
    position: 'absolute',
    //width: '85%',
    marginLeft:'7%',
    justifyContent: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    flexGrow: 1,
    zIndex: 999,
    marginLeft: -0.05*screenWidth,
    height: '40%',
    width: screenWidth,
    top: '65%',
  },
  orderItem:
  {
    flex:2,
    flexDirection:'row',
    height: 35,
  },
  tax:
  {
    marginTop: 25,
    flexDirection:'row'
  },
  sidebar:
  {
  	width: '1%',
  	backgroundColor: '#EDE1FF',
  	height: .9*screenHeight,
  	position: 'absolute',
  	left: 12
  },
  sideSpace:
  {
  	width: '3%',

  },
  mainMenu:
  {
  	width: '96%',
  },
  sideBox:
  {
  	width: '1%',
  	backgroundColor: '#8134FF',
  	position: 'absolute',
  	left: 0,
  },
  notLiveDealBox:{
    height: 120,
    paddingTop: 14,
    paddingLeft: 10,
    backgroundColor: '#FFFFFF',
    marginVertical: 8,
    marginRight: 12,
    width: 0.43 * screenWidth,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    borderColor: '#EDE1FF',
    borderWidth: 2,
    zIndex: 1,

    shadowColor: '#b189ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  textInput: {
    fontSize: 12,
    height: 40,
    borderBottomWidth: 2,
    borderBottomColor: '#8032ff',
    width: .7*screenWidth,
    color: '#000000',
    fontFamily: 'Inter-Regular'
  },
  paymentModal:
  {
    //flex: 1,
    alignSelf:'center',
    position: 'absolute',
    //marginLeft:'7%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    flexGrow: 1,
    marginLeft: -0.05*screenWidth,
    height: '45%',
    width: screenWidth * 0.9,
    top: '24%',
    borderRadius: 50
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
   borderWidth: 0,
   fontFamily: 'Inter-Regular'

 },
});
