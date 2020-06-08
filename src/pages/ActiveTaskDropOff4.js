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
import RNFetchBlob from 'react-native-fetch-blob';
import Icon from 'react-native-vector-icons/FontAwesome5';


const myIcon = <Icon name="check" size={12} color="#FFF" />;
const actionSheetRef = createRef();

const TwitterIcon = () => (
  <Image
    source={require('../assets/delete.png')}
    style={{width: 25, height: 25}}
  />
);

const ActiveTaskDropOff4 = ({data}) => {
  // const {updateStatus} = useContext(OrderStatusContext);
  // const [orderId, setOrderId] = useState(data.orderID);
  // const [status, setStatus] = useState('dropoff');
  // const [states, setstates] = useState(5);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalItem, setModalItem] = useState('');
  const [poNumber, setPoNumber] = useState([]);
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
    await OrderAPI.get('/api/v1/orders/TK-ORD-202051211261100000001')
      .then((response) => {
        const mappingData = response.data.numberOrder.split(', ');

        let tmpOrder = [];
        mappingData.map((value) => {
          let item = {
            orderNumber: value,
            image: '',
            uploaded: false,
          };
          tmpOrder.push(item);
        });
        console.log(tmpOrder);
        setPoNumber(tmpOrder);
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
          onPress: () => {
            var dat = [...poNumber];
            var index = dat.findIndex((obj) => obj.orderNumber === key);
            dat[index].image = '';
            setPoNumber(dat);
          },
        },
      ],
      {cancelable: true},
    );
  };

  const uploadPOD = (orderNumber, image) => {
    console.log('upload: ' + orderNumber);
    console.log('upload: ' + image);

    Alert.alert(
      'Confirmation',
      `Are you sure want to Upload foto with order number ${orderNumber}? Click OK cannot be cancelled`,
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            RNFetchBlob.fetch(
              'POST',
              'http://dev.order.dejavu2.fiyaris.id/api/v1/order_prof_of_deliveries/',
              {
                Authorization:
                  'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX3JvbGUiOiJEcml2ZXIiLCJhdWQiOlsiYWxsc3RvcmUiXSwiY29tcGFueV9pZCI6IlRLLVRSU0NNUC0yMDE5MTAwOTE4MzQ1MDAwMDAwMDEiLCJ1c2VyX2lkIjoiVEstRFJWLTIwMTkxMDA5MTIwODEwMDAwMDAwNCIsInVzZXJfbmFtZSI6InRhbmFrYS55b2dpQHlhaG9vLmNvbSIsInNjb3BlIjpbInJlYWQiLCJ3cml0ZSJdLCJjb21wYW55X25hbWUiOiJQVC4gRmFsbGluIFVuaXRlZCIsImV4cCI6MTU4OTU2NTE1OCwiYXV0aG9yaXRpZXMiOlsiRHJpdmVyIl0sImp0aSI6ImVjN2E0ODcyLWIxNmQtNGQ4NC05YmUyLTUyOTg5MWU4ODRhMiIsImNsaWVudF9pZCI6InRydWNraW5nY2xpZW50In0.Fvc-hw5-dv0nmanYTeKHADfg5FEOIVYazV-iWOTlN2g',
                otherHeader: 'foo',
                'Content-Type': 'multipart/form-data',
              },
              [
                {
                  name: 'podProof[]',
                  filename: `${orderNumber}.png`,
                  type: 'image/png',
                  data: image,
                },
                {name: 'podDescription', data: 'Testing: ' + orderNumber},
                {name: 'orderID', data: 'TK-ORD-202051307182200000004'},
                {name: 'shipmentID', data: 'TK-LOADS-202051208030216900000004'},
                {name: 'podUploadBy', data: 'podUploadBy'},
                {name: 'podLastUpdateBy', data: 'podLastUpdateBy'},
              ],
            )
              .then((resp) => {
                console.log(JSON.parse(resp.data));

                if (JSON.parse(resp.data).success === true) {
                  alert(
                    'Upload Foto Success. ' + JSON.parse(resp.data).message,
                  );
                  var dat = [...poNumber];
                  var index = dat.findIndex(
                    (obj) => obj.orderNumber === orderNumber,
                  );
                  dat[index].uploaded = true;
                  setPoNumber(dat);
                  console.log(poNumber);
                }
              })
              .catch((err) => {
                console.log(err);
              });
          },
        },
      ],
      {cancelable: true},
    );
    // var myHeaders = new Headers();
    // myHeaders.append('Content-Type', 'multipart/form-data');
    // myHeaders.append('Accept', 'application/json');
    // myHeaders.append(
    //   'Authorization',
    //   'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX3JvbGUiOiJEcml2ZXIiLCJhdWQiOlsiYWxsc3RvcmUiXSwiY29tcGFueV9pZCI6IlRLLVRSU0NNUC0yMDE5MTAwOTE4MzQ1MDAwMDAwMDEiLCJ1c2VyX2lkIjoiVEstRFJWLTIwMTkxMDA5MTIwODEwMDAwMDAwNCIsInVzZXJfbmFtZSI6InRhbmFrYS55b2dpQHlhaG9vLmNvbSIsInNjb3BlIjpbInJlYWQiLCJ3cml0ZSJdLCJjb21wYW55X25hbWUiOiJQVC4gRmFsbGluIFVuaXRlZCIsImV4cCI6MTU4OTU2NTE1OCwiYXV0aG9yaXRpZXMiOlsiRHJpdmVyIl0sImp0aSI6ImVjN2E0ODcyLWIxNmQtNGQ4NC05YmUyLTUyOTg5MWU4ODRhMiIsImNsaWVudF9pZCI6InRydWNraW5nY2xpZW50In0.Fvc-hw5-dv0nmanYTeKHADfg5FEOIVYazV-iWOTlN2g',
    // );
    // myHeaders.append('otherHeader', 'foo');

    // var formData = new FormData();
    // formData.append('podProof[]', image);
    // formData.append('podDescription', 'Testing: ' + orderNumber);
    // formData.append('orderID', 'TK-ORD-202051307182200000004');
    // formData.append('shipmentID', 'TK-LOADS-202051208030216900000004');
    // formData.append('podUploadBy', 'podUploadBy');
    // formData.append('podLastUpdateBy', 'podLastUpdateBy');

    // var requestOptions = {
    //   method: 'POST',
    //   headers: myHeaders,
    //   body: formData,
    //   redirect: 'follow',
    //   field: 'file',
    //   type: 'multipart',
    // };

    // fetch(
    //   'http://dev.order.dejavu2.fiyaris.id/api/v1/order_prof_of_deliveries/',
    //   requestOptions,
    // )
    //   .then((response) => {
    //     alert(JSON.stringify(response));
    //     console.log(response);
    //   })
    //   .then((result) => {
    //     console.log(result);
    //     alert('Success Upload POD: ' + result);
    //   })
    //   .catch((error) => console.log('error', error));
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
            <View style={{margin: 10}}>
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
                          marginBottom: 10,
                          shadowColor: '#000',
                          borderRadius: 10,
                          shadowOffset: {
                            width: 0,
                            height: 2,
                          },
                          shadowOpacity: 0.25,
                          shadowRadius: 3.5,
                          elevation: 5,
                        }}>
                        <View
                          style={{
                            marginHorizontal: 8,
                            height: 84,
                            justifyContent: 'center',
                            flex: 1,
                          }}>
                          <Text style={styles.pText}>{item.orderNumber}</Text>
                        </View>
                        {item.uploaded == true ? (
                          <View style={{flex: 2, justifyContent: 'center'}}>
                            <View>
                              <TouchableOpacity
                                onPress={() => alert('POD sudah terupload')}
                                /* onPress={() => alert(item.orderNumber)} */
                                style={{
                                  height: 30,
                                  width: 125,
                                  backgroundColor: '#4DCB00',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  borderRadius: 5,
                                }}>
                                <Text style={{color: 'white'}}>
                                  Uploaded {myIcon}
                                </Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                        ) : (
                          <View style={{flex: 2, justifyContent: 'center'}}>
                            <View>
                              {item.image === '' ? (
                                <TouchableOpacity
                                  onPress={() =>
                                    alert('Silahkan masukkan foto')
                                  }
                                  /* onPress={() => alert(item.orderNumber)} */
                                  style={{
                                    height: 20,
                                    width: 125,
                                    backgroundColor: '#19B2FF',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: 5,
                                    marginBottom: 8,
                                  }}>
                                  <Text style={{color: 'white'}}>
                                    Upload POD
                                  </Text>
                                </TouchableOpacity>
                              ) : (
                                <TouchableOpacity
                                  onPress={() =>
                                    uploadPOD(item.orderNumber, item.image)
                                  }
                                  /* onPress={() => alert(item.orderNumber)} */
                                  style={{
                                    height: 20,
                                    width: 125,
                                    backgroundColor: '#19B2FF',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: 5,
                                    marginBottom: 8,
                                  }}>
                                  <Text style={{color: 'white'}}>
                                    Upload POD
                                  </Text>
                                </TouchableOpacity>
                              )}
                            </View>

                            <View>
                              {item.image === '' || item.uploaded ? (
                                <TouchableOpacity
                                  disabled
                                  style={{
                                    height: 20,
                                    width: 125,
                                    backgroundColor: '#C4C4C4',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: 5,
                                  }}>
                                  <Text style={{color: 'white'}}>Delete</Text>
                                </TouchableOpacity>
                              ) : (
                                <TouchableOpacity
                                  onPress={() =>
                                    setDeletePict(item.orderNumber)
                                  }
                                  style={{
                                    height: 20,
                                    width: 125,
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
                        )}

                        <View
                          style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginRight: 4,
                          }}>
                          {item.image === '' ? (
                            <TouchableOpacity
                              style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: 20,
                              }}
                              onPress={() => addFoto(item.orderNumber, index)}>
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
                                  borderRadius: 20,
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
                style={{
                  fontStyle: 'italic',
                  fontSize: 10,
                  color: '#4DCB00',
                }}>
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
    flexDirection: 'row',
    width: '98%',
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
    borderWidth: 3,
    borderColor: 'red',
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
  buttonSheet: {
    width: '100%',
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default ActiveTaskDropOff4;
