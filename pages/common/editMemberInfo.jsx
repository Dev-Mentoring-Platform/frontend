import { useEffect, useState } from "react";
import router from "next/router";
import { BottomBlueBtn, TopBar } from "../../components/common";
import styles from "./auth/signup.module.scss";
import * as cookie from "cookie";
import { editMyInfo } from "../../core/api/User/editMyInfo";
import EditInfo from "../../components/mentee/profileEdit/EditInfo";
import EditInfoErr from "../../utils/errorHandling/editInfoErr";
import { getMyInfo } from "../../core/api/User";
import BasicDataBlock from "../../components/mentor/signup/basicDataBlock";
import AddrBlockEdit from "../../components/mentor/signup/addrBlockEdit";

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

const EditMemberInfo = ({ token, userInfo }) => {
  const [user, setUser] = useState({
    nickname: userInfo?.nickname,
    email: userInfo?.username,
    phone: userInfo?.phoneNumber,
    birth: userInfo?.birthYear,
    gender: userInfo?.gender,
  });

  const zoneSplit = userInfo.zone.split(" ");
  const [addr, setAddr] = useState({
    statePick: zoneSplit[0],
    sigunguPick: zoneSplit[1],
    dongPick: zoneSplit[2],
  });
  const [newAddr, setNewAddr] = useState(addr);

  const [checkError, setCheckError] = useState({
    isError: false,
    errorMsg: "",
  });

  const saveChanges = async () => {
    const params = {
      nickname: user.nickname,
      birthYear: user.birth,
      gender: user.gender,
      phoneNumber: user.phone,
      zone: `${newAddr.statePick} ${newAddr.sigunguPick} ${newAddr.dongPick}`,
    };

    try {
      await editMyInfo(token, params);
      router.back();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    EditInfoErr(user, setCheckError);
  }, [user]);

  return (
    <section className={styles.signUp01}>
      <TopBar text={"회원정보 수정"} />
      <div className={styles.contentSection}>
        <EditInfo datas={{ user, setUser, addr, setAddr, checkError }} />
        <div className={styles.selectSection}>
          <BasicDataBlock datas={{ user, setUser }} />
          <AddrBlockEdit
            addr={addr}
            newAddr={newAddr}
            setNewAddr={setNewAddr}
            edit={true}
          />
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
