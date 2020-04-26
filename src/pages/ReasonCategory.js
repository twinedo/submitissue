/* eslint-disable no-alert */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState, useReducer} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  ActivityIndicator,
} from 'react-native';
import ReasonCategoryAPI from '../api/ReasonCategoryAPI';
import RNPickerSelect from 'react-native-picker-select';
import {Picker} from '@react-native-community/picker';

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

const ReasonCategory = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    getCategoryList();
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

  const submitHandler = () => {
    console.log(
      'data yg dikirim: \n',
      'category: ' + state.selectedCategory + '\n',
      'reason: ' + state.selectedReason + '\n',
      'description: ' + state.description + '\n',
    );
  };

  return (
    <View style={{margin: 10}}>
      {state.loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <Text style={styles.title}>Reason Category</Text>
          <View style={styles.viewPicker}>
            <Picker
              selectedValue={state.selectedCategory}
              style={{
                height: 50,
                width: '100%',
              }}
              prompt="Select Reason Category"
              onValueChange={(itemValue) => setReasonFromCategory(itemValue)}>
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
          <Button title="Submit" onPress={submitHandler} />
        </>
      )}
    </View>
  );
};

export default ReasonCategory;

const styles = StyleSheet.create({
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
});
