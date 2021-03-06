import React, {Component} from 'react';
import {View, Text, Button, Image} from 'react-native';
import auth, {firebase} from '@react-native-firebase/auth';

import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {
  fetchUser,
  fetchUserPosts,
  fetchUserFollowing,
  clearData,
} from '../redux/action/index';

import FeedScreen from '../components/main/Feed';
import ProfileScreen from '../components/main/Profile';
import SearchScreen from '../components/main/Search';

const Tab = createMaterialBottomTabNavigator();

const EmptyScreen = () => {
  return null;
};

const customTabBarStyle = {
  activeTintColor: '#0091EA',
  inactiveTintColor: 'gray',
  style: {backgroundColor: 'white' },
}

export class Main extends Component {
  componentDidMount() {
    this.props.fetchUser();
    this.props.fetchUserPosts();
    this.props.fetchUserFollowing();
    this.props.clearData();
  }
  render() {
    return (
      <Tab.Navigator initialRouteName="Feed" labeled={false} barStyle={{backgroundColor: "#F83F17"}}>
        <Tab.Screen
          name="Feed"
          component={FeedScreen}
          options={{
            tabBarIcon: ({color, size}) => (
              <MaterialCommunityIcons name="home" color={color} size={26} />
            ),
          }}
        />
        <Tab.Screen
          name="Search"
          component={SearchScreen}
          navigation={this.props.navigation}
          options={{
            tabBarIcon: ({color, size}) => (
              <MaterialCommunityIcons name="magnify" color={color} size={26} />
            ),
          }}
        />
        <Tab.Screen
          name="AddContainer"
          component={EmptyScreen}
          listeners={({navigation}) => ({
            tabPress: event => {
              event.preventDefault();
              navigation.navigate('Add');
            },
          })}
          options={{
            tabBarIcon: ({color, size}) => (
              <MaterialCommunityIcons
                name="plus-circle-outline"
                color={color}
                size={26}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          listeners={({navigation}) => ({
            tabPress: event => {
              event.preventDefault();
              navigation.navigate('Profile', {uid: auth().currentUser.uid});
            },
          })}
          options={{
            tabBarIcon: ({color, size}) => (
              <MaterialCommunityIcons
                name="account-circle-outline"
                color={color}
                size={26}
              />
            ),
          }}
        />
      </Tab.Navigator>
    );
  }
}

const mapStateToProps = store => ({
  currentUser: store.useState.currentUser,
});
const mapDispatchProps = dispatch =>
  bindActionCreators(
    {fetchUser, fetchUserPosts, fetchUserFollowing, clearData},
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchProps)(Main);
