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
      const { navigation, route } = props;
      const email = route.params.email;
      //console.log(email);
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
      };
      this._getLocationAsync();

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

      this.addItem = this.addItem.bind(this);



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
      var modalTimeStyle = styles.modalTime;
      if(this.state.modalTime.localeCompare('LIVE') ==0)
      {
        modalTimeStyle = styles.modalTimeLive;
      }
      var hours = new Date().getHours();

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
                  <Text style={modalTimeStyle}>{this.state.modalTime}</Text>
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
              <Modal
                isVisible = {this.state.openCheckout}
                onBackdropPress={this.turnModalOff}
                backdropColor ={"black"}
                backdropOpacity = {0.5}
              >
                <View style = {styles.checkoutModal}>
                  <Text style = {{color: '#8134FF', marginTop: '6%', fontWeight:'bold', fontSize: 16}}>{this.state.modalRest}</Text>
                  <View style = {{backgroundColor: '#EDE1FF', height: 26, width: '100%', alignItems: 'center', justifyContent:'center', marginTop: 10, flexDirection: 'row'}}>
                    <Text style = {{color: '#330382', fontSize: 12}}>Savings</Text>
                    <Text style = {{color: '#330382', fontSize: 12, fontWeight: 'bold'}}>       {"$" + this.state.totalSavings.toFixed(2)}</Text>
                  </View>
                  <SafeAreaView style = {{marginLeft: '6%', minHeight: '12%', maxHeight: '20%', marginTop:'12%'}}>
                    <FlatList
                      data={this.state.order}
                      renderItem={this.renderOrder}
                      keyExtractor={timeSlot => timeSlot.id}
                      showsVerticalScrollIndicator={false}
                    />
                  </SafeAreaView>
                  <View style = {{backgroundColor: '#EDE1FF', height: 2, width: '80%'}}></View>
                  <View style = {styles.tax}>
                    <Text style = {{width: '55%', fontSize: 12}}>Tax</Text>
                    <Text style = {{fontSize: 12}}>{"$" + (this.state.orderTotal*0.08).toFixed(2)}</Text>
                    <Text>{'\n\n'}</Text>
                  </View>
                  <TouchableOpacity onPress = {this.purchase} style={{backgroundColor:this.state.placeOrderColor, borderRadius: 12, width: 260, height:35, flexDirection:'row', marginBottom: 20, alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={{ fontSize: 12, fontWeight: 'bold', color:'#FFFFFF'}}>{this.state.placeOrderText}</Text>
                  </TouchableOpacity>
                  <Text>{'\n'}</Text>
                </View>
        		  <Modal
	                isVisible = {this.state.openOrder}
	                onBackdropPress={this.turnModalOff}
	                backdropColor ={"black"}
	                backdropOpacity = {0.5}
	              >
	                <View style = {styles.orderModal}>
                	  <View style= {styles.container1}>
                	  <View style={{width:'70%'}}>
	                  	<Text style = {{color: '#8134FF', marginTop: '6%', fontWeight:'bold', fontSize: 16}}>    {this.state.modalRest}</Text>
              		  </View>
              		  <View style={{width:'30%'}}>
	                  	<Text style = {{color: '#000000', marginTop: '20%', fontSize: 10}}>    Order#{this.state.orderNumb}</Text>
	                  </View>
	                  </View>
	                  <View style = {{backgroundColor: '#FFFCE6', height: 26, width: '100%', alignItems: 'center', justifyContent:'center', marginTop: 10, flexDirection: 'row'}}>
	                    <Text style = {{color: '#62580E', fontSize: 12}}>       Pick up before {hours}:00</Text>
	                  </View>
	                  <SafeAreaView style = {{marginLeft: '6%', minHeight: '14%', maxHeight: '30%', marginTop:'12%'}}>
	                    <FlatList
	                      data={this.state.order}
	                      renderItem={this.renderOrderFinal}
	                      keyExtractor={timeSlot => timeSlot.id}
	                      showsVerticalScrollIndicator={false}
	                    />
	                  </SafeAreaView>
	                  <Text>{'\n'}</Text>
	                  <View style={{alignItems: 'center'}}>
	                  <TouchableOpacity onPress = {this.turnModalOff} style={{backgroundColor:'#8134FF', borderRadius: 12, width: 260, height:35, flexDirection:'row', marginBottom: 20, alignItems: 'center', justifyContent: 'center'}}>
                    	<Text style={{ fontSize: 12, fontWeight: 'bold', color:'#FFFFFF'}}>Return Home</Text>
              		  </TouchableOpacity>
              		  </View>
              		   <Text>{'\n'}</Text>
	                  </View>
	              </Modal>
              </Modal>
              <View style = {[styles.checkOutButton, {opacity: this.state.checkoutButtonOpacity}]}>
                <TouchableOpacity onPress = {this.checkout}>
                  <Text style={{color:'#FFFFFF', fontWeight: 'bold'}}>Check Out</Text>
                </TouchableOpacity>
              </View>
            </View>
        </Modal>
        <View style={styles.container1}>
        <View style={styles.sideSpace}></View>
        <View style={styles.sidebar}></View>
        <View style={styles.mainMenu}>
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
    if(item.time == 'LIVE')
    {
      liveString = "";
      length = ((min/60)*210);
    }
    return (
      <View>
       		<View style={styles.container1}>
       		<View style={[styles.sideBox, {height: length}]}></View>
       		<View style={styles.mainMenu}>
	      	<View style={styles.container1}>
		      	<View style={styles.timeBox}>
		        	<Text style={timeStyle}>{item.time}</Text>
		        </View>
		        <View style={styles.lBox}>
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
	        </View>
        </View>

        <Text>{"\n"}</Text>
      </View>);
  };
  //get rid of yello

  renderRestaurants = ({item}) => {
    var wString = item.watchers + " biters watching";
    var sBox = styles.box;
    if(item.time.localeCompare('LIVE') == 0)
    {
      sBox = styles.liveBox;
    }

    return(
      // <View>
      // <TouchableOpacity onPress={() => this.refs.modal1.open()} style = {styles.box}>
      //   <Text style = {styles.restaurantName}>{restaurant}</Text>
      //   <Text>{itemName}</Text>
      // </TouchableOpacity>
      // </View>
      <View>
        <TouchableOpacity style = {sBox} onPress={() => this.turnModalOn(item.name, item.image, item.address, item.watchers, item.time, item.dist)}>
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
            </View>
            <View style={styles.imageBox}>
              <Image source = {{uri:item.image}}
                style = {{ width: 117, height: 117, borderRadius: 12 }}
              />
            </View>
          </View>
          <Text style={styles.watch}>{wString}</Text>
        </TouchableOpacity>
      </View>);

  };
//ugh
  renderDeals = ({item}) => {

    var sBox = styles.dealBoxNotPressed;
    let {itemPressed} = this.state;
    var itemName = item.name;
    if(itemPressed.localeCompare(itemName) == 0)
    {
      sBox = styles.dealBoxPressed;
    }
    for(var i=0; i < this.state.order.length; i++)
    {
      if(itemName == this.state.order[i].name)
      {
        sBox = styles.dealBoxOrdered;
      }
    }

    return(
      <View>
        <TouchableOpacity activeOpacity = {1} style = {sBox} onPress={() => this.setState({itemPressed: itemName, currentOrderQuantity: 1})}>
          <View>
            <View style = {{flexDirection: 'row'}}>
              <Text style = {[styles.restaurantName, {flex:8}]}>{item.name}</Text>
              <Image source = {require('./purpleCircle.png')}
                style = {{flex: 3, height: 18, width: 18, position: 'absolute', left: '88%' }}
              />
              <Text style = {{flex: 1, fontSize: 12, color: '#FFFFFF'}}>6</Text>
            </View>
            <View style={{width: '70%'}}>
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

        <View style={styles.quantityBox}>
          <View style={styles.container1}>
              <View style={styles.emptySideQuantity}>
              </View>

              <TouchableOpacity style={styles.signMinus} onPress={() => this.setState({currentOrderQuantity: (this.state.currentOrderQuantity > 0) ? (this.state.currentOrderQuantity - 1) : 0})}>
                <Text style={styles.signText}>-</Text>
              </TouchableOpacity>
              <View style={styles.quantityNumberBox}>
                <Text style={styles.quantityNumberText}> {this.state.currentOrderQuantity} </Text>
                <TouchableOpacity onPress={() =>this.addItem(item.name, this.state.modalRest, this.state.currentOrderQuantity, item.newPrice, item.originalPrice)}>
                    <Text style={{fontSize: 11, fontWeight: 'bold', color: '#FFFFFF', marginTop: 60}}>ADD   </Text>
                </TouchableOpacity>
              </View>
               <TouchableOpacity style={styles.signPlus} onPress={() => this.setState({currentOrderQuantity: this.state.currentOrderQuantity +1})}>
                <Text style={styles.signText}>+</Text>
              </TouchableOpacity>

          </View>
        </View>

      </View>
    );
  };
//sad
  renderOrder = ({item}) => {
    var totalCost = this.state.orderTotal + (item.price*item.quantity);
    return(
    <View style = {styles.orderItem}>
      <View style = {{width: '55%', flexDirection: 'row'}}>
        <Text style={{fontWeight:'bold'}}>{item.name}</Text>
        <Text style={{fontSize: 12, paddingTop:1.5}}>   x{item.quantity}</Text>
      </View>
      <Text style = {{marginLeft:'20%', fontSize:13}}>{"$"+(item.price*item.quantity).toFixed(2)}</Text>
    </View>);
  };
  renderOrderFinal = ({item}) => {
    var totalCost = this.state.orderTotal + (item.price*item.quantity);
    return(
    <View style = {styles.orderItem}>
      <View style = {{width: '55%', flexDirection: 'row'}}>
        <Text style={{fontWeight:'bold'}}>{item.name}</Text>
        <Text style={{fontSize: 12, paddingTop:1.5}}>   x{item.quantity}</Text>
      </View>
    </View>);
  };

  addItem = (name, restName, quantity, price, oldPrice) =>{
  	console.log("add");
    price = price.substring(1, price.length);
    var priceNumber = parseInt(price, 10);

    oldPrice = oldPrice.substring(1, oldPrice.length);
    var oldPriceNumber = parseInt(oldPrice, 10);

    var item = {name: name, restName: restName, quantity: quantity, price: priceNumber};

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
    console.log(this.state.order);

    if(this.state.order.length>0)
    {
      this.setState({checkoutButtonOpacity: 100});
    }
    var placeOrderText = "Place Order\t\t\t\t" + "$" + (totalCost*1.08).toFixed(2);
    this.setState({orderTotal: totalCost, totalSavings: totalSavings, placeOrderText: placeOrderText, itemPressed:''});

  }
  checkout = () => {
  	this.setState({openCheckout: true});
  }
  purchase = () => {
  	console.log('buy');
  	this.setState({openOrder: true});
  	this.setState({placeOrderColor: '#5ED634', placeOrderText:'\u2705\tSuccess'});
  	for(var i=0; i < this.state.order.length; i++)
  	{
	  	firestoreDB.collection("restaurants").doc(this.state.order[i].restName).collection("orders").add({
		   	itemName: this.state.order[i].name,
	  		quantity: this.state.order[i].quantity,
	  		fulfilled: false,
	  		username: this.state.username,
		});
		firestoreDB.collection("users").doc(this.state.username).collection("orders").add({
		   	itemName: this.state.order[i].name,
	  		quantity: this.state.order[i].quantity,
	  		fulfilled: false,
	  		restaurant: this.state.order[i].restName,
		});
  	}
  }

  turnModalOn = (name, image, address, watchers, time, dist) =>{
    if (name == "Dulce Cafe")
      name = "Dulce"

    this.getItems(name);
    var sz =0;
    firestoreDB.collection("restaurants").doc(name).collection("orders").get().then(snap => {
   		sz = snap.size +1;// will return the collection size
   		this.setState({orderNumb: sz});
	});

    this.setState({openModal:true, modalRest: name, modalImage: image, modalAddress: address, modalWatching: watchers, modalTime: time, modalDist: dist, checkoutOpacity: 0, openCheckout: false, checkoutButtonOpacity: 0, placeOrderColor: '#8134FF', totalSavings: 0, orderTotal: 0});
    this.setState({order: []});
  }

  turnModalOff = () =>{
    this.setState({openModal:false});
    this.setState({openOrder: false});
  }
  goToProfile = () => {
    console.log("ugh");
    this.props.navigation.navigate('Profile');
  }
}

const styles = StyleSheet.create({
  timeHeader: {
    marginLeft: 0.05 * screenWidth,
    fontSize: 18,
    // fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: 'bold',
  },
  timeHeaderLive: {
    marginLeft: 0.05 * screenWidth,
    fontSize: 18,
    // fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: 'bold',
    color: '#8134FF'
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
    backgroundColor: '#FFFFFF',
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
    width: '60%' // is 50% of container width
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
    alignItems: 'flex-start'
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
    marginTop: "22%"
  },
  modalTimeLive:
  {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: "4%",
    marginTop: "22%",
    color: '#8134FF'
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

  },
  signText:
  {
    color: '#FFFFFF',
    fontSize: 18,
    top: 35,
  },
  addText:
  {
    fontSize: 11,
    color: '#FFFFFF',
    marginTop: 60,
    fontWeight: "bold",

  },
  checkOutButton:
  {
    fontSize: 20,
    bottom: '15%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#8134FF',
    height: 40,
    width: '80%',
    marginLeft: '10%',
    borderRadius: 12
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
  	width: '1.2%',
  	backgroundColor: '#8134FF',
  	position: 'absolute',
  	left: 0,
  },
});
