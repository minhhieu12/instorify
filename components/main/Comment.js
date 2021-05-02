import React, {useState, useEffect} from 'react'
import {View, Text, FlatList, Button, TextInput, TouchableOpacity} from 'react-native' 

import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'

import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {fetchUsersData} from '../../redux/action/index'

function Comment(props) {
    const [comments, setComments] = useState([])
    const [postId, setPostId] = useState("")
    const [text, setText] = useState("")

    useEffect(() => {

        function matchUserToComment(comments){
            for(let i=0; i<comments.length; i++){
                if(comments[i].hasOwnProperty('user')){
                    continue;
                }

                const user = props.users.find(x => x.uid === comments[i].creator)
                if(user == undefined){
                    props.fetchUsersData(comments[i].creator, false)
                } else {
                    comments[i].user = user
                }
            }
            setComments(comments)
        }

        if(props.route.params.postId !== postId){
            firestore()
            .collection('posts')
            .doc(props.route.params.uid)
            .collection('userPosts')
            .doc(props.route.params.postId)
            .collection('comments')
            .get()
            .then((snapshot) => {
                let comments = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return {id, ...data}
                })
                matchUserToComment(comments)
            })
            setPostId(props.route.params.postId)
        } else {
            matchUserToComment(comments)
        }

    }, [props.route.params.postId, props.users])

    const onCommentSend = () => {
        firestore()
            .collection('posts')
            .doc(props.route.params.uid)
            .collection('userPosts')
            .doc(props.route.params.postId)
            .collection('comments')
            .add({
                creator: auth().currentUser.uid,
                text
            })
    }

    return (
        <View>
            <FlatList
                numColumns={1}
                horizontal={false}
                data={comments}
                renderItem={({item}) => (
                    <View>
                        {item.user !== undefined ?
                            <Text>
                                {item.user.name}
                            </Text>
                        : null}
                        <Text>
                            {item.text}
                        </Text>
                    </View>
                )}
            />
            <View>
            <TextInput
                style={{marginHorizontal: 10}}
                placeholder="Bình luận..."
                onChangeText={(text) => setText(text)}
            />
            <TouchableOpacity 
                    onPress={() => onCommentSend()}
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
                    <Text style={{color: 'white'}}>Gửi</Text>
            </TouchableOpacity>
            </View>
        </View>
    )
}

const mapStateToProps = (store) => ({
    users: store.usersState.users
})
const mapDispatchProps = (dispatch) => bindActionCreators({fetchUsersData}, dispatch);

export default connect(mapStateToProps, mapDispatchProps)(Comment);