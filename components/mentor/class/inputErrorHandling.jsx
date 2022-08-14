const ClassRegistrationInputError = (form, setErr) => {
  if (form.image == "") {
    setErr("강의 이미지를 등록해주세요.");
  } else if (form.title == "") {
    setErr("강의 타이틀을 입력해주세요.");
  } else if (form.subtitle == "") {
    setErr("강의 소제목을 입력해주세요.");
  } else if (form.introduction == "") {
    setErr("간략하게 멘토 자신을 소개해주세요.");
  } else if (form.level == "") {
    setErr("강의 난이도를 선택해주세요.");
  } else if (form.content == "" || form.content == "<p><br></p>") {
    setErr("강의 상세 내용 및 이미지를 등록해주세요.");
  } else if (form.online == "off" && form.offline == "off") {
    setErr("'강의 방식1'을 선택해주세요. ");
  } else if (form.personal == "off" && form.group == "off") {
    setErr("'강의 방식2'를 선택해주세요. ");
  } else if (form.group == "on" && form.groupMax == 0) {
    setErr("그룹 수업의 최대 인원 수를 입력해주세요.");
  } else if (
    form.personal == "on" &&
    (form.PtimePerClass == 0 || form.PnumOfClass == 0)
  ) {
    setErr(
      "1:1 수업의 '1회 당 강의시간' 또는 '총 강의 횟수'를 올바르게 입력해주세요."
    );
  } else if (
    form.group == "on" &&
    (form.GtimePerClass == 0 || form.GnumOfClass == 0)
  ) {
    setErr(
      "그룹 수업의 '1회 당 강의시간' 또는 '총 강의 횟수'를 올바르게 입력해주세요."
    );
  } else {
    setErr("");
  }
};

export default ClassRegistrationInputError;
