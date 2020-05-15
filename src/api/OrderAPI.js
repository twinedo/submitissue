import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://dev.order.dejavu2.fiyaris.id',
  // baseURL: 'https://d-order.truckking.id',
});

instance.interceptors.request.use(
  async (config) => {
    config.headers.Authorization =
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX3JvbGUiOiJEcml2ZXIiLCJhdWQiOlsiYWxsc3RvcmUiXSwiY29tcGFueV9pZCI6IlRLLVRSU0NNUC0yMDE5MTAwOTE4MzQ1MDAwMDAwMDEiLCJ1c2VyX2lkIjoiVEstRFJWLTIwMTkxMDA5MTIwODEwMDAwMDAwNCIsInVzZXJfbmFtZSI6InRhbmFrYS55b2dpQHlhaG9vLmNvbSIsInNjb3BlIjpbInJlYWQiLCJ3cml0ZSJdLCJjb21wYW55X25hbWUiOiJQVC4gRmFsbGluIFVuaXRlZCIsImV4cCI6MTU4OTU2NTE1OCwiYXV0aG9yaXRpZXMiOlsiRHJpdmVyIl0sImp0aSI6ImVjN2E0ODcyLWIxNmQtNGQ4NC05YmUyLTUyOTg5MWU4ODRhMiIsImNsaWVudF9pZCI6InRydWNraW5nY2xpZW50In0.Fvc-hw5-dv0nmanYTeKHADfg5FEOIVYazV-iWOTlN2g';

    return config;
  },
  (err) => {
    return Promise.reject(err);
  },
);

export default instance;
