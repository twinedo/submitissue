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
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX3JvbGUiOiJPcGVyYXRvciIsImF1ZCI6WyJhbGxzdG9yZSJdLCJjb21wYW55X2lkIjoiVEstVFJTQ01QLTIwMTkxMDA5MTgzNDUwMDAwMDAwMSIsInVzZXJfaWQiOiJUSy1UUlNVU1ItMjAxOTEwMDkxOTAwMTAwMDAwMDA1IiwidXNlcl9uYW1lIjoiaGFsc2V5LmdyYW5kZUBnbWFpbC5jb20iLCJzY29wZSI6WyJyZWFkIiwid3JpdGUiXSwiY29tcGFueV9uYW1lIjoiUFQuIEZhbGxpbiBVbml0ZWQiLCJleHAiOjE1ODUyMzY0MTUsImF1dGhvcml0aWVzIjpbIlRyYW5zcG9ydGVyIl0sImp0aSI6ImYzYWYxMTczLTFlNjEtNDlhYS1hMzU4LTRjYjE0OTgxMTZlZSIsImNsaWVudF9pZCI6InRydWNraW5nY2xpZW50In0.fjZtLvpIVjxqtD0k2zchhjd7QtDbhw1wLtIdFUGnnaw';

    return config;
  },
  (err) => {
    return Promise.reject(err);
  },
);

export default instance;
