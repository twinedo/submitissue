/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, FlatList} from 'react-native';
import ReasonCategoryAPI from '../api/ReasonCategoryAPI';
import RNPickerSelect from 'react-native-picker-select';
import {Picker} from '@react-native-community/picker';

const ReasonCategory = () => {
  const [category, setCategory] = useState([]);
  const [reason, setReason] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState();
  const [selectedReason, setSelectedReason] = useState();

  useEffect(() => {
    getCategoryList();
  }, []);

  const getCategoryList = async () => {
    await ReasonCategoryAPI.get('/trip/reasoncategorylist')
      .then((response) => {
        // console.log(response);
        setCategory(response.data);
      })
      .catch((err) => {
        alert(err);
      });
  };

  const setReasonFromCategory = async (itemValue) => {
    setSelectedCategory(itemValue);
    console.log(itemValue);
    await ReasonCategoryAPI.get('/trip/reason-category', {
      params: {
        reasonCategoryReasonTripName: itemValue,
      },
    })
      .then((response) => {
        console.log(response.data.reasonTrip);
        setReason(response.data.reasonTrip);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <View style={{margin: 10}}>
      <Text>Pilih Reason Category</Text>

      <Picker
        selectedValue={selectedCategory}
        style={{
          height: 50,
          width: '100%',
        }}
        prompt="Select Reason Category"
        onValueChange={(itemValue, itemIndex) =>
          setReasonFromCategory(itemValue)
        }>
        {category.map((catTripName) => {
          return (
            <Picker.Item
              label={catTripName.reasonCategoryTripName}
              value={catTripName.reasonCategoryTripName}
            />
          );
        })}
      </Picker>

      <Text>Pilih Reason</Text>

      <Picker
        selectedValue={selectedReason}
        style={{
          height: 50,
          width: '100%',
        }}
        prompt="Select Reason"
        onValueChange={(itemValue, itemIndex) => setSelectedReason(itemValue)}>
        {reason.map((reasonTripName) => {
          return (
            <Picker.Item
              label={reasonTripName.reasonTripName}
              value={reasonTripName.reasonTripName}
            />
          );
        })}
      </Picker>
    </View>
  );
};

export default ReasonCategory;

const styles = StyleSheet.create({});
