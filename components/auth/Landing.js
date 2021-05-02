import React from 'react'
import { Text, View, Button, Image, TouchableOpacity } from 'react-native'

export default function Landing({navigation}) {
    return (
        <View style={{flex: 1, marginTop: 100}}>
            <Image
                style={{width: 150, height: 150, alignSelf: 'center'}}
                source={require('../img/logo.png')}
            />
            <Text style={{alignSelf: 'center', fontSize: 30, fontWeight: 'bold'}}>Instorify</Text>

            <TouchableOpacity 
                onPress = {() => navigation.navigate("Register")}
                style={{
                    marginTop: 20, 
                    borderWidth: 1, 
                    borderColor: '#F83F17',
                    alignSelf: 'center', 
                    borderRadius: 10,
                    paddingHorizontal: 150,
                    paddingVertical: 10,
                    backgroundColor: '#F83F17'
                }}
            >
                <Text
                style={{color: 'white'}}>ĐĂNG KÝ</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                onPress = {() => navigation.navigate("Login")}
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
                <Text
                style={{color: 'white'}}>ĐĂNG NHẬP</Text>
            </TouchableOpacity>
            <Text style={{alignSelf: 'center', marginTop: 270}}>Made by HDTeam with &#10084;</Text>
        </View>
        
    )
}
