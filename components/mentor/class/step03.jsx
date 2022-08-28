import { useEffect, useState } from "react";
import router from "next/router";
import styles from "./steps.module.scss";
import {
  MenuBtn,
  TopBar,
  BottomBlueBtn,
  BasicModal,
  ModalWithBackground,
  EllipseBtn,
} from "../../common";
import ClassPrice from "./classPrice";
import ClassRegistrationInputError from "./inputErrorHandling";

const Step03 = ({
  form,
  handleChange,
  handleSubmit,
  MoveStep,
  updateResult,
}) => {
  const [err, setErr] = useState("");
  const [modal, setModal] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [registerError, setRegisterError] = useState(false);
  useEffect(() => {
    ClassRegistrationInputError(form, setErr);
  }, [form]);

  useEffect(() => {
    setRegisterSuccess(updateResult.updateSuccess);
    setRegisterError(updateResult.updateError);
  }, [updateResult]);

  const GetResultModal = () => {
    if (registerSuccess && !registerError) {
      return (
        <ModalWithBackground setModal={setModal}>
          <BasicModal
            notice={`업로드 되었습니다.\n내 강의에서 확인하세요.`}
            btnText={"내 강의 바로가기"}
            modalStyle={"square"}
            btnClick={() => router.push("/mentor/myclass/myClassList")}
          />
        </ModalWithBackground>
      );
    } else if (!registerSuccess && registerError) {
      return (
        <ModalWithBackground setModal={setModal}>
          <BasicModal
            notice={`강의 등록 실패`}
            btnText={"메인으로 바로가기"}
            modalStyle={"square"}
            btnClick={() =>
              router.push("/mentor/myclass/classRegistrationIntro")
            }
          />
        </ModalWithBackground>
      );
    } else {
      return <></>;
    }
  };

  return (
    <div className={styles.step}>
      {modal ? (
        <ModalWithBackground setModal={setModal}>
          <BasicModal
            notice={err}
            btnText={"확인"}
            modalStyle={"square"}
            btnClick={() => setModal(false)}
          />
        </ModalWithBackground>
      ) : (
        <></>
      )}
      {GetResultModal()}
      <TopBar text={"강의 등록"} onClick={() => MoveStep(form.step - 1)} />
      <div className={styles.category}>
        <MenuBtn selected={false} text={"1단계"} onClick={() => MoveStep(1)} />
        <MenuBtn selected={false} text={"2단계"} onClick={() => MoveStep(2)} />
        <MenuBtn selected={true} text={"3단계"} onClick={() => MoveStep(3)} />
      </div>

      <section className={styles.contentSection}>
        <div className={styles.questionBlock}>
          <h3 className={styles.question}>
            1. '강의 방식1'을 선택해주세요. &nbsp;
            <span className={styles.caution}>* 중복 선택 가능 </span>
          </h3>
          <div className={styles.classType}>
            <EllipseBtn
              element={"온라인"}
              id={"online"}
              select={form.online}
              onClick={handleChange("online")}
            />
            <EllipseBtn
              element={"오프라인"}
              id={"offline"}
              select={form.offline}
              onClick={handleChange("offline")}
            />
          </div>
        </div>

        <div className={styles.questionBlock}>
          <h3 className={styles.question}>
            2. '강의 방식2'를 선택해주세요. &nbsp;
            <span className={styles.caution}>* 중복 선택 가능 </span>
          </h3>
          <div>
            <EllipseBtn
              element={"1:1 수업"}
              id={"personal"}
              select={form.personal}
              onClick={handleChange("personal")}
            />
            <div className={styles.group}>
              <EllipseBtn
                element={"그룹 수업"}
                id={"group"}
                select={form.group}
                onClick={handleChange("group")}
              />
              {form.group == "on" ? (
                <div className={styles.groupMax}>
                  <input
                    type="number"
                    onChange={handleChange("groupMax")}
                    className={styles.maxInput}
                    value={form.groupMax}
                  />
                  <span className={styles.text_max}>최대</span>
                  <span className={styles.text_cnt}>명</span>
                </div>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>

        {form.personal == "on" && (
          <div className={styles.questionBlock}>
            <h3 className={styles.question}>
              3. 1:1 수업의 강의 가격을 입력해주세요.
              <br />
              <span className={styles.caution}>
                * 무료 강의인 경우 <strong>시간 당 가격</strong>을
                <strong> 0원</strong>으로 설정해주세요.
              </span>
            </h3>
            <ClassPrice
              form={form}
              handleChange={handleChange}
              classType={"personal"}
            />
          </div>
        )}

        {form.group == "on" && (
          <div className={styles.questionBlock}>
            <h3 className={styles.question}>
              {form.personal == "on" ? <span>4</span> : <span>3</span>}. 그룹
              수업의 강의 가격을 입력해주세요.
              <br />
              <span className={styles.caution}>
                * 무료 강의인 경우 <strong>시간 당 가격</strong>을
                <strong> 0원</strong>으로 설정해주세요.
              </span>
            </h3>
            <ClassPrice
              form={form}
              handleChange={handleChange}
              classType={"group"}
            />
          </div>
        )}
      </section>

      <BottomBlueBtn
        text={"강의 업로드"}
        onClick={() => {
          if (err != "") {
            setModal(true);
          } else {
            handleSubmit();
            setModal(true);
          }
        }}
      />
    </div>
  );
};
export default Step03;
