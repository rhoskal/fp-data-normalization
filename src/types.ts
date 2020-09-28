import * as E from "fp-ts/Either";
import * as t from "io-ts";

/**
 * Custom codecs
 */

// use Iso instead for new types??
const nonEmptyString = new t.Type<string, string, unknown>(
  "nonEmptyString",
  (input: unknown): input is string => typeof input === "string" && input.length > 0,
  (input, context) => (typeof input === "string" ? t.success(input) : t.failure(input, context)),
  t.identity,
);

const utcDateString = new t.Type<string, string, unknown>(
  "utcDateString",
  (input: unknown): input is string => typeof input === "string" && input.length > 0,
  (input, context) => (typeof input === "string" ? t.success(input) : t.failure(input, context)),
  t.identity,
);

const idString = new t.Type<string, string, unknown>(
  "idString",
  (input: unknown): input is string => typeof input === "string" && /[A-Za-z]{12}/g.test(input),
  (input, context) => (typeof input === "string" ? t.success(input) : t.failure(input, context)),
  t.identity,
);

/**
 * Composite types
 */

const Comment = t.type({
  id: idString,
  body: nonEmptyString,
});

const User = t.type({
  id: idString,
  handle: nonEmptyString,
  imgUrl: t.string,
});

// why do both Comment and Post pass when doing a decode? B/c the body have the same union set?
const Post = t.type({
  id: idString,
  title: nonEmptyString,
  body: nonEmptyString,
  createdAt: utcDateString,
  user: User,
  // comments: Comment,
  // status: "draft" | "draft" | "published"
});

/**
 * API types
 */

export type ApiComment = t.TypeOf<typeof Comment>;
export type ApiPost = t.TypeOf<typeof Post>;
export type ApiUser = t.TypeOf<typeof User>;

/**
 * Type guards
 */

export const isPost = (p: unknown): p is ApiPost => {
  return E.isRight(Post.decode(p));
};
