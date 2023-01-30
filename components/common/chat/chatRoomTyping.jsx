import { useState } from "react";
import styles from "./chatRoomTyping.module.scss";

const ChatRoomTyping = ({ sendMsg }) => {
  const [msg, setMsg] = useState("");
  return (
    <div className={styles.typingSection}>
      <div className={styles.inputBox}>
        <input
          type="text"
          placeholder="메세지를 입력하세요"
          className={styles.textInput}
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
        />
        <button
          type="button"
          className={styles.sendBtn}
          onClick={() => {
            sendMsg(msg);
            setMsg("");
          }}
        >
          <span>보내기</span>
        </button>
      </div>
    </div>
  );
};

export default ChatRoomTyping;
