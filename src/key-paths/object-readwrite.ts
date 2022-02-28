type ObjectWritableKeyPathForNullableValue<Root extends object, NonNullableValue> = {
  [K in keyof NonNullableValue as ExcludeFunction<NonNullableValue, K>]-?: KeyPath<Root, NonNullableValue[K] | null>
} & {
  [get]: KeyPathGetter<Root, NonNullableValue | null>
  [set]: KeyPathSetter<Root, NonNullableValue | null>
}

type ObjectWritableKeyPathForUndefineableValue<Root extends object, NonUndefineableValue> = {
  [K in keyof NonUndefineableValue as ExcludeFunction<NonUndefineableValue, K>]-?: KeyPath<Root, NonUndefineableValue[K] | undefined>
} & {
  [get]: KeyPathGetter<Root, NonUndefineableValue | undefined>
  [set]: KeyPathSetter<Root, NonUndefineableValue | undefined>
}

type ObjectWritableKeyPathForRealValue<Root extends object, Value> = {
  [K in keyof Value as ExcludeFunction<Value, K>]-?: K extends ReadonlyKeys<Value>
    ? KeyPath<Root, Value[K]>
    : WritableKeyPath<Root, Value[K]>
} & {
  [get]: KeyPathGetter<Root, Value>
  [set]: KeyPathSetter<Root, Value>
}

type ObjectWritableKeyPath<Root extends object, Value> = IfContainsNull<
  Value,
  ObjectWritableKeyPathForNullableValue<Root, Exclude<Value, null>>,
  IfContainsUndefined<
    Value,
    ObjectWritableKeyPathForUndefineableValue<Root, Exclude<Value, undefined>>,
    ObjectWritableKeyPathForRealValue<Root, Value>
  >
>
