/* eslint-disable react-native/no-inline-styles */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState, createRef} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Image,
  Button,
  FlatList,
} from 'react-native';
import axios from 'axios';
import StorageAPI from '../api/StorageAPI';
import ImageCropPicker from 'react-native-image-crop-picker';
import ActionSheet from 'react-native-actions-sheet';

const actionSheetRef = createRef();

const ImageCropper = () => {
  const [cropperSingle, setCropperSingle] = useState([]);

  const cameraCropperHandler = () => {
    ImageCropPicker.openCamera({
      cropping: true,
      useFrontCamera: true,
      cropperStatusBarColor: '#19B2FF',
      cropperToolbarColor: '#19B2FF',
      cropperToolbarTitle: 'Choose Image',
    }).then((image) => {
      console.log(image);
      setCropperSingle([
        ...cropperSingle,
        {
          key: (Math.random() + 1).toString(),
          uri: image.path,
        },
      ]);
    });

    // const abc = cropperSingle.map((val) => val.value);
    // setStateFoto({
    //   ...stateFoto,
    //   fotonya: abc,
    // });
  };

  const galleryCropperHandler = () => {
    ImageCropPicker.openPicker({
      cropping: true,
      cropperStatusBarColor: '#19B2FF',
      cropperToolbarColor: '#19B2FF',
      cropperToolbarTitle: 'Choose Image',
    }).then((image) => {
      setCropperSingle([
        ...cropperSingle,
        {
          key: (Math.random() + 1).toString(),
          uri: image.path,
        },
      ]);
    });
  };

  const upload = async () => {
    console.log(cropperSingle);
  };

  const addFoto = () => {
    actionSheetRef.current?.setModalVisible();
  };

  return (
    <>
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <View>
            <Text style={{fontSize: 20}}>DIBAWAH INI IMAGE CROPPER</Text>
            <TouchableOpacity
              onPress={cameraCropperHandler}
              style={styles.button}>
              <Text style={styles.buttonText}>Camera Cropper</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={galleryCropperHandler}
              style={styles.button}>
              <Text style={styles.buttonText}>Gallery Cropper</Text>
            </TouchableOpacity>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View style={{alignSelf: 'center'}}>
                <FlatList
                  data={cropperSingle}
                  horizontal
                  renderItem={({item, index}) => {
                    return (
                      <>
                        <TouchableOpacity
                          style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginLeft: 10,
                          }}>
                          <Image
                            source={{uri: item.uri}}
                            style={{
                              width: 70,
                              height: 70,
                              resizeMode: 'center',
                              borderRadius: 10,
                            }}
                          />
                        </TouchableOpacity>
                      </>
                    );
                  }}
                />
              </View>
              <TouchableOpacity onPress={addFoto} style={{marginLeft: 10}}>
                <Image source={require('../assets/addImage.png')} />
              </TouchableOpacity>
            </View>
            <View style={{margin: 10}}>
              <Button title="Upload" onPress={upload} />
            </View>
          </View>
          <ActionSheet
            ref={actionSheetRef}
            headerAlwaysVisible
            gestureEnabled
            footerHeight={10}
            footerAlwaysVisible={true}>
            <View style={{margin: 20}}>
              <Text style={styles.textButtonSheet}>Choose Photo from...</Text>
              <TouchableOpacity
                onPress={cameraCropperHandler}
                style={styles.buttonSheet}>
                <Text style={styles.textMenu}>Camera</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={galleryCropperHandler}
                style={styles.buttonSheet}>
                <Text style={styles.textMenu}>Gallery</Text>
              </TouchableOpacity>
            </View>
          </ActionSheet>
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
  buttonSheet: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
  },
  textButtonSheet: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 10,
  },
  textMenu: {
    fontSize: 16,
  },
});

export default ImageCropper;
