import { React, useState, useEffect } from "react";
import styles from "./detailReview.module.scss";
import { TopBar } from "../../../../../../components/common";
import { IC_Menu } from "../../../../../../icons";
import router from "next/router";
import classNames from "classnames";
import { Rating } from "../../../../../../components/mentor/class/rating";
import OptionModal from "../../../../../../components/mentee/menteeModal/OptionModal";
import RefreshPage from "../../../../../../utils/refreshPage";
import {
  getViewLecture,
  getMyReviews,
  deleteMenteeReivew,
} from "../../../../../../core/api/Mentee";
import * as cookie from "cookie";

export async function getServerSideProps(context) {
  const token = cookie.parse(context.req.headers.cookie).accessToken;
  const review = context.query.review;
  const lecturesCon = await getMyReviews(review);

  return {
    props: { token, lecturesCon, review },
  };
}

const detailReview = ({ token, lecturesCon, review }) => {
  const [lectureConInfo, setLectureConInfo] = useState([]);

  const [modal, setModal] = useState(false);

  const handleModal = (e) => {
    e.stopPropagation();
    setModal(!modal);
  };

  useEffect(() => {
    setLectureConInfo(lecturesCon);
  }, []);

  const lecture = lecturesCon.lecture;

  const score =
    lecturesCon.score % 1 == 0
      ? lecturesCon.score + ".0"
      : Math.round(lecturesCon.score * 10) / 10;

  const reviewData = String(lecturesCon.createdAt).substr(0, 10);
  const dateDot = reviewData.split("-").join(".");

  return (
    <div>
      <section className={styles.topSection}>
        {modal && (
          <OptionModal
            editClick={() => {
              router.push(
                `/mentee/mypage/menteeReview/review/editPage/${review}`
              );
            }}
            deleteClick={async () => {
              await deleteMenteeReivew(token, review);
              router.push(`/mentee/mypage/menteeReview`);
              RefreshPage();
            }}
            modalHandler={handleModal}
          />
        )}

        <TopBar text={"후기 상세보기"} />

        <IC_Menu onClick={handleModal} className={styles.pointer} />
      </section>

      <section className={styles.contentSection}>
        <article className={classNames(styles.bg, styles.line)}>
          <div className={styles.detailInfo}>
            <img
              className={styles.detailReviewImg}
              src={
                lecture.thumbnail ? lecture.thumbnail : "/samples/lecture.png"
              }
            />
            <div>
              <p>{lecture.title}</p>
              <p className={styles.mentorName}>{lecture.mentorNickname}</p>

              <p>
                <span className={styles.totalPrice}>
                  {lecture?.lecturePrice.totalPrice
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  <span className={styles.totalPriceWon}> 원 </span>
                </span>
                <span className={styles.priceStandard}>/ 1개월 기준</span>
              </p>
            </div>
          </div>
        </article>

        <div className={styles.line2} />

        <article className={styles.bg}>
          <div className={styles.detailReviewCon}>
            <div className={styles.menteeCon}>
              <div className={styles.menteeInfo}>
                <img
                  className={styles.menteeImg}
                  src={
                    lecturesCon.userImage
                      ? lecturesCon.userImage
                      : "/samples/lecture.png"
                  }
                />
                <div className={styles.menteeName}>
                  <p>{lecturesCon.userNickname}</p>
                  <Rating
                    w={"50px"}
                    h={"10px"}
                    otherStyle={styles.score}
                    fillRating={score}
                  />
                </div>

                <p className={styles.date}>{dateDot}</p>
              </div>

              <div className={styles.reivew}>
                <p className={styles.system}>
                  옵션:{" "}
                  {lecture?.systems.length === 2
                    ? "온라인/오프라인"
                    : lecture?.systems.name === "온라인"
                    ? "온라인"
                    : "오프라인"}
                  {lecture.lecturePrices?.isGroup
                    ? `${(<span>"/ 그룹"</span>)}`
                    : null}
                </p>

                <div className={styles.reivewText}>
                  <p>{lecturesCon.content}</p>
                </div>
              </div>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
};

export default detailReview;
