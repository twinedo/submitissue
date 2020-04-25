import axios from 'axios';
import {AsyncStorage} from 'react-native';

const instance = axios.create({
  baseURL: 'https://d-trip.truckking.id',
});

instance.interceptors.request.use(
  async (config) => {
    // const token = await AsyncStorage.getItem('token');
    // if (token) {
    //   const tkn = JSON.parse(token);
    //   config.headers.Authorization = `Bearer ${tkn}`;
    // }

    config.headers.Authorization =
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX3JvbGUiOiJPcGVyYXRvciIsImF1ZCI6WyJhbGxzdG9yZSJdLCJjb21wYW55X2lkIjoiVEstVFJTQ01QLTIwMTkxMDA5MTgzNDUwMDAwMDAwMSIsInVzZXJfaWQiOiJUSy1UUlNVU1ItMjAxOTEwMDkxOTAwMTAwMDAwMDA1IiwidXNlcl9uYW1lIjoiaGFsc2V5LmdyYW5kZUBnbWFpbC5jb20iLCJzY29wZSI6WyJyZWFkIiwid3JpdGUiXSwiY29tcGFueV9uYW1lIjoiUFQuIEZhbGxpbiBVbml0ZWQiLCJleHAiOjE1ODE5NTkxNzEsImF1dGhvcml0aWVzIjpbIlRyYW5zcG9ydGVyIl0sImp0aSI6IjVhMzI3ZTIzLTgyODQtNDE0ZC05MWVmLWE3M2IxMzBlZmZkMSIsImNsaWVudF9pZCI6InRydWNraW5nY2xpZW50In0.tCr1iX1sbjihX6er7HrB6Y-DfsqYYWWf2otgoUaNduA';

    return config;
  },
  (err) => {
    return Promise.reject(err);
  },
);

export default instance;
