import axios from 'axios';
import {AsyncStorage} from 'react-native';

const instance = axios.create({
  baseURL: 'https://d-storage.truckking.id',
});

export default instance;
