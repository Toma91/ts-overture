type ArrayWritableKeyPathForNullableArrayValue<Root extends object, NonNullableArrayValue> = NonNullableArrayValue extends any[] ? {
  [Index in IndexesOf<NonNullableArrayValue>]: KeyPath<Root, NonNullableArrayValue[Index] | null>
} & {
  length: WritableKeyPath<Root, number | null>
  [get]: KeyPathGetter<Root, NonNullableArrayValue | null>
  [set]: KeyPathSetter<Root, NonNullableArrayValue | null>
} : never

type ArrayWritableKeyPathForUndefineableArrayValue<Root extends object, NonUndefineableArrayValue> = NonUndefineableArrayValue extends any[] ? {
  [Index in IndexesOf<NonUndefineableArrayValue>]: KeyPath<Root, NonUndefineableArrayValue[Index] | undefined>
} & {
  length: WritableKeyPath<Root, number | undefined>
  [get]: KeyPathGetter<Root, NonUndefineableArrayValue | undefined>
  [set]: KeyPathSetter<Root, NonUndefineableArrayValue | undefined>
} : never

type ArrayWritableKeyPathForRealArrayValue<Root extends object, ArrayValue> = ArrayValue extends any[] ? {
  [Index in IndexesOf<ArrayValue>]: WritableKeyPath<Root, ArrayValue[Index]>
} & {
  length: WritableKeyPath<Root, number>
  [get]: KeyPathGetter<Root, ArrayValue>
  [set]: KeyPathSetter<Root, ArrayValue>
} : never

type ArrayWritableKeyPath<Root extends object, ArrayValue> = IfContainsNull<
  ArrayValue,
  ArrayWritableKeyPathForNullableArrayValue<Root, Exclude<ArrayValue, null>>,
  IfContainsUndefined<
    ArrayValue,
    ArrayWritableKeyPathForUndefineableArrayValue<Root, Exclude<ArrayValue, undefined>>,
    ArrayWritableKeyPathForRealArrayValue<Root, ArrayValue>
  >
>
