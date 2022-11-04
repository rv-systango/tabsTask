import React, { useContext, useState } from "react";
import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
} from "reactstrap";
import { AppContext } from "../../App";
import "./MultiSelection.scss";

// datatype can be : single/tree
export default function MultiSelection({
  data = [],
  keys = [],
  appstate_key = "permissions",
}) {
  const { appState, setAppState } = useContext(AppContext);
  const [filterdData, setFilteredData] = useState(data);
  const [open, setOpen] = useState("1");

  const toggle = (id) => {
    if (open === id) {
      setOpen();
    } else {
      setOpen(id);
    }
  };

  function genHeadings(i, n) {
    return <div key={`header-i${n}`}>{i}</div>;
  }

  function genItems(i, n) {
    const keysLength = keys.length;
    return (
      <div className="list-item" key={`item-i${n}`}>
        <div>
          <input
            id={`item-i${i.id}`}
            type="checkbox"
            checked={appState[appstate_key].includes(i) ? true : false}
            onChange={(e) => onCheckChange(e.target.checked, i)}
          />
          <label htmlFor={`item-i${i.id}`}>{i[keys[0] || "-"]}</label>
        </div>
        {keys &&
          keysLength &&
          keys.map((k, m) => {
            return m > 0 ? (
              <div key={k}>
                {(() => {
                  if (i[k] && typeof i[k] === "object") {
                    const subArrray = i[k];
                    return subArrray.map((j, index) => {
                      return (
                        <div>
                          <input
                            id={`subitem-${index}-${j.id}`}
                            type="checkbox"
                          />
                          <label htmlFor={`subitem-${index}-${j.id}`}>
                            {j.title}
                          </label>
                        </div>
                      );
                    });
                  } else {
                    return i[k || "-"];
                  }
                })()}
              </div>
            ) : (
              <></>
            );
          })}
      </div>
    );
  }

  function getSelected(i, n) {
    return (
      <AccordionItem>
        <AccordionHeader targetId={n}>{i.advertiser}</AccordionHeader>
        <AccordionBody accordionId={n}>
          <div className="d-flex flex-column w-100">
            {i.description.map((item, index) => {
              return (
                <div style={{display: "bock"}}>
                  <input
                  style={{marginRight: "3px"}}
                    id={`selectedsubitem-${index}-${item.id}`}
                    type="checkbox"
                  />
                  <label style={{fontSize: "13px"}} htmlFor={`selectedsubitem-${index}-${item.id}`}>
                    {item.title}
                  </label>
                </div>
              );
            })}
          </div>
        </AccordionBody>
      </AccordionItem>
    );
  }

  function onCheckChange(state, data) {
    if (state) {
      const prev = appState[appstate_key];
      setAppState((s) => ({ ...s, [appstate_key]: [...prev, data] }));
    } else {
      const prev = appState[appstate_key];
      const updated = prev.filter((i) => i.id !== data.id);
      setAppState((s) => ({ ...s, [appstate_key]: [...updated] }));
    }
    console.log(data);
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
        <Accordion open={open} toggle={toggle}>
          {appState[appstate_key] &&
            appState[appstate_key]
              .sort((a, b) => (a.id > b.id ? 1 : -1))
              .map(getSelected)}
        </Accordion>
      </div>
    </div>
  );
}
