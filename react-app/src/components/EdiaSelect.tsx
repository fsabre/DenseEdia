import { useState } from "react";

interface EdiaSelectProps {
  onEdiumSelect: (new_id: number) => void,
}

function EdiaSelect(props: EdiaSelectProps) {
  const [val, setVal] = useState("");

  function on_change(event:React.ChangeEvent<HTMLInputElement>) {
    const raw_value = event.target.value;
    let new_id = parseInt(raw_value.split(" ")[0]);
    if (isNaN(new_id)) { new_id = 0; }
    setVal(raw_value);
    props.onEdiumSelect(new_id);
  }

  function clean() {
    setVal("");
    props.onEdiumSelect(0);
  }

  return (
    <div className="EdiaSelect w3-row">
      <h3>Select an Edia :</h3>
      <input
        className="w3-col s10"
        type="text"
        list="edia-datalist"
        value={val}
        onChange={on_change}
      />
      <input
        className="w3-col s2"
        type="button"
        value="Clear"
        onClick={clean}
      />
    </div>
  );
}

export { EdiaSelect };