import styles from "./chatList.module.scss";
import { BottomTab } from "../../../components/common";
import React, { useContext, useEffect, useState } from "react";
import { getMyChatRooms } from "../../../core/api/Chat";
import * as cookie from "cookie";
import ChatPreview from "../../../components/mentor/chat/chatPreview";
import { IC_SmilingMan } from "../../../icons";
import ChatListTopBar from "../../../components/mentor/chat/chatListTopBar";
import { sockContext } from "../../../core/provider";

export const getServerSideProps = async (context) => {
  const role = cookie.parse(context.req.headers.cookie).role;
  const myChatRooms = await getMyChatRooms();

  return {
    props: {
      role,
      myChatRooms,
    },
  };
};

const ChatList = ({ myChatRooms, role }) => {
  const othersRole = role == "ROLE_MENTOR" ? "멘티" : "멘토"; //상대방 role 출력해야 해서 반대로
  const chatContext = useContext(sockContext);
  const chat = chatContext.chat;
  const [updated, setUpdated] = useState(myChatRooms.content);

  useEffect(() => {
    if (chat != undefined && chat.type === "MESSAGE") {
      let filtered = [],
        thatRoom;
      updated.forEach((i) => {
        i.chatroomId !== chat.chatroomId ? filtered.push(i) : (thatRoom = i);
      });
      thatRoom.lastMessage = chat;
      thatRoom.uncheckedMessageCount += 1;
      const chatLists = [thatRoom, ...filtered];
      setUpdated(chatLists);
    }
  }, [chat]);

  return (
    <>
      <div className={styles.chatList}>
        <ChatListTopBar />
        {updated.length == 0 && (
          <div className={styles.noChat}>
            <IC_SmilingMan width="180px" height="124px" />
          </div>
        )}
        {myChatRooms != undefined &&
          updated.map((data, i) => {
            return (
              <ChatPreview chatData={data} key={i} othersRole={othersRole} />
            );
          })}
        <BottomTab num={[0, 0, 1, 0]} role={role} />
      </div>
    </>
  );
};

export default ChatList;
