type ObjectKeyPathForNullableValue<Root extends object, NonNullableValue> = {
  [K in keyof NonNullableValue as ExcludeFunction<NonNullableValue, K>]-?: KeyPath<Root, NonNullableValue[K] | null>
} & {
  [get]: KeyPathGetter<Root, NonNullableValue | null>
}

type ObjectKeyPathForUndefineableValue<Root extends object, NonUndefineableValue> = {
  [K in keyof NonUndefineableValue as ExcludeFunction<NonUndefineableValue, K>]-?: KeyPath<Root, NonUndefineableValue[K] | undefined>
} & {
  [get]: KeyPathGetter<Root, NonUndefineableValue | undefined>
}

type ObjectKeyPathForNonNullableValue<Root extends object, Value> = {
  [K in keyof Value as ExcludeFunction<Value, K>]-?: KeyPath<Root, Value[K]>
} & {
  [get]: KeyPathGetter<Root, Value>  
}

type ObjectKeyPath<Root extends object, Value> = IfContainsNull<
  Value,
  ObjectKeyPathForNullableValue<Root, Exclude<Value, null>>,
  IfContainsUndefined<
    Value,
    ObjectKeyPathForUndefineableValue<Root, Exclude<Value, undefined>>,
    ObjectKeyPathForNonNullableValue<Root, Value>
  >
>
