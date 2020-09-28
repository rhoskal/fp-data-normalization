import * as t from "io-ts";

/**
 * Custom codecs
 */

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

const Post = t.type({
  id: idString,
  title: nonEmptyString,
  body: nonEmptyString,
  createdAt: utcDateString,
});

const User = t.type({
  id: idString,
  handle: nonEmptyString,
  imgUrl: t.string,
});

/**
 * API types
 */

export type Comment = t.TypeOf<typeof Comment>;
export type Post = t.TypeOf<typeof Post>;
export type User = t.TypeOf<typeof User>;
