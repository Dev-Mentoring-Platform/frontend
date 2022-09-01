import { useEffect, useState } from "react";
import router from "next/router";
import classNames from "classnames";
import styles from "./login.module.scss";
import {
  BasicInputBox,
  BasicBtn,
  basicBtnStyle,
} from "../../../components/common";
import { login, getUserRoleType } from "../../../core/api/Login";
import { cookieForAuth, removeInfo } from "../../../utils/cookie";
import { IC_Google, IC_Kakao, IC_Logo, IC_Naver } from "../../../icons";
import { NameLogo } from "../../../components/common/icons/nameLogo";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    removeInfo();
  }, []);

  const checkAccount = async () => {
    const res = await login(username, password);
    if (res.status == 200) {
      const role = await getUserRoleType(res.headers["x-access-token"]);
      cookieForAuth(res, role);
      if (role.loginType === "ROLE_MENTOR") {
        router.push("/mentor/myclass/myClassList");
      }
      if (role.loginType === "ROLE_MENTEE") {
        router.push("/mentee");
      }
    } else {
      if (res.data.errorDetails[0] === "DisabledException")
        setError("이메일 인증이 완료되지 않았습니다.");
      else setError("아이디 또는 비밀번호가 일치하지 않습니다.");
    }
  };

  const onChangeUsername = (e) => {
    setUsername(e.target.value);
  };
  const onChangePassword = (e) => {
    setPassword(e.target.value);
  };

  return (
    <section className={styles.loginSection}>
      <h1 className={styles.title}>{"로그인"}</h1>
      <span className={styles.imageLogo}>
        <IC_Logo width="56" height="56" />
      </span>
      <div className={styles.btns}>
        <BasicInputBox
          type={"email"}
          placeholder={"ID(Email)"}
          onChange={onChangeUsername}
          value={username}
          style={styles.loginInputBox}
        />
        <BasicInputBox
          type={"password"}
          placeholder={"Password"}
          onChange={onChangePassword}
          value={password}
          style={styles.loginInputBox}
        />
        {error && <span className={styles.failed}>{error}</span>}
        <BasicBtn
          text={"로그인 하기"}
          onClick={checkAccount}
          btnStyle={classNames(styles.loginBtn, basicBtnStyle.btn_blue)}
          textStyle={styles.loginBtnText}
        />

        <span className={styles.textButtons}>
          <BasicBtn
            text={"회원가입하기"}
            btnStyle={classNames(styles.textBtn, basicBtnStyle.btn_transparent)}
            textStyle={styles.textBtnText}
            onClick={() => router.push("/common/auth/signup")}
          />
          <BasicBtn
            text={"비밀번호찾기"}
            btnStyle={classNames(styles.textBtn, basicBtnStyle.btn_transparent)}
            textStyle={styles.textBtnText}
            onClick={() => router.push("/common/auth/findPW")}
          />
        </span>
      </div>

      <div className={styles.snsCon}>
        <p>SNS 로그인</p>
        <div className={styles.snsBtn}>
          <a href="/oauth2/authorization/google">
            <IC_Google />
          </a>
          <a href="/oauth2/authorization/naver">
            <IC_Naver />
          </a>
          <a href="/oauth2/authorization/kakao">
            <IC_Kakao />
          </a>
        </div>
      </div>
      <NameLogo />
    </section>
  );
};

export default Login;
