type WritableKeyPath<Root extends object, Value> = true extends IsAny<Value>
  ? { [get]: KeyPathGetter<Root, Value>; [set]: KeyPathSetter<Root, Value> }
  : NonNullable<Value> extends never
    ? { [get]: KeyPathGetter<Root, Value>; [set]: KeyPathSetter<Root, Value> }
    : NonNullable<Value> extends any[]
      ? ArrayWritableKeyPath<Root, Value>
      : NonNullable<Value> extends object
        ? ObjectWritableKeyPath<Root, Value>
        : { [get]: KeyPathGetter<Root, Value>; [set]: KeyPathSetter<Root, Value> };
