import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Dispatch } from "@reduxjs/toolkit";

import { EdiaSelect } from "./EdiaSelect";
import { EdiumDisplay } from "./EdiumDisplay";
import { slotSlice } from "../slices/SlotSlice";

async function reloadEdium(newEdiumId: number, slot: string, dispatch: Dispatch) {
  if (newEdiumId <= 0) {
    dispatch(slotSlice.actions.empty({ slot: slot }));
    return;
  }
  try {
    dispatch(slotSlice.actions.startLoading({ slot: slot, id: newEdiumId }));
    const BASE_URL = "http://localhost:59130/edia/" + newEdiumId;
    const ediumDataPromise = fetch(BASE_URL).then(res => res.json());
    const elementsDataPromise = fetch(BASE_URL + "/elements").then(res => res.json());
    const [ediumData, elementsData] = await Promise.all([ediumDataPromise, elementsDataPromise]);
    const payload = {
      ...ediumData,
      elements: elementsData,
    }
    dispatch(slotSlice.actions.endLoading({ slot: slot, edium: payload }));
  } catch (e) {
    dispatch(slotSlice.actions.failLoading({ slot: slot }));
  }
}

interface HalfPanelProps {
  slot: "slot1" | "slot2";
}

function HalfPanel(props: HalfPanelProps) {
  const [selectedEdium, setSelectedEdium] = useState(0);
  const dispatch = useDispatch();

  useEffect(function () {
    reloadEdium(selectedEdium, props.slot, dispatch);
  }, [selectedEdium]);

  return (
    <div className="HalfPanel w3-container w3-col l6 w3-border">
      <EdiaSelect onEdiumSelect={(newId: number) => { setSelectedEdium(newId); }} />
      <EdiumDisplay slot={props.slot} />
    </div>
  );
}

export { HalfPanel };