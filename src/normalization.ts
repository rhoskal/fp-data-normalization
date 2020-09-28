import * as A from "fp-ts/Array";
import * as R from "fp-ts/Record";
import { pipe } from "fp-ts/pipeable";

import * as Api from "./types";

/**
 * Types
 */

type CommentEntity = Record<
  string,
  {
    body: string;
  }
>;
type PostEntity = Record<
  string,
  {
    title: string;
  }
>;
type UserEntity = Record<
  string,
  {
    handle: string;
  }
>;

export type AppState = {
  entities: {
    comments: Record<string, CommentEntity>;
    posts: Record<string, PostEntity>;
    users: Record<string, UserEntity>;
  };
};

export const INITIAL_STATE = {
  entities: {
    comments: R.empty,
    posts: R.empty,
    users: R.empty,
  },
};

/**
 * Reducer
 * @param initialState
 * @param data
 */

export const mkReducer = (initialState: AppState, data: Array<Api.Post>): AppState => {
  return pipe(
    data,
    A.reduce(initialState, (state, val) => {
      console.log("state: ", state);
      console.log("val: ", val);
      // return {
      //   entities: {
      //     comment: {},
      //     post: {},
      //     user: {},
      //   },
      // };
      return INITIAL_STATE;
    }),
  );
};
