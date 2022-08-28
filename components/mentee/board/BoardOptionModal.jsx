import React from "react";
import styles from "./BoardOptionModal.module.scss";
import router from "next/router";
import { deleteBoardPosts } from "../../../core/api/Mentee";

function BoardOptionModal({ handleOptionModal, postId, token }) {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.edit_box}>
          <div
            className={styles.review_edit}
            onClick={() => router.push(`/common/board/editpost/${postId}`)}
          >
            게시글 수정
          </div>
          <div
            className={styles.review_delete}
            onClick={async () => {
              const res = await deleteBoardPosts(token, postId);
              if (res.status == 200) {
                alert("게시물이 삭제되었습니다.");
                router.push(`/common/board`);
              } else {
                console.log(res.data.message);
              }
            }}
          >
            게시글 삭제
          </div>
        </div>
        <div className={styles.review_cancel} onClick={handleOptionModal}>
          닫기
        </div>
      </div>
    </div>
  );
}

export default BoardOptionModal;
