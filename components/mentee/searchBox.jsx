import { IC_SearchS, IC_SmilingMan } from "../../icons";
import styles from "./searchBox.module.scss";

const SearchBox = ({ setSearch }) => {
  return (
    <div className={styles.searchBox}>
      <IC_SmilingMan className={styles.manIcon} />
      <div className={styles.inputBox}>
        <input
          type="text"
          placeholder="강의명을 검색하세요"
          onChange={(e) => setSearch(e.target.value)}
        />
        <IC_SearchS className={styles.searchIcon} />
      </div>
    </div>
  );
};

export default SearchBox;
