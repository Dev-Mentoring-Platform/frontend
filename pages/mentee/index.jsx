import Image from "next/image";
import { BottomTab } from "../../components/common";
import * as cookie from "cookie";
import Breadcrumb from "../../components/mentee/breadcrumb";
import ClassCard from "../../components/mentee/classCard";
import Header from "../../components/mentee/header";
import SearchBox from "../../components/mentee/searchBox";

import styles from "./menteeHome.module.scss";

import Drawer from "react-bottom-drawer";
import { useCallback, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Chip from "@mui/material/Chip";
import { getLecture } from "../../core/api/Mentee";

const filters = ["개발 분야", "수업 방식", "레벨"];
const subjectsList = [
  "전체",
  "프론트엔드",
  "백엔드",
  "언어",
  "안드로이드",
  "IOS",
  "임베디드 | IOT",
  "데이터 사이언스",
  "빅데이터",
  "머신러닝 딥러닝",
  "블록체인",
  "데브옵스 | 인프라",
  "데이터베이스",
  "알고리즘 | 자료구조",
];
const systemTypeList = ["전체", "온라인", "오프라인"];
const isGroupList = ["전체", "개인 강의", "그룹 강의"];
const difficultyTypesList = ["전체", "입문", "초급", "중급", "고급"];

const converDifficulty = (level) => {
  if (level === "입문") return "BASIC";
  else if (level === "초급") return "BEGINNER";
  else if (level === "중급") return "INTERMEDIATE";
  else if (level === "고급") return "ADVANCED";
};

const convertGroup = (group) => {
  if (group === "개인 강의") return false;
  else if (group === "그룹 강의") return true;
};

const convertType = (type) => {
  if (type === "온라인") return "ONLINE";
  else if (type === "오프라인") return "OFFLINE";
};

const Home = ({ classes, role, token }) => {
  const [classData, setClassData] = useState(classes.content);
  const [page, setPage] = useState(1);
  const [subjects, setSubjects] = useState(["전체"]);
  const [systemType, setSystemType] = useState(["전체"]);
  const [isGroup, setIsGroup] = useState(["전체"]);
  const [difficultyType, setDifficultyType] = useState(["전체"]);
  const [isVisible, setIsVisible] = useState(false);
  const [value, setValue] = useState("1");

  // 필터 컨버팅
  const difficult = difficultyType.map((el) => converDifficulty(el));
  const group = isGroup.map((el) => convertGroup(el));
  const type = systemType.map((el) => convertType(el));

  const handleFilter = (label, value, setValue, length) => {
    if (label === "전체") {
      setValue(["전체"]);
    } else if (!value.includes(label)) {
      if (!value.includes("전체") && value.length === length - 2) {
        setValue(["전체"]);
      } else {
        setValue([...value.filter((el) => el !== "전체"), label]);
      }
    } else if (value.includes(label)) {
      if (value.length === 1) {
        setValue(["전체"]);
      } else {
        setValue(value.filter((el) => el !== label));
      }
    }
  };

  const handleInfiniteScroll = useCallback(async () => {
    // 현재 위치
    const { scrollTop } = document.documentElement;

    // 뷰포트 길이
    const { innerHeight } = window;

    // 스크롤 전체 길이
    const { scrollHeight } = document.body;

    if (Math.round(scrollTop + innerHeight) >= scrollHeight) {
      setPage(page + 1);
      const showMore = await getLecture(token, {
        difficultyTypes: difficult,
        isGroup: group,
        page: page + 1,
        subjects: subjects.filter((el) => el !== "전체"),
        systemType: type,
      });

      setClassData(classData.concat(...showMore.content));
    }
  }, [page, classData]);

  useEffect(() => {
    window.addEventListener("scroll", handleInfiniteScroll, true);

    return () => {
      window.removeEventListener("scroll", handleInfiniteScroll, true);
    };
  }, [handleInfiniteScroll]);

  const getFilteredClassList = async () => {
    const data = {
      difficultyTypes: difficult,
      isGroup: group,
      page: 1,
      subjects: subjects.filter((el) => el !== "전체"),
      systemType: type,
    };
    const newLecture = await getLecture(token, data);
    setClassData(newLecture.content);
    setIsVisible(false);
    setPage(1);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const openDrawer = (tabValue) => {
    setIsVisible(true);
    setValue(tabValue.toString());
  };

  const onClose = useCallback(() => {
    setIsVisible(false);
  }, []);

  // useEffect(() => {
  //   getFilteredClassList();
  // }, [classes]);

  return (
    <div className={styles.home}>
      <div className={styles.background}>
        <div>
          <Image
            layout="fill"
            src="/images/background-gradient.jpg"
            alt="배경"
            priority
          />
        </div>
      </div>
      <Header />
      <main>
        <SearchBox />
        <Breadcrumb filters={filters} openDrawer={openDrawer} />
        <p className={styles.classesCount}>총 {classData?.length}개의 강의</p>
        <div className={styles.classCards}>
          {classData?.map((classDetail, index) => (
            <ClassCard key={index} classDetail={classDetail} />
          ))}
        </div>

        <Drawer
          isVisible={isVisible}
          onClose={onClose}
          className={styles.drawer}
        >
          <Box
            sx={{
              width: "100%",
              typography: "body1",
              overflow: "hidden",
            }}
          >
            <TabContext value={value}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <TabList
                  onChange={handleChange}
                  aria-label="lab API tabs example"
                >
                  <Tab label="개발 분야" value="1" />
                  <Tab label="수업 방식" value="2" />
                  <Tab label="레벨" value="3" />
                </TabList>
              </Box>
              <TabPanel value="1">
                <span className={styles.filterlabel}>개발 분야</span>
                <div className={styles.chipcontainer}>
                  {subjectsList.map((subject, idx) => (
                    <Chip
                      key={idx}
                      label={subject}
                      color="primary"
                      onClick={() =>
                        handleFilter(
                          subject,
                          subjects,
                          setSubjects,
                          subjectsList.length
                        )
                      }
                      style={{
                        backgroundColor: subjects.includes(subject)
                          ? "#689AFD"
                          : "white",
                        color: subjects.includes(subject) ? "white" : "black",
                        border: subjects.includes(subject)
                          ? ""
                          : "1px solid #E8EAEF",
                        marginTop: 12,
                        marginRight: 8,
                      }}
                    />
                  ))}
                </div>
              </TabPanel>
              <TabPanel value="2">
                <span className={styles.filterlabel}>온·오프라인</span>
                <div>
                  {systemTypeList.map((type, idx) => (
                    <Chip
                      onClick={() =>
                        handleFilter(
                          type,
                          systemType,
                          setSystemType,
                          systemTypeList.length
                        )
                      }
                      key={idx}
                      label={type}
                      color="primary"
                      style={{
                        backgroundColor: systemType.includes(type)
                          ? "#689AFD"
                          : "white",
                        color: systemType.includes(type) ? "white" : "black",
                        border: systemType.includes(type)
                          ? ""
                          : "1px solid #E8EAEF",
                        marginTop: 12,
                        marginRight: 8,
                      }}
                    />
                  ))}
                </div>
                <span className={styles.filterlabel}>개인·그룹</span>
                <div>
                  {isGroupList.map((group, idx) => (
                    <Chip
                      key={idx}
                      label={group}
                      color="primary"
                      onClick={() =>
                        handleFilter(
                          group,
                          isGroup,
                          setIsGroup,
                          isGroupList.length
                        )
                      }
                      style={{
                        backgroundColor: isGroup.includes(group)
                          ? "#689AFD"
                          : "white",
                        color: isGroup.includes(group) ? "white" : "black",
                        border: isGroup.includes(group)
                          ? ""
                          : "1px solid #E8EAEF",
                        marginTop: 12,
                        marginRight: 8,
                      }}
                    />
                  ))}
                </div>
              </TabPanel>
              <TabPanel value="3">
                <span className={styles.filterlabel}>레벨</span>
                <div>
                  {difficultyTypesList.map((difficulty, idx) => (
                    <Chip
                      key={idx}
                      label={difficulty}
                      color="primary"
                      onClick={() =>
                        handleFilter(
                          difficulty,
                          difficultyType,
                          setDifficultyType,
                          difficultyTypesList.length
                        )
                      }
                      style={{
                        backgroundColor: difficultyType.includes(difficulty)
                          ? "#689AFD"
                          : "white",
                        color: difficultyType.includes(difficulty)
                          ? "white"
                          : "black",
                        border: difficultyType.includes(difficulty)
                          ? ""
                          : "1px solid #E8EAEF",
                        marginTop: 12,
                        marginRight: 8,
                      }}
                    />
                  ))}
                </div>
              </TabPanel>
            </TabContext>
          </Box>

          <div className={styles.bottom}>
            <button className={styles.resetbutton}>초기화</button>
            <button
              className={styles.findbutton}
              onClick={getFilteredClassList}
            >
              강의보기
            </button>
          </div>
        </Drawer>
      </main>

      <BottomTab num={[1, 0, 0, 0]} role={role} />
    </div>
  );
};

export const getServerSideProps = async (context) => {
  const parsedCookies = cookie.parse(context.req.headers.cookie);
  const role = parsedCookies.role;
  const classes = await getLecture(parsedCookies.accessToken, { page: 1 });

  return {
    props: {
      classes: classes,
      role,
      token: parsedCookies.accessToken,
    },
  };
};

export default Home;
