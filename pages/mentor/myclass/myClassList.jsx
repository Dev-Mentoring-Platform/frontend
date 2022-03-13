import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import router from "next/router";
import * as cookie from "cookie";
import styles from "./myClassList.module.scss";
import { BottomTab, MenuBtn, TopBar } from "../../../components/common";
import ClassCard from "../../../components/mentor/class/classCard";
import { GetMyLectures } from "../../../core/api/Lecture";

const MyClassList = ({ classes, parsedCookies }) => {
  const [pageNum, setPageNum] = useState(1);
  const [allClass, setAllClass] = useState(classes.content);

  const GetMoreClasses = async () => {
    const classesNewPage = await GetMyLectures(
      parsedCookies.accessToken,
      pageNum
    );
    setAllClass([...allClass, ...classesNewPage.content]);
  };

  useEffect(() => {
    if (pageNum != 1) {
      GetMoreClasses();
    }
  }, [pageNum]);

  return (
    <>
      <section className={styles.topSection}>
        <TopBar text={"강의 목록"} />
        <div className={styles.category}>
          <MenuBtn
            selected={true}
            text={"내 강의"}
            onClick={() => router.push("/mentor/myclass/myClassList")}
          />
          <MenuBtn
            selected={false}
            text={"강의 등록"}
            onClick={() =>
              router.push("/mentor/myclass/classRegistrationIntro")
            }
          />
        </div>
      </section>

      <section className={styles.contentSection}>
        <h3
          className={styles.classCnt}
        >{`등록한 강의 총 ${classes.totalElements}개`}</h3>

        <InfiniteScroll
          dataLength={classes.totalElements}
          next={() => setPageNum(pageNum + 1)}
          hasMore={!classes.last}
          className={styles.infiniteScroll}
        >
          {allClass.map((data, i) => {
            return <ClassCard key={i} data={data} />;
          })}
        </InfiniteScroll>

        <BottomTab num={[1, 0, 0, 0]} />
      </section>
    </>
  );
};

export const getServerSideProps = async (context) => {
  const parsedCookies = cookie.parse(context.req.headers.cookie);
  const classes = await GetMyLectures(parsedCookies.accessToken, 1);

  return {
    props: {
      classes,
      parsedCookies,
    },
  };
};

export default MyClassList;
