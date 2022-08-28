import React from "react";
import styles from "./noticedetail.module.scss";
import * as cookie from "cookie";
import { getNoticeDetail } from "../../../core/api/Mentee";
import { TopBar } from "../../../components/common";

const NoticeDetail = ({ notice }) => {
  return (
    <main className={styles.main}>
      <TopBar />
      <div className={styles.line}>
        <span>{notice.content}</span>
      </div>
    </main>
  );
};

export async function getServerSideProps(context) {
  const role = cookie.parse(context.req.headers.cookie).role;
  const token = cookie.parse(context.req.headers.cookie).accessToken;
  const noticeId = context.query.id;
  const notice = await getNoticeDetail(token, noticeId);

  return {
    props: { role, notice },
  };
}

export default NoticeDetail;
