import Api, { METHOD } from "../apiController";
export const getUserRoleType = async () => {
  const res = await Api({
    method: METHOD.GET,
    url: "/session-user",
    // headers: { Authorization: token },
  });
  console.log(res);
  return res.data;
};
