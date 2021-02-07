import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../slices";

import { summarySliceThunks } from "../slices/SummarySlice";

interface EdiaDatalistProp { }

function EdiaDatalist(props: EdiaDatalistProp) {
  const loadedState = useSelector((state: RootState) => state.summary.loadedState);
  const ediaSummary = useSelector((state: RootState) => state.summary.edia);
  const dispatch = useDispatch();

  useEffect(function () {
    if (loadedState === "no") {
      dispatch(summarySliceThunks.loadSummary());
    }
  })

  if (loadedState !== "yes") {
    return <></>;
  }
  return (
    <datalist className="EdiaDatalist" id="edia-datalist">
      {
        ediaSummary.map((edium) => (
          <option
            key={edium.id}
            value={`${edium.id} : ${edium.name ? edium.name : '#'} (${edium.kind})`}
          />
        ))
      }
    </datalist>
  );
}

export { EdiaDatalist };