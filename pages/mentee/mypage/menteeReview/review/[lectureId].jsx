import React from "react";
import * as cookie from "cookie";
import { useState } from "react";
import {
  BottomBlueBtn,
  ModalWithBackground,
  TopBar,
} from "../../../../../components/common";
import styles from "./editPage/edit.module.scss";
import router from "next/router";
import MenteeStar from "../../../../../components/mentee/MenteeStar";
import ReviewModal from "../../../../../components/mentee/ReviewModal";
import {
  writeReviewAPI,
  getEnrolledClass,
} from "../../../../../core/api/Mentee";
import ConfirmModal from "../../../../../components/mentee/ConfirmModal";

export async function getServerSideProps(context) {
  const token = cookie.parse(context.req.headers.cookie).accessToken;
  const lectureId = context.query.lectureId;

  const unreviewedLecture = await getEnrolledClass(token, lectureId);

  return {
    props: { token, lectureId, unreviewedLecture },
  };
}

const WriteMentee = ({ token, lectureId, unreviewedLecture }) => {
  const [modal, setModal] = useState(false);
  const [confirm, setConfirm] = useState(false);

  const [content, setContent] = useState("");
  const [score, setScore] = useState(0);

  const onChange = (e) => {
    setContent(e.target.value);
  };

  return (
    <>
      <section className={styles.contentSection}>
        {modal ? (
          <ModalWithBackground
            setModal={setModal}
            className={styles.modalHeight}
          >
            <ReviewModal
              mainText={"후기 등록"}
              subText={"작성한 후기를 등록하시겠습니까?"}
              cancelBtn={() => {
                setModal(false);
              }}
              confirmBtn={async () => {
                const res = await writeReviewAPI(
                  token,
                  lectureId,
                  content,
                  score
                );

                if (res == 200 || res == 201) {
                  setConfirm(!confirm);
                }
              }}
            />
          </ModalWithBackground>
        ) : (
          <></>
        )}

        {confirm ? (
          <ModalWithBackground setModal={setModal}>
            <ConfirmModal
              mainText={"후기 등록"}
              subText={`후기 등록이 완료되었습니다.\n수강하시느라 고생 많으셨습니다.`}
              confirm={() => {
                router.push("/mentee/mypage/menteeReview");
              }}
            />
          </ModalWithBackground>
        ) : (
          <></>
        )}

        <article className={styles.topSection}>
          <TopBar
            text={"후기 작성"}
            onClick={() => {
              // router.push("/mentee/mypage/menteeReview");
              router.back();
            }}
          />
        </article>

        <article className={styles.lectureInfoSection}>
          <div className={styles.lectureInfo}>
            <img
              className={styles.lectureInfoImg}
              src={
                unreviewedLecture.thumbnail
                  ? unreviewedLecture.thumbnail
                  : "/samples/lecture.png"
              }
            />
            <div className={styles.lectureInfoText}>
              <p className={styles.lectureTitle}>{unreviewedLecture.title}</p>
              <p className={styles.mentorNickname}>
                {unreviewedLecture.lectureMentor?.nickname}
              </p>
              <p className={styles.system}>
                옵션:
                {unreviewedLecture.systems.length === 2
                  ? "온라인/오프라인"
                  : unreviewedLecture.systems.name === "온라인"
                  ? "온라인"
                  : "오프라인"}
                <span>
                  {unreviewedLecture.lecturePrice.isGroup ? `/그룹` : "/개인"}
                </span>
              </p>
            </div>
          </div>
        </article>

        <div className={styles.line} />

        <article className={styles.editSection}>
          <div className={styles.editCon}>
            <p className={styles.editTitle}>강의는 만족하셨나요?</p>

            {[...Array(5)].map((_, i) => {
              return (
                <MenteeStar
                  width={"40px"}
                  height={"40px"}
                  key={i}
                  color={score >= i + 1 ? "#ffd704" : "#e8eaef"}
                  onClick={() => {
                    setScore(i + 1);
                  }}
                />
              );
            })}
          </div>
        </article>

        <div className={styles.line} />

        <article className={styles.editSection}>
          <div className={styles.editCon}>
            <p className={styles.editTitle}>상세한 후기를 작성해주세요.</p>
            <textarea
              className={styles.textCon}
              placeholder={`강의에 대한 의견을 자유롭게 작성해주세요 \n최소 20자 이상`}
              onChange={onChange}
              value={content}
            />
          </div>
        </article>

        <div className={styles.line} />

        <article className={styles.infoSection}>
          <p className={styles.infoTitle}>후기 작성 안내</p>
          <ul className={styles.infoList}>
            <li>
              후기 내용은 20자 이상 작성합니다. 강의와 관련없는 내용, 이메일,
              휴대전화 번호 등의 개인정보/광고/비속어가 포함 된 후기는 블라인드
              처리 됩니다.
            </li>
            <li>
              최종 등록된 후기는 공개되어 멘토릿지 사용자가 조회 가능하며,
              댓글이 등록될 수 있습니다.
            </li>
          </ul>
        </article>
      </section>

      <BottomBlueBtn
        text={"등록"}
        onClick={setModal}
        disabled={content.length < 20 || score === 0 ? true : false}
      />
    </>
  );
};

export default WriteMentee;
