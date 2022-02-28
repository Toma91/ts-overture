type KeyPath<Root extends object, Value> = true extends IsAny<Value>
  ? { [get]: KeyPathGetter<Root, Value> }
  : NonNullable<Value> extends never
    ? { [get]: KeyPathGetter<Root, Value> }
    : NonNullable<Value> extends any[]
      ? ArrayKeyPath<Root, Value>
      : NonNullable<Value> extends object
        ? ObjectKeyPath<Root, Value>
        : { [get]: KeyPathGetter<Root, Value> };
