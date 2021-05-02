import React, { Component } from 'react'
import { Text, View, TextInput, Button, Alert, Image, TouchableOpacity} from 'react-native'
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
                <Image
                    style={{width: 100, height: 100, alignSelf: 'center', marginTop: 90}}
                    source={require('../img/logo.png')}
                />
                <Text style={{alignSelf: 'center', fontSize: 30, fontWeight: 'bold'}}>ĐĂNG NHẬP</Text>
                <TextInput
                    style={{
                        marginHorizontal: 20,
                        marginTop: 20,
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
                    onPress = {() => this.onSignIn()}
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
                    <Text style={{color: 'white'}}>ĐĂNG NHẬP</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

export default Login
