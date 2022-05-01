import { useState, useEffect, useRef } from "react";
import GetMyNotification from "../../../core/api/Notification/getMyNotification";
import * as cookie from "cookie";
import styles from "./notification.module.scss";
import { TopBar } from "../../../components/common";
import { IC_Caution } from "../../../icons";
import NotificationBlock from "../../../components/mentor/notification/notificationBlock";
import InfiniteScroll from "react-infinite-scroll-component";
import CheckNotification from "../../../core/api/Notification/checkNotification";
import router from "next/router";
import DeleteNotification from "../../../core/api/Notification/deleteNotification";

export async function getServerSideProps(context) {
  const token = cookie.parse(context.req.headers.cookie).accessToken;
  const notiData = await GetMyNotification(token, 1);
  await CheckNotification(token);

  return {
    props: { token, notiData },
  };
}

const Notification = ({ token, notiData }) => {
  const [pageNum, setPageNum] = useState(1);
  const [allNoti, setAllNoti] = useState(notiData.content);
  const [last, setLast] = useState(notiData.last);
  const [dataLen, setDataLen] = useState(10);
  const deleteBtn = useRef();

  const GetMoreNoti = async () => {
    const moreNoti = await GetMyNotification(token, pageNum);
    setLast(moreNoti.last);
    setAllNoti([...allNoti, ...moreNoti.content]);
  };

  useEffect(() => {
    if (pageNum != 1) {
      GetMoreNoti();
    }
  }, [pageNum]);

  return (
    <div className={styles.notiPage}>
      <TopBar text={"알림"} onClick={() => router.push("/mentor/mypage")} />
      <div className={styles.line} />
      {notiData.totalElements == 0 ? (
        <div className={styles.noNoti}>
          <IC_Caution width={45} height={45} />
          <span>받은 알림이 없습니다.</span>
        </div>
      ) : (
        <div className={styles.notiExists}>
          <InfiniteScroll
            dataLength={dataLen}
            next={() => {
              setPageNum(pageNum + 1);
              setDataLen(dataLen + 10);
            }}
            hasMore={!last}
          >
            {allNoti.map((data, i) => {
              console.log(data);
              return (
                <NotificationBlock
                  key={i}
                  title={data.type}
                  date={data.createdAt.substring(0, 10)}
                  content={data.content}
                  deleteAlarm={async () => {
                    const res = await DeleteNotification(
                      token,
                      data.notificationId
                    );
                    if (res == 200) {
                      const allNoti2 = allNoti.filter(
                        (i) => i.notificationId != data.notificationId
                      );
                      setAllNoti(allNoti2);
                    }
                  }}
                />
              );
            })}
          </InfiniteScroll>
        </div>
      )}
    </div>
  );
};
export default Notification;