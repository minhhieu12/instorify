import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, Image, FlatList, Button, TouchableOpacity } from 'react-native'
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {connect} from 'react-redux'

function Profile(props) {
    const [userPost, setUserPosts] = useState([]);
    const [user, setUser] = useState(null);
    const [following, setFollowing] = useState(false)

    useEffect(() => {
        const {currentUser, posts} = props;
        console.log({currentUser, posts})

        if(props.route.params.uid === auth().currentUser.uid){
            setUser(currentUser)
            setUserPosts(posts)
        }
        else{
            firestore()
            .collection("users")
            .doc(props.route.params.uid)
            .get()
            .then((snapshot) => {
                if(snapshot.exists){
                    setUser(snapshot.data());                    
                } else {
                    console.log("Không tồn tại")
                }
            })

            firestore()
            .collection("posts")
            .doc(props.route.params.uid)
            .collection("userPosts")
            .orderBy("creation", "asc")
            .get()
            .then((snapshot) => { 
                let posts = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return{id, ...data}
                }) 
                console.log(posts)
                setUserPosts(posts)
            })
        }

        if(props.following.indexOf(props.route.params.uid) > -1){
            setFollowing(true);
        } else {
            setFollowing(false);
        }
    }, [props.route.params.uid, props.following])

    const onFollow = () => {
        firestore()
        .collection("following")
        .doc(auth().currentUser.uid)
        .collection("userFollowing")
        .doc(props.route.params.uid)
        .set({})
    }
    const onUnfollow = () => {
        firestore()
        .collection("following")
        .doc(auth().currentUser.uid)
        .collection("userFollowing")
        .doc(props.route.params.uid)
        .delete()
    }

    const onLogout = () => {
        auth().signOut();
    }

    if(user === null){
        return(
            <View/>
        )
    }

    const {currentUser, posts} = props;
    console.log({currentUser, posts})
    return (
        <View style={styles.container}>
            <View style={styles.containerInfo}>
                <MaterialCommunityIcons name="account-circle" size={80} style={{alignSelf: 'center'}}/>
                <Text style={{alignSelf: 'center', fontSize: 20}}>{user.name}</Text>
                <Text style={{alignSelf: 'center', marginBottom: 10, color: 'gray'}}>{user.email}</Text>

                {props.route.params.uid !== auth().currentUser.uid ? (
                    <View>
                        {following ? (
                            <TouchableOpacity 
                                onPress={() => onUnfollow()}
                                style={{
                                    marginTop: 10, 
                                    borderWidth: 1, 
                                    borderColor: '#F83F17',
                                    alignSelf: 'center', 
                                    borderRadius: 10,
                                    width: 340,
                                    paddingVertical: 10,
                                    backgroundColor: '#F83F17'
                                }}
                            >
                                <Text style={{color: 'white', alignSelf: 'center'}}>Đã theo dõi</Text>
                            </TouchableOpacity>
                            // <Button
                            //     title="Following"
                            //     onPress={() => onUnfollow()}
                            // />
                        ) : 
                        (
                            <TouchableOpacity 
                                onPress={() => onFollow()}
                                style={{
                                    marginTop: 10, 
                                    borderWidth: 1, 
                                    borderColor: '#F83F17',
                                    alignSelf: 'center', 
                                    borderRadius: 10,
                                    width: 340,
                                    paddingVertical: 10,
                                    backgroundColor: '#F83F17'
                                }}
                            >
                                <Text style={{color: 'white', alignSelf: 'center'}}>Theo dõi</Text>
                            </TouchableOpacity>
                            // <Button
                            //     title="Follow"
                            //     onPress={() => onFollow()}
                            // />
                        )}
                    </View>
                ) : 
                    <TouchableOpacity 
                        onPress={() => onLogout()}
                        style={{
                            marginTop: 10, 
                            borderWidth: 1, 
                            borderColor: '#F83F17',
                            alignSelf: 'center', 
                            borderRadius: 10,
                            width: 340,
                            paddingVertical: 10,
                            backgroundColor: '#F83F17',
                        }}
                    >
                        <Text style={{color: 'white', alignSelf: 'center'}}>Đăng xuất</Text>
                    </TouchableOpacity>            
                    // <Button
                    //     title="Logout"
                    //     onPress={() => onLogout()}
                    // />
                }
            </View>
            <View style={styles.containerGallery}>
                <FlatList
                    numColumns={3}
                    horizontal={false}
                    data={userPost}
                    renderItem={({item}) => (
                        <View style={styles.containerImage}>
                            <Image
                                style={styles.image}
                                source={{uri: item.downloadURL}}
                            />
                        </View>
                    )}
                />
            </View>
        </View>
        
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1
    },
    containerInfo:{
        marginTop: 10,
        marginHorizontal: 20
    },
    containerGallery:{
        flex: 1,
        marginTop: 10
    },
    image:{
        flex: 1,
        aspectRatio: 1/1,
        margin: 1
    },
    containerImage:{
        flex: 1/3
    }
})

const mapStateToProps = (store) => ({
    currentUser: store.useState.currentUser,
    posts: store.useState.posts,
    following: store.useState.following
})

export default connect(mapStateToProps, null)(Profile);