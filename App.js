import React from 'react';
import {StyleSheet, View} from 'react-native';
import AllComponent from './src/pages/AllComponent';
import ReasonCategory from './src/pages/ReasonCategory';
import AddImage from './src/pages/AddImage';
import ImageCropper from './src/pages/ImageCropper';

const App = () => {
  return (
    <View>
      {/*<AllComponent />*/}
      {/* <ReasonCategory />*/}
      {/* <AddImage /> */}
      <ImageCropper />
    </View>
  );
};

export default App;

const styles = StyleSheet.create({});
