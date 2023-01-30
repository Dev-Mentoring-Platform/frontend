import router from "next/router";
import classNames from "classnames";
import styles from "./signupComplete.module.scss";
import { BasicBtn, basicBtnStyle } from "/components/common";
import { IC_CheckOutline } from "../../../icons";

const SignUpComplete = () => {
  return (
    <section className={styles.signupComplete}>
      <IC_CheckOutline />
      <strong className={styles.completeTitle}>회원가입 완료</strong>
      <p className={styles.completeParagraph}>
        이메일 인증이 완료되어야 회원가입이 완료됩니다.
        <br />
        이메일 인증 후 Mentoridge 서비스를 이용해보세요.
      </p>
      <BasicBtn
        text={"로그인"}
        onClick={() => router.push("/common/auth/login")}
        btnStyle={classNames(styles.loginBtn, basicBtnStyle.btn_blue)}
        textStyle={styles.loginBtnText}
      />
    </section>
  );
};
export default SignUpComplete;
