import { IC_ArrowDoubleTriangle } from "../../../icons";
import styles from "./basicSelectBox.module.scss";
import classNames from "classnames";
const BasicSelectBox = ({
  arr,
  name,
  onChange,
  otherClassName,
  selectStyles,
  value,
}) => {
  return (
    <div className={classNames(styles.selectBox, otherClassName)}>
      <select
        name={name}
        id={name}
        onChange={onChange}
        className={selectStyles}
      >
        {arr?.map((data, i) => (
          <option value={data} key={i} defaultValue={data}>
            {data}
          </option>
        ))}
      </select>
      <IC_ArrowDoubleTriangle className={styles.arrow} />
    </div>
  );
};

export default BasicSelectBox;
