import React, { Component } from 'react'
import {View, Text, Button} from 'react-native'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import auth, {firebase} from '@react-native-firebase/auth'

import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import rootReducer from './redux/reducers'
import thunk from 'redux-thunk'
const Store = createStore(rootReducer, applyMiddleware(thunk));

import LandingScreen from './components/auth/Landing'
import RegisterScreen from './components/auth/Register'
import LoginScreen from './components/auth/Login'
import MainScreen from './components/Main'
import AddScreen from './components/main/Add'
import SaveScreen from './components/main/Save'

const Stack = createStackNavigator();

export class App extends Component{
  constructor(props){
    super(props);
    this.state={
      loaded: false,
    }
  }

  componentDidMount(){
    auth().onAuthStateChanged((user) => {
      if(!user){
        this.setState({
          loggedIn: false,
          loaded: true
        })
      } else {
        this.setState({
          loggedIn: true,
          loaded: true,
        })
      }
    })
  }

  render(){
    const {loggedIn, loaded} = this.state
    if(!loaded){
      return(
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text>Loading</Text>
        </View>
      )
    }
    if(!loggedIn){
      return(
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Landing">
              <Stack.Screen name="Landing" component={LandingScreen} options={{ headerShown: false}}/>
              <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false}}/>
              <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false}}/>
            </Stack.Navigator>
        </NavigationContainer>
      )
    } else {
      return(
        <Provider store={Store}>
            <NavigationContainer>
              <Stack.Navigator initialRouteName="Main">
                <Stack.Screen name="Main" component={MainScreen} options={{ headerShown: false}}/>
                <Stack.Screen name="Add" component={AddScreen} navigation={this.props.navigation}/>
                <Stack.Screen name="Save" component={SaveScreen} navigation={this.props.navigation}/>
              </Stack.Navigator>
            </NavigationContainer>
        </Provider>
      )
    }

    
    
  }
}

export default App