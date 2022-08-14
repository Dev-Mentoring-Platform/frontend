import router from "next/router";
import * as cookie from "cookie";
import styles from "./mentorIntroduction.module.scss";
import { TopBar, BottomTab } from "../../../components/common";
import MyPageInfoLine from "../../../components/mentor/mypage/mypageInfoLine";
import { TransEduLevelToKor } from "../../../components/mentor/transform";
import { IC_EditFill } from "../../../icons";
import { getMyInfoAsMentor } from "../../../core/api/Mentor";
import { getCookie } from "../../../utils/cookie";

export const getServerSideProps = async (context) => {
  const token = cookie.parse(context.req.headers.cookie).accessToken;
  const myInfo = await getMyInfoAsMentor(token);
  const myInfoAsMentor = myInfo == null ? "" : myInfo;
  return {
    props: {
      myInfoAsMentor,
    },
  };
};

const MentorIntroduction = ({ myInfoAsMentor }) => {
  const user = myInfoAsMentor.user;
  const careers = myInfoAsMentor.careers[0];
  const edu = myInfoAsMentor.educations[0];
  const bio = myInfoAsMentor.bio;

  const now = new Date();

  return (
    <section className={styles.mentorIntroductionSection}>
      <TopBar text={"멘토 소개"} />

      <section className={styles.basicInfo}>
        <h1 className={styles.title}>기본정보</h1>
        <div className={styles.profile}>
          <div>
            <MyPageInfoLine
              title={"나이"}
              content={now.getFullYear() - user.birthYear + 1}
            />
            <MyPageInfoLine title={"성별"} content={user.gender} />
            <MyPageInfoLine title={"이메일"} content={user.username} />
            <MyPageInfoLine title={"주소"} content={user.zone} />
          </div>
        </div>
      </section>
      <span className={styles.line} />

      <section className={styles.additionalInfo}>
        <h1 className={styles.title}>학력정보</h1>
        <div>
          <MyPageInfoLine
            title={"최종학력"}
            content={TransEduLevelToKor(edu.educationLevel)}
          />
          <MyPageInfoLine title={"학교명"} content={edu.schoolName} />
          <MyPageInfoLine title={"전공명"} content={edu.major} />
          <MyPageInfoLine title={"그 외 학력"} content={edu.others} />
        </div>
      </section>

      <section className={styles.additionalInfo}>
        <h1 className={styles.title}>경력정보</h1>
        <div>
          <MyPageInfoLine title={"직업"} content={careers.job} />
          <MyPageInfoLine title={"직장명"} content={careers.companyName} />
          <MyPageInfoLine title={"그 외 경력"} content={careers.others} />
          <MyPageInfoLine title={"자격증"} content={careers.license} />
        </div>
      </section>

      <section className={styles.additionalInfo}>
        <h1 className={styles.title}>소개</h1>
        <span>{bio == "" || bio == null ? "-" : bio}</span>
      </section>

      <button
        type="button"
        className={styles.editBtn}
        onClick={() => router.push("/mentor/mypage/editMentorInfo")}
      >
        <IC_EditFill width="26.36" height="26.36" />
      </button>
      <BottomTab num={[0, 0, 0, 1]} role={"ROLE_MENTOR"} />
    </section>
  );
};

export default MentorIntroduction;
