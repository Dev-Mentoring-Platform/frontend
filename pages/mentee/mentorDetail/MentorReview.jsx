import React, { useState, useEffect, useRef } from "react";
import styles from "./MentorReview.module.scss";
import { getOneMentorLecture } from "../../../core/api/Mentor";
import { Rating, RatingBig } from "../../../components/mentor/class/rating";
import Image from "next/image";
import classNames from "classnames";
import router from "next/router";
import { IC_PersonBlue } from "../../../icons";

const MentorReview = ({ params, token }) => {
  const [page, setPage] = useState(1);
  const [reviewInfo, setReviewInfo] = useState([]);
  const [reviewList, setReviewList] = useState([]);
  const lectureRouter = useRef(null);

  const oneMentorLecture = async () => {
    const review = await getOneMentorLecture(params, page);
    setReviewInfo(review);
    setReviewList(review.reviews.content);
  };

  useEffect(() => {
    oneMentorLecture();
  }, []);

  const handleLecturePage = (e, lectureId, lecturePriceId) => {
    for (let i = 0; i < reviewList.length; i++) {
      if (
        lectureId === reviewList[i].lecture.id &&
        lecturePriceId === reviewList[i].lecture.lecturePrice.lecturePriceId
      ) {
        e.stopPropagation();
        lectureRouter.current;
        router.push({
          pathname: `/mentee/classdetails/${reviewList[i].lecture.id}`,
          query: {
            lecturePriceId: reviewList[i].lecture.lecturePrice.lecturePriceId,
          },
        });
      }
    }
  };

  return (
    <section className={styles.reviewInfoSection}>
      <article className={styles.ratingSection}>
        <h2>멘토 평점</h2>
        <div className={styles.star}>
          <RatingBig
            w={"140px"}
            h={"25px"}
            otherStyle={styles.ratingSmallFill}
            fillRating={reviewInfo.scoreAverage}
          />
          <span className={styles.ratingScore}>
            {reviewInfo.scoreAverage}{" "}
            <span className={styles.ratingScoreAll}>/ 5</span>
          </span>
        </div>
      </article>

      <div className={styles.line} />

      <article className={styles.reviewFilterSection}>
        <div className={styles.reviewCount}>
          <p className={styles.reviewInfoText}>
            등록된 리뷰 {reviewInfo.reviewCount}건
          </p>
          <div className={styles.filterIcon}>
            <div>
              <svg
                width="0.8rem"
                height="1.3rem"
                viewBox="0 0 10 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_1168_2381)">
                  <path
                    d="M3 13.5002L2.99976 14.0002L1.99976 13.9998L2 13.4998L3 13.5002ZM2.00366 5.96028L2.0039 5.46028L3.0039 5.46077L3.00366 5.96077L2.00366 5.96028ZM1.34998 7.33078L0.992882 7.68075L0.292929 6.96656L0.650024 6.61659L1.34998 7.33078ZM2.50366 5.5L2.15368 5.14291L2.50451 4.79907L2.8545 5.14376L2.50366 5.5ZM4.35085 6.61744L4.70709 6.96829L4.0054 7.68077L3.64915 7.32992L4.35085 6.61744ZM2 13.4998L2.00366 5.96028L3.00366 5.96077L3 13.5002L2 13.4998ZM0.650024 6.61659L2.15368 5.14291L2.85363 5.85709L1.34998 7.33078L0.650024 6.61659ZM2.8545 5.14376L4.35085 6.61744L3.64915 7.32992L2.15281 5.85624L2.8545 5.14376Z"
                    fill="#434A58"
                  />
                  <path
                    d="M7.09961 5.49976L7.09985 4.99976L8.09985 5.00024L8.09961 5.50024L7.09961 5.49976ZM8.09595 13.0397L8.09571 13.5397L7.09571 13.5392L7.09595 13.0392L8.09595 13.0397ZM8.74963 11.6692L9.10673 11.3192L9.80668 12.0334L9.44959 12.3834L8.74963 11.6692ZM7.59595 13.5L7.94593 13.8571L7.5951 14.2009L7.24511 13.8562L7.59595 13.5ZM5.74876 12.3826L5.39252 12.0317L6.09421 11.3192L6.45045 11.6701L5.74876 12.3826ZM8.09961 5.50024L8.09595 13.0397L7.09595 13.0392L7.09961 5.49976L8.09961 5.50024ZM9.44959 12.3834L7.94593 13.8571L7.24598 13.1429L8.74963 11.6692L9.44959 12.3834ZM7.24511 13.8562L5.74876 12.3826L6.45045 11.6701L7.9468 13.1438L7.24511 13.8562Z"
                    fill="#6595f4"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_1168_2381">
                    <rect width="10" height="17" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </div>

            <p>최신순</p>
          </div>
        </div>
        <div />
      </article>

      <div className={styles.line2} />

      <article className={styles.reviewSection}>
        {reviewInfo.reviews?.content.map((review, i) => {
          const score =
            review.score % 1 == 0
              ? review.score + ".0"
              : Math.round(review.score * 10) / 10;

          const reviewDate = review.createdAt.slice(0, 10);
          const dateDot = reviewDate.split("-").join(".");

          return (
            <div key={i}>
              <div
                className={classNames(styles.reviewerSection, styles.pointer)}
                key={review.menteeReivewId}
                onClick={() => {
                  router.push(
                    `/mentee/mypage/menteeReview/review/detailPage/${review.menteeReviewId}`
                  );
                }}
              >
                <div className={styles.reviewerInfo}>
                  <div className={styles.reviewer}>
                    {review.userImage ? (
                      <Image
                        src={review.userImage}
                        alt={review.userImage}
                        width={"32px"}
                        height={"32px"}
                        className={styles.reviewerImg}
                      />
                    ) : (
                      <IC_PersonBlue width={32} height={32} />
                    )}
                    <div className={styles.reviewScore}>
                      <p className={styles.userNickname}>
                        {review.userNickname}
                      </p>
                      <Rating
                        w={"55px"}
                        h={"11px"}
                        otherStyle={styles.ratingSmallFill}
                        fillRating={score}
                      />
                    </div>
                  </div>
                  <p className={styles.day}>{dateDot}</p>
                </div>

                <div className={styles.reviewCon}>
                  <p className={styles.reviewText}>{review.content}</p>

                  <div
                    className={styles.lectureCon}
                    ref={lectureRouter}
                    onClick={(e) => {
                      handleLecturePage(
                        e,
                        review.lecture.id,
                        review.lecture.lecturePrice.lecturePriceId
                      );
                    }}
                  >
                    <p
                      className={classNames(styles.lectureText, styles.pointer)}
                    >
                      <span className={styles.lecturePointText}>
                        [ {review.lecture.lectureSubjects[0].krSubject} ]
                      </span>{" "}
                      <span>{review.lecture.title}</span>
                    </p>

                    <svg
                      width="20px"
                      height="20px"
                      viewBox="0 0 27 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8.53613 7L15.5361 12.5L8.53613 18"
                        stroke="#2C343F"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <div className={styles.line3} />
            </div>
          );
        })}
      </article>
    </section>
  );
};

export default MentorReview;
