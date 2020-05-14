/* eslint-disable no-lone-blocks */
/* eslint-disable react-native/no-inline-styles */
import React, {
  useState,
  useContext,
  useReducer,
  createRef,
  useEffect,
} from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  Text,
  Image,
  Platform,
  Linking,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Alert,
  Modal,
  Button,
} from 'react-native';
import moment from 'moment';
import SwipeButton from 'rn-swipe-button';
// import {OrderStatusContext} from '../ActiveTask';
import axios from 'axios';
import ImageCropPicker from 'react-native-image-crop-picker';
import ActionSheet from 'react-native-actions-sheet';
import ReactNativeZoomableView from '@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView';
import Upload from 'react-native-background-upload';
import OrderAPI from '../api/OrderAPI';

const actionSheetRef = createRef();

const initialState = {
  podProofPhoto: [],
  allDatas: [],
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SUCCESS_ALL_DATA':
      return {
        ...state,
        loading: false,
        allDatas: action.alldatas,
      };
    case 'SUCCESS_FOTO_UPLOAD':
      return {
        ...state,
        loading: false,
        podProofPhoto: action.podProofPhoto,
      };
    case 'DELETE_FOTO':
      return {
        ...state,
        loading: false,
        podProofPhoto: state.podProofPhoto.filter(
          (prevPic) => prevPic.key !== action.key,
        ),
      };

    default:
      return state;
  }
};

const TwitterIcon = () => (
  <Image
    source={require('../assets/delete.png')}
    style={{width: 25, height: 25}}
  />
);

const ActiveTaskDropOff = ({data}) => {
  // const {updateStatus} = useContext(OrderStatusContext);
  // const [orderId, setOrderId] = useState(data.orderID);
  // const [status, setStatus] = useState('dropoff');
  // const [states, setstates] = useState(5);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalItem, setModalItem] = useState('');
  const [poNumber, setPoNumber] = useState([]);
  const [state, dispatch] = useReducer(reducer, initialState);
  // let weekday = [
  //   'Sunday',
  //   'Monday',
  //   'Tuesday',
  //   'Wednesday',
  //   'Thursday',
  //   'Friday',
  //   'Saturday',
  // ];
  // let date = moment
  //   .utc(data.orderEstTimeDropOffOn, 'YYYY-MM-DDTHH:mm:ss Z')
  //   .format('DD-MM-YYYY');
  // let time = moment
  //   .utc(data.orderEstTimeDropOffOn, 'YYYY-MM-DDTHH:mm:ss Z')
  //   .format('HH:mma');
  // const day = weekday[new Date(data.orderEstTimeDropOffOn).getDay()];
  useEffect(() => {
    getPONumberList();
  }, []);

  const getPONumberList = async () => {
    await OrderAPI
      // .get('https://picsum.photos/v2/list?page=1&limit=3')
      .get(
        'http://dev.order.dejavu2.fiyaris.id/api/v1/orders/TK-ORD-202051211261100000001',
      )
      .then((response) => {
        console.log(response.data.numberOrder.split(', '));
        setPoNumber(response.data.numberOrder.split(', '));
        dispatch({
          type: 'SUCCESS_ALL_DATA',
          allDatas: [
            ...state.allDatas,
            [response.data.numberOrder.split(', ')],
          ],
        });
        // dispatch({type: 'FETCH_ORDER_SUCCESS', getOrderData: response.data});
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const addFoto = () => {
    actionSheetRef.current?.setModalVisible();
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
        const options = {
          url:
            'https://d-storage.truckking.id/pictureorder/upload?orderID=TK-ORD-202051208030200000002',
          path: image.path.replace('file://', ''),
          method: 'POST',
          field: 'file',
          type: 'multipart',
          notification: {
            enabled: true,
          },
          useUtf8Charset: true,
        };

        Upload.startUpload(options)
          .then((uploadId) => {
            console.log('Upload started');
            Upload.addListener('progress', uploadId, (data) => {
              console.log(`Progress: ${data.progress}%`);
            });
            Upload.addListener('error', uploadId, (data) => {
              console.log(`Error: ${data.error}%`);
            });
            Upload.addListener('cancelled', uploadId, (data) => {
              console.log('Cancelled!');
              console.log(data);
            });
            Upload.addListener('completed', uploadId, (data) => {
              // data includes responseCode: number and responseBody: Object
              console.log('Completed!');
              alert('Berhasil Upload Foto!');
              console.log(JSON.parse(data.responseBody).name);
              dispatch({
                type: 'SUCCESS_FOTO_UPLOAD',
                podProofPhoto: [
                  ...state.podProofPhoto,
                  {
                    key: (Math.random() + 1).toString(),
                    podProofPhoto: JSON.parse(data.responseBody).name,
                  },
                ],
              });
            });
          })
          .catch((err) => {
            console.log('Upload error!', err);
            alert('Upload error!', err);
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
        // dispatch({
        //   type: 'SUCCESS_ALL_DATA',
        //   allDatas: [
        //     ...state.allDatas,
        //     {
        //       key: (Math.random() + 1).toString(),
        //       podProofPhoto: image.path,
        //     },
        //   ],
        // });
        const options = {
          url:
            'https://d-storage.truckking.id/pictureorder/upload?orderID=TK-ORD-202051208030200000002',
          path: image.path.replace('file://', ''),
          method: 'POST',
          field: 'file',
          type: 'multipart',
          notification: {
            enabled: true,
          },
          useUtf8Charset: true,
        };

        Upload.startUpload(options)
          .then((uploadId) => {
            console.log('Upload started');
            Upload.addListener('progress', uploadId, (data) => {
              console.log(`Progress: ${data.progress}%`);
            });
            Upload.addListener('error', uploadId, (data) => {
              console.log(`Error: ${data.error}%`);
            });
            Upload.addListener('cancelled', uploadId, (data) => {
              console.log('Cancelled!');
              console.log(data);
            });
            Upload.addListener('completed', uploadId, (data) => {
              // data includes responseCode: number and responseBody: Object
              console.log('Completed!');
              alert('Berhasil Upload Foto!');
              console.log(JSON.parse(data.responseBody).name);
              poNumber.map((value) => {
                console.log(value);
              });
              dispatch({
                type: 'SUCCESS_FOTO_UPLOAD',
                podProofPhoto: [
                  ...state.podProofPhoto,
                  {
                    key: (Math.random() + 1).toString(),
                    podProofPhoto: JSON.parse(data.responseBody).name,
                  },
                ],
              });
            });
            console.log(state.podProofPhoto);
          })
          .catch((err) => {
            console.log('Upload error!', err);
            alert('Upload error!', err);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const setModal = (picture) => {
    console.log('modal: ' + picture.podProofPhoto);
    setModalItem(picture.podProofPhoto);
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
          onPress: () => dispatch({type: 'DELETE_FOTO', key: key}),
        },
      ],
      {cancelable: true},
    );
  };

  const makeCall = () => {
    let phoneNumber = '';
    if (Platform.OS === 'android') {
      phoneNumber = `tel:${1234567890}`;
    } else {
      phoneNumber = 'telprompt:${1234567890}';
    }
    Linking.openURL(phoneNumber);
  };

  const makeSms = () => {
    let phoneNumber = '';
    if (Platform.OS === 'android') {
      phoneNumber = `sms:${1234567890}`;
    } else {
      phoneNumber = 'telprompt:${1234567890}';
    }
    Linking.openURL(phoneNumber);
  };
  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <View style={{flex: 1, flexDirection: 'row'}}>
        <View style={styles.detail}>
          <View style={styles.sideTitle}>
            <Text style={styles.sideText}>Drop Off</Text>
          </View>

          <View style={{flex: 1}}>
            {/* PO number begin here */}
            <View style={{marginLeft: 10, marginTop: 8}}>
              <Text style={styles.titleText}>PO Number</Text>
              <Text style={styles.pText}>PO-12345</Text>
            </View>
            {/* PO number end here */}
            {/* Order Number begin here */}
            <View style={{marginLeft: 10, marginTop: 8}}>
              <Text style={styles.titleText}>Order Number</Text>
              <View style={{flexDirection: 'row'}}>
                <View
                  style={{
                    flex: 1,
                    backgroundColor: 'yellow',
                    justifyContent: 'center',
                  }}>
                  <FlatList
                    data={poNumber}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({item}) => {
                      return (
                        <>
                          <View
                            style={{
                              marginHorizontal: 8,
                              height: 70,
                              justifyContent: 'center',
                              borderWidth: 1,
                              borderColor: 'red',
                            }}>
                            <Text style={styles.pText}>OD-{item}</Text>
                          </View>
                        </>
                      );
                    }}
                  />
                </View>
                <View style={{flex: 2, backgroundColor: 'orange'}}>
                  <FlatList
                    data={state.podProofPhoto}
                    renderItem={({item, index}) => {
                      console.log(item);
                      return (
                        <>
                          <View style={{flexDirection: 'row'}}>
                            <View>
                              <Button title="test" />

                              <TouchableOpacity
                                onPress={() => setDeletePict(item.key)}
                                style={{
                                  height: 15,
                                  width: 15,
                                  backgroundColor: 'red',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  borderRadius: 10,
                                }}>
                                <Text style={{color: 'white'}}>X</Text>
                              </TouchableOpacity>
                            </View>
                            <View>
                              <TouchableOpacity
                                onPress={() => setModal(item, index)}
                                style={{
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  marginRight: 10,
                                }}>
                                <Image
                                  source={{uri: item.podProofPhoto}}
                                  style={{
                                    width: 70,
                                    height: 70,
                                    resizeMode: 'center',
                                    borderRadius: 10,
                                  }}
                                />
                              </TouchableOpacity>
                            </View>
                          </View>
                        </>
                      );
                    }}
                  />
                </View>
              </View>
            </View>
            <View style={{marginLeft: 10, marginTop: 8}}>
              <Text style={styles.titleText}>Proof of Delivery</Text>
              {state.podProofPhoto.length === poNumber.length ? null : (
                <TouchableOpacity onPress={addFoto}>
                  <Image source={require('../assets/addImage.png')} />
                </TouchableOpacity>
              )}
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

            {/* pick up address begin here */}
            <View style={{marginLeft: 10, marginTop: 8}}>
              <Text style={styles.titleText}>Drop off Address</Text>
              <Text style={styles.pText}>COMPANY ADDRESS</Text>
            </View>
            {/* and pick up address */}

            {/* navigation begin here */}
            <View style={{marginLeft: 10, marginTop: 8}}>
              <View style={{flexDirection: 'row'}}>
                <Image
                  source={require('../assets/delete.png')}
                  style={{marginEnd: 8}}
                />
                <Text style={{fontSize: 10, color: '#FF2500'}}>Navigasi</Text>
              </View>
            </View>
            {/* navigation end here */}

            {/* Contact begin here */}
            <View style={{marginLeft: 10, marginTop: 8}}>
              <Text style={styles.titleText}>Contact</Text>
              <Text style={styles.pText}>0812314652652</Text>
              <View style={{flexDirection: 'row', marginTop: 8}}>
                <View style={{flexDirection: 'row', marginRight: 20}}>
                  <Image
                    source={require('../assets/delete.png')}
                    style={{marginEnd: 8}}
                  />
                  <TouchableOpacity onPress={() => makeCall()}>
                    <Text style={{fontSize: 10, color: '#FF2500'}}>Call</Text>
                  </TouchableOpacity>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <Image
                    source={require('../assets/delete.png')}
                    style={{marginEnd: 8}}
                  />
                  <TouchableOpacity onPress={() => makeSms()}>
                    <Text style={{fontSize: 10, color: '#FF2500'}}>SMS</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            {/* Contact End here */}

            {/* pick up schadule begin here */}
            <View style={{marginLeft: 10, marginTop: 8}}>
              <Text style={styles.titleText}>Drop Off Schedule</Text>
              {/* <Text style={styles.pText}>
                  {day}, {date}, {time}
          </Text> */}
              <Text style={{fontStyle: 'italic', fontSize: 10}}>
                You must Arrive at Pick Up Location in:
              </Text>
              <Text
                style={{fontStyle: 'italic', fontSize: 10, color: '#4DCB00'}}>
                1 Day 3 Hours 28 Minutes
              </Text>
            </View>

            {/* pick up schadule end here */}
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
              () => console.log('kuy')
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
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelTask: {
    color: '#fff',
    fontFamily: 'Montserrat',
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
    fontFamily: 'Montserrat',
  },
  pText: {
    fontSize: 11,
    fontFamily: 'Montserrat',
  },
});

export default ActiveTaskDropOff;
