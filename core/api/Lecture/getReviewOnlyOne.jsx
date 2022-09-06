import Api, { METHOD } from "../apiController";

export const getReviewOnlyOne = async (classID, reviewID) => {
  console.log(classID, reviewID)
  const res = await Api({
    method: METHOD.GET,
    url: `/mentors/my-lectures/${classID}/reviews/${reviewID}`,
  });

  return res.data;
};
