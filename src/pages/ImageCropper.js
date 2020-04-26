/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Image,
  Button,
} from 'react-native';
import axios from 'axios';
import StorageAPI from '../api/StorageAPI';
import ImagePicker from 'react-native-image-picker';

const ImageCropper = () => {
  const [img, setImg] = useState({
    filePath: {
      data: '',
      uri: '',
    },
    fileData: '',
    fileUri: '',
    fileName: '',
  });

  const options = {
    title: 'Select Image From',
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
    rotation: 90,
    quality: 1,
    mediaType: 'photo',
  };

  const imageShow = () => {
    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = {uri: response.uri};

        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };

        setImg({
          filePath: response,
          fileData: response.data,
          fileUri: response.uri,
          fileName: response.fileName,
        });
      }
    });
  };

  const cameraHandler = () => {
    ImagePicker.launchCamera(options, (response) => {
      // console.log('response', JSON.stringify(response));

      // const source = {uri: response.uri};
      console.log(response.fileName);
      setImg({
        filePath: response,
        fileData: response.data,
        fileUri: response.uri,
        fileName: response.fileName,
      });
    });
  };

  const galleryHandler = () => {
    ImagePicker.launchImageLibrary(options, (response) => {
      // console.log(response);
      console.log(response.fileName);
      setImg({
        filePath: response,
        fileData: response.data,
        fileUri: response.uri,
        fileName: response.fileName,
      });
    });
  };

  const renderFileData = () => {
    if (img.fileData) {
      return (
        <Image
          source={{uri: 'data:image/jpeg;base64, ' + img.fileData}}
          style={styles.image}
        />
      );
    } else {
      return (
        <Image source={require('../assets/camera.png')} style={styles.image} />
      );
    }
  };

  const renderFileUri = () => {
    if (img.fileUri) {
      return <Image source={{uri: img.fileUri}} style={styles.image} />;
    } else {
      return (
        <Image source={require('../assets/gallery.png')} style={styles.image} />
      );
    }
  };

  const upload = async () => {
    await StorageAPI.post('/pictures/upload', {
      params: {
        userID: 'TK-SHP-098765',
      },
      data: {
        file: img.fileUri,
      },
    })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignSelf: 'center',
                marginTop: 50,
              }}>
              <View style={{alignItems: 'center'}}>
                {renderFileData()}
                <Text>base64 String</Text>
              </View>
              <View style={{alignItems: 'center'}}>
                {renderFileUri()}
                <Text>File Uri</Text>
              </View>
            </View>

            <TouchableOpacity onPress={cameraHandler} style={styles.button}>
              <Text style={styles.buttonText}>Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={galleryHandler} style={styles.button}>
              <Text style={styles.buttonText}>Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={imageShow} style={styles.button}>
              <Text style={styles.buttonText}>Choose from file</Text>
            </TouchableOpacity>
            <Text>fileUri : {img.fileUri}</Text>
            <Text>fileName : {img.fileName}</Text>
          </View>
          <View style={{margin: 10}}>
            <Button title="Upload" onPress={upload} />
          </View>
          <View>
            <Text style={{fontSize: 20}}>DIBAWAH INI IMAGE CROPPER</Text>

          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    margin: 10,
    backgroundColor: 'grey',
    justifyContent: 'center',
    alignItems: 'center',
    width: 200,
    alignSelf: 'center',
    height: 80,
    borderRadius: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 24,
  },
  image: {
    width: 150,
    height: 150,
    backgroundColor: 'grey',
  },
});

export default ImageCropper;
