/* eslint-disable react-native/no-inline-styles */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState, createRef, useRef} from 'react';
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
  Modal,
  Animated,
  Alert,
} from 'react-native';
import axios from 'axios';
import StorageAPI from '../api/StorageAPI';
import ImageCropPicker from 'react-native-image-crop-picker';
import ActionSheet from 'react-native-actions-sheet';
import {PinchGestureHandler, State} from 'react-native-gesture-handler';

const actionSheetRef = createRef();

const ImageCropper2 = () => {
  const [cropperSingle, setCropperSingle] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalItem, setModalItem] = useState('');
  const scale = useRef(new Animated.Value(1)).current;

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

  const setModal = (item, index) => {
    console.log('modal: ' + item.uri);
    setModalItem(item.uri);
    setModalVisible(true);
  };

  const setDeletePict = (key) => {
    Alert.alert(
      'Confirmation',
      'Are you sure want to delete this foto?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () =>
            setCropperSingle((prevPic) => {
              console.log(prevPic);
              return prevPic.filter((picture) => picture.key !== key);
            }),
        },
      ],
      {cancelable: true},
    );
  };

  const onZoomEvent = Animated.event([{nativeEvent: {scale: scale}}], {
    useNativeDriver: true,
  });

  const onZoomStateChange = (event) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }
  };

  return (
    <>
      <Modal visible={modalVisible} animationType="slide">
        <View style={{flex: 1, backgroundColor: 'black'}}>
          <TouchableOpacity
            style={{
              ...StyleSheet.absoluteFillObject,
              zIndex: 1,
              height: 30,
              width: 30,
              margin: 20,
              borderRadius: 20,
              backgroundColor: 'white',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => setModalVisible(false)}>
            <Text style={{fontSize: 16, fontWeight: 'bold'}}>X</Text>
          </TouchableOpacity>
          {modalItem != null ? (
            <Image style={styles.zoomedImg} source={{uri: modalItem}} />
          ) : null}
        </View>
      </Modal>

      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View style={{margin: 10, flex: 1}}>
          <Text style={{fontSize: 20}}>DIBAWAH INI IMAGE CROPPER</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
              }}>
              <FlatList
                horizontal
                data={cropperSingle}
                renderItem={({item, index}) => {
                  return (
                    <>
                      <TouchableOpacity
                        onPress={() => setModal(item, index)}
                        style={{
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginLeft: 10,
                        }}>
                        <TouchableOpacity
                          onPress={() => setDeletePict(item.key)}
                          style={{
                            height: 15,
                            width: 15,
                            backgroundColor: 'red',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 10,
                            ...StyleSheet.absoluteFill,
                            zIndex: 10,
                          }}>
                          <Text style={{color: 'white'}}>X</Text>
                        </TouchableOpacity>
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
            {cropperSingle.length > 4 ? null : (
              <TouchableOpacity
                onPress={addFoto}
                style={{
                  marginLeft: 10,
                }}>
                <Image source={require('../assets/addImage.png')} />
              </TouchableOpacity>
            )}
          </ScrollView>
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
    </>
  );
};

const styles = StyleSheet.create({
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
  zoomedImg: {
    height: '100%',
    width: '100%',
    alignSelf: 'center',
    resizeMode: 'contain',
  },
});

export default ImageCropper2;
