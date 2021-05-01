import React, { Component } from 'react'
import { Text, View, TextInput, Button, Alert} from 'react-native'
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
                <TextInput
                    placeholder = "Tên tài khoản"
                    onChangeText={(name) => this.setState({name})}
                />
                <TextInput
                    placeholder = "Email"
                    onChangeText={(email) => this.setState({email})}
                />
                <TextInput
                    placeholder = "MậT khẩu"
                    secureTextEntry = {true}
                    onChangeText={(password) => this.setState({password})}
                />
                <Button
                    onPress = {() => this.onSignUp()}
                    title = "Đăng Ký"
                />
            </View>
        )
    }
}

export default Register
