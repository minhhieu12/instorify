'use strict';
import { NavigationContainer } from '@react-navigation/native';
import React, { useState ,PureComponent } from 'react';
import { AppRegistry, StyleSheet, Text, TouchableOpacity, View, Image, ImageBackground } from 'react-native';
import { RNCamera } from 'react-native-camera';
import ImagePicker from 'react-native-image-picker'

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function Add({ navigation }) {
  const [camera, setCamera] = useState(null);
  const [image, setImage] = useState(null);
  const [response, setResponse] = React.useState(null);

  const takePicture = async () => {
    if (camera) {
      const data = await camera.takePictureAsync(null);
      setImage(data.uri);
    }
  };

  const pickImage = async () => {
    ImagePicker.launchImageLibrary(
      {
        mediaType: 'photo',
        includeBase64: false,
        maxHeight: 200,
        maxWidth: 200,
      },
      (response) => {
        setResponse(response);
      },)
  };

  return (
    <View style={styles.container}>
      <RNCamera
        ref={ref => setCamera(ref)}
        style={styles.preview}
        type={RNCamera.Constants.Type.back}
        flashMode={RNCamera.Constants.FlashMode.off}
        androidCameraPermissionOptions={{
          title: 'Permission to use camera',
          message: 'We need your permission to use your camera',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}
        androidRecordAudioPermissionOptions={{
          title: 'Permission to use audio recording',
          message: 'We need your permission to use your audio',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}
        onGoogleVisionBarcodesDetected={({ barcodes }) => {
          console.log(barcodes);
        }}
      />
      
      <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
        <TouchableOpacity onPress={takePicture.bind(this)} style={styles.capture}>
          <MaterialCommunityIcons name='camera' size={26}></MaterialCommunityIcons>
        </TouchableOpacity>
        <TouchableOpacity onPress={pickImage.bind(this)} style={styles.capture}>
          <MaterialCommunityIcons name='image' size={26}></MaterialCommunityIcons>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Save', {image})} style={styles.capture}>
          <MaterialCommunityIcons name='content-save' size={26}></MaterialCommunityIcons>
        </TouchableOpacity>
      </View>
      {image && <Image source={{uri: image}} style={{flex: 0.5}}/>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  preview: {
    flex: 0.5,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
});

AppRegistry.registerComponent('App', () => Add);
