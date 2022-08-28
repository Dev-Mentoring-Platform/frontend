import { PhoneValidation } from "../validation";

const EditInfoErr = (user, setCheckError) => {
  if (user.phone == "") {
    setCheckError({ isError: true, errorMsg: "빈칸을 모두 채워주세요." });
  } else if (!PhoneValidation(user.phone)) {
    setCheckError({
      isError: true,
      errorMsg: "휴대폰 번호 형식을 확인해주세요.",
    });
  } else {
    setCheckError({ isError: false, errorMsg: "" });
  }
};

export default EditInfoErr;
