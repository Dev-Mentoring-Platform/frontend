import { useEffect, useState } from "react";
import styles from "./notificationBlock.module.scss";
import ConvertTime from "/utils/common/convertTime";

const NotificationBlock = ({ title, date, content, deleteAlarm }) => {
  const [converted, setConverted] = useState({
    date: "",
    time: "",
    sameDay: false,
  });

  useEffect(() => {
    ConvertTime(date, setConverted);
  }, [date]);

  return (
    <div className={styles.notiBlock}>
      <div className={styles.alignRow}>
        <h1>{title}</h1>
        <span> {converted.sameDay ? converted.time : converted.date}</span>
      </div>
      <div className={styles.alignRow}>
        <p>{content}</p>
        <button type="button" onClick={deleteAlarm}>
          삭제
        </button>
      </div>
    </div>
  );
};

export { NotificationBlock };
