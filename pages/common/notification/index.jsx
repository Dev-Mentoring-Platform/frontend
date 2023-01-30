import { useState, useEffect, useContext } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import * as cookie from "cookie";
import styles from "./notification.module.scss";
import { TopBar } from "/components/common";
import { NotificationBlock } from "/components/common/notification/notificationBlock";
import {
  checkNotification,
  getMyNotification,
  deleteNotification,
} from "/core/api/Notification";
import { sockContext } from "/core/provider";
import { IC_Caution } from "../../../icons";

export async function getServerSideProps(context) {
  const token = cookie.parse(context.req.headers.cookie).accessToken;
  const notiData = await getMyNotification(token, 1);
  await checkNotification();

  return {
    props: { token, notiData },
  };
}

const Notification = ({ token, notiData }) => {
  const [allNoti, setAllNoti] = useState(notiData.content);
  const [forScroll, setForScroll] = useState({
    pageNum: 1,
    last: notiData.last,
    dataLen: 10,
  });

  const alarm = useContext(sockContext);
  useEffect(() => {
    if (alarm.alarmContents !== undefined) {
      setAllNoti((prev) => [alarm.alarmContents, ...prev]);
    }
  }, [alarm.alarmContents]);

  const GetMoreNoti = async () => {
    const moreNoti = await getMyNotification(token, forScroll.pageNum);
    setForScroll((prev) => ({ ...prev, last: moreNoti.last }));
    setAllNoti([...allNoti, ...moreNoti.content]);
  };

  useEffect(() => {
    if (forScroll.pageNum !== 1) GetMoreNoti();
  }, [forScroll.pageNum]);

  const deleteNotificationHandler = async (notificationId) => {
    await deleteNotification(token, notificationId)
      .then((res) => {
        if (res === 200) {
          const notiAfterDelete = allNoti.filter(
            (i) => i.notificationId !== data?.notificationId
          );
          setAllNoti(notiAfterDelete);
        }
      })
      .catch((err) => alert("알람 삭제 도중 에러가 발생했습니다"));
  };

  return (
    <div className={styles.notiPage}>
      <TopBar text={"알림"} />
      <div className={styles.line} />
      {notiData.totalElements === 0 ? (
        <div className={styles.noNoti}>
          <IC_Caution width={45} height={45} />
          <span>받은 알림이 없습니다.</span>
        </div>
      ) : (
        <div className={styles.notiExists}>
          <InfiniteScroll
            dataLength={forScroll.dataLen}
            next={() => {
              setForScroll((prev) => ({
                ...prev,
                pageNum: prev.pageNum + 1,
                dataLen: prev.dataLen + 1,
              }));
            }}
            hasMore={!forScroll.last}
          >
            {allNoti.map((data, i) => (
              <NotificationBlock
                key={i}
                title={data?.notificationId}
                date={data?.createdAt}
                content={data?.content}
                deleteAlarm={deleteNotificationHandler(data?.notificationId)}
              />
            ))}
          </InfiniteScroll>
        </div>
      )}
    </div>
  );
};
export default Notification;
