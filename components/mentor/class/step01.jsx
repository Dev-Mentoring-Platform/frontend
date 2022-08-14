import { useState } from "react";
import router from "next/router";
import styles from "./steps.module.scss";
import {
  MenuBtn,
  TopBar,
  BottomBlueBtn,
  ClassRegistrationInputBox,
  BasicModal,
  ModalWithBackground,
} from "../../common";
import ImgCrop from "./imgSubmitBlock";

const Step01 = ({ form, handleChange, imgChange, MoveStep, token }) => {
  const [modal, setModal] = useState(false);
  return (
    <div className={styles.step}>
      {modal ? (
        <ModalWithBackground setModal={setModal}>
          <BasicModal
            notice={`등록을 취소하시겠습니까?\n작성 취소 시, 작성된 내용은 저장되지 않습니다.`}
            btnText={"강의 등록 취소"}
            modalStyle={"square"}
            btnClick={() =>
              router.push("/mentor/myclass/classRegistrationIntro")
            }
          />
        </ModalWithBackground>
      ) : (
        <></>
      )}

      <TopBar text={"강의 등록"} onClick={() => setModal(true)} />
      <div className={styles.category}>
        <MenuBtn selected={true} text={"1단계"} onClick={() => MoveStep(1)} />
        <MenuBtn selected={false} text={"2단계"} onClick={() => MoveStep(2)} />
        <MenuBtn selected={false} text={"3단계"} onClick={() => MoveStep(3)} />
      </div>

      <section className={styles.contentSection}>
        <div className={styles.questionBlock}>
          <h3 className={styles.question}>
            1. 강의 소개 메인 이미지를 등록해주세요.
          </h3>
          <ImgCrop value={form.image} handleChange={imgChange} token={token} />
        </div>
        <div className={styles.questionBlock}>
          <h3 className={styles.question}>2. 강의 타이틀을 입력해주세요.</h3>
          <ClassRegistrationInputBox
            placeholder={"최대 20자"}
            value={form.title}
            onChange={handleChange("title")}
            limit={`${form.title.length}/20`}
          />
        </div>
        <div className={styles.questionBlock}>
          <h3 className={styles.question}>3. 강의 소제목을 입력해주세요.</h3>
          <ClassRegistrationInputBox
            placeholder={"최대 30자"}
            value={form.subtitle}
            onChange={handleChange("subtitle")}
            limit={`${form.subtitle.length}/30`}
          />
        </div>
        <div className={styles.questionBlock}>
          <h3 className={styles.question}>
            4. 간략하게 멘토 자신을 소개해주세요.
          </h3>
          <ClassRegistrationInputBox
            placeholder={"최대 20자"}
            value={form.introduction}
            onChange={handleChange("introduction")}
            limit={`${form.introduction.length}/20`}
          />
        </div>
      </section>

      <BottomBlueBtn text={"다음"} onClick={() => MoveStep(form.step + 1)} />
    </div>
  );
};

export default Step01;
