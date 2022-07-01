import axios from "axios";
import { getSession } from "next-auth/react";

let isRefresh = false;
const myAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

myAxios.interceptors.request.use(
  async (config) => {
    const defaultHeader = axios.defaults.headers.common.Authorization;
    console.log("header=====", defaultHeader);
    // if (session) {
    //   config.headers.common["Authorization"] = defaultHeader;
    // }
    return config;
  },
  (err) => {
    console.log(err);
    return Promise.reject(err);
  }
);

myAxios.interceptors.response.use(
  async function (response) {
    // if (isRefresh) {
    //   myAxios(config);
    //   return response;
    // }
    return response;
  },
  async function (error) {
    console.log(error.response);
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
