import React, { useEffect, useState } from "react";
import wrapper from "../core/redux/store";
import "../styles/globals.css";
import axios from "axios";
import Head from "next/head";
import "react-image-crop/src/ReactCrop.scss"; //react-image-crop에 영향이 있기 때문에 절대 지우면 안 됨!
import * as cookie from "cookie";
import router from "next/router";
import "nprogress/nprogress.css";
import Loading from "../components/common/Loading";
import myAxios from "../core/api/apiController";
import { getMyInfo } from "../core/api/User";
import { getUncheckedNotificationCount } from "../core/api/Notification";
import { allChatRooms } from "../core/api/Chat";
import SocketProvider from "../core/provider";
import { tokenRefresh } from "../core/api/Login";
import { setCookie } from "../utils/cookie";
import { SessionProvider } from "next-auth/react";

function MyApp({
  my,
  uncheckedCnt,
  myChatRooms,
  newToken,
  Component,
  pageProps,
  // pageProps: { session, ...pageProps },
}) {
  const [loading, setLoading] = useState(false);
  axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL;
  myAxios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const start = () => {
      setLoading(true);
    };
    const end = () => {
      setLoading(false);
    };

    if (newToken !== "")
      setCookie("accessToken", newToken, {
        path: "/",
        secure: true,
        withCredentials: true,
      });

    router.events.on("routeChangeStart", start);
    router.events.on("routeChangeComplete", end);
    router.events.on("routeChangeError", end);
    return () => {
      router.events.off("routeChangeStart", start);
      router.events.off("routeChangeComplete", end);
      router.events.off("routeChangeError", end);
    };
  }, []);

  return loading ? (
    <Loading />
  ) : (
    <>
      <Head>
        <link rel="shortcut icon" href="/favicon/favicon(16x16).ico" />
        <link rel="shortcut icon" href="/favicon/favicon(32x32).ico" />
        <link rel="shortcut icon" href="/favicon/favicon(64x64).ico" />

        <meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0" />
        <meta property="og:title" content={"멘토릿지"} />
      </Head>
      <SessionProvider session={pageProps?.session}>
        <SocketProvider
          my={my}
          uncheckedCnt={uncheckedCnt}
          myChatRooms={myChatRooms}
        >
          {/* {session !== undefined ? (
          <SessionProvider session={session}>
            <Component {...pageProps} />
          </SessionProvider>
        ) : ( */}
          <Component {...pageProps} />
          {/* )} */}
        </SocketProvider>
      </SessionProvider>
    </>
  );
}

MyApp.getInitialProps = async (context) => {
  let myTokens = {
    access: "",
    refresh: "",
    role: "",
  };

  let parsed = "";
  let newToken = "";

  if (context.ctx.req && context.ctx.req.headers.cookie) {
    // console.log("this is req===", context.ctx.req);
    // if(context.ctx.req.statusCode==401 && message=="TOKENEXPIRED"){
    // tokenRefresh();
    // }
    const parsedCookie = cookie.parse(context.ctx.req.headers.cookie);
    parsed = parsedCookie;
    myTokens.access = parsedCookie.accessToken;
    myTokens.refresh = parsedCookie.refreshToken;
    myTokens.role = parsedCookie.role;
    const res = await tokenRefresh(
      myTokens.access,
      myTokens.refresh,
      myTokens.role
    );
    newToken =
      res?.headers["x-access-token"] !== undefined
        ? res.headers["x-access-token"]
        : myTokens.access;
  }

  axios.defaults.headers.common["Authorization"] = myTokens.access;
  axios.defaults.headers.common["Set-Cookie"] = JSON.stringify(myTokens);
  myAxios.defaults.headers.common["Authorization"] = myTokens.access;
  myAxios.defaults.headers.common["Set-Cookie"] = JSON.stringify(myTokens);

  const my = await getMyInfo(myTokens.access);
  const uncheckedCnt = await getUncheckedNotificationCount(myTokens.access);
  const myChatRooms = await allChatRooms();
  return { my, uncheckedCnt, myChatRooms, newToken };
};

export default wrapper.withRedux(MyApp);
