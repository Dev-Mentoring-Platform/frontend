import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  ChangeField,
  Initialize,
  MoveStep,
  LectureUpdate,
  LectureEdit,
  AddToArray,
  ChangeArray,
  DeleteArrayElement,
} from "../../../core/redux/reducers/update";
import MyClassList from "./myClassList";
import Step01 from "../../../components/mentor/class/step01";
import Step02 from "../../../components/mentor/class/step02";
import Step03 from "../../../components/mentor/class/step03";
import * as cookie from "cookie";
import { getEachLecture } from "../../../core/api/Lecture";
import { LevelToKor } from "../../../utils/class/classLevel";
import { SystemToObj } from "../../../utils/class/classSystem";
import { PriceToObj } from "../../../utils/class/classPrice";
import { SubjectArrToID } from "../../../utils/class/classSubject";

export const getServerSideProps = async (context) => {
  const token = cookie.parse(context.req.headers.cookie).accessToken;
  const classID = context.query.classID;
  let classIDReal = "undefined";
  let classData = {};

  if (classID != undefined) {
    classIDReal = classID;
    const individualClass = await getEachLecture(token, classID);
    const classPrice = PriceToObj(individualClass.lecturePrices);
    const classSystem = SystemToObj(individualClass.systems);
    classData = {
      step: 1,
      image: individualClass.thumbnail,
      title: individualClass.title,
      subtitle: individualClass.subTitle,
      introduction: individualClass.introduce,
      lectureSubject: await SubjectArrToID(individualClass.lectureSubjects),
      level: LevelToKor(individualClass.difficulty),
      content: individualClass.content,
      PpricePerHour: classPrice.PpricePerHour,
      PtimePerClass: classPrice.PtimePerClass,
      PnumOfClass: classPrice.PnumOfClass,
      GpricePerHour: classPrice.GpricePerHour,
      GtimePerClass: classPrice.GtimePerClass,
      GnumOfClass: classPrice.GnumOfClass,
      online: classSystem.online,
      offline: classSystem.offline,
      personal: classPrice.personal,
      group: classPrice.group,
      groupMax: classPrice.groupMax,
    };
  }

  return {
    props: {
      token,
      classIDReal,
      classData,
    },
  };
};

const ClassRegistration = ({ token, classIDReal, classData }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(Initialize("classRegister"));
    if (classIDReal != "undefined") {
      let propName = Object.keys(classData);
      propName.forEach((data) => {
        let value = classData[data];
        dispatch(
          ChangeField({
            form: "classInfo",
            key: data,
            value,
          })
        );
      });
    }
  }, [dispatch]);

  const { form } = useSelector(({ classRegister }) => ({
    form: classRegister.classInfo,
  }));

  const updateResult = useSelector(({ classRegister }) => ({
    updateSuccess: classRegister.updateSuccess,
    updateError: classRegister.updateError,
  }));

  const step = form.step;
  const onChangeWithoutE = (name, value) => {
    dispatch(
      ChangeField({
        form: "classInfo",
        key: name,
        value,
      })
    );
  };

  const textLimit = (e, limit) => {
    let newText = e.target.value;
    if (e.target.value.length > limit) {
      alert(`최대 ${limit}자까지 작성하실 수 있습니다.`);
      newText = e.target.value.substring(0, limit);
    }
    return newText;
  };

  const onChange = (name, index) => async (e) => {
    let value = e.target.value;
    switch (name) {
      case "title":
      case "introduction":
        value = textLimit(e, 20);
        break;
      case "subtitle":
        value = textLimit(e, 30);
        break;
      case "lectureSubject":
        value = JSON.parse(e.target.value);
        break;
      case "lectureSubjectAdd":
        value = 1;
        break;
      case "online":
      case "offline":
      case "personal":
      case "group":
        value = form[name] == "on" ? "off" : "on";
        break;
      default:
        break;
    }
    if (name == "lectureSubjectAdd") {
      dispatch(
        AddToArray({
          form: "classInfo",
          key: "lectureSubject",
          value,
        })
      );
    } else if (name == "lectureSubject") {
      dispatch(
        ChangeArray({
          form: "classInfo",
          key: "lectureSubject",
          index: index,
          value,
        })
      );
    } else if (name == "lectureSubjectDelete") {
      dispatch(
        DeleteArrayElement({
          form: "classInfo",
          key: "lectureSubject",
          index: index,
        })
      );
    } else {
      dispatch(
        ChangeField({
          form: "classInfo",
          key: name,
          value,
        })
      );
    }
  };

  const onSubmit = () => {
    if (classIDReal == "undefined") {
      dispatch(LectureUpdate({ form: form, token: token }));
    } else {
      dispatch(LectureEdit({ form: form, token: token, classID: classIDReal }));
    }
  };

  const RandomMove = (step) => {
    dispatch(MoveStep(step));
  };

  switch (step) {
    case 1:
      return (
        <Step01
          form={form}
          handleChange={onChange}
          imgChange={onChangeWithoutE}
          MoveStep={RandomMove}
          token={token}
        />
      );
    case 2:
      return (
        <Step02
          form={form}
          handleChange={onChange}
          MoveStep={RandomMove}
          token={token}
        />
      );
    case 3:
      return (
        <Step03
          form={form}
          handleChange={onChange}
          handleSubmit={onSubmit}
          MoveStep={RandomMove}
          updateResult={updateResult}
        />
      );

    default:
      <MyClassList />;
  }
};
export default ClassRegistration;
