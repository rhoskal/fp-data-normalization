import * as A from "fp-ts/Array";
import * as R from "fp-ts/Record";
import { pipe } from "fp-ts/pipeable";
import { Lens } from "monocle-ts";

import { Comment, Comments, Post, Posts, User } from "./types";

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

const upsertComment = (comments: Comments) => (state: AppState): AppState => {
  return pipe(
    comments,
    A.reduce<Comment, AppState>(state, (newState, comment) => {
      return pipe(
        newState,
        commentsLens.compose(atComment(comment.id)).modify(
          (prevComment): CommentEntity => ({
            ...prevComment,
            authorId: "some id",
            body: comment.body,
            createdAt: "some date",
          }),
        ),
      );
    }),
  );
};

const upsertUser = (user: User) => (state: AppState): AppState => {
  return pipe(
    state,
    usersLens.compose(atUser(user.id)).modify(
      (prevUser): UserEntity => ({
        ...prevUser,
        handle: user.handle,
        imgUrl: user.imgUrl,
      }),
    ),
  );
  // should users have a posts: [] of ids for reference? Check Redux normalization guide
};

const upsertPost = (post: Post) => (state: AppState): AppState => {
  return pipe(
    state,
    postsLens.compose(atPost(post.id)).modify(
      (prevPost): PostEntity => ({
        ...prevPost,
        authorId: post.user.id,
        body: post.body,
        createdAt: post.createdAt,
        title: post.title,
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

// how do we handle possible null values?
export const mkReducer = (initialState: AppState, data: Posts): AppState => {
  return pipe(
    data,
    A.reduce<Post, AppState>(initialState, (state, p) => {
      return pipe(state, upsertPost(p), upsertUser(p.user), upsertComment(p.comments));
    }),
  );
};
