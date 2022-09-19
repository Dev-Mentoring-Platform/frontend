import React, { useState, useCallback, useEffect } from "react";
import { BottomTab } from "../../../components/common";
import Header from "../../../components/mentee/board/Header";
import List from "../../../components/mentee/board/List";
import { IC_SearchS } from "../../../icons";
import styles from "./board.module.scss";
import * as cookie from "cookie";
import { getBoardList } from "../../../core/api/Mentee";
import InfiniteScroll from "react-infinite-scroll-component";

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

  const debounceSearch = async () => {
    const filteredList = await getBoardList(token, { page: 1, search });
    setPage(1);
    setFilteredData(filteredList.content);
  };

  useDebounceEffect(() => debounceSearch(), 500, [search]);

  const handleShowMore = async () => {
    const showMore = await getBoardList(token, {
      page: page,
      search,
    });

    setFilteredData([...filteredData, ...showMore.content]);
  };

  useEffect(() => {
    if (page != 1) {
      handleShowMore();
    }
  }, [page]);

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
      <InfiniteScroll
        dataLength={10}
        next={() => setPage(page + 1)}
        hasMore={!boardList.last}
        className={styles.infiniteScroll}
      >
        <List boardList={filteredData} />
      </InfiniteScroll>

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
