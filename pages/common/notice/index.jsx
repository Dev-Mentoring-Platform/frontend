import React from "react";
import styles from "./template.module.scss";
import * as cookie from "cookie";
import List from "../../../components/mentee/mypageNotice/List";
import { BottomTab, TopBar } from "../../../components/common";
import { getNoticeList } from "../../../core/api/Mentee";

function mypageNotice({ role, noticeList }) {
  return (
    <main className={styles.main}>
      <TopBar text={"공지사항"} />
      <div className={styles.line}>
        <span></span>
      </div>
      {noticeList?.content.map((notice, idx) => (
        <List key={idx} notice={notice} />
      ))}
      <BottomTab num={[0, 0, 0, 1]} role={role} />
    </main>
  );
}

export async function getServerSideProps(context) {
  const role = cookie.parse(context.req.headers.cookie).role;
  const token = cookie.parse(context.req.headers.cookie).accessToken;
  const noticeList = await getNoticeList(token, 1);

  return {
    props: { role, noticeList },
  };
}

export default mypageNotice;
