import { Tooltip } from "@mui/material";
import React, { useEffect, useState } from "react";
import "./SelectionComponent.scss";

// datatype can be : single/tree
export default function SelectionComponent({ data = [], keys = [] }) {
  const [selected, setSelected] = useState([]);
  const [filterdData, setFilteredData] = useState(data);

  useEffect(() => {
    console.log(selected);
  }, [selected]);

  function genHeadings(i, n) {
    return <div key={`header-i${n}`}>{i}</div>;
  }

  function genItems(i, n) {
    return (
      <div className="list-item" key={`item-i${n}`}>
        <div>
          <input
            id={`item-i${i.id}`}
            type="checkbox"
            checked={selected.includes(i) ? true : false}
            onChange={(e) => onCheckChange(e.target.checked, i)}
          />
          <label htmlFor={`item-i${i.id}`}>{i[keys[0] || "-"]}</label>
        </div>
        <div>{i[keys[1] || "-"]}</div>
      </div>
    );
  }

  function getSelected(i, n) {
    return (
      <div className="selected-items" key={`selecteditem-i${i.id}`}>
        {i[keys[0]]}
        <span className="cross-bt" onClick={e => removeItem(i.id)}>X</span>
      </div>
    );
  }

  function onCheckChange(state, data) {
    if (state) {
      setSelected((s) => [...s, data]);
    } else {
      setSelected((s) => s.filter((i) => i.id !== data.id));
    }
  }

  function removeItem(id){
    setSelected((s) => s.filter((i) => i.id !== id));
  }

  function onSearch(e){
    const s = e.target.value.toLowerCase();
    if(!s.length) return setFilteredData(data);
    const fd = data.filter(i => i[keys[0]].toLowerCase().includes(s));
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
          <span>{selected.length} Selected</span>
        </div>
        {selected && selected.sort((a, b) => a.id > b.id ? 1: -1).map(getSelected)}
      </div>
    </div>
  );
}
