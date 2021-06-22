import * as t from "io-ts";

/*
 * Type guards
 */

const isNonEmptyString = (input: unknown): input is string => {
  return typeof input === "string" && input.length > 0;
};

const isIdString = (input: unknown): input is string => {
  return typeof input === "string" && /[A-Za-z]{12}/g.test(input);
};

const isValidDateString = (input: unknown): input is string => {
  return typeof input === "string" && !isNaN(Date.parse(input));
};

/*
 * Custom codecs
 */

const NonEmptyString = new t.Type<string, string, unknown>(
  "nonEmptyString",
  isNonEmptyString,
  (input, context) => (isNonEmptyString(input) ? t.success(input) : t.failure(input, context)),
  t.identity,
);

const UtcDateString = new t.Type<string, string, unknown>(
  "utcDateString",
  isValidDateString,
  (input, context) => (isValidDateString(input) ? t.success(input) : t.failure(input, context)),
  t.identity,
);

const IdString = new t.Type<string, string, unknown>(
  "idString",
  isIdString,
  (input, context) => (isIdString(input) ? t.success(input) : t.failure(input, context)),
  t.identity,
);

/*
 * Composite types
 */

export const User = t.type({
  id: IdString,
  handle: NonEmptyString,
  imgUrl: t.string,
});

export const Comment = t.type({
  id: IdString,
  body: NonEmptyString,
  createdAt: UtcDateString,
  user: User,
});

export const Comments = t.array(Comment);

export const Post = t.type({
  id: IdString,
  title: NonEmptyString,
  body: NonEmptyString,
  createdAt: UtcDateString,
  user: User,
  comments: Comments,
});

export const Posts = t.array(Post);

/*
 * Static types
 */

export type Comment = t.TypeOf<typeof Comment>;
export type Comments = t.TypeOf<typeof Comments>;
export type Post = t.TypeOf<typeof Post>;
export type Posts = t.TypeOf<typeof Posts>;
export type User = t.TypeOf<typeof User>;
export type IdString = t.TypeOf<typeof IdString>;
export type NonEmptyString = t.TypeOf<typeof NonEmptyString>;
export type UtcDateString = t.TypeOf<typeof UtcDateString>;
