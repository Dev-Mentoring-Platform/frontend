import * as cookie from "cookie";
import { getViewMentor, getMentorLectureList } from "../../../core/api/Mentor";
import styles from "../../mentor/mypage/mentorIntroduction.module.scss";
import { BottomTab, MenuBtn, TopBar } from "../../../components/common";
import Image from "next/image";
import MentorInfo from "./MentorInfo";
import MentorLecture from "./MentorLecture";
import { useState, useEffect } from "react";
import router from "next/router";
import MentorReview from "./MentorReview";
import { IC_PersonBlue } from "../../../icons";

export async function getServerSideProps(context) {
  const token = cookie.parse(context.req.headers.cookie).accessToken;
  const params = context.query.mentorId;

  const mentorData = await getViewMentor(params);
  const mentorLectureList = await getMentorLectureList(params);

  return {
    props: {
      token,
      params,
      mentorData: JSON.parse(JSON.stringify(mentorData)),
      lectureListData: JSON.parse(JSON.stringify(mentorLectureList)),
    },
  };
}

const MentorCon = ({ mentorData, lectureListData, params, token }) => {
  const [tabCurrent, setTabCurrent] = useState(0);

  const onClick = (idx) => {
    setTabCurrent(idx);
    localStorage.setItem("mentor tab", JSON.stringify(idx));
  };

  const tabMenu = ["멘토", "강의내역", "멘티 후기", ""];
  const user = mentorData.user;

  useEffect(() => {
    const tab = JSON.parse(localStorage.getItem("mentor tab"));
    if (tab) {
      setTabCurrent(tab);
    }
  }, []);

  return (
    <section className={styles.mentorIntroductionSection}>
      <TopBar />

      <section className={styles.basicInfo}>
        <article className={styles.mentorInfoCon}>
          <div className={styles.mentorImgInfo}>
            {user.image ? (
              <Image
                src={user.image}
                className={styles.mentorImg}
                alt={user.name}
                width={"88px"}
                height={"88px"}
              />
            ) : (
              <IC_PersonBlue width={88} height={88} />
            )}
          </div>

          <div>
            <div>
              <p>
                <span className={styles.role}>멘토</span>
                <span className={styles.mentorName}>{user.nickname}</span>
              </p>
            </div>
            <div>
              <p className={styles.menteeCount}>
                누적멘티{" "}
                <span className={styles.menteeNumber}>
                  {mentorData.accumulatedMenteeCount}
                </span>
                명
              </p>
            </div>
          </div>
        </article>
        <article className={styles.mentorCon}>
          <p>{mentorData.bio === "" ? "-" : mentorData.bio}</p>
        </article>
      </section>
      <span className={styles.line} />
      <div className={styles.category} style={{ marginBottom: "11px" }}>
        {tabMenu.map((tab, i) => (
          <MenuBtn
            text={tab}
            key={i}
            selected={tabCurrent === i ? true : false}
            onClick={() => {
              if (i < 3) {
                onClick(i);
              }
            }}
          />
        ))}
      </div>
      {/* {
        {
          0: <MentorInfo mentorData={mentorData} />,
          1: <div>test</div>,
          2: <div>test111</div>,
        }[tabCurrent]
      } */}

      {tabCurrent === 0 && <MentorInfo mentorData={mentorData} />}
      {tabCurrent === 1 && <MentorLecture lectureListData={lectureListData} />}
      {tabCurrent === 2 && <MentorReview token={token} params={params} />}

      <BottomTab num={[0, 0, 0, 1]} role={"ROLE_MENTEE"} />
    </section>
  );
};

export default MentorCon;
