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
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX3JvbGUiOiJEcml2ZXIiLCJhdWQiOlsiYWxsc3RvcmUiXSwiY29tcGFueV9pZCI6IlRLLVRSU0NNUC0yMDE5MTAwOTE4MzQ1MDAwMDAwMDEiLCJ1c2VyX2lkIjoiVEstRFJWLTIwMTkxMDA5MTIwODEwMDAwMDAwNCIsInVzZXJfbmFtZSI6InRhbmFrYS55b2dpQHlhaG9vLmNvbSIsInNjb3BlIjpbInJlYWQiLCJ3cml0ZSJdLCJjb21wYW55X25hbWUiOiJQVC4gRmFsbGluIFVuaXRlZCIsImV4cCI6MTU4ODY1OTI1MiwiYXV0aG9yaXRpZXMiOlsiRHJpdmVyIl0sImp0aSI6IjViZDdjYmIyLTZhMjEtNGExOC1hNzcxLTYyNTYzMTUwZDQ4MyIsImNsaWVudF9pZCI6InRydWNraW5nY2xpZW50In0.E2pSQcTQqe14OTCZPUcjq-3sluhcP6zvZZx3FoBz2bc';

    return config;
  },
  (err) => {
    return Promise.reject(err);
  },
);

export default instance;
