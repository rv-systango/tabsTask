import React, { useContext, useState } from "react";
import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
} from "reactstrap";
import { AppContext } from "../../App";
import ChkBox from "../chkbox/chkbox";
import "./MultiSelection.scss";

// datatype can be : single/tree
export default function MultiSelection({
  data = [],
  keys = [],
  appstate_key = "permissions",
}) {
  const { appState, setAppState } = useContext(AppContext);
  const [filterdData, setFilteredData] = useState([...data]);
  const [open, setOpen] = useState("1");

  const toggle = (id) => {
    if (open === id) {
      setOpen();
    } else {
      setOpen(id);
    }
  };

  function genHeadings(i, n) {
    return <div key={`${i}i${n}`}>{i}</div>;
  }

  function decideState(item) {
    let result = false;
    const selectedData = appState[appstate_key];
    const selectedItem = selectedData.filter((e) => e.id === item.id)[0];
    if(!selectedItem) return false;
    if (item.description?.length === selectedItem?.description?.length)
      result = true;
    if (
      item.description?.length !== selectedItem?.description?.length &&
      selectedItem.description?.length
    )
      result = "indeterminate";
    if (
      item.description?.length !== selectedItem?.description?.length &&
      !selectedItem.description?.length
    )
      result = false;
    return result;
  }

  function genItems(i, n) {
    const keysLength = keys.length;
    return (
      <div className="list-item" key={`item-i${n}`}>
        <div>
          <ChkBox
            id={`item-i${i.id}`}
            value={i[keys[0] || "-"]}
            state={decideState(i)}
            onChange={() => {onCheckChange(decideState(i), i)}}
          />
        </div>
        <div>
          {(() => {
            if (i["description"] && typeof i["description"] === "object") {
              const subArrray = i["description"];
              return subArrray.map((j, index) => {
                return (
                  <div key={j.id}>
                    <input
                      id={`subitem-${j.id}`}
                      type="checkbox"
                      onChange={() => addRemoveSubitems(i, j)}
                      checked={
                        JSON.stringify(appState[appstate_key]).includes(j.id)
                          ? true
                          : false
                      }
                    />
                    <label htmlFor={`subitem-${j.id}`}>{j.title}</label>
                  </div>
                );
              });
            } else {
              return <></>;
            }
          })()}
        </div>
      </div>
    );
  }

  function addRemoveSubitems(item, subitem) {
    const selectedData = JSON.parse(JSON.stringify(appState[appstate_key]));
    const chk = document.getElementById(`item-i${item.id}`);
    const itemInData = data.filter((i) => i.id == item.id)[0];
    let itemInNewState = null;
    chk.indeterminate = false;
    let isItemExists = false;
    let isDescriptionExists = false;

    if (selectedData.length) {
      selectedData.forEach((data) => {
        if (data.id === item.id) {
          isItemExists = true;
          if (
            JSON.stringify(data.description).includes(JSON.stringify(subitem))
          )
            isDescriptionExists = true;
        }
      });
    }

    if (!isItemExists) {
      // add full item (advertiser)
      const preData = appState[appstate_key];
      preData.push(item);
      setAppState((s) => ({ ...s, advertiser: [...preData] }));
      chk.indeterminate = false;
      chk.checked = true;
    }

    if (isItemExists && !isDescriptionExists) {
      // add sub item (description)
      const newState = [];
      selectedData.forEach((data) => {
        if (data.id == item.id) {
          data.description.push(subitem);
        }
        newState.push(data);
      });
      itemInNewState = newState.filter((i) => i.id == item.id)[0];
      setAppState((s) => ({ ...s, [appstate_key]: newState }));
    } else if (isItemExists && isDescriptionExists) {
      // remove sub item (description)
      chk.indeterminate = false;
      const newState = [];
      selectedData.forEach((data) => {
        const description = data.description.filter((i) => i.id !== subitem.id);
        data.description = description;
        if (data.description.length) {
          newState.push(data);
        } else {
          chk.indeterminate = false;
          chk.checked = false;
        }
      });
      itemInNewState = newState.filter((i) => i.id == item.id)[0];
      setAppState((s) => ({ ...s, [appstate_key]: newState }));
    }

    // set indeterminate state of specific check box
    if (itemInNewState?.description?.length) {
      itemInData?.description?.length !== itemInNewState?.description?.length
        ? (chk.indeterminate = true)
        : (chk.indeterminate = false);
    }
  }

  function genSelected(i, n) {
    return (
      <AccordionItem key={`acc-key-${i.id}`}>
        <AccordionHeader targetId={n.toString()}>
          {i.advertiser}
        </AccordionHeader>
        <AccordionBody accordionId={n.toString()}>
          <div className="d-flex flex-column w-100">
            {i.description.map((item, index) => {
              return (
                <div
                  key={`selecteditem-key-${i.id}-${index}`}
                  style={{ display: "bock" }}
                >
                  <input
                    style={{ marginRight: "3px" }}
                    id={`selectedsubitem-${index}-${item.id}`}
                    checked={
                      JSON.stringify(appState[appstate_key]).includes(item.id)
                        ? true
                        : false
                    }
                    onChange={() => addRemoveSubitems(i, item)}
                    type="checkbox"
                  />
                  <label
                    style={{ fontSize: "13px" }}
                    htmlFor={`selectedsubitem-${index}-${item.id}`}
                  >
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
    const sdata = JSON.stringify(appState[appstate_key]);
    const isExists = sdata.includes(JSON.stringify(data));
    if (!isExists) {
      const prev = appState[appstate_key];
      setAppState((s) => ({ ...s, [appstate_key]: [...prev, data] }));
    } else {
      const prev = appState[appstate_key];
      const updated = prev.filter((i) => i.id !== data.id);
      setAppState((s) => ({ ...s, [appstate_key]: [...updated] }));
    }
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
              .map(genSelected)}
        </Accordion>
      </div>
    </div>
  );
}
