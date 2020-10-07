import React, { FC } from "react";
import { pipe } from "fp-ts/pipeable";
import * as Th from "fp-ts/These";
import { failure } from "io-ts/lib/PathReporter";

import data from "./data.json";
import { reducer } from "./normalization";
import { Posts, Posts_ } from "./types";

/**
 * Blog Service
 */

const fetchPosts = (): Posts => {
  const result = Posts_.decode_(data);

  return pipe(
    result,
    Th.fold(
      (errors) => {
        console.warn(failure(errors));

        return [];
      },
      (posts) => posts,
      (errors, posts) => {
        console.warn(failure(errors));

        return posts;
      },
    ),
  );
};

const App: FC = () => {
  const posts: Posts = fetchPosts();

  return (
    <div className="split-screen">
      <div>
        <h2 className="title">API Response</h2>
        <pre>{JSON.stringify(posts, null, 2)}</pre>
      </div>
      <div>
        <h2 className="title">Normalized</h2>
        <pre>{JSON.stringify(reducer(posts), null, 2)}</pre>
      </div>
    </div>
  );
};

export default App;
