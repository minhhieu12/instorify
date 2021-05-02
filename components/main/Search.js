import React, {useState} from 'react'
import { View, Text, TextInput, FlatList, TouchableOpacity } from 'react-native'

import firestore from '@react-native-firebase/firestore'
import { green100 } from 'react-native-paper/lib/typescript/styles/colors'

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function Search(props) {
    const [users, setUsers] = useState([])

    const fetchUsers = (search) => {
        firestore()
        .collection('users')
        .where('name', '>=', search)
        .get()
        .then((snapshot) => {
            let users = snapshot.docs.map(doc => {
                const data = doc.data();
                const id = doc.id;
                return { id, ...data }
            });
            setUsers(users);
        })
    }

    return (
        <View>
            <View style={{marginTop: 5 ,flexDirection: 'row', borderWidth: 1, borderRadius: 10, marginHorizontal: 10, borderColor: 'lightgray'}}>
                <MaterialCommunityIcons name="magnify" size={26} style={{marginTop: 10, marginLeft: 5}}/>
                <TextInput
                    placeholder="Bạn muốn tìm ai?"
                    onChangeText={(search) => fetchUsers(search)}
                />
            </View>
            

            <FlatList
                numColumns={1}
                horizontal={false}
                data={users}
                style={{marginHorizontal: 10}}
                renderItem={({item}) => (
                    <TouchableOpacity
                        onPress={() => props.navigation.navigate("Profile", {uid: item.id})}
                    >
                        <Text 
                            style={{
                                marginTop: 10, 
                                borderWidth: 1, 
                                borderRadius: 10,
                                borderColor: "#F83F17",
                                paddingHorizontal: 10,
                                paddingVertical: 10,
                                backgroundColor: '#F83F17',
                                color: 'white'
                            }}>{item.name}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    )
}