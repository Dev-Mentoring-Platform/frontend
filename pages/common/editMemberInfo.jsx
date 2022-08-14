import { useEffect, useState } from "react";
import router from "next/router";
import { BottomBlueBtn, TopBar } from "../../components/common";
import styles from "./auth/signup.module.scss";
import BasicDataBlock from "../../components/mentor/signup/basicDataBlock";
import AddrBlock from "../../components/mentor/signup/addrBlock";
import * as cookie from "cookie";
import { editMyInfo } from "../../core/api/User/editMyInfo";
import EditInfo from "../../components/mentee/profileEdit/EditInfo";
import EditInfoErr from "../../utils/errorHandling/editInfoErr";
import { getMyInfo } from "../../core/api/User";

export const getServerSideProps = async (context) => {
  const token = cookie.parse(context.req.headers.cookie).accessToken;
  const role = cookie.parse(context.req.headers.cookie).role;

  const userInfo = await getMyInfo(token);

  return {
    props: {
      token,
      role,
      userInfo,
    },
  };
};

const EditMemberInfo = ({ token, role, userInfo }) => {
  const [user, setUser] = useState({
    nickname: userInfo?.nickname,
    email: userInfo?.username,
    phone: userInfo?.phoneNumber,
    birth: userInfo?.birthYear,
    gender: userInfo?.gender,
  });

  const zoneSplit = userInfo.zone.split(" ");
  const [addr, setAddr] = useState({
    state: [],
    sigungu: [],
    dong: [],
    statePick: zoneSplit[0],
    sigunguPick: zoneSplit[1],
    dongPick: zoneSplit[2],
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

  const saveChanges = async () => {
    const params = {
      birthYear: user.birth,
      gender: user.gender,
      nickname: user.nickname,
      phoneNumber: user.phone,
      zone: `${addr.statePick} ${addr.sigunguPick} ${addr.dongPick}`,
    };

    try {
      await editMyInfo(token, params);
      router.back();
    } catch (error) {
      console.error(error);
    }
  };

  const goBack = () => {
    return role === "ROLE_MENTEE"
      ? router.push("/mentee/mypage/myAccount")
      : router.push("/mentor/mypage");
  };

  useEffect(() => {
    EditInfoErr({ dupCheck, user }, setCheckError);
  }, [user, dupCheck]);

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

  return (
    <section className={styles.signUp01}>
      <TopBar text={"회원정보 수정"} onClick={goBack} />
      <div className={styles.contentSection}>
        <EditInfo
          datas={{ user, setUser, dupCheck, setDupCheck, checkError }}
        />
        <div className={styles.selectSection}>
          <BasicDataBlock datas={{ user, setUser }} />
          <AddrBlock datas={{ addr, setAddr }} />
        </div>
      </div>

      <BottomBlueBtn
        text={"저장"}
        disabled={checkError.isError}
        onClick={saveChanges}
      />
    </section>
  );
};

export default EditMemberInfo;
