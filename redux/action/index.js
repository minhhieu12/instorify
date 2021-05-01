import {USER_STATE_CHANGE, USER_POSTS_STATE_CHANGE} from '../constants/index'
import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'

export function fetchUser(){
    return((dispatch) => {
        firestore()
        .collection("users")
        .doc(auth().currentUser.uid)
        .get()
        .then((snapshot) => {
            if(snapshot.exists){
                dispatch({type: USER_STATE_CHANGE, currentUser: snapshot.data()})
            } else {
                console.log("Không tồn tại")
            }
        })
    })
}

export function fetchUserPosts(){
    return((dispatch) => {
        firestore()
        .collection("posts")
        .doc(auth().currentUser.uid)
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
            dispatch({type: USER_POSTS_STATE_CHANGE, posts})
        })
    })
}