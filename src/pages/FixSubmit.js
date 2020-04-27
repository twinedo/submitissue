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
  Animated,
  TouchableOpacity,
} from 'react-native';
import ReasonCategoryAPI from '../api/ReasonCategoryAPI';
import {Picker} from '@react-native-community/picker';
import ImageCropPicker from 'react-native-image-crop-picker';
import ActionSheet from 'react-native-actions-sheet';

const actionSheetRef = createRef();

const initialState = {
  loading: true,
  error: '',
  category: [],
  selectedCategory: '',
  reason: [],
  selectedReason: '',
  description: '',
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

const FixSubmit = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [cropperSingle, setCropperSingle] = useState([]);
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
    console.log('modal: ' + item.uri);
    setModalItem(item.uri);
    setModalVisible(true);
  };

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

  const submitHandler = () => {
    console.log(
      'data yg dikirim: \n',
      'category: ' + state.selectedCategory + '\n',
      'reason: ' + state.selectedReason + '\n',
      'description: ' + state.description + '\n',
    );

    console.log(cropperSingle);
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
                      data={cropperSingle}
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
                footerAlwaysVisible={true}>
                <View style={{margin: 20}}>
                  <Text style={styles.textButtonSheet}>
                    Choose Photo from...
                  </Text>
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
            </View>
          </View>
        </>
      )}
    </>
  );
};

export default FixSubmit;

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
