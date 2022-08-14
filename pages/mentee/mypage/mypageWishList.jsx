import React from "react";
import HomeIndicator from "../../../components/mentee/HomeIndicator";
import ContentList from "../../../components/mentee/mypageWishList/ContentList";
import TopMenu from "../../../components/mentee/mypageWishList/TopMenu";
import styles from "./mypageWishList.module.scss";
import * as cookie from "cookie";
import { getMenteePicks } from "../../../core/api/Mentee";
import NoWrite from "../../../components/mentee/NoWrite";

export default function myPageWishList({ wishList }) {
  return (
    <main className={styles.main}>
      <TopMenu />

      {wishList.content.length !== 0 ? (
        wishList.content.map((wish, idx) => (
          <ContentList key={idx} wish={wish} />
        ))
      ) : (
        <NoWrite text="위시리스트가 없습니다" />
      )}
      <HomeIndicator />
    </main>
  );
}

export const getServerSideProps = async (context) => {
  const token = cookie.parse(context.req.headers.cookie).accessToken;
  const wishList = await getMenteePicks(token, 1);

  return {
    props: { token, wishList: JSON.parse(JSON.stringify(wishList)) },
  };
};
