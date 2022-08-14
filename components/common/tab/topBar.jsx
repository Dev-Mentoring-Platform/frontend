import { IC_ArrowLeft } from "../../../icons";
import styles from "./topBar.module.scss";
import router from "next/router";

const TopBar = ({ text, onClick, removeBack }) => {
  return (
    <div className={styles.topBar}>
      {!removeBack && (
        <button
          type="button"
          aria-label="뒤로 가기"
          onClick={() => {
            if (onClick) onClick();
            else router.back();
          }}
        >
          <IC_ArrowLeft />
        </button>
      )}
      <span>{text}</span>
    </div>
  );
};
export default TopBar;
