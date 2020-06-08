import React from 'react';
import {StyleSheet, View} from 'react-native';
import FixSubmit from './src/pages/FixSubmit';
import FixSubmit2 from './src/pages/FixSubmit2';
import SeeIssue from './src/pages/SeeIssue';
import ActiveTaskUnloading from './src/pages/ActiveTaskUnloading';
import ActiveTaskDropOff from './src/pages/ActiveTaskDropOff4';
import UpdatePOD from './src/pages/UpdatePOD';

console.disableYellowBox = true;
const App = () => {
  return (
    <>
      {/* <ActiveTaskUnloading /> */}
      {/* <UpdatePOD /> */}
      {/* <ActiveTaskDropOff /> */}
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
