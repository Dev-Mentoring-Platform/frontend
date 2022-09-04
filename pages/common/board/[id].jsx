import React, { useCallback, useEffect, useState } from "react";
import * as cookie from "cookie";
import styles from "./boardDetail.module.scss";
import TopBar from "../../../components/mentee/board/TopBar";
import {
  getBoardDetail,
  getBoardDetailComments,
} from "../../../core/api/Mentee";
import BoardComment from "../../../components/mentee/board/BoardComment";
import MainBoard from "../../../components/mentee/board/MainBoard";
import BottomButton from "../../../components/mentee/board/BottomButton";
import BoardOptionModal from "../../../components/mentee/board/BoardOptionModal";
import { getMyInfo } from "../../../core/api/User";
import { likeBoardPosts } from "../../../core/api/Mentee/board";

const BoardDetail = ({ token, params, postComments, postDetail, myInfo }) => {
  const [modal, setModal] = useState(false);
  const [postData, setPostData] = useState(postDetail);

  const handleOptionModal = () => {
    if (postDetail.userNickname === myInfo.nickname) setModal(!modal);
    else alert("권한이 없습니다.");
  };

  const getBoard = useCallback(async () => {
    const newPost = await getBoardDetail(token, params.id);
    setPostData(newPost);
  }, [postData]);

  const updateLike = useCallback(async () => {
    await likeBoardPosts(token, postDetail.postId);
    getBoard();
  }, []);

  return (
    <>
      <div className={styles.home}>
        <TopBar handleOptionModal={handleOptionModal} />
        <main>
          <section className={styles.mainBoard}>
            <MainBoard postData={postData} updateLike={updateLike} />
          </section>
          <section className={styles.commentSection}>
            {postComments?.content?.map((content, idx) => (
              <BoardComment
                key={idx}
                content={content}
                token={token}
                myInfo={myInfo}
              />
            ))}
          </section>
        </main>
        <BottomButton token={token} postId={postData.postId} />
      </div>
      {modal ? (
        <BoardOptionModal
          handleOptionModal={handleOptionModal}
          postId={postData.postId}
          token={token}
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

  const postDetail = await getBoardDetail(token, params.id);
  const postComments = await getBoardDetailComments(token, params.id);
  const myInfo = await getMyInfo(token);
  return {
    props: {
      token,
      role,
      params,
      postDetail,
      postComments,
      myInfo,
    },
  };
};

export default BoardDetail;
