import React, { Component } from 'react'
import { Text, View, TextInput, Button, Alert} from 'react-native'
import auth, {firebase} from '@react-native-firebase/auth'

export class Login extends Component {
    constructor(props){
        super(props);

        this.state = {
            email: '',
            password: ''
        }

        this.onSignIn = this.onSignIn.bind(this)
    }

    onSignIn(){
        const { email, password} = this.state;
        auth()
        .signInWithEmailAndPassword(email, password)
        .then((result) => {
            console.log(result);
        })
        .catch((error) => {
            console.log(error);
        });
    }

    render() {
        return (
            <View>
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
                    onPress = {() => this.onSignIn()}
                    title = "Đăng Nhập"
                />
            </View>
        )
    }
}

export default Login
