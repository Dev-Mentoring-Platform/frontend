import { useState } from "react";
import router from "next/router";
import renderHTML from "react-render-html";
import Image from "next/image";
import * as cookie from "cookie";
import styles from "./classDetail.module.scss";
import {
  getLectureDetail,
  getReview,
  deleteLecture,
} from "../../../../../core/api/Lecture";
import {
  TopBar,
  BasicBtn,
  MenuBtn,
  ModalWithBackground,
  BasicModal,
} from "../../../../../components/common";
import ClassReview from "../../../../../components/mentor/class/classReview";
import {
  Rating,
  RatingBig,
} from "../../../../../components/mentor/class/rating";
import { LevelToKor } from "../../../../../utils/class/classLevel";
import {
  closeLecture,
  openLecture,
} from "../../../../../core/api/Mentor/openLecture";
import RefreshPage from "../../../../../utils/refreshPage";
import NoWrite from "../../../../../components/mentee/NoWrite";

export async function getServerSideProps(context) {
  const token = cookie.parse(context.req.headers.cookie).accessToken;
  const classID = context.query.cid;
  const classData = await getLectureDetail(classID, token);
  const reviewData = await getReview(classID);

  return {
    props: { token, classData, reviewData, classID },
  };
}

const ClassDetail = ({ token, classData, reviewData, classID }) => {
  const [select, setSelect] = useState(true);
  const [modal, setModal] = useState(false);
  const [lectureOpenModal, setLectureOpenModal] = useState(false);

  const subjectOnly = classData.lectureSubjects.map(
    (data, i) => data.krSubject
  );
  const score =
    classData?.scoreAverage % 1 == 0
      ? classData?.scoreAverage + ".0"
      : Math.round(classData?.scoreAverage * 10) / 10;

  return (
    <section className={styles.classDetailSection}>
      {modal && (
        <ModalWithBackground prevent={false} setModal={setModal}>
          <BasicModal
            notice={"강의를 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다."}
            btnText={"강의 삭제"}
            modalStyle={"square"}
            btnClick={async () => {
              const res = await deleteLecture(token, classData.lectureId);
              if (res == 200) {
                router.push("/mentor/myclass/myClassList");
              }
            }}
          />
        </ModalWithBackground>
      )}
      {lectureOpenModal && (
        <ModalWithBackground setModal={setLectureOpenModal}>
          <div className={styles.lectureOpenModal}>
            {classData.lecturePrices.map((data, i) => {
              return (
                <div className={styles.openState}>
                  <span className={styles.type}>
                    {data.isGroup ? "그룹" : "1:1"}
                  </span>
                  <div>
                    <span
                      className={
                        data.closed ? styles.status_closed : styles.status_open
                      }
                    >
                      {data.closed ? "모집 종료" : "모집 중"}
                    </span>
                    <button
                      type="button"
                      className={data.closed ? styles.openBtn : styles.closeBtn}
                      onClick={async () => {
                        let res;
                        if (data.closed) {
                          res = await openLecture(
                            classID,
                            data.lecturePriceId,
                            token
                          );
                        } else {
                          res = await closeLecture(
                            classID,
                            data.lecturePriceId,
                            token
                          );
                        }
                        if (res === 200) RefreshPage();
                      }}
                    >
                      {data.closed ? "모집 재개" : "모집 종료"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </ModalWithBackground>
      )}
      <TopBar  />
      <div className={styles.imageBlock}>
        <Image
          src={
            classData.thumbnail ? classData.thumbnail : "/samples/lecture.png"
          }
          width={375}
          height={277}
        />
        <div className={styles.edit_remove_btn}>
          {classData.approved && (
            <BasicBtn
              text={"모집 상태 변경"}
              btnStyle={styles.stateBtn}
              onClick={() => setLectureOpenModal(true)}
            />
          )}

          <BasicBtn
            text={"수정"}
            btnStyle={styles.editBtn}
            onClick={() =>
              router.push({
                pathname: "/mentor/myclass/classRegistration",
                query: { classID: classData.lectureId },
              })
            }
          />
          <BasicBtn
            text={"삭제"}
            btnStyle={styles.removeBtn}
            onClick={() => setModal(true)}
          />
        </div>
        <div className={styles.classSystemTag}>
          <span>{LevelToKor(classData.difficulty)}</span>
        </div>
        <div className={styles.mentorProfileBlock}>
          <Image
            src={
              classData.lectureMentor.image
                ? classData.lectureMentor.image
                : "/samples/mentor.svg"
            }
            width={72}
            height={72}
            className={styles.mentorImg}
          />
          <span className={styles.mentorName}>
            <span className={styles.role}>멘토 </span>
            {classData.lectureMentor.nickname}
          </span>
        </div>
      </div>
      <div className={styles.classInfoBlock}>
        <span className={styles.classSubject}>{subjectOnly.join(", ")}</span>
        <h1 className={styles.title}>{classData.title}</h1>
        <div className={styles.ratingReviewSection}>
          <Rating
            w={49.72}
            h={9.75}
            otherStyle={styles.ratingSmallFill}
            fillRating={score}
          />
          <span className={styles.ratingNum}>{score}</span>
          <span className={styles.reviewCnt} onClick={() => setSelect(false)}>
            <strong>{classData.reviewCount}</strong>개의 후기
          </span>
        </div>
        <span className={styles.subtitle}>{classData.subTitle}</span>
      </div>
      <div className={styles.classPriceBlock}>
        {classData.lecturePrices.map((data, i) => {
          return (
            <div className={styles.price} key={i}>
              <span className={styles.group}>
                {data.isGroup ? "그룹" : "1:1"}
              </span>
              <h1>{data.totalPrice.toLocaleString("ko-KR")} 원</h1>
              <span className={styles.priceDetail}>
                ({data.numberOfLectures}회, {data.timePerLecture}시간)
              </span>
            </div>
          );
        })}
      </div>
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
          text={`후기 ${classData.reviewCount}`}
          ownStyle={styles.menuBtn}
          onClick={() => setSelect(false)}
        />
      </div>
      {select ? (
        <div className={styles.classIntroBlock}>
          {renderHTML(classData.content)}
        </div>
      ) : (
        <div className={styles.reviewSection}>
          <div className={styles.ratingBig}>
            <strong className={styles.scoreBig}>{score}</strong>
            <RatingBig w={133.5} h={25.58} fillRating={score} />
          </div>
          <div className={styles.reviews}>
            <h1 className={styles.reviewTitle}>강의 후기</h1>
            <NoWrite text={"아직 강의 후기가 없습니다."} />
            {reviewData.content.map((data, i) => {
              return (
                <ClassReview
                  token={token}
                  cid={classData.lectureId}
                  mentee={data}
                  key={i}
                />
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
};

export default ClassDetail;
