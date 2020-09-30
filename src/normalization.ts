import * as A from "fp-ts/Array";
import * as O from "fp-ts/Option";
import * as R from "fp-ts/Record";
import { eqString } from "fp-ts/lib/Eq";
import { pipe } from "fp-ts/pipeable";
import { Lens } from "monocle-ts";

import { Comment, Post, Posts } from "./types";

/**
 * Types
 */

type CommentEntity = {
  id: string;
  userId: string;
  body: string;
  createdAt: string;
};

type PostEntity = {
  id: string;
  userId: string;
  body: string;
  createdAt: string;
  title: string;
  comments: Array<string>;
};

type UserEntity = {
  id: string;
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

export const INITIAL_STATE: AppState = {
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

const upsertComment = (post: Post) => (state: AppState): AppState => {
  return pipe(
    post.comments,
    A.reduce<Comment, AppState>(state, (newState, comment) => {
      return pipe(
        newState,
        R.lookup(comment.id),
        O.fold(
          () => {
            return pipe(
              state,
              commentsLens.compose(atComment(comment.id)).set({
                id: comment.id,
                userId: comment.user.id,
                body: comment.body,
                createdAt: comment.createdAt,
              }),
              postsLens.compose(atPost(post.id)).modify((prevPost) => ({
                ...prevPost,
                comments: A.uniq(eqString)([...prevPost.comments, comment.id]),
              })),
            );
          },
          (_comment) => {
            return pipe(
              state,
              commentsLens.compose(atComment(comment.id)).modify(
                (prevComment): CommentEntity => ({
                  ...prevComment,
                  body: comment.body,
                }),
              ),
            );
          },
        ),
        upsertUser(post),
      );
    }),
  );
};

const upsertUser = (post: Post) => (state: AppState): AppState => {
  const user = post.user;

  return pipe(
    state,
    R.lookup(user.id),
    O.fold(
      () => {
        return pipe(
          state,
          usersLens.compose(atUser(user.id)).set({
            id: user.id,
            handle: user.handle,
            imgUrl: user.imgUrl,
          }),
        );
      },
      (_user) => {
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
      },
    ),
  );
};

const upsertPost = (post: Post) => (state: AppState): AppState => {
  return pipe(
    state,
    R.lookup(post.id),
    O.fold(
      () => {
        return pipe(
          state,
          postsLens.compose(atPost(post.id)).set({
            id: post.id,
            userId: post.user.id,
            body: post.body,
            createdAt: post.createdAt,
            title: post.title,
            comments: A.empty,
          }),
        );
      },
      (_post) => {
        return pipe(
          state,
          postsLens.compose(atPost(post.id)).modify(
            (prevPost): PostEntity => ({
              ...prevPost,
              body: post.body,
              title: post.title,
            }),
          ),
        );
      },
    ),
    upsertUser(post),
  );
};

/**
 * Reducer
 * @param data Posts to normalize
 * @param initialState
 */

export const reducer = (data: Posts, initialState = INITIAL_STATE): AppState => {
  return pipe(
    data,
    A.reduce<Post, AppState>(initialState, (state, p) => {
      return pipe(state, upsertPost(p), upsertComment(p));
    }),
  );
};
