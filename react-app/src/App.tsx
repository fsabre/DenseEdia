import React from "react";

import { HalfPanel } from "./components/HalfPanel";
import { EdiaDatalist } from "./components/EdiaDatalist";

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <h1>DenseEdia - Main page</h1>
        <div className="w3-row">
          <HalfPanel slot="slot1" />
          <HalfPanel slot="slot2" />
        </div>
        <EdiaDatalist />
      </div>
    );
  }
}

export { App };