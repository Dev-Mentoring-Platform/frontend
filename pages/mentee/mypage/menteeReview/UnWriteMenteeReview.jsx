import { useState, useEffect } from "react";
import styles from "./menteeReview.module.scss";
import classNames from "classnames";
import BasicBtn from "../../../../components/common/button/basicBtn";
import { basicBtnStyle } from "../../../../components/common";
import btn from "../../../../pages/start.module.scss";
import NoWrite from "../../../../components/mentee/NoWrite";
import router from "next/router";

const UnWriteMenteeReview = ({ unreviewedMentee }) => {
  const [unWrite, setUnWrite] = useState([]);

  useEffect(() => {
    setUnWrite(unreviewedMentee);
  }, []);

  const unWriteCon = unWrite.content;

  return (
    <>
      {unWriteCon?.length !== 0 ? (
        <>
          {unWriteCon?.map((unreview) => {
            const lectureDate = unreview.createdAt.slice(0, 10);
            const dateDot = lectureDate.split("-").join(".");

            return (
              <div
                className={styles.unWriteSection}
                key={unreview.enrollmentId}
              >
                <section className={styles.line3}>
                  <article className={styles.bg}>
                    <p className={styles.day}>{dateDot}</p>

                    <div className={styles.review}>
                      <img
                        className={styles.reviewImg}
                        src={unWriteCon.thumbnail || "/samples/lecture2.jpg"}
                      />

                      <div className={styles.reviewCnt}>
                        <p className={styles.reviewInfoText}>
                          {unreview.lecture.mentorNickname}
                        </p>
                        <p>{unreview.lectureTitle}</p>
                        <p className={styles.reviewInfoText}>
                          {unreview.lecture.systems?.map((type, i) => (
                            <span key={i}>{type.name} </span>
                          ))}
                          {unreview.lecture.lecturePrices?.map((group, i) => (
                            <span key={i}>
                              {group.isGroup ? ` / 그룹` : null}
                            </span>
                          ))}
                        </p>
                      </div>

                      <BasicBtn
                        onClick={() => {
                          router.push(
                            `/mentee/mypage/menteeReview/review/${unreview.enrollmentId}`
                          );
                        }}
                        text={"후기작성"}
                        btnStyle={classNames(
                          btn.loginBtn,
                          basicBtnStyle.btn_white,
                          styles.btnRadius,
                          styles.pointer
                        )}
                        textStyle={btn.loginBtnText}
                      />
                    </div>
                  </article>
                </section>
                <div className={styles.line} />
              </div>
            );
          })}
        </>
      ) : (
        <NoWrite text={"작성 가능한 후기가 없습니다. "} />
      )}
    </>
  );
};

export default UnWriteMenteeReview;
