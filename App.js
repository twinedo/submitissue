import React from 'react';
import {StyleSheet, View} from 'react-native';
import AllComponent from './src/pages/AllComponent';
import ReasonCategory from './src/pages/ReasonCategory';
import ImageCropper2 from './src/pages/ImageCropper2';
import FixSubmit from './src/pages/FixSubmit';
import FixSubmit2 from './src/pages/FixSubmit2';
import SeeIssue from './src/pages/SeeIssue';

console.disableYellowBox = true;
const App = () => {
  return (
    <>
      <SeeIssue />
      {/* <FixSubmit2 /> */}
      {/*<AllComponent />*/}
      {/* <ReasonCategory /> */}
      {/* <ImageCropper2 /> */}
    </>
  );
};

export default App;

const styles = StyleSheet.create({});
