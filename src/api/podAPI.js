import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://dev.order.dejavu2.fiyaris.id',
  // baseURL: 'https://d-order.truckking.id',
});

instance.interceptors.request.use(
  async (config) => {
    config.headers.Authorization =
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX3JvbGUiOiJEcml2ZXIiLCJhdWQiOlsiYWxsc3RvcmUiXSwiY29tcGFueV9pZCI6IlRLLVRSU0NNUC0yMDE5MTAwOTE4MzQ1MDAwMDAwMDEiLCJ1c2VyX2lkIjoiVEstRFJWLTIwMTkxMDA5MTIwODEwMDAwMDAwNCIsInVzZXJfbmFtZSI6InRhbmFrYS55b2dpQHlhaG9vLmNvbSIsInNjb3BlIjpbInJlYWQiLCJ3cml0ZSJdLCJjb21wYW55X25hbWUiOiJQVC4gRmFsbGluIFVuaXRlZCIsImV4cCI6MTU5MjQ4OTI2NiwiYXV0aG9yaXRpZXMiOlsiRHJpdmVyIl0sImp0aSI6ImE0MzFlMjJkLTc4ZDktNDM4Yy04YTljLTkzODQ3YTQ1MTk5ZSIsImNsaWVudF9pZCI6InRydWNraW5nY2xpZW50In0.HqZXwyCeiV4f7iz1tzMD_Q2s4awLUCqRdEPwXM8r7fc';

    return config;
  },
  (err) => {
    return Promise.reject(err);
  },
);

export default instance;
