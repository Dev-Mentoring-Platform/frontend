import { useEffect } from "react";
import styles from "./addrBlock.module.scss";
import { BasicSelectBox } from "../../common";
import { getSiGunGus, getStates, getDongs } from "../../../core/api/Address";

const AddrBlock = ({ datas }) => {
  const { addr, setAddr } = datas;
  useEffect(() => {
    GetSi(addr.statePick);
  }, [addr.statePick]);

  useEffect(() => {
    if (addr.sigunguPick !== "") {
      GetDong(addr.statePick, addr.sigunguPick);
    }
  }, [addr.sigunguPick]);

  useEffect(() => {
    GetAddr();
    GetSi(addr.statePick);
  }, []);

  const InitAddress = (values, valuePick, res) => {
    setAddr((prev) => ({
      ...prev,
      [values]: res.data.map((data) => data),
      [valuePick]: res.data[0],
    }));
  };

  const GetAddr = async () => {
    if (Array.isArray(addr.state) && addr.state.length === 0) {
      const res = await getStates();
      InitAddress("state", "statePick", res);
    }
  };

  const GetSi = async (state) => {
    const res = await getSiGunGus(state);
    InitAddress("sigungu", "sigunguPick", res);
  };

  const GetDong = async (state, siGunGu) => {
    const res = await getDongs(state, siGunGu);
    InitAddress("dong", "dongPick", res);
  };

  return (
    <>
      <span className={styles.row}>
        <BasicSelectBox
          arr={addr.state}
          name={"states"}
          onChange={(e) =>
            setAddr({
              ...addr,
              sigungu: [],
              dong: [],
              sigunguPick: "",
              dongPick: "",
              statePick: e.target.value,
            })
          }
        />
        <BasicSelectBox
          arr={addr.sigungu}
          name={"sigungus"}
          onChange={(e) =>
            setAddr({
              ...addr,
              dong: [],
              dongPick: "",
              sigunguPick: e.target.value,
            })
          }
        />
      </span>
      <span className={styles.row}>
        <BasicSelectBox
          arr={addr.dong}
          name={"dongs"}
          onChange={(e) =>
            setAddr({
              ...addr,
              dongPick: e.target.value,
            })
          }
        />
      </span>
    </>
  );
};

export default AddrBlock;
