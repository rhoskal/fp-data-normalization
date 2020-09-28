import React, { FC } from "react";
import { pipe } from "fp-ts/pipeable";

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
        {JSON.stringify(data)}
      </div>
      <div>
        <h2 className="title">Normalized</h2>
        {pipe(mkReducer(INITIAL_STATE, data), JSON.stringify)}
      </div>
    </div>
  );
};

export default App;
