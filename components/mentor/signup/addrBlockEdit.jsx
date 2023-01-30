import { useEffect } from "react";
import styles from "./addrBlock.module.scss";
import { BasicSelectBox } from "../../common";
import { getSiGunGus, getStates, getDongs } from "/core/api/Address";

const AddrBlockEdit = ({ addr, newAddr, setNewAddr }) => {
  useEffect(() => {
    if (newAddr.statePick !== "") GetSi(newAddr.statePick);
  }, [newAddr.statePick]);

  useEffect(() => {
    if (newAddr.sigunguPick !== "")
      GetDong(newAddr.statePick, newAddr.sigunguPick);
  }, [newAddr.sigunguPick]);

  useEffect(() => {
    const getAddrs = async () => {
      const state = await getStates().then((res) => res.data);
      const sigungu = await getSiGunGus(addr.statePick).then((res) => res.data);
      const dong = await getDongs(addr.statePick, addr.sigunguPick).then(
        (res) => res.data
      );
      setNewAddr({ ...newAddr, state: state, sigungu: sigungu, dong: dong });
    };
    getAddrs();
  }, []);

  const InitAddress = (values, valuePick, res) => {
    setNewAddr((prev) => ({
      ...prev,
      [values]: res.data.map((data) => data),
      [valuePick]: res.data[0],
    }));
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
          arr={newAddr.state}
          name={"states"}
          value={addr?.statePick}
          onChange={(e) =>
            setNewAddr({
              ...newAddr,
              sigungu: [],
              dong: [],
              sigunguPick: "",
              dongPick: "",
              statePick: e.target.value,
            })
          }
        />
        <BasicSelectBox
          arr={newAddr.sigungu}
          name={"sigungus"}
          value={addr?.sigunguPick}
          onChange={(e) =>
            setNewAddr({
              ...newAddr,
              dong: [],
              dongPick: "",
              sigunguPick: e.target.value,
            })
          }
        />
      </span>
      <span className={styles.row}>
        <BasicSelectBox
          arr={newAddr.dong}
          name={"dongs"}
          value={addr?.dongPick}
          onChange={(e) =>
            setNewAddr({
              ...newAddr,
              dongPick: e.target.value,
            })
          }
        />
      </span>
    </>
  );
};

export default AddrBlockEdit;
