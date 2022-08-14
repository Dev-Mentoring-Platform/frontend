import { useState, useEffect, useContext } from "react";
import * as cookie from "cookie";
import styles from "./notification.module.scss";
import { TopBar } from "../../../components/common";
import { IC_Caution } from "../../../icons";
import NotificationBlock from "../../../components/mentor/notification/notificationBlock";
import InfiniteScroll from "react-infinite-scroll-component";
import {
  checkNotification,
  getMyNotification,
  deleteNotification,
} from "../../../core/api/Notification";
import router from "next/router";
import { sockContext } from "../../../core/provider";
import { getMyInfo } from "../../../core/api/User";

export async function getServerSideProps(context) {
  const token = cookie.parse(context.req.headers.cookie).accessToken;
  const notiData = await getMyNotification(token, 1);

  await checkNotification();
  const my = await getMyInfo(token);

  return {
    props: { token, notiData, my },
  };
}

const Notification = ({ token, notiData, my }) => {
  const [pageNum, setPageNum] = useState(1);
  const [allNoti, setAllNoti] = useState(notiData.content);
  const [last, setLast] = useState(notiData.last);
  const [dataLen, setDataLen] = useState(10);
  const alarm = useContext(sockContext);
  useEffect(() => {
    if (alarm.alarmContents != undefined) {
      setAllNoti((prev) => [alarm.alarmContents, ...prev]);
    }
  }, [alarm.alarmContents]);

  const GetMoreNoti = async () => {
    const moreNoti = await getMyNotification(token, pageNum);
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
      <TopBar text={"알림"} />
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
              return (
                <NotificationBlock
                  key={i}
                  // title={data?.type}
                  title={data?.notificationId}
                  date={data?.createdAt}
                  content={data?.content}
                  deleteAlarm={async () => {
                    const res = await deleteNotification(
                      token,
                      data?.notificationId
                    );
                    if (res == 200) {
                      const allNoti2 = allNoti.filter(
                        (i) => i.notificationId != data?.notificationId
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
