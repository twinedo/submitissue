/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StatusBar,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import ReasonCategoryAPI from '../api/ReasonCategoryAPI';


const AllComponent = () => {
  const [state, setState] = useState({
    category: '',
    reason: '',
    description: '',
    image: [
      {
        issueProofPhoto: [
          {
            issueProofAssignedTripID: '',
            issueProofIssueTripID: '',
            issueProofPhoto: '',
          },
        ],
      },
    ],
  });

  const [pic, setPic] = useState([
    {
      key: '0',
      value: '',
    },
  ]);

  const [stateReasonCategory, setStateReasonCategory] = useState({
    response: '',
  });

  const dataCategory = {
    category: 'Incident',
  };

  useEffect(() => {
    getReasonCategory();
  }, []);

  const getReasonCategory = async () => {
    await ReasonCategoryAPI.get('/trip/reasoncategorylist')
      .then((response) => {
        console.log(response.data);

        response.data.map((test) => {

          console.log(test.reasonCategoryTripName);
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const valueCategory = (value) => {
    console.log(value);

    setState({
      ...state,
      category: value,
    });
  };

  const ValueReason = (value) => {
    console.log(value);
    setState({
      ...state,
      reason: value,
    });
  };

  const ValueDescription = (value) => {
    console.log(value);
    setState({
      ...state,
      description: value,
    });
  };

  const pressHandler = (key) => {
    setPic((prevPic) => {
      return prevPic.filter((picture) => picture.key !== key);
    });
  };

  const addFoto = () => {
    let newArray = [];

    // setState({
    //   ...state,
    //   image: pic.map((val) => val.value),
    // });

    setPic([
      ...pic,
      {
        key: (Math.random() + 1).toString(),
        value: state.description,
      },
    ]);

    const abc = [...pic.map((val) => val.value)];

    setState({
      ...state,
      image: abc,
    });

    newArray.concat(...pic.map((val) => val.value));
    console.log(pic);
  };

  const SubmitHandler = () => {
    // const newArray = [];
    const abc = pic.map((val) => val.value);
    // console.log('ini data value dari pic' + abc);

    setState({
      ...state,
      // image: pic.map((val) => val.value),
      image: abc,
    });
    console.log(state);
    console.log('ini state' + JSON.stringify(state));
    console.log(stateReasonCategory);
  };

  return (
    <>
      {/* Status Bar */}
      <StatusBar backgroundColor="#19B2FF" />

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
            <RNPickerSelect
              onValueChange={(value) => valueCategory(value)}
              placeholder={placeholderCategory}
              items={[
                {label: 'Incident', value: 'Incident'},
                {label: 'Unable To Unload', value: 'Unable To Unload'},
                {label: 'Goods Refused', value: 'Goods Refused'},
                {label: 'Information', value: 'Information'},
                {label: 'Warning', value: 'Warning'},
              ]}
            />
            {/*<RNPickerSelect
              onValueChange={(value) => valueCategory(value)}
              placeholder={placeholderCategory}
              items={[
                {
                  label: stateReasonCategory.reasonCategoryTripName,
                  value: stateReasonCategory.reasonCategoryTripName,
                },
              ]}
            />*/}
          </View>
          <Text style={styles.title}>Reason</Text>
          <View style={styles.viewPicker}>
            <RNPickerSelect
              onValueChange={(value) => ValueReason(value)}
              placeholder={placeholderReason}
              items={[
                {label: 'Heavy Traffic', value: 'Heavy Traffic'},
                {label: 'Broken Vehicle', value: 'Broken Vehicle'},
                {label: 'Flat Tire', value: 'Flat Tire'},
                {label: 'Accident', value: 'Accident'},
              ]}
            />
          </View>

          <Text style={styles.title}>Description</Text>
          <TextInput
            style={styles.textInput}
            multiline={true}
            placeholder="Describe Issue"
            onChangeText={ValueDescription}
          />
          <Text style={styles.title}>Add Image</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={{alignSelf: 'center'}}>
              <FlatList
                data={pic}
                horizontal
                renderItem={({item, index}) => {
                  return (
                    <>
                      {index === 0 ? null : (
                        <TouchableOpacity
                          key={item.key}
                          onPress={() => pressHandler(item.key)}
                          style={{
                            width: 50,
                            height: 50,
                            borderWidth: 2,
                            borde000rColor: 'red',
                            alignSelf: 'center',
                            marginHorizontal: 3,
                            borderRadius: 4,
                          }}>
                          <Text>{item.value}</Text>
                        </TouchableOpacity>
                      )}
                    </>
                  );
                }}
              />
            </View>
            {pic.length === 6 ? null : (
              <TouchableOpacity onPress={addFoto}>
                <Image source={require('../assets/addImage.png')} />
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={SubmitHandler}>
            <Text style={styles.textButton}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

const placeholderCategory = {
  label: 'Select Reason Category...',
  color: 'red',
};

const placeholderReason = {
  label: 'Select Reason...',
  color: 'red',
};

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
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    marginVertical: 8,
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
  submitButton: {
    marginTop: 16,
    backgroundColor: '#FF2500',
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  textButton: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
});

export default AllComponent;

// {item.key === '0' && pic.length === 5 ? null : (
//     <TouchableOpacity
//       key={item.key}
//       onPress={() => handleDelete(item.key)}>
//       <Image
//         style={{
//           height: 10,
//           width: 10,
//           marginLeft: 4,
//           marginTop: 4,
//           zIndex: 10,
//           alignSelf: 'flex-end',
//           ...StyleSheet.absoluteFillObject,
//         }}
//         source={require('./src/assets/delete.png')}
//       />
//     </TouchableOpacity>
//   )}
