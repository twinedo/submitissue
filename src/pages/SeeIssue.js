/* eslint-disable no-alert */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState, useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  StatusBar,
  Image,
  ScrollView,
  FlatList,
  Dimensions,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import ReactNativeZoomableView from '@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView';
import axios from 'axios';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ServiceTripAPI from '../api/ServiceTrip';

let width = Dimensions.get('screen').width / 3.7;
const nextActive = <AntDesign name="rightcircle" size={30} color="#19B2FF" />;
const nextInActive = <AntDesign name="rightcircle" size={30} color="#C4C4C4" />;
const prevActive = <AntDesign name="leftcircle" size={30} color="#19B2FF" />;
const prevInactive = <AntDesign name="leftcircle" size={30} color="#C4C4C4" />;

const SeeIssue = ({route}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalItem, setModalItem] = useState('');
  const [fetchPhoto, setFetchPhoto] = useState([]);
  const [dataIssue, setDataIssue] = useState();
  const issueTripID = 'TK-TRP-202005100910330000057';

  let flatRef = useRef(null);
  // console.log(issueTripID);

  useEffect(() => {
    getDataIssue();
    getPhotoIssue();
  }, []);

  const getDataIssue = async () => {
    ServiceTripAPI.get('/trip/issuetrip/byissueid', {
      params: {
        issueTripID: issueTripID,
      },
    })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });

    ServiceTripAPI.get('/trip/issueproofdetailbyid', {
      params: {
        issueProofIssueTripID: 105,
      },
    })
      .then((response) => {
        console.log(response);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getPhotoIssue = async () => {
    await axios
      .get('https://picsum.photos/v2/list?page=1&limit=5')
      .then((response) => {
        console.log(response.data);
        setFetchPhoto(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const setModal = (item) => {
    console.log('modal: ' + item.download_url);
    setModalItem(item.download_url);
    setModalVisible(true);
  };

  return (
    <>
      {/* StatusBar */}
      <StatusBar backgroundColor="#19B2FF" />
      {fetchPhoto === null && allIssue === '' ? (
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
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Image source={require('../assets/back.png')} />
              </TouchableOpacity>
              <Text style={styles.textToolbar}>See Issue</Text>
            </View>

            {/* Main Body */}
            <FlatList
              data={fetchPhoto}
              horizontal
              scrollEnabled={false}
              ref={(c) => (flatRef = c)}
              // keyExtractor={item => item.issueTripID.toString()}
              renderItem={({item, index}) => {
                return (
                  <>
                    <View style={{flexDirection: 'column'}}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'flex-end',
                          marginHorizontal: 10,
                          marginTop: 10,
                        }}>
                        <Text
                          style={{
                            textAlignVertical: 'center',
                            marginRight: 10,
                            fontWeight: 'bold',
                            fontSize: 18,
                            fontStyle: 'italic',
                          }}>
                          Issue #{index + 1}
                        </Text>
                        {index == 0 ? (
                          <>
                            <TouchableWithoutFeedback
                              style={{marginRight: 8}}
                              disabled>
                              <Text>{prevInactive}</Text>
                            </TouchableWithoutFeedback>
                          </>
                        ) : (
                          <>
                            <TouchableWithoutFeedback
                              style={{marginRight: 8}}
                              onPress={() =>
                                flatRef.scrollToIndex({
                                  animated: true,
                                  index: index - 1,
                                })
                              }>
                              <Text>{prevActive}</Text>
                            </TouchableWithoutFeedback>
                          </>
                        )}
                        {index == fetchPhoto.length - 1 ? (
                          <>
                            <TouchableWithoutFeedback
                              style={{marginRight: 8}}
                              disabled
                              onPress={() =>
                                flatRef.scrollToIndex({
                                  animated: true,
                                  index: index - 1,
                                })
                              }>
                              <Text>{nextInActive}</Text>
                            </TouchableWithoutFeedback>
                          </>
                        ) : (
                          <>
                            <TouchableWithoutFeedback
                              title="next"
                              onPress={() =>
                                flatRef.scrollToIndex({
                                  animated: true,
                                  index: index + 1,
                                })
                              }>
                              <Text>{nextActive}</Text>
                            </TouchableWithoutFeedback>
                          </>
                        )}
                      </View>
                      <ScrollView>
                        <View style={styles.mainBody}>
                          <Text style={styles.title}>Reason Category</Text>
                          <View style={styles.viewPicker}>
                            <Text>{item.issueReasonCategoryTripName}</Text>
                          </View>

                          <Text style={styles.title}>Reason</Text>
                          <View style={styles.viewPicker}>
                            <Text>{item.issueReasonTripName}</Text>
                          </View>

                          <Text style={styles.title}>Description</Text>
                          <View style={styles.viewPicker}>
                            <Text>{item.issueTripDescription}</Text>
                          </View>
                          <Text style={styles.title}>Photos of Issue</Text>
                          <FlatList
                            data={fetchPhoto}
                            horizontal={false}
                            numColumns={3}
                            key={3}
                            keyExtractor={item => item.id.toString()}
                            extraData={fetchPhoto}
                            renderItem={({item}) => {
                              return (
                                <TouchableOpacity
                                  onPress={() => setModal(item)}
                                  style={{
                                    width: width,
                                    height: width,
                                    margin: 8,
                                  }}>
                                  <Image
                                    source={{uri: item.download_url}}
                                    style={{
                                      borderRadius: 10,
                                      width: width,
                                      height: width,
                                      resizeMode: 'cover',
                                    }}
                                  />
                                </TouchableOpacity>
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
                                <Text
                                  style={{fontSize: 16, fontWeight: 'bold'}}>
                                  X
                                </Text>
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
                      </ScrollView>
                    </View>
                  </>
                );
              }}
            />
          </View>
        </>
      )}
    </>
  );
};

export default SeeIssue;

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
    height: 50,
    justifyContent: 'center',
    paddingHorizontal: 8,
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
  zoomedImg: {
    height: '100%',
    width: '100%',
    alignSelf: 'center',
    resizeMode: 'contain',
  },
});
