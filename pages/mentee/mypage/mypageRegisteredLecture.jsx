import * as cookie from "cookie";
import styles from "./mypageRegisteredLecture.module.scss";
import router from "next/router";
import { BottomTab, TopBar } from "../../../components/common";
import LectureBlock from "../../../components/mentee/myRegisteredLecture/LectureBlock";

import NoWrite from "../../../components/mentee/NoWrite";
import {
  getApprovedLectures,
  getNotApprovedLectures,
} from "../../../core/api/Mentee";

export const getServerSideProps = async (context) => {
  const token = cookie.parse(context.req.headers.cookie).accessToken;
  const role = cookie.parse(context.req.headers.cookie).role;
  const notApprovedLectures = await getNotApprovedLectures(token, 1);

  const approvedLectures = await getApprovedLectures(token, 1);

  return {
    props: { token, notApprovedLectures, approvedLectures, role },
  };
};

const MypageRegisteredLecture = ({
  token,
  notApprovedLectures,
  approvedLectures,
  role,
}) => {
  return (
    <section className={styles.LectureListSection}>
      <TopBar text={"구매한 강의"} />

      <div className={styles.finished}>
        <div className={styles.titleBox}>
          <h1 className={styles.title}>승인 예정 강의</h1>
        </div>
        {notApprovedLectures.content.length !== 0 ? (
          notApprovedLectures.content.map((lecture, idx) => (
            <LectureBlock key={idx} lecture={lecture} approved={false} />
          ))
        ) : (
          <NoWrite text={"구매한 강의가 없습니다."} />
        )}
      </div>

      <div className={styles.line} />

      <div className={styles.finished}>
        <div className={styles.titleBox}>
          <h1 className={styles.title}>승인 완료 강의</h1>
        </div>
        {approvedLectures.content.length !== 0 ? (
          approvedLectures.content.map((lecture, idx) => (
            <LectureBlock
              key={idx}
              lecture={lecture}
              approved={true}
              token={token}
            />
          ))
        ) : (
          <NoWrite text={"승인 완료된 강의가 없습니다."} />
        )}
      </div>

      <BottomTab num={[0, 0, 0, 1]} role={role} />
    </section>
  );
};

export default MypageRegisteredLecture;
