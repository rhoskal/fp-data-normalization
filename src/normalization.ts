import * as RA from "fp-ts/ReadonlyArray";
import * as O from "fp-ts/Option";
import * as RR from "fp-ts/ReadonlyRecord";
import * as Str from "fp-ts/string";
import { pipe } from "fp-ts/function";
import { Lens } from "monocle-ts";

import {
  Comment,
  Comments,
  Post,
  Posts,
  User,
  IdString,
  NonEmptyString,
  UtcDateString,
} from "./types";

/*
 * Types
 */

type CommentEntity = Readonly<{
  id: IdString;
  body: NonEmptyString;
  createdAt: UtcDateString;
  userId: IdString;
}>;

type PostEntity = Readonly<{
  id: IdString;
  body: NonEmptyString;
  comments: ReadonlyArray<IdString>;
  createdAt: UtcDateString;
  title: NonEmptyString;
  userId: IdString;
}>;

type UserEntity = Readonly<{
  id: IdString;
  handle: NonEmptyString;
  imgUrl: string;
}>;

type NormalizedComments = Readonly<Record<string, CommentEntity>>;

type NormalizedPosts = Readonly<Record<string, PostEntity>>;

type NormalizedUsers = Readonly<Record<string, UserEntity>>;

export type AppState = Readonly<{
  entities: {
    comments: NormalizedComments;
    posts: NormalizedPosts;
    users: NormalizedUsers;
  };
}>;

export const INITIAL_STATE: AppState = {
  entities: {
    comments: {},
    posts: {},
    users: {},
  },
};

/*
 * Optics
 */

const postsLens = Lens.fromPath<AppState>()(["entities", "posts"]);
const atPost = (id: IdString) => Lens.fromProp<NormalizedPosts>()(id);

const usersLens = Lens.fromPath<AppState>()(["entities", "users"]);
const atUser = (id: IdString) => Lens.fromProp<NormalizedUsers>()(id);

const commentsLens = Lens.fromPath<AppState>()(["entities", "comments"]);
const atComment = (id: IdString) => Lens.fromProp<NormalizedComments>()(id);

/*
 * Upserts
 */

const upsertComments =
  (postId: IdString, comments: Comments) =>
  (state: AppState): AppState => {
    return pipe(
      comments,
      RA.reduce<Comment, AppState>(state, (newState, comment) => {
        return pipe(
          newState,
          RR.lookup(comment.id),
          O.fold(
            () => {
              return pipe(
                newState,
                commentsLens.compose(atComment(comment.id)).set({
                  id: comment.id,
                  userId: comment.user.id,
                  body: comment.body,
                  createdAt: comment.createdAt,
                }),
                postsLens.compose(atPost(postId)).modify((prevPost) => ({
                  ...prevPost,
                  comments: RA.uniq(Str.Eq)(RA.append(comment.id)(prevPost.comments)),
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
          upsertUser(comment.user),
        );
      }),
    );
  };

const upsertUser =
  (user: User) =>
  (state: AppState): AppState => {
    return pipe(
      state,
      RR.lookup(user.id),
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

const upsertPost =
  (post: Post) =>
  (state: AppState): AppState => {
    return pipe(
      state,
      RR.lookup(post.id),
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
              comments: [],
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
      upsertUser(post.user),
      upsertComments(post.id, post.comments),
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
    RA.reduce<Post, AppState>(initialState, (state, p) => {
      return pipe(state, upsertPost(p));
    }),
  );
};
