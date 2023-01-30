import router from "next/router";
import styles from "./chatRoomTopBar.module.scss";
import { IC_ArrowLeft, IC_Menu } from "../../../icons";
import Role from "../tag/role";

const ChatRoomTopBar = ({ nickname, othersRole, getOut }) => {
  return (
    <div className={styles.chatRoomTopBar}>
      <button
        type="button"
        className={styles.goBackBtn}
        onClick={() => {
          getOut();
          router.push("/common/chat/chatList");
        }}
      >
        <IC_ArrowLeft width="24px" height="24px" />
      </button>

      <div className={styles.mentorInfo}>
        <Role role={othersRole} otherStyle={styles.roleTag} />
        <span className={styles.name}>{nickname}</span>
      </div>

      <IC_Menu width="24px" height="24px" />
    </div>
  );
};

export default ChatRoomTopBar;
