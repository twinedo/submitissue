import axios from 'axios';
// import AsyncStorage from '@react-native-community/async-storage';

const instance = axios.create({
  baseURL: 'https://d-trip.truckking.id',
});

instance.interceptors.request.use(
  async (config) => {
    // var token = await AsyncStorage.getItem('token');
    var token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX3JvbGUiOiJEcml2ZXIiLCJhdWQiOlsiYWxsc3RvcmUiXSwiY29tcGFueV9pZCI6IlRLLVRSU0NNUC0yMDE5MTAwOTE4MzQ1MDAwMDAwMDEiLCJ1c2VyX2lkIjoiVEstRFJWLTIwMTkxMDA5MTIwODEwMDAwMDAwNCIsInVzZXJfbmFtZSI6InRhbmFrYS55b2dpQHlhaG9vLmNvbSIsInNjb3BlIjpbInJlYWQiLCJ3cml0ZSJdLCJjb21wYW55X25hbWUiOiJQVC4gRmFsbGluIFVuaXRlZCIsImV4cCI6MTU5MTYzMjc5MSwiYXV0aG9yaXRpZXMiOlsiRHJpdmVyIl0sImp0aSI6IjFlOWFkZTE3LWE2YjgtNGFhMS1iN2JjLTQ1MGE1YWNjYTA4NCIsImNsaWVudF9pZCI6InRydWNraW5nY2xpZW50In0.3DhRp-JC7-CHwWe_yFpWKXSsE1CZ-sNzxq_fDHnVCZw';
    config.headers.Authorization = `Bearer ${token}`;

    return config;
  },
  (err) => {
    return Promise.reject(err);
  },
);

export default instance;
