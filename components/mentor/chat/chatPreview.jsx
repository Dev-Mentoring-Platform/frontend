import { useState, useEffect } from "react";
import router from "next/router";
import Image from "next/image";
import styles from "./chatPreview.module.scss";
import Role from "../../common/tag/role";
import ConvertTime from "../../../utils/common/convertTime";
import { IC_PersonBlue } from "../../../icons";

const ChatPreview = ({ chatData, othersRole }) => {
  const [converted, setConverted] = useState({
    date: "",
    time: "",
    sameDay: false,
  });

  useEffect(() => {
    const sentAt = chatData?.lastMessage?.createdAt;
    if (sentAt != undefined) {
      ConvertTime(sentAt, setConverted);
    }
  }, [chatData.lastMessage]);

  const nickname =
    othersRole == "멘티" ? chatData.menteeNickname : chatData.mentorNickname;
  const userId =
    othersRole == "멘티" ? chatData.menteeUserId : chatData.mentorUserId;
  const userImg =
    othersRole == "멘티" ? chatData.menteeImage : chatData.mentorImage;

  return (
    <button
      type="button"
      className={styles.chatPreviewBlock}
      onClick={() =>
        router.push({
          pathname: `/common/chat/chatDetail/${chatData.chatroomId}`,
          query: { other: userId },
        })
      }
    >
      <div className={styles.profileImg}>
        {userImg == null ? (
          <IC_PersonBlue width={56} height={56} className={styles.person} />
        ) : (
          <Image src={userImg} width={56} height={56} />
        )}
      </div>
      <div className={styles.mentorChat}>
        <div className={styles.nameSection}>
          <Role role={othersRole} otherStyle={styles.roleTag} />
          <strong className={styles.name}>{nickname}</strong>
        </div>
        <p className={styles.chatContent}>
          {chatData?.lastMessage?.text?.length > 20
            ? chatData?.lastMessage?.text?.substr(0, 20) + "..."
            : chatData?.lastMessage?.text}
        </p>
      </div>

      <div className={styles.additionalInfo}>
        <span className={styles.timeInfo}>
          {converted.sameDay ? converted.time : converted.date}
        </span>
        {chatData.uncheckedMessageCount != 0 && (
          <div className={styles.newChatCnt}>
            <span>{chatData.uncheckedMessageCount}</span>
          </div>
        )}
      </div>
    </button>
  );
};
export default ChatPreview;
