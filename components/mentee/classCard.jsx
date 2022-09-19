import styles from "./classCard.module.scss";
import classNames from "classnames";
import { IC_HeartEmpty, IC_HeartRedFill, IC_HeightBar } from "../../icons";
import { useRouter } from "next/router";
import { LevelToKor } from "../../utils/class/classLevel";
import { Rating } from "../mentor/class/rating";
import Image from "next/image";

export const transGroup = (status) => {
  if (!status) return "개인";
  else return "그룹";
};

const ClassCard = ({ classDetail }) => {
  const { title, explanation, lectureMentor, lecturePrice } = classDetail;
  const router = useRouter();

  return (
    <div className={styles.classCard} aria-label={`${title} 상세 정보 보기`}>
      <section
        onClick={() =>
          router.push({
            pathname: `/mentee/classdetails/${classDetail.lectureId}`,
            query: {
              lecturePriceId: lecturePrice?.lecturePriceId,
              mentorId: lectureMentor.mentorId,
            },
          })
        }
      >
        <div className={styles.imageContainer}>
          <Image
            layout="fill"
            objectFit="cover"
            src={classDetail.thumbnail || "/samples/lecture.png"}
            alt={title}
          />
          <div className={styles.labels}>
            <div className={styles.label}>
              {LevelToKor(classDetail.difficulty)}
            </div>
          </div>
        </div>
        <div className={styles.informationBox}>
          <div className={styles.tags}>
            {classDetail.systems.length === 2 ? (
              <>
                <div className={classNames(styles.tag)}>
                  {classDetail.systems[0].type}
                </div>
                <div className={classNames(styles.tag)}>
                  {classDetail.systems[1].type}
                </div>
              </>
            ) : (
              <>
                <div className={classNames(styles.tag)}>
                  {classDetail.systems[0].type}
                </div>
              </>
            )}
            <div className={classNames(styles.tag)}>
              {transGroup(lecturePrice?.isGroup)}
            </div>
          </div>
          <h2>{title}</h2>
          <h3>{explanation}</h3>
          <p className={styles.tutorName}>{`멘토 ${lectureMentor.nickname}`}</p>
          <div className={styles.rating}>
            {classDetail.picked ? (
              <IC_HeartRedFill width="18px" height="18px" />
            ) : (
              <IC_HeartEmpty width="18px" height="18px" />
            )}
            <span>{classDetail.pickCount ? classDetail.pickCount : 0}</span>
            <IC_HeightBar width="1" height="8" className={styles.height_bar} />
            <Rating w={55} h={11} fillRating={classDetail.scoreAverage} />
            <span
              className={styles.review_num}
            >{`${classDetail.reviewCount}개 후기`}</span>
          </div>
          <div className={styles.price_box}>
            <span className={styles.sale}></span>
            <span className={styles.price}>
              {lecturePrice.totalPrice.toLocaleString()}
            </span>
            <span className={styles.won}>원</span>
            <span className={styles.month}></span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ClassCard;
