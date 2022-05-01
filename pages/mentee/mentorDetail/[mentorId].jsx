import * as cookie from "cookie";
import GetViewMentor from "../../../core/api/Mentor/getViewMentor";
import { getMentorLectureList } from "../../../core/api/Mentor/getMentorLectureList";
import styles from "../../mentor/mypage/mentorIntroduction.module.scss";
import { BottomTab, MenuBtn, TopBar } from "../../../components/common";
import Image from "next/image";
import MentorInfo from "./MentorInfo";
import MentorLecture from "./MentorLecture";
import { useState } from "react";
import router from "next/router";

export async function getServerSideProps(context) {
  const token = cookie.parse(context.req.headers.cookie).accessToken;
  const params = context.query;
  params.id = params.mentorId;

  const mentorData = await GetViewMentor(token, params.id);
  const mentorLectureList = await getMentorLectureList(token, params.id);

  return {
    props: {
      mentorData: JSON.parse(JSON.stringify(mentorData)),
      lectureListData: JSON.parse(JSON.stringify(mentorLectureList)),
    },
  };
}

const MentorCon = ({ mentorData, lectureListData }) => {
  const [tabCurrent, setTabCurrent] = useState(0);

  const onClick = (idx) => {
    setTabCurrent(idx);
  };

  const tabMenu = ["멘토", "강의내역", "멘티 후기", ""];
  const user = mentorData.user;

  return (
    <section className={styles.mentorIntroductionSection}>
      <TopBar
        onClick={() => {
          router.back();
        }}
      />
      <section className={styles.basicInfo}>
        <article className={styles.mentorInfoCon}>
          <div className={styles.mentorImg}>
            <Image
              src={user.image ? user.image : "/samples/lecture.png"}
              className={styles.mentorImg}
              alt={user.name}
              width={88}
              height={88}
            />
          </div>

          <div>
            <p>
              <span className={styles.role}>멘토</span>
              <span className={styles.mentorName}>{user.nickname}</span>
            </p>
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
      {tabCurrent === 2 && <div>ㅎㅎㅎㅎ</div>}

      <BottomTab num={[0, 0, 0, 1]} />
    </section>
  );
};

export default MentorCon;