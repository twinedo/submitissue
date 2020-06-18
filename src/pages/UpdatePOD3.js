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
  Dimensions,
  RefreshControl,
  SafeAreaView,
  Button,
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
import {ScrollView} from 'react-native-gesture-handler';

const checklistIcon = <Icon name="check" size={12} color="#FFF" />;
const actionSheetRef = createRef();

const width = Dimensions.get('screen').width;

function wait(timeout) {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
}

const UpdatePOD = ({data}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalItem, setModalItem] = useState('');
  const [poNumber, setPoNumber] = useState([]);
  const [statusPOD, setStatusPOD] = useState();
  const [refreshing, setRefreshing] = useState(false);
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

        // let tmpOrder = [];

        // resp.data.map((value) => {
        //   console.log(value);
        //   let item = {
        //     orderNumber: value.podDescription,
        //     image:
        //       'http://dev.order.dejavu2.fiyaris.id/api/v1/order_prof_of_deliveries/files/' +
        //       value.podProof,
        //     statusVerify: value.verifiedBy,
        //   };
        //   tmpOrder.push(item);
        // });
        // console.log(tmpOrder);
        setPoNumber(resp.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const statusnya = (item) => {
    console.log(item.podDescription);

    setStatusPOD(item.verifiedBy);
    // setStatusPOD('verified');

    return (
      <>
        <Text style={(styles.pText, {color: 'red'})}>{item.verifiedBy}</Text>
      </>
    );
  };

  const setModal = (picture) => {
    console.log('modal: ' + picture);
    setModalItem(picture);
    setModalVisible(true);
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    alert('sudah refresh');

    wait(2000).then(() => setRefreshing(false));
  }, [refreshing]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <View style={{flex: 1, backgroundColor: '#F4F4F4'}}>
          <View
            style={{
              width: width,
              flex: 1,
              flexDirection: 'row',
            }}>
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
                    keyExtractor={(item) => item.id.toString()}
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
                                OD-{item.podDescription}
                              </Text>
                            </View>
                            <View
                              style={{
                                flex: 1,
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}>
                              {item.verifiedBy === 'unverified'
                                ? statusnya(item)
                                : statusnya(item)}
                            </View>

                            <View
                              style={{
                                flex: 1,
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginRight: 4,
                              }}>
                              <TouchableOpacity
                                onPress={() =>
                                  setModal(
                                    'http://dev.order.dejavu2.fiyaris.id/api/v1/order_prof_of_deliveries/files/' +
                                      item.podProof,
                                    index,
                                  )
                                }
                                style={{
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  borderRadius: 20,
                                }}>
                                <Image
                                  source={{
                                    uri:
                                      'http://dev.order.dejavu2.fiyaris.id/api/v1/order_prof_of_deliveries/files/' +
                                      item.podProof,
                                  }}
                                  style={{
                                    width: 70,
                                    height: 70,
                                    borderRadius: 20,
                                    resizeMode: 'center',
                                    alignItems: 'center',
                                  }}
                                />
                              </TouchableOpacity>
                            </View>
                          </View>
                        </>
                      );
                    }}
                  />
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
                        <Text style={{fontSize: 16, fontWeight: 'bold'}}>
                          X
                        </Text>
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
          <SafeAreaView>
            <View style={{margin: 10}}>
              {statusPOD == 'unverified' ? (
                <Button title="Menunggu Status Verified" disabled />
              ) : (
                <Button title="SELESAI" />
              )}
            </View>
          </SafeAreaView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width,
  },
  scrollView: {
    flex: 1,
    width: width,
    alignItems: 'center',
    justifyContent: 'center',
  },
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
    marginLeft: '1%',
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
