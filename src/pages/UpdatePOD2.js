/* eslint-disable no-alert */
/* eslint-disable react-native/no-inline-styles */
import React, {createRef, useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  Modal,
  Alert,
} from 'react-native';
import SheetIcon from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/FontAwesome5';
import ActionSheet from 'react-native-actions-sheet';
import ImageCropPicker from 'react-native-image-crop-picker';
import ReactNativeZoomableView from '@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView';
import Upload from 'react-native-background-upload';
import RNFetchBlob from 'react-native-fetch-blob';
import axios from 'axios';
import podAPI from '../api/podAPI';

const checklistIcon = <Icon name="check" size={12} color="#FFF" />;
const actionSheetRef = createRef();

const UpdatePOD = ({data}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalItem, setModalItem] = useState('');
  const [poNumber, setPoNumber] = useState([]);
  const [odNumber, setOdNumber] = useState('');
  const [oldImage, setOldImage] = useState('');
  useEffect(() => {
    getDataPOD();
  }, []);

  const getDataPOD = async () => {
    await podAPI
      // .get('https://picsum.photos/v2/list?page=1&limit=3')
      .get(
        '/api/v1/order_prof_of_deliveries/detail/TK-ORD-202061514394100000026',
      )
      .then((resp) => {
        console.log(resp.data);

        let tmpOrder = [];

        resp.data.map((value) => {
          console.log(value);
          let item = {
            orderNumber: value.podDescription,
            image:
              'http://dev.order.dejavu2.fiyaris.id/api/v1/order_prof_of_deliveries/files/' +
              value.podProof,
            statusVerify: value.verifiedBy,
          };
          tmpOrder.push(item);
        });
        console.log(tmpOrder);
        setPoNumber(tmpOrder);
      })
      .catch((err) => {
        console.log(err);
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

  const updateHandler = (key, image) => {
    setOldImage(image);
    var dat = [...poNumber];

    var index = dat.findIndex((val) => val.orderNumber === key);
    dat[index].isUpdated = true;
    dat[index].image = '';
    setPoNumber(dat);
    console.log(poNumber);
  };

  const cancelHandler = (key, image) => {
    var dat = [...poNumber];

    var index = dat.findIndex((val) => val.orderNumber === key);
    dat[index].isUpdated = false;
    dat[index].image = oldImage;
    setPoNumber(dat);
    console.log(poNumber);
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
                  'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX3JvbGUiOiJEcml2ZXIiLCJhdWQiOlsiYWxsc3RvcmUiXSwiY29tcGFueV9pZCI6IlRLLVRSU0NNUC0yMDE5MTAwOTE4MzQ1MDAwMDAwMDEiLCJ1c2VyX2lkIjoiVEstRFJWLTIwMTkxMDA5MTIwODEwMDAwMDAwNCIsInVzZXJfbmFtZSI6InRhbmFrYS55b2dpQHlhaG9vLmNvbSIsInNjb3BlIjpbInJlYWQiLCJ3cml0ZSJdLCJjb21wYW55X25hbWUiOiJQVC4gRmFsbGluIFVuaXRlZCIsImV4cCI6MTU4OTgzNDYzNiwiYXV0aG9yaXRpZXMiOlsiRHJpdmVyIl0sImp0aSI6ImYwMmUxYjgyLWIxZjItNDRhZi04OTVkLTAwOTk3Yzg0NWQ2MiIsImNsaWVudF9pZCI6InRydWNraW5nY2xpZW50In0.YnORkjNzxcDNM2DJ53w1DbHdppjAFfnGyTPnZs8ZjOg',
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
                  dat[index].isCompleted = true;
                  dat[index].isUpdated = false;
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
  };

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <View style={{flex: 1, flexDirection: 'row'}}>
        <View style={styles.detail}>
          <View style={styles.sideTitle}>
            <Text style={styles.sideText}>Completed</Text>
          </View>
          <View style={{flex: 1}}>
            {/* PO number begin here */}
            <View style={{marginLeft: 10, marginTop: 8}}>
              <Text style={styles.titleText}>PO Number</Text>
              <Text style={styles.pText}>10857557</Text>
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
                            marginLeft: 8,
                            height: 84,
                            justifyContent: 'center',
                            flex: 1,
                          }}>
                          <Text style={styles.pText}>
                            OD-{item.orderNumber}123
                          </Text>
                        </View>
                        <View
                          style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <Text style={(styles.pText, {color: 'red'})}>
                            {item.statusVerify}
                          </Text>
                        </View>

                        <View
                          style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginRight: 4,
                          }}>
                          {item.image == '' ? (
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
                  <Text style={styles.textButtonSheet}>
                    Choose Photo from...
                  </Text>
                  <TouchableOpacity
                    onPress={cameraCropperHandler}
                    style={styles.buttonSheet}>
                    <SheetIcon name="camera" size={24} color="#000" />
                    <Text style={styles.textMenu}>Camera</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={galleryCropperHandler}
                    style={styles.buttonSheet}>
                    <SheetIcon name="photo" size={24} color="#000" />
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
                      <Image
                        style={styles.zoomedImg}
                        source={{uri: modalItem}}
                      />
                    </ReactNativeZoomableView>
                  ) : null}
                </View>
              </Modal>
            </View>
            {/* end order number */}

            {/* pick up address begin here */}
            <View style={{marginLeft: 10, marginTop: 8}}>
              <Text style={styles.titleText}>Drop off Address</Text>
              <Text style={styles.pText}>
                Jl. ABC No. 5A, Banceuy, Bandung, Jawa Barat
              </Text>
            </View>
            {/* and pick up address */}
            <View style={{marginLeft: 10, marginTop: 8}}>
              <Text style={styles.titleText}>Drop off Address</Text>
              <Text style={styles.pText}>PT Banceuy Tunggal Jaya </Text>
            </View>
          </View>
        </View>
      </View>
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
  buttonSheet: {
    width: '100%',
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
  },
  zoomedImg: {
    height: '100%',
    width: '100%',
    alignSelf: 'center',
    resizeMode: 'contain',
  },
});

export default UpdatePOD;
