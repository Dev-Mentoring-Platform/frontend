import React, { useContext, useEffect, useState } from "react";
import * as cookie from "cookie";
import styles from "./chatList.module.scss";
import { getMyChatRooms } from "/core/api/Chat";
import { sockContext } from "/core/provider";
import { BottomTab } from "/components/common";
import { ChatPreview, ChatListTopBar } from "/components/common/chat";
import { IC_SmilingMan } from "../../../icons";

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
  const othersRole = role === "ROLE_MENTOR" ? "멘티" : "멘토";
  const chatContext = useContext(sockContext);
  const chat = chatContext.chat;
  const [updated, setUpdated] = useState(myChatRooms.content);

  useEffect(() => {
    if (chat !== undefined && chat.type === "MESSAGE") {
      let filtered = [],
        thatRoom;
      updated.forEach((i) => {
        i.chatroomId !== chat.chatroomId ? filtered.push(i) : (thatRoom = i);
      });
      thatRoom.lastMessage = chat;
      thatRoom.uncheckedMessageCount++;
      const chatLists = [thatRoom, ...filtered];
      setUpdated(chatLists);
    }
  }, [chat]);

  return (
    <>
      <div className={styles.chatList}>
        <ChatListTopBar />
        {updated.length === 0 && (
          <div className={styles.noChat}>
            <IC_SmilingMan width="180px" height="124px" />
          </div>
        )}
        {myChatRooms !== undefined &&
          updated.map((data, i) => (
            <ChatPreview chatData={data} key={i} othersRole={othersRole} />
          ))}
        <BottomTab num={[0, 0, 1, 0]} role={role} />
      </div>
    </>
  );
};

export default ChatList;
