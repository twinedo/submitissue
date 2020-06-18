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
import OrderAPI from '../api/OrderAPI';

const checklistIcon = <Icon name="check" size={12} color="#FFF" />;
const actionSheetRef = createRef();

const UpdatePOD = ({data}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalItem, setModalItem] = useState('');
  const [poNumber, setPoNumber] = useState([]);
  const [odNumber, setOdNumber] = useState('');
  const [oldImage, setOldImage] = useState('');
  const [dataOrd, setDataOrd] = useState();
  const [imageFyrs, setImageFyrs] = useState();
  useEffect(() => {
    getDataOrder();
  }, [poNumber]);

  useEffect(() => {
    getDataPOD();
  }, []);

  const getDataOrder = async () => {
    try {
      const dataOrder = await OrderAPI.get(
        '/api/v1/orders/TK-ORD-202061711075500000011',
      );
      console.log('ini dataOrder: ', dataOrder.data);
      setDataOrd(dataOrder.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getDataPOD = async () => {
    try {
      const dataPOD = await podAPI
        // .get('https://picsum.photos/v2/list?page=1&limit=3')
        .get(
          '/api/v1/order_prof_of_deliveries/detail/TK-ORD-202061711075500000011',
        );
      console.log('ini dataPOD', dataPOD.data);
      let tmpOrder = [];

      dataPOD.data.map((value) => {
        console.log(value);
        let item = {
          orderNumber: value.podDescription,
          image:
            'http://dev.order.dejavu2.fiyaris.id/api/v1/order_prof_of_deliveries/files/' +
            value.podProof,
          statusVerify: value.verifiedBy,
          isUpdated: false,
          isCompleted: false,
        };
        tmpOrder.push(item);
      });
      console.log(tmpOrder);
      setPoNumber(tmpOrder);
    } catch (error) {
      console.log(error);
    }
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
      .then(async (image) => {
        setImageFyrs(image);
        console.log(image.data);

        const dataFoto = new FormData();
        dataFoto.append('podProof[]', {
          name: image.filename,
          uri: image.path.replace('file://', ''),
          type: 'image/jpeg',
        });
        dataFoto.append('podDescription', 'od-1234(edited-)');
        dataFoto.append('orderID', dataOrd.orderID);
        dataFoto.append('podUploadBy', dataOrd.order_trip.driverID);
        dataFoto.append('podLastUpdateBy', dataOrd.order_trip.driverID);

        let res = await fetch(
          'http://dev.order.dejavu2.fiyaris.id/api/v1/order_prof_of_deliveries/',
          {
            method: 'post',
            body: dataFoto,
            headers: {
              'Content-Type': 'application/json; charset=utf-8',
              Authorization:
                'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX3JvbGUiOiJEcml2ZXIiLCJhdWQiOlsiYWxsc3RvcmUiXSwiY29tcGFueV9pZCI6IlRLLVRSU0NNUC0yMDE5MTAwOTE4MzQ1MDAwMDAwMDEiLCJ1c2VyX2lkIjoiVEstRFJWLTIwMTkxMDA5MTIwODEwMDAwMDAwNCIsInVzZXJfbmFtZSI6InRhbmFrYS55b2dpQHlhaG9vLmNvbSIsInNjb3BlIjpbInJlYWQiLCJ3cml0ZSJdLCJjb21wYW55X25hbWUiOiJQVC4gRmFsbGluIFVuaXRlZCIsImV4cCI6MTU5MjQ4OTI2NiwiYXV0aG9yaXRpZXMiOlsiRHJpdmVyIl0sImp0aSI6ImE0MzFlMjJkLTc4ZDktNDM4Yy04YTljLTkzODQ3YTQ1MTk5ZSIsImNsaWVudF9pZCI6InRydWNraW5nY2xpZW50In0.HqZXwyCeiV4f7iz1tzMD_Q2s4awLUCqRdEPwXM8r7fc',
            },
          },
        );

        let response = await res.json();
        console.log(response);

        // return axios
        //   .post(
        //     'http://dev.order.dejavu2.fiyaris.id/api/v1/order_prof_of_deliveries/',
        //     dataFoto,
        //     {
        //       headers: {
        //         Accept: 'application/json',
        //         'Content-Type': 'application/json; charset=utf-8',
        //         Authorization:
        //           'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX3JvbGUiOiJEcml2ZXIiLCJhdWQiOlsiYWxsc3RvcmUiXSwiY29tcGFueV9pZCI6IlRLLVRSU0NNUC0yMDE5MTAwOTE4MzQ1MDAwMDAwMDEiLCJ1c2VyX2lkIjoiVEstRFJWLTIwMTkxMDA5MTIwODEwMDAwMDAwNCIsInVzZXJfbmFtZSI6InRhbmFrYS55b2dpQHlhaG9vLmNvbSIsInNjb3BlIjpbInJlYWQiLCJ3cml0ZSJdLCJjb21wYW55X25hbWUiOiJQVC4gRmFsbGluIFVuaXRlZCIsImV4cCI6MTU5MjQ4OTI2NiwiYXV0aG9yaXRpZXMiOlsiRHJpdmVyIl0sImp0aSI6ImE0MzFlMjJkLTc4ZDktNDM4Yy04YTljLTkzODQ3YTQ1MTk5ZSIsImNsaWVudF9pZCI6InRydWNraW5nY2xpZW50In0.HqZXwyCeiV4f7iz1tzMD_Q2s4awLUCqRdEPwXM8r7fc',
        //       },
        //       maxContentLength: -1,
        //       method: 'post',
        //       onUploadProgress: console.log('upload proses'),
        //     },
        //   )
        //   .then((res) => {
        //     console.log(res);
        //   })
        //   .catch((err) => {
        //     alert(err);
        //   });

        // setModalVisible(false);
        // const options = {
        //   url:
        //     'https://d-storage.truckking.id/pictureorder/upload?orderID=TK-ORD-202061711075500000011',
        //   path: image.path.replace('file://', ''),
        //   method: 'POST',
        //   field: 'file',
        //   type: 'multipart',
        //   notification: {
        //     enabled: true,
        //   },
        //   useUtf8Charset: true,
        // };

        // Upload.startUpload(options)
        //   .then((uploadId) => {
        //     console.log('Upload started');
        //     Upload.addListener('progress', uploadId, (res) => {
        //       console.log(`Progress: ${res.progress}%`);
        //     });
        //     Upload.addListener('error', uploadId, (res) => {
        //       console.log(`Error: ${res.error}%`);
        //     });
        //     Upload.addListener('cancelled', uploadId, (res) => {
        //       console.log('Cancelled!');
        //       console.log(res);
        //     });
        //     Upload.addListener('completed', uploadId, (res) => {
        //       // data includes responseCode: number and responseBody: Object
        //       console.log('Completed!');
        //       // alert('Berhasil Upload Foto!');

        //       var dat = [...poNumber];
        //       var index = dat.findIndex((obj) => obj.orderNumber === odNumber);
        //       dat[index].image = JSON.parse(res.responseBody).name;

        //       setPoNumber(dat);
        //       setModalVisible(false);
        //       console.log(poNumber);
        //     });
        //   })
        //   .catch((err) => {
        //     console.log('Upload error!', err);
        //     alert('Upload error!', err);
        //   });
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

  // const uploadPOD = (orderNumber, image, indexKe) => {
  //   console.log('upload: ' + orderNumber);
  //   console.log('upload: ' + image);

  //   Alert.alert(
  //     'Confirmation',
  //     `Are you sure want to Upload foto with order number ${orderNumber}? Click OK cannot be cancelled`,
  //     [
  //       {
  //         text: 'Cancel',
  //         onPress: () => console.log('Cancel Pressed'),
  //         style: 'cancel',
  //       },
  //       {
  //         text: 'OK',
  //         onPress: () => {
  //           RNFetchBlob.fetch(
  //             'POST',
  //             'http://dev.order.dejavu2.fiyaris.id/api/v1/order_prof_of_deliveries/',
  //             {
  //               Authorization:
  //                 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX3JvbGUiOiJEcml2ZXIiLCJhdWQiOlsiYWxsc3RvcmUiXSwiY29tcGFueV9pZCI6IlRLLVRSU0NNUC0yMDE5MTAwOTE4MzQ1MDAwMDAwMDEiLCJ1c2VyX2lkIjoiVEstRFJWLTIwMTkxMDA5MTIwODEwMDAwMDAwNCIsInVzZXJfbmFtZSI6InRhbmFrYS55b2dpQHlhaG9vLmNvbSIsInNjb3BlIjpbInJlYWQiLCJ3cml0ZSJdLCJjb21wYW55X25hbWUiOiJQVC4gRmFsbGluIFVuaXRlZCIsImV4cCI6MTU5MjQ4OTI2NiwiYXV0aG9yaXRpZXMiOlsiRHJpdmVyIl0sImp0aSI6ImE0MzFlMjJkLTc4ZDktNDM4Yy04YTljLTkzODQ3YTQ1MTk5ZSIsImNsaWVudF9pZCI6InRydWNraW5nY2xpZW50In0.HqZXwyCeiV4f7iz1tzMD_Q2s4awLUCqRdEPwXM8r7fc',
  //               otherHeader: 'foo',
  //               'Content-Type': 'multipart/form-data',
  //             },
  //             [
  //               {
  //                 name: 'podProof[]',
  //                 filename: `${orderNumber}.png`,
  //                 type: 'image/png',
  //                 data: image,
  //               },
  //               {
  //                 name: 'podDescription',
  //                 data: orderNumber + ` (edited-#${indexKe + 1})`,
  //               },
  //               {name: 'orderID', data: dataOrd.orderID},
  //               // {name: 'shipmentID', data: 'TK-LOADS-202051208030216900000004'},
  //               {name: 'podUploadBy', data: dataOrd.order_trip.driverID},
  //               {name: 'podLastUpdateBy', data: dataOrd.order_trip.driverID},
  //             ],
  //           )
  //             .then((resp) => {
  //               console.log(JSON.parse(resp.data));

  //               if (JSON.parse(resp.data).success === true) {
  //                 alert(
  //                   'Upload Foto Success. ' + JSON.parse(resp.data).message,
  //                 );
  //                 var dat = [...poNumber];
  //                 var index = dat.findIndex(
  //                   (obj) => obj.orderNumber === orderNumber,
  //                 );
  //                 dat[index].isCompleted = true;
  //                 dat[index].isUpdated = false;
  //                 setPoNumber(dat);
  //                 console.log(poNumber);
  //               }
  //             })
  //             .catch((err) => {
  //               console.log(err);
  //             });
  //         },
  //       },
  //     ],
  //     {cancelable: true},
  //   );
  // };

  const uploadPOD = (orderNumber, image, indexKe) => {
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
          onPress: async () => {
            let formPOD = new FormData();

            formPOD.append('podProof[]', {
              uri: imageFyrs.path,
              name: imageFyrs.filename,
              type: imageFyrs.mime,
            });
            formPOD.append(
              'podDescription',
              orderNumber + `(edited-#${indexKe + 1})`,
            );
            formPOD.append('orderID', dataOrd.orderID);
            formPOD.append('podUploadBy', dataOrd.order_trip.driverID);
            formPOD.append('podLastUpdateBy', dataOrd.order_trip.driverID);

            await fetch(
              'http://dev.order.dejavu2.fiyaris.id/api/v1/order_prof_of_deliveries/',
              {
                method: 'POST',
                body: formPOD,
                headers: {
                  Authorization:
                    'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX3JvbGUiOiJEcml2ZXIiLCJhdWQiOlsiYWxsc3RvcmUiXSwiY29tcGFueV9pZCI6IlRLLVRSU0NNUC0yMDE5MTAwOTE4MzQ1MDAwMDAwMDEiLCJ1c2VyX2lkIjoiVEstRFJWLTIwMTkxMDA5MTIwODEwMDAwMDAwNCIsInVzZXJfbmFtZSI6InRhbmFrYS55b2dpQHlhaG9vLmNvbSIsInNjb3BlIjpbInJlYWQiLCJ3cml0ZSJdLCJjb21wYW55X25hbWUiOiJQVC4gRmFsbGluIFVuaXRlZCIsImV4cCI6MTU5MjQ4OTI2NiwiYXV0aG9yaXRpZXMiOlsiRHJpdmVyIl0sImp0aSI6ImE0MzFlMjJkLTc4ZDktNDM4Yy04YTljLTkzODQ3YTQ1MTk5ZSIsImNsaWVudF9pZCI6InRydWNraW5nY2xpZW50In0.HqZXwyCeiV4f7iz1tzMD_Q2s4awLUCqRdEPwXM8r7fc',
                },
                redirect: 'follow',
              },
            )
              .then((resp) => resp.json())
              .then((resp) => {
                console.log('upload success', resp);
                alert('Upload success!!');
              })
              .catch((err) => {
                console.log('upload error', err);
                alert('Upload failed');
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
                          <Text style={styles.pText}>{item.orderNumber}</Text>
                          <Text style={(styles.pText, {color: 'red'})}>
                            {item.statusVerify}
                          </Text>
                        </View>
                        {item.isUpdated == false &&
                        item.isCompleted == false ? (
                          <View
                            style={{
                              justifyContent: 'center',
                            }}>
                            <TouchableOpacity
                              onPress={() =>
                                updateHandler(item.orderNumber, item.image)
                              }
                              /* onPress={() => alert(item.orderNumber)} */
                              style={{
                                height: 20,
                                width: 125,
                                backgroundColor: '#19B2FF',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: 5,
                              }}>
                              <Text style={{color: 'white'}}>Update POD</Text>
                            </TouchableOpacity>
                          </View>
                        ) : item.isUpdated == true &&
                          item.isCompleted == false ? (
                          <View
                            style={{
                              justifyContent: 'center',
                            }}>
                            {item.image == '' ? (
                              <TouchableOpacity
                                onPress={() => alert('Silahkan masukkan foto')}
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
                                <Text style={{color: 'white'}}>Upload POD</Text>
                              </TouchableOpacity>
                            ) : (
                              <TouchableOpacity
                                onPress={() =>
                                  uploadPOD(item.orderNumber, item.image, index)
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
                                <Text style={{color: 'white'}}>Upload POD</Text>
                              </TouchableOpacity>
                            )}
                            <TouchableOpacity
                              onPress={() =>
                                cancelHandler(item.orderNumber, item.image)
                              }
                              style={{
                                height: 20,
                                width: 125,
                                backgroundColor: 'red',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: 5,
                              }}>
                              <Text style={{color: 'white'}}>Cancel</Text>
                            </TouchableOpacity>
                          </View>
                        ) : (
                          <View style={{justifyContent: 'center'}}>
                            <TouchableOpacity
                              onPress={() => alert('POD sudah terupdate.')}
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
                                Updated {checklistIcon}
                              </Text>
                            </TouchableOpacity>
                          </View>
                        )}

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
