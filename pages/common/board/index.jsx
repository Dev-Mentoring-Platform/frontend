import React, { useState, useCallback, useEffect } from "react";
import { BottomTab } from "../../../components/common";
import Header from "../../../components/mentee/board/Header";
import List from "../../../components/mentee/board/List";
import { IC_SearchS } from "../../../icons";
import styles from "./board.module.scss";
import * as cookie from "cookie";
import { getBoardList } from "../../../core/api/Mentee";

export const useDebounceEffect = (func, delay, deps) => {
  const callback = useCallback(func, deps);

  useEffect(() => {
    const timer = setTimeout(() => {
      callback();
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [callback, delay]);
};

const Board = ({ role, boardList, token }) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [filteredData, setFilteredData] = useState(boardList.content);

  console.log(filteredData)
 
  const debounceSearch = async () => {
    const filteredList = await getBoardList(token, { page: 1, search });
    setPage(1);
    setFilteredData(filteredList.content);
  };

  useDebounceEffect(() => debounceSearch(), 500, [search]);

  const handleInfiniteScroll = useCallback(async () => {
    const { scrollTop } = document.documentElement;
    const { innerHeight } = window;
    const { scrollHeight } = document.body;

    if (Math.round(scrollTop + innerHeight) >= scrollHeight) {
   
      setPage(page + 1);
      const showMore = await getBoardList(token, {
        page: page + 1,
        search,
      });
      console.log(showMore)
    
      setFilteredData(filteredData.concat(...showMore.content));
    }
  }, [page, filteredData]);

  useEffect(() => {
    window.addEventListener("scroll", handleInfiniteScroll, true);

    return () => {
      window.removeEventListener("scroll", handleInfiniteScroll, true);
    };
  }, [handleInfiniteScroll]);


  return (
    <div className={styles.home}>
      <Header />
      <main>
        <div className={styles.inputBox}>
          <input
            type="text"
            placeholder="검색"
            onChange={(e) => setSearch(e.target.value)}
          />
          <IC_SearchS className={styles.searchIcon} />
        </div>
      </main>
      <List boardList={filteredData} />
      <BottomTab num={[0, 1, 0, 0]} role={role} />
    </div>
  );
};

export const getServerSideProps = async (context) => {
  const token = cookie.parse(context.req.headers.cookie).accessToken;
  const role = cookie.parse(context.req.headers.cookie).role;

  const boardList = await getBoardList(token, { page: 1 });
  return {
    props: {
      role,
      boardList,
      token,
    },
  };
};

export default Board;
