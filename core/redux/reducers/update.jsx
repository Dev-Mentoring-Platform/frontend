import { createAction, handleActions } from "redux-actions";
import produce from "immer";
import createRequestSaga from "./createRequestSaga";
import { createRequestActionTypes } from "./createRequestSaga";
import { editLecture, lectureRegister } from "../../api/Lecture";
import { takeLatest } from "@redux-saga/core/effects";

const INITIALIZE = "lecture/INITIALIZE";
const CHANGE_FIELD = "lecture/CHANGE_FIELD";
const ADD_TO_ARRAY = "lecture/ADD_TO_ARRAY";
const CHANGE_ARRAY = "lecture/CHANGE_ARRAY";
const DELETE_ARRAY_ELEMENT = "lecture/DELETE_ARRAY_ELEMENT";
const MOVE_STEP = "lecture/MOVE_STEP";
const [LECTURE_UPDATE, LECTURE_UPDATE_SUCCESS, LECTURE_UPDATE_FAILURE] =
  createRequestActionTypes("lecture/LECTURE_UPDATE");
const [LECTURE_EDIT, LECTURE_EDIT_SUCCESS, LECTURE_EDIT_FAILURE] =
  createRequestActionTypes("lecture/LECTURE_EDIT");

export const Initialize = createAction(INITIALIZE);
export const ChangeField = createAction(
  CHANGE_FIELD,
  ({ form, key, value }) => ({ form, key, value })
);

export const AddToArray = createAction(
  ADD_TO_ARRAY,
  ({ form, key, value }) => ({
    form,
    key,
    value,
  })
);

export const ChangeArray = createAction(
  CHANGE_ARRAY,
  ({ form, key, index, value }) => ({
    form,
    key,
    index,
    value,
  })
);

export const DeleteArrayElement = createAction(
  DELETE_ARRAY_ELEMENT,
  ({ form, key, index }) => ({
    form,
    key,
    index,
  })
);

export const MoveStep = createAction(MOVE_STEP, (form) => form);
export const LectureUpdate = createAction(
  LECTURE_UPDATE,
  ({ form, token }) => ({ form, token })
);

export const LectureEdit = createAction(
  LECTURE_EDIT,
  ({ form, token, classID }) => ({
    form,
    token,
    classID,
  })
);

const UpdateSaga = createRequestSaga(LECTURE_UPDATE, lectureRegister);
const EditSaga = createRequestSaga(LECTURE_EDIT, editLecture);
export function* Saga() {
  yield takeLatest(LECTURE_UPDATE, UpdateSaga);
  yield takeLatest(LECTURE_EDIT, EditSaga);
}

const initialState = {
  classInfo: {
    step: 1,
    image: "",
    title: "",
    subtitle: "",
    introduction: "",
    lectureSubject: [1],
    level: "입문",
    content: "",
    PpricePerHour: 0,
    PtimePerClass: 0,
    PnumOfClass: 0,
    GpricePerHour: 0,
    GtimePerClass: 0,
    GnumOfClass: 0,
    online: "off",
    offline: "off",
    personal: "off",
    group: "off",
    groupMax: 0,
  },
  updateSuccess: false,
  updateError: false,
};

const classRegister = handleActions(
  {
    [INITIALIZE]: (state) => ({ ...state, ...initialState }),
    [CHANGE_FIELD]: (state, { payload: { form, key, value } }) =>
      produce(state, (draft) => {
        draft[form][key] = value;
      }),
    [ADD_TO_ARRAY]: (state, { payload: { form, key, value } }) =>
      produce(state, (draft) => {
        draft[form][key].push(value);
      }),
    [CHANGE_ARRAY]: (state, { payload: { form, key, index, value } }) =>
      produce(state, (draft) => {
        draft[form][key][index] = value;
      }),
    [DELETE_ARRAY_ELEMENT]: (state, { payload: { form, key, index } }) =>
      produce(state, (draft) => {
        delete draft[form][key][index];
      }),
    [MOVE_STEP]: (state, { payload }) =>
      produce(state, (draft) => {
        draft["classInfo"]["step"] = payload;
      }),
    [LECTURE_UPDATE_SUCCESS]: (state) => ({
      ...state,
      updateSuccess: true,
      updateError: false,
    }),
    [LECTURE_UPDATE_FAILURE]: (state, { payload }) => ({
      ...state,
      updateSuccess: false,
      updateError: true,
    }),
    [LECTURE_EDIT_SUCCESS]: (state) => ({
      ...state,
      updateSuccess: true,
      updateError: false,
    }),
    [LECTURE_EDIT_FAILURE]: (state, { payload }) => ({
      ...state,
      updateSuccess: false,
      updateError: true,
    }),
  },
  initialState
);

export default classRegister;
