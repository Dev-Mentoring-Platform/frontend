import React, { useState } from "react";
import * as cookie from "cookie";
import styles from "./boardDetail.module.scss";
import TopBar from "../../../components/mentee/board/TopBar";

import {
  GetBoardDetail,
  GetBoardDetailComments,
} from "../../../core/api/Mentee/board";

import BoardComment from "../../../components/mentee/board/BoardComment";
import MainBoard from "../../../components/mentee/board/MainBoard";
import BottomButton from "../../../components/mentee/board/BottomButton";
import BoardOptionModal from "../../../components/mentee/board/BoardOptionModal";

const BoardDetail = ({ token, postComments, postDetail }) => {
  const [modal, setModal] = useState(false);

  const handleOptionModal = () => {
    setModal(!modal);
  };
  return (
    <>
      <div className={styles.home}>
        <TopBar handleOptionModal={handleOptionModal} />
        <main>
          <section className={styles.mainBoard}>
            <MainBoard postDetail={postDetail} />
          </section>
          <section className={styles.commentSection}>
            {postComments?.content?.map((content, idx) => (
              <BoardComment key={idx} content={content} />
            ))}
          </section>
        </main>
        <BottomButton token={token} postId={postDetail.postId} />
      </div>
      {modal ? (
        <BoardOptionModal
          handleOptionModal={handleOptionModal}
          postId={postDetail.postId}
        />
      ) : (
        ""
      )}
    </>
  );
};

export const getServerSideProps = async (context) => {
  const token = cookie.parse(context.req.headers.cookie).accessToken;
  const role = cookie.parse(context.req.headers.cookie).role;
  const params = context.query;

  const postDetail = await GetBoardDetail(token, params.id);
  const postComments = await GetBoardDetailComments(token, params.id);
  return {
    props: {
      token,
      role,
      params,
      postDetail,
      postComments,
    },
  };
};

export default BoardDetail;