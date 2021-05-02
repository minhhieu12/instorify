import React, {useState} from 'react'
import { View, Text, TextInput, FlatList, TouchableOpacity } from 'react-native'

import firestore from '@react-native-firebase/firestore'
import { green100 } from 'react-native-paper/lib/typescript/styles/colors'

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
            <TextInput
                placeholder="Bạn muốn tìm ai?"
                onChangeText={(search) => fetchUsers(search)}
            />

            <FlatList
                numColumns={1}
                horizontal={false}
                data={users}
                style={{marginHorizontal: 10}}
                renderItem={({item}) => (
                    <TouchableOpacity
                        onPress={() => props.navigation.navigate("Profile", {uid: item.id})}
                    >
                        <Text style={{marginTop: 10, backgroundColor: "#fff"}}>{item.name}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    )
}