import Image from "next/image";
import React from "react";

import { IC_CommentBubble, IC_HeartRedFill, IC_Report } from "../../../icons";
import styles from "./MainBoard.module.scss";

const MainBoard = ({ postData, updateLike }) => {
  return (
    <div>
      <div className={styles.profileContainer}>
        <div className={styles.leftPannel}>
          <div className={styles.imageContainer}>
            <Image
              src={
                postData.userImage ? postData.userImage : "/samples/lecture.png"
              }
              className={styles.image}
              alt="profile"
              width="40px"
              height="40px"
            />
          </div>
        </div>
        <div className={styles.rightPannel}>
          <span className={styles.name}>{postData?.userNickname}</span>
          <div className={styles.rightBottom}>
            <span className={styles.date}>
              {postData?.createdAt.slice(0, 10)}
            </span>
            <span className={styles.seen}>
              {`조회수 ${postData?.hits} 댓글 ${postData.commentCount}`}
            </span>
          </div>
        </div>
      </div>
      <div className={styles.contentContainer}>
        <div className={styles.requestLecture}>
          {postData?.category === "LECTURE_REQUEST" ? "강의요청" : "잡담"}
        </div>
        <span className={styles.title}>{postData.title}</span>
        <span className={styles.content}>{postData.content}</span>
      </div>
      <div className={styles.buttonContainer}>
        <div className={styles.leftSide}>
          <button className={styles.likesButton} onClick={updateLike}>
            <IC_HeartRedFill />
            {`좋아요 ${postData.likingCount}`}
          </button>
          <button className={styles.commentsButton}>
            <IC_CommentBubble />
            {`댓글 ${postData.commentCount}`}
          </button>
        </div>
        <div className={styles.rightSide}>
          <button className={styles.reportButton}>
            <IC_Report />
            신고
          </button>
        </div>
      </div>
    </div>
  );
};

export default MainBoard;
