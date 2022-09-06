import Image from "next/image";
import router from "next/router";
import classNames from "classnames";
import styles from "./classReview.module.scss";
import { BasicBtn, basicBtnStyle } from "../../common";
import { deleteMentorReview } from "../../../core/api/Lecture";
import RefreshPage from "../../../utils/refreshPage";
import { Rating } from "./rating";
import { IC_PersonBlue } from "../../../icons";

const MenteeReview = ({ data, onClick }) => {
  console.log(data)
  return (
    <section className={styles.menteeReviewSection} onClick={onClick}>
      <div className={styles.menteeProfileBlock}>
        <div className={styles.profileImg}>
          {data?.userImage ? (
            <Image src={data?.userImage} width={32} height={32} />
          ) : (
            <IC_PersonBlue width={32} height={32} />
          )}
        </div>

        <div className={styles.alignColumn}>
          <span className={styles.name}>{data.userNickname}</span>
          <Rating w={55} h={11} fillRating={data.score} />
        </div>

        <span className={styles.date}>{data?.createdAt?.slice(0, 10)}</span>
      </div>

      <p className={styles.contentBlock}>{data.content}</p>
    </section>
  );
};

const MentorReview = ({ token, cid, mentee, data, role }) => {
  return (
    <section className={styles.mentorReviewSection}>
      <div className={styles.mentorProfileBlock}>
        <div className={styles.profileImg}>
          {data?.userImage ? (
            <Image src={data?.userImage} width={32} height={32} />
          ) : (
            <IC_PersonBlue width={32} height={32} />
          )}
        </div>
        {role === "ROLE_MENTEE" ? (
          <div></div>
        ) : (
          <div className={styles.textBtnSection}>
            <BasicBtn
              text={"수정"}
              onClick={() =>
                router.push(
                  `/mentor/myclass/classDetail/${cid}/review/${mentee.menteeReviewId}`
                )
              }
              btnStyle={classNames(
                basicBtnStyle.btn_transparent,
                styles.textBtn
              )}
            />

            <BasicBtn
              text={"삭제"}
              onClick={async () => {
                await deleteMentorReview(
                  token,
                  cid,
                  mentee.menteeReviewId,
                  data.mentorReviewId
                );
                RefreshPage();
              }}
              btnStyle={classNames(
                basicBtnStyle.btn_transparent,
                styles.textBtn
              )}
            />
          </div>
        )}

        <div className={styles.alignColumn}>
          <span className={styles.name}>{data.userNickname}</span>
          <span className={styles.date}>{data.createdAt.substring(0, 10)}</span>
        </div>
      </div>

      <p className={styles.contentBlock}>{data.content} </p>
    </section>
  );
};

const ClassReview = ({ token, cid, mentee, role }) => {
  const child = mentee?.child;
  
  return (
    <section
      className={
        child?.mentorReviewId
          ? styles.classReviewSectionNoCursor
          : styles.classReviewSection
      }
    >
      <MenteeReview
        data={mentee}
        onClick={() => {
          if (child?.mentorReviewId) {
            router.push(
              `/mentor/myclass/classDetail/${cid}/review/${mentee.menteeReviewId}`
            );
          }
        }}
      />
      {child?.mentorReviewId ? (
        <MentorReview
          token={token}
          cid={cid}
          mentee={mentee}
          data={child}
          role={role}
        />
      ) : (
        <></>
      )}
    </section>
  );
};

export { MenteeReview, MentorReview };
export default ClassReview;
