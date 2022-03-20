import router from "next/router";
import Image from "next/image";
import classNames from "classnames";
import * as cookie from "cookie";
import styles from "./mypage.module.scss";
import {
  BottomTab,
  CategoryBtn,
  BasicBtn,
  basicBtnStyle,
} from "../../../components/common";
import MyPageTopBar from "../../../components/mentor/mypage/mypageTopBar";
import { IC_Bookmark, IC_Student } from "../../../icons";
import { GetMyInfo } from "../../../core/api/User";
import UserRole from "../../../utils/userRole";

const MyPage = ({ userInfo }) => {
  return (
    <section className={styles.mypageSection}>
      <MyPageTopBar />
      <section className={styles.profileSection}>
        <div className={styles.profile}>
          <div className={styles.profileImgMargin}>
            <Image
              src={"/samples/lecture.png"}
              width={56}
              height={56}
              className={styles.profileImg}
            />
          </div>

          <div className={styles.role_name}>
            <div className={styles.mentorTag}>
              <span>{UserRole(userInfo.role)}</span>
            </div>
            <span className={styles.name}>{userInfo.name}</span>
          </div>

          <BasicBtn
            text={"프로필 수정"}
            onClick={() => router.push("/mentor/mypage/profileEdit")}
            btnStyle={styles.profileEditBtn}
            textStyle={styles.profileEditBtnText}
          />
        </div>

        <div className={styles.btns}>
          <button
            type="button"
            className={classNames(basicBtnStyle.btn_blue, styles.bigBlueBtn)}
          >
            <IC_Bookmark />
            <span className={styles.bigBtnText}>강의 목록</span>
          </button>

          <button
            type="button"
            className={classNames(basicBtnStyle.btn_blue, styles.bigBlueBtn)}
            onClick={() => router.push("/mentor/mypage/menteeList")}
          >
            <IC_Student w="30" h="30" />
            <span className={styles.bigBtnText}>멘티 목록</span>
          </button>
        </div>
      </section>

      <span className={styles.line} />

      <section className={styles.categorySection}>
        <h1 className={styles.title}>MENTORIDGE</h1>
        <CategoryBtn text={"공지사항"} />
        <CategoryBtn text={"이용약관"} />
        <CategoryBtn text={"문의하기"} onClick={() => router.push("/ask")} />
        <CategoryBtn text={"버전정보"} />
      </section>

      <BottomTab num={[0, 0, 0, 1]} />
    </section>
  );
};

export async function getServerSideProps(context) {
  const parsedCookies = cookie.parse(context.req.headers.cookie);
  const userInfo = await GetMyInfo(parsedCookies.accessToken);
  return {
    props: { userInfo },
  };
}

export default MyPage;
