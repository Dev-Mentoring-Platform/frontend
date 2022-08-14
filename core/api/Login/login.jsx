import Api, { METHOD } from "../apiController";
export const login = async (id, pw) => {
  const res = await Api({
    method: METHOD.POST,
    url: "/login",
    data: { password: pw, username: id },
  });
  return res;
};
