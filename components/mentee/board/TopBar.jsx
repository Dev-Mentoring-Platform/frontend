import React from "react";
import styles from "./Header.module.scss";
import router from "next/router";
import { IC_ArrowLeft, IC_Menu } from "../../../icons";

function TopBar({ handleOptionModal }) {
  return (
    <header className={styles.header}>
      <div className={styles.leftPannel}>
        <IC_ArrowLeft onClick={() => router.push("/common/board")} />
        <div className={styles.logo}>글 조회</div>
      </div>

      <div className={styles.rightPannel}>
        <button aria-label="메뉴 열기" onClick={handleOptionModal}>
          <IC_Menu />
        </button>
      </div>
    </header>
  );
}

export default TopBar;
