/* eslint-disable no-alert */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState, useReducer} from 'react';
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
} from 'react-native';
import ReactNativeZoomableView from '@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView';
import axios from 'axios';

let width = Dimensions.get('screen').width / 2.5;

const SeeIssue = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalItem, setModalItem] = useState('');
  const [fetchPhoto, setFetchPhoto] = useState([]);

  useEffect(() => {
    getPhotoIssue();
  }, []);

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
      {fetchPhoto === null ? (
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
              <Text style={styles.textToolbar}>See Issue</Text>
            </View>

            {/* Main Body */}
            <ScrollView>
              <View style={styles.mainBody}>
                <Text style={styles.title}>Reason Category</Text>
                <View style={styles.viewPicker}>
                  <Text>Reason Category yang dipilih</Text>
                </View>

                <Text style={styles.title}>Reason</Text>
                <View style={styles.viewPicker}>
                  <Text>Reason yang dipilih</Text>
                </View>

                <Text style={styles.title}>Description</Text>
                <View style={styles.viewPicker}>
                  <Text>Deskripsi dari API</Text>
                </View>
                <Text style={styles.title}>Photos of Issue</Text>
                <FlatList
                  data={fetchPhoto}
                  numColumns={2}
                  columnWrapperStyle={{justifyContent: 'space-around'}}
                  horizontal={false}
                  keyExtractor={(item) => item.id.toString()}
                  extraData={fetchPhoto}
                  renderItem={({item}) => {
                    return (
                      <TouchableOpacity
                        onPress={() => setModal(item)}
                        style={{
                          width: width,
                          height: width,
                          marginVertical: 4,
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
            </ScrollView>
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
