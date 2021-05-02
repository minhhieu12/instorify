import React, { Component } from 'react'
import { Text, View, TextInput, Button, Alert, Image, TouchableOpacity} from 'react-native'
import auth, {firebase} from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'

export class Register extends Component {
    constructor(props){
        super(props);

        this.state = {
            email: '',
            password: '',
            name: ''
        }

        this.onSignUp = this.onSignUp.bind(this)
    }

    onSignUp(){
        const { email, password, name } = this.state;
        auth()
        .createUserWithEmailAndPassword(email, password)
        .then(() => {
            firestore().collection("users")
                .doc(auth().currentUser.uid)
                .set({
                    name,
                    email
                })
            console.log('User account created & signed in!');
            Alert.alert(
                "Thông báo",
                "Tạo tài khoản thành công!",
                [
                  {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                  },
                  { text: "OK", onPress: () => console.log("OK Pressed") }
                ]
            );
        })
        .catch(error => {
            if (error.code === 'auth/email-already-in-use') {
            console.log('That email address is already in use!');
            Alert.alert(
                "Thông báo",
                "Email đã được sử dụng!",
                [
                  {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                  },
                  { text: "OK", onPress: () => console.log("OK Pressed") }
                ]
            );
            }

            if (error.code === 'auth/invalid-email') {
            console.log('That email address is invalid!');
            Alert.alert(
                "Thông báo",
                "Email không hợp lệ!",
                [
                  {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                  },
                  { text: "OK", onPress: () => console.log("OK Pressed") }
                ]
            );
            }

            console.error(error);
        });
    }

    render() {
        return (
            <View>
                <Image
                    style={{width: 100, height: 100, alignSelf: 'center', marginTop: 90}}
                    source={require('../img/logo.png')}
                />
                <Text style={{alignSelf: 'center', fontSize: 30, fontWeight: 'bold'}}>ĐĂNG KÝ</Text>
                <TextInput
                    style={{
                        marginHorizontal: 20,
                        marginTop: 20,
                        borderWidth: 1,
                        borderRadius: 10,
                        paddingHorizontal: 10,
                        borderColor: 'grey'
                    }}
                    placeholder = "Tên tài khoản"
                    onChangeText={(name) => this.setState({name})}
                />
                <TextInput
                    style={{
                        marginHorizontal: 20,
                        marginTop: 10,
                        borderWidth: 1,
                        borderRadius: 10,
                        paddingHorizontal: 10,
                        borderColor: 'grey'
                    }}
                    placeholder = "Email"
                    onChangeText={(email) => this.setState({email})}
                />
                <TextInput
                    style={{
                        marginHorizontal: 20,
                        marginTop: 10,
                        borderWidth: 1,
                        borderRadius: 10,
                        paddingHorizontal: 10,
                        borderColor: 'grey',
                        marginBottom: 10
                    }}
                    placeholder = "Mật khẩu"
                    secureTextEntry = {true}
                    onChangeText={(password) => this.setState({password})}
                />
                <TouchableOpacity 
                    onPress = {() => this.onSignUp()}
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
                    <Text style={{color: 'white'}}>ĐĂNG KÝ</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

export default Register
