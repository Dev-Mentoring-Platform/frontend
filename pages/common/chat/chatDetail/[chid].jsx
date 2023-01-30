import { useContext, useEffect, useState } from "react";
import * as cookie from "cookie";
import InfiniteScroll from "react-infinite-scroll-component";
import styles from "./chat.module.scss";
import {
  ChatRoomTyping,
  ChatRoomTopBar,
  ChatRoomContentBlock,
} from "/components/common/chat";
import { getMyChatHistory, readChat, getOutFromChatRoom } from "/core/api/Chat";
import { getUserRoleType } from "/core/api/Login";
import { getMyInfo, getUserInfo } from "/core/api/User";
import { sockContext } from "/core/provider";

export async function getServerSideProps(context) {
  const token = cookie.parse(context.req.headers.cookie).accessToken;
  const { chid, other } = context.query;
  const history = await getMyChatHistory(token, chid, 1).then((res) =>
    res.content.reverse()
  );
  const othersInfo = await getUserInfo(token, other);
  const myInfo = await getMyInfo(token);
  const myRole = await getUserRoleType(token).then((data) => data.loginType);
  await readChat(chid);

  return {
    props: {
      token,
      history,
      chid,
      othersInfo,
      myInfo,
      myRole,
    },
  };
}

const Chat = ({ token, history, chid, othersInfo, myInfo, myRole }) => {
  const chatContext = useContext(sockContext);
  const ws = chatContext.ws;
  const [chatContents, setChatContents] = useState([]);
  const [forScroll, setForScroll] = useState({ pageNum: 1, dataLen: 10 });

  useEffect(() => {
    setChatContents(history);
  }, [history]);

  useEffect(() => {
    window.onbeforeunload = function (e) {
      if (e) getOutFromChatRoom(token, chid);
    };
    window.onpopstate = function (e) {
      if (e) getOutFromChatRoom(token, chid);
    };
  }, []);

  const fetchMore = async () => {
    if (forScroll.pageNum !== 1) {
      const moreHistory = await getMyChatHistory(
        token,
        chid,
        forScroll.pageNum
      ).then((res) => res.content.reverse());
      setChatContents([...moreHistory, ...chatContents]);
    }
    setForScroll((prev) => ({
      pageNum: prev.pageNum + 1,
      dataLen: prev.dataLen + 10,
    }));
  };

  useEffect(() => {
    if (chatContext.chat !== undefined && chatContext.chat.type === "MESSAGE")
      setChatContents((prev) => [...prev, chatContext.chat]);
    else if (
      chatContext.chat !== undefined &&
      chatContext.chat.type === "ENTER"
    ) {
      setChatContents(
        chatContents.map((data) =>
          !data.checked ? { ...data, checked: true } : data
        )
      );
    }
  }, [chatContext.chat]);

  const sendMsg = (content) => {
    if (content.replace(/ /g, "").length !== 0) {
      var msg = {
        type: "MESSAGE",
        chatroomId: parseInt(chid),
        receiverId: othersInfo.userId,
        senderId: myInfo.userId,
        text: content,
      };
      ws.send("/pub/chat", {}, JSON.stringify(msg));
    }
  };

  return (
    <div className={styles.chatRoom}>
      <ChatRoomTopBar
        nickname={othersInfo?.nickname}
        othersRole={myRole === "ROLE_MENTEE" ? "멘토" : "멘티"}
        getOut={() => getOutFromChatRoom(token, chid)}
      />
      <div className={styles.chatContentSection} id="chatContents">
        <div className={styles.chatContents}>
          <InfiniteScroll
            scrollableTarget={"chatContents"}
            dataLength={forScroll.dataLen}
            next={fetchMore}
            hasMore={true}
            inverse={true}
          >
            {chatContents.length !== 0 &&
              chatContents?.map((data, i) => (
                <ChatRoomContentBlock
                  key={i}
                  my={myInfo}
                  other={othersInfo}
                  sender={data.senderId}
                  sentAt={data.createdAt}
                  msg={data.text}
                  checked={data.checked}
                />
              ))}
          </InfiniteScroll>
        </div>
      </div>
      <ChatRoomTyping sendMsg={sendMsg} />
    </div>
  );
};
export default Chat;
