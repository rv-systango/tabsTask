import { Tooltip } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../App";
import ChkBox from "../chkbox/chkbox";
import "./SelectionComponent.scss";

// datatype can be : single/tree
export default function SelectionComponent({
  data = [],
  keys = [],
  appstate_key = "permissions",
}) {
  const { appState, setAppState } = useContext(AppContext);
  const [filterdData, setFilteredData] = useState(data);

  function genHeadings(i, n) {
    return <div key={`header-i${n}`}>{i}</div>;
  }

  function genItems(i, n) {
    const keysLength = keys.length;
    return (
      <div className="list-item" key={`item-${n}-i${i.id}`}>
        <div>
          <ChkBox
            id={`item-i${i.id}`}
            value={i[keys[0] || "-"]}
            onChange={() => onCheckChange(i)}
            state={
              JSON.stringify(appState[appstate_key]).includes(JSON.stringify(i))
                ? true
                : false
            }
          />
          {/* <input
            id={`item-i${i.id}`}
            type="checkbox"
            checked={appState[appstate_key].includes(i) ? true : false}
            onChange={(e) => onCheckChange(e.target.checked, i)}
          />
          <label htmlFor={`item-i${i.id}`}>{i[keys[0] || "-"]}</label> */}
        </div>
        {keys &&
          keysLength &&
          keys.map((k, m) => {
            return (
              m > 0 && <div key={`${k}-${i.id.toString()}`}>{i[k || "-"]}</div>
            );
          })}
      </div>
    );
  }

  function getSelected(i, n) {
    return (
      <div className="selected-items" key={`selecteditem-i${i.id}`}>
        {i[keys[0]]}
        <span className="cross-bt" onClick={(e) => removeItem(i.id)}>
          X
        </span>
      </div>
    );
  }

  function onCheckChange( data) {
    const sdata = appState[appstate_key];
    const isExists = sdata.some((k => k.id === data.id));
    if (!isExists) {
      const prev = appState[appstate_key];
      setAppState((s) => ({ ...s, [appstate_key]: [...prev, data] }));
    } else {
      const prev = appState[appstate_key];
      const updated = prev.filter((i) => i.id !== data.id);
      setAppState((s) => ({ ...s, [appstate_key]: [...updated] }));
    }
  }

  function removeItem(id) {
    const prev = appState[appstate_key];
    const updated = prev.filter((i) => i.id !== id);
    setAppState((s) => ({ ...s, [appstate_key]: [...updated] }));
  }

  function onSearch(e) {
    const s = e.target.value.toLowerCase();
    if (!s.length) return setFilteredData(data);
    const fd = data.filter((i) => i[keys[0]].toLowerCase().includes(s));
    setFilteredData(fd);
  }

  return (
    <div className="selection-container">
      <div className="selection-listarea">
        <input type="text" placeholder="Search.." onChange={onSearch} />
        <div className="selection-itemslist">
          <div className="header-container">
            {keys && keys.map(genHeadings)}
          </div>
          {filterdData && filterdData.map(genItems)}
        </div>
      </div>
      <div className="selection-selectedarea">
        <div className="title">
          <span>{appState[appstate_key].length} Selected</span>
        </div>
        {appState[appstate_key] &&
          appState[appstate_key]
            .sort((a, b) => (a.id > b.id ? 1 : -1))
            .map(getSelected)}
      </div>
    </div>
  );
}
