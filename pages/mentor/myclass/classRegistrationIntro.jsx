import router from "next/router";
import styles from "./classRegistrationIntro.module.scss";
import { BottomTab, MenuBtn, TopBar } from "../../../components/common";
import { IC_PlusCircle } from "../../../icons";

const ClassRegistrationIntro = ({}) => {
  return (
    <>
      <section className={styles.topSection}>
        <TopBar text={"강의 목록"} removeBack={true} />
        <div className={styles.category}>
          <MenuBtn
            selected={false}
            text={"내 강의"}
            onClick={() => router.push("/mentor/myclass/myClassList")}
          />
          <MenuBtn
            selected={true}
            text={"강의 등록"}
            onClick={() =>
              router.push("/mentor/myclass/classRegistrationIntro")
            }
          />
        </div>
      </section>

      <section className={styles.contentSection}>
        <div>
          <h3 className={styles.smallHeading}>새로운 강의 등록하기</h3>
          <button
            type="button"
            className={styles.add}
            onClick={() => router.push("/mentor/myclass/classRegistration")}
          >
            <p>
              새로운 강의를 등록하고
              <br /> 더 많은 멘티들을 만나보세요.
            </p>
            <IC_PlusCircle w="20" h="20" />
          </button>
        </div>

        {/* <div>
          <h3 className={styles.smallHeading}>
            심사 요청한 강의 총 {fakeData.testingcnt}개
          </h3>
        </div> */}
        <BottomTab num={[1, 0, 0, 0]} role={"ROLE_MENTOR"} />
      </section>
    </>
  );
};

export default ClassRegistrationIntro;
