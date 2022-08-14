import { useEffect, useState } from "react";
import styles from "./inquiry.module.scss";
import {
  BottomBlueBtn,
  TopBar,
  BasicInputBox,
  BasicSelectBox,
} from "../../components/common";
import * as cookie from "cookie";
import router from "next/router";
import { inquire } from "../../core/api/User";
import BasicTextAreaBox from "../../components/common/inputBox/basicTextAreaBox";

export const getServerSideProps = async (context) => {
  const token = cookie.parse(context.req.headers.cookie).accessToken;
  const role = cookie.parse(context.req.headers.cookie).role;

  return {
    props: {
      token,
      role,
    },
  };
};

const Inquiry = ({ token, role }) => {
  const [inquiryInfo, setInquiryInfo] = useState({
    content: "",
    title: "",
    type: "ERROR",
  });
  const [errMsg, setErrMsg] = useState("");
  const [result, setResult] = useState({
    success: false,
    error: false,
    errorMsg: "",
  });

  const handleType = (e) => {
    let typeEng = "";
    const { value } = e.target;
    if (value === "오류문의") {
      typeEng = "ERROR";
    }
    if (value === "멘토문의") {
      typeEng = "MENTOR";
    }
    if (value === "멘티문의") {
      typeEng = "MENTEE";
    }
    if (value === "강의문의") {
      typeEng = "LECTURE";
    }
    if (value === "기타") {
      typeEng = "ETC";
    }
    setInquiryInfo({ ...inquiryInfo, type: typeEng });
  };

  useEffect(() => {
    setResult({ success: false, error: false, errorMsg: "" });
    if (
      inquiryInfo.content == "" ||
      inquiryInfo.title == "" ||
      inquiryInfo.type == ""
    ) {
      setErrMsg("빈칸을 모두 채워주세요.");
    } else {
      setErrMsg("");
    }
  }, [inquiryInfo]);

  return (
    <section className={styles.changeInquiry}>
      <TopBar text={"문의하기"} />
      <p className={styles.text}>
        멘토릿지를 이용하면서 생긴 불편사항이나 개선사항을
        <br />
        알려주세요. 전달해주신 소중한 의견으로 더 나은
        <br />
        멘토릿지가 되도록 노력하겠습니다.
      </p>
      <div className={styles.line} />
      <section className={styles.content}>
        <BasicSelectBox
          arr={["오류문의", "멘토문의", "멘티문의", "강의문의", "기타"]}
          name={"문의 유형을 선택해주세요."}
          onChange={(e) => handleType(e)}
          otherClassName={styles.select}
          selectStyles={styles.selectCon}
        />
        <BasicInputBox
          type={"text"}
          placeholder={"제목을 입력해주세요.(20자 이내)"}
          onChange={(e) =>
            setInquiryInfo({ ...inquiryInfo, title: e.target.value })
          }
          style={styles.titleBox}
        />
        <BasicTextAreaBox
          type={"text"}
          placeholder={"의견을 입력해주세요. (최소 10자, 최대 1500자)"}
          onChange={(e) =>
            setInquiryInfo({ ...inquiryInfo, content: e.target.value })
          }
          style={styles.areaBox}
        />
      </section>
      <p className={styles.infoText}>
        * 문의 답변은 회원가입 시 입력해주신 이메일을
        <br />
        통해 보내드리며, 순차적 답변으로 다소 시일이
        <br />
        소요될 수 있음을 안내드립니다.
      </p>
      <BottomBlueBtn
        text={"문의"}
        disabled={
          !(errMsg == "") ||
          inquiryInfo.content.length < 10 ||
          inquiryInfo.content.length > 1500 ||
          inquiryInfo.title.length > 20
        }
        onClick={async () => {
          const res = await inquire(token, inquiryInfo);
          if (res.status == 201)
            setResult({ success: true, error: false, errorMsg: "" }),
              alert("등록 성공했습니다"),
              router.push("/mentee/mypage");
          else
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
        {result.success && "문의가 등록되었습니다."}
      </span>
    </section>
  );
};

export default Inquiry;
