/* eslint-disable no-alert */
/* eslint-disable react-native/no-inline-styles */
import React, {
  useState,
  useContext,
  useEffect,
  createRef,
  useReducer,
} from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  TouchableOpacity,
  Text,
  Modal,
  Image,
  Alert,
  FlatList,
  Button,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import SwipeButton from 'rn-swipe-button';
// import {OrderStatusContext} from '../ActiveTask';
// import {useNavigation} from '@react-navigation/native';
// import {FlatList} from 'react-native-gesture-handler';
import ImageCropPicker from 'react-native-image-crop-picker';
import ActionSheet from 'react-native-actions-sheet';
import ReactNativeZoomableView from '@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView';
import axios from 'axios';

const actionSheetRef = createRef();

const TwitterIcon = () => (
  <Image
    source={require('../assets/camera.png')}
    style={{width: 25, height: 25}}
  />
);

const initialState = {
  loading: true,
  error: '',
  orderData: [],
  picture: [],
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_ORDER_SUCCESS':
      return {
        ...state,
        loading: false,
        orderData: action.getOrderData,
      };
    case 'PICK_PHOTO':
      return {
        ...state,
        loading: false,
        picture: action.photo,
      };
    default:
      return state;
  }
};

const ActiveTaskUnloading = ({navigation}) => {
  const [cropperSingle, setCropperSingle] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalItem, setModalItem] = useState('');
  const [state, dispatch] = useReducer(reducer, initialState);
  //   console.log(data);

  useEffect(() => {
    getPONumberList();
  }, []);
  const addFoto = () => {
    actionSheetRef.current?.setModalVisible();
  };

  const getPONumberList = async () => {
    await axios
      .get('https://picsum.photos/v2/list?page=1&limit=3')
      .then((response) => {
        console.log(response.data);
        // setPoNumber(response.data);
        dispatch({type: 'FETCH_ORDER_SUCCESS', getOrderData: response.data});
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const cameraCropperHandler = () => {
    ImageCropPicker.openCamera({
      cropping: true,
      useFrontCamera: true,
      cropperStatusBarColor: '#19B2FF',
      cropperToolbarColor: '#19B2FF',
      cropperToolbarTitle: 'Choose Image',
    })
      .then((image) => {
        console.log(image);
        setCropperSingle({
          key: Math.random().toString(),
          uri: image.path,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const galleryCropperHandler = (item) => {
    console.log(item);
    ImageCropPicker.openPicker({
      cropping: true,
      cropperStatusBarColor: '#19B2FF',
      cropperToolbarColor: '#19B2FF',
      cropperToolbarTitle: 'Choose Image',
    })
      .then((image) => {
        dispatch({
          type: 'PICK_PHOTO',
          photo: [
            ...state.picture,
            {
              key: Math.random().toString(),
              uri: image.path,
            },
          ],
        });
        setCropperSingle([
          ...cropperSingle,
          {
            key: Math.random().toString(),
            uri: image.path,
          },
        ]);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const RenderFileUri = () => {
    if (cropperSingle.uri !== undefined) {
      return (
        <TouchableOpacity
          style={{borderRadius: 5, width: 70, height: 70}}
          onPress={setModal(cropperSingle.uri)}>
          <Image
            source={{uri: cropperSingle.fileUri}}
            style={{height: 70, width: 70}}
          />
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity
          style={{borderRadius: 5, width: 70, height: 70}}
          onPress={addFoto}>
          <Image
            source={require('../assets/addImage.png')}
            style={{height: 70, width: 70}}
          />
        </TouchableOpacity>
      );
    }
  };

  const setModal = (picture) => {
    console.log('modal: ' + picture);
    setModalItem(picture);
    setModalVisible(true);
  };

  const deleteHandler = (key) => {
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
          onPress: setCropperSingle((prevPic) => {
            console.log(prevPic);
            return prevPic.filter((picture) => picture.key !== key);
          }),
        },
      ],
      {cancelable: true},
    );
  };

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <View style={{flex: 1, flexDirection: 'row'}}>
        <View style={styles.detail}>
          <View style={styles.sideTitle}>
            <Text style={styles.sideText}>Unloading</Text>
          </View>
          <View style={{flex: 1}}>
            {/* PO number begin here */}
            <View style={{marginLeft: 10, marginTop: 8}}>
              <Text style={styles.titleText}>PO Number</Text>
              <Text style={styles.pText}>PO-</Text>
            </View>
            {/* PO number end here */}
            {/* Order Number begin here */}
            <View style={{marginLeft: 10, marginTop: 8}}>
              <Text style={styles.titleText}>Order Number</Text>

              <FlatList
                data={state.orderData}
                style={{marginVertical: 8}}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({item}) => {
                  return (
                    <View
                      style={{
                        backgroundColor: '#F2F2F2',
                        marginEnd: 5,
                        borderRadius: 5,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: 10,
                      }}>
                      <View style={{marginEnd: '5%', marginStart: '0.5%'}}>
                        <Text style={styles.pText}>{item.height}</Text>
                      </View>
                      <View style={{marginRight: 5}}>
                        <TouchableOpacity
                          style={[{backgroundColor: '#19B2FF'}, styles.button]}
                          onPress={() => alert('hallo')}>
                          <Text style={{color: '#fff'}}>Upload</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[{backgroundColor: '#C4C4C4'}, styles.button]}
                          onPress={() => deleteHandler(cropperSingle.key)}>
                          <Text style={{color: '#fff'}}>Delete</Text>
                        </TouchableOpacity>
                      </View>

                      <TouchableOpacity
                        style={{
                          flexDirection: 'row',
                          backgroundColor: '#fff',
                          borderRadius: 5,
                          width: 70,
                          height: 70,
                          shadowColor: '#000',
                          shadowOffset: {
                            width: 0,
                            height: 1,
                          },
                          shadowOpacity: 0.22,
                          shadowRadius: 2.22,

                          elevation: 3,
                        }}>
                        {state.picture.length === 0 ? (
                          <>
                            <TouchableOpacity
                              style={{borderRadius: 5, width: 70, height: 70}}
                              onPress={addFoto}>
                              <Image
                                source={require('../assets/addImage.png')}
                                style={{height: 70, width: 70}}
                              />
                            </TouchableOpacity>
                          </>
                        ) : (
                          <>
                            <TouchableOpacity
                              style={{borderRadius: 5, width: 70, height: 70}}
                              onPress={() => RenderFileUri}>
                              <Image
                                source={{uri: cropperSingle.uri}}
                                style={{height: 70, width: 70}}
                              />
                            </TouchableOpacity>
                          </>
                        )}
                      </TouchableOpacity>
                    </View>
                  );
                }}
              />
              <TouchableOpacity
                style={{
                  backgroundColor: 'red',
                  height: 30,
                  marginRight: 4,
                  marginVertical: 4,
                  borderRadius: 5,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={{color: 'white', fontSize: 16}}>
                  Select Image...
                </Text>
              </TouchableOpacity>
            </View>
            <ActionSheet
              ref={actionSheetRef}
              headerAlwaysVisible
              gestureEnabled
              footerHeight={10}
              bounceOnOpen
              elevation={10}
              springOffset={100}
              indicatorColor="#B7B7"
              footerAlwaysVisible={true}>
              <View style={{margin: 20}}>
                <Text style={styles.textButtonSheet}>Choose Photo from...</Text>
                <TouchableOpacity
                  onPress={() => cameraCropperHandler(item.key)}
                  style={styles.buttonSheet}>
                  <Text style={styles.textMenu}>Camera</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => galleryCropperHandler(item.id)}
                  style={styles.buttonSheet}>
                  <Text style={styles.textMenu}>Gallery</Text>
                </TouchableOpacity>
              </View>
            </ActionSheet>
            <Modal visible={modalVisible} animationType="slide">
              <View style={{flex: 1}}>
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
                  <ReactNativeZoomableView
                    maxZoom={1.5}
                    minZoom={1}
                    zoomStep={0.5}
                    initialZoom={1}
                    bindToBorders={true}
                    captureEvent={true}
                    style={{
                      backgroundColor: 'black',
                    }}>
                    <Image style={styles.zoomedImg} source={{uri: modalItem}} />
                  </ReactNativeZoomableView>
                ) : null}
              </View>
            </Modal>
            {/* end order number */}
          </View>
        </View>
      </View>
      <SafeAreaView>
        <View
          style={{
            // flex: 1,
            backgroundColor: '#ffffff',
            height: 50,
            justifyContent: 'center',
            borderRadius: 4,
            shadowColor: '#000',
            shadowOffset: {
              width: 6,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}>
          <SwipeButton
            height={40}
            thumbIconBackgroundColor="#F3F3F3"
            thumbIconComponent={TwitterIcon}
            railBackgroundColor="#C4C4C4"
            thumbIconBorderColor="transparent"
            railBorderColor="#F3F3F3"
            railFillBorderColor="#fff"
            // railFillBackgroundColor="#FFD15C"
            shouldResetAfterSuccess={true}
            title="Swipe if You already Arrived at Pick Up Location"
            titleFontSize={11}
            titleStyles={styles.swipeText}
            onSwipeSuccess={
              () => console.log(state)
              // stateComp < 5 ? actionComp('SWIPE') : actionComp('RESET')
            }
          />
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  sideText: {
    fontSize: 12,
    transform: [{rotate: '-90deg'}],
    width: 100,
    color: '#fff',
    textAlign: 'center',
  },
  sideTitle: {
    backgroundColor: '#FFD15C',
    borderTopLeftRadius: 5,
    width: 30,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: 136,
    height: 25,
    // backgroundColor:'#19B2FF',
    borderRadius: 5,
    // marginTop:10,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelTask: {
    color: '#fff',
    fontSize: 11,
    lineHeight: 13,
  },
  detail: {
    backgroundColor: '#fff',
    // paddingRight:100,
    // width:'100%',
    flexDirection: 'row',
    width: '98%',
    // paddingBottom:10,
    borderRadius: 5,
    marginTop: 25,
    marginLeft: '0.2%',
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  detailSchadule: {
    backgroundColor: '#fff',
    // paddingRight:100,
    // width:'100%',
    flexDirection: 'row',
    width: 371,
    // height:317,
    borderRadius: 5,
    marginTop: 25,
    marginLeft: '0.2%',
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  link: {
    // margin:0,
    width: 10,
    height: 5,
    borderRadius: 100,
    flexDirection: 'column',
  },
  titleText: {
    color: '#818181',
    fontSize: 11,
  },
  pText: {
    fontSize: 11,
  },
});

export default ActiveTaskUnloading;
