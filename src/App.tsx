import React, { FC } from "react";

import data from "./data.json";
import { INITIAL_STATE, mkReducer } from "./normalization";
import { fakeMeSomeData } from "./mocker";

// decode data and verify it's legit
// how????

const App: FC = () => {
  console.log(JSON.stringify(fakeMeSomeData()));
  return (
    <div className="split-screen">
      <div>
        <h2 className="title">JSON</h2>
        <pre>{JSON.stringify(data, undefined, 2)}</pre>
      </div>
      <div>
        <h2 className="title">Normalized</h2>
        <pre>{JSON.stringify(mkReducer(INITIAL_STATE, data), null, 2)}</pre>
      </div>
    </div>
  );
};

export default App;
