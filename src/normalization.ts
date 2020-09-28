import * as A from "fp-ts/Array";
import * as O from "fp-ts/Option";
import * as R from "fp-ts/Record";
import { pipe } from "fp-ts/pipeable";
import { Lens } from "monocle-ts";
import { atRecord } from "monocle-ts/lib/At";

import { ApiComment, ApiPost, ApiUser, isPost } from "./types";

/**
 * Types
 */

type CommentEntity = {
  authorId: string;
  body: string;
  createdAt: string;
};

type PostEntity = {
  authorId: string;
  body: string;
  createdAt: string;
  title: string;
};

type UserEntity = {
  handle: string;
  imgUrl: string;
};

type NormalizedComments = Record<string, CommentEntity>;

type NormalizedPosts = Record<string, PostEntity>;

type NormalizedUsers = Record<string, UserEntity>;

export type AppState = {
  entities: {
    comments: NormalizedComments;
    posts: NormalizedPosts;
    users: NormalizedUsers;
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
 * Optics
 */

const postsLens = Lens.fromPath<AppState>()(["entities", "posts"]);
const atPost = (id: string) => Lens.fromProp<NormalizedPosts>()(id);
// const atPost = () => atRecord<PostEntity>();

const usersLens = Lens.fromPath<AppState>()(["entities", "users"]);
const atUser = (id: string) => Lens.fromProp<NormalizedUsers>()(id);

const commentsLens = Lens.fromPath<AppState>()(["entities", "comments"]);
const atComment = (id: string) => Lens.fromProp<NormalizedComments>()(id);

/**
 * Upserts
 */

const upsertComment = (c: ApiComment) => (state: AppState) => {
  console.log("upserting comment: ", c);

  return pipe(
    state,
    commentsLens.compose(atComment(c.id)).modify(
      (prevComment): CommentEntity => ({
        ...prevComment,
        authorId: "some id",
        body: c.body,
        createdAt: "some date",
      }),
    ),
  );
};

const upsertUser = (u: ApiUser) => (state: AppState) => {
  console.log("upserting user: ", u);

  return pipe(
    state,
    usersLens.compose(atUser(u.id)).modify(
      (prevUser): UserEntity => ({
        ...prevUser,
        handle: u.handle,
        imgUrl: u.imgUrl,
      }),
    ),
  );
};

// can this fail? Yes if the post is not valid. Should this return an Either?
const upsertPost = (p: ApiPost) => (state: AppState) => {
  console.log("upserting post: ", p);

  // show the equivalent of doing this in normal JS
  return pipe(
    state,
    postsLens.compose(atPost(p.id)).modify(
      (prevPost): PostEntity => ({
        ...prevPost,
        authorId: p.user.id,
        body: p.body,
        createdAt: p.createdAt,
        title: p.title,
      }),
    ),
  );
};

/**
 * Reducer
 * @param initialState
 * @param data
 */

// compile time vs runtime data to see error handling
export const mkReducer = (initialState: AppState, data: Array<ApiPost>): AppState => {
  return pipe(
    data,
    A.reduce(initialState, (state, p) => {
      // should this logic be moved outside of the Domain Logic? Maybe a API service?
      if (isPost(p)) {
        return pipe(
          state,
          upsertPost(p),
          upsertUser(p.user),
          // upsertComment(p.comments)
        );
      } else {
        console.warn("Ignoring invalid post: ", p);

        return state;
      }
    }),
  );
};
