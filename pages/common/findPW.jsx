import { useState } from "react";
import router from "next/router";
import classNames from "classnames";
import styles from "./findPW.module.scss";
import FindPassword from "../../core/api/Login/findPW";
import { EmailValidation } from "../../utils/validation";
import {
  BasicInputBox,
  BasicBtn,
  basicBtnStyle,
  ModalWithBackground,
  BasicModal,
} from "../../components/common";
import { NameLogo } from "../../components/common/icons/nameLogo";

const MentorFindPW = () => {
  const [email, setEmail] = useState("");
  const [modal, setModal] = useState(false);
  const [msg, setMsg] = useState({
    errMsg: "",
    noticeMsg: "",
  });

  return (
    <section className={styles.findPWSection}>
      {modal && (
        <ModalWithBackground setModal={setModal}>
          <BasicModal
            modalStyle="round"
            notice={msg.noticeMsg == "" ? msg.errMsg : msg.noticeMsg}
            btnText={"확인"}
            btnClick={() => {
              if (msg.errMsg == "") router.push("/common/login");
            }}
            err={msg.errMsg != ""}
            ing={msg.noticeMsg == "메일 보내는 중..."}
          />
        </ModalWithBackground>
      )}
      <h1 className={styles.title}>{"비밀번호 찾기"}</h1>
      <div className={styles.inputs}>
        <h1 className={styles.largeText}>
          <span className={styles.blueText}>비밀번호</span>를 잊으셨나요?
        </h1>
        <BasicInputBox
          type={"email"}
          style={styles.inputBox}
          placeholder={"ID(Email) 입력"}
          onChange={(e) => setEmail(e.target.value)}
        />
        <BasicBtn
          text={"확인"}
          btnStyle={
            !EmailValidation(email)
              ? classNames(styles.disableBtn, basicBtnStyle.btn_gray)
              : classNames(styles.okBtn, basicBtnStyle.btn_blue)
          }
          textStyle={styles.okBtnText}
          onClick={async () => {
            setModal(true);
            setMsg({
              errMsg: "",
              noticeMsg: "메일 보내는 중...",
            });
            const res = await FindPassword(email);
            if (res.status == 200) {
              setMsg({
                errMsg: "",
                noticeMsg: "이메일을 발송했습니다.\n메일함을 확인해주세요.",
              });
            } else {
              setMsg({
                errMsg: res.data.errorDetails[0],
                noticeMsg: "",
              });
            }
          }}
          disabled={!EmailValidation(email)}
        />
      </div>
      <NameLogo />
    </section>
  );
};

export default MentorFindPW;
