import React, {useState} from 'react'
import { View, TextInput, Image, Button, TouchableOpacity, Text } from 'react-native'
import firestore from '@react-native-firebase/firestore'
import storage from '@react-native-firebase/storage'
import auth from '@react-native-firebase/auth'
import { NavigationContainer } from '@react-navigation/native'

export default function Save(props) {
    const [caption, setCaption] = useState("");
    const childPath = `post/${auth().currentUser.uid}/${Math.random().toString(36)}`
    console.log(childPath)

    const uploadImage = async () => {
        const uri = props.route.params.image;
        const response = await fetch(uri);
        const blob = await response.blob();

        const task = 
            storage()
            .ref()
            .child(childPath)
            .put(blob);

        const taskProgress = snapshot => {
            console.log(`transferred: ${snapshot.bytesTransferred}`)
        }

        const taskCompleted = () => {
            task.snapshot.ref.getDownloadURL().then((snapshot) => {
                savePostData(snapshot);
                console.log(snapshot)
            })
        }

        const taskError = snapshot => {
            console.log(snapshot)
        }

        task.on("state_changed", taskProgress, taskError, taskCompleted);
    }

    const savePostData = (downloadURL) => {
        firestore()
        .collection('posts')
        .doc(auth().currentUser.uid)
        .collection('userPosts')
        .add({
            downloadURL,
            caption,
            creation: firestore.FieldValue.serverTimestamp()
        })
        .then((function () {
            props.navigation.popToTop()
        }))
    }

    return (
        <View style={{flex: 1}}>
            <Image source={{uri: props.route.params.image}}/>
            <TextInput
                style={{marginHorizontal: 10}}
                multiline = {true}
                numberOfLines={5}
                placeholder="Bạn đang nghĩ gì?"
                onChangeText={(caption) => setCaption(caption)}
            />
            <TouchableOpacity 
                    onPress={() => uploadImage()}
                    style={{
                        marginTop: 10, 
                        borderWidth: 1, 
                        borderColor: '#F83F17',
                        alignSelf: 'center', 
                        borderRadius: 10,
                        paddingHorizontal: 140,
                        paddingVertical: 10,
                        backgroundColor: '#F83F17'
                    }}
                >
                    <Text style={{color: 'white'}}>ĐĂNG</Text>
                </TouchableOpacity>
        </View>
    )
}
