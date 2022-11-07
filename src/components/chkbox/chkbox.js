import React, { createRef, useEffect } from "react";

export default function ChkBox({
  id = "checkbox",
  value,
  state,
  onChange = () => {},
}) {
  const chkref = createRef();
  useEffect(() => {
    if (state === true) {
      chkref.current.checked = true;
    } else if (state === false) {
      chkref.current.checked = false;
    } else if (state === "indeterminate") {
      chkref.current.checked = false;
      chkref.current.indeterminate = true;
    }
  }, [state]);

  return (
    <>
      <input ref={chkref} type={"checkbox"} id={id} onChange={onChange} />
      <label htmlFor={id}>{value}</label>
    </>
  );
}
