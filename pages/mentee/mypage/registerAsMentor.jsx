import { useState, useEffect } from "react";
import classNames from "classnames";
import router from "next/router";
import * as cookie from "cookie";
import styles from "../../mentor/mypage/editMentorInfo.module.scss";
import { BottomBlueBtn, TopBar } from "../../../components/common";
import InfoEditBox from "../../../components/mentor/mypage/infoEditBox";
import ChangeObject from "../../../utils/changeObject";
import { registerAsMentor } from "../../../core/api/Mentee/registerAsMentor";
import { ModalWithBackground, BasicModal } from "../../../components/common";

export const getServerSideProps = async (context) => {
  const token = cookie.parse(context.req.headers.cookie).accessToken;
  return {
    props: {
      token,
    },
  };
};

const RegisterAsMentor = ({ token }) => {
  const [bio, setBio] = useState("");
  const [career, setCareer] = useState({
    companyName: "",
    job: "",
    license: "",
    others: "",
  });
  const [edu, setEdu] = useState({
    educationLevel: "ELEMENTARY",
    major: "",
    others: "",
    schoolName: "",
  });
  const [modal, setModal] = useState(false);
  const [success, setSuccess] = useState(false);

  return (
    <section className={styles.editMentorInfoSection}>
      {modal && (
        <ModalWithBackground
          setModal={setModal}
          prevent={success ? true : false}
        >
          <BasicModal
            notice={success ? "등록에 성공했습니다." : "등록에 실패했습니다."}
            btnText={"확인"}
            modalStyle={"square"}
            btnClick={() => {
              setModal(false);
              if (success == true) router.back();
            }}
          />
        </ModalWithBackground>
      )}
      <TopBar text={"멘토로 등록"} />
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
          const res = await registerAsMentor(bio, career, edu, token);
          if (res == 200 || res == 201) setSuccess(true);
          else setSuccess(false);
          setModal(true);
        }}
      />
    </section>
  );
};
export default RegisterAsMentor;
