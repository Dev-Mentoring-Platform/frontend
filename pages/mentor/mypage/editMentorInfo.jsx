import { useState } from "react";
import classNames from "classnames";
import router from "next/router";
import * as cookie from "cookie";
import styles from "./editMentorInfo.module.scss";
import { BottomBlueBtn, TopBar } from "../../../components/common";
import InfoEditBox from "../../../components/mentor/mypage/infoEditBox";
import { TransEduLevelToKor } from "../../../components/mentor/transform";
import {
  getMyInfoAsMentor,
  editMyInfoAsMentor,
} from "../../../core/api/Mentor";
import ChangeObject from "../../../utils/changeObject";

export const getServerSideProps = async (context) => {
  const token = cookie.parse(context.req.headers.cookie).accessToken;
  const myInfoAsMentor = await getMyInfoAsMentor(token);
  const myBio = myInfoAsMentor.bio;
  const myCareer = myInfoAsMentor.careers[0];
  const myEdu = myInfoAsMentor.educations[0];
  const myNewEdu = {
    ...myEdu,
    educationLevel: TransEduLevelToKor(myEdu.educationLevel),
  };

  return {
    props: {
      token,
      myBio,
      myCareer,
      myNewEdu,
    },
  };
};

const EditMentorInfo = ({ token, myBio, myCareer, myNewEdu }) => {
  const [bio, setBio] = useState(myBio);
  const [career, setCareer] = useState(myCareer);
  const [edu, setEdu] = useState(myNewEdu);

  return (
    <section className={styles.editMentorInfoSection}>
      <TopBar text={"멘토 정보 수정"} />
      <div className={styles.editInfoBlock}>
        <h1 className={styles.editInfoTitle}>학력정보</h1>
        <InfoEditBox
          title={"최종학력"}
          value={edu.educationLevel}
          ownStyle={styles.firstBox}
          makeChange={(e) => ChangeObject(setEdu, "educationLevel", e)}
        />
        <InfoEditBox
          title={"학교 명"}
          value={edu.schoolName}
          makeChange={(e) => ChangeObject(setEdu, "schoolName", e)}
        />
        <InfoEditBox
          title={"전공 명"}
          value={edu.major}
          makeChange={(e) => ChangeObject(setEdu, "major", e)}
        />
        <InfoEditBox
          title={"그 외 학력"}
          value={edu.others}
          ownStyle={styles.lastBox}
          makeChange={(e) => ChangeObject(setEdu, "others", e)}
        />
      </div>

      <div className={styles.editInfoBlock}>
        <h1 className={styles.editInfoTitle}>경력정보</h1>
        <InfoEditBox
          title={"직업"}
          value={career.companyName}
          ownStyle={styles.firstBox}
          makeChange={(e) => ChangeObject(setCareer, "companyName", e)}
        />
        <InfoEditBox
          title={"직장 명"}
          value={career.job}
          makeChange={(e) => ChangeObject(setCareer, "job", e)}
        />
        <InfoEditBox
          title={"자격증"}
          value={career.license}
          makeChange={(e) => ChangeObject(setCareer, "license", e)}
        />
        <InfoEditBox
          title={"그 외 경력"}
          value={career.others}
          ownStyle={styles.lastBox}
          makeChange={(e) => ChangeObject(setCareer, "others", e)}
        />
      </div>

      <div className={styles.editInfoBlock}>
        <h1 className={styles.editInfoTitle}>소개</h1>
        <InfoEditBox
          title={"소개"}
          value={bio}
          ownStyle={classNames(styles.firstBox, styles.lastBox)}
          makeChange={(e) => setBio(e.target.value)}
        />
      </div>

      <BottomBlueBtn
        text={"저장"}
        onClick={async () => {
          const res = await editMyInfoAsMentor(bio, career, edu, token);
          if (res == 200) {
            router.push("/mentor/mypage/mentorIntroduction");
          }
        }}
      />
    </section>
  );
};
export default EditMentorInfo;
