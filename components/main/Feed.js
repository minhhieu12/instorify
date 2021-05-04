import React, {useState, useEffect} from 'react';
import {RefreshControl, SafeAreaView, ScrollView, StyleSheet, View, Text, Image, FlatList, Button, MaskedViewComponent} from 'react-native';
import {IconButton} from 'react-native-paper'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Moment from 'moment'

import Spinner from 'react-native-loading-spinner-overlay';

import {connect} from 'react-redux';

const wait = (timeout) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

function Feed(props) {
  const [userPosts, setPosts] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false); 

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);

    //const [posts, setPosts] = useState([]); 
  useEffect(() => {
    let posts = []; 
    //if (props.usersFollowingLoaded == props.following.length) {
      for (let i = 0; i < props.users.length; i++) {
        // const user = props.users.find(el => {console.log(el.uid); return el.uid === props.following[i]; });
        const user = props.users[i];
        if (user != undefined) {
          posts = [...posts, ...user.posts];
        }
      }

      posts.sort(function (x, y) {
        return x.creation - y.creation;
      });

      console.log("POSTS:       ", posts);

      setPosts(posts);
      return () => setLoading(false);
    //}
  }, []);

    // useEffect(() => {
    //     if (props.usersFollowingLoaded == props.following.length && props.following.length !== 0) {
    //         props.feed.sort(function (x, y) {
    //             return x.creation - y.creation;
    //         })
    //         setPosts(props.feed);
    //     }
    //     console.log(posts)

    // }, [props.usersFollowingLoaded, props.feed])
    
  const {currentUser, usersFollowingLoaded} = props;
  console.log({currentUser, userPosts});
  return (  
    isLoading ? <View><Text>Loading</Text></View> :
    <View style={styles.container}>
          <View style={styles.containerGallery}>
            <FlatList
              numColumns={1}
              horizontal={false}
              data={userPosts}
              renderItem={({item}) => (
                <View style={styles.containerImage}>
                    <View style={{flex: 1, flexDirection: 'row', marginLeft: 10}}>
                        <MaterialCommunityIcons name="account-circle-outline" size={26}/>
                        <Text style={{marginLeft: 5}}>{item.user.name}</Text>
                    </View> 
                    <Image style={styles.image} source={{uri: item.downloadURL}} />
                    <Text style={{marginLeft: 10}}>{item.caption}</Text>
                    <Text style={{marginLeft: 10, color: 'gray'}}>{Moment(item.creation).format('DD-MM-yyyy')}</Text>
                    <View style={{flex: 1, flexDirection: 'row'}}> 
                        <IconButton
                            icon="heart"
                            color="red"
                        />
                        <IconButton
                            icon="comment"
                            onPress={() =>
                                props.navigation.navigate('Comment', {
                                    postId: item.id,
                                    uid: item.user.uid,
                                })}
                        />
                    </View>
                </View>
              )}
            />
          </View>
        </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerInfo: {
    margin: 20,
  },
  containerGallery: {
    flex: 1,
    marginTop: 10
  },
  image: {
    flex: 1,
    aspectRatio: 1 / 1,
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 10
  },
  containerImage: {
    flex: 1 / 1, 
  },
});

const mapStateToProps = store => ({
  currentUser: store.useState.currentUser,
  following: store.useState.following,
  users: store.usersState.users,
//   feed: store.usersState.feed,
  usersFollowingLoaded: store.usersState.usersFollowingLoaded,
});

export default connect(mapStateToProps, null)(Feed);
