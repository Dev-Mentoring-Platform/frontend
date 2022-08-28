import React, { useState } from "react";
import LecturePrice from "./LecturePrice";
import styles from "./LectureTitle.module.scss";
import { IC_Star } from "../../../icons";
import { MenuBtn } from "../../common";
import { Rating, RatingBig } from "../../mentor/class/rating";
import ClassReview from "../../mentor/class/classReview";
import renderHTML from "react-render-html";
import classNames from "classnames";
import { transGroup } from "../classCard";

function LectureTitle({ token, classData, reviewData, role }) {
  const [select, setSelect] = useState(true);

  const score =
    classData?.scoreAverage % 1 == 0
      ? classData?.scoreAverage + ".0"
      : Math.round(classData?.scoreAverage * 10) / 10;
  return (
    <>
      <div className={styles.container}>
        <div className={styles.main_box}>
          <div
            className={styles.lang}
          >{`${classData.lectureSubjects[0]?.learningKind} > ${classData.lectureSubjects[0]?.krSubject}`}</div>
          <div className={styles.tags}>
            <div className={classNames(styles.tag)}>
              {classData?.systems[0]?.type}
            </div>
            <div className={classNames(styles.tag)}>
              {transGroup(classData?.lecturePrice.isGroup)}
            </div>
          </div>
          <div className={styles.title}>{classData.title}</div>
          <div className={styles.review}>
            <div className={styles.star}>
              <Rating
                w={49.72}
                h={9.75}
                otherStyle={styles.ratingSmallFill}
                fillRating={score}
              />
              <span>{score}</span>
            </div>
            <span
              className={styles.reviewCountStyle}
              onClick={() => setSelect(false)}
            >{`${classData.reviewCount} 개의 후기`}</span>
          </div>
        </div>
        <LecturePrice classData={classData} />
        <span className={styles.line} />
        <div className={styles.btnBlock}>
          <MenuBtn
            selected={select}
            text={"강의 소개"}
            ownStyle={styles.menuBtn}
            onClick={() => setSelect(true)}
          />
          <MenuBtn
            selected={!select}
            text={`후기 ${classData?.reviewCount}`}
            ownStyle={styles.menuBtn}
            onClick={() => setSelect(false)}
          />
        </div>
        {select ? (
          <div className={styles.classIntroBlock}>
            {renderHTML(classData?.content)}
          </div>
        ) : (
          <div className={styles.reviewSection}>
            <div className={styles.ratingBig}>
              <strong className={styles.scoreBig}>{score}</strong>
              <RatingBig w={133.5} h={25.58} fillRating={score} />
            </div>
            <div className={styles.reviews}>
              <h1 className={styles.reviewTitle}>강의 후기</h1>
              {reviewData.content.map((data, i) => {
                return (
                  <ClassReview
                    token={token}
                    cid={classData.id}
                    mentee={data}
                    key={i}
                    role={role}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default LectureTitle;
