import React from "react";
import styles from "./Loading.module.scss";

const Loading = () => {
  return (
    <div className={styles.container}>
      <div className={styles.loadingBalls} />
    </div>
  );
};
export default Loading;
