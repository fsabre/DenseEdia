import React from "react";
import { useSelector } from "react-redux";

import { ElementDisplay } from "./ElementDisplay";
import { RootState } from "../slices";

interface EdiumDisplayProps {
  slot: "slot1" | "slot2";
}

function EdiumDisplay(props: EdiumDisplayProps) {
  const loadedState = useSelector((state: RootState) => state.slot[props.slot].loadedState);
  const edium = useSelector((state: RootState) => state.slot[props.slot].edium);

  const title = `Edium n°${edium.id} : ${edium.name ? edium.name : "#"} (${edium.kind})`;

  let content;
  if (edium.id === 0) {
    content = <p>Nothing selected.</p>;
  }
  else if (loadedState === "no") {
    content = <p>Loading failed.</p>;
  }
  else if (loadedState === "loading") {
    content = <p>Loading Edium n°{edium.id}</p>;
  }
  else {
    content = (
      <React.Fragment>
        <h2>{title}</h2>
        <table>
          <thead>
            <tr>
              <th>Element name</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {
              edium.elements.map((e) => {
                return (
                  <ElementDisplay
                    key={e.id}
                    name={e.name}
                    value={e.value} />
                );
              })
            }
          </tbody>
        </table>
      </React.Fragment>
    );
  }

  return (
    <div className="EdiumDisplay">
      {content}
    </div>
  );
}

export { EdiumDisplay };