import qs from "qs";
import Api, { METHOD } from "../apiController";

export const getLecture = async (data) => {
  const res = await Api({
    method: METHOD.GET,
    // headers: { Authorization: token },
    url: "/lectures",
    params: data,
    paramsSerializer: (params) => {
      return qs.stringify(params, { arrayFormat: "repeat" });
    },
  });

  return res.data;
};
