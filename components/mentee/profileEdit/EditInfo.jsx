import styles from "./EditInfo.module.scss";
import { BasicInputBox } from "../../common";

const EditInfo = ({ datas }) => {
  const { user, setUser, checkError } = datas;

  return (
    <div className={styles.inputSection}>
      <div className={styles.inputWithDupBtn}>
        <div className={styles.signupInput}>
          <span>{user.nickname}</span>
        </div>
      </div>
      <div className={styles.inputWithDupBtn}>
        <div className={styles.signupInput}>
          <span>{user.email}</span>
        </div>
      </div>
      <BasicInputBox
        type="text"
        style={styles.signupInput}
        placeholder={"휴대폰 번호('-' 제외)"}
        onChange={(e) => setUser({ ...user, phone: e.target.value })}
        value={user.phone}
      />
      <span className={styles.errText}>
        {checkError.isError ? checkError.errorMsg : ""}
      </span>
    </div>
  );
};

export default EditInfo;
