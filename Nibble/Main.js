import * as React from 'react';

import { View, Text, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {AsyncStorage} from 'react-native';


 function HomeScreen(props) {
   const { navigation } = props
   React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitleStyle: {
            fontWeight: 'bold',
          },
    });a
  }, [navigation]);

  return (
      // Error saving data

    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>UGH</Text>
      <Button
          title="Press me"
          onPress={() => navigation.navigate('Details')}/>
    </View>
  );
}
export default HomeScreen;
