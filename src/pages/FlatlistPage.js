/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  Alert,
  Button,
  Image,
  Dimensions,
} from 'react-native';
import Axios from 'axios';
import Spinner from 'react-native-loading-spinner-overlay';

const width = Dimensions.get('window').width;

const FlatlistPage = () => {
  const [dataPic, setDataPic] = useState();
  const [loading, setLoading] = useState(false);
  const [errorHandler, setErrorHandler] = useState(false);
  useEffect(() => {
    getData();
    return () => {
      console.log('unmount');
    };
  }, []);

  const getData = async () => {
    setLoading(true);
    try {
      const response = await Axios.get(
        'https://picsum.photos/v2/list?page=2&limit=10',
      );
      console.log(response.data);
      setDataPic(response.data);
      if (response.data) {
        setLoading(false);
        setErrorHandler(false);
      }
    } catch (error) {
      console.log(error);
      Alert.alert(error);
      setLoading(false);
      setErrorHandler(true);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Spinner
        visible={loading}
        textContent={'Loading...'}
        textStyle={styles.spinnerTextStyle}
      />
      {dataPic ? (
        <View
          style={{
            flex: 1,
            width: width,
            justifyContent: 'center',
            alignItems: 'center',
            alignContent: 'center',
          }}>
          <FlatList
            data={dataPic}
            style={{width: width}}
            numColumns={3}
            ListEmptyComponent={
              <View style={{flex: 1}}>
                <Text>Kosong boss</Text>
              </View>
            }
            keyExtractor={(item) => item.id.toString()}
            renderItem={({item, index}) => {
              return (
                <>
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text style={{textAlign: 'justify'}}>{item.author}</Text>
                    <Image
                      style={{height: 100, width: 100}}
                      source={{uri: item.download_url}}
                    />
                  </View>
                </>
              );
            }}
          />
          <Button title="Get data" onPress={() => getData()} />
        </View>
      ) : (
        <View>
          <Text>Error boss</Text>
        </View>
      )}
    </View>
  );
};

export default FlatlistPage;

const styles = StyleSheet.create({
  spinnerTextStyle: {
    color: '#FFF',
    elevation: 100,
    shadowColor: '#000',
  },
});
