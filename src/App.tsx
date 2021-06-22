import React from "react";
import { pipe } from "fp-ts/function";
import * as E from "fp-ts/Either";
import { PathReporter } from "io-ts/lib/PathReporter";

import data from "./data.json";
import { reducer } from "./normalization";
import { Posts } from "./types";

/*
 * Main
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

const App = (): JSX.Element => {
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
