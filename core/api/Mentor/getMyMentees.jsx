import Api, { METHOD } from "../apiController";
export const getMyMentees = async (closed, token) => {
  const res = await Api({
    method: METHOD.GET,
    url: `/mentors/my-mentees?closed=${closed}`,
    headers: {
      Authorization: token,
    },
  });
  return res.data;
};

export const getMenteeLecture = async (token, mentee, enrollmentID) => {
  const res = await Api({
    method: METHOD.GET,
    url: `/mentors/my-mentees/${mentee}/enrollments/${enrollmentID}?&page=1`,
    headers: { Authorization: token },
  });
  return res.data;
};

export const getUncheckedLecture = async (token) => {
  const res = await Api({
    method: METHOD.GET,
    url: "mentors/my-mentees/unchecked",
    headers: { Authorization: token },
  });
  return res.data;
};
