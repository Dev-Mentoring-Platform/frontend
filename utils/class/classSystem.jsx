const SystemToArr = (form) => {
  let systemArray = [];
  if (form.online == "on") {
    systemArray.push("ONLINE");
  }
  if (form.offline == "on") {
    systemArray.push("OFFLINE");
  }
  return systemArray;
};

const SystemToObj = (systemArr) => {
  let systemObj = { online: "off", offline: "off" };
  systemArr.forEach((data) => {
    if (data.type == "ONLINE") {
      systemObj.online = "on";
    } else if (data.type == "OFFLINE") {
      systemObj.offline = "on";
    }
  });
  return systemObj;
};

export { SystemToArr, SystemToObj };
