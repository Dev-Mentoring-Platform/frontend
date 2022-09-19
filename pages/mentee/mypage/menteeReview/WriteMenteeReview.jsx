import router from "next/router";
import { useState, useEffect } from "react";
import { IC_Menu, IC_PersonBlue } from "../../../../icons";
import styles from "./menteeReview.module.scss";
import { Rating } from "../../../../components/mentor/class/rating";
import OptionModal from "../../../../components/mentee/menteeModal/OptionModal";
import NoWrite from "../../../../components/mentee/NoWrite";
import { deleteMenteeReivew } from "../../../../core/api/Mentee";
import Image from "next/image";

const WriteMenteeReview = ({ menteeReviews, token }) => {
  const [reviews, setReviews] = useState([]);
  const [modal, setModal] = useState({});
  const [click, setClick] = useState(false);

  useEffect(() => {
    setReviews(menteeReviews);
    for (let i = 0; i < menteeReviews.content.length; i++) {
      setModal((prev) => ({
        ...prev,
        [menteeReviews.content[i].menteeReviewId]: false,
      }));
    }
  }, []);

  const handleModal = (e, i) => {
    e.stopPropagation();
    setModal((prev) => ({ ...prev, [i]: !prev[i] }));
  };

  const reviewCon = reviews.content?.map((review) => {
    return review;
  });

  return (
    <>
      {reviewCon?.length !== 0 ? (
        <>
          {reviewCon?.map((review) => {
            const lectureDate = review.createdAt.slice(0, 10);
            const dateDot = lectureDate.split("-").join(".");

            const score =
              review.score % 1 == 0
                ? review.score + ".0"
                : Math.round(review.score * 10) / 10;

            const krSubject = review.lecture.lectureSubjects?.map(
              (subjects) => subjects.krSubject
            );

            return (
              <div key={review.lecture.id}>
                <div
                  className={styles.pointer}
                  onClick={() => {
                    router.push(
                      `/mentee/mypage/menteeReview/review/detailPage/${review.menteeReviewId}`
                    );
                  }}
                >
                  <section className={styles.line3}>
                    <article className={styles.bg}>
                      <div className={styles.review}>
                        <img
                          className={styles.reviewImg}
                          src={
                            review.lecture.thumbnail || "/samples/lecture2.jpg"
                          }
                          alt={review.lecture.lectureTitle}
                        />

                        <div className={styles.writeReviewCnt}>
                          <p>
                            [ <span>{krSubject.join(",")}</span> ]
                          </p>
                          <p>{review.lecture.title}</p>
                          <p className={styles.reviewInfoText}>
                            {review.lecture.systems?.map((type, i) => (
                              <span key={i}>{type.name} </span>
                            ))}
                            {review.lecture.lecturePrices?.map((group, i) => (
                              <span key={i}>
                                {group.isGroup ? ` / 그룹` : null}
                              </span>
                            ))}
                          </p>
                        </div>
                        <IC_Menu
                          onClick={(e) => handleModal(e, review.menteeReviewId)}
                        />
                        {modal[review.menteeReviewId] && (
                          <OptionModal
                            editClick={(e) => {
                              e.stopPropagation();
                              router.push(
                                `/mentee/mypage/menteeReview/review/editPage/${review.menteeReviewId}`
                              );
                            }}
                            deleteClick={() => {
                              deleteMenteeReivew(token, review.menteeReviewId);
                              router.reload("/mentee/mypage/menteeReview");
                            }}
                            modalHandler={(e) =>
                              handleModal(e, review.menteeReviewId)
                            }
                          />
                        )}
                      </div>
                    </article>
                  </section>
                  <div className={styles.line2} />
                  <section>
                    <article className={styles.bg}>
                      <div className={styles.writeReview}>
                        <Rating
                          w={"50px"}
                          h={"10px"}
                          otherStyle={styles.score}
                          fillRating={score}
                        />
                        <p>{dateDot}</p>
                      </div>
                      <p className={styles.contentText}>{review.content}</p>

                      {review?.child?.content ? (
                        <section
                          key={review.child.content}
                          className={styles.mentorReviewSection}
                        >
                          <div className={styles.mentorProfileBlock}>
                            <div className={styles.profileImg}>
                              {review.child?.content.userImage ? (
                                <Image
                                  src={review.child?.content.userImage}
                                  width={32}
                                  height={32}
                                />
                              ) : (
                                <IC_PersonBlue width={32} height={32} />
                              )}
                            </div>

                            <div className={styles.alignColumn}>
                              <span className={styles.name}>
                                {review.child?.userNickname}
                              </span>
                              <span className={styles.date}>
                                {review.child?.createdAt.substring(0, 10)}
                              </span>
                            </div>
                          </div>

                          <p className={styles.contentBlock}>
                            {review.child?.content}
                          </p>
                        </section>
                      ) : null}
                    </article>
                  </section>
                </div>
                <div className={styles.line} />
              </div>
            );
          })}
        </>
      ) : (
        <NoWrite text={"작성한 후기가 없습니다."} />
      )}
    </>
  );
};

export default WriteMenteeReview;
