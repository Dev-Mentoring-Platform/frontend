import router from "next/router";
import styles from "./classRegistrationIntro.module.scss";
import { BottomTab } from "../../components/common";
import fakeData from "../../data.json";
import ClassCard from "../../components/mentor/class/classCard";
import MenuBtn from "../../components/common/button/menuBtn";
import { IC_Plus_Blue } from "../../components/common/icons/class_icons";
import TopBar from "../../components/common/tab/topBar";

const ClassRegistrationIntro = ({}) => {
  return (
    <>
      <section className={styles.topSection}>
        <TopBar text={"강의 목록"} />
        <div className={styles.category}>
          <MenuBtn
            selected={false}
            text={"내 강의"}
            onClick={() => router.push("/mentor/myClassList")}
          />
          <MenuBtn
            selected={true}
            text={"강의 등록"}
            onClick={() => router.push("/mentor/classRegistrationIntro")}
          />
        </div>
      </section>

      <section className={styles.contentSection}>
        <div>
          <h3 className={styles.smallHeading}>새로운 강의 등록하기</h3>
          <button
            type="button"
            className={styles.add}
            onClick={() => router.push("/mentor/classRegistration")}
          >
            <p>
              새로운 강의를 등록하고
              <br /> 더 많은 튜티들을 만나보세요.
            </p>
            <IC_Plus_Blue w={20} h={20} />
          </button>
        </div>

        <div>
          <h3 className={styles.smallHeading}>
            심사 요청한 강의 총 {fakeData.testingcnt}개
          </h3>
          {fakeData.classes.map((data, i) => {
            return data.testing ? (
              <ClassCard />
            ) : (
              //   <ClassCardForPosting data={data} key={i} />
              <></>
            );
          })}
        </div>
        <BottomTab num={[1, 0, 0, 0]} />
      </section>
    </>
  );
};

export default ClassRegistrationIntro;