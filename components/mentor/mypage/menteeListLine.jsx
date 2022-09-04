import { useEffect, useState } from "react";
import router from "next/router";
import Image from "next/image";
import classNames from "classnames";
import { checkEnrollment, getMenteeLecture } from "../../../core/api/Mentor";
import styles from "./menteeListLine.module.scss";
import {
  IC_BubbleStarOutline,
  IC_ChevronDownS,
  IC_PersonBlue,
  IC_TalkDots,
  IMG_LectureSample,
} from "../../../icons";
import { basicBtnStyle } from "../../common";
import { requestChatToMentee } from "../../../core/api/Chat";
import { getMenteeInfo } from "../../../core/api/Mentee";

const MenteeListLine = ({ data, setOpen }) => {
  return (
    <button type="button" className={styles.menteeLine} onClick={setOpen}>
      <div className={styles.profileImg}>
        {data.img ? (
          <Image src={data.img} width={32} height={32} />
        ) : (
          <IC_PersonBlue width="32" height="32" />
        )}
      </div>
      <span className={styles.menteeName}>{data?.nickname} 멘티</span>
      <IC_ChevronDownS className={styles.arrowBtn} />
    </button>
  );
};

const MenteeListBlock = ({ token, data, setOpen, setModal, type }) => {
  const [menteeLecture, setMenteeLecture] = useState([]);
  const [systems, setSystems] = useState("");
  const [change, setChange] = useState(false);
  const GetMenteeLectureInfo = async () => {
    setMenteeLecture(
      await getMenteeLecture(token, data.menteeId).then((res) => res.content)
    );
  };

  useEffect(() => {
    GetMenteeLectureInfo();
  }, []);

  useEffect(() => {
    if (menteeLecture[0]?.lecture.lecturePrice.isGroup)
      setSystems(menteeLecture[0]?.lecture.systems[0].name + " / " + "그룹");
    else setSystems(menteeLecture[0]?.lecture.systems[0].name + " / " + "1:1");
  }, [menteeLecture]);

  return (
    <div className={styles.menteeBlock}>
      <button type="button" className={styles.menteeLine} onClick={setOpen}>
        <div className={styles.profileImg}>
          {data.img ? (
            <Image src={data.img} width={32} height={32} />
          ) : (
            <IC_PersonBlue width="32" height="32" />
          )}
        </div>
        <span className={styles.menteeName}>{data?.nickname} 멘티</span>
        <IC_ChevronDownS className={styles.arrowBtnUp} />
      </button>

      <div className={styles.lectureInfo}>
        <div className={styles.lectureImg}>
          {menteeLecture[0]?.lecture.thumbnail ? (
            <Image
              src={menteeLecture[0]?.lecture.thumbnail}
              width={84}
              height={84}
            />
          ) : (
            <IMG_LectureSample width="84" height="84" />
          )}
        </div>
        <div className={styles.lectureInfoText}>
          <h1 className={styles.title}>{menteeLecture[0]?.lecture?.title}</h1>
          <span className={styles.classSystem}>{systems}</span>
          <span className={styles.price}>
            {menteeLecture[0]?.lecture?.lecturePrice?.totalPrice.toLocaleString(
              "ko-KR"
            )}
            원
          </span>
        </div>
      </div>

      <div className={styles.btnSection}>
        {type === "checked" ? (
          <>
            <button
              type="button"
              className={classNames(
                styles.btnForMenteeBlock,
                basicBtnStyle.btn_bg_color
              )}
              onClick={async () => {
                const res = await requestChatToMentee(token, data.menteeId);
                if (!isNaN(res)) {
                  router.push({
                    pathname: `/common/chat/chatDetail/${res}`,
                    query: { other: data?.userId },
                  });
                } else {
                  console.log("채팅 요청 실패");
                }
              }}
            >
              <IC_TalkDots width={16} height={16} className={styles.btnIcon} />
              <span>대화 요청</span>
            </button>
            <button
              type="button"
              className={classNames(
                styles.btnForMenteeBlock,
                basicBtnStyle.btn_bg_color
              )}
              onClick={() => {
                if (menteeLecture[0]?.reviewId == null) {
                  setModal(true);
                } else {
                  router.push(
                    `/mentor/myclass/classDetail/${menteeLecture[0]?.lecture?.lectureId}/review/${menteeLecture[0]?.reviewId}`
                  );
                }
              }}
            >
              <IC_BubbleStarOutline
                widht={14}
                height={14}
                className={styles.btnIcon}
              />
              <span>리뷰 확인</span>
            </button>
          </>
        ) : (
          <button
            type="button"
            className={classNames(
              styles.btnForMenteeBlock,
              styles.btnWhole,
              basicBtnStyle.btn_bg_color
            )}
            onClick={async () => {
              if (!change) {
                const res = await checkEnrollment(token, data.enrollmentId);
                if (res == 200) setChange(true);
              }
            }}
          >
            <IC_TalkDots width={16} height={16} className={styles.btnIcon} />
            <span>{change ? "승인 완료" : "신청 승인"}</span>
          </button>
        )}
      </div>
    </div>
  );
};

const DecideOpenOrClose = ({ data, token, setModal, type }) => {
  const [open, setOpen] = useState(false);
  const [img, setImg] = useState("");

  useEffect(() => {
    const getMenteeImg = async () => {
      const res = await getMenteeInfo(data.menteeId);
      setImg(res.user.image);
    };
    getMenteeImg();
  }, []);

  return open ? (
    <MenteeListBlock
      token={token}
      data={{ ...data, img: img }}
      setOpen={() => setOpen(!open)}
      setModal={setModal}
      type={type}
    />
  ) : (
    <MenteeListLine
      data={{ ...data, img: img }}
      setOpen={() => setOpen(!open)}
    />
  );
};

export { MenteeListLine, MenteeListBlock, DecideOpenOrClose };
