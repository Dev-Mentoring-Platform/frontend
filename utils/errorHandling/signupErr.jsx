import { PhoneValidation, EmailValidation } from "../validation";

const SignUpErr = (datas, setCheckError) => {
  const { dupCheck, user, agree } = datas;

  if (dupCheck.nicknameDupError) {
    setCheckError({
      isError: true,
      errorMsg: "중복되는 닉네임입니다.",
    });
  } else if (!EmailValidation(user.email)) {
    setCheckError({ isError: true, errorMsg: "이메일 형식을 체크해주세요." });
  } else if (dupCheck.emailDupError) {
    setCheckError({
      isError: true,
      errorMsg: "중복되는 이메일입니다.",
    });
  } else if (
    user.name === "" ||
    user.nickname === "" ||
    user.email === "" ||
    user.pw === "" ||
    user.pwConfirm === "" ||
    user.phone === ""
  ) {
    setCheckError({ isError: true, errorMsg: "빈칸을 모두 채워주세요." });
  } else if (user.pw.length > 14 || user.pw.length < 6) {
    setCheckError({
      isError: true,
      errorMsg: "비밀번호는 6-14자 내로 입력해주세요.",
    });
  } else if (user.pw !== user.pwConfirm) {
    setCheckError({
      isError: true,
      errorMsg: "비밀번호가 일치하지 않습니다.",
    });
  } else if (!PhoneValidation(user.phone)) {
    setCheckError({
      isError: true,
      errorMsg: "휴대폰 번호 형식을 확인해주세요.",
    });
  } else if (!agree.all) {
    setCheckError({
      isError: true,
      errorMsg: "필수 동의 사항에 모두 동의해주세요.",
    });
  } else if (!dupCheck.emailDupError && !dupCheck.emailDupSuccess) {
    setCheckError({
      isError: true,
      errorMsg: "아이디 중복 확인을 진행해주세요.",
    });
  } else if (dupCheck.emailDupError) {
    setCheckError({
      isError: true,
      errorMsg: "중복되는 아이디입니다.",
    });
  } else if (!dupCheck.nicknameDupError && !dupCheck.nicknameDupSuccess) {
    setCheckError({
      isError: true,
      errorMsg: "닉네임 중복 확인을 진행해주세요.",
    });
  } else setCheckError({ isError: false, errorMsg: "" });
};

export default SignUpErr;
