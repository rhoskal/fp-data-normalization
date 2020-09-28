import React, { FC } from "react";
import { pipe } from "fp-ts/pipeable";
import * as E from "fp-ts/Either";
import { PathReporter } from "io-ts/lib/PathReporter";

import data from "./data.json";
import { INITIAL_STATE, mkReducer } from "./normalization";
import { fakeMeSomeData } from "./mocker";
import { Posts } from "./types";

// Doing it this way ignores ALL posts if there is even just one small property missing/incorrect... not very user friendly
// But how do you get around this? If I make some deeply nested field empty then the first decode fails when I split the decoding up into 3 steps
/**
 * Blog Service
 */
const fetchPosts = (): Posts => {
  const result = Posts.decode(data);

  return pipe(
    result,
    E.fold(
      () => {
        console.warn(PathReporter.report(result));

        return [];
      },
      (posts) => posts,
    ),
  );
};

const App: FC = () => {
  console.log(JSON.stringify(fakeMeSomeData()));
  const posts: Posts = fetchPosts();

  return (
    <div className="split-screen">
      <div>
        <h2 className="title">JSON</h2>
        <pre>{JSON.stringify(posts, null, 2)}</pre>
      </div>
      <div>
        <h2 className="title">Normalized</h2>
        <pre>{JSON.stringify(mkReducer(INITIAL_STATE, posts), null, 2)}</pre>
      </div>
    </div>
  );
};

export default App;
