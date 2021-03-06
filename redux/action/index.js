import {
  USER_STATE_CHANGE,
  USER_POSTS_STATE_CHANGE,
  USER_FOLLOWING_STATE_CHANGE,
  USERS_DATA_STATE_CHANGE,
  USERS_POSTS_STATE_CHANGE,
  CLEAR_DATA,
} from '../constants/index';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

export function clearData() {
  return dispatch => {
    dispatch({type: CLEAR_DATA});
  };
}

export function fetchUser() {
  return dispatch => {
    firestore()
      .collection('users')
      .doc(auth().currentUser.uid)
      .get()
      .then(snapshot => {
        if (snapshot.exists) {
          dispatch({type: USER_STATE_CHANGE, currentUser: snapshot.data()});
        } else {
          console.log('Không tồn tại');
        }
      });
  };
}

export function fetchUserPosts() {
  return dispatch => {
    firestore()
      .collection('posts')
      .doc(auth().currentUser.uid)
      .collection('userPosts')
      .orderBy('creation', 'desc')
      .get()
      .then(snapshot => {
        let posts = snapshot.docs.map(doc => {
          const data = doc.data();
          const id = doc.id;
          return {id, ...data};
        });
        console.log(posts);
        dispatch({type: USER_POSTS_STATE_CHANGE, posts});
      });
  };
}

export function fetchUserFollowing() {
  return dispatch => {
    firestore()
      .collection('following')
      .doc(auth().currentUser.uid)
      .collection('userFollowing')
      .onSnapshot(snapshot => {
        let following = snapshot.docs.map(doc => {
          const id = doc.id;
          return id;
        });
        console.log(following);
        dispatch({type: USER_FOLLOWING_STATE_CHANGE, following});
        for (let i = 0; i < following.length; i++) {
          dispatch(fetchUsersData(following[i], true));
        }
      });
  };
}

export function fetchUsersData(uid, getPosts) {
  return (dispatch, getState) => {
    const found = getState().usersState.users.some(el => el.uid === uid);

    if (!found) {
      firestore()
        .collection('users')
        .doc(uid)
        .get()
        .then(snapshot => {
          if (snapshot.exists) {
            let user = snapshot.data();
            user.uid = snapshot.id;
            dispatch({type: USERS_DATA_STATE_CHANGE, user});
          } else {
            console.log('Không tồn tại');
          }
        });
      if (getPosts) {
        dispatch(fetchUsersFollowingPosts(uid));
      }
    }
  };
}

export function fetchUsersFollowingPosts(uid) {
  return (dispatch, getState) => {
    firestore()
      .collection('posts')
      .doc(uid)
      .collection('userPosts')
      .orderBy('creation', 'desc')
      .get()
      .then(snapshot => {   
        console.log('Hieuuuuuuuuuuuuuuuuuuuu: ', snapshot);

        // const childUid = snapshot.query.EP.path.segments[1];
        const childUid = snapshot.docs[0].ref.path.split('/')[1];
        console.log({snapshot, childUid});

        const user = getState().usersState.users.find(el => el.uid === childUid);

        let posts = snapshot.docs.map(doc => {
          const data = doc.data();
          const id = doc.id;
          return {id, ...data, user};
        });
        console.log(posts);
        dispatch({type: USERS_POSTS_STATE_CHANGE, posts, uid});
        console.log(getState());
      });
  };
}
