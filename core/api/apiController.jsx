import axios from "axios";
let isRefresh = false;
const myAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

myAxios.interceptors.request.use(
  async (config) => {
    isRefresh =
      config.headers.common["X-Access-Token"] === undefined ? false : true;
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

myAxios.interceptors.response.use(
  async function (response) {
    if (isRefresh) {
      myAxios(config);
      return response;
    }
    return response;
  },
  async function (error) {
    return error.response;
  }
);

export const METHOD = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  PATCH: "PATCH",
  DELETE: "DELETE",
};

export default myAxios;
