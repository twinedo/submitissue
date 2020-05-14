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
import Dialog, {DialogContent} from 'react-native-popup-dialog';

const actionSheetRef = createRef();
let dialogComponent = createRef();

const initialState = {
  loading: true,
  allDatas: [],
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SUCCESS_ALL_DATA':
      return {
        ...state,
        loading: false,
        allDatas: action.allDatas,
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

const ActiveTaskDropOff2 = ({data}) => {
  // const {updateStatus} = useContext(OrderStatusContext);
  // const [orderId, setOrderId] = useState(data.orderID);
  // const [status, setStatus] = useState('dropoff');
  // const [states, setstates] = useState(5);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalItem, setModalItem] = useState('');
  const [poNumber, setPoNumber] = useState([]);
  const [state, dispatch] = useReducer(reducer, initialState);
  const [showDialog, setShowDialog] = useState(false);
  const [odNumber, setOdNumber] = useState('');
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
      .get('/api/v1/orders/TK-ORD-202051211261100000001')
      .then((response) => {
        // console.log(response.data.numberOrder.split(', '));
        // setPoNumber(response.data.numberOrder.split(', '));
        const mappingData = response.data.numberOrder.split(', ');

        let tmpOrder = [];
        mappingData.map((value) => {
          let item = {
            orderNumber: value,
            image: '',
          };
          tmpOrder.push(item);
        });
        console.log(tmpOrder);
        setPoNumber(tmpOrder);

        dispatch({
          type: 'SUCCESS_ALL_DATA',
          allDatas: tmpOrder,
        });
        // dispatch({type: 'FETCH_ORDER_SUCCESS', getOrderData: response.data});
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const addFoto = (item) => {
    console.log('add: ' + item);
    setOdNumber(item);

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
            Upload.addListener('progress', uploadId, (res) => {
              console.log(`Progress: ${res.progress}%`);
            });
            Upload.addListener('error', uploadId, (res) => {
              console.log(`Error: ${res.error}%`);
            });
            Upload.addListener('cancelled', uploadId, (res) => {
              console.log('Cancelled!');
              console.log(res);
            });
            Upload.addListener('completed', uploadId, (res) => {
              // data includes responseCode: number and responseBody: Object
              console.log('Completed!');
              alert('Berhasil Upload Foto!');
              console.log(JSON.parse(res.responseBody).name);
              var dat = [...poNumber];
              var index = dat.findIndex((obj) => obj.orderNumber === odNumber);
              dat[index].image = JSON.parse(res.responseBody).name;

              setPoNumber(dat);
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

  const galleryCropperHandler = () => {
    console.log(odNumber);
    ImageCropPicker.openPicker({
      cropping: true,
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
            Upload.addListener('progress', uploadId, (res) => {
              console.log(`Progress: ${res.progress}%`);
            });
            Upload.addListener('error', uploadId, (res) => {
              console.log(`Error: ${res.error}%`);
            });
            Upload.addListener('cancelled', uploadId, (res) => {
              console.log('Cancelled!');
              console.log(res);
            });
            Upload.addListener('completed', uploadId, (res) => {
              // data includes responseCode: number and responseBody: Object
              console.log('Completed!');
              // alert('Berhasil Upload Foto!');

              var dat = [...poNumber];
              var index = dat.findIndex((obj) => obj.orderNumber === odNumber);
              dat[index].image = JSON.parse(res.responseBody).name;

              setPoNumber(dat);
              // dispatch({
              //   type: 'SUCCESS_ALL_DATA',
              //   allDatas: ''
              // });
              setModalVisible(false);
              console.log(poNumber);
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

  const setModal = (picture) => {
    console.log('modal: ' + picture);
    setModalItem(picture);
    setModalVisible(true);
  };

  const pickPhoto = (orderNumber) => {
    console.log(orderNumber);
  };

  const setDeletePict = (key) => {
    Alert.alert(
      'Confirmation',
      `Are you sure want to delete ${key} foto?`,
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

              <FlatList
                data={poNumber}
                keyExtractor={(item) => item.orderNumber}
                renderItem={({item, index}) => {
                  return (
                    <>
                      <View
                        style={{
                          flex: 1,
                          flexDirection: 'row',
                          backgroundColor: '#F2F2F2',
                          marginVertical: 10,
                        }}>
                        <View
                          style={{
                            marginHorizontal: 8,
                            height: 70,
                            justifyContent: 'center',
                            flex: 1,
                          }}>
                          <Text style={styles.pText}>{item.orderNumber}</Text>
                        </View>
                        <View style={{flex: 1, justifyContent: 'center'}}>
                          <View>
                            {item.image === '' ? (
                              <TouchableOpacity
                                onPress={() => alert('Silahkan masukkan foto')}
                                /* onPress={() => alert(item.orderNumber)} */
                                style={{
                                  height: 20,
                                  width: 100,
                                  backgroundColor: '#19B2FF',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  borderRadius: 5,
                                  marginBottom: 8,
                                }}>
                                <Text style={{color: 'white'}}>Upload</Text>
                              </TouchableOpacity>
                            ) : (
                              <TouchableOpacity
                                onPress={() =>
                                  console.log('upload: ' + item.orderNumber)
                                }
                                /* onPress={() => alert(item.orderNumber)} */
                                style={{
                                  height: 20,
                                  width: 100,
                                  backgroundColor: '#19B2FF',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  borderRadius: 5,
                                  marginBottom: 8,
                                }}>
                                <Text style={{color: 'white'}}>Upload</Text>
                              </TouchableOpacity>
                            )}
                          </View>

                          <View>
                            {item.image === '' ? (
                              <TouchableOpacity
                                /* onPress={() => setDeletePict(item.orderNumber)} */
                                disabled
                                style={{
                                  height: 20,
                                  width: 100,
                                  backgroundColor: '#C4C4C4',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  borderRadius: 5,
                                }}>
                                <Text style={{color: 'white'}}>Delete</Text>
                              </TouchableOpacity>
                            ) : (
                              <TouchableOpacity
                                /* onPress={() => setDeletePict(item.orderNumber)} */
                                onPress={() =>
                                  console.log('delete: ' + item.orderNumber)
                                }
                                style={{
                                  height: 20,
                                  width: 100,
                                  backgroundColor: 'red',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  borderRadius: 5,
                                }}>
                                <Text style={{color: 'white'}}>Delete</Text>
                              </TouchableOpacity>
                            )}
                          </View>
                        </View>
                        <View style={{flex: 1, alignItems: 'center'}}>
                          {poNumber[index].image === '' ? (
                            <TouchableOpacity
                              onPress={() => addFoto(item.orderNumber, index)}>
                              {/* onPress={() => console.log('add: ' + item.orderNumber)}> */}
                              <Image
                                source={require('../assets/addImage.png')}
                              />
                            </TouchableOpacity>
                          ) : (
                            <TouchableOpacity
                              onPress={() => setModal(item.image, index)}
                              style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: 20,
                              }}>
                              <Image
                                source={{uri: item.image}}
                                style={{
                                  width: 70,
                                  height: 70,

                                  resizeMode: 'center',
                                  alignItems: 'center',
                                }}
                              />
                            </TouchableOpacity>
                          )}
                        </View>
                      </View>
                    </>
                  );
                }}
              />
            </View>
            {/* <View style={{marginLeft: 10, marginTop: 8}}>
              <Text style={styles.titleText}>Proof of Delivery</Text>
              {state.podProofPhoto.length === poNumber.length ? null : (
                <TouchableOpacity onPress={addFoto}>
                  <Image source={require('../assets/addImage.png')} />
                </TouchableOpacity>
              )}
              </View> */}
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
                {console.log(modalItem)}
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
  zoomedImg: {
    height: '100%',
    width: '100%',
    alignSelf: 'center',
    resizeMode: 'contain',
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

export default ActiveTaskDropOff2;
