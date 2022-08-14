import React from "react";
import { BottomTab } from "../../../components/common";
import Category from "../../../components/mentee/mypageBoardActivityReple/Category";
import List from "../../../components/mentee/mypageBoardActivityReple/List";
import * as cookie from "cookie";

import styles from "./template.module.scss";
import { getMyComments } from "../../../core/api/Mentee";
import TopBar from "../../../components/mentee/mypageBoardActivity/TopBar";

function MypageBoardActivityReple({ commentList, role }) {
  console.log(commentList, "test");
  return (
    <main className={styles.main}>
      <TopBar title="게시판 활동내역" />
      <Category />
      <List commentList={commentList.content} />
      <BottomTab num={[0, 0, 0, 1]} role={role} />
    </main>
  );
}

export async function getServerSideProps(context) {
  const parsedCookies = cookie.parse(context.req.headers.cookie);
  const role = parsedCookies.role;
  const token = parsedCookies.accessToken;

  const commentList = await getMyComments(token, { page: 1 });

  return {
    props: { commentList, role },
  };
}

export default MypageBoardActivityReple;
