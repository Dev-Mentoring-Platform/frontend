import React, { useState, useEffect } from "react";
import router from "next/router";
import styles from "./BottomNavBar.module.scss";
import { IC_HeartEmpty, IC_HeartRedFill_Lg, IC_TalkDots } from "../../../icons";
import { enrollClass, updatePicks } from "../../../core/api/Mentee";
import { requestChatToMentor } from "../../../core/api/Chat";

function BottomNavBar({ classData, token, params }) {
  // const [isVisible, setIsVisible] = useState(false);
  // const [systemType, setSystemType] = useState("");
  // const [group, setGroup] = useState("");

  const [liked, setLiked] = useState(false);
  const handleEnrollClass = async () => {
    const res = await enrollClass(token, params);
    if (res.status === 201) {
      alert("강의 신청 성공");
    } else {
      alert("동일한 수강내역이 존재합니다.");
    }
  };

  const getPicked = () => {
    if (classData.picked) setLiked(true);
  };

  const handlePicks = async () => {
    const res = await updatePicks(token, params);

    if (res.data) {
      setLiked(true);
    } else if (res.data === "") {
      setLiked(false);
    }
  };

  useEffect(() => {
    getPicked();
  }, []);

  // const handleSelection = (value, setValue) => {
  //   setValue(value);
  // };

  // const openDrawer = () => {
  //   setIsVisible(true);
  // };

  // const onClose = useCallback(() => {
  //   setIsVisible(false);
  // }, []);

  return (
    <div className={styles.container}>
      <button onClick={handlePicks}>
        {liked ? (
          <IC_HeartRedFill_Lg />
        ) : (
          <IC_HeartEmpty width={"24px"} height={"24px"} />
        )}
      </button>
      <button
        onClick={async () => {
          const res = await requestChatToMentor(token, params?.mentorId);
          if (!isNaN(res)) {
            router.push({
              pathname: `/common/chat/chatDetail/${res}`,
              query: { other: classData.lectureMentor.mentorUserId },
            });
          } else {
            console.log("채팅 요청 실패");
          }
        }}
      >
        <IC_TalkDots width={"24px"} height={"24px"} />
      </button>
      <button className={styles.subscription} onClick={handleEnrollClass}>
        강의 신청
      </button>
      <div className={styles.indicator}></div>
      {/* <Drawer isVisible={isVisible} onClose={onClose} className={styles.drawer}>
        <FormControl fullWidth className={styles.selecter}>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            displayEmpty
            value={systemType} 
            onChange={(e) => handleSelection(e.target.value, setSystemType)}
            renderValue={(selected) => {
              if (selected.length === 0) {
                return <em>강의방식1 선택하기</em>;
              }

              return selected;
            }}
          >
            <MenuItem value={"온라인"}>온라인</MenuItem>
            <MenuItem value={"오프라인"}>오프라인</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth className={styles.selecter}>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            displayEmpty
            value={group}
            onChange={(e) => handleSelection(e.target.value, setGroup)}
            renderValue={(selected) => {
              if (selected.length === 0) {
                return <em>강의방식2 선택하기</em>;
              }

              return selected;
            }}
          >
            <MenuItem value={"1:1강의"}>1:1강의</MenuItem>
            <MenuItem value={"그룹강의(1:3)"}>그룹강의(1:3)</MenuItem>
          </Select>
        </FormControl>
        <span className={styles.line} />
        <button className={styles.enroll}>강의 신청</button>
      </Drawer> */}
    </div>
  );
}

export default BottomNavBar;
