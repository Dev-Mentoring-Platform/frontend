import { useEffect, useState } from "react";
import styles from "./changePW.module.scss";
import {
  BottomBlueBtn,
  TopBar,
  BasicInputBox,
} from "../../../components/common";
import * as cookie from "cookie";
import { changePassword } from "../../../core/api/User";
import router from "next/router";
import { ModalWithBackground, BasicModal } from "../../../components/common";

export const getServerSideProps = async (context) => {
  const token = cookie.parse(context.req.headers.cookie).accessToken;
  const role = cookie.parse(context.req.headers.cookie).role;

  return {
    props: {
      token,
      role,
    },
  };
};

const ChangePW = ({ token, role }) => {
  const [pw, setPW] = useState({
    newPassword: "",
    newPasswordConfirm: "",
    password: "",
  });

  const [errMsg, setErrMsg] = useState("");
  const [result, setResult] = useState({
    success: false,
    error: false,
    errorMsg: "",
  });

  const [modal, setModal] = useState(false);

  useEffect(() => {
    if (
      pw.newPassword == "" ||
      pw.newPasswordConfirm == "" ||
      pw.password == ""
    ) {
      setErrMsg("빈칸을 모두 채워주세요.");
    } else if (pw.newPassword.length < 6 || pw.newPassword.length > 14) {
      setErrMsg("비밀번호는 6-14자로 입력해주세요.");
    } else if (pw.newPassword != pw.newPasswordConfirm) {
      setErrMsg("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
    } else if (pw.newPassword == pw.password) {
      setErrMsg("비밀번호와 새로운 비밀번호는 서로 다르게 설정해주세요.");
    } else {
      setErrMsg("");
    }
  }, [pw]);

  return (
    <section className={styles.changePW}>
      {modal && (
        <ModalWithBackground
          setModal={setModal}
          prevent={result.success ? true : false}
        >
          <BasicModal
            notice={
              result.success
                ? "비밀번호 변경이 완료되었습니다."
                : result.errorMsg
            }
            btnText={"확인"}
            modalStyle={"square"}
            btnClick={() => {
              setModal(false);
              if (result.success == true) router.back();
            }}
          />
        </ModalWithBackground>
      )}
      <TopBar text={"비밀번호 변경"} />
      <p className={styles.text}>
        주기적인 비밀번호 변경을 통해
        <br />
        개인정보를 안전하게 보호할 수 있습니다.
      </p>
      <div className={styles.line} />
      <section className={styles.content}>
        <BasicInputBox
          type={"password"}
          placeholder={"현재 비밀번호"}
          onChange={(e) => setPW({ ...pw, password: e.target.value })}
          style={styles.pwInputBox}
        />
        <BasicInputBox
          type={"password"}
          placeholder={"새로운 비밀번호(6-14자 이내)"}
          onChange={(e) => setPW({ ...pw, newPassword: e.target.value })}
          style={styles.pwInputBox}
        />
        <BasicInputBox
          type={"password"}
          placeholder={"새로운 비밀번호 확인"}
          onChange={(e) => setPW({ ...pw, newPasswordConfirm: e.target.value })}
          style={styles.pwInputBox}
        />
      </section>
      <BottomBlueBtn
        text={"저장"}
        onClick={async () => {
          if (errMsg !== "") {
            setResult({ success: false, error: true, errorMsg: errMsg });
          } else {
            const res = await changePassword(token, pw);
            if (res.status == 200)
              setResult({ success: true, error: false, errorMsg: "" });
            else
              setResult({
                success: false,
                error: true,
                errorMsg: res.data.errorDetails[0],
              });
          }
          setModal(true);
        }}
      />
    </section>
  );
};

export default ChangePW;
