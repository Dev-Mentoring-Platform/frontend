import { useEffect, useState } from "react";
import styles from "../writeboard.module.scss";
import * as cookie from "cookie";
import router from "next/router";
import { editBoardPosts, getBoardDetail } from "../../../../core/api/Mentee";
import {
  BasicInputBox,
  BasicSelectBox,
  BottomBlueBtn,
  TopBar,
} from "../../../../components/common";
import BasicTextAreaBox from "../../../../components/common/inputBox/basicTextAreaBox";

const EditPost = ({ token, post_id, postDetail }) => {
  const [inquiryInfo, setInquiryInfo] = useState({
    content: postDetail.content,
    title: postDetail.title,
    category: postDetail.category,
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
      inquiryInfo.content == "" ||
      inquiryInfo.title == "" ||
      inquiryInfo.category == ""
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
          value={
            inquiryInfo.category === "LECTURE_REQUEST" ? "강의요청" : "잡담"
          }
        />
        <BasicInputBox
          type={"text"}
          placeholder={"제목을 입력해주세요."}
          onChange={(e) =>
            setInquiryInfo({ ...inquiryInfo, title: e.target.value })
          }
          value={inquiryInfo.title}
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
          value={inquiryInfo.content}
          style={styles.areaBox}
        />
      </section>
      <p className={styles.infoText}>
        질문게시판은 강의 및 개발 관련해서 자유롭게 묻고 답하는 게
        <br />
        시판 입니다. 게시판 목적과 다른 내용의 글이 올라올 경우, 무
        <br />
        통보 삭제되며 서비스 이용이 일시적 제한될 수 있습니다.
      </p>
      <BottomBlueBtn
        text={"수정"}
        disabled={!(errMsg == "")}
        onClick={async () => {
          const res = await editBoardPosts(token, post_id, inquiryInfo);
          if (res.status == 200) {
            setResult({ success: true, error: false, errorMsg: "" });
            router.push(`/common/board/${post_id}`);
          } else
            setResult({
              success: false,
              error: true,
              errorMsg: res?.data?.errorDetails[0],
            });
        }}
      />
      <span className={styles.msg}>
        {errMsg}
        {result.errorMsg}
      </span>
      <span className={styles.successMsg}>
        {result.success && "게시판이 수정되었습니다."}
      </span>
    </section>
  );
};

export const getServerSideProps = async (context) => {
  const token = cookie.parse(context.req.headers.cookie).accessToken;
  const post_id = context.query.id;
  const postDetail = await getBoardDetail(token, post_id);
  return {
    props: {
      token,
      post_id,
      postDetail,
    },
  };
};

export default EditPost;
