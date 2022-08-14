import { useEffect, useState } from "react";
import router from "next/router";
import styles from "./signup.module.scss";
import { BottomBlueBtn, TopBar } from "../../../components/common";
import { signUp } from "../../../core/api/Login";
import SignUpErr from "../../../utils/errorHandling/signupErr";
import UserBlock from "../../../components/mentor/signup/userBlock";
import BasicDataBlock from "../../../components/mentor/signup/basicDataBlock";
import AgreeBlock from "../../../components/mentor/signup/agreeBlock";
import AddrBlock from "../../../components/mentor/signup/addrBlock";

const SignUp = () => {
  const [user, setUser] = useState({
    name: "",
    nickname: "",
    email: "",
    pw: "",
    pwConfirm: "",
    phone: "",
    birth: 2002,
    gender: "남자",
  });

  const [addr, setAddr] = useState({
    state: [],
    sigungu: [],
    dong: [],
    statePick: "서울특별시",
    sigunguPick: "",
    dongPick: "",
  });

  const [agree, setAgree] = useState({
    all: false,
    one: false,
    two: false,
    three: false,
  });

  const [checkError, setCheckError] = useState({
    isError: false,
    errorMsg: "",
  });

  const [dupCheck, setDupCheck] = useState({
    nicknameDupSuccess: false,
    nicknameDupError: false,
    emailDupSuccess: false,
    emailDupError: false,
  });

  useEffect(() => {
    SignUpErr({ dupCheck, user, agree }, setCheckError);
  }, [user, agree, dupCheck]);

  useEffect(() => {
    setDupCheck({
      ...dupCheck,
      nicknameDupSuccess: false,
      nicknameDupError: false,
    });
  }, [user.nickname]);

  useEffect(() => {
    setDupCheck({
      ...dupCheck,
      emailDupSuccess: false,
      emailDupError: false,
    });
  }, [user.email]);

  const SignUpAPI = async () => {
    const res = await signUp(user, addr);
    if (res.status == 201 || res.status == 200) {
      router.push("/common/auth/signupComplete");
    }
  };

  return (
    <section className={styles.signUp01}>
      <TopBar text={"회원가입"} />
      <div className={styles.contentSection}>
        <UserBlock
          datas={{ user, setUser, dupCheck, setDupCheck, checkError }}
        />
        <div className={styles.selectSection}>
          <BasicDataBlock datas={{ user, setUser }} />
          <AddrBlock datas={{ addr, setAddr }} />
        </div>
        <span className={styles.text}>동네 강의 추천을 위해 입력해주세요</span>
        <AgreeBlock datas={{ agree, setAgree }} />
      </div>

      <BottomBlueBtn
        text={"저장"}
        onClick={SignUpAPI}
        disabled={checkError.isError}
      />
    </section>
  );
};

export default SignUp;
