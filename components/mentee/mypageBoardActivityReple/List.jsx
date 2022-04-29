import React from "react";
import styles from "./List.module.scss";

function List({ commentList }) {
  return (
    <ul className={styles.container}>
      {commentList.map((content) => (
        <li key={content.postId}>
          <h6>{content.title}</h6>

          <div className={styles.span_box}>
            <span>{content.userNickname}</span>
            <span>{content.createdAt.slice(0, 10)}</span>
            <span>
              조회 <strong>{content.hits}</strong>
            </span>
            <span>
              댓글 <strong>{content.commentCount}</strong>
            </span>
            <span>
              좋아요 <strong>{content.likingCount}</strong>
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default List;
