import { get, KeyPathGetter } from "./accessors"
import { IfContainsNull, IfContainsUndefined, IndexesOf } from "./helpers"
import { KeyPath } from "./readonly"

type ArrayKeyPathForNullableArrayValue<Root extends object, NonNullableArrayValue> = NonNullableArrayValue extends any[] ? {
  [Index in IndexesOf<NonNullableArrayValue>]: KeyPath<Root, NonNullableArrayValue[Index] | null>
} & {
  length: KeyPath<Root, number | null>
  [get]: KeyPathGetter<Root, NonNullableArrayValue | null>
} : never

type ArrayKeyPathForUndefineableArrayValue<Root extends object, NonUndefineableArrayValue> = NonUndefineableArrayValue extends any[] ? {
  [Index in IndexesOf<NonUndefineableArrayValue>]: KeyPath<Root, NonUndefineableArrayValue[Index] | undefined>
} & {
  length: KeyPath<Root, number | undefined>
  [get]: KeyPathGetter<Root, NonUndefineableArrayValue | undefined>
} : never

type ArrayKeyPathForRealArrayValue<Root extends object, ArrayValue> = ArrayValue extends any[] ? {
  [Index in IndexesOf<ArrayValue>]: KeyPath<Root, ArrayValue[Index]>
} & {
  length: KeyPath<Root, number>
  [get]: KeyPathGetter<Root, ArrayValue>
} : never

export type ArrayKeyPath<Root extends object, ArrayValue> = IfContainsNull<
  ArrayValue,
  ArrayKeyPathForNullableArrayValue<Root, Exclude<ArrayValue, null>>,
  IfContainsUndefined<
    ArrayValue,
    ArrayKeyPathForUndefineableArrayValue<Root, Exclude<ArrayValue, undefined>>,
    ArrayKeyPathForRealArrayValue<Root, ArrayValue>
  >
>
