import classNames from "classnames";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import { approveLecture } from "../../../core/api/Mentee";
import { IC_WriteReview } from "../../../icons";
import { basicBtnStyle } from "../../common";
import styles from "./LectureBlock.module.scss";

const LectureBlock = ({ lecture, approved, token }) => {
  const router = useRouter();
  console.log(lecture, approved);
  return (
    <div className={styles.lectureBlock}>
      <div className={styles.lectureInfo}>
        <div className={styles.lectureImg}>
          <Image
            src={lecture.thumbnail || "/samples/lecture.png"}
            width={84}
            height={84}
            alt="thumbnail"
          />
        </div>
        <div className={styles.lectureInfoText}>
          <h1 className={styles.title}>{lecture.title}</h1>
          <span className={styles.classSystem}>
            {lecture.lectureMentor.nickname}
          </span>
          <span
            className={styles.price}
          >{`${lecture.lecturePrice.totalPrice.toLocaleString()}원`}</span>
        </div>
      </div>
      {approved ? (
        <div className={styles.btnSection}>
          <button
            type="button"
            className={classNames(
              styles.btnForlectureBlock,
              basicBtnStyle.btn_bg_color
            )}
            disabled={lecture.reviewed}
            onClick={() =>
              router.push({
                pathname: `/mentee/mypage/menteeReview/review/${lecture.enrollmentId}`,
              })
            }
          >
            <span>후기 작성</span>
          </button>
          <button
            type="button"
            className={classNames(
              styles.btnForApproved,
              basicBtnStyle.btn_bg_color
            )}
            onClick={async () => {
              const res = await approveLecture(token, lecture.enrollmentId);
              window.location.reload();
            }}
            disabled={lecture.finished}
          >
            <span>수강 완료</span>
          </button>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default LectureBlock;
