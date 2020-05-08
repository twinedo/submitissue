/* eslint-disable no-alert */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState, useReducer, createRef, useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  ActivityIndicator,
  StatusBar,
  Image,
  ScrollView,
  FlatList,
  Alert,
  Modal,
  TouchableOpacity,
} from 'react-native';
import ReasonCategoryAPI from '../api/ReasonCategoryAPI';
import {Picker} from '@react-native-community/picker';
import ImageCropPicker from 'react-native-image-crop-picker';
import ActionSheet from 'react-native-actions-sheet';
import ReactNativeZoomableView from '@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView';
import Icon from 'react-native-vector-icons/FontAwesome';
import StorageAPI from '../api/StorageAPI';
import CreateIssueAPI from '../api/CreateIssueAPI';
import axios from 'axios';
import Upload from 'react-native-background-upload';


const actionSheetRef = createRef();

const initialState = {
  loading: true,
  error: '',
  category: [],
  selectedCategory: '',
  reason: [],
  selectedReason: '',
  description: '',
  raw: [],
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_CATEGORY_SUCCESS':
      return {
        ...state,
        loading: false,
        category: action.dataCategory,
      };
    case 'FETCH_SELECTED_CATEGORY':
      return {
        ...state,
        loading: false,
        selectedCategory: action.selectedCategory,
      };
    case 'FETCH_REASON_SUCCESS':
      return {
        ...state,
        loading: false,
        reason: action.dataReason,
      };
    case 'FETCH_SELECTED_REASON':
      return {
        ...state,
        loading: false,
        selectedReason: action.selectedReason,
      };
    case 'CREATE_DESCRIPTION':
      return {
        ...state,
        loading: false,
        description: action.description,
      };
    case 'SUCCESS_FOTO_UPLOAD':
      return {
        ...state,
        loading: false,
        raw: action.raw,
      };
    case 'DELETE_FOTO':
      return {
        ...state,
        loading: false,
        raw: state.raw.filter((prevPic) => prevPic.key != action.key),
      };
    case 'FETCH_ERROR':
      return {
        loading: false,
        error: 'Something went wrong. Error message: ',
        category: [],
        selectedCategory: '',
        reason: [],
        selectedReason: '',
      };
    default:
      return state;
  }
};

const FixSubmit2 = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  // const [cropperSingle, setCropperSingle] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalItem, setModalItem] = useState('');

  useEffect(() => {
    getCategoryList();
    if (state.selectedCategory === '') {
      setReasonFromCategory('Incident');
    }
  }, []);

  const getCategoryList = async () => {
    await ReasonCategoryAPI.get('/trip/reasoncategorylist')
      .then((response) => {
        console.log(response);
        dispatch({type: 'FETCH_CATEGORY_SUCCESS', dataCategory: response.data});
      })
      .catch((err) => {
        dispatch({type: 'FETCH_ERROR'});
        alert(err);
      });
  };

  const setReasonFromCategory = async (itemValue) => {
    console.log('category yg dipilih: ' + itemValue);
    dispatch({type: 'FETCH_SELECTED_CATEGORY', selectedCategory: itemValue});
    await ReasonCategoryAPI.get('/trip/reason-category', {
      params: {
        reasonCategoryReasonTripName: itemValue,
      },
    })
      .then((response) => {
        console.log(response.data.reasonTrip);
        dispatch({
          type: 'FETCH_REASON_SUCCESS',
          dataReason: response.data.reasonTrip,
        });
      })
      .catch((err) => {
        console.log(err);
        dispatch({type: 'FETCH_ERROR'});
      });
  };

  const setSelectedReason = (itemValue) => {
    console.log('reason yg dipilih: ' + itemValue);
    dispatch({type: 'FETCH_SELECTED_REASON', selectedReason: itemValue});
  };

  const descriptionHandler = (value) => {
    console.log(value);
    dispatch({type: 'CREATE_DESCRIPTION', description: value});
  };

  const addFoto = () => {
    actionSheetRef.current?.setModalVisible();
  };

  const setModal = (item, index) => {
    console.log('modal: ' + item.issueProofPhoto);
    setModalItem(item.issueProofPhoto);
    setModalVisible(true);
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
            'https://d-storage.truckking.id/tppicture/upload?userID=TK-TRP-202004271817240000008',
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
                raw: [
                  ...state.raw,
                  {
                    key: (Math.random() + 1).toString(),
                    issueProofPhoto: JSON.parse(data.responseBody).name,
                  },
                ],
              });
            });
          })
          .catch((err) => {
            console.log('Upload error!', err);
            alert('Upload error!', err);
          });

        console.log(image);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const galleryCropperHandler = () => {
    ImageCropPicker.openPicker({
      cropping: true,
      includeBase64: true,
      cropperStatusBarColor: '#19B2FF',
      cropperToolbarColor: '#19B2FF',
      cropperToolbarTitle: 'Choose Image',
    })
      .then((image) => {
        const options = {
          url:
            'https://d-storage.truckking.id/tppicture/upload?userID=TK-TRP-202004271817240000008',
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
                raw: [
                  ...state.raw,
                  {
                    key: (Math.random() + 1).toString(),
                    issueProofPhoto: JSON.parse(data.responseBody).name,
                  },
                ],
              });
              // setCropperSingle([
              //   ...cropperSingle,
              //   {
              //     key: (Math.random() + 1).toString(),
              //     uri: JSON.parse(data.responseBody).name,
              //   },
              // ]);
            });
          })
          .catch((err) => {
            console.log('Upload error!', err);
            alert('Upload error!', err);
          });

        console.log(image);
      })
      .catch((error) => {
        console.log(error);
      });
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
            // setCropperSingle((prevPic) => {
            //   console.log(prevPic);
            //   return prevPic.filter((picture) => picture.key !== key);
            // })
            dispatch({type: 'DELETE_FOTO', key: key}),
        },
      ],
      {cancelable: true},
    );
  };

  const submitHandler = () => {
    console.log(
      'data yg dikirim: \n',
      'category: ' + state.selectedCategory + '\n',
      'reason: ' + state.selectedReason + '\n',
      'description: ' + state.description + '\n',
      'raw: ' + JSON.stringify(state.raw) + '\n',
    );

    Alert.alert(
      'Confirm Submit Issue',
      'You are about to submit Issue, are you sure?',
      [
        {
          text: 'No',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: postSubmit,
          style: 'default',
        },
      ],
      {cancelable: true},
    );
  };

  const postSubmit = () => {
    console.log('OK Pressed');

    var myHeaders = new Headers();
    myHeaders.append(
      'Authorization',
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX3JvbGUiOiJEcml2ZXIiLCJhdWQiOlsiYWxsc3RvcmUiXSwiY29tcGFueV9pZCI6IlRLLVRSU0NNUC0yMDE5MTAwOTE4MzQ1MDAwMDAwMDEiLCJ1c2VyX2lkIjoiVEstRFJWLTIwMTkxMDA5MTIwODEwMDAwMDAwNCIsInVzZXJfbmFtZSI6InRhbmFrYS55b2dpQHlhaG9vLmNvbSIsInNjb3BlIjpbInJlYWQiLCJ3cml0ZSJdLCJjb21wYW55X25hbWUiOiJQVC4gRmFsbGluIFVuaXRlZCIsImV4cCI6MTU4ODY1OTI1MiwiYXV0aG9yaXRpZXMiOlsiRHJpdmVyIl0sImp0aSI6IjViZDdjYmIyLTZhMjEtNGExOC1hNzcxLTYyNTYzMTUwZDQ4MyIsImNsaWVudF9pZCI6InRydWNraW5nY2xpZW50In0.E2pSQcTQqe14OTCZPUcjq-3sluhcP6zvZZx3FoBz2bc',
    );
    myHeaders.append('Content-Type', 'application/json');

    var raw = JSON.stringify(state.raw);

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };

    fetch(
      `https://d-trip.truckking.id/trip/create-issue?issueAssignedTripID=TK-TRP-202004241441050000007&issueReasonCategoryTripName=${state.selectedCategory}&issueReasonTripName=${state.selectedReason}&issueTripDescription=${state.description}`,
      requestOptions,
    )
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.log('error', error));
  };

  return (
    <>
      {/* StatusBar */}
      <StatusBar backgroundColor="#19B2FF" />
      {state.loading ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
          }}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <>
          {/* Main View */}

          <View style={styles.mainView}>
            {/* Toolbar */}
            <View style={styles.viewToolbar}>
              <Image source={require('../assets/back.png')} />
              <Text style={styles.textToolbar}>Submit Issue</Text>
            </View>

            {/* Main Body */}
            <View style={styles.mainBody}>
              <Text style={styles.title}>Reason Category</Text>
              <View style={styles.viewPicker}>
                <Picker
                  selectedValue={state.selectedCategory}
                  style={{
                    height: 50,
                    width: '100%',
                  }}
                  prompt="Select Reason Category"
                  onValueChange={(itemValue) =>
                    setReasonFromCategory(itemValue)
                  }>
                  {state.category.map((catTripName) => {
                    return (
                      <Picker.Item
                        label={catTripName.reasonCategoryTripName}
                        value={catTripName.reasonCategoryTripName}
                        key={catTripName.reasonCategoryTripID}
                      />
                    );
                  })}
                </Picker>
              </View>

              <Text style={styles.title}>Reason</Text>
              <View style={styles.viewPicker}>
                <Picker
                  selectedValue={state.selectedReason}
                  style={{
                    height: 50,
                    width: '100%',
                  }}
                  prompt="Select Reason"
                  onValueChange={(itemValue) => setSelectedReason(itemValue)}>
                  {state.reason.map((reasonTripName) => {
                    return (
                      <Picker.Item
                        label={reasonTripName.reasonTripName}
                        value={reasonTripName.reasonTripName}
                        key={reasonTripName.reasonTripID}
                      />
                    );
                  })}
                </Picker>
              </View>

              <Text style={styles.title}>Description</Text>
              <TextInput
                style={styles.textInput}
                multiline={true}
                placeholder="Describe Issue"
                onChangeText={descriptionHandler}
                value={state.description}
              />
              <View>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={{
                    marginVertical: 10,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <FlatList
                      horizontal
                      data={state.raw}
                      renderItem={({item, index}) => {
                        return (
                          <>
                            <TouchableOpacity
                              onPress={() => setModal(item, index)}
                              style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginRight: 10,
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
                                source={{uri: item.issueProofPhoto}}
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
                  {state.raw.length > 4 ? null : (
                    <TouchableOpacity onPress={addFoto} style={{}}>
                      <Image source={require('../assets/addImage.png')} />
                    </TouchableOpacity>
                  )}
                </ScrollView>
              </View>
              <Button title="Submit" onPress={submitHandler} />
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
                    <Icon name="camera" size={24} color="#000" />
                    <Text style={styles.textMenu}>Camera</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={galleryCropperHandler}
                    style={styles.buttonSheet}>
                    <Icon name="photo" size={24} color="#000" />
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
                      <Image
                        style={styles.zoomedImg}
                        source={{uri: modalItem}}
                      />
                    </ReactNativeZoomableView>
                  ) : null}
                </View>
              </Modal>
            </View>
          </View>
        </>
      )}
    </>
  );
};

export default FixSubmit2;

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  viewToolbar: {
    backgroundColor: '#19B2FF',
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  textToolbar: {
    color: 'white',
    fontFamily: 'Montserrat',
    fontWeight: 'bold',
    fontSize: 14,
    paddingStart: 14,
  },
  mainBody: {
    flex: 1,
    marginVertical: 10,
    marginHorizontal: 10,
  },
  viewPicker: {
    borderWidth: 1,
    borderColor: '#C4C4C4',
    borderRadius: 5,
  },
  textInput: {
    padding: 8,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#C4C4C4',
    height: 150,
    textAlignVertical: 'top',
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  image: {
    width: 150,
    height: 150,
    backgroundColor: 'grey',
  },
  buttonSheet: {
    width: '100%',
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textButtonSheet: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 10,
  },
  textMenu: {
    fontSize: 16,
    marginLeft: 10,
    fontWeight: '600',
  },
  zoomedImg: {
    height: '100%',
    width: '100%',
    alignSelf: 'center',
    resizeMode: 'contain',
  },
});
