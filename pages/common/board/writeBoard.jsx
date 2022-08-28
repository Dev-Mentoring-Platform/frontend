import React, { useEffect, useState } from "react";
import {
  BasicInputBox,
  BasicSelectBox,
  BottomBlueBtn,
  TopBar,
} from "../../../components/common";
import BasicTextAreaBox from "../../../components/common/inputBox/basicTextAreaBox";
import { uploadPost } from "../../../core/api/Mentee";
import styles from "./writeboard.module.scss";
import * as cookie from "cookie";
import router from "next/router";
import { getBoardCategory } from "../../../core/api/mentee/board";

// "LECTURE_REQUEST" , "TALK"
const WriteBoard = ({ token, categories }) => {
  const [inquiryInfo, setInquiryInfo] = useState({
    content: "",
    title: "",
    category: "강의요청",
    image: "",
  });
  const [errMsg, setErrMsg] = useState("");
  const [result, setResult] = useState({
    success: false,
    error: false,
    errorMsg: "",
  });

  useEffect(() => {
    setResult({ success: false, error: false, errorMsg: "" });

    if (
      inquiryInfo.content.trim() == "" ||
      inquiryInfo.title.trim() == "" ||
      inquiryInfo.category.trim() == ""
    ) {
      setErrMsg("빈칸을 모두 채워주세요.");
    } else {
      setErrMsg("");
    }
  }, [inquiryInfo]);

  return (
    <section className={styles.changeInquiry}>
      <TopBar text={"글쓰기"} />
      <p className={styles.content}>
        <BasicSelectBox
          arr={["강의요청", "잡담"]}
          name={"문의 유형을 선택해주세요."}
          onChange={(e) =>
            setInquiryInfo({
              ...inquiryInfo,
              category:
                e.target.value === "강의요청" ? "LECTURE_REQUEST" : "TALK",
            })
          }
          otherClassName={styles.select}
          selectStyles={styles.selectCon}
        />
        <BasicInputBox
          type={"text"}
          placeholder={"제목을 입력해주세요."}
          onChange={(e) =>
            setInquiryInfo({ ...inquiryInfo, title: e.target.value })
          }
          style={styles.titleBox}
        />
      </p>
      <div className={styles.line} />
      <section className={styles.content}>
        <BasicTextAreaBox
          type={"text"}
          placeholder={"내용을 입력하세요."}
          onChange={(e) =>
            setInquiryInfo({ ...inquiryInfo, content: e.target.value })
          }
          style={styles.areaBox}
        />
      </section>
      <p className={styles.text}>
        질문게시판은 강의 및 개발 관련해서 자유롭게 묻고 답하는 게
        <br />
        시판 입니다. 게시판 목적과 다른 내용의 글이 올라올 경우, 무
        <br />
        통보 삭제되며 서비스 이용이 일시적 제한될 수 있습니다.
      </p>
      <BottomBlueBtn
        text={"업로드"}
        disabled={!(errMsg == "")}
        onClick={async () => {
          const res = await uploadPost(token, inquiryInfo);
          if (res.status == 201) {
            setResult({ success: true, error: false, errorMsg: "" });
            router.push(`/common/board`);
          } else
            setResult({
              success: false,
              error: true,
              errorMsg: res.data.errorDetails[0],
            });
        }}
      />
      <span className={styles.msg}>
        {errMsg}
        {result.errorMsg}
      </span>
      <span className={styles.successMsg}>
        {result.success && "게시판이 등록되었습니다."}
      </span>
    </section>
  );
};

export const getServerSideProps = async (context) => {
  const token = cookie.parse(context.req.headers.cookie).accessToken;
  const role = cookie.parse(context.req.headers.cookie).role;

  const categories = await getBoardCategory(token);
  return {
    props: {
      token,
      categories,
    },
  };
};

export default WriteBoard;
