import React from "react";
import styles from "./List.module.scss";
import Image from "next/image";
import { IC_ArrowRight } from "../../../icons";
import { useRouter } from "next/router";
function List({ notice }) {
  const router = useRouter();
  return (
    <>
      <ul
        className={styles.container}
        onClick={() =>
          router.push({
            pathname: `/common/notice/${notice.noticeId}`,
          })
        }
      >
        <li>
          <span className={styles.date}>{notice.createdAt.slice(0, 10)}</span>
          <h6>{notice.title}</h6>
          <span className={styles.tagIcon}>
            <IC_ArrowRight />
          </span>
        </li>
      </ul>
    </>
  );
}

export default List;
