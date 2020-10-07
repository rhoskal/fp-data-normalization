import * as E from "fp-ts/lib/Either";
import * as Th from "fp-ts/lib/These";
import * as t from "io-ts";

export type ArrayC_<C extends t.Mixed> = ArrayType_<
  C,
  Array<t.TypeOf<C>>,
  Array<t.OutputOf<C>>,
  unknown
>;

export interface Decoder_<I, A> extends t.Decoder<I, A> {
  readonly validate_: Validate_<I, A>;
  readonly decode_: Decode_<I, A>;
}

export class Type_<A, O = A, I = unknown> extends t.Type<A, O, I> implements Decoder_<I, A> {
  constructor(
    /** a unique name for this codec */
    readonly name: string,
    /** a custom type guard */
    readonly is: t.Is<A>,
    /** succeeds if a value of type I can be decoded to a value of type A */
    readonly validate: t.Validate<I, A>,
    readonly validate_: Validate_<I, A>,
    /** converts a value of type A to a value of type O */
    readonly encode: t.Encode<A, O>,
  ) {
    super(name, is, validate, encode);
    this.decode = this.decode.bind(this);
    this.decode_ = this.decode_.bind(this);
  }
  decode_(i: I): Validation_<A> {
    return this.validate_(i, [{ key: "", type: this, actual: i }]);
  }
}

const pushAll = <A>(xs: Array<A>, ys: Array<A>): void => {
  const l = ys.length;
  for (let i = 0; i < l; i++) {
    xs.push(ys[i]);
  }
};

export const array_ = <C extends t.Mixed>(item: C, name = `Array<${item.name}>`): ArrayC_<C> =>
  new ArrayType_(
    name,
    (u): u is Array<t.TypeOf<C>> => t.UnknownArray.is(u) && u.every(item.is),
    (u, c) => {
      const e = t.UnknownArray.validate(u, c);
      if (E.isLeft(e)) {
        return e;
      }
      const us = e.right;
      const len = us.length;
      let as: Array<t.TypeOf<C>> = us;
      const errors: t.Errors = [];
      for (let i = 0; i < len; i++) {
        const ui = us[i];
        const result = item.validate(ui, t.appendContext(c, String(i), item, ui));
        if (E.isLeft(result)) {
          pushAll(errors, result.left);
        } else {
          const ai = result.right;
          if (ai !== ui) {
            if (as === us) {
              as = us.slice();
            }
            as[i] = ai;
          }
        }
      }
      return errors.length > 0 ? E.left(errors) : E.right(as);
    },
    // Validate using These
    (u, c) => {
      const e = t.UnknownArray.validate(u, c);
      // Validate that this is an array
      if (E.isLeft(e)) {
        return Th.left(e.left); // Could also do `return e`, since Either is a subtype of These
      }
      const us = e.right;
      const len = us.length;
      const as: Array<t.TypeOf<C>> = [];
      const errors: t.Errors = [];
      for (let i = 0; i < len; i++) {
        const ui = us[i];
        const result = item.validate(ui, t.appendContext(c, String(i), item, ui));
        if (E.isLeft(result)) {
          pushAll(errors, result.left);
        } else {
          const ai = result.right;
          as.push(ai);
        }
      }
      return errors.length === us.length
        ? Th.left(errors)
        : errors.length > 0
        ? Th.both(errors, as)
        : Th.right(as);
    },
    item.encode === t.identity ? t.identity : (a) => a.map(item.encode),
    item,
  );

export type Validation_<A> = Th.These<t.Errors, A>;

export type Validate_<I, A> = (i: I, context: t.Context) => Validation_<A>;
export type Decode_<I, A> = (i: I) => Validation_<A>;

export class ArrayType_<C extends t.Any, A = never, O = A, I = unknown> extends Type_<A, O, I> {
  /**
   * @since 1.0.0
   */
  readonly _tag: "ArrayType_" = "ArrayType_";
  constructor(
    name: string,
    is: ArrayType_<C, A, O, I>["is"],
    validate: ArrayType_<C, A, O, I>["validate"],
    validate_: ArrayType_<C, A, O, I>["validate_"],
    encode: ArrayType_<C, A, O, I>["encode"],
    readonly type: C,
  ) {
    super(name, is, validate, validate_, encode);
  }
}
