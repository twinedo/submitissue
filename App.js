import React from 'react';
import {StyleSheet, View} from 'react-native';
import AllComponent from './src/pages/AllComponent';
import ReasonCategory from './src/pages/ReasonCategory';
import AddImage from './src/pages/AddImage';
import ImageCropper from './src/pages/ImageCropper';
import ImageCropper2 from './src/pages/ImageCropper2';
import FixSubmit from './src/pages/FixSubmit';

const App = () => {
  return (
    <>
      <FixSubmit />
      {/*<AllComponent />*/}
      {/* <ReasonCategory /> */}
      {/* <AddImage /> */}
      {/* <ImageCropper2 /> */}
    </>
  );
};

export default App;

const styles = StyleSheet.create({});
