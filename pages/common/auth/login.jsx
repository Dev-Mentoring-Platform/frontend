import { useEffect, useState } from "react";
import router from "next/router";
import classNames from "classnames";
import styles from "./login.module.scss";
import {
  BasicInputBox,
  BasicBtn,
  basicBtnStyle,
  NameLogo,
} from "/components/common";
import { login, getUserRoleType } from "/core/api/Login";
import { IC_Google, IC_Kakao, IC_Logo, IC_Naver } from "/icons";
import { cookieForAuth, removeInfo } from "/utils/cookie";

const Login = () => {
  const [user, setUser] = useState({
    userName: "",
    password: "",
  });
  const [error, setError] = useState("");

  const checkAccount = async () => {
    if (!user.userName || !user.password) {
      setError("아이디와 비밀번호를 모두 입력해주세요");
      return;
    }

    const res = await login(user.userName, user.password);
    const { status, headers, data } = res;

    if (status === 200) {
      const role = await getUserRoleType(headers["x-access-token"]);
      cookieForAuth(res, role);
      if (role.loginType === "ROLE_MENTOR") {
        router.push("/mentor/myclass/myClassList");
      }
      if (role.loginType === "ROLE_MENTEE") {
        router.push("/mentee");
      }
    } else {
      if (data.errorDetails[0] === "DisabledException")
        setError("이메일 인증이 완료되지 않았습니다.");
      else setError("아이디 또는 비밀번호가 일치하지 않습니다.");
    }
  };

  const onChange = (e, key) => {
    setUser({ ...user, [key]: e.target.value });
  };

  useEffect(() => {
    removeInfo();
  }, []);

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
          onChange={(e) => onChange(e, "userName")}
          value={user.userName}
          style={styles.loginInputBox}
        />
        <BasicInputBox
          type={"password"}
          placeholder={"Password"}
          onChange={(e) => onChange(e, "password")}
          value={user.password}
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
