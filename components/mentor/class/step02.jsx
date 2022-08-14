import { useEffect, useState } from "react";
import styles from "./steps.module.scss";
import Quill from "../../common/editor/QuillDynamic";
import {
  MenuBtn,
  TopBar,
  BottomBlueBtn,
  SelectBoxWithTitle,
} from "../../common";
import { IC_PlusCircle } from "../../../icons";
import { getSubjects } from "../../../core/api/Lecture";
import LectureSubjectPick from "./lectureSubjectPick";

const Step02 = ({ form, handleChange, MoveStep, token }) => {
  const [subject, setSubject] = useState([]);

  useEffect(() => {
    getSubjects().then((res) => setSubject(res));
  }, []);

  return (
    <div className={styles.step}>
      <TopBar text={"강의 등록"} onClick={() => MoveStep(form.step - 1)} />
      <div className={styles.category}>
        <MenuBtn selected={false} text={"1단계"} onClick={() => MoveStep(1)} />
        <MenuBtn selected={true} text={"2단계"} onClick={() => MoveStep(2)} />
        <MenuBtn selected={false} text={"3단계"} onClick={() => MoveStep(3)} />
      </div>

      <section className={styles.contentSection}>
        <div className={styles.questionBlock}>
          <h3 className={styles.question}>1. 강의 종류를 선택해주세요.</h3>
          {form.lectureSubject?.map((data, i) => {
            return data != undefined ? (
              <LectureSubjectPick
                key={i}
                i={i}
                subject={subject}
                handleChange={handleChange}
                value={data}
              />
            ) : (
              <div key={i} />
            );
          })}
          <button
            type="button"
            className={styles.plusBtn}
            onClick={handleChange("lectureSubjectAdd")}
          >
            <div className={styles.plusImg} />
            <IC_PlusCircle />
          </button>
        </div>

        <div className={styles.questionBlock}>
          <h3 className={styles.question}>2. 강의 난이도를 선택해주세요.</h3>
          <SelectBoxWithTitle
            title={"난이도"}
            arr={["입문", "초급", "중급", "고급"]}
            name={"level"}
            onChange={handleChange("level")}
            value={form.level}
          />
        </div>

        <div className={styles.questionBlock}>
          <h3 className={styles.question}>
            3. 강의 상세 내용 및 이미지를 등록해주세요.
          </h3>
          <ul className={styles.example}>
            <li>• 멘토 간략 소개</li>
            <li>• 커리큘럼</li>
            <li>• 강의 진행방향 (예시 화면 첨부 등)</li>
          </ul>
        </div>
        <Quill form={form} token={token} />
      </section>
      <BottomBlueBtn text={"다음"} onClick={() => MoveStep(form.step + 1)} />
    </div>
  );
};

export default Step02;
