import Image from "next/image";
import React from "react";
import { deleteBoardComments } from "../../../core/api/Mentee";
import { IC_PersonBlue } from "../../../icons";
import styles from "./BoardComment.module.scss";

const BoardComment = ({ token, content, myInfo }) => {
  
  return (
    <div className={styles.commentSection}>
      <div className={styles.profileContainer}>
        <div className={styles.leftPannel}>
          <div className={styles.imageContainer}>
            {content.userImage ? (
              <Image
                src={content.userImage}
                className={styles.image}
                alt=""
                width="32px"
                height="32px"
              />
            ) : (
              <IC_PersonBlue width={32} height={32} />
            )}
          </div>
        </div>
        <div className={styles.rightPannel}>
          <div className={styles.name}>{content?.userNickname}</div>
          <div className={styles.date}>{content?.createdAt.slice(0, 10)}</div>
        </div>
      </div>
      <div className={styles.boardContent}>{content.content}</div>
      {content.userNickname === myInfo.nickname ? (
        <form
          className={styles.buttonContainer}
          onSubmit={async () => {
            const res = await deleteBoardComments(
              token,
              content.postId,
              content.commentId
            );
            if (res.status == 200) {
              alert("댓글이 삭제되었습니다.");
            } else {
              console.log(res.data.message);
            }
          }}
        >
          <button>삭제</button>
        </form>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default BoardComment;
