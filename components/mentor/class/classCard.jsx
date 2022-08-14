import router from "next/router";
import Image from "next/image";
import styles from "./classCard.module.scss";
import { IC_StudentHeadphone } from "../../../icons";
import { LevelToKor } from "../../../utils/class/classLevel";

const ClassCard = ({ data }) => {
  const subjectOnly = data.lectureSubjects.map((data) => data.krSubject);
  const classSystem1 = data.systems.map((data) => data.name);
  const classSystem2 = data.lecturePrices.map((data) =>
    data.isGroup ? "그룹" : "1:1"
  );
  const classLevel = [LevelToKor(data.difficulty)];
  const classTags = classLevel.concat(classSystem1, classSystem2);
  let title = data.title;

  return (
    <section
      className={styles.classCard}
      onClick={() =>
        router.push(`/mentor/myclass/classDetail/${data.lectureId}`)
      }
    >
      <div className={styles.classCardImage}>
        <Image
          src={data.thumbnail ? data.thumbnail : "/samples/lecture.png"}
          width="330px"
          height="136px"
          alt=""
          className={styles.classCardImg}
        />
        <section className={styles.classSystemSection}>
          {classTags.map((data, i) => {
            return (
              <div className={styles.classSystemTag} key={i}>
                <span>{data}</span>
              </div>
            );
          })}
          <div
            className={
              data.approved === false
                ? styles.approvedFalse
                : styles.approvedTrue
            }
          >
            <span>{data.approved === false ? "미승인" : "승인완료"}</span>
          </div>
        </section>
      </div>

      <div className={styles.classCardExplanation}>
        <strong className={styles.subject}>{subjectOnly.join(", ")}</strong>
        <div className={styles.secondLine}>
          <h1 className={styles.title}>
            {title.length >= 20 ? title.substring(0, 20) + "..." : title}
          </h1>
          <div className={styles.studentCnt}>
            <IC_StudentHeadphone width="9.33" height="13" />
            <span className={styles.cnt}>{data.enrollmentCount}</span>
          </div>
        </div>

        <span className={styles.subtitle}>{data.subTitle} </span>
        <strong className={styles.name}>
          멘토 {data.lectureMentor.nickname}
        </strong>
      </div>
    </section>
  );
};

export default ClassCard;
