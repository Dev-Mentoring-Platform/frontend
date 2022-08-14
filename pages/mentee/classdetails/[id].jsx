import React from "react";
import BottomNavBar from "../../../components/mentee/classdetails/BottomNavBar";
import LectureImage from "../../../components/mentee/classdetails/LectureImage";
import LectureTitle from "../../../components/mentee/classdetails/LectureTitle";
import TopMenu from "../../../components/mentee/classdetails/TopMenu";
import * as cookie from "cookie";
import styles from "./classdetails.module.scss";
import { getLectureDetails, getMenteeReview } from "../../../core/api/Mentee";

const ClassDetails = ({ token, classData, reviewData, params, role }) => {
  return (
    <section className={styles.container}>
      <TopMenu />
      <LectureImage classData={classData} params={params.mentorId} />
      <LectureTitle classData={classData} reviewData={reviewData} role={role} />
      <BottomNavBar classData={classData} token={token} params={params} />
    </section>
  );
};

export async function getServerSideProps(context) {
  const token = cookie.parse(context.req.headers.cookie).accessToken;
  const role = cookie.parse(context.req.headers.cookie).role;

  const params = context.query;

  const classData = await getLectureDetails(params);
  const reviewData = await getMenteeReview(params);

  return {
    props: {
      token,
      params,
      role,
      classData,
      reviewData,
    },
  };
}

export default ClassDetails;
