import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://dev.order.dejavu2.fiyaris.id',
  // baseURL: 'https://d-order.truckking.id',
});

instance.interceptors.request.use(
  async (config) => {
    config.headers.Authorization =
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX3JvbGUiOiJEcml2ZXIiLCJhdWQiOlsiYWxsc3RvcmUiXSwiY29tcGFueV9pZCI6IlRLLVRSU0NNUC0yMDE5MTAwOTE4MzQ1MDAwMDAwMDEiLCJ1c2VyX2lkIjoiVEstRFJWLTIwMTkxMDA5MTIwODEwMDAwMDAwNCIsInVzZXJfbmFtZSI6InRhbmFrYS55b2dpQHlhaG9vLmNvbSIsInNjb3BlIjpbInJlYWQiLCJ3cml0ZSJdLCJjb21wYW55X25hbWUiOiJQVC4gRmFsbGluIFVuaXRlZCIsImV4cCI6MTU4OTUwMDM0MywiYXV0aG9yaXRpZXMiOlsiRHJpdmVyIl0sImp0aSI6IjRiODBiMzNiLTg5OTMtNGFjNS05ODg3LTdkMjE0N2E4YTRkMiIsImNsaWVudF9pZCI6InRydWNraW5nY2xpZW50In0.WFVdP2SClu6FJDfuiACtZV6EBThSPJum9zAJvRrBYK0';

    return config;
  },
  (err) => {
    return Promise.reject(err);
  },
);

export default instance;
